"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

/** Tall hand-drawn dotted connector between company pills (matches mockup flow). */
function DottedConnector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 56" fill="none" aria-hidden>
      <path
        d="M24 2c0 8-14 10-14 20s14 10 14 20  -10 8-10 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="3 4.5"
        strokeLinecap="round"
      />
      <path
        d="M18 48l6 7 6-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function CraftPolaroidDecor({ polaroids }: { polaroids: CraftPolaroid[] }) {
  const top = polaroids.slice(0, 2);
  if (top.length === 0) return null;

  return (
    <div
      className="pointer-events-none relative mx-auto mb-[16px] h-[120px] w-full max-w-[220px] select-none sm:mb-[20px] sm:h-[132px] md:absolute md:right-[8px] md:top-0 md:z-[2] md:mb-0 md:h-[150px] md:w-[170px] lg:right-[16px]"
      aria-hidden
    >
      {top.map((shot, i) => (
        <div
          key={shot.src}
          className="absolute rounded-[3px] bg-white p-[6px] pb-[22px] shadow-[0_6px_18px_rgba(0,40,30,0.12)]"
          style={{
            width: i === 0 ? "56%" : "54%",
            left: i === 0 ? "6%" : "38%",
            top: i === 0 ? "10%" : "30%",
            zIndex: i + 1,
            transform: `rotate(${shot.rotate}deg)`,
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
            <Image
              src={shot.src}
              alt=""
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
          {shot.caption ? (
            <p className="m-0 mt-[4px] text-center text-[9px] font-medium lowercase tracking-wide text-forest/50">
              {shot.caption}
            </p>
          ) : null}
        </div>
      ))}
      <RedStar className="absolute left-[44%] top-[4%] z-20 h-[22px] w-[22px] drop-shadow-sm" />
      <SafetyPin className="absolute left-[47%] top-[-2%] z-30 h-[30px] w-[18px]" />
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
        className="object-contain p-[3px]"
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
          className="pointer-events-none absolute -right-[28px] top-1/2 hidden -translate-y-1/2 text-forest/50 md:block"
          aria-hidden
        >
          <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
            <path
              d="M2 11c8 0 14-6 20-6s8 6 8 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="2.5 3.5"
              strokeLinecap="round"
            />
            <path
              d="M24 4l8 7-8 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

function CompanyBlock({ item }: { item: ExperienceItem }) {
  return (
    <article
      id={`exp-${item.id}`}
      data-exp-id={item.id}
      className="scroll-mt-[16px] border-b border-forest/10 pb-[28px] last:border-b-0 last:pb-[8px] sm:pb-[32px]"
    >
      <header className="mb-[14px] flex flex-col gap-[12px] sm:mb-[16px] sm:flex-row sm:items-start sm:justify-between sm:gap-[16px]">
        <div className="flex min-w-0 items-start gap-[12px] sm:gap-[14px]">
          <div
            className={`relative shrink-0 overflow-hidden rounded-[10px] border border-forest/10 sm:rounded-[12px] ${
              item.logoWide
                ? "h-[44px] w-[78px] sm:h-[50px] sm:w-[90px]"
                : "h-[48px] w-[48px] sm:h-[56px] sm:w-[56px]"
            }`}
            style={{ backgroundColor: item.logoBg ?? "#ffffff" }}
          >
            <Image
              src={item.logoUrl}
              alt={`${item.company} logo`}
              fill
              className="object-contain p-[4px]"
              sizes={item.logoWide ? "90px" : "56px"}
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
      </header>

      {/* One timeline stop per company: Start – End */}
      <div className="relative pl-[28px] sm:pl-[32px]">
        <span
          className="absolute bottom-0 left-[9px] top-[6px] w-[2px] bg-forest/20"
          aria-hidden
        />
        <span
          className="absolute left-[3px] top-[4px] flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-forest bg-white"
          aria-hidden
        >
          <span className="h-[5px] w-[5px] rounded-full bg-forest" />
        </span>

        <p className="m-0 mb-[10px] text-[12px] font-semibold uppercase tracking-[0.04em] text-forest sm:text-[13px]">
          {item.dates}
        </p>
        <p className="m-0 mb-[12px] text-[13px] italic leading-relaxed text-forest/85 sm:mb-[14px] sm:text-[14px]">
          {item.overview}
        </p>
        <ul className="m-0 flex list-disc flex-col gap-[8px] pl-[18px] text-[13px] leading-relaxed text-forest/90 sm:gap-[10px] sm:text-[14px]">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="pl-[2px]">
              {boldHighlights(bullet, item.highlights)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

interface ExperienceProps {
  craftImages?: CraftPolaroid[] | null;
}

export default function Experience({ craftImages }: ExperienceProps) {
  const [activeId, setActiveId] = useState(EXPERIENCES[0]?.id ?? "bse");
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollingFromNav = useRef(false);

  const polaroids =
    craftImages && craftImages.length > 0
      ? craftImages
      : DEFAULT_CRAFT_POLAROIDS;

  const scrollToCompany = useCallback((id: string) => {
    const panel = panelRef.current;
    const target = panel?.querySelector<HTMLElement>(`#exp-${id}`);
    if (!panel || !target) return;
    scrollingFromNav.current = true;
    setActiveId(id);
    panel.scrollTo({
      top: target.offsetTop - 12,
      behavior: "smooth",
    });
    window.setTimeout(() => {
      scrollingFromNav.current = false;
    }, 500);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const blocks = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-exp-id]")
    );
    if (blocks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingFromNav.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );
        const id = visible[0]?.target.getAttribute("data-exp-id");
        if (id) setActiveId(id);
      },
      { root: panel, rootMargin: "-10% 0px -55% 0px", threshold: [0.15, 0.4] }
    );

    blocks.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative mx-auto max-w-[1100px] overflow-visible px-[20px] pb-[56px] sm:px-[32px] sm:pb-[72px] md:px-[48px] md:pb-[88px]"
      aria-labelledby="experience-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-[12px] top-[40px] bottom-[24px] -z-10 rounded-[32px] bg-[#eef3ea]/70 sm:inset-x-[20px]"
        aria-hidden
      />

      <div className="relative mb-[12px] md:mb-[20px] md:pr-[180px]">
        <h2
          id="experience-heading"
          className="m-0 text-[28px] font-bold tracking-[-0.02em] text-forest sm:text-[32px] md:text-[36px]"
        >
          Experience
        </h2>
      </div>

      {/* Polaroids sit in header margin — do not cover the scroll panel text */}
      <CraftPolaroidDecor polaroids={polaroids} />

      <div className="relative z-[1] grid gap-[20px] md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] md:items-stretch md:gap-[36px] lg:gap-[44px]">
        <div className="min-w-0 md:flex md:h-full md:flex-col">
          <div className="mb-[4px] flex gap-[10px] overflow-x-auto pb-[8px] [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {EXPERIENCES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCompany(item.id)}
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
                    onSelect={() => scrollToCompany(item.id)}
                  />
                  {index < EXPERIENCES.length - 1 ? (
                    <div
                      className="flex justify-center py-[4px] text-forest/40"
                      aria-hidden
                    >
                      <DottedConnector className="h-[48px] w-[40px]" />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 md:h-full">
          <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[22px] border-[2.5px] border-forest bg-[#fffdf8] shadow-[0_4px_24px_rgba(0,75,64,0.06)] sm:min-h-[480px] sm:rounded-[28px] sm:border-[3px] md:min-h-0">
            <div
              ref={panelRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[16px] py-[18px] [scrollbar-color:rgba(0,75,64,0.25)_transparent] [scrollbar-width:thin] sm:px-[22px] sm:py-[22px] md:px-[26px]"
            >
              <div className="flex flex-col gap-[8px]">
                {EXPERIENCES.map((item) => (
                  <CompanyBlock key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
