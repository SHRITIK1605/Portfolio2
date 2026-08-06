"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import {
  DEFAULT_CRAFT_POLAROIDS,
  EXPERIENCES,
  type CraftPolaroid,
  type ExperienceItem,
} from "@/lib/experience-data";

function boldHighlights(text: string, highlights: string[] = []) {
  if (highlights.length === 0) return text;
  const escaped = highlights
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) => {
    const match = highlights.some(
      (h) => h.toLowerCase() === part.toLowerCase()
    );
    return match ? (
      <strong key={`${part}-${i}`} className="font-semibold text-forest">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${i}`}>{part}</span>
    );
  });
}

function SafetyPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 40" fill="none" aria-hidden>
      <ellipse
        cx="12"
        cy="8"
        rx="7"
        ry="6"
        stroke="#1a1a1a"
        strokeWidth="2.2"
        fill="none"
      />
      <path
        d="M5 10v18c0 4 3.2 7 7 7s7-3 7-7V10"
        stroke="#1a1a1a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="28" r="2.2" fill="#c0392b" />
    </svg>
  );
}

function RedStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 2l3.2 10.2L34 10l-7.5 7.2L30 30l-10-5.8L10 30l3.5-12.8L6 10l10.8 2.2L20 2z"
        fill="#e23d3d"
      />
    </svg>
  );
}

/** Visible company mark for left nav — uses the real color logo. */
function NavLogo({ item, size }: { item: ExperienceItem; size: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-[10px] border border-forest/20"
      style={{
        width: size,
        height: size,
        backgroundColor: item.logoBg ?? "#ffffff",
      }}
    >
      <Image
        src={item.logoUrl}
        alt=""
        fill
        className="object-contain p-[3px]"
        sizes={`${size}px`}
        unoptimized
      />
    </span>
  );
}

function ExperienceNavItem({
  item,
  active,
  onSelect,
  index,
}: {
  item: ExperienceItem;
  active: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: 1,
        x: active ? 4 : 0,
        scale: active ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 26,
        delay: active ? 0 : index * 0.03,
      }}
      className={`relative flex min-h-[44px] w-full items-center gap-[10px] rounded-[12px] border px-[10px] py-[8px] text-left ${
        active
          ? "border-forest bg-[#FAF6EE] shadow-[0_2px_12px_rgba(0,75,64,0.12)]"
          : "border-forest/22 bg-[#FAF6EE] hover:border-forest/45"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="exp-active-glow"
          className="pointer-events-none absolute inset-0 rounded-[12px] ring-2 ring-forest/30"
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
        />
      ) : null}
      <NavLogo item={item} size={36} />
      <span className="relative text-[11px] font-bold uppercase leading-snug tracking-[0.02em] text-forest md:text-[12px]">
        {item.company}
      </span>
    </motion.button>
  );
}

