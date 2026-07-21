"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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

const COUNT = SHOWCASE_PROJECTS.length;
/** Min time between card steps (also covers slide animation). */
const STEP_LOCK_MS = 900;
/** Require wheel idle this long before accepting another step (kills trackpad burst). */
const GESTURE_IDLE_MS = 160;
/** Accumulated delta before one step fires. */
const WHEEL_THRESHOLD = 40;
/** Horizontal slide duration (ms) — slower, calmer. */
const SLIDE_MS = 900;

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
      <span className="absolute bottom-[-6%] right-[2%] text-[clamp(80px,12vw,136px)] font-black leading-none tracking-[-0.04em] text-white">
        {n}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  active,
}: {
  project: (typeof SHOWCASE_PROJECTS)[number];
  index: number;
  active: boolean;
}) {
  const tilt = index % 2 === 0 ? 3.2 : -3.2;
  const { theme, logo } = project;

  return (
    <article
      className={`projects-card relative flex h-[min(480px,68vh)] w-full max-w-[min(1080px,94vw)] overflow-visible border-[2.5px] border-black bg-white transition-[opacity,transform] duration-500 ${
        active ? "projects-card--active opacity-100" : "opacity-45"
      }`}
      style={{
        transform: `rotate(${tilt}deg) scale(${active ? 1 : 0.96})`,
        boxShadow: "10px 10px 0 #000",
      }}
    >
      {/* Ambient scraps */}
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

      <div className="relative flex h-full w-full overflow-hidden border-black">
        {/* Left — dotted panel + larger white thumbnail */}
        <div
          className="relative flex w-[46%] items-center justify-center p-[4%] sm:w-[48%] sm:p-[5%]"
          style={{
            backgroundColor: theme.panel,
            backgroundImage: `radial-gradient(${theme.dot} 1.4px, transparent 1.4px)`,
            backgroundSize: "13px 13px",
          }}
        >
          <div
            className="aspect-square w-[88%] max-h-[86%] bg-white"
            aria-hidden
          />
        </div>

        {/* Right — content */}
        <div className="relative flex w-[54%] flex-col bg-white p-[16px] pb-[52px] sm:w-[52%] sm:p-[22px] sm:pb-[60px] md:p-[26px] md:pb-[68px]">
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

          <p className="relative z-[1] mt-[12px] line-clamp-5 text-[11px] leading-[1.55] text-black/90 sm:mt-[14px] sm:line-clamp-6 sm:text-[12.5px] md:text-[13.5px]">
            {project.body}
          </p>

          <div className="relative z-[1] mt-[12px] flex flex-wrap gap-[6px] sm:mt-[14px] sm:gap-[8px]">
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
            className="projects-cta relative z-[1] mt-auto inline-flex w-full max-w-[280px] items-center justify-between border-[2px] border-black bg-white px-[14px] py-[9px] text-[12px] font-semibold text-black sm:max-w-[300px] sm:px-[16px] sm:py-[11px] sm:text-[13px]"
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
 * PROJECTS — one landscape card at a time.
 * Wheel/touch: one gesture → one card. Exit freely at 1 (up) and 4 (down).
 */
export default function CreationsScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const touchY = useRef<number | null>(null);

  /** True while a step animation / cooldown is active — eat wheel, don't step again. */
  const lockedRef = useRef(false);
  const lockUntilRef = useRef(0);
  const accumRef = useRef(0);
  const idleTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const armLock = useCallback(() => {
    lockedRef.current = true;
    lockUntilRef.current = performance.now() + STEP_LOCK_MS;
    accumRef.current = 0;
    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false;
        accumRef.current = 0;
      }, GESTURE_IDLE_MS);
    }, STEP_LOCK_MS);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (lockedRef.current) return false;
      const cur = indexRef.current;
      const next = cur + dir;
      if (next < 0 || next >= COUNT) return false;
      setIndex(next);
      armLock();
      return true;
    },
    [armLock]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let wasInZone = false;

    const inProjectsZone = () => {
      const rect = section.getBoundingClientRect();
      return (
        rect.top <= window.innerHeight * 0.2 &&
        rect.bottom >= window.innerHeight * 0.55
      );
    };

    const bumpIdleRelease = () => {
      // Only allow unlock after the hard lock window
      const remaining = lockUntilRef.current - performance.now();
      if (remaining > 0) {
        if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = window.setTimeout(() => {
          idleTimerRef.current = window.setTimeout(() => {
            lockedRef.current = false;
            accumRef.current = 0;
          }, GESTURE_IDLE_MS);
        }, remaining);
        return;
      }
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false;
        accumRef.current = 0;
      }, GESTURE_IDLE_MS);
    };

    const onWheel = (e: WheelEvent) => {
      const nowIn = inProjectsZone();

      if (nowIn && !wasInZone) {
        wasInZone = true;
        lockedRef.current = true;
        lockUntilRef.current = performance.now() + 450;
        accumRef.current = 0;
        bumpIdleRelease();
        e.preventDefault();
        return;
      }
      if (!nowIn) {
        wasInZone = false;
        return;
      }

      const cur = indexRef.current;
      const down = e.deltaY > 0;
      const up = e.deltaY < 0;
      if (!down && !up) return;

      if (lockedRef.current) {
        bumpIdleRelease();
        e.preventDefault();
        return;
      }

      if (up && cur === 0) {
        accumRef.current = 0;
        wasInZone = false;
        return;
      }
      if (down && cur === COUNT - 1) {
        accumRef.current = 0;
        wasInZone = false;
        return;
      }

      e.preventDefault();
      accumRef.current += e.deltaY;

      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return;

      const dir: 1 | -1 = accumRef.current > 0 ? 1 : -1;
      accumRef.current = 0;
      step(dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const y = e.changedTouches[0]?.clientY ?? touchY.current;
      const dy = touchY.current - y;
      touchY.current = null;
      if (Math.abs(dy) < 48) return;

      const rect = section.getBoundingClientRect();
      const inZone =
        rect.top <= window.innerHeight * 0.25 &&
        rect.bottom >= window.innerHeight * 0.5;
      if (!inZone) return;
      if (lockedRef.current) return;

      const cur = indexRef.current;
      if (dy > 0) {
        if (cur >= COUNT - 1) return; // let page continue down
        step(1);
      } else {
        if (cur <= 0) return; // let page continue up
        step(-1);
      }
    };

    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onEnd);
    };
  }, [step]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full"
      aria-labelledby="projects-scroll-heading"
    >
      <div
        className="flex h-[100dvh] w-full flex-col overflow-hidden"
        style={{
          backgroundColor: "#fffbf1",
          backgroundImage: `
            linear-gradient(rgba(1, 97, 70, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 97, 70, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1200px] shrink-0 items-end justify-between px-[20px] pt-[20px] sm:px-[32px] sm:pt-[28px] md:px-[48px] md:pt-[32px]">
          <h2
            id="projects-scroll-heading"
            className="m-0 text-[18px] font-bold uppercase tracking-[-0.02em] text-forest sm:text-[22px] md:text-[26px]"
          >
            {"// : PROJECTS"}
          </h2>
          <p className="m-0 hidden text-[12px] font-medium text-forest/50 sm:block">
            {index + 1} / {COUNT}
          </p>
        </div>

        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${COUNT * 100}vw`,
              transform: `translate3d(-${index * 100}vw, 0, 0)`,
              transition: `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
            }}
          >
            {SHOWCASE_PROJECTS.map((project, i) => (
              <div
                key={project.id}
                className="relative flex h-full w-screen shrink-0 items-center justify-center px-[16px] py-[16px] sm:px-[40px] sm:py-[20px] md:px-[56px]"
              >
                <ProjectCard
                  project={project}
                  index={i}
                  active={i === index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
