"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useChatContext } from "@/context/ChatContext";
import MenuButton from "@/components/layout/MenuButton";
import ResumeOverlay from "@/components/resume/ResumeOverlay";
import type { HomepageSettings } from "@/types";

interface NavbarProps {
  homepage: HomepageSettings;
}

/** ~27% smaller than native SVG CTAs (194×55 / 309×55) */
const RESUME_W = 142;
const TALK_W = 226;
const BTN_H = 40;

export default function Navbar({ homepage }: NavbarProps) {
  const { openChat } = useChatContext();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <header className="relative z-20 px-[clamp(16px,6.5vw,84px)] pt-[clamp(14px,3.4vw,44px)]">
      <div className="mx-auto flex w-full max-w-[1310px] items-center justify-between gap-[12px]">
        <Link href="/" className="shrink-0" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Shritik"
            width={56}
            height={56}
            className="h-[44px] w-[44px] sm:h-[48px] sm:w-[48px]"
            priority
          />
        </Link>

        <div className="flex min-w-0 items-center gap-[10px] sm:gap-[14px]">
          {/* Resume — yellow crazy fill on hover; layout locked */}
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            aria-label="Open resume"
            style={{ width: RESUME_W, height: BTN_H }}
            className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[9px] border-2 border-[#016146] bg-white active:scale-[0.98]"
          >
            {/* Yellow fill — bursts from bottom-right */}
            <span
              className="pointer-events-none absolute -bottom-1 -right-1 z-0 h-[220%] w-[220%] origin-bottom-right scale-0 rounded-full bg-[#FFE566] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100"
              aria-hidden
            />
            {/* Pulse rings */}
            <span
              className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:animate-[cta-pulse_0.9s_ease-out_infinite] group-hover:opacity-100"
              aria-hidden
            />
            {/* Shimmer sweep */}
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[1] w-1/2 -skew-x-12 bg-white/50 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />

            <span className="relative z-[2] inline-flex h-full w-full items-center justify-center gap-[7px] px-[12px]">
              <svg
                width="16"
                height="10"
                viewBox="0 0 22 12"
                fill="none"
                aria-hidden
                className="shrink-0 group-hover:animate-[cta-wiggle_0.45s_ease-in-out_infinite]"
              >
                <path
                  d="M1 8C3 4 5 10 7 6C9 2 11 9 13 5C15 1 17 8 21 3"
                  stroke="#F5B800"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="relative text-[13px] font-medium leading-none text-[#016146] sm:text-[14px]">
                Resume
                <span
                  className="absolute -bottom-[3px] left-[55%] h-[2px] w-[42%] rounded-full bg-[#F5B800] transition-all duration-300 group-hover:left-0 group-hover:w-full"
                  aria-hidden
                />
              </span>
            </span>

            {/* Folded corner accent */}
            <span
              className="pointer-events-none absolute bottom-0 right-0 z-[3] h-[12px] w-[14px] bg-[#FFE7AB] transition-colors duration-300 group-hover:bg-[#F5B800]"
              style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
              aria-hidden
            />
          </button>

          {/* Talk — gradient fill on hover; same layout always */}
          <button
            type="button"
            onClick={() => openChat()}
            aria-label="Talk with virtual me"
            style={{ width: TALK_W, height: BTN_H }}
            className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[9px] border-2 border-[#016146] bg-white active:scale-[0.98]"
          >
            <span
              className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 bg-[linear-gradient(110deg,#016146_0%,#0a7a64_45%,#c4a035_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[1] w-1/2 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />

            <span className="relative z-[2] inline-flex h-full w-full items-center justify-center gap-[8px] px-[12px]">
              <Image
                src="/hero/icon-34.svg"
                alt=""
                width={40}
                height={39}
                className="h-[20px] w-[20px] shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              />
              <span className="truncate text-[12px] font-medium leading-none text-[#016146] transition-colors duration-300 group-hover:text-white sm:text-[13px]">
                <span className="sm:hidden">Talk to me</span>
                <span className="hidden sm:inline">Talk with virtual me!</span>
              </span>
            </span>
          </button>

          <MenuButton homepage={homepage} />
        </div>
      </div>

      <ResumeOverlay
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        fallbackUrl={homepage.resumeUrl}
      />
    </header>
  );
}
