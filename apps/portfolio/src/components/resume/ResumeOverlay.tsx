"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Minus, Plus, X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;
const WHEEL_ZOOM_STEP = 0.08;
const DESKTOP_PAGE_WIDTH = 580;

function clampZoom(v: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));
}

function usePageWidth() {
  const [width, setWidth] = useState(DESKTOP_PAGE_WIDTH);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 480) setWidth(Math.max(280, vw - 48));
      else if (vw < 768) setWidth(Math.min(DESKTOP_PAGE_WIDTH, vw - 64));
      else setWidth(DESKTOP_PAGE_WIDTH);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

function touchDistance(touches: React.TouchList) {
  const a = touches[0];
  const b = touches[1];
  if (!a || !b) return 0;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

interface ResumeOverlayProps {
  open: boolean;
  onClose: () => void;
  fallbackUrl?: string | null;
}

export default function ResumeOverlay({
  open,
  onClose,
  fallbackUrl,
}: ResumeOverlayProps) {
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);
  const pageWidth = usePageWidth();

  const scrollRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ startDistance: number; startZoom: number } | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setZoom(1);
      setError(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Trackpad pinch fires wheel events with ctrlKey set
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1 + WHEEL_ZOOM_STEP : 1 - WHEEL_ZOOM_STEP;
        setZoom((prev) => clampZoom(prev * factor));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, error]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = {
          startDistance: touchDistance(e.touches),
          startZoom: zoom,
        };
      }
    },
    [zoom]
  );

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    e.preventDefault();
    const ratio = touchDistance(e.touches) / pinchRef.current.startDistance;
    setZoom(clampZoom(pinchRef.current.startZoom * ratio));
  }, []);

  const onTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-forest/45 backdrop-blur-[3px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-[760px] flex-col bg-white shadow-[12px_0_40px_rgba(0,75,64,0.2)]"
            role="dialog"
            aria-label="Resume viewer"
          >
            <header className="flex items-center justify-between gap-[8px] border-b border-forest/10 px-[12px] py-[12px] sm:px-[20px] sm:py-[14px]">
              <span className="min-w-0 truncate text-[14px] font-semibold text-forest sm:text-[15px]">
                <span className="sm:hidden">Resume</span>
                <span className="hidden sm:inline">Shritik Jaiswal — Resume</span>
              </span>

              <div className="flex shrink-0 items-center gap-[6px] sm:gap-[8px]">
                <div className="mr-[2px] flex items-center gap-[2px] rounded-full border border-forest/15 bg-white px-[2px] py-[2px] sm:mr-[4px] sm:px-[4px]">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
                    disabled={zoom <= MIN_ZOOM}
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-forest transition hover:bg-forest/[0.06] disabled:opacity-35 sm:h-[30px] sm:w-[30px]"
                    aria-label="Zoom out"
                  >
                    <Minus className="h-[14px] w-[14px]" />
                  </button>
                  <span className="min-w-[40px] text-center text-[12px] font-medium tabular-nums text-forest/70 sm:min-w-[44px] sm:text-[12.5px]">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
                    disabled={zoom >= MAX_ZOOM}
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-forest transition hover:bg-forest/[0.06] disabled:opacity-35 sm:h-[30px] sm:w-[30px]"
                    aria-label="Zoom in"
                  >
                    <Plus className="h-[14px] w-[14px]" />
                  </button>
                </div>

                <a
                  href="/api/resume?download=1"
                  download="Shritik Jaiswal Resume.pdf"
                  onClick={() => {
                    fetch("/api/analytics", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ type: "RESUME_DOWNLOAD" }),
                    }).catch(() => {});
                  }}
                  className="inline-flex h-[40px] items-center gap-[6px] rounded-full border-[1.5px] border-forest bg-btn-cream px-[12px] text-[13px] font-medium text-forest transition hover:bg-forest/10 sm:h-[36px] sm:gap-[7px] sm:px-[14px]"
                >
                  <Download className="h-[14px] w-[14px]" strokeWidth={2} />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-forest/20 bg-white text-forest transition hover:bg-forest/[0.06] sm:h-[36px] sm:w-[36px]"
                  aria-label="Close resume"
                >
                  <X className="h-[16px] w-[16px]" />
                </button>
              </div>
            </header>

            <div
              ref={scrollRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="flex-1 overflow-auto bg-forest/[0.04] px-[12px] py-[16px] touch-pan-y sm:px-[24px] sm:py-[24px]"
            >
              {error ? (
                <div className="flex h-full flex-col items-center justify-center gap-[12px] text-[14px] text-forest/55">
                  <span>Unable to load the resume preview.</span>
                  {fallbackUrl ? (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-forest/20 px-[16px] py-[8px] text-[13px] font-medium text-forest hover:bg-forest/5"
                    >
                      Open resume in new tab
                    </a>
                  ) : null}
                </div>
              ) : (
                <div
                  className="mx-auto"
                  style={{ width: pageWidth * zoom }}
                >
                  <Document
                    file="/api/resume"
                    onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
                    onLoadError={() => setError(true)}
                    loading={
                      <div className="flex h-[70vh] items-center justify-center text-[14px] text-forest/45">
                        Loading resume…
                      </div>
                    }
                    className="flex flex-col items-center gap-[16px]"
                  >
                    {Array.from({ length: numPages }, (_, index) => (
                      <Page
                        key={`resume-page-${index + 1}`}
                        pageNumber={index + 1}
                        width={pageWidth * zoom}
                        className="shadow-[0_4px_20px_rgba(0,75,64,0.12)]"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    ))}
                  </Document>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
