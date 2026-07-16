"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

interface ProjectCarouselProps {
  projects: Project[];
  activeSlug: string;
}

export default function ProjectCarousel({
  projects,
  activeSlug,
}: ProjectCarouselProps) {
  const router = useRouter();
  const currentIndex = projects.findIndex((p) => p.slug === activeSlug);

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto mt-[48px] max-w-[1100px] rounded-full border border-forest/[0.1] bg-white/80 px-[16px] py-[12px] shadow-[0_1px_8px_rgba(0,75,64,0.05)] backdrop-blur-sm">
      <div className="flex items-center gap-[12px] overflow-x-auto">
        <span className="shrink-0 pl-[4px] text-[14px] font-medium text-forest/60">
          View more
        </span>

        <button
          type="button"
          disabled={!prev}
          onClick={() => prev && router.push(projectPath(prev.slug))}
          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20 disabled:opacity-30"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-[16px] w-[16px]" />
        </button>

        <div className="flex flex-1 items-center gap-[8px] overflow-x-auto">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => router.push(projectPath(project.slug))}
              className={`shrink-0 rounded-full px-[16px] py-[6px] text-[14px] transition ${
                project.slug === activeSlug
                  ? "bg-carousel-active font-semibold text-forest"
                  : "font-normal text-forest/55 hover:text-forest"
              }`}
            >
              {project.title}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!next}
          onClick={() => next && router.push(projectPath(next.slug))}
          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-forest/20 disabled:opacity-30"
          aria-label="Next project"
        >
          <ChevronRight className="h-[16px] w-[16px]" />
        </button>
      </div>
    </div>
  );
}
