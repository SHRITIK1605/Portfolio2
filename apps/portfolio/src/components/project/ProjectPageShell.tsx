"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import PdfFrame from "@/components/project/PdfFrame";
import ProjectCarousel from "@/components/project/ProjectCarousel";
import { resolveProjectPdfUrl } from "@/lib/pdf";
import { decodeSlugParam, projectPath } from "@/lib/slug";
import type { HomepageSettings, Project } from "@/types";

interface ProjectPageShellProps {
  projects: Project[];
  initialSlug: string;
  homepage: HomepageSettings;
}

function trackProjectView(projectId: string) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "PROJECT_VIEW", projectId }),
  }).catch(() => {});
}

export default function ProjectPageShell({
  projects,
  initialSlug,
  homepage,
}: ProjectPageShellProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);

  useEffect(() => {
    setActiveSlug(initialSlug);
  }, [initialSlug]);

  const project = useMemo(
    () => projects.find((item) => item.slug === activeSlug) ?? projects[0],
    [projects, activeSlug]
  );

  useEffect(() => {
    if (!project) return;
    trackProjectView(project.id);
  }, [project?.id]);

  const navigateTo = useCallback(
    (nextSlug: string) => {
      if (nextSlug === activeSlug) return;
      setActiveSlug(nextSlug);
      window.history.pushState({ slug: nextSlug }, "", projectPath(nextSlug));
    },
    [activeSlug]
  );

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/\/project\/([^/]+)/);
      if (!match) return;
      setActiveSlug(decodeSlugParam(match[1]));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (!project) return null;

  const pdfUrl = resolveProjectPdfUrl(project);

  return (
    <div className="min-h-screen bg-cream pb-[32px] sm:pb-[48px]">
      <Navbar homepage={homepage} />
      <main className="mx-auto max-w-[1100px] px-[16px] pt-[24px] sm:px-[24px] sm:pt-[32px] md:px-[48px] md:pt-[40px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="m-0 text-[28px] font-normal leading-[1.1] tracking-[-0.02em] text-forest sm:text-[36px] md:font-serif md:text-[48px] md:leading-[1.08]">
              {project.title}
            </h1>

            <div className="mt-[14px] flex flex-nowrap items-center gap-[8px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-[20px] sm:gap-[10px]">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex shrink-0 items-center rounded-full bg-tag-blue px-[12px] py-[6px] text-[12px] font-medium text-forest sm:px-[14px] sm:py-[7px] sm:text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-[18px] m-0 max-w-[900px] text-[14px] leading-[1.5] text-forest sm:mt-[24px] sm:text-[15.5px] sm:leading-[1.45]">
              <strong className="font-bold not-italic">Project Overview:</strong>{" "}
              <em>{project.longDescription}</em>
            </p>

            <div className="mt-[24px] sm:mt-[32px]">
              <PdfFrame url={pdfUrl} />
            </div>
          </motion.div>
        </AnimatePresence>

        <ProjectCarousel
          projects={projects}
          activeSlug={project.slug}
          onNavigate={navigateTo}
        />
      </main>
      <ChatPanel projectId={project.id} projectTitle={project.title} />
    </div>
  );
}
