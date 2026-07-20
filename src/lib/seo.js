import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ── SEO ────────────────────────────────────────────────────────────────────
   Per-route <title>, meta description, canonical, Open Graph / Twitter cards
   and JSON-LD, without pulling in react-helmet.

   IMPORTANT — how far this gets you:
   Google renders JavaScript, so it will see everything this sets. Most social
   crawlers (Facebook, Zalo, LinkedIn) do NOT run JS — they only read the
   static tags in index.html. So link previews use the site-wide fallback in
   index.html unless the app is pre-rendered/SSR'd. See SEO.md.              */

/* Canonical origin — driven by VITE_SITE_URL so preview deployments
   (hi-link-wsp.vercel.app) emit a canonical that matches their own domain
   instead of pointing at a not-yet-live hilink.vn. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://hilink.vn").replace(/\/$/, "");
export const SITE_NAME = "HiLink Workspaces";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

const upsert = (selector, create, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const meta = (name, content) => {
  if (!content) return;
  upsert(`meta[name="${name}"]`, () => {
    const m = document.createElement("meta"); m.setAttribute("name", name); return m;
  }, { content });
};

const prop = (property, content) => {
  if (!content) return;
  upsert(`meta[property="${property}"]`, () => {
    const m = document.createElement("meta"); m.setAttribute("property", property); return m;
  }, { content });
};

const abs = (u) => (!u ? DEFAULT_OG : /^https?:/.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/* Truncate to a length search engines actually display, on a word boundary. */
const clamp = (s, n) => {
  if (!s) return s;
  const t = String(s).replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, t.lastIndexOf(" ", n - 1)).replace(/[,.;:—-]$/, "") + "…";
};

export function useSeo({
  title,
  description,
  image,
  type = "website",
  noindex = false,
  jsonLd,          // object | array of objects
  lang = "en",
} = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE_URL}${pathname}`;
    const full = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    /* 60 / 130 — the display limits SEO auditors actually check against
       (titles truncate ~600px ≈ 60 chars; descriptions score best 100–130). */
    const desc = clamp(description, 130);

    document.title = clamp(full, 60);
    document.documentElement.lang = lang;

    meta("description", desc);
    meta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l;
    }, { href: url });

    /* hreflang — EN and VI now have distinct addresses (?lang=vi, synced by
       LanguageContext), so search engines can serve the right language.
       Canonical stays the clean EN URL; x-default follows it. */
    const alt = (hl, href) =>
      upsert(`link[rel="alternate"][hreflang="${hl}"]`, () => {
        const l = document.createElement("link");
        l.setAttribute("rel", "alternate"); l.setAttribute("hreflang", hl); return l;
      }, { href });
    alt("en", url);
    alt("vi", `${url}?lang=vi`);
    alt("x-default", url);

    prop("og:title", full);
    prop("og:description", desc);
    prop("og:url", url);
    prop("og:type", type);
    prop("og:site_name", SITE_NAME);
    prop("og:image", abs(image));
    prop("og:locale", lang === "vi" ? "vi_VN" : "en_US");

    meta("twitter:card", "summary_large_image");
    meta("twitter:title", full);
    meta("twitter:description", desc);
    meta("twitter:image", abs(image));

    /* JSON-LD — replaced per route, tagged so we only ever clear our own */
    document.head.querySelectorAll('script[data-seo="route"]').forEach(n => n.remove());
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.filter(Boolean).forEach(b => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo", "route");
        s.textContent = JSON.stringify(b);
        document.head.appendChild(s);
      });
    }
  }, [pathname, title, description, image, type, noindex, lang, JSON.stringify(jsonLd)]);
}

/* ── Structured-data builders ─────────────────────────────────────────── */

export const breadcrumbLd = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: `${SITE_URL}${t.path}`,
  })),
});

export const articleLd = ({ title, excerpt, image, date, author, slug }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: excerpt,
  image: [abs(image)],
  datePublished: date,
  author: { "@type": author && /HiLink/i.test(author) ? "Organization" : "Person", name: author || SITE_NAME },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-hilink-lockup.svg` },
  },
  mainEntityOfPage: `${SITE_URL}/forum/${slug}`,
});

export const localBusinessLd = (loc) => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CoworkingSpace"],
  "@id": `${SITE_URL}/locations/${loc.id}`,
  name: `${SITE_NAME} — ${loc.name}`,
  url: `${SITE_URL}/locations/${loc.id}`,
  image: abs(loc.img),
  address: {
    "@type": "PostalAddress",
    streetAddress: loc.address,
    addressLocality: "Hà Nội",
    addressCountry: "VN",
  },
  ...(loc.coords ? { geo: { "@type": "GeoCoordinates", latitude: loc.coords[0], longitude: loc.coords[1] } } : {}),
  ...(loc.phone ? { telephone: loc.phone } : {}),
  parentOrganization: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
});

export const serviceLd = ({ title, tagline, slug, image }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: title,
  description: tagline,
  serviceType: title,
  url: `${SITE_URL}/solutions/${slug}`,
  ...(image ? { image: abs(image) } : {}),
  provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  areaServed: { "@type": "City", name: "Hà Nội" },
});
