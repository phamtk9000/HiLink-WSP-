/* ── Sitemap + robots generator ─────────────────────────────────────────────
   Reads the real data files so the sitemap can never drift from the routes.
   Run: npm run seo   (also runs automatically on `npm run build`)

   Only public, indexable, canonical URLs go in. Deliberately excluded:
     · /recommend, /spaces/* explorer states — tool/filter states, thin content
     · legal pages — indexable but no SEO value; keep them out of the sitemap
     · anything noindex (404)                                                */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://hilink.vn").replace(/\/$/, "");

/* Pull ids/slugs straight from the source of truth. Regex rather than import
   so the script stays dependency-free and never executes app code. */
const read = async (rel) => (await import("fs")).readFileSync(resolve(root, rel), "utf8");

const idsFrom = (src, key) =>
  [...src.matchAll(new RegExp(`${key}:\\s*"([^"]+)"`, "g"))].map((m) => m[1]);

const main = async () => {
  const locSrc = await read("src/data/locations.js");
  const solSrc = await read("src/data/solutions.js");
  const artSrc = await read("src/data/mockData.js");

  const locations = [...new Set(idsFrom(locSrc, "id"))].filter((x) => !/^amenity|^svc/.test(x));
  const solutions = [...new Set(idsFrom(solSrc, "slug"))];
  const articles = [...new Set(idsFrom(artSrc, "slug"))];
  const partners = ["landlords", "brokers", "enterprise", "developers", "business-services"];

  const today = new Date().toISOString().slice(0, 10);

  /* priority/changefreq are hints only — kept honest and coarse. */
  const urls = [
    { loc: "/", p: "1.0", c: "weekly" },
    { loc: "/locations", p: "0.9", c: "weekly" },
    { loc: "/solutions", p: "0.9", c: "monthly" },
    { loc: "/membership", p: "0.8", c: "monthly" },
    { loc: "/partnerships", p: "0.8", c: "monthly" },
    { loc: "/about", p: "0.6", c: "yearly" },
    { loc: "/careers", p: "0.6", c: "weekly" },
    { loc: "/forum", p: "0.7", c: "weekly" },
    ...locations.map((id) => ({ loc: `/locations/${id}`, p: "0.8", c: "monthly" })),
    ...solutions.map((s) => ({ loc: `/solutions/${s}`, p: "0.8", c: "monthly" })),
    ...partners.map((s) => ({ loc: `/partnerships/${s}`, p: "0.6", c: "monthly" })),
    ...articles.map((s) => ({ loc: `/forum/${s}`, p: "0.6", c: "yearly" })),
    { loc: "/membership/office", p: "0.6", c: "monthly" },
    { loc: "/membership/desk", p: "0.6", c: "monthly" },
    { loc: "/membership/roam", p: "0.6", c: "monthly" },
    { loc: "/membership/virtual", p: "0.6", c: "monthly" },
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${SITE}${u.loc}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${u.c}</changefreq>\n` +
          `    <priority>${u.p}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  const robots =
    `# HiLink Workspaces\n` +
    `User-agent: *\n` +
    `Allow: /\n\n` +
    `# Tool/filter states — thin or duplicate content, no SEO value\n` +
    `Disallow: /recommend\n` +
    `Disallow: /spaces\n` +
    `Disallow: /portal\n\n` +
    `Sitemap: ${SITE}/sitemap.xml\n`;

  writeFileSync(resolve(root, "public/sitemap.xml"), xml);
  writeFileSync(resolve(root, "public/robots.txt"), robots);

  /* ── known-routes.json ──────────────────────────────────────────────────
     Consumed by middleware.js (Vercel Edge) to decide 200 vs a real 404.
     Enumerated slugs (locations/solutions/partnerships/forum/membership) so
     /locations/bogus 404s correctly; prefix patterns for the deeply-dynamic
     venue/space trees where enumerating every combo isn't worthwhile. */
  const esc = (a) => a.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const patterns = [
    "^/$",
    "^/(locations|solutions|membership|partnerships|about|careers|forum|recommend|spaces|meeting-rooms|event-venues|terms|privacy|cookies|accessibility)$",
    `^/locations/(${esc(locations)})$`,
    "^/locations/[^/]+/units/[^/]+$",
    `^/solutions/(${esc(solutions)})$`,
    `^/partnerships/(${esc(partners)})$`,
    `^/forum/(${esc(articles)})$`,
    "^/membership/(office|desk|roam|virtual)$",
    "^/(meeting-rooms|event-venues|spaces)/.+$",
  ];
  writeFileSync(resolve(root, "known-routes.json"), JSON.stringify(patterns, null, 2) + "\n");

  console.log(`seo: wrote sitemap.xml (${urls.length} urls) + robots.txt + known-routes.json for ${SITE}`);
};

main();