function CompanyBlock({
  item,
  active,
  isLast,
}: {
  item: ExperienceItem;
  active: boolean;
  isLast: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, margin: "-10% 0px" });

  return (
    <article
      ref={ref}
      id={`exp-${item.id}`}
      data-exp-id={item.id}
      className="scroll-mt-[10px]"
    >
      <div className="px-[2px] py-[2px]">
        <header className="mb-[12px] flex flex-col gap-[10px] sm:mb-[14px] sm:flex-row sm:items-start sm:justify-between sm:gap-[14px]">
          <div className="flex min-w-0 items-start gap-[12px]">
            <div
              className={`relative shrink-0 overflow-hidden rounded-[10px] border border-forest/10 ${
                item.logoWide
                  ? "h-[48px] w-[88px] sm:h-[54px] sm:w-[100px]"
                  : "h-[48px] w-[48px] sm:h-[54px] sm:w-[54px]"
              }`}
              style={{ backgroundColor: item.logoBg ?? "#ffffff" }}
            >
              <Image
                src={item.logoUrl}
                alt={`${item.company} logo`}
                fill
                className="object-contain p-[3px]"
                sizes={item.logoWide ? "100px" : "54px"}
                unoptimized
              />
            </div>
            <div className="min-w-0 pt-[1px]">
              <h3 className="m-0 text-[14px] font-bold uppercase leading-tight tracking-[0.02em] text-forest sm:text-[16px] md:text-[17px]">
                {item.company}
              </h3>
              <p className="m-0 mt-[3px] text-[12px] font-medium leading-snug text-forest/80 sm:text-[13px]">
                {item.role}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-[5px] text-[12px] text-forest/85 sm:items-end sm:text-[13px]">
            <span className="inline-flex items-center gap-[6px]">
              <CalendarDays
                className="h-[13px] w-[13px] shrink-0 text-forest"
                strokeWidth={2}
              />
              <span className="font-medium">{item.dates}</span>
            </span>
            <span className="inline-flex items-center gap-[6px] italic">
              <MapPin
                className="h-[13px] w-[13px] shrink-0 text-forest"
                strokeWidth={2}
              />
              <span>{item.location}</span>
            </span>
          </div>
        </header>

        <div className="relative pl-[26px] sm:pl-[30px]">
          <motion.span
            className="absolute left-[8px] top-[5px] w-[2px] origin-top bg-forest/20"
            animate={{ height: inView || active ? "calc(100% - 8px)" : "28%" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            aria-hidden
          />
          <span
            className="absolute left-[2px] top-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-forest bg-white"
            aria-hidden
          >
            <span className="h-[5px] w-[5px] rounded-full bg-forest" />
          </span>

          <p className="m-0 mb-[8px] text-[12px] font-semibold uppercase tracking-[0.04em] text-forest sm:text-[13px]">
            {item.dates}
          </p>
          <p className="m-0 mb-[10px] text-[13px] italic leading-relaxed text-forest/90 sm:text-[14px]">
            {item.overview}
          </p>
          {item.priorPeriod ? (
            <div className="relative mb-[10px] mt-[6px]">
              {/* Filled stop circle — left of internship dates */}
              <span
                className="absolute -left-[24px] top-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-forest bg-forest sm:-left-[28px]"
                aria-hidden
              >
                <span className="h-[4px] w-[4px] rounded-full bg-white" />
              </span>
              <p className="m-0 mb-[6px] text-[12px] font-semibold uppercase tracking-[0.04em] text-forest sm:text-[13px]">
                {item.priorPeriod.dates}
              </p>
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.03em] text-forest/85 sm:text-[13px]">
                {item.priorPeriod.role}
              </p>
            </div>
          ) : null}
          <ul className="m-0 flex list-disc flex-col gap-[7px] pl-[18px] text-[13px] leading-relaxed text-forest sm:gap-[9px] sm:text-[14px]">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="pl-[2px]">
                {boldHighlights(bullet, item.highlights)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!isLast ? (
        <div className="flex items-center py-[20px] sm:py-[24px]" aria-hidden>
          <span className="h-px w-full bg-forest/14" />
        </div>
      ) : null}
    </article>
  );
}

/** Open graph-paper notebook sitting under the pinned polaroids. */
function NotebookBookBg() {
  const gridStyle = {
    backgroundColor: "#fbfaf4",
    backgroundImage: `
      linear-gradient(rgba(0, 75, 64, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 75, 64, 0.07) 1px, transparent 1px)
    `,
    backgroundSize: "14px 14px",
  } as const;

  return (
    <div
      className="pointer-events-none absolute inset-[2%] z-0 rotate-[-3deg]"
      aria-hidden
    >
      {/* Soft book shadow */}
      <div className="absolute inset-[2%] rounded-[6px] bg-black/10 blur-[10px]" />

      {/* Open book cover / pages */}
      <div className="absolute inset-0 flex overflow-hidden rounded-[4px] border border-[#d8d2c4] bg-[#f3efe4] shadow-[0_12px_28px_rgba(40,30,10,0.14)]">
        {/* Left page */}
        <div className="relative h-full w-1/2 border-r border-[#e0d9ca]" style={gridStyle}>
          <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-black/[0.06] to-transparent" />
        </div>
        {/* Right page */}
        <div className="relative h-full w-1/2" style={gridStyle}>
          <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-black/[0.06] to-transparent" />
        </div>
        {/* Center spine crease */}
        <div className="absolute inset-y-[3%] left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c9c0ae] to-transparent opacity-80" />
        <div className="absolute inset-y-[8%] left-1/2 w-[10px] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent" />
      </div>

      {/* Binding edge hint */}
      <div className="absolute inset-y-[6%] left-[-3px] w-[6px] rounded-l-[3px] bg-[#d4ccba] shadow-sm" />
    </div>
  );
}

