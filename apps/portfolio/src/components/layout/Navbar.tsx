"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import SparkleIcon from "@/components/ui/SparkleIcon";
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
    <header className="relative z-20 px-[16px] pt-[16px] sm:px-[24px] sm:pt-[20px] md:px-[48px] md:pt-[28px]">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-[8px] sm:gap-[12px] md:gap-[14px]">
        <Link href="/" className="shrink-0" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Shritik"
            width={44}
            height={44}
            className="h-[40px] w-[40px] rounded-full sm:h-[44px] sm:w-[44px]"
            priority
          />
        </Link>

        <div className="flex min-w-0 items-center gap-[8px] sm:gap-[10px] md:gap-[14px]">
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="relative inline-flex h-[44px] shrink-0 items-center gap-[6px] rounded-[10px] border-[1.5px] border-forest bg-white px-[12px] text-[14px] font-medium text-forest transition hover:bg-[#FAF6EE] sm:gap-[8px] sm:px-[16px] sm:text-[15px]"
          >
            <FileText className="h-[16px] w-[16px]" strokeWidth={1.75} />
            Resume
            <span
              className="pointer-events-none absolute -bottom-[5px] -right-[4px] h-[14px] w-[14px] rotate-[8deg] rounded-[2px] bg-[#fde8a5] shadow-sm"
              aria-hidden
            />
          </button>

          <button
            type="button"
            onClick={() => openChat()}
            className="group relative inline-flex h-[44px] min-w-0 items-center gap-[6px] overflow-hidden rounded-full border-[1.5px] border-forest bg-btn-cream px-[12px] text-[13px] font-medium leading-none text-forest transition-[color,border-color,transform] duration-300 hover:scale-[1.03] hover:border-transparent hover:text-cream sm:gap-[8px] sm:px-[18px] sm:text-[15px]"
          >
            {/* Gradient fill on hover */}
            <span
              className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 bg-[linear-gradient(110deg,#004b40_0%,#0a7a64_42%,#c4a035_100%)] opacity-0 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100"
              aria-hidden
            />
            {/* Shimmer sweep */}
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 z-[1] w-1/2 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              aria-hidden
            />
            <span className="relative z-[2] inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <SparkleIcon size={28} />
            </span>
            <span className="relative z-[2] truncate sm:hidden">Talk to me</span>
            <span className="relative z-[2] hidden sm:inline">
              Talk with virtual me!
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
