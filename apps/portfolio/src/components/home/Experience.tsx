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
      className="relative shrink-0 overflow-hidden rounded-[10px] border-2 border-forest/25 bg-white"
      style={{ width: size, height: size }}
    >
      <Image
        src={item.sketchLogoUrl}
        alt=""
        fill
        className="object-contain p-[1px] contrast-[1.35] brightness-[0.92] saturate-[1.2]"
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
        <SketchLogo item={item} size={44} />
      </motion.span>
      <span className="relative text-[11px] font-bold uppercase leading-snug tracking-[0.02em] text-forest sm:text-[12px] md:text-[13px]">
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

function ExperienceClip({
  item,
  height,
}: {
  item: ExperienceItem;
  height: number | null;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[18px] border-[2.5px] border-forest/25 bg-[#f3eee0] shadow-[0_4px_16px_rgba(0,40,30,0.08)] sm:rounded-[20px]"
      style={
        height
          ? { height, maxHeight: height }
          : { minHeight: 220, aspectRatio: "3 / 4" }
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 1.04, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={item.clipImageUrl}
            alt={item.clipImageAlt ?? `${item.company} clip`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 220px"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-[12px] pb-[12px] pt-[36px]">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
              {item.company}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Polaroid-style clip corners */}
      <span
        className="pointer-events-none absolute left-[10px] top-[10px] h-[10px] w-[10px] rounded-full bg-white/80 shadow-sm"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute right-[10px] top-[10px] h-[10px] w-[10px] rounded-full bg-white/80 shadow-sm"
        aria-hidden
      />
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

      <div className="relative z-[1] grid gap-[16px] md:grid-cols-[minmax(200px,250px)_minmax(0,1fr)] md:items-start md:gap-[24px] lg:gap-[28px]">
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
                <SketchLogo item={item} size={28} />
                <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.02em]">
                  {item.company}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden md:block">
            <ul className="m-0 flex list-none flex-col gap-[18px] p-0 sm:gap-[20px]">
              {EXPERIENCES.map((item, index) => (
                <li key={item.id} className="relative">
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

        <div className="flex min-w-0 flex-col gap-[14px] md:flex-row md:items-stretch md:gap-[14px] lg:gap-[16px]">
          {/* Detail panel — 70% */}
          <div
            className="flex min-w-0 flex-col overflow-hidden rounded-[20px] border-[2.5px] border-forest bg-white shadow-[0_4px_20px_rgba(0,75,64,0.06)] sm:rounded-[24px] sm:border-[3px] md:w-[70%]"
            style={
              panelHeight
                ? { height: panelHeight, maxHeight: panelHeight }
                : { minHeight: 420 }
            }
          >
            <div
              ref={panelRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[14px] py-[14px] [scrollbar-color:rgba(0,75,64,0.28)_transparent] [scrollbar-width:thin] sm:px-[18px] sm:py-[16px] md:px-[20px]"
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

          {/* Scroll-synced clip — 30% */}
          <div className="md:w-[30%]">
            {activeItem ? (
              <ExperienceClip item={activeItem} height={panelHeight} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
