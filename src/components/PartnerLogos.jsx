/* ── Partner logos ─────────────────────────────────────────────────────────
   Monochrome vector wordmarks for every partner referenced on the site.
   Rendered in `currentColor` so a wall can sit grey and warm up on hover.
   Usage:  <PartnerLogo name="Hanoi Group" height={30} />
           <LogoWall logos={[...]} />   ·   <LogoMarquee logos={[...]} />   */

const S = { display: "block", height: "100%", width: "auto" };

/* Each logo = small vector mark + typographic wordmark, tuned per brand. */
const LOGOS = {
  "Hanoi Group": (
    <svg viewBox="0 0 232 48" style={S} aria-label="Hanoi Group">
      {/* monogram: citadel gate */}
      <g fill="currentColor">
        <rect x="4" y="10" width="5" height="28" />
        <rect x="31" y="10" width="5" height="28" />
        <rect x="14" y="20" width="12" height="18" />
        <path d="M2 10 L20 2 L38 10 L38 14 L2 14 Z" />
      </g>
      <text x="52" y="27" fontFamily="'Playfair Display',Georgia,serif" fontSize="21" fill="currentColor">Hanoi Group</text>
      <text x="53" y="41" fontFamily="'Inter',sans-serif" fontSize="8" letterSpacing="4.5" fill="currentColor" opacity="0.65">EST · HÀ NỘI</text>
    </svg>
  ),
  "Indochina Capital": (
    <svg viewBox="0 0 268 48" style={S} aria-label="Indochina Capital">
      {/* mark: twin columns */}
      <g fill="currentColor">
        <rect x="6" y="8" width="6" height="30" rx="1" />
        <rect x="18" y="8" width="6" height="30" rx="1" />
        <rect x="2" y="4" width="26" height="4" />
        <rect x="2" y="40" width="26" height="4" />
      </g>
      <text x="42" y="24" fontFamily="'Playfair Display',Georgia,serif" fontSize="19" letterSpacing="1" fill="currentColor">INDOCHINA</text>
      <text x="42" y="41" fontFamily="'Inter',sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="6" fill="currentColor" opacity="0.75">CAPITAL</text>
    </svg>
  ),
  "NovaTech": (
    <svg viewBox="0 0 196 48" style={S} aria-label="NovaTech">
      {/* mark: nova burst */}
      <g fill="currentColor">
        <path d="M22 4 L26 18 L40 22 L26 26 L22 40 L18 26 L4 22 L18 18 Z" />
      </g>
      <text x="50" y="31" fontFamily="'Inter',sans-serif" fontSize="21" fontWeight="700" letterSpacing="0.5" fill="currentColor">nova<tspan fontWeight="300">tech</tspan></text>
    </svg>
  ),
  "BlueOcean": (
    <svg viewBox="0 0 208 48" style={S} aria-label="BlueOcean">
      {/* mark: waves */}
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <path d="M4 18 Q11 11 18 18 T32 18 T46 18" />
        <path d="M4 28 Q11 21 18 28 T32 28 T46 28" opacity="0.7" />
        <path d="M4 38 Q11 31 18 38 T32 38 T46 38" opacity="0.4" />
      </g>
      <text x="56" y="31" fontFamily="'Inter',sans-serif" fontSize="20" fontWeight="600" letterSpacing="0.4" fill="currentColor">Blue<tspan fontWeight="300">Ocean</tspan></text>
    </svg>
  ),
  "Seoul Tech": (
    <svg viewBox="0 0 200 48" style={S} aria-label="Seoul Tech">
      {/* mark: interlocked swirl */}
      <g fill="currentColor">
        <path d="M22 4 a18 18 0 0 1 0 36 a9 9 0 0 1 0 -18 a9 9 0 0 0 0 -18 Z" />
        <circle cx="22" cy="13" r="3.4" fill="var(--bg, #fff)" />
        <circle cx="22" cy="31" r="3.4" />
      </g>
      <text x="50" y="27" fontFamily="'Inter',sans-serif" fontSize="17" fontWeight="700" letterSpacing="2.5" fill="currentColor">SEOUL</text>
      <text x="50" y="42" fontFamily="'Inter',sans-serif" fontSize="11" fontWeight="300" letterSpacing="7.5" fill="currentColor" opacity="0.7">TECH</text>
    </svg>
  ),
  "Facility Capital": (
    <svg viewBox="0 0 250 48" style={S} aria-label="Facility Capital">
      {/* mark: ascending towers */}
      <g fill="currentColor">
        <rect x="4" y="26" width="8" height="14" />
        <rect x="16" y="16" width="8" height="24" />
        <rect x="28" y="6" width="8" height="34" />
      </g>
      <text x="48" y="24" fontFamily="'Inter',sans-serif" fontSize="16" fontWeight="600" letterSpacing="1.5" fill="currentColor">FACILITY</text>
      <text x="48" y="41" fontFamily="'Playfair Display',Georgia,serif" fontStyle="italic" fontSize="15" fill="currentColor" opacity="0.75">Capital Kft.</text>
    </svg>
  ),
  "CBRE": (
    <svg viewBox="0 0 128 48" style={S} aria-label="CBRE">
      <text x="4" y="35" fontFamily="'Inter',sans-serif" fontSize="28" fontWeight="800" letterSpacing="1" fill="currentColor">CBRE</text>
    </svg>
  ),
  "Savills": (
    <svg viewBox="0 0 138 48" style={S} aria-label="Savills">
      <text x="4" y="34" fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="27" fill="currentColor">savills</text>
      <rect x="118" y="10" width="12" height="12" fill="currentColor" />
    </svg>
  ),
  "Knight Frank": (
    <svg viewBox="0 0 216 48" style={S} aria-label="Knight Frank">
      <text x="4" y="32" fontFamily="'Playfair Display',Georgia,serif" fontSize="22" letterSpacing="0.5" fill="currentColor">Knight Frank</text>
      <rect x="4" y="38" width="200" height="2.2" fill="currentColor" opacity="0.55" />
    </svg>
  ),
  "Colliers": (
    <svg viewBox="0 0 150 48" style={S} aria-label="Colliers">
      <text x="4" y="33" fontFamily="'Inter',sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.4" fill="currentColor">Colliers</text>
      <circle cx="132" cy="14" r="4.5" fill="currentColor" />
    </svg>
  ),
};

