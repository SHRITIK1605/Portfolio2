"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Linkedin, Mail, Phone } from "lucide-react";
import HamburgerIcon from "@/components/ui/HamburgerIcon";
import { CONTACT } from "@/lib/demo-data";
import type { HomepageSettings } from "@/types";

interface MenuButtonProps {
  homepage?: HomepageSettings;
}

export default function MenuButton({ homepage }: MenuButtonProps) {
  const social = homepage?.socialLinks ?? {};
  const linkedin = social.linkedin || CONTACT.linkedin;
  const email = social.email || CONTACT.email;
  const phone = social.phone || CONTACT.phone;
  const [open, setOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function copyValue(field: "phone" | "email", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1600);
    } catch {
      setCopiedField(null);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[56px] w-[56px] items-center justify-center rounded-full border-0 bg-[#FFF4D7] text-[#016146] shadow-none sm:h-[60px] sm:w-[60px]"
      >
        <HamburgerIcon />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-[18px] bg-white px-[16px] shadow-[0_8px_28px_rgba(0,75,64,0.12)] sm:px-[20px]"
          >
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center gap-[12px] border-b border-black/[0.07] py-[14px] text-[16px] font-medium text-[#1a1a1a] transition hover:opacity-70 sm:gap-[14px] sm:py-[16px] sm:text-[17px]"
            >
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[7px] bg-[#1a1a1a]">
                <Linkedin
                  className="h-[18px] w-[18px] text-white"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              {CONTACT.linkedinLabel}
            </a>

            <div className="flex min-h-[52px] items-center gap-[12px] border-b border-black/[0.07] py-[14px] sm:gap-[14px] sm:py-[16px]">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
                <Phone
                  className="h-[22px] w-[22px] text-[#1a1a1a]"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[#1a1a1a] sm:text-[17px]">
                {phone}
              </span>
              <button
                type="button"
                onClick={() => copyValue("phone", phone)}
                aria-label="Copy phone number"
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] text-[#1a1a1a] transition hover:bg-black/5"
              >
                {copiedField === "phone" ? (
                  <Check className="h-[19px] w-[19px]" strokeWidth={2} />
                ) : (
                  <Copy className="h-[19px] w-[19px]" strokeWidth={1.75} />
                )}
              </button>
            </div>

            <div className="flex min-h-[52px] items-center gap-[12px] py-[14px] sm:gap-[14px] sm:py-[16px]">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
                <Mail
                  className="h-[22px] w-[22px] text-[#1a1a1a]"
                  strokeWidth={2}
                />
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1a1a1a] sm:text-[17px]">
                {email}
              </span>
              <button
                type="button"
                onClick={() => copyValue("email", email)}
                aria-label="Copy email address"
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] text-[#1a1a1a] transition hover:bg-black/5"
              >
                {copiedField === "email" ? (
                  <Check className="h-[19px] w-[19px]" strokeWidth={2} />
                ) : (
                  <Copy className="h-[19px] w-[19px]" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
