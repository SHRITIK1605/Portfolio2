import { prisma } from "@portfolio/database";
import { decodeSlugParam } from "./slug";
import { normalizeProject } from "./projects";

export async function getHomepageSettings() {
  return prisma.homepageSettings.findUnique({ where: { id: "homepage" } });
}

export async function getPublishedProjects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return projects.map(normalizeProject);
}

export async function getProjectBySlug(rawSlug: string) {
  const slug = decodeSlugParam(rawSlug);

  const project = await prisma.project.findFirst({
    where: { slug, published: true },
  });

  return project ? normalizeProject(project) : null;
}

export async function getSuggestedQuestions() {
  return prisma.suggestedQuestion.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}
