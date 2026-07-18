"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

interface ProjectCarouselProps {
  projects: Project[];
  activeSlug: string;
  /** Client-side switch without full page reload (project detail navigator). */
  onNavigate?: (slug: string) => void;
}

const SCROLL_STEP = 220;

export default function ProjectCarousel({
  projects,
  activeSlug,
  onNavigate,
}: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(track.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Keep the active pill visible when the project changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSlug]);

  const scrollBy = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const pillClass = (slug: string) =>
    `shrink-0 rounded-full px-[14px] py-[8px] text-[13px] transition sm:px-[16px] sm:text-[14px] ${
      slug === activeSlug
        ? "bg-carousel-active font-semibold text-forest"
        : "font-normal text-forest/55 hover:text-forest"
    }`;

  return (
    <div className="mx-auto mt-[32px] max-w-[1100px] rounded-[28px] border border-forest/[0.1] bg-white/80 px-[10px] py-[10px] shadow-[0_1px_8px_rgba(0,75,64,0.05)] backdrop-blur-sm sm:mt-[40px] sm:rounded-full sm:px-[14px] sm:py-[12px] md:mt-[48px] md:px-[16px]">
      <div className="flex items-center gap-[8px] sm:gap-[12px]">
        <span className="hidden shrink-0 pl-[4px] text-[14px] font-medium text-forest/60 sm:inline">
          View more
        </span>

        <button
          type="button"
          disabled={!canScrollLeft}
          onClick={() => scrollBy(-1)}
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-forest/20 transition disabled:opacity-30 sm:h-[32px] sm:w-[32px]"
          aria-label="Scroll projects left"
        >
          <ChevronLeft className="h-[18px] w-[18px] sm:h-[16px] sm:w-[16px]" />
        </button>

        <div
          ref={trackRef}
          className="flex flex-1 items-center gap-[6px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-[8px]"
        >
          {projects.map((project) =>
            onNavigate ? (
              <button
                key={project.id}
                type="button"
                data-active={project.slug === activeSlug}
                onClick={() => onNavigate(project.slug)}
                className={pillClass(project.slug)}
              >
                {project.title}
              </button>
            ) : (
              <Link
                key={project.id}
                href={projectPath(project.slug)}
                prefetch
                scroll={false}
                data-active={project.slug === activeSlug}
                className={pillClass(project.slug)}
              >
                {project.title}
              </Link>
            )
          )}
        </div>

        <button
          type="button"
          disabled={!canScrollRight}
          onClick={() => scrollBy(1)}
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-forest/20 transition disabled:opacity-30 sm:h-[32px] sm:w-[32px]"
          aria-label="Scroll projects right"
        >
          <ChevronRight className="h-[18px] w-[18px] sm:h-[16px] sm:w-[16px]" />
        </button>
      </div>
    </div>
  );
}
