"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HomepageSettings } from "@/types";

interface HeroProps {
  homepage: HomepageSettings;
}

const floatTransition = {
  duration: 3.6,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

export default function Hero({ homepage: _homepage }: HeroProps) {
  const tagline = "AI & Digital Product Enthusiast";

  return (
    <section
      className="relative mx-auto w-full max-w-[1310px] overflow-x-clip px-[clamp(16px,6.5vw,84px)] pb-[clamp(32px,5vw,64px)] pt-[clamp(4px,1vw,12px)] md:overflow-visible"
      aria-label="Introduction"
    >
      <div className="relative mx-auto aspect-[1310/860] w-full min-h-[460px] max-h-[min(860px,125vw)] sm:min-h-[600px] sm:max-h-[min(860px,88vw)]">
        {/* Giant forest-green name — behind paint + portrait */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[calc(6%-15px)] z-0 select-none overflow-visible text-center sm:inset-x-[-4%]"
          aria-hidden
        >
          <span className="block text-[clamp(48px,14.5vw,300px)] font-bold leading-[0.82] tracking-[-0.05em] text-[#016146] sm:text-[clamp(80px,19vw,300px)]">
            SHRITIK
          </span>
        </div>

        {/* Portrait + static zigzag paint */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="absolute left-1/2 top-[calc(14%+28px)] z-[2] w-[clamp(160px,42%,450px)] -translate-x-1/2 sm:top-[calc(14%+60px)] sm:w-[clamp(200px,34.5%,450px)]"
        >
          <div className="relative mx-auto w-full">
            <div
              className="pointer-events-none absolute left-1/2 top-[calc(48%-90px)] z-0 w-[122%] -translate-x-1/2"
              aria-hidden
            >
              <Image
                src="/hero/zigzag-paint.png"
                alt=""
                width={775}
                height={628}
                priority
                unoptimized
                quality={100}
                className="h-auto w-full origin-center object-contain opacity-[0.9]"
              />
            </div>

            <div className="relative z-[1] w-full">
              <Image
                src="/hero/portrait.webp?v=cream-shirt-fade-6"
                alt="Shritik"
                width={450}
                height={563}
                priority
                unoptimized
                quality={85}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Welcome tape */}
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-1/2 top-[calc(4.5%-15px)] z-[5] -translate-x-1/2"
        >
          <div
            className="px-[clamp(12px,1.8vw,24px)] py-[clamp(6px,0.75vw,10px)] shadow-[1px_2px_3px_rgba(0,75,64,0.1)]"
            style={{
              background: "#F5D978",
              clipPath: "polygon(1% 12%, 99% 0%, 100% 88%, 0% 100%)",
            }}
          >
            <p className="m-0 whitespace-nowrap font-[family-name:var(--font-caveat)] text-[clamp(15px,1.8vw,24px)] font-semibold leading-none text-[#016146]">
              Welcome to my Portfolio..
            </p>
          </div>
        </motion.div>

        {/* Tagline — single line */}
        <motion.p
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="pointer-events-none absolute right-[0%] top-[40%] z-[4] hidden whitespace-nowrap text-left font-[family-name:var(--font-caveat)] text-[clamp(18px,1.95vw,28px)] leading-none text-[#C4A035] sm:block md:right-[2%] lg:right-[4%]"
        >
          {tagline}
        </motion.p>

        {/* Definition scrap — float */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -3.5 }}
          animate={{
            opacity: 1,
            y: [0, -7, 0],
            rotate: [-3.5, -2.8, -3.5],
          }}
          transition={{
            opacity: { duration: 0.55, delay: 0.2 },
            y: { ...floatTransition, delay: 0.4 },
            rotate: { ...floatTransition, delay: 0.4, duration: 4.2 },
          }}
          className="absolute bottom-[calc(2%+72px)] left-[0%] z-[3] w-[clamp(120px,34%,369px)] sm:bottom-[calc(3%+88px)] sm:left-[calc(-1%-20px)] sm:w-[clamp(171px,28.8%,369px)]"
        >
          <Image
            src="/hero/definition-scrap-clear.png"
            alt="Definition of Shritik"
            width={328}
            height={271}
            unoptimized
            quality={100}
            className="h-auto w-full object-contain drop-shadow-[0_8px_18px_rgba(0,40,30,0.12)]"
          />
        </motion.div>

        {/* Sticky note — float */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: 5 }}
          animate={{
            opacity: 1,
            y: [0, -6, 0],
            rotate: [5, 6.2, 5],
          }}
          transition={{
            opacity: { duration: 0.55, delay: 0.26 },
            y: { ...floatTransition, delay: 1.1, duration: 3.9 },
            rotate: { ...floatTransition, delay: 1.1, duration: 4.5 },
          }}
          className="absolute bottom-[calc(4%+28px)] right-[0%] z-[3] w-[clamp(100px,30%,318px)] sm:bottom-[calc(8%+38px)] sm:right-[-1%] sm:w-[clamp(148px,24.5%,318px)] md:right-[1%]"
        >
          <Image
            src="/hero/sticky-note.svg"
            alt="Always: start with why, empathy first, clarity over clever"
            width={282}
            height={260}
            unoptimized
            quality={100}
            className="h-auto w-full object-contain drop-shadow-[0_6px_14px_rgba(0,40,30,0.12)]"
          />
        </motion.div>
      </div>

      <p className="mt-[-4px] px-[4px] text-center font-[family-name:var(--font-caveat)] text-[16px] leading-snug text-[#C4A035] sm:hidden">
        {tagline}
      </p>
    </section>
  );
}
