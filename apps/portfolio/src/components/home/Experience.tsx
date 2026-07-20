"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "framer-motion";
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

type ArrowKind =
  | "arc-right"
  | "arc-left"
  | "swoop-out"
  | "loop"
  | "zigzag"
  | "wide-right";

const ARROW_SEQUENCE: ArrowKind[] = [
  "swoop-out",
  "arc-left",
  "wide-right",
  "loop",
  "zigzag",
];

/** Organic dotted connectors — tip centered on path end via marker. */
function CraftArrow({
  kind,
  markerId,
  className,
}: {
  kind: ArrowKind;
  markerId: string;
  className?: string;
}) {
  const paths: Record<
    ArrowKind,
    { d: string; viewBox: string; w: number; h: number; align: string }
  > = {
    "arc-right": {
      d: "M52 2 C78 4, 108 14, 114 30",
      viewBox: "0 0 128 40",
      w: 104,
      h: 34,
      align: "justify-end -mr-[14px]",
    },
    "arc-left": {
      d: "M78 2 C48 6, 18 16, 12 30",
      viewBox: "0 0 128 40",
      w: 104,
      h: 34,
      align: "justify-start -ml-[14px]",
    },
    "swoop-out": {
      d: "M46 4 C92 -10, 148 6, 138 24 C130 34, 108 34, 96 30",
      viewBox: "0 0 160 44",
      w: 140,
      h: 36,
      align: "justify-end -mr-[42px]",
    },
    loop: {
      d: "M62 3 C96 0, 118 10, 108 20 C98 30, 74 26, 80 16 C86 8, 110 10, 118 26 C122 36, 100 40, 74 38",
      viewBox: "0 0 140 48",
      w: 118,
      h: 40,
      align: "justify-center -mr-[10px]",
    },
    zigzag: {
      d: "M36 3 C54 3, 58 15, 76 15 C94 15, 98 29, 116 31",
      viewBox: "0 0 132 40",
      w: 112,
      h: 34,
      align: "justify-center",
    },
    "wide-right": {
      d: "M40 6 C88 -14, 158 4, 150 22 C142 34, 118 36, 104 32",
      viewBox: "0 0 168 46",
      w: 148,
      h: 38,
      align: "justify-end -mr-[48px]",
    },
  };

  const cfg = paths[kind];

  return (
    <motion.div
      initial={{ opacity: 0, pathLength: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`flex overflow-visible py-[3px] text-forest/55 ${cfg.align}`}
      aria-hidden
    >
      <svg
        className={className}
        width={cfg.w}
        height={cfg.h}
        viewBox={cfg.viewBox}
        fill="none"
        overflow="visible"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            {/* Tip apex at (7,4.5) so it sits on the stroke end */}
            <path d="M0.5 0.5 L8 4.5 L0.5 8.5 Z" fill="currentColor" />
          </marker>
        </defs>
        <motion.path
          d={cfg.d}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeDasharray="2.4 3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${markerId})`}
          initial={{ pathLength: 0, opacity: 0.35 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
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
      className="pointer-events-none relative mx-auto mb-[12px] h-[100px] w-full max-w-[180px] select-none opacity-95 sm:mb-[14px] sm:h-[112px] md:absolute md:right-[4px] md:top-[-4px] md:z-[2] md:mb-0 md:h-[128px] md:w-[148px] lg:right-[12px]"
      aria-hidden
    >
      {top.map((shot, i) => (
        <motion.div
          key={shot.src}
          initial={{ opacity: 0, y: 10, rotate: shot.rotate - 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: shot.rotate }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
          className="absolute rounded-[3px] bg-white p-[5px] pb-[18px] shadow-[0_5px_14px_rgba(0,40,30,0.11)]"
          style={{
            width: i === 0 ? "54%" : "52%",
            left: i === 0 ? "8%" : "40%",
            top: i === 0 ? "12%" : "32%",
            zIndex: i + 1,
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
        </motion.div>
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
        className="object-contain p-[1px]"
        sizes={`${size}px`}
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
      initial={{ opacity: 0, x: -14 }}
      animate={{
        opacity: 1,
        x: active ? 6 : 0,
        scale: active ? 1.03 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 26,
        delay: active ? 0 : index * 0.03,
      }}
      className={`relative flex min-h-[46px] w-full items-center gap-[10px] rounded-[12px] border px-[10px] py-[8px] text-left sm:min-h-[48px] sm:gap-[12px] sm:rounded-[14px] sm:px-[12px] ${
        active
          ? "border-forest bg-[#f4ecd4] shadow-[0_2px_12px_rgba(0,75,64,0.12)]"
          : "border-forest/22 bg-[#faf3df] hover:border-forest/45"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="exp-active-glow"
          className="pointer-events-none absolute inset-0 rounded-[12px] ring-2 ring-forest/30 sm:rounded-[14px]"
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
        />
      ) : null}
      <motion.span
        animate={{ rotate: active ? [-2, 2, 0] : 0 }}
        transition={{ duration: 0.45 }}
      >
        <SketchLogo item={item} size={36} />
      </motion.span>
      <span className="relative text-[11px] font-bold uppercase leading-snug tracking-[0.02em] text-forest sm:text-[12px] md:text-[13px]">
        {item.company}
      </span>
      {active ? (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-none absolute -right-[26px] top-1/2 hidden -translate-y-1/2 text-forest/55 md:block"
          aria-hidden
        >
          <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
            <defs>
              <marker
                id="nav-tip"
                markerWidth="7"
                markerHeight="7"
                refX="5.5"
                refY="3.5"
                orient="auto"
              >
                <path d="M0 0 L6.5 3.5 L0 7 Z" fill="currentColor" />
              </marker>
            </defs>
            <path
              d="M2 9c10 0 14-5 20-5 3.5 0 5.5 2.5 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2.2 3.2"
              strokeLinecap="round"
              markerEnd="url(#nav-tip)"
            />
          </svg>
        </motion.span>
      ) : null}
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
    <motion.article
      ref={ref}
      id={`exp-${item.id}`}
      data-exp-id={item.id}
      initial={{ opacity: 0.55, y: 18 }}
      animate={{
        opacity: active ? 1 : 0.72,
        y: 0,
        scale: active ? 1 : 0.985,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`scroll-mt-[10px] ${isLast ? "pb-[8px]" : ""}`}
    >
      <div className="px-[2px]">
        <header className="mb-[12px] flex flex-col gap-[10px] sm:mb-[14px] sm:flex-row sm:items-start sm:justify-between sm:gap-[14px]">
          <div className="flex min-w-0 items-start gap-[12px]">
            <motion.div
              animate={
                active
                  ? { boxShadow: "0 0 0 3px rgba(0,75,64,0.12)" }
                  : { boxShadow: "0 0 0 0 rgba(0,75,64,0)" }
              }
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
            </motion.div>
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
            <motion.span
              className="h-[5px] w-[5px] rounded-full bg-forest"
              animate={{ scale: active ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />
          </span>

          <p className="m-0 mb-[8px] text-[12px] font-semibold uppercase tracking-[0.04em] text-forest sm:text-[13px]">
            {item.dates}
          </p>
          <p className="m-0 mb-[10px] text-[13px] italic leading-relaxed text-forest/85 sm:text-[14px]">
            {item.overview}
          </p>
          <ul className="m-0 flex list-disc flex-col gap-[7px] pl-[18px] text-[13px] leading-relaxed text-forest/90 sm:gap-[9px] sm:text-[14px]">
            {item.bullets.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={{ opacity: 0, x: 8 }}
                animate={
                  active
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0.85, x: 0 }
                }
                transition={{ delay: active ? i * 0.04 : 0, duration: 0.28 }}
                className="pl-[2px]"
              >
                {boldHighlights(bullet, item.highlights)}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider centered between companies */}
      {!isLast ? (
        <div
          className="flex items-center py-[22px] sm:py-[26px]"
          aria-hidden
        >
          <span className="h-px w-full bg-forest/14" />
        </div>
      ) : (
        <div className="h-[12px]" aria-hidden />
      )}
    </motion.article>
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
      top: Math.max(0, target.offsetTop - 8),
      behavior: "smooth",
    });
    window.setTimeout(() => {
      scrollingFromNav.current = false;
    }, 500);
  }, []);

  // Reliable active detection — including last company at bottom
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
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 48;
      if (nearBottom) {
        const last = blocks[blocks.length - 1]?.getAttribute("data-exp-id");
        if (last) setActiveId(last);
        return;
      }

      const probe = scrollTop + Math.min(140, clientHeight * 0.28);
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
      className="relative mx-auto max-w-[1100px] overflow-visible px-[20px] pb-[56px] sm:px-[32px] sm:pb-[72px] md:px-[48px] md:pb-[88px]"
      aria-labelledby="experience-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-[12px] top-[36px] bottom-[20px] -z-10 rounded-[28px] bg-[#eef3ea]/65 sm:inset-x-[20px]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative mb-[10px] md:mb-[16px] md:pr-[160px]"
      >
        <h2
          id="experience-heading"
          className="m-0 text-[28px] font-bold tracking-[-0.02em] text-forest sm:text-[32px] md:text-[36px]"
        >
          Experience
        </h2>
      </motion.div>

      <CraftPolaroidDecor polaroids={polaroids} />

      <div className="relative z-[1] grid gap-[16px] md:grid-cols-[minmax(210px,280px)_minmax(0,1fr)] md:items-start md:gap-[32px] lg:gap-[40px]">
        <div ref={leftRef} className="min-w-0 overflow-visible">
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

          <div className="relative hidden overflow-visible md:block">
            <ul className="m-0 flex list-none flex-col overflow-visible p-0">
              {EXPERIENCES.map((item, index) => (
                <li key={item.id} className="relative overflow-visible">
                  <ExperienceNavItem
                    item={item}
                    active={item.id === activeId}
                    onSelect={() => scrollToCompany(item.id)}
                    index={index}
                  />
                  {index < EXPERIENCES.length - 1 ? (
                    <CraftArrow
                      kind={ARROW_SEQUENCE[index] ?? "arc-right"}
                      markerId={`exp-arrow-${index}`}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0">
          <motion.div
            layout
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
              <div className="flex flex-col pb-[min(28%,120px)]">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
