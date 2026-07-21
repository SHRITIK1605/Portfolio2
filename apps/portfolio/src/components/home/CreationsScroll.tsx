"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

/** Static showcase projects — design mock content, not DB/demo cases. */
const SHOWCASE_PROJECTS = [
  {
    id: "showcase-1",
    title:
      "AI Image Computer Vision Standardizer for 150,000+ Slikk Fashion Catalogues",
    body: "Slikk operates in fashion quick commerce, where product listing pages live or die on visual consistency. Shritik built an AI-driven pipeline to detect and normalize inconsistent product image aspect ratios across the catalog — reducing visual clutter on PLPs, improving scanability, and making listings feel trustworthy at scroll speed. The work spans computer-vision classification, batch processing workflows, and product decisions around where automation should override manual QA.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    logo: {
      src: "/experience/logos/slikk.png",
      bg: "#000000",
      alt: "Slikk",
    },
    theme: {
      panel: "#fdeba3",
      dot: "#e0b84a",
      splash: "#f0b800",
      tag: "#f8f0d0",
      accent: "#f0b800",
    },
  },
  {
    id: "showcase-2",
    title:
      "AI Image Computer Vision Standardizer for 150,000+ Slikk Fashion Catalogues",
    body: "Slikk operates in fashion quick commerce, where product listing pages live or die on visual consistency. Shritik built an AI-driven pipeline to detect and normalize inconsistent product image aspect ratios across the catalog — reducing visual clutter on PLPs, improving scanability, and making listings feel trustworthy at scroll speed. The work spans computer-vision classification, batch processing workflows, and product decisions around where automation should override manual QA.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    logo: {
      src: "/experience/logos/emb.png",
      bg: "#ffffff",
      alt: "EMB Global",
    },
    theme: {
      panel: "#ecf5d4",
      dot: "#7aab4a",
      splash: "#88e858",
      tag: "#eef6e0",
      accent: "#6fbf48",
    },
  },
  {
    id: "showcase-3",
    title:
      "AI Image Computer Vision Standardizer for 150,000+ Slikk Fashion Catalogues",
    body: "Slikk operates in fashion quick commerce, where product listing pages live or die on visual consistency. Shritik built an AI-driven pipeline to detect and normalize inconsistent product image aspect ratios across the catalog — reducing visual clutter on PLPs, improving scanability, and making listings feel trustworthy at scroll speed. The work spans computer-vision classification, batch processing workflows, and product decisions around where automation should override manual QA.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    logo: {
      src: "/experience/logos/bse.png",
      bg: "#ffffff",
      alt: "BSE",
      wide: true,
    },
    theme: {
      panel: "#ddeff5",
      dot: "#5aa8c8",
      splash: "#78c8f8",
      tag: "#eef6fa",
      accent: "#4aa3d4",
    },
  },
  {
    id: "showcase-4",
    title:
      "AI Image Computer Vision Standardizer for 150,000+ Slikk Fashion Catalogues",
    body: "Slikk operates in fashion quick commerce, where product listing pages live or die on visual consistency. Shritik built an AI-driven pipeline to detect and normalize inconsistent product image aspect ratios across the catalog — reducing visual clutter on PLPs, improving scanability, and making listings feel trustworthy at scroll speed. The work spans computer-vision classification, batch processing workflows, and product decisions around where automation should override manual QA.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    logo: {
      src: "/experience/logos/aarya.png",
      bg: "#ffffff",
      alt: "Aarya Stays",
    },
    theme: {
      panel: "#f5d4e4",
      dot: "#d478a0",
      splash: "#f898c8",
      tag: "#f8e8f0",
      accent: "#e878a8",
    },
  },
] as const;

