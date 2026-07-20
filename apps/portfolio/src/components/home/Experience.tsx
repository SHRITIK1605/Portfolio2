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
          ? "border-forest bg-[#f4ecd4] shadow-[0_2px_12px_rgba(0,75,64,0.12)]"
          : "border-forest/22 bg-[#faf3df] hover:border-forest/45"
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

function WashiTape({ className }: { className?: string }) {
  return (
    <div
      className={`h-[18px] w-[72px] rotate-[-18deg] rounded-[1px] border border-forest/10 bg-[#c8e0d4]/90 shadow-sm ${className ?? ""}`}
      aria-hidden
    >
      <div
        className="h-full w-full opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,75,64,0.18) 6px, rgba(0,75,64,0.18) 7px)",
        }}
      />
    </div>
  );
}

function MiniSticky({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-[48px] w-[48px] rotate-[8deg] items-start justify-center bg-[#f6e7a1] p-[5px] text-[7px] leading-tight text-forest/70 shadow-[1px_2px_6px_rgba(0,0,0,0.12)] ${className ?? ""}`}
      aria-hidden
    >
      <span className="font-medium italic">build · ship</span>
    </div>
  );
}

function DeskLamp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 80" fill="none" aria-hidden>
      <path
        d="M28 78h20M38 78V52"
        stroke="#8a7355"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M38 52c-14-2-22-12-20-24 1.5 6 8 12 20 14 12-2 18.5-8 20-14 2 12-6 22-20 24Z"
        fill="#c4a574"
        stroke="#8a7355"
        strokeWidth="1.5"
      />
      <ellipse cx="38" cy="28" rx="10" ry="4" fill="#f0e2c4" opacity="0.85" />
      <circle cx="38" cy="52" r="3" fill="#8a7355" />
    </svg>
  );
}

function CoffeeCup({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M10 16h22v18c0 4-3.5 7-8 7h-6c-4.5 0-8-3-8-7V16Z"
        fill="#f4efe6"
        stroke="#004b40"
        strokeWidth="1.6"
      />
      <path
        d="M32 20h5c3 0 5 2.5 5 5.5S40 31 37 31h-5"
        stroke="#004b40"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 14h18c1 0 2 1 2 2H10c0-1 1-2 2-2Z" fill="#004b40" />
      <path
        d="M16 10c0-2 1.5-3 2.5-3M22 9c0-2 1.5-3 2.5-3"
        stroke="#004b40"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

/** Scrapbook clip: notebook grid behind, pinned polaroids on top. */
function PolaroidClip({
  item,
  height,
  fallback,
}: {
  item: ExperienceItem;
  height: number | null;
  fallback: CraftPolaroid[];
}) {
  const images: [string, string] = [
    item.clipImages[0] ||
      fallback[0]?.src ||
      "/experience/craft/polaroid-notebook.jpg",
    item.clipImages[1] ||
      fallback[1]?.src ||
      "/experience/craft/polaroid-desk.jpg",
  ];

  // Smaller frames so ~70% of notebook grid stays visible
  const shots = [
    {
      src: images[0],
      rotate: -8,
      left: "16%",
      top: "18%",
      width: "48%",
      z: 2,
    },
    {
      src: images[1],
      rotate: 7,
      left: "36%",
      top: "34%",
      width: "46%",
      z: 3,
    },
  ];

  return (
    <div
      className="relative w-full select-none overflow-visible"
      style={
        height
          ? { height, minHeight: height }
          : { minHeight: 320, aspectRatio: "3 / 4" }
      }
      aria-hidden
    >
      <NotebookBookBg />

      <WashiTape className="absolute left-[8%] top-[10%] z-[1]" />
      <MiniSticky className="absolute bottom-[12%] left-[8%] z-[4]" />
      <DeskLamp className="absolute right-[-2%] top-[6%] z-[5] h-[72px] w-[58px] drop-shadow-md sm:h-[88px] sm:w-[70px]" />
      <CoffeeCup className="absolute bottom-[8%] right-[6%] z-[5] h-[44px] w-[44px] rotate-[-8deg] drop-shadow-sm sm:h-[52px] sm:w-[52px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
          className="absolute inset-0 z-[2]"
        >
          {shots.map((shot, i) => (
            <div
              key={`${item.id}-${i}`}
              className="absolute rounded-[4px] bg-white p-[7px] pb-[20px] shadow-[0_8px_20px_rgba(0,40,30,0.15)]"
              style={{
                width: shot.width,
                left: shot.left,
                top: shot.top,
                zIndex: shot.z,
                transform: `rotate(${shot.rotate}deg)`,
              }}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#eee6d4]">
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="220px"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pin + star seated on the overlapping photo tops */}
      <RedStar className="absolute left-[42%] top-[14%] z-30 h-[28px] w-[28px] drop-shadow-md sm:h-[32px] sm:w-[32px]" />
      <SafetyPin className="absolute left-[45%] top-[12%] z-40 h-[42px] w-[22px] sm:h-[48px] sm:w-[24px]" />
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
      className="relative mx-auto max-w-[1320px] overflow-visible px-[16px] pb-[56px] sm:px-[28px] sm:pb-[72px] md:px-[36px] md:pb-[88px] lg:px-[40px]"
      aria-labelledby="experience-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-[8px] top-[36px] bottom-[20px] -z-10 rounded-[28px] bg-[#eef3ea]/65 sm:inset-x-[16px]"
        aria-hidden
      />

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
          Experience
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
                    ? "border-forest bg-[#f4ecd4] font-semibold text-forest"
                    : "border-forest/22 bg-[#faf3df] text-forest/70"
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
