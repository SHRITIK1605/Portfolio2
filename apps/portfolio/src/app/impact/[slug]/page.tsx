import { notFound } from "next/navigation";
import ImpactPageShell from "@/components/impact/ImpactPageShell";
import { getHomepageSettings, getPublishedImpactItems } from "@/lib/data";
import { getResumeUrlFromEnv } from "@/lib/env";
import {
  DEMO_IMPACT_ITEMS,
  type ImpactDetailItem,
  toImpactDetailItems,
} from "@/lib/impact-data";
import { toFullImpactPdfUrl } from "@/lib/tv-pdf";
import { decodeSlugParam, impactSlugFromLogoAlt } from "@/lib/slug";
import type { HomepageSettings, ImpactItem } from "@/types";

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

function dbItemsToDetail(items: ImpactItem[]): ImpactDetailItem[] {
  return items.map((item) => ({
    id: item.id,
    slug: impactSlugFromLogoAlt(item.logoAlt),
    title: item.title,
    body: item.body,
    tags: item.tags,
    // Prefer full-resolution deck on the detail page (TV previews stay on homepage).
    pdfUrl: toFullImpactPdfUrl(item.pdfUrl),
    label: item.logoAlt,
  }));
}

function demoDetailItems(): ImpactDetailItem[] {
  return toImpactDetailItems(DEMO_IMPACT_ITEMS).map((item) => ({
    ...item,
    pdfUrl: toFullImpactPdfUrl(item.pdfUrl),
  }));
}

export default async function ImpactDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);

  // Static PDF assets live under /impact/*.pdf — never treat those as detail pages.
  if (slug.includes(".")) notFound();

  let items: ImpactDetailItem[] = [];
  let homepage = null;

  try {
    const [impactResult, homepageResult] = await Promise.all([
      getPublishedImpactItems(),
      getHomepageSettings(),
    ]);
    homepage = homepageResult;
    items = dbItemsToDetail(impactResult);
  } catch (error) {
    console.error("Impact detail page DB error, using demo fallback:", error);
    items = demoDetailItems();
  }

  if (items.length === 0) {
    items = demoDetailItems();
  }

  const active = items.find((item) => item.slug === slug);
  if (!active) notFound();

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
    <ImpactPageShell
      items={items}
      initialSlug={active.slug}
      homepage={settings}
    />
  );
}
