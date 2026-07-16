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
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const copyText = `LinkedIn: ${linkedin}\nContact: ${phone}\nMail: ${email}`;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-[1.5px] border-forest/25 bg-transparent text-forest"
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
            className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[220px] overflow-hidden rounded-[16px] border border-forest/10 bg-white shadow-[0_8px_28px_rgba(0,75,64,0.12)]"
          >
            <ul className="m-0 list-none p-[8px]">
              <li>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-[10px] rounded-[10px] px-[12px] py-[10px] text-[14px] font-medium text-forest transition hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  <Linkedin className="h-[16px] w-[16px]" strokeWidth={1.75} />
                  {CONTACT.linkedinLabel}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-[10px] rounded-[10px] px-[12px] py-[10px] text-[14px] font-medium text-forest transition hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  <Phone className="h-[16px] w-[16px]" strokeWidth={1.75} />
                  {CONTACT.contactLabel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-[10px] rounded-[10px] px-[12px] py-[10px] text-[14px] font-medium text-forest transition hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  <Mail className="h-[16px] w-[16px]" strokeWidth={1.75} />
                  {CONTACT.mailLabel}
                </a>
              </li>
            </ul>

            <div className="border-t border-forest/10 p-[8px]">
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-[8px] rounded-[10px] border border-forest/15 bg-btn-cream px-[12px] py-[10px] text-[14px] font-medium text-forest transition hover:bg-[#fde68a]"
              >
                {copied ? (
                  <>
                    <Check className="h-[16px] w-[16px]" strokeWidth={1.75} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-[16px] w-[16px]" strokeWidth={1.75} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
