"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HomepageSettings } from "@/types";

interface HeroProps {
  homepage: HomepageSettings;
}

export default function Hero({ homepage }: HeroProps) {
  const tagline =
    homepage.heroSubtitle?.split("\n")[0]?.trim() ||
    "AI & Digital Product Enthusiast";

  return (
    <section
      className="relative mx-auto max-w-[1100px] overflow-visible px-[16px] pb-[72px] pt-[20px] sm:px-[28px] sm:pb-[88px] sm:pt-[28px] md:px-[40px] md:pb-[110px] md:pt-[36px]"
      aria-label="Introduction"
    >
      {/* Giant watermark name */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none overflow-hidden text-center"
        aria-hidden
      >
        <span className="block text-[18vw] font-bold leading-none tracking-[-0.04em] text-[#f5e6a8]/70 sm:text-[140px] md:text-[180px] lg:text-[210px]">
          SHRITIK
        </span>
      </div>

      <div className="relative z-[1] flex flex-col items-center">
        {/* Welcome tape */}
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-[-6px] sm:mb-[-10px]"
        >
          <div className="bg-[#fde8a5] px-[18px] py-[7px] shadow-[1px_2px_0_rgba(0,75,64,0.08)] [clip-path:polygon(2%_8%,98%_0%,100%_92%,0%_100%)] sm:px-[22px] sm:py-[8px]">
            <p className="m-0 font-[family-name:var(--font-caveat)] text-[16px] font-medium leading-none text-forest sm:text-[18px] md:text-[20px]">
              Welcome to my Portfolio..
            </p>
          </div>
        </motion.div>

        {/* Name + portrait composition */}
        <div className="relative flex w-full max-w-[720px] flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative z-[2] m-0 text-center text-[52px] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-forest sm:text-[72px] md:text-[92px] lg:text-[104px]"
          >
            SHRITIK
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative z-[3] mt-[-18px] w-[min(58vw,280px)] sm:mt-[-28px] sm:w-[320px] md:mt-[-36px] md:w-[360px]"
          >
            <Image
              src="/hero/portrait.png"
              alt="Shritik"
              width={450}
              height={602}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_12px_28px_rgba(0,40,30,0.12)]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pointer-events-none absolute right-[-4%] top-[42%] z-[4] hidden max-w-[200px] text-right font-[family-name:var(--font-caveat)] text-[22px] leading-tight text-[#c4a035] sm:block md:right-[-2%] md:top-[38%] md:max-w-[240px] md:text-[26px] lg:right-[2%]"
          >
            — {tagline.replace(/^—\s*/, "")}
          </motion.p>
        </div>

        {/* Scrap accents */}
        <div className="relative mt-[-28px] flex w-full max-w-[900px] items-end justify-between gap-[12px] sm:mt-[-40px] md:mt-[-48px]">
          <motion.div
            initial={{ opacity: 0, y: 18, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="relative z-[2] w-[48%] max-w-[300px] sm:w-[42%] md:max-w-[340px]"
          >
            <Image
              src="/hero/definition-scrap.png"
              alt="Definition of Shritik"
              width={336}
              height={271}
              className="h-auto w-full object-contain drop-shadow-[0_6px_16px_rgba(0,40,30,0.1)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: 6 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="relative z-[2] mb-[8px] w-[38%] max-w-[220px] sm:mb-[16px] sm:w-[34%] md:max-w-[250px]"
          >
            {/* Prefer vector sticky when possible */}
            <Image
              src="/hero/sticky-note.png"
              alt="Always: start with why, empathy first, clarity over clever"
              width={282}
              height={260}
              className="h-auto w-full object-contain drop-shadow-[0_6px_14px_rgba(0,40,30,0.12)]"
            />
          </motion.div>
        </div>

        {/* Mobile tagline */}
        <p className="mt-[12px] text-center font-[family-name:var(--font-caveat)] text-[20px] text-[#c4a035] sm:hidden">
          — {tagline.replace(/^—\s*/, "")}
        </p>
      </div>
    </section>
  );
}
