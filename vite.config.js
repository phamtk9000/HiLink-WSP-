import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* One env var controls the canonical origin everywhere:
     VITE_SITE_URL (or SITE_URL) → static index.html tags (rewritten here),
     runtime tags (src/lib/seo.js), sitemap/robots (scripts/gen-seo.mjs).
   Unset → defaults to https://hilink.vn. On the Vercel preview, set
   VITE_SITE_URL=https://hi-link-wsp.vercel.app so canonical/hreflang match
   the serving domain and auditors stop flagging a canonical mismatch. */
const site = (process.env.VITE_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '')

const seoOrigin = () => ({
  name: 'seo-origin',
  transformIndexHtml: (html) => (site ? html.replaceAll('https://hilink.vn', site) : html),
})

export default defineConfig({
  plugins: [react(), seoOrigin()],
})
