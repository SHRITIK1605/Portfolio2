import fs from "fs/promises";
import path from "path";
import { prisma } from "../src/index";
import { ingestDocument, ingestProjectContext } from "@portfolio/ai";
import { PROJECTS } from "./projects-data";
import {
  PROJECT_ASSISTANT_PROMPT,
  RECRUITER_SYSTEM_PROMPT,
} from "./prompts";

const REPO_ROOT = path.resolve(__dirname, "../../..");
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(REPO_ROOT, "uploads");
const PROJECTS_DIR = path.join(UPLOAD_DIR, "projects");

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

    for (const doc of project.documents) {
      const relativePath = doc.fileUrl.replace(/^.*\/api\/uploads\//, "");
      const filePath = path.join(UPLOAD_DIR, relativePath);

      try {
        const buffer = await fs.readFile(filePath);
        const result = await ingestDocument({
          documentId: doc.id,
          buffer,
          projectId: project.id,
        });
        pdfChunks += result.chunks;
      } catch (err) {
        console.warn(`  ⚠ PDF ingest failed for ${project.slug}:`, err);
      }
    }

    const contextResult = await ingestProjectContext(project.id);
    console.log(
      `  ✓ ${project.slug}: ${pdfChunks} PDF chunks + ${contextResult.chunks} context chunks`
    );
  }
}

async function main() {
  await seedProjects();
  await updatePrompts();
  await ingestAllProjects();
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
