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
/** Block further steps after a card change (must clear; reverse can cancel). */
const STEP_LOCK_MS = 900;
/** After landing on 1st/4th card, absorb leftover flick before section exit. */
const EDGE_SETTLE_MS = 550;
/** Smooth handoff to Cases / Experience (slower exit from project 4). */
const HANDOFF_MS = 1250;
/** Accumulated delta before one step. */
const WHEEL_THRESHOLD = 42;
/** Horizontal slide duration. */
const SLIDE_MS = 850;

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
 * PROJECTS — tall scroll runway + pinned stage.
 * Same wheel behavior over cards or empty stage; dash nav for direct jumps.
 */
export default function CreationsScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pinMode, setPinMode] = useState<"before" | "pin" | "after">(
    "before"
  );
  const indexRef = useRef(0);
  const touchY = useRef<number | null>(null);
  const lockUntilRef = useRef(0);
  const accumRef = useRef(0);
  const snapTimerRef = useRef<number | null>(null);
  const programmaticRef = useRef(false);
  const handoffRef = useRef(false);
  /** False right after arriving on card 1 or 4 — blocks exit until settle. */
  const edgeReadyRef = useRef(true);
  const edgeTimerRef = useRef<number | null>(null);
  const lastDirRef = useRef<1 | -1>(1);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(
    () => () => {
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      if (edgeTimerRef.current) window.clearTimeout(edgeTimerRef.current);
    },
    []
  );

  const isLocked = () =>
    performance.now() < lockUntilRef.current || handoffRef.current;

  const metrics = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return null;
    const vh = window.innerHeight;
    const start = section.offsetTop;
    const slot = vh;
    return {
      section,
      start,
      vh,
      slot,
      /** Last scrollY that still counts as "inside" projects (card 4). */
      maxPinY: start + (COUNT - 1) * slot,
    };
  }, []);

  const armLock = useCallback((ms = STEP_LOCK_MS) => {
    lockUntilRef.current = performance.now() + ms;
    accumRef.current = 0;
  }, []);

  const clearLock = useCallback(() => {
    lockUntilRef.current = 0;
    accumRef.current = 0;
  }, []);

  const requireEdgeSettle = useCallback(() => {
    edgeReadyRef.current = false;
    if (edgeTimerRef.current) window.clearTimeout(edgeTimerRef.current);
    edgeTimerRef.current = window.setTimeout(() => {
      edgeReadyRef.current = true;
    }, EDGE_SETTLE_MS);
  }, []);

  const animateScrollTo = useCallback(
    (top: number, duration = HANDOFF_MS) => {
      handoffRef.current = true;
      programmaticRef.current = true;
      armLock(duration + 160);
      const clamped = Math.max(0, top);
      window.scrollTo({ top: clamped, behavior: "smooth" });
      window.setTimeout(() => {
        window.scrollTo({ top: clamped, behavior: "auto" });
        handoffRef.current = false;
        programmaticRef.current = false;
        clearLock();
      }, duration);
    },
    [armLock, clearLock]
  );

  const scrollToIndex = useCallback(
    (i: number, opts?: { fromDot?: boolean; smooth?: boolean }) => {
      const m = metrics();
      if (!m) return;
      const next = Math.max(0, Math.min(COUNT - 1, i));
      const target = m.start + next * m.slot;
      if (next === indexRef.current && !opts?.fromDot) {
        armLock();
        if (next === 0 || next === COUNT - 1) requireEdgeSettle();
        return;
      }
      indexRef.current = next;
      setIndex(next);
      setPinMode("pin");
      const atEdge = next === 0 || next === COUNT - 1;
      if (opts?.smooth) {
        animateScrollTo(target, atEdge ? HANDOFF_MS : Math.min(HANDOFF_MS, 900));
      } else {
        programmaticRef.current = true;
        window.scrollTo({ top: target, behavior: "auto" });
        armLock(atEdge ? STEP_LOCK_MS + 280 : STEP_LOCK_MS);
        window.setTimeout(() => {
          programmaticRef.current = false;
        }, 50);
      }
      if (atEdge) requireEdgeSettle();
      else edgeReadyRef.current = true;
    },
    [animateScrollTo, armLock, metrics, requireEdgeSettle]
  );

  /** Leave projects downward — settle with Cases heading at top. */
  const exitToCases = useCallback(() => {
    const el =
      document.getElementById("selected-product-cases-heading") ||
      document.getElementById("selected-product-cases");
    const m = metrics();
    if (!el || !m) return;
    indexRef.current = COUNT - 1;
    setIndex(COUNT - 1);
    setPinMode("after");
    edgeReadyRef.current = true;
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    animateScrollTo(top, HANDOFF_MS);
  }, [animateScrollTo, metrics]);

  /** Leave projects upward — settle back into Experience. */
  const exitToExperience = useCallback(() => {
    const heading = document.getElementById("experience-heading");
    const m = metrics();
    indexRef.current = 0;
    setIndex(0);
    setPinMode("before");
    edgeReadyRef.current = true;
    if (heading) {
      const top =
        heading.getBoundingClientRect().top + window.scrollY - 28;
      animateScrollTo(Math.max(0, top), HANDOFF_MS);
      return;
    }
    if (m) animateScrollTo(Math.max(0, m.start - m.vh * 0.35), HANDOFF_MS);
  }, [animateScrollTo, metrics]);

  const syncFromScroll = useCallback(() => {
    const m = metrics();
    if (!m || programmaticRef.current || handoffRef.current) return;
    const { start, maxPinY, slot } = m;
    const y = window.scrollY;

    if (y < start - 2) {
      setPinMode("before");
      if (indexRef.current !== 0) {
        indexRef.current = 0;
        setIndex(0);
      }
      return;
    }
    if (y > maxPinY + 2) {
      setPinMode("after");
      if (indexRef.current !== COUNT - 1) {
        indexRef.current = COUNT - 1;
        setIndex(COUNT - 1);
      }
      return;
    }

    setPinMode("pin");
    const i = Math.max(
      0,
      Math.min(COUNT - 1, Math.round((y - start) / slot))
    );
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
      if (i === 0 || i === COUNT - 1) requireEdgeSettle();
    }
  }, [metrics, requireEdgeSettle]);

  useEffect(() => {
    const onScroll = () => {
      syncFromScroll();
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(() => {
        if (programmaticRef.current || handoffRef.current || isLocked()) return;
        const m = metrics();
        if (!m) return;
        const { start, slot, maxPinY } = m;
        const y = window.scrollY;
        if (y < start - 2 || y > maxPinY + 2) return;
        const nearest = Math.max(
          0,
          Math.min(COUNT - 1, Math.round((y - start) / slot))
        );
        const target = start + nearest * slot;
        if (Math.abs(y - target) > 12) {
          programmaticRef.current = true;
          indexRef.current = nearest;
          setIndex(nearest);
          window.scrollTo({ top: target, behavior: "auto" });
          window.setTimeout(() => {
            programmaticRef.current = false;
          }, 50);
        }
      }, 120);
    };

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [metrics, syncFromScroll]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const m = metrics();
      if (!m) return;
      const { start, vh, maxPinY } = m;
      const y = window.scrollY;
      const down = e.deltaY > 0;
      const up = e.deltaY < 0;
      if (!down && !up) return;

      const dir: 1 | -1 = down ? 1 : -1;
      const rect = m.section.getBoundingClientRect();

      // Pin by scroll position so card 4 stays hijacked (rect.bottom === vh at last slot)
      const pinned = y >= start - 2 && y <= maxPinY + 2;
      const approachingFromAbove =
        down && rect.top > 0 && rect.top < vh * 0.72;
      const approachingFromBelow =
        up && !pinned && rect.bottom < vh && rect.bottom > vh * 0.2;

      if (!approachingFromAbove && !approachingFromBelow && !pinned) {
        return;
      }

      // Direction change: clear stale accum + allow reverse to break a stuck lock
      if (dir !== lastDirRef.current) {
        accumRef.current = 0;
        lastDirRef.current = dir;
        if (!handoffRef.current && isLocked()) {
          clearLock();
        }
      }

      if (handoffRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (isLocked()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (approachingFromAbove) {
        e.preventDefault();
        e.stopPropagation();
        scrollToIndex(0, { smooth: true });
        return;
      }

      if (approachingFromBelow) {
        e.preventDefault();
        e.stopPropagation();
        scrollToIndex(COUNT - 1, { smooth: true });
        return;
      }

      const cur = indexRef.current;

      // Card 1 up → Experience (after settle)
      if (up && cur === 0) {
        accumRef.current = 0;
        e.preventDefault();
        e.stopPropagation();
        if (!edgeReadyRef.current) {
          window.scrollTo({ top: start, behavior: "auto" });
          return;
        }
        exitToExperience();
        return;
      }

      // Card 4 down → Cases (after settle) — never native-skip past 4
      if (down && cur === COUNT - 1) {
        accumRef.current = 0;
        e.preventDefault();
        e.stopPropagation();
        if (!edgeReadyRef.current) {
          window.scrollTo({ top: maxPinY, behavior: "auto" });
          return;
        }
        exitToCases();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Keep page stuck on current slot while accumulating
      window.scrollTo({
        top: start + cur * m.slot,
        behavior: "auto",
      });

      accumRef.current += e.deltaY;
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return;

      const stepDir: 1 | -1 = accumRef.current > 0 ? 1 : -1;
      accumRef.current = 0;
      lastDirRef.current = stepDir;
      // Lock immediately so the same gesture can't double-step
      armLock(STEP_LOCK_MS);
      scrollToIndex(cur + stepDir);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () =>
      window.removeEventListener("wheel", onWheel, {
        capture: true,
      } as EventListenerOptions);
  }, [
    armLock,
    clearLock,
    exitToCases,
    exitToExperience,
    metrics,
    scrollToIndex,
  ]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchY.current == null || isLocked()) return;
      const y = e.changedTouches[0]?.clientY ?? touchY.current;
      const dy = touchY.current - y;
      touchY.current = null;
      if (Math.abs(dy) < 40) return;

      const m = metrics();
      if (!m) return;
      const rect = m.section.getBoundingClientRect();
      if (rect.top > m.vh * 0.25 || rect.bottom < m.vh * 0.5) return;

      const cur = indexRef.current;
      if (dy > 0) {
        if (cur < COUNT - 1) scrollToIndex(cur + 1);
        else if (edgeReadyRef.current) exitToCases();
      } else if (cur > 0) {
        scrollToIndex(cur - 1);
      } else if (edgeReadyRef.current) {
        exitToExperience();
      }
    };

    stage.addEventListener("touchstart", onStart, { passive: true });
    stage.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", onStart);
      stage.removeEventListener("touchend", onEnd);
    };
  }, [exitToCases, exitToExperience, metrics, scrollToIndex]);

  const panelPosition =
    pinMode === "pin" ? ("fixed" as const) : ("absolute" as const);
  const panelInset =
    pinMode === "after"
      ? { top: "auto" as const, bottom: 0 }
      : { top: 0, bottom: "auto" as const };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${COUNT * 100}vh` }}
      aria-labelledby="projects-scroll-heading"
    >
      <div
        ref={stageRef}
        className="flex h-[100dvh] w-full flex-col overflow-hidden"
        style={{
          position: panelPosition,
          left: 0,
          right: 0,
          ...panelInset,
          height: "100vh",
          zIndex: pinMode === "pin" ? 20 : 1,
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

        {/* Progress dashes — 4 steps, clickable */}
        <div
          className="relative z-[5] flex shrink-0 items-center justify-center gap-[10px] pb-[22px] pt-[8px] sm:pb-[28px]"
          role="tablist"
          aria-label="Project slides"
        >
          {SHOWCASE_PROJECTS.map((project, i) => {
            const active = i === index;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Project ${i + 1}`}
                onClick={() => scrollToIndex(i, { fromDot: true })}
                className="group flex h-[28px] items-center justify-center border-0 bg-transparent p-0"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-300 ${
                    active
                      ? "w-[28px] bg-forest"
                      : "w-[14px] bg-forest/25 group-hover:bg-forest/45"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
