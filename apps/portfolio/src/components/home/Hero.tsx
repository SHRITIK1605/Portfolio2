"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HomepageSettings } from "@/types";

interface HeroProps {
  homepage: HomepageSettings;
}

export default function Hero({ homepage: _homepage }: HeroProps) {
  // Craft tagline from landing PDF (not the long heroSubtitle copy)
  const tagline = "AI & Digital Product Enthusiast";

  return (
    <section
      className="relative mx-auto w-full max-w-[1310px] overflow-visible px-[clamp(16px,6.5vw,84px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(4px,1vw,12px)]"
      aria-label="Introduction"
    >
      {/* Design canvas — proportions match portfolio landing.pdf */}
      <div className="relative mx-auto aspect-[1310/860] w-full min-h-[500px] max-h-[min(860px,88vw)] sm:min-h-[600px]">
        {/* Giant pale watermark — behind everything */}
        <div
          className="pointer-events-none absolute inset-x-[-4%] top-[4%] z-0 select-none overflow-visible text-center"
          aria-hidden
        >
          <span className="block text-[clamp(80px,19vw,300px)] font-bold leading-[0.82] tracking-[-0.05em] text-[#F0E08A]/90">
            SHRITIK
          </span>
        </div>

        {/* Welcome tape — above portrait head */}
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-1/2 top-[11%] z-[5] -translate-x-1/2"
        >
          <div
            className="px-[clamp(16px,1.8vw,24px)] py-[clamp(7px,0.75vw,10px)] shadow-[1px_2px_3px_rgba(0,75,64,0.1)]"
            style={{
              background: "#F5D978",
              clipPath: "polygon(1% 12%, 99% 0%, 100% 88%, 0% 100%)",
            }}
          >
            <p className="m-0 whitespace-nowrap font-[family-name:var(--font-caveat)] text-[clamp(16px,1.6vw,21px)] font-semibold leading-none text-[#016146]">
              Welcome to my Portfolio..
            </p>
          </div>
        </motion.div>

        {/* Portrait — centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="absolute left-1/2 top-[14%] z-[2] w-[clamp(210px,34.5%,450px)] -translate-x-1/2"
        >
          <Image
            src="/hero/portrait.png"
            alt="Shritik"
            width={450}
            height={602}
            priority
            className="h-auto w-full object-contain"
          />
        </motion.div>

        {/* Tagline — right of face */}
        <motion.p
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="pointer-events-none absolute right-[1%] top-[40%] z-[4] hidden max-w-[min(260px,26%)] text-left font-[family-name:var(--font-caveat)] text-[clamp(18px,2.05vw,28px)] leading-[1.1] text-[#C4A035] sm:block md:right-[3%] lg:right-[5%]"
        >
          — {tagline}
        </motion.p>

        {/* Definition scrap — bottom left, overlaps portrait */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -3.5 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="absolute bottom-[1%] left-[-2%] z-[3] w-[clamp(170px,28.5%,369px)] sm:bottom-[3%] sm:left-[-1%]"
        >
          <Image
            src="/hero/definition-scrap.png"
            alt="Definition of Shritik"
            width={369}
            height={297}
            className="h-auto w-full object-contain drop-shadow-[0_8px_18px_rgba(0,40,30,0.12)]"
          />
        </motion.div>

        {/* Sticky note — bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: 8 }}
          animate={{ opacity: 1, y: 0, rotate: 5 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="absolute bottom-[5%] right-[-3%] z-[3] w-[clamp(130px,21.5%,282px)] sm:bottom-[8%] sm:right-[-1%] md:right-[1%]"
        >
          <Image
            src="/hero/sticky-note.svg"
            alt="Always: start with why, empathy first, clarity over clever"
            width={282}
            height={260}
            className="h-auto w-full object-contain drop-shadow-[0_6px_14px_rgba(0,40,30,0.12)]"
          />
        </motion.div>
      </div>

      {/* Mobile tagline */}
      <p className="mt-[-4px] text-center font-[family-name:var(--font-caveat)] text-[20px] text-[#C4A035] sm:hidden">
        — {tagline}
      </p>
    </section>
  );
}