export const PARTNER_LOGO_NAMES = Object.keys(LOGOS);

export function PartnerLogo({ name, height = 32, color = "var(--text-3)", hoverColor = "var(--text)", title }) {
  const svg = LOGOS[name];
  if (!svg) return <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.2rem", color }}>{name}</span>;
  return (
    <span
      title={title || name}
      style={{ display: "inline-flex", alignItems: "center", height, color, transition: "color 0.25s, opacity 0.25s" }}
      onMouseEnter={e => { e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.color = color; }}
    >
      {svg}
    </span>
  );
}

/* Static responsive wall of logos */
export function LogoWall({ logos = PARTNER_LOGO_NAMES, height = 30, color, hoverColor, gap = "26px 56px" }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap }}>
      {logos.map((l) => <PartnerLogo key={l} name={l} height={height} color={color} hoverColor={hoverColor} />)}
    </div>
  );
}

/* Continuous marquee band of logos (pure CSS animation, duplicated track) */
export function LogoMarquee({ logos = PARTNER_LOGO_NAMES, height = 34, color = "var(--text-3)", hoverColor = "var(--text)", speed = 32 }) {
  const track = [...logos, ...logos];
  return (
    <div className="logo-marquee" style={{ overflow: "hidden", position: "relative" }}>
      <div className="logo-marquee-track" style={{ display: "flex", alignItems: "center", gap: 72, width: "max-content", animation: `logoScroll ${speed}s linear infinite` }}>
        {track.map((l, i) => (
          <span key={i} style={{ flexShrink: 0 }}>
            <PartnerLogo name={l} height={height} color={color} hoverColor={hoverColor} />
          </span>
        ))}
      </div>
    </div>
  );
}
