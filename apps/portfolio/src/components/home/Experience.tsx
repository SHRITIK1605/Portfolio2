"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
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

/**
 * Snaking dotted arrows alternating sides — matches the craft mockup
 * (right curve → left curve → loop → left → right …).
 */
function SnakingConnector({
  variant,
  className,
}: {
  variant: "right" | "left" | "loop";
  className?: string;
}) {
  if (variant === "left") {
    return (
      <svg className={className} viewBox="0 0 120 36" fill="none" aria-hidden>
        <path
          d="M78 2c-22 2-40 8-48 16S18 30 28 34"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeDasharray="2.8 4"
          strokeLinecap="round"
        />
        <path
          d="M22 28l6 6 8-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "loop") {
    return (
      <svg className={className} viewBox="0 0 120 40" fill="none" aria-hidden>
        <path
          d="M72 2c18 0 28 6 28 14s-10 12-22 12c-8 0-12-4-10-8s10-4 16 0c8 5 6 14-8 16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeDasharray="2.8 4"
          strokeLinecap="round"
        />
        <path
          d="M70 32l6 6 8-3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // right
  return (
    <svg className={className} viewBox="0 0 120 36" fill="none" aria-hidden>
      <path
        d="M42 2c22 2 40 8 48 16s12 12 2 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeDasharray="2.8 4"
        strokeLinecap="round"
      />
      <path
        d="M84 28l8 4-2 8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function connectorVariant(index: number): "right" | "left" | "loop" {
  // Match mockup rhythm: right, left, loop, left, right…
  const pattern: Array<"right" | "left" | "loop"> = [
    "right",
    "left",
    "loop",
    "left",
    "right",
  ];
  return pattern[index % pattern.length] ?? "right";
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
      className="pointer-events-none relative mx-auto mb-[12px] h-[100px] w-full max-w-[180px] select-none opacity-95 sm:mb-[14px] sm:h-[112px] md:absolute md:right-[4px] md:top-[-4px] md:z-[2] md:mb-0 md:h-[128px] md:w-[148px] lg:right-[12px]"
      aria-hidden
    >
      {top.map((shot, i) => (
        <div
          key={shot.src}
          className="absolute rounded-[3px] bg-white p-[5px] pb-[18px] shadow-[0_5px_14px_rgba(0,40,30,0.11)]"
          style={{
            width: i === 0 ? "54%" : "52%",
            left: i === 0 ? "8%" : "40%",
            top: i === 0 ? "12%" : "32%",
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
              sizes="90px"
            />
          </div>
        </div>
      ))}
      <RedStar className="absolute left-[44%] top-[4%] z-20 h-[18px] w-[18px] drop-shadow-sm" />
      <SafetyPin className="absolute left-[47%] top-[-2%] z-30 h-[26px] w-[15px]" />
    </div>
  );
}

function SketchLogo({ item, size }: { item: ExperienceItem; size: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-[10px] border border-forest/12 bg-[#faf6ea]"
      style={{ width: size, height: size }}
    >
      <Image
        src={item.sketchLogoUrl}
        alt=""
        fill
        className="object-contain p-[2px]"
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
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      layout
      animate={{
        scale: active ? 1.02 : 1,
        x: active ? 4 : 0,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`relative flex min-h-[46px] w-full items-center gap-[10px] rounded-[12px] border px-[10px] py-[8px] text-left transition-colors sm:min-h-[48px] sm:gap-[12px] sm:rounded-[14px] sm:px-[12px] ${
        active
          ? "border-forest bg-[#f4ecd4] shadow-[0_2px_12px_rgba(0,75,64,0.1)]"
          : "border-forest/22 bg-[#faf3df] hover:border-forest/45"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="exp-active-glow"
          className="pointer-events-none absolute inset-0 rounded-[12px] ring-2 ring-forest/25 sm:rounded-[14px]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : null}
      <SketchLogo item={item} size={36} />
      <span className="relative text-[11px] font-bold uppercase leading-snug tracking-[0.02em] text-forest sm:text-[12px] md:text-[13px]">
        {item.company}
      </span>
      {active ? (
        <span
          className="pointer-events-none absolute -right-[26px] top-1/2 hidden -translate-y-1/2 text-forest/55 md:block"
          aria-hidden
        >
          <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
            <path
              d="M2 9c10 0 14-5 20-5 4 0 6 3 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2.2 3.2"
              strokeLinecap="round"
            />
            <path
              d="M22 3l8 6-8 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </motion.button>
  );
}

function CompanyBlock({
  item,
  active,
}: {
  item: ExperienceItem;
  active: boolean;
}) {
  return (
    <article
      id={`exp-${item.id}`}
      data-exp-id={item.id}
      className={`scroll-mt-[12px] border-b border-forest/10 pb-[24px] last:border-b-0 last:pb-[4px] sm:pb-[28px] ${
        active ? "opacity-100" : "opacity-90"
      }`}
    >
      <header className="mb-[12px] flex flex-col gap-[10px] sm:mb-[14px] sm:flex-row sm:items-start sm:justify-between sm:gap-[14px]">
        <div className="flex min-w-0 items-start gap-[12px]">
          <div
            className={`relative shrink-0 overflow-hidden rounded-[10px] border border-forest/10 ${
              item.logoWide
                ? "h-[42px] w-[76px] sm:h-[48px] sm:w-[86px]"
                : "h-[46px] w-[46px] sm:h-[52px] sm:w-[52px]"
            }`}
            style={{ backgroundColor: item.logoBg ?? "#ffffff" }}
          >
            <Image
              src={item.logoUrl}
              alt={`${item.company} logo`}
              fill
              className="object-contain p-[3px]"
              sizes={item.logoWide ? "86px" : "52px"}
            />
          </div>
          <div className="min-w-0 pt-[1px]">
            <h3 className="m-0 text-[14px] font-bold uppercase leading-tight tracking-[0.02em] text-forest sm:text-[16px] md:text-[17px]">
              {item.company}
            </h3>
            <p className="m-0 mt-[3px] text-[12px] font-medium leading-snug text-forest/75 sm:text-[13px]">
              {item.role}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-[5px] text-[12px] text-forest/80 sm:items-end sm:text-[13px]">
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
        <span
          className="absolute bottom-0 left-[8px] top-[5px] w-[2px] bg-forest/18"
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
        <p className="m-0 mb-[10px] text-[13px] italic leading-relaxed text-forest/85 sm:text-[14px]">
          {item.overview}
        </p>
        <ul className="m-0 flex list-disc flex-col gap-[7px] pl-[18px] text-[13px] leading-relaxed text-forest/90 sm:gap-[9px] sm:text-[14px]">
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
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const scrollingFromNav = useRef(false);

  const polaroids =
    craftImages && craftImages.length > 0
      ? craftImages
      : DEFAULT_CRAFT_POLAROIDS;

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
      top: Math.max(0, target.offsetTop - 10),
      behavior: "smooth",
    });
    window.setTimeout(() => {
      scrollingFromNav.current = false;
    }, 450);
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
      {
        root: panel,
        rootMargin: "-8% 0px -62% 0px",
        threshold: [0.12, 0.35, 0.55],
      }
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
        className="pointer-events-none absolute inset-x-[12px] top-[36px] bottom-[20px] -z-10 rounded-[28px] bg-[#eef3ea]/65 sm:inset-x-[20px]"
        aria-hidden
      />

      <div className="relative mb-[10px] md:mb-[16px] md:pr-[160px]">
        <h2
          id="experience-heading"
          className="m-0 text-[28px] font-bold tracking-[-0.02em] text-forest sm:text-[32px] md:text-[36px]"
        >
          Experience
        </h2>
      </div>

      <CraftPolaroidDecor polaroids={polaroids} />

      <div className="relative z-[1] grid gap-[16px] md:grid-cols-[minmax(210px,280px)_minmax(0,1fr)] md:items-start md:gap-[32px] lg:gap-[40px]">
        {/* Left company stack — defines height on desktop */}
        <div ref={leftRef} className="min-w-0">
          <div className="mb-[4px] flex gap-[8px] overflow-x-auto pb-[6px] [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {EXPERIENCES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCompany(item.id)}
                aria-pressed={item.id === activeId}
                className={`flex min-h-[44px] shrink-0 items-center gap-[8px] rounded-full border px-[12px] py-[7px] transition ${
                  item.id === activeId
                    ? "border-forest bg-[#f4ecd4] font-semibold text-forest"
                    : "border-forest/22 bg-[#faf3df] text-forest/70"
                }`}
              >
                <SketchLogo item={item} size={26} />
                <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.02em]">
                  {item.company}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden md:block">
            <ul className="m-0 flex list-none flex-col p-0">
              {EXPERIENCES.map((item, index) => {
                const variant = connectorVariant(index);
                return (
                  <li key={item.id} className="relative">
                    <ExperienceNavItem
                      item={item}
                      active={item.id === activeId}
                      onSelect={() => scrollToCompany(item.id)}
                    />
                    {index < EXPERIENCES.length - 1 ? (
                      <div
                        className={`flex py-[1px] text-forest/45 ${
                          variant === "left"
                            ? "justify-start pl-[18px]"
                            : "justify-end pr-[10px]"
                        }`}
                        aria-hidden
                      >
                        <SnakingConnector
                          variant={variant}
                          className="h-[28px] w-[88px]"
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right panel — height locked to left column; scroll stays inside */}
        <div className="min-w-0">
          <div
            className="flex flex-col overflow-hidden rounded-[20px] border-[2.5px] border-forest bg-[#fffdf8] shadow-[0_4px_20px_rgba(0,75,64,0.06)] sm:rounded-[24px] sm:border-[3px]"
            style={
              panelHeight
                ? { height: panelHeight, maxHeight: panelHeight }
                : { minHeight: 420 }
            }
          >
            <div
              ref={panelRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[14px] py-[16px] [scrollbar-color:rgba(0,75,64,0.28)_transparent] [scrollbar-width:thin] sm:px-[20px] sm:py-[18px] md:px-[22px]"
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="flex flex-col">
                {EXPERIENCES.map((item) => (
                  <CompanyBlock
                    key={item.id}
                    item={item}
                    active={item.id === activeId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