type ScrapKind =
  | "lamp"
  | "coffee"
  | "sticky"
  | "washi"
  | "pencil"
  | "paperclip"
  | "coin"
  | "chart"
  | "tag"
  | "eraser"
  | "plant"
  | "key"
  | "ticket"
  | "stamp"
  | "ruler"
  | "pushpin"
  | "folder"
  | "leaf"
  | "bookmark"
  | "badge";

const SCRAP_POOL: ScrapKind[] = [
  "lamp",
  "coffee",
  "sticky",
  "washi",
  "pencil",
  "paperclip",
  "coin",
  "chart",
  "tag",
  "eraser",
  "plant",
  "key",
  "ticket",
  "stamp",
  "ruler",
  "pushpin",
  "folder",
  "leaf",
  "bookmark",
  "badge",
];

/** Deterministic shuffle from company id → always same 4 for that company. */
function pickScrapSet(seed: string, count = 4): ScrapKind[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const arr = [...SCRAP_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function WashiTape({ className, tone = "green" }: { className?: string; tone?: "green" | "pink" | "cream" }) {
  const bg =
    tone === "pink"
      ? "bg-[#f0c9c4]/90"
      : tone === "cream"
        ? "bg-[#e8dfc8]/90"
        : "bg-[#c8e0d4]/90";
  return (
    <div
      className={`h-[16px] w-[64px] rounded-[1px] border border-forest/10 shadow-sm ${bg} ${className ?? ""}`}
      aria-hidden
    />
  );
}

function MiniSticky({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={`flex h-[44px] w-[44px] items-start justify-center bg-[#f6e7a1] p-[4px] text-[7px] leading-tight text-forest/70 shadow-[1px_2px_6px_rgba(0,0,0,0.12)] ${className ?? ""}`}
      aria-hidden
    >
      <span className="font-medium italic">{label ?? "notes"}</span>
    </div>
  );
}

function DeskLamp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 96" fill="none" aria-hidden>
      {/* Soft glow */}
      <ellipse cx="48" cy="22" rx="14" ry="8" fill="#f7e7a8" opacity="0.55" />
      {/* Cone shade */}
      <path
        d="M28 10 L68 18 L58 36 L22 28 Z"
        fill="#d4b483"
        stroke="#6b5420"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M30 12 L64 19" stroke="#f0e2c4" strokeWidth="2" opacity="0.7" />
      {/* Inner rim */}
      <ellipse cx="40" cy="32" rx="16" ry="4" fill="#8a7355" opacity="0.35" />
      {/* Upper arm */}
      <path
        d="M40 34 L28 52"
        stroke="#5c4a32"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="52" r="3.2" fill="#8a7355" stroke="#5c4a32" strokeWidth="1" />
      {/* Lower arm */}
      <path
        d="M28 52 L36 72"
        stroke="#5c4a32"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="72" r="3.2" fill="#8a7355" stroke="#5c4a32" strokeWidth="1" />
      {/* Stem to base */}
      <path d="M36 72 V86" stroke="#5c4a32" strokeWidth="3" strokeLinecap="round" />
      {/* Base */}
      <ellipse cx="36" cy="90" rx="16" ry="4.5" fill="#8a7355" stroke="#5c4a32" strokeWidth="1.4" />
      <ellipse cx="36" cy="88" rx="10" ry="2.5" fill="#c4a574" opacity="0.8" />
    </svg>
  );
}

function CoffeeCup({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M10 16h22v18c0 4-3.5 7-8 7h-6c-4.5 0-8-3-8-7V16Z" fill="#f4efe6" stroke="#004b40" strokeWidth="1.6" />
      <path d="M32 20h5c3 0 5 2.5 5 5.5S40 31 37 31h-5" stroke="#004b40" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 14h18c1 0 2 1 2 2H10c0-1 1-2 2-2Z" fill="#004b40" />
    </svg>
  );
}

function PencilProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 16" fill="none" aria-hidden>
      <path d="M2 8 L58 8" stroke="#c4a035" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 8 L72 4 L72 12 Z" fill="#e8c07a" stroke="#004b40" strokeWidth="1" />
      <path d="M72 8 L78 8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <rect x="4" y="5" width="10" height="6" fill="#e23d3d" opacity="0.85" />
    </svg>
  );
}

function PaperclipProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 40" fill="none" aria-hidden>
      <path
        d="M8 12v14a4 4 0 0 0 8 0V10a3 3 0 0 0-6 0v14a2 2 0 0 0 4 0V12"
        stroke="#6b7280"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CoinProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="14" fill="#d4af37" stroke="#8a7355" strokeWidth="2" />
      <circle cx="18" cy="18" r="9" stroke="#f0e2c4" strokeWidth="1.5" />
      <text x="18" y="22" textAnchor="middle" fontSize="10" fill="#6b5420" fontWeight="700">₹</text>
    </svg>
  );
}

function ChartProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 36" fill="none" aria-hidden>
      <rect x="2" y="2" width="44" height="32" rx="3" fill="#fff" stroke="#004b40" strokeWidth="1.4" />
      <path d="M8 26 L16 18 L24 22 L36 10" stroke="#004b40" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="10" r="2.5" fill="#e23d3d" />
    </svg>
  );
}

function TagProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 28" fill="none" aria-hidden>
      <path d="M4 4h28l12 10-12 10H4V4Z" fill="#f4ecd4" stroke="#004b40" strokeWidth="1.4" />
      <circle cx="12" cy="14" r="2.5" fill="#004b40" />
    </svg>
  );
}

function EraserProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 22" fill="none" aria-hidden>
      <rect x="2" y="4" width="24" height="14" rx="2" fill="#f0a8b8" stroke="#004b40" strokeWidth="1.3" />
      <rect x="22" y="4" width="14" height="14" rx="2" fill="#f4efe6" stroke="#004b40" strokeWidth="1.3" />
    </svg>
  );
}

function PlantProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 44" fill="none" aria-hidden>
      <path d="M18 42V20" stroke="#004b40" strokeWidth="2" />
      <ellipse cx="12" cy="16" rx="8" ry="5" fill="#6fa88a" transform="rotate(-25 12 16)" />
      <ellipse cx="24" cy="14" rx="8" ry="5" fill="#4f8f6e" transform="rotate(20 24 14)" />
      <path d="M10 42h16l-2-8H12l-2 8Z" fill="#c4a574" stroke="#8a7355" strokeWidth="1.2" />
    </svg>
  );
}

function KeyProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="none" aria-hidden>
      <circle cx="10" cy="12" r="7" stroke="#c4a035" strokeWidth="2.2" />
      <circle cx="10" cy="12" r="2.5" fill="#c4a035" />
      <path d="M17 12h26M36 12v6M42 12v4" stroke="#c4a035" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TicketProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 52 28" fill="none" aria-hidden>
      <path
        d="M2 6h48v6a4 4 0 0 0 0 8v6H2v-6a4 4 0 0 0 0-8V6Z"
        fill="#fff7e8"
        stroke="#004b40"
        strokeWidth="1.4"
      />
      <path d="M18 8v12" stroke="#004b40" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function StampProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="6" y="6" width="28" height="28" rx="3" stroke="#e23d3d" strokeWidth="2" strokeDasharray="3 2" />
      <text x="20" y="24" textAnchor="middle" fontSize="8" fill="#e23d3d" fontWeight="700">OK</text>
    </svg>
  );
}

function RulerProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 16" fill="none" aria-hidden>
      <rect x="1" y="3" width="70" height="10" rx="1.5" fill="#f4efe6" stroke="#004b40" strokeWidth="1.2" />
      {[8, 16, 24, 32, 40, 48, 56, 64].map((x) => (
        <path key={x} d={`M${x} 3v${x % 16 === 0 ? 7 : 4}`} stroke="#004b40" strokeWidth="1" />
      ))}
    </svg>
  );
}

function PushpinProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 36" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="7" fill="#e23d3d" />
      <path d="M12 17v16" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FolderProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 36" fill="none" aria-hidden>
      <path d="M4 10h14l4 4h22v18H4V10Z" fill="#e8c07a" stroke="#8a7355" strokeWidth="1.4" />
      <path d="M4 14h40" stroke="#8a7355" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function LeafProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 44" fill="none" aria-hidden>
      <path d="M16 40C16 40 4 28 4 16S16 2 16 2s12 2 12 14-12 24-12 24Z" fill="#6fa88a" stroke="#004b40" strokeWidth="1.2" />
      <path d="M16 40V14" stroke="#004b40" strokeWidth="1.2" />
    </svg>
  );
}

function BookmarkProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 40" fill="none" aria-hidden>
      <path d="M4 2h16v34l-8-6-8 6V2Z" fill="#c8e0d4" stroke="#004b40" strokeWidth="1.4" />
    </svg>
  );
}

