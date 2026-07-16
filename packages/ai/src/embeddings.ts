import { getMistralClient, MISTRAL_EMBED_MODEL } from "./mistral";

export async function embedText(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const vectors = await embedTexts([trimmed]);
  return vectors[0] ?? [];
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const indices: number[] = [];
  const inputs: string[] = [];

  texts.forEach((text, i) => {
    const trimmed = text.trim();
    if (trimmed) {
      indices.push(i);
      inputs.push(trimmed);
    }
  });

  const vectors: number[][] = texts.map(() => []);
  if (inputs.length === 0) return vectors;

  const client = getMistralClient();
  const result = await client.embeddings.create({
    model: MISTRAL_EMBED_MODEL,
    inputs,
  });

  result.data.forEach((entry, i) => {
    const originalIndex = indices[i];
    if (originalIndex !== undefined && entry.embedding) {
      vectors[originalIndex] = entry.embedding;
    }
  });

  return vectors;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
