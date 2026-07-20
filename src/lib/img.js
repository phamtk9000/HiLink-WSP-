/* ── Responsive images ──────────────────────────────────────────────────────
   Lighthouse flagged ~1.36 MB wasted: /mid/ files are 1400–1600px wide but
   render at 432–765px, so phones and cards were downloading full-size art.

   Every /mid/ image now has -480 and -800 variants alongside the 1600w
   original. `rs()` returns the src/srcSet pair; the browser picks the
   smallest file that satisfies `sizes` at the current DPR.

   Usage:
     <img {...rs(src, SIZES.card)} alt="…" />

   `sizes` MUST describe the CSS width of the slot, not the image's natural
   width — get it wrong and the browser over- or under-downloads.           */

const VARIANTS = [480, 800];

export const rs = (src, sizes) => {
  if (!src || typeof src !== "string") return { src };
  if (!src.startsWith("/mid/") || !src.endsWith(".webp")) return { src };
  const base = src.slice(0, -".webp".length);
  const srcSet = [
    ...VARIANTS.map((w) => `${base}-${w}.webp ${w}w`),
    `${src} 1600w`,
  ].join(", ");
  return sizes ? { src, srcSet, sizes } : { src, srcSet };
};

/* Common slot widths across the site. */
export const SIZES = {
  /* 3-up card grid -> ~1/3 viewport on desktop, full width on mobile */
  card: "(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 32vw",
  /* 2-up grid (forum insight cards) */
  half: "(max-width: 900px) 92vw, 46vw",
  /* full-bleed hero / band */
  hero: "100vw",
  /* narrow thumbnail rails and menu imagery */
  thumb: "(max-width: 640px) 40vw, 220px",
  /* portfolio carousel card — fixed 392px, 82vw on mobile */
  carousel: "(max-width: 640px) 82vw, 392px",
};
