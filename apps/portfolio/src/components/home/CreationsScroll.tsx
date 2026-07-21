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
const STEP_MS = 650;

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
 * Wheel/touch down → next (right); up → previous (left).
 * After the 4th card, further down-scroll releases smoothly into cases.
 */
export default function CreationsScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const lockRef = useRef(false);
  const indexRef = useRef(0);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goToCases = useCallback(() => {
    const cases = document.getElementById("selected-product-cases");
    if (cases) {
      cases.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      const cur = indexRef.current;

      if (dir === 1 && cur >= COUNT - 1) {
        lockRef.current = true;
        goToCases();
        window.setTimeout(() => {
          lockRef.current = false;
        }, 900);
        return;
      }
      if (dir === -1 && cur <= 0) return;

      lockRef.current = true;
      setIndex(cur + dir);
      window.setTimeout(() => {
        lockRef.current = false;
      }, STEP_MS);
    },
    [goToCases]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        const top = entry.boundingClientRect.top;
        // Pin while the section owns the viewport
        setPinned(ratio > 0.55 && top < window.innerHeight * 0.35);
      },
      { threshold: [0.35, 0.55, 0.7, 0.9] }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inZone =
        rect.top <= 80 && rect.bottom >= window.innerHeight * 0.55;
      if (!inZone) return;

      const cur = indexRef.current;
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // At first card scrolling up → leave section
      if (goingUp && cur === 0 && rect.top >= -2) {
        return;
      }

      // At last card scrolling down → release to cases (still prevent jumpiness once)
      if (goingDown && cur >= COUNT - 1) {
        e.preventDefault();
        step(1);
        return;
      }

      if (goingDown || goingUp) {
        e.preventDefault();
        step(goingDown ? 1 : -1);
      }
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
      if (Math.abs(dy) < 40) return;

      const rect = section.getBoundingClientRect();
      const inZone =
        rect.top <= 100 && rect.bottom >= window.innerHeight * 0.45;
      if (!inZone) return;

      const cur = indexRef.current;
      if (dy > 0) step(1);
      else if (cur > 0) step(-1);
    };

    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onEnd);
    };
  }, [step]);

  // Keep section aligned when pinned so Experience doesn't peek oddly
  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (Math.abs(window.scrollY - top) > 4) {
      window.scrollTo({ top, behavior: "auto" });
    }
  }, [pinned, index]);

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
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              width: `${COUNT * 100}vw`,
              transform: `translate3d(-${index * 100}vw, 0, 0)`,
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
