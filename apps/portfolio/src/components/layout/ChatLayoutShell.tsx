"use client";

import type { CSSProperties, ReactNode } from "react";
import { useChatContext } from "@/context/ChatContext";

export default function ChatLayoutShell({ children }: { children: ReactNode }) {
  const { isOpen, panelWidth, isResizing } = useChatContext();

  return (
    <div
      style={{ "--chat-w": `${panelWidth}%` } as CSSProperties}
      className={`min-h-screen bg-cream ${
        isResizing ? "" : "transition-[padding-right] duration-300 ease-out"
      } ${isOpen ? "md:pr-[max(var(--chat-w),300px)]" : ""}`}
    >
      {children}
    </div>
  );
}
