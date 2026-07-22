import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Experience from "@/components/home/Experience";
import ProjectCards from "@/components/home/ProjectCards";
import CreationsScroll from "@/components/home/CreationsScroll";
import ChatPanel from "@/components/chat/ChatPanel";
import LandingIntro from "@/components/home/LandingIntro";
import { getHomepageSettings, getPublishedProjects } from "@/lib/data";
import { getResumeUrlFromEnv } from "@/lib/env";
import { resolveProjectCoverUrl } from "@/lib/pdf";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import type { CraftPolaroid } from "@/lib/experience-data";
import type { HomepageSettings, Project } from "@/types";

export const dynamic = "force-dynamic";

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroHeading: "Hi, I'm Shritik.",
  heroSubtitle:
    "I build products by questioning what everyone else accepts as given.",
  aboutMe: null,
  resumeUrl: null,
  socialLinks: null,
};

function demoProjectsAsDb(): Project[] {
  return DEMO_PROJECTS.map((project, index) => ({
    id: project.id,
    title: project.name,
    slug: project.slug,
    shortDescription: project.overview[0] ?? "",
    longDescription: project.overview.join(" "),
    aiContext: null,
    coverImageUrl: null,
    pdfUrl: project.pdfUrl,
    pdfFileName: null,
    tags: project.tags,
    githubUrl: null,
    figmaUrl: null,
    priority: DEMO_PROJECTS.length - index,
    published: true,
  }));
}

export default async function HomePage() {
  let homepage = null;
  let projects: Project[] = [];

  try {
    [homepage, projects] = await Promise.all([
      getHomepageSettings(),
      getPublishedProjects(),
    ]);
  } catch (error) {
    console.error("Homepage DB error, using demo fallback:", error);
    projects = demoProjectsAsDb();
  }

  const settings: HomepageSettings = homepage
    ? {
        heroHeading: homepage.heroHeading,
        heroSubtitle: homepage.heroSubtitle,
        aboutMe: homepage.aboutMe,
        resumeUrl: homepage.resumeUrl ?? getResumeUrlFromEnv(),
        socialLinks: homepage.socialLinks as Record<string, string> | null,
      }
    : DEFAULT_HOMEPAGE;

  if (projects.length === 0) {
    projects = demoProjectsAsDb();
  }

  projects = projects
    .filter(
      (project) =>
        project.id !== "slikk" && project.slug !== "slikk-ai-catalog",
    )
    .map((project) => {
      const demo = DEMO_PROJECTS.find((d) => d.slug === project.slug);
      const enriched = demo
        ? {
            ...project,
            title: demo.name,
            shortDescription:
              (project.shortDescription?.length ?? 0) <
              (demo.overview[0]?.length ?? 0)
                ? (demo.overview[0] ?? project.shortDescription)
                : project.shortDescription,
          }
        : project;

      return {
        ...enriched,
        coverImageUrl: resolveProjectCoverUrl(enriched),
      };
    });

  const craftImages = Array.isArray(homepage?.craftImages)
    ? (homepage.craftImages as unknown as CraftPolaroid[])
    : null;

  return (
    <LandingIntro>
      <div className="min-h-screen bg-cream">
        <Navbar homepage={settings} />
        <main>
          <Hero homepage={settings} />
          <Experience craftImages={craftImages} />
          <CreationsScroll />
          <section
            id="selected-product-cases"
            className="relative mx-auto max-w-[1320px] scroll-mt-[28px] overflow-x-clip bg-cream px-[16px] pb-[64px] pt-[48px] sm:px-[28px] sm:pb-[80px] sm:pt-[56px] md:px-[36px] md:pb-[96px] lg:px-[40px]"
          >
            <h2
              id="selected-product-cases-heading"
              className="m-0 mb-[28px] text-[28px] font-bold tracking-[-0.02em] text-forest sm:mb-[32px] sm:text-[32px] md:mb-[40px] md:text-[36px]"
            >
              SELECTED PRODUCT CASES
            </h2>
            <ProjectCards projects={projects} />
          </section>
        </main>
        <ChatPanel />
      </div>
    </LandingIntro>
  );
}
