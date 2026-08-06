"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
/** Cap DPR so off-path retina phones don't rasterize at 3× unnecessarily. */
const MAX_DEVICE_PIXEL_RATIO = 2;
/** Skeleton placeholders below the live render frontier (does not block page 1). */
const SKELETON_AHEAD = 2;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function touchDistance(touches: React.TouchList) {
  const a = touches[0];
  const b = touches[1];
  if (!a || !b) return 0;
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

function pageSkeletonHeight(width: number) {
  // Landscape case-study decks are common; keep placeholders compact.
  return Math.round(width * 0.62);
}

function PageSkeleton({ width, label }: { width: number; label?: string }) {
  return (
    <div
      className="flex animate-pulse items-center justify-center rounded-[4px] bg-forest/[0.04]"
      style={{ width, height: pageSkeletonHeight(width) }}
      aria-hidden={!label}
      aria-label={label}
    >
      {label ? (
        <span className="text-[13px] text-forest/35">{label}</span>
      ) : null}
    </div>
  );
}

interface PdfFrameProps {
  url: string;
}

export default function PdfFrame({ url }: PdfFrameProps) {
  const [numPages, setNumPages] = useState(0);
  /** How many pages are mounted for react-pdf to render (grows 1 → N). */
  const [visiblePages, setVisiblePages] = useState(0);
  const [baseWidth, setBaseWidth] = useState(680);
  const [contentHeight, setContentHeight] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    setNumPages(0);
    setVisiblePages(0);
    setContentHeight(0);
    setZoom(1);
    setError(false);
  }, [url]);

  useEffect(() => {
    const updateDpr = () => {
      setDevicePixelRatio(
        Math.min(
          MAX_DEVICE_PIXEL_RATIO,
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
        )
      );
    };
    updateDpr();
    window.addEventListener("resize", updateDpr);
    return () => window.removeEventListener("resize", updateDpr);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ startDistance: number; startZoom: number } | null>(
    null
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => {
      const pad = node.clientWidth < 480 ? 24 : 48;
      setBaseWidth(Math.max(260, Math.min(node.clientWidth - pad, 720)));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setContentHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [numPages, visiblePages, baseWidth]);

  const applyZoom = useCallback((next: number | ((prev: number) => number)) => {
    setZoom((prev) =>
      clampZoom(typeof next === "function" ? next(prev) : next)
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
        applyZoom((prev) => prev * factor);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  const advanceAfterPage = useCallback(
    (pageNumber: number) => {
      setVisiblePages((prev) => {
        // Only the frontier page may unlock the next one (sequential load).
        if (pageNumber !== prev || prev >= numPages) return prev;
        return prev + 1;
      });
    },
    [numPages]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      applyZoom((prev) => prev + ZOOM_STEP);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      applyZoom((prev) => prev - ZOOM_STEP);
    } else if (e.key === "0") {
      e.preventDefault();
      applyZoom(1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        startDistance: touchDistance(e.touches),
        startZoom: zoom,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    e.preventDefault();
    const distance = touchDistance(e.touches);
    const ratio = distance / pinchRef.current.startDistance;
    applyZoom(pinchRef.current.startZoom * ratio);
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  if (error) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-[12px] rounded-[20px] border border-forest/10 bg-white text-[14px] text-forest/50">
        <span>Unable to load PDF preview.</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-forest/20 px-[16px] py-[8px] text-[13px] font-medium text-forest hover:bg-forest/5"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  const remainingAfterVisible = Math.max(0, numPages - visiblePages);
  const skeletonCount = Math.min(SKELETON_AHEAD, remainingAfterVisible);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[20px] border border-forest/[0.08] bg-white shadow-[0_2px_16px_rgba(0,75,64,0.06)]"
    >
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="PDF viewer. Pinch or Ctrl+scroll to zoom. Press +, -, or 0 to adjust zoom."
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="max-h-[70vh] overflow-auto bg-white px-[12px] py-[12px] outline-none focus-visible:ring-2 focus-visible:ring-forest/20 sm:max-h-[640px] sm:px-[24px] sm:py-[24px] touch-pan-y"
      >
        <div
          className="relative mx-auto"
          style={{
            width: baseWidth * zoom,
            height: contentHeight * zoom || undefined,
          }}
        >
          <div
            ref={contentRef}
            className="absolute left-0 top-0 origin-top-left will-change-transform"
            style={{
              width: baseWidth,
              transform: `scale(${zoom})`,
            }}
          >
            <Document
              key={url}
              file={url}
              onLoadSuccess={({ numPages: pages }) => {
                setNumPages(pages);
                // Paint page 1 immediately; later pages unlock on each render success.
                setVisiblePages(pages > 0 ? 1 : 0);
              }}
              onLoadError={() => setError(true)}
              loading={
                <div className="flex h-[420px] items-center justify-center text-[14px] text-forest/45">
                  Loading PDF…
                </div>
              }
              className="flex flex-col items-center gap-[16px]"
            >
              {Array.from({ length: visiblePages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <Page
                    key={`page-${pageNumber}`}
                    pageNumber={pageNumber}
                    width={baseWidth}
                    devicePixelRatio={devicePixelRatio}
                    className="shadow-[0_2px_12px_rgba(0,75,64,0.08)]"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <PageSkeleton
                        width={baseWidth}
                        label={
                          pageNumber === 1 ? "Loading first page…" : undefined
                        }
                      />
                    }
                    onRenderSuccess={() => advanceAfterPage(pageNumber)}
                    onRenderError={() => {
                      // Skip a failed page so the rest of the deck can still load.
                      advanceAfterPage(pageNumber);
                    }}
                  />
                );
              })}
              {Array.from({ length: skeletonCount }, (_, index) => (
                <PageSkeleton
                  key={`skeleton-${visiblePages + index + 1}`}
                  width={baseWidth}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
