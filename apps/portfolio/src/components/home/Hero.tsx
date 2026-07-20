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
      className="relative mx-auto w-full max-w-[1310px] overflow-visible px-[clamp(16px,6.5vw,84px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(4px,1vw,12px)]"
      aria-label="Introduction"
    >
      <div className="relative mx-auto aspect-[1310/860] w-full min-h-[500px] max-h-[min(860px,88vw)] sm:min-h-[600px]">
        {/* Giant forest-green name — behind paint + portrait */}
        <div
          className="pointer-events-none absolute inset-x-[-4%] top-[6%] z-0 select-none overflow-visible text-center"
          aria-hidden
        >
          <span className="block text-[clamp(80px,19vw,300px)] font-bold leading-[0.82] tracking-[-0.05em] text-[#016146]">
            SHRITIK
          </span>
        </div>

        {/* Portrait + brush (brush only ~25% beyond portrait) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="absolute left-1/2 top-[14%] z-[2] w-[clamp(200px,34.5%,450px)] -translate-x-1/2"
        >
          <div className="relative mx-auto w-full">
            <div
              className="pointer-events-none absolute left-1/2 top-[48%] z-0 w-[122%] -translate-x-1/2"
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
                src="/hero/portrait.png"
                alt="Shritik"
                width={450}
                height={602}
                priority
                unoptimized
                quality={100}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Welcome tape — shifted up clear of hair */}
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-1/2 top-[4.5%] z-[5] -translate-x-1/2"
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

        {/* Tagline — single line */}
        <motion.p
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="pointer-events-none absolute right-[0%] top-[40%] z-[4] hidden whitespace-nowrap text-left font-[family-name:var(--font-caveat)] text-[clamp(16px,1.7vw,24px)] leading-none text-[#C4A035] sm:block md:right-[2%] lg:right-[4%]"
        >
          — {tagline}
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
          className="absolute bottom-[calc(1%+38px)] left-[-2%] z-[3] w-[clamp(170px,28.5%,369px)] sm:bottom-[calc(3%+38px)] sm:left-[-1%]"
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

        {/* Sticky note — float (offset phase) */}
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
          className="absolute bottom-[calc(5%+38px)] right-[-3%] z-[3] w-[clamp(130px,21.5%,282px)] sm:bottom-[calc(8%+38px)] sm:right-[-1%] md:right-[1%]"
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

      <p className="mt-[-4px] whitespace-nowrap text-center font-[family-name:var(--font-caveat)] text-[18px] text-[#C4A035] sm:hidden">
        — {tagline}
      </p>
    </section>
  );
}
