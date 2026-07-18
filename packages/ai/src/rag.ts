import { prisma } from "@portfolio/database";
import { chunkText, extractTextFromPdf } from "./pdf";
import { cosineSimilarity, embedText, embedTexts } from "./embeddings";

export interface IngestDocumentOptions {
  documentId: string;
  /** PDF file contents; text is extracted with pdf-parse. */
  buffer?: Buffer;
  /** Pre-extracted text (e.g. OCR output for image-based PDFs). Takes precedence over buffer. */
  text?: string;
  projectId?: string | null;
  /** Labels stored on every embedding chunk (e.g. { source: "resume" }). */
  metadata?: Record<string, unknown>;
}

export async function ingestDocument({
  documentId,
  buffer,
  text: providedText,
  projectId,
  metadata,
}: IngestDocumentOptions) {
  const text =
    providedText?.trim() || (buffer ? await extractTextFromPdf(buffer) : "");
  const chunks = chunkText(text);

  await prisma.document.update({
    where: { id: documentId },
    data: { extractedText: text, projectId: projectId ?? undefined },
  });

  await prisma.embedding.deleteMany({ where: { documentId } });

  if (chunks.length === 0) return { chunks: 0 };

  const vectors = await embedTexts(chunks);

  await prisma.embedding.createMany({
    data: chunks.map((content, chunkIndex) => ({
      content,
      chunkIndex,
      metadata: { ...(metadata ?? {}), chunkIndex },
      vector: vectors[chunkIndex]?.length ? vectors[chunkIndex] : undefined,
      documentId,
      projectId: projectId ?? undefined,
    })),
  });

  return { chunks: chunks.length };
}

export async function ingestProjectContext(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project?.aiContext?.trim()) return { chunks: 0 };

  let doc = await prisma.document.findFirst({
    where: {
      projectId,
      type: "OTHER",
      fileName: "ai-context.txt",
    },
  });

  if (doc) {
    doc = await prisma.document.update({
      where: { id: doc.id },
      data: { extractedText: project.aiContext, title: `${project.title} — AI Context` },
    });
  } else {
    doc = await prisma.document.create({
      data: {
        title: `${project.title} — AI Context`,
        type: "OTHER",
        scope: "PROJECT",
        fileUrl: "",
        fileName: "ai-context.txt",
        mimeType: "text/plain",
        extractedText: project.aiContext,
        projectId,
      },
    });
  }

  const chunks = chunkText(project.aiContext, 800, 100);
  await prisma.embedding.deleteMany({ where: { documentId: doc.id } });

  if (chunks.length === 0) return { chunks: 0 };

  const vectors = await embedTexts(chunks);
  await prisma.embedding.createMany({
    data: chunks.map((content, chunkIndex) => ({
      content,
      chunkIndex,
      metadata: {
        chunkIndex,
        source: "project-notes",
        projectSlug: project.slug,
        title: project.title,
      },
      vector: vectors[chunkIndex]?.length ? vectors[chunkIndex] : undefined,
      documentId: doc.id,
      projectId,
    })),
  });

  return { chunks: chunks.length };
}

export interface RetrievedChunk {
  content: string;
  score: number;
  documentId: string;
  projectId: string | null;
  metadata?: unknown;
}

function vectorFromJson(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter((n): n is number => typeof n === "number");
}

async function vectorSearch(
  query: string,
  limit: number,
  projectId?: string | null
): Promise<RetrievedChunk[]> {
  const queryVector = await embedText(query);
  if (queryVector.length === 0) return [];

  const rows = await prisma.embedding.findMany({
    where: projectId ? { projectId } : undefined,
    select: {
      content: true,
      documentId: true,
      projectId: true,
      vector: true,
      metadata: true,
    },
    take: 500,
  });

  const scored = rows
    .map((row) => ({
      content: row.content,
      documentId: row.documentId,
      projectId: row.projectId,
      metadata: row.metadata,
      score: cosineSimilarity(queryVector, vectorFromJson(row.vector)),
    }))
    .filter((row) => row.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

async function keywordSearch(
  query: string,
  limit: number,
  projectId?: string | null
): Promise<RetrievedChunk[]> {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);

  if (terms.length === 0) return [];

  const pattern = `%${terms.join("%")}%`;
  const rows = projectId
    ? await prisma.$queryRaw<RetrievedChunk[]>`
        SELECT e."content", e."documentId", e."projectId", e."metadata", 0.4::float AS score
        FROM "Embedding" e
        WHERE e."projectId" = ${projectId}
          AND LOWER(e."content") LIKE ${pattern}
        LIMIT ${limit}
      `
    : await prisma.$queryRaw<RetrievedChunk[]>`
        SELECT e."content", e."documentId", e."projectId", e."metadata", 0.4::float AS score
        FROM "Embedding" e
        WHERE LOWER(e."content") LIKE ${pattern}
        LIMIT ${limit}
      `;

  return rows;
}

export async function searchEmbeddings(
  query: string,
  options: {
    projectId?: string | null;
    limit?: number;
    globalFallback?: boolean;
  } = {}
): Promise<RetrievedChunk[]> {
  const { projectId, limit = 6, globalFallback = true } = options;

  let results: RetrievedChunk[] = [];

  try {
    if (projectId) {
      results = await vectorSearch(query, limit, projectId);
    }
    if (results.length < limit && globalFallback) {
      const global = await vectorSearch(query, limit - results.length, null);
      const seen = new Set(results.map((r) => r.content));
      results = [...results, ...global.filter((r) => !seen.has(r.content))];
    }
    if (!projectId && results.length === 0) {
      results = await vectorSearch(query, limit);
    }
  } catch {
    results = [];
  }

  if (results.length < limit) {
    const fallback = await keywordSearch(
      query,
      limit - results.length,
      projectId ?? null
    );
    const seen = new Set(results.map((r) => r.content));
    results = [...results, ...fallback.filter((r) => !seen.has(r.content))];
  }

  return results.slice(0, limit);
}

function chunkLabel(chunk: RetrievedChunk): string {
  const meta = chunk.metadata as
    | { source?: string; title?: string; projectSlug?: string }
    | null
    | undefined;
  if (!meta?.source) return "";
  if (meta.source === "resume") return " — from my resume";
  const name = meta.title ?? meta.projectSlug;
  if (meta.source === "project-pdf") {
    return name ? ` — from project deck: ${name}` : " — from a project deck";
  }
  if (meta.source === "project-notes") {
    return name ? ` — from project notes: ${name}` : " — from project notes";
  }
  return ` — from ${meta.source}`;
}

export function buildContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "No relevant documents found in the knowledge base.";
  }

  return chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}${chunkLabel(chunk)}] (relevance: ${chunk.score.toFixed(2)})\n${chunk.content}`
    )
    .join("\n\n");
}