function PaintSplash({ color, n }: { color: string; n: number }) {
  return (
    <div className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-[44%] w-[40%] overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 180"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M12 180 C 18 120 28 78 55 52 C 78 30 110 18 148 22 C 175 25 192 48 200 78 L 200 180 Z"
          fill={color}
        />
      </svg>
      <span className="absolute bottom-[-6%] right-[2%] text-[clamp(72px,11vw,128px)] font-black leading-none tracking-[-0.04em] text-white">
        {n}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof SHOWCASE_PROJECTS)[number];
  index: number;
}) {
  const tilt = index % 2 === 0 ? 2.4 : -2.4;
  const { theme, logo } = project;

  return (
    <article
      className="projects-card projects-card--active relative flex w-full overflow-visible border-[2.5px] border-black bg-white"
      style={{
        transform: `rotate(${tilt}deg)`,
        boxShadow: "10px 10px 0 #000",
        height: "min(420px, 58vh)",
      }}
    >
      <span
        className="projects-scrap projects-scrap--tape pointer-events-none absolute -left-[18px] -top-[14px] z-[2] h-[18px] w-[56px] rotate-[-18deg] opacity-80"
        style={{ backgroundColor: theme.accent }}
        aria-hidden
      />
      <span
        className="projects-scrap projects-scrap--dot pointer-events-none absolute -right-[10px] top-[18%] z-[2] h-[12px] w-[12px] rounded-full border-2 border-black"
        style={{ backgroundColor: theme.panel }}
        aria-hidden
      />
      <span
        className="projects-scrap projects-scrap--chip pointer-events-none absolute -bottom-[12px] left-[12%] z-[2] h-[10px] w-[42px] rotate-[8deg] border border-black"
        style={{ backgroundColor: theme.tag }}
        aria-hidden
      />

      <div className="relative flex h-full w-full overflow-hidden">
        <div
          className="relative flex w-[42%] items-center justify-center p-[4%] sm:w-[44%] sm:p-[5%] md:w-[46%]"
          style={{
            backgroundColor: theme.panel,
            backgroundImage: `radial-gradient(${theme.dot} 1.4px, transparent 1.4px)`,
            backgroundSize: "13px 13px",
          }}
        >
          <div
            className="aspect-square w-[86%] max-h-[84%] bg-white"
            aria-hidden
          />
        </div>

        <div className="relative flex w-[58%] flex-col bg-white p-[14px] pb-[48px] sm:w-[56%] sm:p-[20px] sm:pb-[56px] md:w-[54%] md:p-[24px] md:pb-[64px]">
          <div className="relative z-[1] flex items-start gap-[10px] sm:gap-[12px]">
            <div
              className={`relative shrink-0 overflow-hidden border border-black ${
                "wide" in logo && logo.wide
                  ? "h-[34px] w-[56px] sm:h-[38px] sm:w-[62px]"
                  : "h-[38px] w-[38px] sm:h-[42px] sm:w-[42px]"
              }`}
              style={{ backgroundColor: logo.bg }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain p-[3px]"
                sizes={"wide" in logo && logo.wide ? "62px" : "42px"}
              />
            </div>
            <h3 className="m-0 text-[13px] font-bold leading-[1.25] tracking-[-0.02em] text-black sm:text-[15px] md:text-[17px]">
              {project.title}
            </h3>
          </div>

          <p className="relative z-[1] mt-[10px] line-clamp-4 text-[11px] leading-[1.55] text-black/90 sm:mt-[12px] sm:line-clamp-5 sm:text-[12.5px] md:line-clamp-6 md:text-[13.5px]">
            {project.body}
          </p>

          <div className="relative z-[1] mt-[10px] flex flex-wrap gap-[6px] sm:mt-[12px] sm:gap-[8px]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex border border-black px-[8px] py-[3px] text-[10px] font-medium text-black sm:px-[10px] sm:py-[4px] sm:text-[11px]"
                style={{ backgroundColor: theme.tag }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#"
            className="projects-cta relative z-[1] mt-auto inline-flex w-full max-w-[260px] items-center justify-between border-[2px] border-black bg-white px-[14px] py-[9px] text-[12px] font-semibold text-black sm:max-w-[280px] sm:px-[16px] sm:py-[10px] sm:text-[13px]"
            style={
              {
                boxShadow: "4px 4px 0 #000",
                ["--cta-accent" as string]: theme.accent,
                ["--cta-panel" as string]: theme.panel,
              } as CSSProperties
            }
            onClick={(e) => e.preventDefault()}
          >
            <span className="relative z-[1]">View Detailed Project</span>
            <ExternalLink
              className="projects-cta-icon relative z-[1] h-[14px] w-[14px] shrink-0"
              strokeWidth={2.25}
            />
            <span className="projects-cta-burst" aria-hidden />
            <span className="projects-cta-shine" aria-hidden />
          </a>

          <PaintSplash color={theme.splash} n={index + 1} />
        </div>
      </div>
    </article>
  );
}

/**
 * IMPACT CREATED — vertical stack, alternating left/right tilt (no horizontal scroll).
 * Horizontal padding/max-width match Experience above.
 */
export default function CreationsScroll() {
  return (
    <section
      className="relative w-full overflow-x-clip py-[48px] sm:py-[64px] md:py-[80px]"
      style={{
        backgroundColor: "#fffbf1",
        backgroundImage: `
          linear-gradient(rgba(1, 97, 70, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(1, 97, 70, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
      aria-labelledby="impact-created-heading"
    >
      <div className="relative mx-auto w-full max-w-[1320px] px-[16px] sm:px-[28px] md:px-[36px] lg:px-[40px]">
        <h2
          id="impact-created-heading"
          className="m-0 mb-[40px] text-[28px] font-bold tracking-[-0.02em] text-forest sm:mb-[52px] sm:text-[32px] md:mb-[64px] md:text-[36px]"
        >
          IMPACT CREATED
        </h2>

        <div className="flex flex-col items-stretch gap-[56px] sm:gap-[72px] md:gap-[88px]">
          {SHOWCASE_PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
