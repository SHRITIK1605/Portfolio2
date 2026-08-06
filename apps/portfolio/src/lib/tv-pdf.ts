/**
 * Map a full IMPACT deck URL to the lightweight TV preview under /impact/tv/.
 * Full PDFs stay available at /impact/*.pdf for download/open.
 */
export function toTvPdfUrl(url: string | null | undefined): string {
  const raw = url?.trim() ?? "";
  if (!raw) return "";

  try {
    const base =
      typeof window === "undefined"
        ? "http://local.invalid"
        : window.location.origin;
    const parsed = new URL(raw, base);
    const match = parsed.pathname.match(/^\/impact\/(?!tv\/)([^/]+\.pdf)$/i);
    if (match) {
      parsed.pathname = `/impact/tv/${match[1]}`;
      parsed.searchParams.set("v", "4");
      return `${parsed.pathname}?${parsed.searchParams.toString()}`;
    }
  } catch {
    // fall through
  }

  // Relative path without URL parsing edge cases
  const rel = raw.match(/^(\/impact\/)(?!tv\/)([^/?#]+\.pdf)(\?.*)?$/i);
  if (rel) return `${rel[1]}tv/${rel[2]}?v=4`;

  return raw;
}

/** Prefer the full-resolution deck when opening outside the TV. */
export function toFullImpactPdfUrl(url: string | null | undefined): string {
  const raw = url?.trim() ?? "";
  if (!raw) return "";
  return raw.replace(/\/impact\/tv\//i, "/impact/");
}
