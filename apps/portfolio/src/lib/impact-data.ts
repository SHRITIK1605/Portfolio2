import { impactPath, impactSlugFromLogoAlt } from "@/lib/slug";

/** Demo IMPACT CREATED items — used when DB is empty or unavailable. */
export type ImpactShowcaseItem = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  pdfUrl: string;
  detailUrl?: string | null;
  logo: {
    src: string;
    bg: string;
    alt: string;
    wide?: boolean;
  };
  theme: {
    panel: string;
    dot: string;
    splash: string;
    tag: string;
    accent: string;
  };
};

/** Detail-page shape (mirrors project case study pages). */
export type ImpactDetailItem = {
  id: string;
  slug: string;
  title: string;
  body: string;
  tags: string[];
  /** Full-resolution deck URL for PdfFrame; empty when pending. */
  pdfUrl: string;
  /** Short nav label (company name). */
  label: string;
};

export function impactDetailPathFromLogoAlt(logoAlt: string): string {
  return impactPath(impactSlugFromLogoAlt(logoAlt));
}

export function resolveImpactDetailUrl(
  logoAlt: string,
  detailUrl?: string | null,
): string {
  const fromDb = detailUrl?.trim();
  if (fromDb && fromDb !== "#") return fromDb;
  return impactDetailPathFromLogoAlt(logoAlt);
}

export const DEMO_IMPACT_ITEMS: ImpactShowcaseItem[] = [
  {
    id: "showcase-1",
    title:
      "Fixed ~97% of fashion thumbnails to 0.75: CV pipeline for 150k+ listings",
    body: "Drove 8%+ PLP CVR by auto-fixing vendor aspect ratios, framing, and whitespace that broke catalog trust. Built and refined the AI image processing pipeline in Cursor: a two-stage CV flow (HF fashion parser + Meta SAM → safe crop → BG stretch) that keeps the product mask immutable while hitting a 0.75 container ratio.",
    tags: ["Computer Vision", "Catalog QA", "Aspect Ratio"],
    pdfUrl: "/impact/tv/slikk-aspect-ratio-fix.pdf?v=5",
    detailUrl: impactDetailPathFromLogoAlt("Slikk"),
    logo: {
      src: "/experience/logos/slikk.png",
      bg: "#000000",
      alt: "Slikk",
    },
    theme: {
      panel: "#fdeba3",
      dot: "#e0b84a",
      splash: "#e8b410",
      tag: "#f8f0d0",
      accent: "#f0b800",
    },
  },
  {
    id: "showcase-2",
    title:
      "₹700 Cr/day (+0.7%) liquidity lift: Free Float automation 80× faster",
    body: "Cut quarterly FFF work from 20 days × 3 FTEs to 1 day × 1 FTE with an Excel–SQL rule engine, eliminating 1–5% free-float errors on 300 of 4,800+ stocks. Also automated branded sales PDFs across 101 indices: 90% less prep, 30+ hrs/month saved, 20% faster client TAT.",
    tags: ["Index Analytics", "Automation", "Free Float"],
    pdfUrl: "/impact/tv/bse-intern-work.pdf?v=4",
    detailUrl: impactDetailPathFromLogoAlt("BSE"),
    logo: {
      src: "/experience/logos/bse.png",
      bg: "#ffffff",
      alt: "BSE",
      wide: true,
    },
    theme: {
      panel: "#ddeff5",
      dot: "#5aa8c8",
      splash: "#4fb0d8",
      tag: "#eef6fa",
      accent: "#4aa3d4",
    },
  },
  {
    id: "showcase-3",
    title:
      "Unified Zoho–Excel–calls into one client dashboard (+40% feature adoption)",
    body: "Shipped EMB’s client portal for projects, commercials, and staff augmentation so clients track delivery, money, and resources in one place. API integrations collapsed fragmented journeys across Zoho, Excel, and calls, lifting adoption 40%.",
    tags: ["Client Portal", "Dashboard UX", "Project Ops"],
    pdfUrl: "/impact/tv/emb-client-dashboard.pdf?v=4",
    detailUrl: impactDetailPathFromLogoAlt("EMB Global"),
    logo: {
      src: "/experience/logos/emb.png",
      bg: "#ffffff",
      alt: "EMB Global",
    },
    theme: {
      panel: "#ecf5d4",
      dot: "#7aab4a",
      splash: "#74c44a",
      tag: "#eef6e0",
      accent: "#6fbf48",
    },
  },
  {
    id: "showcase-4",
    title:
      "Boosted OTA & organic bookings 25% with 20+ flows + OTA Manager SaaS",
    body: "Designed 20+ high-fidelity booking flows to deepen brand story and lift OTA/organic revenue, and integrated OTA Manager SaaS to save 50+ hrs/month. Built a no-code listing hub and guest check-in portal that cut approval time ~70%.",
    tags: ["Homestay", "OTA", "Product Design"],
    pdfUrl: "/impact/aarya-stays-website-checkin.pdf",
    detailUrl: impactDetailPathFromLogoAlt("Aarya Stays"),
    logo: {
      src: "/experience/logos/aarya.png",
      bg: "#ffffff",
      alt: "Aarya Stays",
    },
    theme: {
      panel: "#f5d4e4",
      dot: "#d478a0",
      splash: "#e878a8",
      tag: "#f8e8f0",
      accent: "#e878a8",
    },
  },
];

export function toImpactDetailItems(
  items: ImpactShowcaseItem[],
): ImpactDetailItem[] {
  return items.map((item) => ({
    id: item.id,
    slug: impactSlugFromLogoAlt(item.logo.alt),
    title: item.title,
    body: item.body,
    tags: item.tags,
    pdfUrl: item.pdfUrl,
    label: item.logo.alt,
  }));
}
