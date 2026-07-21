"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";
import { EXPERIENCES } from "@/lib/experience-data";

const THEMES = [
  {
    panel: "#fce8a0",
    dot: "#f4b800",
    splash: "#f0b800",
    tag: "#f8f0d0",
  },
  {
    panel: "#ecfccc",
    dot: "#5cbc34",
    splash: "#88e858",
    tag: "#e8f8d8",
  },
  {
    panel: "#e0fcfc",
    dot: "#009cfc",
    splash: "#78c8f8",
    tag: "#f8f0d0",
  },
  {
    panel: "#fccce4",
    dot: "#fc54b8",
    splash: "#f898c8",
    tag: "#f8f0d0",
  },
] as const;

type LogoMark = {
  src: string;
  bg: string;
  wide?: boolean;
  alt: string;
};

const LOGO_BY_KEY: Record<string, LogoMark> = Object.fromEntries(
  EXPERIENCES.map((exp) => [
    exp.id,
    {
      src: exp.logoUrl.split("?")[0],
      bg: exp.logoBg ?? "#ffffff",
      wide: exp.logoWide,
      alt: `${exp.company} logo`,
    },
  ])
);

/** Prefer a company match from title/slug; otherwise cycle real experience logos. */
function resolveLogo(project: Project, index: number): LogoMark {
  const hay = `${project.slug} ${project.title}`.toLowerCase();
  const keys = [
    ["slikk", "slikk"],
    ["bse", "bse"],
    ["bombay stock", "bse"],
    ["times", "times"],
    ["emb", "emb"],
    ["expand my business", "emb"],
    ["aarya", "aarya"],
    ["unifly", "unifly"],
  ] as const;

  for (const [needle, id] of keys) {
    if (hay.includes(needle) && LOGO_BY_KEY[id]) return LOGO_BY_KEY[id];
  }

  const fallback = EXPERIENCES[index % EXPERIENCES.length];
  return {
    src: fallback.logoUrl.split("?")[0],
    bg: fallback.logoBg ?? "#ffffff",
    wide: fallback.logoWide,
    alt: `${fallback.company} logo`,
  };
}

