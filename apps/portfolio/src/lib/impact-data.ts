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

export const DEMO_IMPACT_ITEMS: ImpactShowcaseItem[] = [
  {
    id: "showcase-1",
    title:
      "Slikk Aspect Ratio Fix — CV Pipeline Standardizing Fashion Catalog Thumbnails to 0.75",
    body: "Slikk’s fashion catalog images arrive from many vendors with inconsistent aspect ratios, backgrounds, framing, and positioning — hurting PLP scanability and trust. Built a two-stage computer-vision pipeline (product/background segmentation, safe crop, then background stretch) targeting a 0.75 container ratio, with hard constraints that keep the product mask immutable. MVP model fixes ~97% of images while cutting cropped/whitespace thumbnails that suppressed conversion.",
    tags: ["Computer Vision", "Catalog QA", "Aspect Ratio"],
    pdfUrl: "/impact/slikk-aspect-ratio-fix.pdf?v=3",
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
      "Automation & Analytical Enhancement of Free Float Factor & BSE Sector Rotation Index (BSRI)",
    body: "At BSE Index Services, automated Free Float Factor shareholder classification with an Excel–SQL rule engine (Promoter / Strategic / Doubtful / Public), cutting quarterly work from 20 days × 3 FTEs to 1 day × 1 FTE (~80× faster), eliminating 1–5% free-float errors on 300 of 4,800+ stocks, and supporting ~₹700 Cr daily trade-volume lift. Also automated branded sales PDFs across 101 indices — 90% less manual prep, 30+ hrs/month saved, and 20% faster client turnaround.",
    tags: ["Index Analytics", "Automation", "Free Float"],
    pdfUrl: "/impact/bse-intern-work.pdf?v=3",
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
      "EMB Global Client Dashboard — Projects, Commercials & Staff Augmentation Portal",
    body: "Designed and shipped EMB Global’s client-facing dashboard: landing feed with meetings and tasks, company/team/compliance profiles, project list & delivery views with milestones, account-level commercials (collaboration value, paid, outstanding), past-project deliverables, and staff-augmentation views covering attendance, leave, timesheets, and invoicing — so clients can track delivery, money, and resources in one place.",
    tags: ["Client Portal", "Dashboard UX", "Project Ops"],
    pdfUrl: "/impact/emb-client-dashboard.pdf?v=3",
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
      "Digital Infrastructure for Aarya Stays — OTA Booking, Listings & Check-in Portal",
    body: "Built digital infrastructure for a homestay chain from scratch across product, design, and tech: 20+ high-fidelity booking flows to deepen brand story and lift OTA/organic revenue, OTA Manager SaaS research and integration saving 50+ hrs/month, plus a no-code property listing hub and check-in portal that cut approval time by ~70%. Case PDF pending — TV preview will appear once the deck is attached.",
    tags: ["Homestay", "OTA", "Product Design"],
    pdfUrl: "",
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
