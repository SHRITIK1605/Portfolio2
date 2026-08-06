/**
 * Ingest CV GRILL.pdf into Neon RAG + refresh PromptSettings from prompts.ts.
 *
 * Usage (from repo root, with DATABASE_URL + MISTRAL_API_KEY set):
 *   npm run ingest:cv-grill
 */
import fs from "fs/promises";
import path from "path";
import { prisma } from "../src/index";
import { extractTextFromPdf, ingestDocument } from "@portfolio/ai";
import {
  PROJECT_ASSISTANT_PROMPT,
  RECRUITER_SYSTEM_PROMPT,
} from "./prompts";

const DOC_TITLE = "Shritik Jaiswal CV GRILL";
const FILE_NAME = "cv-grill.pdf";
const PDF_CANDIDATES = [
  path.join(__dirname, "knowledge", FILE_NAME),
  path.join(__dirname, "../../../uploads/knowledge", FILE_NAME),
];

async function resolvePdfPath(): Promise<string> {
  for (const candidate of PDF_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    `CV GRILL PDF not found. Expected one of:\n${PDF_CANDIDATES.join("\n")}`
  );
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
  console.log("✓ Prompt settings updated in DB");
}

async function ingestCvGrill() {
  const pdfPath = await resolvePdfPath();
  console.log(`Reading ${pdfPath}…`);
  const buffer = await fs.readFile(pdfPath);
  const text = await extractTextFromPdf(buffer);

  if (!text.trim()) {
    throw new Error(
      "CV GRILL has no extractable text (image-only PDF?). Add OCR text and re-run."
    );
  }

  console.log(`Extracted ${text.length} chars`);

  let doc = await prisma.document.findFirst({
    where: { fileName: FILE_NAME },
  });

  const uploadRel = `knowledge/${FILE_NAME}`;
  if (doc) {
    doc = await prisma.document.update({
      where: { id: doc.id },
      data: {
        title: DOC_TITLE,
        type: "RESUME",
        scope: "GLOBAL",
        fileUrl: `/api/uploads/${uploadRel}`,
        mimeType: "application/pdf",
        extractedText: text,
      },
    });
  } else {
    doc = await prisma.document.create({
      data: {
        title: DOC_TITLE,
        type: "RESUME",
        scope: "GLOBAL",
        fileUrl: `/api/uploads/${uploadRel}`,
        fileName: FILE_NAME,
        mimeType: "application/pdf",
        extractedText: text,
      },
    });
  }

  const result = await ingestDocument({
    documentId: doc.id,
    text,
    metadata: {
      source: "resume",
      title: DOC_TITLE,
      variant: "cv-grill",
    },
  });

  console.log(`✓ ${DOC_TITLE}: ${result.chunks} embedding chunks (doc ${doc.id})`);
  return { documentId: doc.id, chunks: result.chunks, textLen: text.length };
}

async function verify(documentId: string) {
  const count = await prisma.embedding.count({ where: { documentId } });
  const sample = await prisma.embedding.findMany({
    where: { documentId },
    orderBy: { chunkIndex: "asc" },
    take: 2,
    select: { chunkIndex: true, content: true },
  });
  console.log(`Verify: ${count} embeddings for document`);
  for (const row of sample) {
    const preview = row.content.replace(/\s+/g, " ").slice(0, 120);
    console.log(`  [${row.chunkIndex}] ${preview}…`);
  }
  return count;
}

async function main() {
  await updatePrompts();
  const { documentId, chunks } = await ingestCvGrill();
  const verified = await verify(documentId);
  if (verified !== chunks) {
    throw new Error(`Chunk mismatch: ingest=${chunks} db=${verified}`);
  }
  console.log("\nDone. Production chat can retrieve CV GRILL + updated prompts.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
