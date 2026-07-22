"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/** How far the PDF drifts across a full page pass (subtle). */
const PAGE_PARALLAX = 0.28;
/** Ignore page-driven motion briefly after the user wheels the screen. */
const USER_SCROLL_LOCK_MS = 850;
const MAX_TV_PAGES = 12;
/** Lower = slower, creamier glide. */
const SCROLL_SMOOTH = 4.2;

interface TvPdfScreenProps {
  url: string;
  accent?: string;
  label?: string;
}

export default function TvPdfScreen({
  url,
  accent = "#f0b800",
  label = "PDF preview",
}: TvPdfScreenProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const userLockUntil = useRef(0);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const maxY = useRef(0);
  const rafRef = useRef(0);
  const lastFrame = useRef(0);
  const [visible, setVisible] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(220);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNumPages(0);
    setError(false);
    setReady(false);
    targetY.current = 0;
    currentY.current = 0;
    maxY.current = 0;
    if (contentRef.current) {
      contentRef.current.style.transform = "translate3d(0,0,0)";
    }
  }, [url]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { rootMargin: "220px 0px", threshold: 0.05 }
    );
    io.observe(shell);
    return () => io.disconnect();
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport) return;
    setPageWidth(Math.max(130, Math.floor(viewport.clientWidth)));
    if (content) {
      maxY.current = Math.max(0, content.scrollHeight - viewport.clientHeight);
      targetY.current = Math.min(targetY.current, maxY.current);
      currentY.current = Math.min(currentY.current, maxY.current);
    }
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [visible, ready, numPages, measure]);

  const updateTargetFromPage = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || maxY.current <= 0) return;
    if (performance.now() < userLockUntil.current) return;

    const rect = shell.getBoundingClientRect();
    const span = window.innerHeight + rect.height * 0.9;
    const progress = Math.min(
      1,
      Math.max(0, 1 - (rect.top + rect.height * 0.4) / span)
    );
    targetY.current = progress * maxY.current * PAGE_PARALLAX;
  }, []);

  useEffect(() => {
    if (!ready) return;

    lastFrame.current = performance.now();

    const tick = (now: number) => {
      const content = contentRef.current;
      const dt = Math.min(0.048, (now - lastFrame.current) / 1000);
      lastFrame.current = now;

      if (content) {
        const alpha = 1 - Math.exp(-dt * SCROLL_SMOOTH);
        currentY.current += (targetY.current - currentY.current) * alpha;
        // GPU transform — no scrollTop thrash / frame jump
        content.style.transform = `translate3d(0, ${-currentY.current}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => updateTargetFromPage();
    updateTargetFromPage();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ready, updateTargetFromPage, numPages]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e: WheelEvent) => {
      if (maxY.current <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      userLockUntil.current = performance.now() + USER_SCROLL_LOCK_MS;
      targetY.current = Math.min(
        maxY.current,
        Math.max(0, targetY.current + e.deltaY * 0.5)
      );
      // Ease toward manual target instead of hard snap
      // (currentY keeps lerping in the rAF loop)
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [visible, ready]);

  const bodyColor = accent;

  return (
    <div
      ref={shellRef}
      className="tv-shell relative mx-auto flex h-full w-full flex-col"
      style={{ maxHeight: "100%" }}
    >
      {/* Antenna nub */}
      <div
        className="pointer-events-none relative z-[2] mx-auto mb-[-2px] h-[12px] w-[40%]"
        aria-hidden
      >
        <span
          className="absolute bottom-0 left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full border border-black/25"
          style={{ backgroundColor: bodyColor }}
        />
        <span className="absolute bottom-[5px] left-[36%] h-[12px] w-[1.5px] origin-bottom -rotate-[26deg] rounded-full bg-[#2a2a28]" />
        <span className="absolute bottom-[5px] right-[36%] h-[12px] w-[1.5px] origin-bottom rotate-[26deg] rounded-full bg-[#2a2a28]" />
      </div>

      {/* Chunky CRT shell — thick top/left like references */}
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-black/20 sm:rounded-[22px]"
        style={{
          backgroundColor: bodyColor,
          backgroundImage: `
            linear-gradient(160deg, rgba(255,255,255,0.28) 0%, transparent 42%, rgba(0,0,0,0.12) 100%),
            radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.2), transparent 55%)
          `,
          boxShadow:
            "0 10px 22px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.08)",
        }}
      >
        {/* Thick frame padding: top/left heavier */}
        <div className="relative z-[1] flex min-h-0 flex-1 gap-[6px] pb-[8px] pl-[14px] pr-[8px] pt-[15px] sm:gap-[8px] sm:pb-[9px] sm:pl-[16px] sm:pr-[9px] sm:pt-[17px]">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {/* Cream recessed inner + thin black CRT gasket */}
            <div
              className="relative min-h-0 flex-1 rounded-[14px] p-[5px] sm:rounded-[16px] sm:p-[6px]"
              style={{
                background:
                  "linear-gradient(180deg, #f4efe6 0%, #e8e0d2 100%)",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <div
                className="relative h-full min-h-0 overflow-hidden rounded-[10px] bg-[#0e0e0e] p-[2.5px] sm:rounded-[12px]"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px #1a1a1a, inset 0 0 14px rgba(0,0,0,0.55)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-[2.5px] z-[2] rounded-[8px] opacity-30 sm:rounded-[10px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 32%, transparent 68%, rgba(0,0,0,0.15) 100%)",
                  }}
                  aria-hidden
                />
                <div
                  ref={viewportRef}
                  role="region"
                  aria-label={label}
                  className="tv-screen relative h-full overflow-hidden rounded-[7px] bg-[#f7f3ea] sm:rounded-[9px]"
                >
                  {!visible ? (
                    <div className="flex h-full items-center justify-center text-[11px] text-black/45">
                      Warming up…
                    </div>
                  ) : error ? (
                    <div className="flex h-full flex-col items-center justify-center gap-[8px] p-[10px] text-center text-[10px] text-black/60">
                      <span>Preview unavailable</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open PDF
                      </a>
                    </div>
                  ) : (
                    <div
                      ref={contentRef}
                      className="will-change-transform"
                      style={{ transform: "translate3d(0,0,0)" }}
                    >
                      <Document
                        key={url}
                        file={url}
                        onLoadSuccess={({ numPages: pages }) => {
                          setNumPages(pages);
                          setReady(true);
                          requestAnimationFrame(measure);
                        }}
                        onLoadError={() => setError(true)}
                        loading={
                          <div className="flex h-[160px] items-center justify-center text-[11px] text-black/45">
                            Tuning in…
                          </div>
                        }
                        className="flex flex-col items-center"
                      >
                        {Array.from(
                          { length: Math.min(numPages, MAX_TV_PAGES) },
                          (_, i) => (
                            <Page
                              key={`tv-page-${i + 1}`}
                              pageNumber={i + 1}
                              width={pageWidth}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              onRenderSuccess={measure}
                            />
                          )
                        )}
                      </Document>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right control column */}
          <div
            className="flex w-[28px] shrink-0 flex-col items-center gap-[7px] rounded-[10px] py-[8px] sm:w-[32px] sm:gap-[8px] sm:rounded-[12px] sm:py-[10px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0.08) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
            aria-hidden
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                className="relative flex h-[16px] w-[16px] items-center justify-center rounded-full sm:h-[18px] sm:w-[18px]"
                style={{
                  background: `
                    radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), transparent 42%),
                    linear-gradient(145deg, #4a4a48, #1c1c1a)
                  `,
                  boxShadow:
                    "0 2px 3px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(0,0,0,0.35)",
                }}
              >
                <span
                  className="absolute h-[6px] w-[2px] rounded-full bg-[#ddd8ce]"
                  style={{
                    transform:
                      i === 0
                        ? "translateY(-2px)"
                        : "translate(2px, -1px) rotate(32deg)",
                  }}
                />
                {/* ridged ring */}
                <span
                  className="absolute inset-[-2px] rounded-full opacity-40"
                  style={{
                    background: `repeating-conic-gradient(
                      from 0deg,
                      transparent 0deg 12deg,
                      rgba(0,0,0,0.35) 12deg 16deg
                    )`,
                  }}
                />
              </span>
            ))}
            <span
              className="h-[5px] w-[5px] rounded-full border border-black/20 bg-[#2a2a28]"
              style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)" }}
            />
            {/* Vertical speaker slats */}
            <div
              className="mt-auto w-[70%] flex-1 overflow-hidden rounded-[3px]"
              style={{
                minHeight: 26,
                background: "rgba(0,0,0,0.18)",
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  transparent 2px,
                  rgba(0,0,0,0.35) 2px,
                  rgba(0,0,0,0.35) 3px
                )`,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>

        {/* Bottom speaker grille — horizontal slits across face */}
        <div
          className="relative z-[1] mx-[11px] mb-[6px] flex h-[11px] shrink-0 items-stretch gap-[6px] sm:mx-[13px] sm:mb-[7px] sm:h-[12px]"
          aria-hidden
        >
          <div
            className="flex-1 overflow-hidden rounded-[3px]"
            style={{
              background: "rgba(0,0,0,0.16)",
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 1.5px,
                rgba(0,0,0,0.4) 1.5px,
                rgba(0,0,0,0.4) 2.5px
              )`,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="w-[28%] overflow-hidden rounded-[3px] sm:w-[26%]"
            style={{
              background: "rgba(0,0,0,0.16)",
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 1.5px,
                rgba(0,0,0,0.4) 1.5px,
                rgba(0,0,0,0.4) 2.5px
              )`,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Peg feet */}
        <div
          className="flex shrink-0 justify-between px-[16px] pb-[5px]"
          aria-hidden
        >
          <span
            className="h-[5px] w-[10px] rounded-[2px]"
            style={{
              backgroundColor: bodyColor,
              boxShadow: "0 2px 2px rgba(0,0,0,0.2)",
              filter: "brightness(0.85)",
            }}
          />
          <span
            className="h-[5px] w-[10px] rounded-[2px]"
            style={{
              backgroundColor: bodyColor,
              boxShadow: "0 2px 2px rgba(0,0,0,0.2)",
              filter: "brightness(0.85)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