function BadgeProp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" fill="#004b40" />
      <circle cx="20" cy="20" r="9" fill="#FAF6EE" />
      <path d="M20 12l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5Z" fill="#c4a035" />
    </svg>
  );
}

const STICKY_LABELS = [
  "ship it",
  "PM notes",
  "WIP",
  "priority",
  "later",
  "idea!",
] as const;

function ScrapElement({
  kind,
  className,
  stickyLabel,
}: {
  kind: ScrapKind;
  className?: string;
  stickyLabel?: string;
}) {
  switch (kind) {
    case "lamp":
      return (
        <DeskLamp
          className={`h-[72px] w-[54px] drop-shadow-md sm:h-[88px] sm:w-[66px] ${className ?? ""}`}
        />
      );
    case "coffee":
      return <CoffeeCup className={`h-[38px] w-[38px] drop-shadow-sm sm:h-[44px] sm:w-[44px] ${className ?? ""}`} />;
    case "sticky":
      return <MiniSticky className={className} label={stickyLabel} />;
    case "washi":
      return <WashiTape className={className} tone="green" />;
    case "pencil":
      return <PencilProp className={`h-[14px] w-[70px] drop-shadow-sm ${className ?? ""}`} />;
    case "paperclip":
      return <PaperclipProp className={`h-[34px] w-[20px] drop-shadow-sm ${className ?? ""}`} />;
    case "coin":
      return <CoinProp className={`h-[32px] w-[32px] drop-shadow-sm ${className ?? ""}`} />;
    case "chart":
      return <ChartProp className={`h-[34px] w-[46px] drop-shadow-sm ${className ?? ""}`} />;
    case "tag":
      return <TagProp className={`h-[26px] w-[46px] drop-shadow-sm ${className ?? ""}`} />;
    case "eraser":
      return <EraserProp className={`h-[20px] w-[38px] drop-shadow-sm ${className ?? ""}`} />;
    case "plant":
      return <PlantProp className={`h-[42px] w-[34px] drop-shadow-sm ${className ?? ""}`} />;
    case "key":
      return <KeyProp className={`h-[22px] w-[46px] drop-shadow-sm ${className ?? ""}`} />;
    case "ticket":
      return <TicketProp className={`h-[26px] w-[50px] drop-shadow-sm ${className ?? ""}`} />;
    case "stamp":
      return <StampProp className={`h-[36px] w-[36px] drop-shadow-sm ${className ?? ""}`} />;
    case "ruler":
      return <RulerProp className={`h-[14px] w-[68px] drop-shadow-sm ${className ?? ""}`} />;
    case "pushpin":
      return <PushpinProp className={`h-[34px] w-[22px] drop-shadow-sm ${className ?? ""}`} />;
    case "folder":
      return <FolderProp className={`h-[32px] w-[44px] drop-shadow-sm ${className ?? ""}`} />;
    case "leaf":
      return <LeafProp className={`h-[40px] w-[30px] drop-shadow-sm ${className ?? ""}`} />;
    case "bookmark":
      return <BookmarkProp className={`h-[38px] w-[22px] drop-shadow-sm ${className ?? ""}`} />;
    case "badge":
      return <BadgeProp className={`h-[34px] w-[34px] drop-shadow-sm ${className ?? ""}`} />;
    default:
      return null;
  }
}

/** Corner slots: first 2 ride on the front scrap (tilt with it); last 2 sit on the book. */
const FRONT_SLOTS = [
  "absolute -left-[10%] top-[8%] rotate-[-12deg]",
  "absolute -right-[8%] bottom-[6%] rotate-[10deg]",
] as const;
const BOOK_SLOTS = [
  "absolute left-[4%] bottom-[8%] rotate-[-8deg]",
  "absolute right-[2%] top-[6%] rotate-[12deg]",
] as const;

