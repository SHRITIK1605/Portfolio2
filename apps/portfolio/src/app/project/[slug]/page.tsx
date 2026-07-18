import { notFound } from "next/navigation";
import ProjectPageShell from "@/components/project/ProjectPageShell";
import {
  getHomepageSettings,
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/data";
import { getResumeUrlFromEnv } from "@/lib/env";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { decodeSlugParam } from "@/lib/slug";
import type { HomepageSettings, Project } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroHeading: "Hi, I'm Shritik.",
  heroSubtitle: "",
  aboutMe: null,
  resumeUrl: null,
  socialLinks: null,
};

function demoProject(slug: string): Project | null {
  const demo = DEMO_PROJECTS.find((item) => item.slug === slug);
  if (!demo) return null;
  return {
    id: demo.id,
    title: demo.name,
    slug: demo.slug,
    shortDescription: demo.overview[0] ?? "",
    longDescription: demo.overview.join(" "),
    aiContext: null,
    coverImageUrl: null,
    pdfUrl: demo.pdfUrl,
    pdfFileName: null,
    tags: demo.tags,
    githubUrl: null,
    figmaUrl: null,
    priority: 0,
    published: true,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);

  let project: Project | null = null;
  let projects: Project[] = [];
  let homepage = null;

  try {
    [project, projects, homepage] = await Promise.all([
      getProjectBySlug(slug),
      getPublishedProjects(),
      getHomepageSettings(),
    ]);
  } catch (error) {
    console.error("Project page DB error, using demo fallback:", error);
    project = demoProject(slug);
    projects = DEMO_PROJECTS.map((item, index) => ({
      id: item.id,
      title: item.name,
      slug: item.slug,
      shortDescription: item.overview[0] ?? "",
      longDescription: item.overview.join(" "),
      aiContext: null,
      coverImageUrl: null,
      pdfUrl: item.pdfUrl,
      pdfFileName: null,
      tags: item.tags,
      githubUrl: null,
      figmaUrl: null,
      priority: DEMO_PROJECTS.length - index,
      published: true,
    }));
  }

  if (!project) notFound();

  const settings: HomepageSettings = homepage
    ? {
        heroHeading: homepage.heroHeading,
        heroSubtitle: homepage.heroSubtitle,
        aboutMe: homepage.aboutMe,
        resumeUrl: homepage.resumeUrl ?? getResumeUrlFromEnv(),
        socialLinks: homepage.socialLinks as Record<string, string> | null,
      }
    : DEFAULT_HOMEPAGE;

  return (
    <ProjectPageShell
      projects={projects}
      initialSlug={project.slug}
      homepage={settings}
    />
  );
}