function BrandLogo({ logo }: { logo: LogoMark }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-black ${
        logo.wide
          ? "h-[32px] w-[52px] sm:h-[36px] sm:w-[58px]"
          : "h-[36px] w-[36px] sm:h-[40px] sm:w-[40px]"
      }`}
      style={{ backgroundColor: logo.bg }}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        className="object-contain p-[3px]"
        sizes={logo.wide ? "58px" : "40px"}
      />
    </div>
  );
}

function PaintSplash({ color, n }: { color: string; n: number }) {
  return (
    <div className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-[42%] w-[38%] overflow-hidden">
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
      <span className="absolute bottom-[-8%] right-[4%] text-[clamp(72px,11vw,128px)] font-black leading-none tracking-[-0.04em] text-white">
        {n}
      </span>
    </div>
  );
}

function CreationCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const theme = THEMES[index % THEMES.length];
  // Even cards tilt right (clockwise), odd tilt left — matches Frame_1 / Frame_2.
  const tilt = index % 2 === 0 ? 3.2 : -3.2;
  const tags = project.tags.slice(0, 3);
  const body =
    project.longDescription?.trim() ||
    project.shortDescription?.trim() ||
    "";
  const logo = resolveLogo(project, index);

  return (
    <article
      className="relative flex h-[min(420px,58vh)] w-full max-w-[min(1040px,92vw)] overflow-hidden border-[2.5px] border-black bg-white sm:h-[min(460px,62vh)]"
      style={{
        transform: `rotate(${tilt}deg)`,
        boxShadow: "8px 8px 0 #000",
      }}
    >
      {/* Left — dotted panel + white thumbnail placeholder */}
      <div
        className="relative flex w-[46%] items-center justify-center p-[5%] sm:w-1/2 sm:p-[6%]"
        style={{
          backgroundColor: theme.panel,
          backgroundImage: `radial-gradient(${theme.dot} 1.35px, transparent 1.35px)`,
          backgroundSize: "14px 14px",
        }}
      >
        <div
          className="aspect-square w-[72%] max-h-[78%] border border-black bg-white"
          aria-hidden
        />
      </div>

      {/* Right — content */}
      <div className="relative flex w-[54%] flex-col bg-white p-[14px] pb-[48px] sm:w-1/2 sm:p-[20px] sm:pb-[56px] md:p-[24px] md:pb-[64px]">
        <div className="relative z-[1] flex items-start gap-[10px] sm:gap-[12px]">
          <BrandLogo logo={logo} />
          <h3 className="m-0 text-[13px] font-bold leading-[1.25] tracking-[-0.02em] text-black sm:text-[15px] md:text-[17px]">
            {project.title}
          </h3>
        </div>

        <p className="relative z-[1] mt-[10px] line-clamp-4 text-[11px] leading-[1.5] text-black/90 sm:mt-[12px] sm:line-clamp-5 sm:text-[12.5px] md:text-[13px]">
          {body}
        </p>

        <div className="relative z-[1] mt-[10px] flex flex-wrap gap-[6px] sm:mt-[12px] sm:gap-[8px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex border border-black px-[8px] py-[3px] text-[10px] font-medium text-black sm:px-[10px] sm:py-[4px] sm:text-[11px]"
              style={{ backgroundColor: theme.tag }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={projectPath(project.slug)}
          onClick={() => {
            fetch("/api/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "PROJECT_VIEW",
                projectId: project.id,
              }),
            }).catch(() => {});
          }}
          className="relative z-[1] mt-auto inline-flex w-full max-w-[260px] items-center justify-between border-[2px] border-black bg-white px-[12px] py-[8px] text-[12px] font-semibold text-black transition-colors hover:bg-black hover:text-white sm:max-w-[280px] sm:px-[14px] sm:py-[10px] sm:text-[13px]"
          style={{ boxShadow: "4px 4px 0 #000" }}
        >
          View Detailed Project
          <ExternalLink className="h-[14px] w-[14px] shrink-0" strokeWidth={2.25} />
        </Link>

        <PaintSplash color={theme.splash} n={index + 1} />
      </div>
    </article>
  );
}

/**
 * Scroll-pinned horizontal showcase: one landscape card per viewport.
 * Uses fixed pinning (not sticky) so overflow-x on ancestors can't leave empty voids.
 */
export default function CreationsScroll({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [pinMode, setPinMode] = useState<"before" | "pin" | "after">("before");
  const snapTimer = useRef<number | null>(null);
  const count = projects.length;

  useEffect(() => {
    if (count < 1) return;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        setPinMode("before");
        return;
      }

      if (rect.top > 0) {
        setPinMode("before");
        setProgress(0);
        return;
      }
      if (rect.bottom <= window.innerHeight) {
        setPinMode("after");
        setProgress(1);
        return;
      }
      setPinMode("pin");
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };

    const onScroll = () => {
      update();
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        const el = sectionRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        const start = el.offsetTop;
        const raw = (window.scrollY - start) / total;
        if (raw < -0.02 || raw > 1.02) return;
        const nearest = Math.round(
          Math.min(1, Math.max(0, raw)) * (count - 1)
        );
        const target = start + (nearest / Math.max(count - 1, 1)) * total;
        if (Math.abs(window.scrollY - target) > 8) {
          window.scrollTo({ top: target, behavior: "smooth" });
        }
      }, 90);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [count]);

  if (count === 0) return null;

  const translateVw = progress * (count - 1) * 100;
  const panelPosition =
    pinMode === "pin"
      ? ("fixed" as const)
      : ("absolute" as const);
  const panelInset =
    pinMode === "after"
      ? { top: "auto" as const, bottom: 0 }
      : { top: 0, bottom: "auto" as const };

  const panelStyle: CSSProperties = {
    position: panelPosition,
    left: 0,
    right: 0,
    ...panelInset,
    height: "100vh",
    backgroundColor: "#fffbf1",
    backgroundImage: `
      linear-gradient(rgba(1, 97, 70, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(1, 97, 70, 0.07) 1px, transparent 1px)
    `,
    backgroundSize: "28px 28px",
    zIndex: pinMode === "pin" ? 20 : 1,
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${Math.max(count, 1) * 100}vh` }}
      aria-labelledby="creations-scroll-heading"
    >
      <div className="flex h-screen w-full flex-col overflow-hidden" style={panelStyle}>
        <div className="mx-auto w-full max-w-[1200px] shrink-0 px-[20px] pt-[20px] sm:px-[32px] sm:pt-[28px] md:px-[48px] md:pt-[32px]">
          <h2
            id="creations-scroll-heading"
            className="m-0 text-[18px] font-bold uppercase tracking-[-0.02em] text-forest sm:text-[22px] md:text-[26px]"
          >
            {"// : WELCOME TO MY CREATIONS !"}
          </h2>
        </div>

        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${count * 100}vw`,
              transform: `translate3d(-${translateVw}vw, 0, 0)`,
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex h-full w-screen shrink-0 items-center justify-center px-[16px] py-[12px] sm:px-[40px] sm:py-[16px] md:px-[56px]"
              >
                <CreationCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

