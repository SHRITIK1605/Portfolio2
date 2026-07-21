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

  projects = projects.map((project) => ({
    ...project,
    coverImageUrl: resolveProjectCoverUrl(project),
  }));

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
            className="mx-auto max-w-[1100px] scroll-mt-[24px] px-[20px] pb-[64px] pt-[48px] sm:px-[32px] sm:pb-[80px] sm:pt-[56px] md:px-[48px] md:pb-[96px]"
          >
            <h2 className="m-0 mb-[20px] text-[22px] font-bold leading-tight tracking-[-0.02em] text-forest sm:mb-[28px] sm:text-[24px] md:mb-[32px] md:text-[26px]">
              Selected Product Cases
            </h2>
            <ProjectCards projects={projects} />
          </section>
        </main>
        <ChatPanel />
      </div>
    </LandingIntro>
  );
}
