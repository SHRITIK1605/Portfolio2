import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import PdfFrame from "@/components/project/PdfFrame";
import ProjectCarousel from "@/components/project/ProjectCarousel";
import {
  getHomepageSettings,
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/data";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { decodeSlugParam } from "@/lib/slug";
import { prisma } from "@portfolio/database";
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

    if (project) {
      await prisma.analyticsEvent
        .create({ data: { type: "PROJECT_VIEW", projectId: project.id } })
        .catch(() => {});
    }
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
        resumeUrl: homepage.resumeUrl,
        socialLinks: homepage.socialLinks as Record<string, string> | null,
      }
    : DEFAULT_HOMEPAGE;

  const pdfUrl = project.pdfUrl ?? "/demo/paytm.pdf";

  return (
    <div className="min-h-screen bg-cream pb-[48px]">
      <Navbar homepage={settings} />
      <main className="mx-auto max-w-[1100px] px-[48px] pt-[40px]">
        <h1 className="m-0 font-serif text-[48px] font-normal leading-[1.08] tracking-[-0.02em] text-forest">
          {project.title}
        </h1>

        <div className="mt-[20px] flex flex-nowrap items-center gap-[10px] overflow-x-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex shrink-0 items-center rounded-full bg-tag-blue px-[14px] py-[7px] text-[13px] font-medium text-forest"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-[24px] m-0 max-w-[900px] text-[15.5px] leading-[1.45] text-forest">
          <strong className="font-bold not-italic">Project Overview:</strong>{" "}
          <em>{project.longDescription}</em>
        </p>

        <div className="mt-[32px]">
          <PdfFrame url={pdfUrl} />
        </div>

        <ProjectCarousel projects={projects} activeSlug={project.slug} />
      </main>
      <ChatPanel projectId={project.id} projectTitle={project.title} />
    </div>
  );
}
