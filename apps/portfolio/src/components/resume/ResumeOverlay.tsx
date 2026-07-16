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
const BASE_PAGE_WIDTH = 580;

function clampZoom(v: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[760px] flex-col bg-white shadow-[-12px_0_40px_rgba(0,75,64,0.2)]"
            role="dialog"
            aria-label="Resume viewer"
          >
            <header className="flex items-center justify-between border-b border-forest/10 px-[20px] py-[14px]">
              <span className="text-[15px] font-semibold text-forest">
                Shritik Jaiswal — Resume
              </span>

              <div className="flex items-center gap-[8px]">
                <div className="mr-[4px] flex items-center gap-[2px] rounded-full border border-forest/15 bg-white px-[4px] py-[2px]">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
                    disabled={zoom <= MIN_ZOOM}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-forest transition hover:bg-forest/[0.06] disabled:opacity-35"
                    aria-label="Zoom out"
                  >
                    <Minus className="h-[14px] w-[14px]" />
                  </button>
                  <span className="min-w-[44px] text-center text-[12.5px] font-medium tabular-nums text-forest/70">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
                    disabled={zoom >= MAX_ZOOM}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-forest transition hover:bg-forest/[0.06] disabled:opacity-35"
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
                  className="inline-flex h-[36px] items-center gap-[7px] rounded-full border-[1.5px] border-forest bg-btn-cream px-[14px] text-[13px] font-medium text-forest transition hover:bg-forest/10"
                >
                  <Download className="h-[14px] w-[14px]" strokeWidth={2} />
                  Download
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-forest/20 bg-white text-forest transition hover:bg-forest/[0.06]"
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
              className="flex-1 overflow-auto bg-forest/[0.04] px-[24px] py-[24px]"
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
                  style={{ width: BASE_PAGE_WIDTH * zoom }}
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
                        width={BASE_PAGE_WIDTH * zoom}
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
