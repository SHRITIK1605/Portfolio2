export interface ProjectSeedData {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  aiContext: string;
  tags: string[];
  priority: number;
  published: boolean;
  pdfFileName: string;
  sourcePdf: string;
}

export const PROJECTS: ProjectSeedData[] = [
  {
    title: "Slikk AI Catalog",
    slug: "slikk-ai-catalog",
    shortDescription:
      "AI-powered image standardization for fashion quick-commerce product listings — fixing aspect ratio inconsistency at catalog scale.",
    longDescription:
      "Slikk operates in fashion quick commerce, where product listing pages live or die on visual consistency. Shritik built an AI-driven pipeline to detect and normalize inconsistent product image aspect ratios across the catalog — reducing visual clutter on PLPs, improving scanability, and making listings feel trustworthy at scroll speed. The work spans computer-vision classification, batch processing workflows, and product decisions around where automation should override manual QA.",
    aiContext: `Slikk AI Catalog — Aspect Ratio Fix for Fashion Quick Commerce

Problem: Product listing pages showed inconsistent image aspect ratios — some portrait, some landscape, some cropped awkwardly. This broke visual rhythm on PLPs, reduced trust, and made the catalog feel unpolished compared to competitors.

Shritik's role: Product + AI — owned the problem framing, solution design, and implementation direction for an AI-assisted catalog consistency tool.

Approach:
- Mapped failure modes in existing catalog images (wrong crop, mixed ratios, background inconsistency)
- Designed an AI image-processing pipeline to standardize aspect ratios while preserving product fidelity
- Prioritized PLP-critical SKUs and high-traffic categories first
- Built feedback loops between automated fixes and manual review for edge cases

Impact themes: cleaner PLPs, faster listing QA, better shopper confidence, scalable catalog ops.

Skills: AI product management, computer vision applications, quick commerce, catalog operations, image processing, product listing optimization.`,
    tags: [
      "AI Product",
      "Computer Vision",
      "Quick Commerce",
      "Fashion Tech",
      "Image Processing",
      "Catalog Ops",
    ],
    priority: 7,
    published: true,
    pdfFileName: "Slikk Aspect Ratio Fix PPT.pdf",
    sourcePdf: "/Users/shritikjaiswal/Downloads/Slikk Aspect Ratio Fix PPT.pdf",
  },
  {
    title: "Flipkart APM",
    slug: "flipkart-apm",
    shortDescription:
      "Flipkart APM challenge — reimagining Google Maps for an extreme data-scarce world with device-to-device mesh networks and offline-first navigation.",
    longDescription:
      "For Flipkart's APM challenge, Shritik tackled a moonshot prompt: redesign a popular product for a world where internet data is extremely scarce. He chose Google Maps — a non-negotiable utility for 2B+ users — and proposed a G-Mesh network where nearby devices share location data peer-to-peer, combined with Device-Cache for offline map tiles and the traditional human wisdom of asking locals. The solution keeps navigation alive in offline zones while cutting data consumption per user, backed by market analysis, competitive mapping capability benchmarks, and clear success metrics.",
    aiContext: `Flipkart APM Challenge — Reimagining Google Maps for a Data-Scarce World

Prompt: Imagine a world where data is extremely scarce. Pick a popular product and re-think it without losing its core value proposition.

Product chosen: Google Maps — non-negotiable utility, data-hungry core engine, critical infrastructure for 100M+ businesses, 2 billion monthly active users.

Key assumptions of the imagined world: governments enforce data consumption limits (500 MB/month), 2G/3G speeds (~0.1–1 MBPS), same device behavior as today.

Solution — G-Mesh network:
- Device-to-device mesh network for sharing location data locally between nearby phones
- Device-Cache: offline map tiles cached and shared while travelling
- Blends traditional human wisdom of asking locals for directions with tech
- In-app data optimizations for seamless navigation in offline zones
- Self-sustaining cooperative network — every device keeps the map moving even when the internet slows down

Analysis included:
- Why Google Maps: data consumed per user (~23 MB/month), 1.4B active map users, ~30.3 petabytes/month total
- Market share: Google Maps 67%, Apple Maps 16%, Waze 10%
- Mapping competitive capability benchmarks (offline functionality, data efficiency, local data richness)
- Economic and social impact of unreliable data: rising costs, disaster scenarios, carbon cost of data transfers
- Success metrics, trade-offs, risks, and prioritization (impact vs MOAT)

Skills demonstrated: first-principles product thinking, moonshot solution design, systems thinking, market analysis, metrics definition, case structuring for APM interviews.`,
    tags: ["APM Challenge", "Product Thinking", "Google Maps", "Offline-First", "Mesh Network"],
    priority: 6,
    published: true,
    pdfFileName: "Flipkart_APM.pdf",
    sourcePdf: "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/Flipkart_APM.pdf",
  },
  {
    title: "RISA APM",
    slug: "risa-apm",
    shortDescription:
      "JARVIS — conceptualizing an AI-native desktop browser for RISA Labs, backed by 178 surveys and 21 interviews on how users really browse.",
    longDescription:
      "For RISA Labs' AI Browser assignment, Shritik conceptualized JARVIS — an AI-native, task-aware desktop browser for an AI-driven world. Grounded in primary research (178 surveys, 21 interviews), the work maps why traditional browsers fail modern workflows: no grasp of user intent, manual tab chaos, and zero content intelligence. JARVIS proposes AI summaries before reading, intelligent tab grouping, cross-session continuity, and a reading companion — with full user journey mapping, wireframes, GTM, and a revenue model.",
    aiContext: `RISA APM — JARVIS: AI-Native Desktop Browser (RISA Labs, IIT Kharagpur)

Assignment: Conceptualizing the Future of Browsing — reimagining the desktop browser for an AI-driven world.

Product concept: JARVIS — an AI-native, task-aware browsing experience that closes the gap between static browsers and AI-assisted workflows.

Primary research:
- 178 surveys, 21 interviews (72% undergraduates, 18% employees)
- 58% struggle to understand complex content without instant AI explanations
- 54% said AI summaries greatly reduce reading time but require constant tool-switching
- 49% want the browser to remember context and continue tasks intelligently across sessions
- 33% struggle to maintain context while juggling academic sources across tabs

Why now: browser-influenced value ~275B/yr, AI browser segment ~87B by 2030, 30% AI browsers CAGR, no dominant AI-native browser category; Atlas and Comet launches signal a strategic shift toward AI-powered browsers. Traditional browser share 93% vs AI-based 7%.

Problems with traditional browsers: built for page rendering only — no user intent detection, no grasp of complex content, meaning extracted manually, no tab intelligence or grouping, no continuity across sessions.

Core users: college students (14–25, highest AI adoption), postgrads/researchers, multi-tab navigators, workflow users. Personas: multitasking fast-switching B.Tech learner; detail-oriented evidence-driven PhD researcher.

JARVIS solutions: AI summaries before reading, deep explainer auto-highlight, split-screen suggestions, passive tab insights, smart organizer, session memory visualization, AI notes panel, writer assistant, auto citation.

Deliverables: user journey mapping (search → read → verify → compare → note → write → organize), wireframes, impact & integration plan, GTM & revenue model.

Skills: AI product conceptualization, primary user research, persona development, product design, GTM strategy, revenue modeling.`,
    tags: ["AI Browser", "User Research", "Product Concept", "RISA Labs", "IIT Kharagpur"],
    priority: 5,
    published: true,
    pdfFileName: "Shritik_21BT3EP08_IITKGP_RISALABS_APM.pdf",
    sourcePdf:
      "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/Shritik_21BT3EP08_IITKGP_RISALABS_APM.pdf",
  },
  {
    title: "Paytm UX Improvement",
    slug: "paytm-ux-improvement",
    shortDescription:
      "Redesigning Paytm's homepage and payment flows — simplifying navigation, reducing clutter, and improving new-user onboarding for India's leading fintech app.",
    longDescription:
      "As part of an IIT Kharagpur product team, Shritik worked on improving Paytm's user experience — one of India's largest fintech platforms with 90M+ monthly transacting users. The project analyzed Paytm's cluttered homepage, simplified the payment section to four core features, redesigned bottom navigation, and proposed AARRR-driven improvements for both new and returning users. Competitive benchmarking against PhonePe, Google Pay, and others informed the redesign strategy.",
    aiContext: `Paytm UX Improvement — IIT Kharagpur Product Case

Platform context: Paytm — Indian digital payments and financial services platform. 90M average monthly transacting users. Competes with PhonePe, Google Pay, Amazon Pay, and others in UPI and merchant payments.

Problem: Cluttered homepage with too many features on one screen. Confusing navigation for new users. Payment section overloaded. Poor first impressions hurting retention.

Proposed improvements:
- Simplified homepage: only 4 features per section for easy navigation
- Redesigned payment section with live text for user attention and personalized suggestions
- Combined related features (Bank account + Transfer, Balance + History + Wallet)
- New bottom navigation: Wealth, Deals & Rewards, People, QR Scan
- New-user-specific flows with swipe-up onboarding and UPI Lite CTA
- Reduced vertical scrolling with section-based navigation
- AARRR funnel analysis to prioritize acquisition and activation fixes
- Competitive analysis: Paytm vs PhonePe vs Google Pay market share and feature gaps

Team: IIT Kharagpur product enthusiasts. Delivered press release, statistics, and wireframe-level UX proposals.

Skills: UX research, fintech product, information architecture, competitive analysis, AARRR framework, mobile app redesign.`,
    tags: ["UX Design", "Fintech", "Mobile App", "AARRR", "IIT Kharagpur", "Payments"],
    priority: 4,
    published: true,
    pdfFileName: "PAYTM UX Improvement.pdf",
    sourcePdf:
      "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/ALL DECKS/PAYTM UX Improvement.pdf",
  },
  {
    title: "NoBroker Rental Space",
    slug: "nobroker-rental",
    shortDescription:
      "PropTech case study on improving NoBroker's rental marketplace — owner/tenant research, competitive benchmarking, and subscription model fixes.",
    longDescription:
      "Shritik analyzed NoBroker's rental space product against competitors like MagicBricks, 99acres, and emerging PropTech startups. Through owner and tenant interviews, the team uncovered pain points in subscription pricing, listing quality, and tenant matching — proposing targeted improvements to NoBroker's rental segment in a market growing from $94B to $251B (2019–2021).",
    aiContext: `NoBroker Rental Space Improvement — PropTech Case Study

Market context: Indian PropTech market grew from USD 94B to USD 251B (2019–2021). PropTech startups are 6% of recognized Indian startups. Total PropTech funding: USD 1.4B.

NoBroker context: Leading broker-free real estate platform. Competes with MagicBricks, 99acres, Housing.com across 6–600+ cities.

Research findings — Owner behavior:
- 60% of homeowners found subscription prices too high
- 40% said free listings were good enough
- 55% still use traditional To-Let boards; 45% use real-estate websites
- Pain: continuous annoying calls from platforms, few genuine tenant leads

Research findings — Tenant behavior:
- 45% prefer families over bachelors
- Most rental listings in low-rental segments
- 70% of interviewees in low rental segment; only 10% bought subscription plans

Competitive benchmarking: Compared NoBroker's BOST model, paid plans, city coverage, and services vs MagicBricks, 99acres, Housing.com, and emerging startups (co-living, RNPL, property insurance).

Proposed improvements: Better tenant-owner matching, pricing tier adjustments, reduced spam calls, improved listing quality signals.

Skills: PropTech, user research, competitive analysis, marketplace design, rental segment strategy.`,
    tags: ["PropTech", "Marketplace", "User Research", "Real Estate", "Competitive Analysis"],
    priority: 3,
    published: true,
    pdfFileName: "NoBroker.pdf",
    sourcePdf:
      "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/ALL DECKS/NoBroker.pdf",
  },
  {
    title: "ICC Truck Logistics",
    slug: "icc-truck-logistics",
    shortDescription:
      "Digitizing India's unorganized trucking sector — telematics, route optimization, and GTM strategy for a logistics platform case competition.",
    longDescription:
      "For the ICC case competition finals, Shritik's team tackled digitizing the 86% unorganized Indian trucking sector. The solution proposed telematics, AI-driven route optimization, real-time tracking, and a structured go-to-market roadmap — addressing driver welfare, operational efficiency, and financial feasibility for a logistics platform.",
    aiContext: `ICC Finals — Digitalization of Truck Logistics Industry

Problem: 86% of Indian truck drivers operate in the unorganized sector — overworked, underpaid, no healthcare. Logistics costs are high as a percentage of GDP. Hit-and-run laws create financial risk for drivers.

Solution framework:
- Digitize unorganized truck drivers onto a structured logistics platform
- Apply telematics, AI, Big Data, and automation for route optimization, fuel monitoring, predictive maintenance
- Real-time tracking and connected vehicle infrastructure
- Optimize truck utilization, balance goods type allocation, maximize revenue within time constraints
- Financial feasibility analysis for sustainable platform economics
- GTM strategy for onboarding drivers and fleet operators

Industry context: Trucks are India's supply chain backbone — job creation, export value chain, multimodal integration, cost/time efficiency.

Team: ICC case competition finals submission. Includes user personas, industry analysis, optimization models, and sustainability planning.

Skills: Strategy, operations research, logistics, GTM, financial feasibility, case competition.`,
    tags: ["Strategy", "Logistics", "Case Competition", "GTM", "Operations"],
    priority: 2,
    published: true,
    pdfFileName: "ICC_FINALS_SUBMISSION.pdf",
    sourcePdf:
      "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/ALL DECKS/ICC_FINALS_SUBMISSION (2).pdf",
  },
  {
    title: "OpenAI GPT Store",
    slug: "openai-gpt-store",
    shortDescription:
      "Revenue model and GTM strategy for OpenAI's GPT Store — monetization analysis, quality control, and creator economics in the AI marketplace.",
    longDescription:
      "Team Case Ace analyzed OpenAI's GPT Store launch — exploring revenue models, pricing strategies, and go-to-market plans for a marketplace with 100M+ weekly ChatGPT users. The case covers creator monetization debates, quality control against low-quality bot saturation, financial feasibility, and competitive differentiation in the crowded AI tools market.",
    aiContext: `Case Ace — OpenAI GPT Store Revenue Model & Strategy

Context: OpenAI launched the GPT Store for custom GPT bots. 100M+ weekly active ChatGPT users. 10M+ daily queries. 79% of people have used generative AI; 22% use it regularly at work. 92% of Fortune 500 companies build on OpenAI products.

Problem statement:
- Design a detailed revenue model with pricing strategies and cost projections
- Analyze financial feasibility: revenue streams, costs, profitability (short and long term)
- Develop GTM strategy to differentiate GPT Store in crowded AI market
- Implement quality control to prevent oversaturation of low-quality GPTs
- Ensure sustainable, specialized GPTs for diverse user needs

Key debates: Creator monetization vs platform revenue. Transaction fee model scrapped (Oct 2023). Concerns about low-quality bots flooding the market.

Analysis areas: Revenue model options, competitive landscape (ChatGPT vs DeepL, Jasper, Midjourney), user journey in GPT Store, chip alliance strategy, Q2 projections.

Team: Case Ace. ICC submission format with industry analysis, user journey, revenue model analysis, and executive summary.

Skills: AI product strategy, marketplace monetization, GTM, financial modeling, competitive analysis, case competition.`,
    tags: ["AI Strategy", "Monetization", "GPT Store", "Case Competition", "Marketplace"],
    priority: 1,
    published: true,
    pdfFileName: "TEAM CASE ACE_ICC SUBMISSION.pdf",
    sourcePdf:
      "/Users/shritikjaiswal/Desktop/BIOTECH/PRODUCT/ALL DECKS/TEAM CASE ACE_ICC SUBMISSION (1).pdf",
  },
];
