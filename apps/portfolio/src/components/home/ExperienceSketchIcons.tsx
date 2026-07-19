import type { ExperienceItem } from "@/lib/experience-data";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Pencil-sketch style icons for the experience list — cream/forest theme. */
export function ExperienceSketchIcon({
  kind,
  className = "h-7 w-7",
}: {
  kind: ExperienceItem["sketchIcon"];
  className?: string;
}) {
  switch (kind) {
    case "bse":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Hourglass / market clock */}
          <path {...stroke} d="M10 6h12M10 26h12M11 6c0 5 4 6 5 10-1 4-5 5-5 10M21 6c0 5-4 6-5 10 1 4 5 5 5 10" />
          <path {...stroke} d="M13 16h6" />
        </svg>
      );
    case "slikk":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Fashion tag + spark */}
          <path {...stroke} d="M14 7l9 9-7 7-9-9V7h7z" />
          <circle cx="16.5" cy="12.5" r="1.4" fill="currentColor" />
          <path {...stroke} d="M22 8l1.5-3M24 10l3-1.5" />
        </svg>
      );
    case "times":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Two heads + shared idea bubble */}
          <circle {...stroke} cx="11" cy="14" r="4" />
          <circle {...stroke} cx="21" cy="14" r="4" />
          <path {...stroke} d="M7 24c1.5-3 4-4.5 7-4.5M18 19.5c3 0 5.5 1.5 7 4.5" />
          <path {...stroke} d="M16 7c2.2 0 4 1.4 4 3.2 0 1.6-1.2 2.8-2.6 3.2L16 15l-1.4-1.6C13.2 13 12 11.8 12 10.2 12 8.4 13.8 7 16 7z" />
        </svg>
      );
    case "emb":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Dashboard / funnel */}
          <rect {...stroke} x="6" y="7" width="20" height="18" rx="2" />
          <path {...stroke} d="M10 13h12M10 17h8M10 21h5" />
          <path {...stroke} d="M22 20l3 3-3 3" />
        </svg>
      );
    case "aarya":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Homestay house */}
          <path {...stroke} d="M6 15l10-8 10 8v11H6V15z" />
          <path {...stroke} d="M13 26v-7h6v7" />
          <path {...stroke} d="M16 9v-2" />
        </svg>
      );
    case "unifly":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {/* Marketplace handshake / wings */}
          <path {...stroke} d="M6 18c3-4 7-4 10-1 3-3 7-3 10 1" />
          <path {...stroke} d="M10 18h12" />
          <path {...stroke} d="M8 12c2-3 5-4 8-2M24 12c-2-3-5-4-8-2" />
          <path {...stroke} d="M16 20v6M13 23h6" />
        </svg>
      );
    default:
      return null;
  }
}
