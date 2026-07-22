"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { projectPath } from "@/lib/slug";

interface ProjectCardsProps {
  projects: Project[];
}

export default function ProjectCards({ projects }: ProjectCardsProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-forest/15 bg-white px-[24px] py-[48px] text-center text-[15px] text-forest/60">
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
    <div className="grid gap-6 md:grid-cols-2 md:gap-7">
      {projects.map((project, index) => (
        <motion.article
          key={project.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          whileHover={{ y: -3 }}
          className="group overflow-hidden rounded-[20px] border border-forest/12 bg-white shadow-[0_8px_28px_rgba(1,97,70,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(1,97,70,0.12)]"
        >
          <Link
            href={projectPath(project.slug)}
            className="block"
            aria-label={`View project: ${project.title}`}
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
            <div className="aspect-[16/10] overflow-hidden bg-[#f3f6f1]">
              {project.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                      src={project.coverImageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[14px] text-forest/35">
                  No cover image
                </div>
              )}
            </div>

            <div className="flex items-start justify-between gap-3 bg-white px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
              <h3 className="m-0 min-w-0 flex-1 line-clamp-2 text-[16px] font-bold leading-[1.3] tracking-[-0.02em] text-black sm:text-[18px]">
                {project.title}
              </h3>

              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-[#fffbf1] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-10"
                aria-hidden
              >
                <ArrowUpRight className="h-[16px] w-[16px]" strokeWidth={2.25} />
              </span>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
