import { Mistral } from "@mistralai/mistralai";

export const MISTRAL_CHAT_MODEL =
  process.env.MISTRAL_CHAT_MODEL ?? "mistral-small-latest";

export const MISTRAL_EMBED_MODEL =
  process.env.MISTRAL_EMBED_MODEL ?? "mistral-embed";

let client: Mistral | null = null;

export function getMistralClient() {
  if (!client) {
    const apiKey = process.env.MISTRAL_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY is missing. Add it to your .env file.");
    }
    client = new Mistral({ apiKey });
  }
  return client;
}
