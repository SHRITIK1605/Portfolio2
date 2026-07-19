"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { EXPERIENCES, type ExperienceItem } from "@/lib/experience-data";

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
    <svg
      className={className}
      viewBox="0 0 24 28"
      fill="none"
      aria-hidden
    >
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

function DetailCard({ item }: { item: ExperienceItem }) {
  return (
    <article className="flex h-full min-h-0 flex-col rounded-[22px] border-[2.5px] border-forest bg-white p-[16px] shadow-[0_4px_24px_rgba(0,75,64,0.06)] sm:rounded-[28px] sm:border-[3px] sm:p-[22px] md:p-[26px]">
      <header className="mb-[14px] flex shrink-0 flex-col gap-[12px] sm:mb-[16px] sm:flex-row sm:items-start sm:justify-between sm:gap-[16px]">
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
            <CalendarDays className="h-[14px] w-[14px] shrink-0 text-forest" strokeWidth={2} />
            <span className="font-medium">{item.dates}</span>
          </span>
          <span className="inline-flex items-center gap-[6px] italic">
            <MapPin className="h-[14px] w-[14px] shrink-0 text-forest" strokeWidth={2} />
            <span>{item.location}</span>
          </span>
        </div>
      </header>

      <p className="m-0 mb-[12px] shrink-0 text-[13px] italic leading-relaxed text-forest/85 sm:mb-[14px] sm:text-[14px]">
        Overview : {item.overview}
      </p>

      <ul className="m-0 mb-[16px] flex shrink-0 list-disc flex-col gap-[8px] pl-[18px] text-[13px] leading-relaxed text-forest/90 sm:mb-[18px] sm:gap-[10px] sm:text-[14px]">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="pl-[2px]">
            {boldHighlights(bullet, item.highlights)}
          </li>
        ))}
      </ul>

      {/* Fills remaining height so the card matches the 6-box stack */}
      <div className="relative mt-auto min-h-[140px] w-full flex-1 overflow-hidden rounded-[14px] bg-[#ececec] sm:min-h-[180px] sm:rounded-[16px]">
        <Image
          src={item.illustrationUrl}
          alt={`${item.company} work illustration`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 560px"
          priority={item.id === EXPERIENCES[0]?.id}
        />
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
      className="mx-auto max-w-[1100px] px-[20px] pb-[48px] sm:px-[32px] sm:pb-[64px] md:px-[48px] md:pb-[80px]"
      aria-labelledby="experience-heading"
    >
      <h2
        id="experience-heading"
        className="m-0 mb-[16px] text-[28px] font-bold tracking-[-0.02em] text-forest sm:mb-[20px] sm:text-[32px] md:mb-[24px] md:text-[36px]"
      >
        Experience
      </h2>

      {/* Heading is outside so left nav + right panel stretch to the same height */}
      <div className="grid gap-[20px] md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] md:items-stretch md:gap-[28px] lg:gap-[36px]">
        {/* Left nav */}
        <div className="min-w-0 md:flex md:h-full md:flex-col">
          {/* Mobile: horizontal scroll pills */}
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

          {/* Desktop: vertical list with dotted connectors — defines column height */}
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

        {/* Right detail — stretches to match left stack height on desktop */}
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
