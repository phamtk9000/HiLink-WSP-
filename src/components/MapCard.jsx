import { useLang } from "../context/LanguageContext.jsx";
import StyledMap from "./StyledMap.jsx";

/* ── MapCard ────────────────────────────────────────────────────────────────
   The site-wide map treatment: a gold pin on a brand-graded tile map, an
   "Open in Maps" pill top-left, and a dark info card across the bottom —
   location name in serif, address, and a gold "View on Google Maps ↗" link.

   Pass `coords={[lat, lng]}` to get the styled CARTO map (free, no API key,
   tinted into the cream palette). Without coords it falls back to the
   address-based keyless Google embed, so nothing ever renders blank.
   `tiles` = positron | dark | voyager | osm.                               */

export default function MapCard({ name, address, coords, tiles = "positron", zoom = 16, minHeight = 380, style }) {
  const { lang } = useLang();
  const q = encodeURIComponent(`${address}, Hà Nội, Vietnam`);
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  return (
    <div style={{ position: "relative", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden", minHeight, ...style }}>
      {coords ? (
        <StyledMap lat={coords[0]} lng={coords[1]} name={name} zoom={zoom} tiles={tiles} />
      ) : (
        <iframe
          title={`Map — ${name}`}
          src={`https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, filter: "saturate(0.85)" }}
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      )}
      {/* top-left: open in maps pill */}
      <a href={openUrl} target="_blank" rel="noopener noreferrer"
        style={{ position: "absolute", top: 14, left: 14, background: "#FFFFFF", color: "#1A73E8", borderRadius: 6, padding: "8px 14px", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", boxShadow: "0 6px 18px -6px rgba(0,0,0,0.35)", display: "inline-flex", alignItems: "center", gap: 7 }}>
        {lang === "vi" ? "Mở trong Maps" : "Open in Maps"}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>
      </a>
      {/* bottom: dark info card */}
      <div style={{ position: "absolute", left: "clamp(12px,4%,40px)", right: "clamp(12px,4%,40px)", bottom: 22, background: "rgba(22,22,18,0.94)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "clamp(18px,3vw,30px) clamp(20px,3.4vw,38px)", boxShadow: "0 26px 60px -22px rgba(0,0,0,0.6)" }}>
        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.3rem,2.1vw,1.8rem)", fontWeight: 400, color: "#F8F6F1", marginBottom: 8 }}>{name}</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(248,246,241,0.72)", marginBottom: 16 }}>{address}, Hà Nội</p>
        <a href={openUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          onMouseEnter={e => e.currentTarget.style.color = "#F8F6F1"} onMouseLeave={e => e.currentTarget.style.color = "var(--gold)"}>
          {lang === "vi" ? "Xem trên Google Maps" : "View on Google Maps"} <span aria-hidden="true" style={{ fontSize: 14 }}>↗</span>
        </a>
      </div>
    </div>
  );
}
