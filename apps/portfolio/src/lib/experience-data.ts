export interface ExperienceItem {
  id: string;
  slug: string;
  company: string;
  role: string;
  location: string;
  /** Full range shown as one stop, e.g. "May 2025 – Jul 2025" */
  dates: string;
  overview: string;
  bullets: string[];
  /** Highlight phrases to bold in bullets (matched case-insensitively). */
  highlights?: string[];
  /** Original full-color company logo (right detail panel). */
  logoUrl: string;
  /** Theme-blended pencil sketch of the logo (left nav pills). */
  sketchLogoUrl: string;
  /** Background behind the original logo mark. */
  logoBg?: string;
  /** Wider logo frame for horizontal marks (e.g. BSE). */
  logoWide?: boolean;
  /** Side clip image shown beside the detail panel (changes with active company). */
  clipImageUrl: string;
  clipImageAlt?: string;
}

export interface CraftPolaroid {
  src: string;
  alt: string;
  rotate: number;
  caption: string;
}

/**
 * Homepage Experience section data.
 * Sources: resume PDF (BSE, Times, EMB, Unifly), user-provided (Aarya),
 * mockup + project context (Slikk).
 */
export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "bse",
    slug: "bombay-stock-exchange",
    company: "Bombay Stock Exchange",
    role: "Product Management and Data Modelling Intern",
    location: "Mumbai",
    dates: "May 2025 – Jul 2025",
    overview:
      "Built FreeFloat Marketcap Identification model using Excel, SQL and automated Sales Deck PDF generation",
    bullets: [
      "Boosted trade volume by INR 700 Cr/Day (+0.7%) by maximizing free float shares on BSE Indices (even Sensex)",
      "Reduced estimation time for SHP and freefloat MarketCap by 240x (80 days × 3 FTEs) with 4% more accuracy (99.5%)",
      "Enabled root-cause tracing for 150 yr old Methodology consulting with CEO to eliminate 400+ Equities freefloat error",
      "Automated PPT generation using SQL, HTML, CSS, JS for 101 index, saving 30 hrs/month, reducing 20% TAT",
    ],
    highlights: [
      "INR 700 Cr/Day",
      "+0.7%",
      "240x",
      "99.5%",
      "400+",
      "101 index",
      "30 hrs/month",
      "20% TAT",
    ],
    logoUrl: "/experience/logos/bse.png?v=3",
    sketchLogoUrl: "/experience/sketches/bse.jpg?v=2",
    logoBg: "#000000",
    logoWide: true,
    clipImageUrl: "/experience/craft/polaroid-notebook.jpg",
    clipImageAlt: "BSE work desk notes",
  },
  {
    id: "slikk",
    slug: "slikk-fashion",
    company: "Slikk Fashion",
    role: "Product Management Internship",
    location: "Bangalore",
    dates: "Mar 2026 – Jun 2026",
    overview:
      "Built AI-native pipelines, quick-commerce analytics, enhanced discovery, conversions and revamped App UX",
    bullets: [
      "Architected Image process pipeline for 150k+ Catalogue Images using Meta SAM & Custom ML Models, increasing PLP Consistency and reducing 70% data-driven action time",
      "Vibecoded Dashboards & PLP tools in Cursor with AI assist to surface catalog health and conversion levers for ops",
      "Amplified 6% CVR on fashion quick-commerce listing experiences through discovery and UX experiments",
    ],
    highlights: ["150k+", "Meta SAM", "70%", "Cursor", "6% CVR", "8%+ PLP CVR"],
    logoUrl: "/experience/logos/slikk.png",
    sketchLogoUrl: "/experience/sketches/slikk.jpg?v=2",
    logoBg: "#111111",
    clipImageUrl: "/experience/craft/polaroid-desk.jpg",
    clipImageAlt: "Slikk product workspace",
  },
  {
    id: "times",
    slug: "times-internet",
    company: "Times Internet",
    role: "Product Management Intern",
    location: "Noida",
    dates: "May 2024 – Aug 2024",
    overview:
      "Engineered & white-labelled modifications to Times Group CMS, project with Google to boost Ad Reach",
    bullets: [
      "Authored PRDs & prioritized via MoSCoW in Agile sprints to rollout 10+ features, 6+ feature gaps & directing UAT",
      "Documented 60+ CMS (serves 1.5Mn DAUs) features, prototyped 21 mockups in Figma, cutting demo time by 70%",
      "Leveraged CMS Page Builder feature to create user guide web module, saving nearly 3 weeks cost of dev/design team",
      "Partnered on Google-facing CMS workstreams to improve ad reach across Times Group properties",
    ],
    highlights: ["MoSCoW", "10+ features", "1.5Mn DAUs", "21 mockups", "70%", "3 weeks"],
    logoUrl: "/experience/logos/times.png",
    sketchLogoUrl: "/experience/sketches/times.jpg?v=2",
    logoBg: "#1A1E4E",
    clipImageUrl: "/experience/craft/polaroid-books.jpg",
    clipImageAlt: "Times Internet research notes",
  },
  {
    id: "emb",
    slug: "expand-my-business",
    company: "Expand My Business Global",
    role: "AI Product Management Intern",
    location: "Gurgaon",
    dates: "Sep 2024 – Dec 2024",
    overview:
      "Delivered EMB dashboard to unify client journey via call, mail & project tracker, boosting engagement",
    bullets: [
      "Accelerated sales efficiency by 10%, crafting a tailored Case Deck AI recommender, eliminating irrelevant new queries",
      "Built AI PRD Evaluator raising first draft acceptance from 55% to 75%, cutting rework and boosting productivity",
      "Unified fragmented flow over Zoho, Excel, and Calls by 60% leveraging API integrations and user journey mapping",
    ],
    highlights: ["10%", "55%", "75%", "60%", "Zoho"],
    logoUrl: "/experience/logos/emb.png",
    sketchLogoUrl: "/experience/sketches/emb.jpg?v=2",
    logoBg: "#FFFFFF",
    clipImageUrl: "/experience/craft/polaroid-craft.jpg",
    clipImageAlt: "EMB product craft board",
  },
  {
    id: "aarya",
    slug: "aarya-stays",
    company: "Aarya Stays",
    role: "Digital Infrastructure & Product Management Intern",
    location: "Mumbai",
    dates: "Jul 2023 – Jan 2024",
    overview:
      "Created Digital Infrastructure of a Homestay Chain from scratch owning product, design and tech",
    bullets: [
      "Designed high-fidelity wireframes (20+ flows) deepening brand story to boost OTA booking & organic revenue by 25%",
      "Benchmarked and integrated OTA Manager SAAS through product research and sales demo to save 50+ hrs/month",
      "Eliminated tech bottleneck developing no-code property listing hub & built checkin portal reducing 70% approval time",
    ],
    highlights: ["20+ flows", "25%", "50+ hrs/month", "70%"],
    logoUrl: "/experience/logos/aarya.png",
    sketchLogoUrl: "/experience/sketches/aarya.jpg?v=2",
    logoBg: "#FFFFFF",
    clipImageUrl: "/experience/craft/polaroid-notebook.jpg",
    clipImageAlt: "Aarya Stays planning sketches",
  },
  {
    id: "unifly",
    slug: "unifly-firms",
    company: "Unifly Firms",
    role: "Co-Founder",
    location: "Remote",
    dates: "Aug 2024 – Feb 2025",
    overview:
      "Founded IT-service marketplace enabling client–agency matches through bidding & vetting partners",
    bullets: [
      "Mapped TAM, SAM, SOM for $2B opportunity, conducted SWOT, formulated Business Plan and GTM strategy",
      "Onboarded 60+ agencies, closed 8 paid pilots delivering ERPs, WebApps, marketing services for client challenges",
      "Generated 300K GMV with 45K profit, grew client leads 35% MoM, and formed partnership for 12L annualised GMV",
    ],
    highlights: [
      "$2B",
      "60+ agencies",
      "8 paid pilots",
      "300K GMV",
      "45K profit",
      "35% MoM",
      "12L",
    ],
    logoUrl: "/experience/logos/unifly.png",
    sketchLogoUrl: "/experience/sketches/unifly.jpg?v=2",
    logoBg: "#FFFFFF",
    clipImageUrl: "/experience/craft/polaroid-desk.jpg",
    clipImageAlt: "Unifly founding workspace",
  },
];

export const DEFAULT_CRAFT_POLAROIDS: CraftPolaroid[] = [
  {
    src: "/experience/craft/polaroid-notebook.jpg",
    alt: "Notebook and pencil on a desk",
    rotate: -6,
    caption: "sketches",
  },
  {
    src: "/experience/craft/polaroid-desk.jpg",
    alt: "Creative product workspace",
    rotate: 5,
    caption: "build days",
  },
  {
    src: "/experience/craft/polaroid-books.jpg",
    alt: "Books and desk lamp",
    rotate: -3,
    caption: "late reads",
  },
  {
    src: "/experience/craft/polaroid-craft.jpg",
    alt: "Craft supplies and stickers",
    rotate: 7,
    caption: "make stuff",
  },
];
