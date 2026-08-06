/**
 * Sync IMPACT CREATED cards to Neon from packages/database/prisma/impact-data.ts defaults.
 * Run: node --env-file=.env scripts/sync-impact-items.mjs
 */
import { PrismaClient } from "@prisma/client";

const IMPACT_ITEMS = [
  {
    title:
      "Slikk Aspect Ratio Fix — CV Pipeline Standardizing Fashion Catalog Thumbnails to 0.75",
    body: "Slikk’s fashion catalog images arrive from many vendors with inconsistent aspect ratios, backgrounds, framing, and positioning — hurting PLP scanability and trust. Built a two-stage computer-vision pipeline (product/background segmentation, safe crop, then background stretch) targeting a 0.75 container ratio, with hard constraints that keep the product mask immutable. MVP fixes reached ~97% of images while cutting cropped/whitespace thumbnails that suppressed conversion.",
    tags: ["Computer Vision", "Catalog QA", "Aspect Ratio"],
    pdfUrl: "/impact/tv/slikk-aspect-ratio-fix.pdf?v=4",
    logoSrc: "/experience/logos/slikk.png",
    logoAlt: "Slikk",
    logoBg: "#000000",
    logoWide: false,
    themePanel: "#fdeba3",
    themeDot: "#e0b84a",
    themeSplash: "#e8b410",
    themeTag: "#f8f0d0",
    themeAccent: "#f0b800",
    order: 0,
  },
  {
    title:
      "Automation & Analytical Enhancement of Free Float Factor & BSE Sector Rotation Index (BSRI)",
    body: "At BSE Index Services, automated Free Float Factor shareholder classification with an Excel–SQL rule engine (Promoter / Strategic / Doubtful / Public), cutting quarterly work from 20 days × 3 FTEs to 1 day × 1 FTE (~80× faster), eliminating 1–5% free-float errors on 300 of 4,800+ stocks, and supporting ~₹700 Cr daily trade-volume lift. Also automated branded sales PDFs across 101 indices — 90% less manual prep, 30+ hrs/month saved, and 20% faster client turnaround.",
    tags: ["Index Analytics", "Automation", "Free Float"],
    pdfUrl: "/impact/tv/bse-intern-work.pdf?v=4",
    logoSrc: "/experience/logos/bse.png",
    logoAlt: "BSE",
    logoBg: "#ffffff",
    logoWide: true,
    themePanel: "#ddeff5",
    themeDot: "#5aa8c8",
    themeSplash: "#4fb0d8",
    themeTag: "#eef6fa",
    themeAccent: "#4aa3d4",
    order: 1,
  },
  {
    title:
      "EMB Global Client Dashboard — Projects, Commercials & Staff Augmentation Portal",
    body: "Designed and shipped EMB Global’s client-facing dashboard: landing feed with meetings and tasks, company/team/compliance profiles, project list & grid views with milestones, account-level commercials (collaboration value, paid, outstanding), past-project deliverables, and staff-augmentation views covering attendance, leave, timesheets, and invoicing — so clients can track delivery, money, and resources in one place.",
    tags: ["Client Portal", "Dashboard UX", "Project Ops"],
    pdfUrl: "/impact/tv/emb-client-dashboard.pdf?v=4",
    logoSrc: "/experience/logos/emb.png",
    logoAlt: "EMB Global",
    logoBg: "#ffffff",
    logoWide: false,
    themePanel: "#ecf5d4",
    themeDot: "#7aab4a",
    themeSplash: "#74c44a",
    themeTag: "#eef6e0",
    themeAccent: "#6fbf48",
    order: 2,
  },
  {
    title:
      "Digital Infrastructure for Aarya Stays — OTA Booking, Listings & Check-in Portal",
    body: "Built digital infrastructure for a homestay chain from scratch across product, design, and tech: 20+ high-fidelity booking flows to deepen brand story and lift OTA/organic revenue, OTA Manager SaaS research and integration saving 50+ hrs/month, plus a no-code property listing hub and check-in portal that cut approval time by ~70%. Case PDF pending — TV preview will appear once the deck is attached.",
    tags: ["Homestay", "OTA", "Product Design"],
    pdfUrl: null,
    logoSrc: "/experience/logos/aarya.png",
    logoAlt: "Aarya Stays",
    logoBg: "#ffffff",
    logoWide: false,
    themePanel: "#f5d4e4",
    themeDot: "#d478a0",
    themeSplash: "#e878a8",
    themeTag: "#f8e8f0",
    themeAccent: "#e878a8",
    order: 3,
  },
];

const prisma = new PrismaClient();

for (const item of IMPACT_ITEMS) {
  const existing = await prisma.impactItem.findFirst({
    where: { logoAlt: item.logoAlt },
  });
  if (existing) {
    await prisma.impactItem.update({
      where: { id: existing.id },
      data: { ...item, published: true },
    });
    console.log("updated", item.logoAlt, "order", item.order);
  } else {
    await prisma.impactItem.create({ data: { ...item, published: true } });
    console.log("created", item.logoAlt, "order", item.order);
  }
}

const items = await prisma.impactItem.findMany({
  where: { published: true },
  orderBy: { order: "asc" },
});
console.log(
  JSON.stringify(
    items.map((i) => ({
      order: i.order,
      logoAlt: i.logoAlt,
      title: i.title.slice(0, 80),
      pdfUrl: i.pdfUrl,
    })),
    null,
    2,
  ),
);
await prisma.$disconnect();
