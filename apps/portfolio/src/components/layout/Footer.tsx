"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { CONTACT } from "@/lib/demo-data";
import type { HomepageSettings } from "@/types";

const ResumeOverlay = dynamic(
  () => import("@/components/resume/ResumeOverlay"),
  { ssr: false }
);

interface FooterProps {
  homepage?: HomepageSettings;
}

const EMAIL = "shritik1234j@gmail.com";
const PHONE_DISPLAY = "91 9975343323";
const PHONE_TEL = "+919975343323";
/** Slightly darker beige than page cream (#fffbf1) */
const FOOTER_BG = "#E8E0D4";
const FOOTER_FG = "#004b40";

/**
 * Soft torn-paper edge — cubic beziers with gentle amplitude
 * (peaks ~y14, valleys ~y34) tiling a 1440×48 viewBox.
 */
const ZIGZAG_PATH =
  "M0 48V24" +
  "C24 12 48 8 72 20C96 32 120 40 144 28C168 16 192 8 216 20C240 32 264 40 288 28C312 16 336 8 360 20C384 32 408 40 432 28C456 16 480 8 504 20C528 32 552 40 576 28C600 16 624 8 648 20C672 32 696 40 720 28C744 16 768 8 792 20C816 32 840 40 864 28C888 16 912 8 936 20C960 32 984 40 1008 28C1032 16 1056 8 1080 20C1104 32 1128 40 1152 28C1176 16 1200 8 1224 20C1248 32 1272 40 1296 28C1320 16 1344 8 1368 20C1392 32 1416 36 1440 26" +
  "V48H0Z";
export default function Footer({ homepage }: FooterProps) {
  const social = homepage?.socialLinks ?? {};
  const linkedin = social.linkedin || CONTACT.linkedin;
  const email = social.email || EMAIL;
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null,
  );

  async function copyValue(field: "email" | "phone", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1600);
    } catch {
      setCopiedField(null);
    }
  }

  return (
    <>
      <footer
        className="relative mt-[48px] w-full overflow-x-clip pb-[28px] pt-[10px] sm:mt-[56px] sm:pb-[36px] sm:pt-[14px]"
        style={{ backgroundColor: FOOTER_BG, color: FOOTER_FG }}
      >
        {/* Full-bleed zigzag / soft torn-paper top edge */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[40px] w-screen -translate-x-1/2 -translate-y-[calc(100%-1px)] sm:h-[48px]"
          aria-hidden
        >
          <svg
            className="block h-full w-full"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill={FOOTER_BG} d={ZIGZAG_PATH} />
          </svg>
        </div>

        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-[18px] px-[16px] sm:px-[28px] md:flex-row md:items-end md:justify-between md:gap-[24px] md:px-[36px] lg:px-[40px]">
          <nav
            aria-label="Footer"
            className="flex max-w-full flex-wrap items-center gap-x-[18px] gap-y-[10px] sm:gap-x-[28px] sm:gap-y-[12px] md:gap-x-[32px]"
          >
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center gap-[5px] text-[13px] transition hover:opacity-70 sm:min-h-0 sm:text-[14px]"
            >
              LinkedIn
              <ArrowUpRight
                className="h-[13px] w-[13px] shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            </a>

            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-[5px] text-[13px] transition hover:opacity-70 sm:min-h-0 sm:text-[14px]"
            >
              Resume
              <ArrowUpRight
                className="h-[13px] w-[13px] shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            </button>

            <div className="inline-flex max-w-full min-w-0 items-center gap-[6px]">
              <a
                href={`mailto:${email}`}
                className="min-w-0 max-w-[min(100%,220px)] truncate text-[13px] transition hover:opacity-70 sm:max-w-none sm:text-[14px]"
              >
                {email}
              </a>
              <button
                type="button"
                onClick={() => copyValue("email", email)}
                aria-label="Copy email"
                className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[6px] transition hover:bg-forest/10 sm:h-[28px] sm:w-[28px]"
              >
                {copiedField === "email" ? (
                  <Check className="h-[14px] w-[14px]" strokeWidth={2} />
                ) : (
                  <Copy className="h-[14px] w-[14px]" strokeWidth={1.75} />
                )}
              </button>
            </div>

            <div className="inline-flex items-center gap-[6px]">
              <a
                href={`tel:${PHONE_TEL}`}
                className="text-[13px] transition hover:opacity-70 sm:text-[14px]"
              >
                {PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={() => copyValue("phone", PHONE_DISPLAY)}
                aria-label="Copy phone number"
                className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[6px] transition hover:bg-forest/10 sm:h-[28px] sm:w-[28px]"
              >
                {copiedField === "phone" ? (
                  <Check className="h-[14px] w-[14px]" strokeWidth={2} />
                ) : (
                  <Copy className="h-[14px] w-[14px]" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </nav>

          <p className="m-0 inline-flex max-w-full flex-wrap items-center gap-x-[0.35em] text-[12px] leading-snug opacity-80 sm:text-[13px] md:justify-end">
            <span>© Shritik Jaiswal</span>
            <span className="inline-flex items-center text-[1.15em] leading-none" aria-hidden>
              ·
            </span>
            <span>made with cursor</span>
            <span className="inline-flex items-center text-[1.15em] leading-none" aria-hidden>
              ·
            </span>
            <span>curiosity</span>
            <span className="inline-flex items-center text-[1.15em] leading-none" aria-hidden>
              ·
            </span>
            <span>love</span>
          </p>
        </div>
      </footer>

      {resumeOpen ? (
        <ResumeOverlay
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          fallbackUrl={homepage?.resumeUrl}
        />
      ) : null}
    </>
  );
}
