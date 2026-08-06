import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Experience from "@/components/home/Experience";
import ProjectCards from "@/components/home/ProjectCards";
import CreationsScroll from "@/components/home/CreationsScroll";
import ChatPanel from "@/components/chat/ChatPanel";
import LandingIntro from "@/components/home/LandingIntro";
import { getHomepageSettings, getPublishedImpactItems, getPublishedProjects } from "@/lib/data";
import { getResumeUrlFromEnv } from "@/lib/env";
import { resolveProjectCoverUrl } from "@/lib/pdf";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import {
  DEMO_IMPACT_ITEMS,
  type ImpactShowcaseItem,
} from "@/lib/impact-data";
import type { CraftPolaroid } from "@/lib/experience-data";
import type { HomepageSettings, ImpactItem, Project } from "@/types";

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

function toImpactShowcase(items: ImpactItem[]): ImpactShowcaseItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    tags: item.tags,
    pdfUrl: item.pdfUrl ?? "",
    detailUrl: item.detailUrl,
    logo: {
      src: item.logoSrc,
      bg: item.logoBg,
      alt: item.logoAlt,
      wide: item.logoWide || undefined,
    },
    theme: {
      panel: item.themePanel,
      dot: item.themeDot,
      splash: item.themeSplash,
      tag: item.themeTag,
      accent: item.themeAccent,
    },
  }));
}

export default async function HomePage() {
  let homepage = null;
  let projects: Project[] = [];
  let impactItems: ImpactShowcaseItem[] = [];

  try {
    const [homepageResult, projectsResult, impactResult] = await Promise.all([
      getHomepageSettings(),
      getPublishedProjects(),
      getPublishedImpactItems(),
    ]);
    homepage = homepageResult;
    projects = projectsResult;
    impactItems = toImpactShowcase(impactResult);
  } catch (error) {
    console.error("Homepage DB error, using demo fallback:", error);
    projects = demoProjectsAsDb();
    impactItems = DEMO_IMPACT_ITEMS;
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

  if (impactItems.length === 0) {
    impactItems = DEMO_IMPACT_ITEMS;
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
          <CreationsScroll items={impactItems} />
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
        <Footer homepage={settings} />
        <ChatPanel />
      </div>
    </LandingIntro>
  );
}
