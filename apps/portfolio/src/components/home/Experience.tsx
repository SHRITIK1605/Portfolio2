"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import {
  CRAFT_POLAROIDS,
  EXPERIENCES,
  type ExperienceItem,
  type TimelineStop,
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

function DottedConnector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 28" fill="none" aria-hidden>
      <path
        d="M12 2c0 6 8 8 8 14S12 22 12 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 3.5"
        strokeLinecap="round"
      />
      <path
        d="M8 23l4 5 4-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 6c18-4 36 2 54-1s36-3 62 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
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

function CraftPolaroidStack() {
  return (
    <div className="pointer-events-none relative mx-auto mb-[8px] h-[148px] w-full max-w-[280px] select-none sm:mb-[12px] sm:h-[168px] md:absolute md:right-[-8px] md:top-[-28px] md:z-10 md:mb-0 md:h-[190px] md:w-[220px] lg:right-[-4px] lg:top-[-36px] lg:h-[210px] lg:w-[240px]">
      {CRAFT_POLAROIDS.slice(0, 2).map((shot, i) => (
        <div
          key={shot.src}
          className="absolute rounded-[4px] bg-white p-[8px] pb-[28px] shadow-[0_8px_24px_rgba(0,40,30,0.14)]"
          style={{
            width: i === 0 ? "58%" : "56%",
            left: i === 0 ? "8%" : "36%",
            top: i === 0 ? "8%" : "28%",
            zIndex: i + 1,
            transform: `rotate(${shot.rotate}deg)`,
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="140px"
            />
          </div>
          <p className="m-0 mt-[6px] text-center text-[10px] font-medium lowercase tracking-wide text-forest/55">
            {shot.caption}
          </p>
        </div>
      ))}
      <RedStar className="absolute left-[46%] top-[2%] z-20 h-[28px] w-[28px] drop-shadow-sm sm:h-[32px] sm:w-[32px]" />
      <SafetyPin className="absolute left-[49%] top-[-2%] z-30 h-[36px] w-[22px] sm:h-[40px] sm:w-[24px]" />
    </div>
  );
}

function SideCraftPolaroids() {
  return (
    <div className="pointer-events-none absolute -right-[6px] top-[42%] z-0 hidden w-[120px] lg:block xl:w-[140px]">
      {CRAFT_POLAROIDS.slice(2).map((shot, i) => (
        <div
          key={shot.src}
          className="absolute rounded-[3px] bg-white p-[6px] pb-[22px] shadow-[0_6px_18px_rgba(0,40,30,0.12)]"
          style={{
            width: "92px",
            top: i * 78,
            right: i === 0 ? 8 : 0,
            transform: `rotate(${shot.rotate}deg)`,
            zIndex: i + 1,
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="92px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SketchLogo({ item, size }: { item: ExperienceItem; size: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-[10px] border border-forest/15 bg-cream"
      style={{ width: size, height: size }}
    >
      <Image
        src={item.sketchLogoUrl}
        alt=""
        fill
        className="object-contain p-[4px]"
        sizes={`${size}px`}
      />
    </span>
  );
}

function ExperienceNavItem({
  item,
  active,
  onSelect,
}: {
  item: ExperienceItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`relative flex min-h-[52px] w-full items-center gap-[12px] rounded-[14px] border px-[12px] py-[10px] text-left transition sm:min-h-[56px] sm:gap-[14px] sm:rounded-[16px] sm:px-[14px] ${
        active
          ? "border-forest bg-[#f7f0dc] shadow-[0_2px_10px_rgba(0,75,64,0.08)]"
          : "border-forest/25 bg-[#faf3df] hover:border-forest/50"
      }`}
    >
      <SketchLogo item={item} size={40} />
      <span className="text-[12px] font-bold uppercase leading-snug tracking-[0.02em] text-forest sm:text-[13px] md:text-[14px]">
        {item.company}
      </span>
      {active ? (
        <span
          className="pointer-events-none absolute -right-[18px] top-1/2 hidden -translate-y-1/2 text-forest/55 md:block"
          aria-hidden
        >
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <path
              d="M2 10h18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2.5 3"
              strokeLinecap="round"
            />
            <path
              d="M16 4l8 6-8 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

function TimelineRail({
  stops,
  highlights,
}: {
  stops: TimelineStop[];
  highlights?: string[];
}) {
  return (
    <ol className="relative m-0 list-none p-0 pl-[4px]">
      <span
        className="absolute bottom-[12px] left-[19px] top-[12px] w-[2px] bg-gradient-to-b from-forest/50 via-forest/25 to-forest/10"
        aria-hidden
      />
      {stops.map((stop, index) => {
        const isDate = stop.kind === "date";
        return (
          <li
            key={`${stop.label}-${index}`}
            className="relative flex gap-[14px] pb-[22px] last:pb-[4px] sm:gap-[18px] sm:pb-[26px]"
          >
            <div className="relative z-[1] flex w-[40px] shrink-0 flex-col items-center pt-[2px]">
              <span
                className={`flex items-center justify-center rounded-full border-2 bg-white shadow-[0_0_0_4px_rgba(252,248,232,0.9)] ${
                  isDate
                    ? "h-[18px] w-[18px] border-forest"
                    : "h-[12px] w-[12px] border-forest/45"
                }`}
              >
                {isDate ? (
                  <span className="h-[6px] w-[6px] rounded-full bg-forest" />
                ) : null}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-[4px] flex flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
                <span
                  className={`font-semibold tracking-[0.02em] text-forest ${
                    isDate
                      ? "text-[12px] uppercase sm:text-[13px]"
                      : "text-[11px] uppercase text-forest/55"
                  }`}
                >
                  {stop.label}
                </span>
                {stop.title ? (
                  <span className="text-[12px] font-medium text-forest/60 sm:text-[13px]">
                    · {stop.title}
                  </span>
                ) : null}
              </div>
              <p
                className={`m-0 leading-relaxed text-forest/90 ${
                  isDate && index === 0
                    ? "text-[13px] italic sm:text-[14px]"
                    : "text-[13px] sm:text-[14px]"
                }`}
              >
                {boldHighlights(stop.body, highlights)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function DetailCard({ item }: { item: ExperienceItem }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [item.id]);

  return (
    <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[22px] border-[2.5px] border-forest bg-[#fffdf8] shadow-[0_4px_24px_rgba(0,75,64,0.06)] sm:min-h-[480px] sm:rounded-[28px] sm:border-[3px] md:min-h-0">
      {/* Paper grain / lined-notebook feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, rgba(0,75,64,0.045) 28px)",
          backgroundPosition: "0 72px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[48px] bg-gradient-to-t from-[#fffdf8] to-transparent"
        aria-hidden
      />

      <header className="relative z-[1] shrink-0 border-b border-forest/10 px-[16px] pb-[14px] pt-[16px] sm:px-[22px] sm:pb-[16px] sm:pt-[20px] md:px-[26px]">
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-start sm:justify-between sm:gap-[16px]">
          <div className="flex min-w-0 items-start gap-[12px] sm:gap-[14px]">
            <div
              className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[10px] border border-forest/10 sm:h-[56px] sm:w-[56px] sm:rounded-[12px]"
              style={{ backgroundColor: item.logoBg ?? "#ffffff" }}
            >
              <Image
                src={item.logoUrl}
                alt={`${item.company} logo`}
                fill
                className="object-contain p-[4px]"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 pt-[2px]">
              <h3 className="m-0 text-[15px] font-bold uppercase leading-tight tracking-[0.02em] text-forest sm:text-[17px] md:text-[18px]">
                {item.company}
              </h3>
              <p className="m-0 mt-[4px] text-[13px] font-medium leading-snug text-forest/75 sm:text-[14px]">
                {item.role}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-[6px] text-[12px] text-forest/80 sm:items-end sm:text-[13px]">
            <span className="inline-flex items-center gap-[6px]">
              <CalendarDays
                className="h-[14px] w-[14px] shrink-0 text-forest"
                strokeWidth={2}
              />
              <span className="font-medium">{item.dates}</span>
            </span>
            <span className="inline-flex items-center gap-[6px] italic">
              <MapPin
                className="h-[14px] w-[14px] shrink-0 text-forest"
                strokeWidth={2}
              />
              <span>{item.location}</span>
            </span>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="relative z-[1] min-h-0 flex-1 overflow-y-auto overscroll-contain px-[16px] py-[16px] [scrollbar-color:rgba(0,75,64,0.25)_transparent] [scrollbar-width:thin] sm:px-[22px] sm:py-[18px] md:px-[26px]"
      >
        <p className="m-0 mb-[18px] text-[11px] font-semibold uppercase tracking-[0.14em] text-forest/45">
          Journey · pencil marks
        </p>
        <TimelineRail stops={item.timeline} highlights={item.highlights} />
      </div>
    </article>
  );
}

export default function Experience() {
  const [activeId, setActiveId] = useState(EXPERIENCES[0]?.id ?? "bse");
  const active =
    EXPERIENCES.find((item) => item.id === activeId) ?? EXPERIENCES[0];

  if (!active) return null;

  return (
    <section
      className="relative mx-auto max-w-[1100px] overflow-visible px-[20px] pb-[56px] sm:px-[32px] sm:pb-[72px] md:px-[48px] md:pb-[88px]"
      aria-labelledby="experience-heading"
    >
      {/* Soft craft wash behind the section */}
      <div
        className="pointer-events-none absolute inset-x-[12px] top-[40px] bottom-[24px] -z-10 rounded-[32px] bg-[#eef3ea]/70 sm:inset-x-[20px]"
        aria-hidden
      />

      <div className="relative mb-[12px] flex flex-col gap-[4px] sm:mb-[16px] md:mb-[8px] md:pr-[200px]">
        <div className="flex items-end gap-[10px]">
          <h2
            id="experience-heading"
            className="m-0 text-[28px] font-bold tracking-[-0.02em] text-forest sm:text-[32px] md:text-[36px]"
          >
            Experience
          </h2>
          {/* Scrapbook top icons — book + desk */}
          <div className="mb-[6px] hidden items-center gap-[8px] sm:flex">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-forest/15 bg-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 16.5v-11z"
                  stroke="#004b40"
                  strokeWidth="1.6"
                />
                <path d="M8 7h8M8 11h6" stroke="#004b40" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-forest/15 bg-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="8" width="14" height="9" rx="1.5" stroke="#004b40" strokeWidth="1.6" />
                <path d="M7 17v2M13 17v2M5 12h10" stroke="#004b40" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M18 10l3-2v10l-3-2V10z" stroke="#004b40" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
        <PencilUnderline className="h-[10px] w-[120px] text-forest" />
        <p className="m-0 mt-[2px] max-w-[420px] text-[13px] leading-snug text-forest/55 sm:text-[14px]">
          A scrapbook of roles — dates as stops, work as notes in the margin.
        </p>
      </div>

      <CraftPolaroidStack />
      <SideCraftPolaroids />

      <div className="relative z-[1] grid gap-[20px] md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] md:items-stretch md:gap-[28px] lg:gap-[36px] lg:pr-[100px]">
        <div className="min-w-0 md:flex md:h-full md:flex-col">
          <div className="mb-[4px] flex gap-[10px] overflow-x-auto pb-[8px] [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {EXPERIENCES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                aria-pressed={item.id === activeId}
                className={`flex min-h-[48px] shrink-0 items-center gap-[10px] rounded-full border px-[14px] py-[8px] transition ${
                  item.id === activeId
                    ? "border-forest bg-[#f7f0dc] font-semibold text-forest"
                    : "border-forest/25 bg-[#faf3df] text-forest/70"
                }`}
              >
                <SketchLogo item={item} size={28} />
                <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.02em]">
                  {item.company}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden md:flex md:h-full md:flex-col">
            <ul className="m-0 flex list-none flex-col gap-0 p-0">
              {EXPERIENCES.map((item, index) => (
                <li key={item.id} className="relative">
                  <ExperienceNavItem
                    item={item}
                    active={item.id === activeId}
                    onSelect={() => setActiveId(item.id)}
                  />
                  {index < EXPERIENCES.length - 1 ? (
                    <div
                      className="flex justify-center py-[2px] text-forest/40"
                      aria-hidden
                    >
                      <DottedConnector className="h-[26px] w-[22px]" />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 md:h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              <DetailCard item={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
