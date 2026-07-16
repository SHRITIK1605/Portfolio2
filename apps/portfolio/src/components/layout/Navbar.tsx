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
    <header className="px-[48px] pt-[28px]">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-[14px]">
        <Link href="/" className="shrink-0" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Shritik"
            width={44}
            height={44}
            className="h-[44px] w-[44px] rounded-full"
            priority
          />
        </Link>

        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="inline-flex h-[42px] items-center gap-[8px] rounded-[10px] border-[1.5px] border-forest bg-white px-[16px] text-[15px] font-medium text-forest"
          >
            <FileText className="h-[16px] w-[16px]" strokeWidth={1.75} />
            Resume
          </button>

          <button
            type="button"
            onClick={() => openChat()}
            className="inline-flex h-[42px] items-center gap-[8px] rounded-full border-[1.5px] border-forest bg-btn-cream px-[18px] text-[15px] font-medium leading-none text-forest"
          >
            <span className="inline-flex shrink-0 items-center justify-center">
              <SparkleIcon size={32} />
            </span>
            Talk with virtual me!
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
