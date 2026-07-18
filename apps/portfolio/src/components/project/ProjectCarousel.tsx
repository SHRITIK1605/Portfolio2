"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

interface ProjectCarouselProps {
  projects: Project[];
  activeSlug: string;
  /** Client-side switch without full page reload (project detail navigator). */
  onNavigate?: (slug: string) => void;
}

export default function ProjectCarousel({
  projects,
  activeSlug,
  onNavigate,
}: ProjectCarouselProps) {
  const currentIndex = projects.findIndex((p) => p.slug === activeSlug);

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  const goTo = (slug: string) => {
    if (onNavigate) {
      onNavigate(slug);
      return;
    }
  };

  const pillClass = (slug: string) =>
    `shrink-0 rounded-full px-[16px] py-[6px] text-[14px] transition ${
      slug === activeSlug
        ? "bg-carousel-active font-semibold text-forest"
        : "font-normal text-forest/55 hover:text-forest"
    }`;

  return (
    <div className="mx-auto mt-[48px] max-w-[1100px] rounded-full border border-forest/[0.1] bg-white/80 px-[16px] py-[12px] shadow-[0_1px_8px_rgba(0,75,64,0.05)] backdrop-blur-sm">
      <div className="flex items-center gap-[12px] overflow-x-auto">
        <span className="shrink-0 pl-[4px] text-[14px] font-medium text-forest/60">
          View more
        </span>

        {onNavigate ? (
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && goTo(prev.slug)}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20 disabled:opacity-30"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-[16px] w-[16px]" />
          </button>
        ) : (
          <NavArrow href={prev ? projectPath(prev.slug) : undefined} label="Previous project">
            <ChevronLeft className="h-[16px] w-[16px]" />
          </NavArrow>
        )}

        <div className="flex flex-1 items-center gap-[8px] overflow-x-auto">
          {projects.map((project) =>
            onNavigate ? (
              <button
                key={project.id}
                type="button"
                onClick={() => goTo(project.slug)}
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
                className={pillClass(project.slug)}
              >
                {project.title}
              </Link>
            )
          )}
        </div>

        {onNavigate ? (
          <button
            type="button"
            disabled={!next}
            onClick={() => next && goTo(next.slug)}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20 disabled:opacity-30"
            aria-label="Next project"
          >
            <ChevronRight className="h-[16px] w-[16px]" />
          </button>
        ) : (
          <NavArrow href={next ? projectPath(next.slug) : undefined} label="Next project">
            <ChevronRight className="h-[16px] w-[16px]" />
          </NavArrow>
        )}
      </div>
    </div>
  );
}

function NavArrow({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span
        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20 opacity-30"
        aria-hidden
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      prefetch
      scroll={false}
      className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20"
      aria-label={label}
    >
      {children}
    </Link>
  );
}
