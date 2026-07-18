import type { Project } from "@/types";

/** Static PDF in public/projects — works locally and on Vercel. */
export function publicProjectPdfUrl(slug: string) {
  return `/projects/${slug}.pdf`;
}

export function resolveProjectPdfUrl(project: Pick<Project, "slug" | "pdfUrl">) {
  if (project.pdfUrl?.startsWith("/projects/")) {
    return project.pdfUrl;
  }

  if (project.slug) {
    return publicProjectPdfUrl(project.slug);
  }

  return project.pdfUrl ?? publicProjectPdfUrl("flipkart-apm");
}

/** Static cover image in public/projects — works locally and on Vercel. */
export function publicProjectCoverUrl(slug: string) {
  return `/projects/${slug}.jpg`;
}

export function resolveProjectCoverUrl(
  project: Pick<Project, "slug" | "coverImageUrl">
) {
  if (project.coverImageUrl) {
    return project.coverImageUrl;
  }

  return project.slug ? publicProjectCoverUrl(project.slug) : null;
}
