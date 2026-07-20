import { Link } from "react-router-dom";
import { PageWrap } from "../components/index.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { useSeo } from "../lib/seo.js";

/* ── 404 ────────────────────────────────────────────────────────────────────
   Previously the catch-all route rendered the Homepage, so every unknown URL
   answered 200 with duplicate homepage content — Google treats those as soft
   404s and it can dilute/duplicate the real homepage. This renders a proper
   dead end and marks it noindex.                                            */

const T = {
  en: {
    eyebrow: "404",
    title: "This page has moved on",
    body: "The page you're looking for doesn't exist — it may have been renamed or retired. Let's get you somewhere useful.",
    home: "Back to home", locations: "Browse locations", solutions: "See solutions",
  },
  vi: {
    eyebrow: "404",
    title: "Không tìm thấy trang",
    body: "Trang bạn tìm không tồn tại — có thể đã được đổi tên hoặc gỡ bỏ. Hãy chọn một hướng đi khác.",
    home: "Về trang chủ", locations: "Xem địa điểm", solutions: "Xem giải pháp",
  },
};

export default function NotFoundPage() {
  const { lang } = useLang();
  const t = T[lang];
  useSeo({ lang, title: t.title, description: t.body, noindex: true });

  return (
    <PageWrap>
      <section style={{ background: "#101208", minHeight: "78vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -220, right: -160, width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.18)", pointerEvents: "none" }} />
        <div className="section-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 48px 96px", position: "relative" }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(3rem,9vw,7rem)", color: "rgba(168,143,92,0.5)", lineHeight: 1, marginBottom: 18 }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2rem,4.6vw,3.4rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.1, marginBottom: 18 }}>{t.title}</h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(248,246,241,0.68)", lineHeight: 1.7, maxWidth: 520, marginBottom: 34 }}>{t.body}</p>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/" className="btn" data-variant="gold">{t.home}</Link>
            {[[t.locations, "/locations"], [t.solutions, "/solutions"]].map(([label, to]) => (
              <Link key={to} to={to}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(248,246,241,0.85)", textDecoration: "none", borderBottom: "1px solid rgba(248,246,241,0.5)", paddingBottom: 3 }}>
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageWrap>
  );
}
