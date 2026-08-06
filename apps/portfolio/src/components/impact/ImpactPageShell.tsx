"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import ProjectCarousel from "@/components/project/ProjectCarousel";
import type { ImpactDetailItem } from "@/lib/impact-data";
import { toFullImpactPdfUrl } from "@/lib/tv-pdf";
import { decodeSlugParam, impactPath } from "@/lib/slug";
import type { HomepageSettings } from "@/types";

const PdfFrame = dynamic(() => import("@/components/project/PdfFrame"), {
  ssr: false,
  loading: () => <PdfPlaceholder label="Loading PDF…" />,
});

function PdfPlaceholder({ label }: { label?: string }) {
  return (
    <div
      className="flex min-h-[420px] animate-pulse items-center justify-center rounded-[20px] border border-forest/[0.08] bg-white text-[14px] text-forest/45 shadow-[0_2px_16px_rgba(0,75,64,0.06)]"
      aria-label={label}
    >
      {label ?? "Loading PDF…"}
    </div>
  );
}

interface ImpactPageShellProps {
  items: ImpactDetailItem[];
  initialSlug: string;
  homepage: HomepageSettings;
}

export default function ImpactPageShell({
  items,
  initialSlug,
  homepage,
}: ImpactPageShellProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  /** Defer heavy react-pdf until after shell paint so nav feels instant. */
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    setActiveSlug(initialSlug);
  }, [initialSlug]);

  useEffect(() => {
    setPdfReady(false);
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setPdfReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 280 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [activeSlug]);

  const item = useMemo(
    () => items.find((entry) => entry.slug === activeSlug) ?? items[0],
    [items, activeSlug],
  );

  const navigateTo = useCallback(
    (nextSlug: string) => {
      if (nextSlug === activeSlug) return;
      setActiveSlug(nextSlug);
      window.history.pushState({ slug: nextSlug }, "", impactPath(nextSlug));
    },
    [activeSlug],
  );

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/\/impact\/([^/]+)/);
      if (!match) return;
      // Ignore static PDF paths under /impact/*.pdf and /impact/tv/*
      if (match[1].includes(".")) return;
      setActiveSlug(decodeSlugParam(match[1]));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (!item) return null;

  const pdfUrl = toFullImpactPdfUrl(item.pdfUrl);
  const carouselItems = items.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.label,
  }));

  return (
    <div className="min-h-screen overflow-x-clip bg-cream pb-[32px] sm:pb-[48px]">
      <Navbar homepage={homepage} />
      <main className="mx-auto max-w-[1100px] px-[16px] pt-[24px] sm:px-[24px] sm:pt-[32px] md:px-[48px] md:pt-[40px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <h1 className="m-0 break-words text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-black sm:text-[36px] sm:leading-[1.1] md:font-serif md:text-[48px] md:leading-[1.08]">
              {item.title}
            </h1>

            <p className="mt-[18px] m-0 max-w-[900px] break-words text-[14px] leading-[1.5] text-forest sm:mt-[24px] sm:text-[15.5px] sm:leading-[1.45]">
              <strong className="font-bold not-italic">Project Overview:</strong>{" "}
              <em>{item.body}</em>
            </p>

            <div className="mt-[24px] sm:mt-[32px]">
              {pdfUrl ? (
                pdfReady ? (
                  <PdfFrame url={pdfUrl} />
                ) : (
                  <PdfPlaceholder label="Loading PDF…" />
                )
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-[10px] rounded-[20px] border border-forest/10 bg-white px-[24px] text-center text-[14px] text-forest/55">
                  <span className="font-medium text-forest/70">
                    Case study PDF coming soon
                  </span>
                  <span>
                    The deck for {item.label} is still being prepared. Check back
                    shortly. You can switch to other IMPACT projects below.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <ProjectCarousel
          projects={carouselItems}
          activeSlug={item.slug}
          onNavigate={navigateTo}
          hrefForSlug={impactPath}
          leadingLabel="Impact"
        />
      </main>
      <ChatPanel />
    </div>
  );
}
