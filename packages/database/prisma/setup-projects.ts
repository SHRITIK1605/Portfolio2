import fs from "fs/promises";
import path from "path";
import { prisma } from "../src/index";
import { extractTextFromPdf, ingestDocument, ingestProjectContext } from "@portfolio/ai";
import { PROJECTS } from "./projects-data";
import {
  DEFAULT_RESUME_URL,
  PROJECT_ASSISTANT_PROMPT,
  RECRUITER_SYSTEM_PROMPT,
} from "./prompts";

const REPO_ROOT = path.resolve(__dirname, "../../..");
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(REPO_ROOT, "uploads");
const PROJECTS_DIR = path.join(UPLOAD_DIR, "projects");
// OCR transcripts for image-based decks (no extractable PDF text).
const OCR_DIR = path.join(__dirname, "ocr");

async function readOcrText(slug: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(path.join(OCR_DIR, `${slug}.txt`), "utf8");
    return raw.trim() || null;
  } catch {
    return null;
  }
}

async function copyProjectPdf(project: (typeof PROJECTS)[number]) {
  const destName = `${project.slug}.pdf`;
  const destPath = path.join(PROJECTS_DIR, destName);

  try {
    await fs.access(project.sourcePdf);
  } catch {
    console.warn(`  ⚠ Source PDF missing: ${project.sourcePdf}`);
    return null;
  }

  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  await fs.copyFile(project.sourcePdf, destPath);

  const publicProjectsDir = path.join(REPO_ROOT, "apps/portfolio/public/projects");
  await fs.mkdir(publicProjectsDir, { recursive: true });
  await fs.copyFile(project.sourcePdf, path.join(publicProjectsDir, destName));

  return {
    destName,
    pdfUrl: `/projects/${destName}`,
  };
}

async function seedProjects() {
  console.log("Seeding projects…");

  for (const project of PROJECTS) {
    const copied = await copyProjectPdf(project);
    const pdfUrl = copied?.pdfUrl ?? null;
    const pdfFileName = copied?.destName ?? project.pdfFileName;
    const coverImageUrl = `/projects/${project.slug}.jpg`;

    const saved = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        aiContext: project.aiContext,
        tags: project.tags,
        priority: project.priority,
        published: project.published,
        pdfUrl,
        pdfFileName,
        coverImageUrl,
      },
      create: {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        aiContext: project.aiContext,
        tags: project.tags,
        priority: project.priority,
        published: project.published,
        pdfUrl,
        pdfFileName,
        coverImageUrl,
      },
    });

    if (pdfUrl) {
      const existingDoc = await prisma.document.findFirst({
        where: { projectId: saved.id, type: "PROJECT_PDF" },
      });

      if (existingDoc) {
        await prisma.document.update({
          where: { id: existingDoc.id },
          data: {
            title: project.title,
            fileUrl: pdfUrl,
            fileName: pdfFileName,
          },
        });
      } else {
        await prisma.document.create({
          data: {
            title: project.title,
            type: "PROJECT_PDF",
            scope: "PROJECT",
            fileUrl: pdfUrl,
            fileName: pdfFileName,
            projectId: saved.id,
          },
        });
      }
    }

    console.log(`  ✓ ${project.title} (${project.slug})`);
  }

  // Unpublish removed legacy projects
  const validSlugs = new Set(PROJECTS.map((p) => p.slug));
  const legacy = await prisma.project.findMany({
    where: { slug: { notIn: [...validSlugs] } },
  });
  for (const old of legacy) {
    await prisma.project.update({
      where: { id: old.id },
      data: { published: false },
    });
    console.log(`  – Unpublished legacy project: ${old.slug}`);
  }
}

async function updatePrompts() {
  await prisma.promptSettings.upsert({
    where: { id: "default" },
    update: {
      systemPrompt: RECRUITER_SYSTEM_PROMPT,
      projectPrompt: PROJECT_ASSISTANT_PROMPT,
    },
    create: {
      id: "default",
      systemPrompt: RECRUITER_SYSTEM_PROMPT,
      projectPrompt: PROJECT_ASSISTANT_PROMPT,
    },
  });
  console.log("✓ Prompt settings updated");
}

async function ingestAllProjects() {
  console.log("Ingesting RAG embeddings…");

  const projects = await prisma.project.findMany({
    where: { published: true },
    include: { documents: { where: { type: "PROJECT_PDF" } } },
  });

  for (const project of projects) {
    let pdfChunks = 0;
    const ocrText = await readOcrText(project.slug);

    for (const doc of project.documents) {
      const relativePath = doc.fileUrl.replace(/^.*\/api\/uploads\//, "");
      const filePath = path.join(UPLOAD_DIR, relativePath);

      try {
        const buffer = await fs.readFile(filePath).catch(() => undefined);
        if (!buffer && !ocrText) throw new Error(`missing file: ${filePath}`);
        const result = await ingestDocument({
          documentId: doc.id,
          buffer,
          text: ocrText ?? undefined,
          projectId: project.id,
          metadata: {
            source: "project-pdf",
            projectSlug: project.slug,
            title: project.title,
          },
        });
        pdfChunks += result.chunks;
      } catch (err) {
        console.warn(`  ⚠ PDF ingest failed for ${project.slug}:`, err);
      }
    }

    const contextResult = await ingestProjectContext(project.id);
    console.log(
      `  ✓ ${project.slug}: ${pdfChunks} PDF chunks + ${contextResult.chunks} context chunks${ocrText ? " (OCR)" : ""}`
    );
  }
}

function driveDownloadUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  return match
    ? `https://drive.google.com/uc?export=download&id=${match[1]}`
    : url;
}

async function ingestResume() {
  const resumeUrl = process.env.RESUME_URL ?? DEFAULT_RESUME_URL;

  let text = "";
  try {
    const res = await fetch(driveDownloadUrl(resumeUrl), { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    text = await extractTextFromPdf(buffer);
  } catch (err) {
    console.warn("  ⚠ Resume download/extract failed:", err);
    return;
  }

  if (!text.trim()) {
    console.warn("  ⚠ Resume has no extractable text; skipping");
    return;
  }

  let doc = await prisma.document.findFirst({ where: { type: "RESUME" } });
  if (doc) {
    doc = await prisma.document.update({
      where: { id: doc.id },
      data: { title: "Shritik Jaiswal Resume", extractedText: text },
    });
  } else {
    doc = await prisma.document.create({
      data: {
        title: "Shritik Jaiswal Resume",
        type: "RESUME",
        scope: "GLOBAL",
        fileUrl: "",
        fileName: "resume.pdf",
        extractedText: text,
      },
    });
  }

  const result = await ingestDocument({
    documentId: doc.id,
    text,
    metadata: { source: "resume", title: "Shritik Jaiswal Resume" },
  });
  console.log(`  ✓ resume: ${result.chunks} chunks`);
}

async function main() {
  await seedProjects();
  await updatePrompts();
  await ingestAllProjects();
  console.log("Ingesting resume…");
  await ingestResume();
  console.log("\nSetup complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
