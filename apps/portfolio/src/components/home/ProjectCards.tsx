"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

interface ProjectCardsProps {
  projects: Project[];
}

export default function ProjectCards({ projects }: ProjectCardsProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-forest/20 bg-white/40 px-[24px] py-[48px] text-center text-[15px] text-forest/60">
        No projects published yet. Add projects from the{" "}
        <a
          href={process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"}
          className="font-medium text-forest underline"
          target="_blank"
          rel="noreferrer"
        >
          admin dashboard
        </a>
        .
      </div>
    );
  }

  return (
    <div className="grid gap-[24px] md:grid-cols-2">
      {projects.map((project, index) => (
        <motion.article
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.06, duration: 0.4 }}
          whileHover={{ y: -4 }}
          className="group overflow-hidden rounded-[24px] border border-forest/10 bg-white shadow-[0_1px_8px_rgba(0,75,64,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,75,64,0.1)]"
        >
          <Link
            href={projectPath(project.slug)}
            className="block"
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
          >
            <div className="aspect-[16/10] overflow-hidden bg-forest/[0.04]">
              {project.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.coverImageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[14px] text-forest/30">
                  No cover image
                </div>
              )}
            </div>
            <div className="p-[18px] sm:p-[24px]">
              <h3 className="m-0 text-[20px] font-bold leading-tight tracking-[-0.02em] text-forest sm:text-[22px]">
                {project.title}
              </h3>
              <p className="mt-[10px] line-clamp-2 text-[14px] leading-[1.5] text-forest/75 sm:mt-[12px]">
                {project.shortDescription}
              </p>
              <div className="mt-[14px] flex flex-nowrap items-center gap-[8px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-[16px]">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex shrink-0 items-center rounded-full bg-tag-blue px-[12px] py-[6px] text-[12px] font-medium text-forest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-[16px] inline-flex items-center gap-[6px] text-[14px] font-semibold text-forest transition-all group-hover:gap-[10px] sm:mt-[20px]">
                View project
                <ArrowRight className="h-[16px] w-[16px]" />
              </span>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
