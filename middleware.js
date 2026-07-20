import { next } from "@vercel/edge";
import known from "./known-routes.json";

/* ── True 404 status for an SPA on static hosting ───────────────────────────
   A pure static SPA returns 200 for every path (the rewrite serves index.html
   for all of them), so `/nonexistent` looked like a live page to crawlers —
   the "404 responded 200" audit finding.

   This edge function runs only on navigation-like requests (the matcher below
   excludes /assets, /fonts, /api and any file with an extension). For a known
   route it passes straight through — next() lets the normal rewrite serve the
   app at 200, so real pages pay ~no cost and stay CDN-fast. For an unknown URL
   it returns the same app shell but with an HTTP 404 status, so auditors and
   Googlebot see a genuine 404 while users still get the styled in-app 404 page
   once React boots. The route list is generated at build time from the data
   files (scripts/gen-seo.mjs → known-routes.json), so it can't drift. */

const matchers = known.map((p) => new RegExp(p));

export const config = {
  // Skip static assets, the API dir, and anything with a file extension.
  matcher: ["/((?!api/|assets/|fonts/|.*\\.[a-zA-Z0-9]+$).*)"],
};

export default async function middleware(request) {
  const { pathname } = new URL(request.url);

  if (matchers.some((re) => re.test(pathname))) {
    return next(); // known route → normal rewrite → index.html (200)
  }

  // Unknown route → serve the app shell with a real 404 status.
  const shell = await fetch(new URL("/index.html", request.url));
  const body = await shell.text();
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "no-store",
    },
  });
}
