"use client";

import { type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  DEMO_IMPACT_ITEMS,
  resolveImpactDetailUrl,
  type ImpactShowcaseItem,
} from "@/lib/impact-data";

const TvPdfScreen = dynamic(() => import("@/components/home/TvPdfScreen"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-[14px] bg-[#f7f3ea] text-[11px] text-black/45">
      Warming up…
    </div>
  ),
});

function ProjectCard({
  project,
  index,
}: {
  project: ImpactShowcaseItem;
  index: number;
}) {
  const tilt = index % 2 === 0 ? 2.4 : -2.4;
  const { theme, logo } = project;
  const detailHref = resolveImpactDetailUrl(logo.alt, project.detailUrl);

  return (
    <article
      className="projects-card projects-card--active relative mx-auto flex w-full max-w-[min(1040px,100%)] overflow-visible border-[2.5px] border-black bg-white"
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
          className="relative flex w-[42%] items-center justify-center p-[3%] sm:w-[44%] sm:p-[4%] md:w-[46%]"
          style={{
            backgroundColor: theme.panel,
            backgroundImage: `radial-gradient(${theme.dot} 1.4px, transparent 1.4px)`,
            backgroundSize: "13px 13px",
          }}
        >
          <div className="h-full w-[92%] max-h-[96%] py-[4px]">
            <TvPdfScreen
              url={project.pdfUrl}
              accent={theme.accent}
              label={`${project.logo.alt} project PDF`}
            />
          </div>
        </div>

        <div className="relative flex w-[58%] flex-col bg-white px-[20px] py-[20px] sm:w-[56%] sm:px-[24px] sm:py-[24px] md:w-[54%] md:px-[28px] md:py-[28px]">
          <div className="relative z-[1] flex items-start gap-3">
            <div
              className={`relative shrink-0 overflow-hidden border border-black ${
                logo.wide
                  ? "h-[36px] w-[58px] sm:h-[40px] sm:w-[64px]"
                  : "h-[40px] w-[40px] sm:h-[44px] sm:w-[44px]"
              }`}
              style={{ backgroundColor: logo.bg }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain p-[3px]"
                sizes={logo.wide ? "64px" : "44px"}
              />
            </div>
            <h3 className="m-0 text-[13px] font-bold leading-[1.3] tracking-[-0.02em] text-black sm:text-[15px] md:text-[17px]">
              {project.title}
            </h3>
          </div>

          <p className="relative z-[1] mt-4 line-clamp-4 text-[11px] leading-[1.55] text-black/85 sm:line-clamp-5 sm:text-[12.5px] md:line-clamp-6 md:text-[13.5px]">
            {project.body}
          </p>

          <div className="relative z-[1] mt-3 flex flex-wrap gap-2 sm:mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex border border-black px-2.5 py-1 text-[10px] font-medium text-black sm:px-3 sm:text-[11px]"
                style={{ backgroundColor: theme.tag }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={detailHref}
            className="projects-cta relative z-[1] mt-auto inline-flex w-full max-w-[240px] items-center justify-between border-[2px] border-black bg-white px-4 py-2.5 text-[12px] font-semibold text-black sm:max-w-[260px] sm:px-[16px] sm:py-[10px] sm:text-[13px]"
            style={
              {
                boxShadow: "4px 4px 0 #000",
                ["--cta-accent" as string]: theme.accent,
                ["--cta-panel" as string]: theme.panel,
              } as CSSProperties
            }
          >
            <span className="relative z-[1]">View Detailed Project</span>
            <ExternalLink
              className="projects-cta-icon relative z-[1] h-[14px] w-[14px] shrink-0"
              strokeWidth={2.25}
            />
            <span className="projects-cta-burst" aria-hidden />
            <span className="projects-cta-shine" aria-hidden />
          </Link>

          <PaintSplash color={theme.splash} n={index + 1} />
        </div>
      </div>
    </article>
  );
}

/**
 * True quarter-circle index mark (equal sides → no stretch).
 * Number sits on the quarter-disk centroid (~0.42R from the corner).
 */
function PaintSplash({ color, n }: { color: string; n: number }) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 z-0 aspect-square w-[min(36%,148px)]"
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-tl-full"
        style={{
          backgroundColor: color,
          backgroundImage:
            "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, rgba(0,0,0,0.06) 100%)",
        }}
      />
      <span
        className="absolute text-[clamp(52px,7.5vw,84px)] font-black leading-none tracking-[-0.06em] text-white"
        style={{
          right: "42%",
          bottom: "42%",
          transform: "translate(50%, 50%)",
        }}
      >
        {n}
      </span>
    </div>
  );
}

/**
 * IMPACT CREATED — vertical stack, alternating left/right tilt (no horizontal scroll).
 * Horizontal padding/max-width match Experience above.
 */
export default function CreationsScroll({
  items,
}: {
  items?: ImpactShowcaseItem[] | null;
}) {
  const projects =
    items && items.length > 0 ? items : DEMO_IMPACT_ITEMS;

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

        <div className="flex flex-col items-center gap-[56px] sm:gap-[72px] md:gap-[88px]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
