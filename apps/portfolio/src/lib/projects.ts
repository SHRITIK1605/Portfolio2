import type { Project as DbProject } from "@portfolio/database";
import type { Project } from "@/types";

export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.filter((tag): tag is string => typeof tag === "string");
  }
  return [];
}

export function normalizeProject(project: DbProject): Project {
  return {
    ...project,
    tags: parseTags(project.tags),
  };
}
