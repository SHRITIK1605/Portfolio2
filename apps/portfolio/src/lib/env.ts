export function getResumeUrlFromEnv(): string | null {
  const url = process.env.RESUME_URL?.trim() || process.env.Resume?.trim();
  return url || null;
}
