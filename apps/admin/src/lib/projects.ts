export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.filter((tag): tag is string => typeof tag === "string");
  }
  return [];
}
