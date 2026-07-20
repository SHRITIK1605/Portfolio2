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
            className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px]"
            priority
          />
        </Link>

        <div className="flex min-w-0 items-center gap-[14px] sm:gap-[18px]">
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            aria-label="Open resume"
            className="relative shrink-0 transition hover:opacity-90 active:scale-[0.98]"
          >
            <Image
              src="/hero/btn-resume.svg"
              alt="Resume"
              width={194}
              height={55}
              className="h-[44px] w-auto sm:h-[55px]"
              priority
            />
          </button>

          <button
            type="button"
            onClick={() => openChat()}
            aria-label="Talk with virtual me"
            className="group relative inline-block shrink-0 overflow-hidden rounded-[11px] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Default: exact design SVG */}
            <Image
              src="/hero/btn-talk.svg"
              alt="Talk with virtual me!"
              width={309}
              height={55}
              className="relative z-[1] block h-[44px] w-auto transition-opacity duration-300 group-hover:opacity-0 sm:h-[55px]"
              priority
            />
            {/* Hover: forest → gold gradient fill */}
            <span
              className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center gap-[10px] rounded-[11px] bg-[linear-gradient(110deg,#016146_0%,#0a7a64_42%,#c4a035_100%)] px-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            >
              <Image
                src="/hero/icon-34.svg"
                alt=""
                width={40}
                height={39}
                className="h-[28px] w-[28px] shrink-0"
              />
              <span className="hidden truncate text-[15px] font-medium leading-none text-white sm:inline">
                Talk with virtual me!
              </span>
              <span className="truncate text-[13px] font-medium leading-none text-white sm:hidden">
                Talk to me
              </span>
            </span>
            {/* Shimmer */}
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[3] w-1/2 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />
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
