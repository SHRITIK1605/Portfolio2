"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useChatContext } from "@/context/ChatContext";
import type { HomepageSettings } from "@/types";

const ResumeOverlay = dynamic(
  () => import("@/components/resume/ResumeOverlay"),
  { ssr: false }
);

interface NavbarProps {
  homepage: HomepageSettings;
}

export default function Navbar({ homepage }: NavbarProps) {
  const { openChat } = useChatContext();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <header className="relative z-20 px-[clamp(12px,6.5vw,84px)] pt-[clamp(12px,3.4vw,44px)] md:px-[clamp(16px,6.5vw,84px)] md:pt-[clamp(14px,3.4vw,44px)]">
      <div className="mx-auto flex w-full max-w-[1310px] items-center justify-between gap-[8px] md:gap-[12px]">
        <Link href="/" className="shrink-0" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Shritik"
            width={56}
            height={56}
            className="h-[40px] w-[40px] sm:h-[48px] sm:w-[48px] md:h-[52px] md:w-[52px]"
            priority
          />
        </Link>

        <div className="flex h-[44px] min-w-0 items-center gap-[8px] sm:h-[50px] sm:gap-[10px] md:h-[55px] md:gap-[12px]">
          {/* Resume — PDF layout + zigzag/underline hover motion */}
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            aria-label="Open resume"
            className="group relative h-[44px] w-[108px] shrink-0 overflow-hidden rounded-[10px] border-2 border-[#016146] bg-white active:scale-[0.98] sm:h-[50px] sm:w-[160px] sm:rounded-[12px] md:h-[55px] md:w-[194px] md:rounded-[12px]"
          >
            <span
              className="pointer-events-none absolute -bottom-1 -right-1 z-0 h-[220%] w-[220%] origin-bottom-right scale-0 rounded-full bg-[#FFE566] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:animate-[cta-pulse_0.9s_ease-out_infinite] group-hover:opacity-100"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[1] w-1/2 -skew-x-12 bg-white/50 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />

            {/* Top-left zigzag — wiggles on hover */}
            <svg
              width="32"
              height="8"
              viewBox="0 0 30 7"
              fill="none"
              aria-hidden
              className="pointer-events-none absolute left-[8px] top-[8px] z-[2] scale-75 md:left-[12px] md:top-[10px] md:scale-100 group-hover:animate-[cta-wiggle_0.45s_ease-in-out_infinite] sm:left-[10px] sm:top-[9px] sm:scale-90"
            >
              <path
                d="M0 6L7.4 0L12.5 6L18.8 0L23.9 6L29.6 0"
                stroke="#F8C547"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Centered label + underline that expands on hover */}
            <span className="relative z-[2] flex h-full w-full items-center justify-center">
              <span className="relative text-[13px] font-medium leading-none tracking-[-0.01em] text-[#016146] sm:text-[15px] md:text-[16px]">
                Resume
                <span
                  className="pointer-events-none absolute -bottom-[5px] left-[38%] h-[2.5px] w-[58%] rounded-full bg-[#F8C547] transition-all duration-300 group-hover:left-0 group-hover:w-full"
                  aria-hidden
                />
              </span>
            </span>

            {/* Two-tone dog-ear */}
            <span
              className="pointer-events-none absolute bottom-0 right-0 z-[3] h-[18px] w-[17px] bg-[#FFE7AB] transition-colors duration-300 group-hover:bg-[#F5B800] sm:h-[20px] sm:w-[19px] md:h-[23px] md:w-[22px]"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)",
                borderBottomRightRadius: "10px",
              }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-0 right-0 z-[4] h-[18px] w-[17px] bg-[#FFF4DA] sm:h-[20px] sm:w-[19px] md:h-[23px] md:w-[22px]"
              style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
              aria-hidden
            />
          </button>

          {/* Talk — content-width, equal L/R padding; gradient on hover */}
          <button
            type="button"
            onClick={() => openChat()}
            aria-label="Talk with virtual me"
            className="group relative inline-flex h-[44px] shrink-0 items-center overflow-hidden rounded-[10px] border-2 border-[#016146] bg-white active:scale-[0.98] sm:h-[50px] sm:rounded-[12px] md:h-[55px] md:rounded-[12px]"
          >
            <span
              className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 bg-[linear-gradient(110deg,#016146_0%,#0a7a64_45%,#c4a035_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[1] w-1/2 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />

            <span className="relative z-[2] inline-flex h-full items-center gap-[6px] px-[10px] sm:gap-[8px] sm:px-[12px] md:px-[14px]">
              <Image
                src="/hero/icon-34.svg"
                alt=""
                width={40}
                height={39}
                className="mb-[2px] -ml-[2px] h-[22px] w-[22px] shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-[26px] sm:w-[26px] md:h-[28px] md:w-[28px]"
              />
              <span className="whitespace-nowrap text-[13px] font-medium leading-none tracking-[-0.01em] text-[#016146] transition-colors duration-300 group-hover:text-white sm:text-[14px] md:text-[15px]">
                <span className="sm:hidden">Talk to me</span>
                <span className="hidden sm:inline">Talk with virtual me!</span>
              </span>
            </span>
          </button>
        </div>
      </div>

      {resumeOpen ? (
        <ResumeOverlay
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          fallbackUrl={homepage.resumeUrl}
        />
      ) : null}
    </header>
  );
}
