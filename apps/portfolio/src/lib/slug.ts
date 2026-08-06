export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function decodeSlugParam(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function projectPath(slug: string): string {
  return `/project/${encodeURIComponent(slug)}`;
}

/** Stable IMPACT detail slug from company/logo label (e.g. "EMB Global" → "emb-global"). */
export function impactSlugFromLogoAlt(logoAlt: string): string {
  return slugify(logoAlt);
}

export function impactPath(slug: string): string {
  return `/impact/${encodeURIComponent(slug)}`;
}