/** Scrapbook clip: notebook + polaroids; 4 of 20 props per company. */
function PolaroidClip({
  item,
  height,
  fallback,
}: {
  item: ExperienceItem;
  itemIndex?: number;
  height: number | null;
  fallback: CraftPolaroid[];
}) {
  const [hovered, setHovered] = useState(false);

  const images: [string, string] = [
    item.clipImages[0] ||
      fallback[0]?.src ||
      "/experience/craft/polaroid-notebook.jpg",
    item.clipImages[1] ||
      fallback[1]?.src ||
      "/experience/craft/polaroid-desk.jpg",
  ];

  const scraps = pickScrapSet(item.id, 4);
  const frontScraps = scraps.slice(0, 2);
  const bookScraps = scraps.slice(2, 4);
  const stickyLabel =
    STICKY_LABELS[
      Math.abs(item.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
        STICKY_LABELS.length
    ];

  const backShot = {
    src: images[0],
    restRotate: -4,
    left: "8%",
    top: "2%",
    width: "68%",
  };
  const frontShot = {
    src: images[1],
    restRotate: 5,
    left: "30%",
    top: "32%",
    width: "64%",
  };

  return (
    <div
      className="relative w-full select-none overflow-visible"
      style={
        height
          ? { height, minHeight: height }
          : { minHeight: 320, aspectRatio: "3 / 4" }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NotebookBookBg />

      {/* Book-level props (do not tilt with front scrap) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`book-scraps-${item.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-[5]"
          aria-hidden
        >
          {bookScraps.map((kind, i) => (
            <motion.div
              key={`${item.id}-book-${kind}`}
              className={BOOK_SLOTS[i] ?? BOOK_SLOTS[0]}
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
            >
              <ScrapElement kind={kind} stickyLabel={stickyLabel} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 z-[2]"
        >
          <motion.div
            className="absolute rounded-[4px] bg-white p-[8px] pb-[22px] shadow-[0_8px_20px_rgba(0,40,30,0.15)]"
            style={{
              width: backShot.width,
              left: backShot.left,
              top: backShot.top,
              zIndex: 2,
            }}
            animate={{ rotate: backShot.restRotate }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
              <Image
                src={backShot.src}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
              />
            </div>
          </motion.div>

          {/* Front scrap + attached props tilt together */}
          <motion.div
            className="absolute cursor-pointer rounded-[4px] bg-white p-[8px] pb-[22px] shadow-[0_10px_24px_rgba(0,40,30,0.18)]"
            style={{
              width: frontShot.width,
              left: frontShot.left,
              top: frontShot.top,
              zIndex: 3,
              transformOrigin: "top right",
            }}
            animate={{
              rotate: hovered ? -38 : frontShot.restRotate,
              y: hovered ? 18 : 0,
              x: hovered ? 6 : 0,
            }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
              <Image
                src={frontShot.src}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
              />
            </div>

            {frontScraps.map((kind, i) => (
              <div
                key={`${item.id}-front-${kind}`}
                className={`pointer-events-none z-[6] ${FRONT_SLOTS[i] ?? FRONT_SLOTS[0]}`}
                aria-hidden
              >
                <ScrapElement kind={kind} stickyLabel={stickyLabel} />
              </div>
            ))}

            <div
              className="pointer-events-none absolute -right-[6px] -top-[18px] z-10"
              aria-hidden
            >
              <RedStar className="absolute -left-[12px] -top-[8px] h-[24px] w-[24px] drop-shadow-md sm:h-[28px] sm:w-[28px]" />
              <SafetyPin className="relative h-[40px] w-[22px] sm:h-[46px] sm:w-[24px]" />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ExperienceProps {
  craftImages?: CraftPolaroid[] | null;
}

export default function Experience({ craftImages }: ExperienceProps) {
  const [activeId, setActiveId] = useState(EXPERIENCES[0]?.id ?? "bse");
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const scrollingFromNav = useRef(false);

  const polaroids =
    craftImages && craftImages.length > 0
      ? craftImages
      : DEFAULT_CRAFT_POLAROIDS;

  const activeItem =
    EXPERIENCES.find((e) => e.id === activeId) ?? EXPERIENCES[0];

  const syncHeight = useCallback(() => {
    const left = leftRef.current;
    if (!left || window.innerWidth < 768) {
      setPanelHeight(null);
      return;
    }
    setPanelHeight(Math.round(left.getBoundingClientRect().height));
  }, []);

  useLayoutEffect(() => {
    syncHeight();
    const left = leftRef.current;
    if (!left) return;
    const ro = new ResizeObserver(() => syncHeight());
    ro.observe(left);
    window.addEventListener("resize", syncHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [syncHeight]);

  const scrollToCompany = useCallback((id: string) => {
    const panel = panelRef.current;
    const target = panel?.querySelector<HTMLElement>(`#exp-${id}`);
    if (!panel || !target) return;
    scrollingFromNav.current = true;
    setActiveId(id);
    panel.scrollTo({
      top: Math.max(0, target.offsetTop - 8),
      behavior: "smooth",
    });
    window.setTimeout(() => {
      scrollingFromNav.current = false;
    }, 500);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const updateActive = () => {
      if (scrollingFromNav.current) return;
      const blocks = Array.from(
        panel.querySelectorAll<HTMLElement>("[data-exp-id]")
      );
      if (blocks.length === 0) return;

      const { scrollTop, clientHeight, scrollHeight } = panel;
      const canScroll = scrollHeight > clientHeight + 4;
      const nearBottom =
        canScroll && scrollTop + clientHeight >= scrollHeight - 12;
      if (nearBottom) {
        const last = blocks[blocks.length - 1]?.getAttribute("data-exp-id");
        if (last) setActiveId(last);
        return;
      }

      const probe = scrollTop + Math.min(120, clientHeight * 0.25);
      let current = blocks[0]?.getAttribute("data-exp-id") ?? EXPERIENCES[0]?.id;
      for (const block of blocks) {
        if (block.offsetTop <= probe) {
          current = block.getAttribute("data-exp-id") ?? current;
        } else {
          break;
        }
      }
      if (current) setActiveId(current);
    };

    updateActive();
    panel.addEventListener("scroll", updateActive, { passive: true });
    return () => panel.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <section
      className="relative mx-auto -mt-[80px] max-w-[1320px] overflow-visible rounded-[28px] bg-[#EAECE2] px-[16px] pb-[56px] pt-[28px] sm:px-[28px] sm:pb-[72px] sm:pt-[32px] md:px-[36px] md:pb-[88px] lg:px-[40px]"
      aria-labelledby="experience-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative mb-[14px] md:mb-[18px]"
      >
        <h2
          id="experience-heading"
          className="m-0 text-[28px] font-bold tracking-[-0.02em] text-forest sm:text-[32px] md:text-[36px]"
        >
          EXPERIENCE
        </h2>
      </motion.div>

      <div className="relative z-[1] grid gap-[16px] md:grid-cols-[minmax(160px,200px)_minmax(0,1fr)] md:items-start md:gap-[28px] lg:gap-[36px]">
        <div ref={leftRef} className="min-w-0 md:ml-[12px] lg:ml-[20px]">
          <div className="mb-[4px] flex gap-[8px] overflow-x-auto pb-[6px] [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {EXPERIENCES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCompany(item.id)}
                aria-pressed={item.id === activeId}
                className={`flex min-h-[44px] shrink-0 items-center gap-[8px] rounded-full border px-[12px] py-[7px] transition ${
                  item.id === activeId
                    ? "border-forest bg-[#FAF6EE] font-semibold text-forest"
                    : "border-forest/22 bg-[#FAF6EE] text-forest/70"
                }`}
              >
                <NavLogo item={item} size={28} />
                <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.02em]">
                  {item.company}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden md:block">
            <ul className="m-0 flex list-none flex-col gap-[16px] p-0 sm:gap-[18px]">
              {EXPERIENCES.map((item, index) => (
                <li key={item.id}>
                  <ExperienceNavItem
                    item={item}
                    active={item.id === activeId}
                    onSelect={() => scrollToCompany(item.id)}
                    index={index}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[16px] lg:flex-row lg:items-stretch lg:gap-[24px]">
          {/* White detail panel */}
          <div
            className="flex min-w-0 flex-col overflow-hidden rounded-[20px] border-[2.5px] border-forest bg-white shadow-[0_4px_20px_rgba(0,75,64,0.06)] sm:rounded-[24px] sm:border-[3px] lg:w-[55%]"
            style={
              panelHeight
                ? { height: panelHeight, maxHeight: panelHeight }
                : { minHeight: 420 }
            }
          >
            <div
              ref={panelRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[14px] py-[14px] [scrollbar-color:rgba(0,75,64,0.28)_transparent] [scrollbar-width:thin] sm:px-[18px] sm:py-[16px] md:px-[22px]"
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="flex flex-col">
                {EXPERIENCES.map((item, index) => (
                  <CompanyBlock
                    key={item.id}
                    item={item}
                    active={item.id === activeId}
                    isLast={index === EXPERIENCES.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pin + two polaroids only (no big photo card) */}
          <div className="min-w-0 lg:w-[45%]">
            {activeItem ? (
              <PolaroidClip
                item={activeItem}
                itemIndex={Math.max(
                  0,
                  EXPERIENCES.findIndex((e) => e.id === activeItem.id)
                )}
                height={panelHeight}
                fallback={polaroids}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
