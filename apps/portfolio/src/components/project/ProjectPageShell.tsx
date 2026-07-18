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
    <div className="min-h-screen bg-cream pb-[48px]">
      <Navbar homepage={homepage} />
      <main className="mx-auto max-w-[1100px] px-[48px] pt-[40px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="m-0 font-serif text-[48px] font-normal leading-[1.08] tracking-[-0.02em] text-forest">
              {project.title}
            </h1>

            <div className="mt-[20px] flex flex-nowrap items-center gap-[10px] overflow-x-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex shrink-0 items-center rounded-full bg-tag-blue px-[14px] py-[7px] text-[13px] font-medium text-forest"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-[24px] m-0 max-w-[900px] text-[15.5px] leading-[1.45] text-forest">
              <strong className="font-bold not-italic">Project Overview:</strong>{" "}
              <em>{project.longDescription}</em>
            </p>

            <div className="mt-[32px]">
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
