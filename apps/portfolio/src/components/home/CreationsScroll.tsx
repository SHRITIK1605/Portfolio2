"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

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

function BrandMark({ index }: { index: number }) {
  const i = index % 4;
  if (i === 0) {
    return (
      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center bg-black sm:h-[40px] sm:w-[40px]">
        <span
          className="text-[18px] leading-none text-white sm:text-[20px]"
          style={{ fontFamily: "var(--font-hand), cursive" }}
        >
          S
        </span>
      </div>
    );
  }
  if (i === 1) {
    return (
      <svg
        className="h-[36px] w-[36px] shrink-0 sm:h-[40px] sm:w-[40px]"
        viewBox="0 0 40 40"
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, n) => (
          <ellipse
            key={n}
            cx="20"
            cy="10"
            rx="5"
            ry="9"
            fill="#5cbc34"
            transform={`rotate(${n * 45} 20 20)`}
          />
        ))}
        <circle cx="20" cy="20" r="4" fill="#ecfccc" />
      </svg>
    );
  }
  if (i === 2) {
    return (
      <div className="flex h-[36px] w-[44px] shrink-0 flex-col items-center justify-center sm:h-[40px] sm:w-[48px]">
        <span className="text-[16px] font-black leading-none tracking-tight text-[#009cfc] sm:text-[18px]">
          BSE
        </span>
        <span className="mt-[-2px] text-[10px] leading-none text-[#f0b800]">▲</span>
      </div>
    );
  }
  return (
    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center bg-[#ff7a18] sm:h-[40px] sm:w-[40px]">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M3 12 L9 3 L15 12 Z"
          stroke="white"
          strokeWidth="1.6"
          fill="none"
        />
        <circle cx="9" cy="13.5" r="1.4" fill="white" />
      </svg>
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
  const tiltLeft = index % 2 === 0;
  const tags = project.tags.slice(0, 3);
  const body =
    project.longDescription?.trim() ||
    project.shortDescription?.trim() ||
    "";

  return (
    <article
      className="relative flex w-full max-w-[980px] overflow-hidden border-[2.5px] border-black bg-white"
      style={{
        transform: `rotate(${tiltLeft ? -3.2 : 3.2}deg)`,
        boxShadow: "8px 8px 0 #000",
      }}
    >
      {/* Left — dotted panel + white thumbnail placeholder */}
      <div
        className="relative flex w-[46%] items-center justify-center p-[6%] sm:w-1/2"
        style={{
          backgroundColor: theme.panel,
          backgroundImage: `radial-gradient(${theme.dot} 1.35px, transparent 1.35px)`,
          backgroundSize: "14px 14px",
        }}
      >
        <div className="aspect-square w-[78%] max-w-[280px] bg-white" aria-hidden />
      </div>

      {/* Right — content */}
      <div className="relative flex w-[54%] flex-col bg-white p-[16px] pb-[56px] sm:w-1/2 sm:p-[22px] sm:pb-[64px] md:p-[26px] md:pb-[72px]">
        <div className="relative z-[1] flex items-start gap-[10px] sm:gap-[12px]">
          <BrandMark index={index} />
          <h3 className="m-0 text-[14px] font-bold leading-[1.25] tracking-[-0.02em] text-black sm:text-[16px] md:text-[18px]">
            {project.title}
          </h3>
        </div>

        <p className="relative z-[1] mt-[12px] line-clamp-5 text-[11px] leading-[1.55] text-black/90 sm:mt-[14px] sm:line-clamp-6 sm:text-[12.5px] md:text-[13.5px]">
          {body}
        </p>

        <div className="relative z-[1] mt-[12px] flex flex-wrap gap-[6px] sm:mt-[14px] sm:gap-[8px]">
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
          className="relative z-[1] mt-[14px] inline-flex w-full max-w-[260px] items-center justify-between border-[2px] border-black bg-white px-[12px] py-[8px] text-[12px] font-semibold text-black transition-colors hover:bg-black hover:text-white sm:mt-[16px] sm:max-w-[280px] sm:px-[14px] sm:py-[10px] sm:text-[13px]"
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
 * Sticky horizontal showcase: vertical scroll advances one project per viewport.
 */
export default function CreationsScroll({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const snapTimer = useRef<number | null>(null);
  const count = projects.length;

  useEffect(() => {
    if (count < 1) return;

    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const raw = -rect.top / total;
      setProgress(Math.min(1, Math.max(0, raw)));
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

  const shiftPct = progress * (count - 1) * 100;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${Math.max(count, 1) * 100}vh` }}
      aria-labelledby="creations-scroll-heading"
    >
      <div
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
        style={{
          backgroundColor: "#fffbf1",
          backgroundImage: `
            linear-gradient(rgba(1, 97, 70, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 97, 70, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] shrink-0 px-[20px] pt-[28px] sm:px-[32px] sm:pt-[36px] md:px-[48px] md:pt-[44px]">
          <h2
            id="creations-scroll-heading"
            className="m-0 text-[18px] font-bold uppercase tracking-[-0.02em] text-forest sm:text-[22px] md:text-[26px]"
          >
            {"// : WELCOME TO MY CREATIONS !"}
          </h2>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${count * 100}%`,
              transform: `translate3d(-${shiftPct / count}%, 0, 0)`,
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex h-full shrink-0 items-center justify-center px-[16px] py-[24px] sm:px-[32px] sm:py-[32px] md:px-[48px]"
                style={{ width: `${100 / count}%` }}
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
