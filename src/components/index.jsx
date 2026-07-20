import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";
import { useSplash } from "../context/SplashContext.jsx";
import { LOCATIONS } from "../data/locations.js";
import { ARTICLES } from "../data/mockData.js";
import { CircleCTA } from "./motionFx.jsx";
import { rs, SIZES } from "../lib/img.js";

const LOC_IMG = Object.fromEntries(LOCATIONS.map(l => [l.id, l.img]));

/* Small webp thumbnails (generated in /public/thumbs) — the mega menu and
   other chrome must never decode multi-MB originals. */
export const thumb = (src) => {
  if (!src) return src;
  if (src.startsWith("/workspace-photos/")) return "/thumbs/" + src.slice("/workspace-photos/".length) + ".webp";
  if (src.startsWith("/mid/")) return "/thumbs/" + src.slice("/mid/".length); // same NAME.EXT.webp naming
  return src;
};

/* ── Site Footer — dark editorial, giant rising wordmark (avix-style) ── */
const FOOT_T = {
  en: {
    ctaLines: ["Have a space in mind?", "Let's build something great."],
    talk: "Let's talk",
    getIn: "Get in touch", hours: "Available Mon – Fri · 8:30 – 18:00",
    explore: "Explore", legal: "Legal",
    rights: "All rights reserved.", group: "Part of The HiLink Group",
  },
  vi: {
    ctaLines: ["Đang tìm một không gian?", "Cùng kiến tạo điều tuyệt vời."],
    talk: "Trao đổi ngay",
    getIn: "Liên hệ", hours: "Thứ 2 – Thứ 6 · 8:30 – 18:00",
    explore: "Khám phá", legal: "Pháp lý",
    rights: "Bảo lưu mọi quyền.", group: "Thành viên của HiLink Group",
  },
};

/* Scroll-progress-driven letter for the giant wordmark */
const EASE_OUT = [0.16, 1, 0.3, 1];
/* The footer brand logo: always visible, climbing slightly and resolving
   from a soft blur into focus as the page sheet uncovers the footer. */
const FooterLogo = ({ progress, start, end }) => {
  const y = useTransform(progress, [start, end], ["18%", "0%"], { ease: (t) => 1 - Math.pow(1 - t, 3) });
  const b = useTransform(progress, [start, end], [16, 0]);
  const filter = useMotionTemplate`blur(${b}px)`;
  return (
    <motion.img src="/logo-hilink-mark-cream.svg" alt="HiLink"
      /* width/height = the SVG's viewBox ratio (2413x1360). These attributes
         let the browser reserve the correct box before the file loads —
         without them the img is 0px tall on first paint and the whole
         bottom-anchored footer jumps upward when it arrives (CLS 0.255). */
      width={2413} height={1360}
      style={{ y, filter, width: "clamp(280px, 46vw, 780px)", height: "auto",
               aspectRatio: "2413 / 1360", display: "block", willChange: "transform, filter" }} />
  );
};


/* Footer content — every entrance is driven by the uncover progress (0 → 1
   as the page above scrolls away), so the reveal reads as one motion:
   the sheet lifts, the footer rises into place, then HiLink. climbs out. */
const SiteFooter = ({ progress }) => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = FOOT_T[lang];

  const ink = "#F8F6F1";
  const inkSoft = "rgba(248,246,241,0.6)";
  const inkFaint = "rgba(248,246,241,0.38)";
  const colHead = { fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: inkFaint, marginBottom: 20 };
  const link = { display: "flex", alignItems: "center", minHeight: 32, fontFamily: "'Inter',sans-serif", fontSize: 14, color: inkSoft, textDecoration: "none", marginBottom: 4, transition: "color 0.15s" };
  const hov = { onMouseEnter: e => e.currentTarget.style.color = "var(--gold)", onMouseLeave: e => e.currentTarget.style.color = inkSoft };

  /* Uncover feel: content is already composed; as the sheet lifts off, the
     internals settle with a gentle parallax rather than flying in late.
     Curves are smooth (no hard clamps early) so nothing pops. */
  /* Everything stays fully visible — the uncover only adds a gentle
     settling parallax, so nothing "disappears" at the bottom. */
  const bodyY    = useTransform(progress, [0, 1],       [44, 0]);
  const headY    = useTransform(progress, [0, 0.7],     [26, 0]);
  const headOp   = 1;
  const ctaScale = useTransform(progress, [0, 0.75],    [0.94, 1]);
  const ctaOp    = 1;
  const gridOp   = 1;
  const gridY    = useTransform(progress, [0, 0.85],    [18, 0]);

  const mStart = 0.5, mSpan = 0.46;   // climbs out during the last half of the uncover

  return (
    <footer className="footer-pad" style={{ background: "#0F0F0F", color: ink, padding: "0 48px", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "min(100vh, 720px)" }}>
      {/* faint gold glow */}
      <div aria-hidden="true" style={{ position: "absolute", top: -240, left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(168,143,92,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      <motion.div style={{ width: "100%", padding: "0 clamp(8px,2vw,36px)", position: "relative", y: bodyY }}>
        {/* ── CTA band ── */}
        <div className="ft-cta" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "28px 56px", padding: "84px 0 64px", borderBottom: "1px solid rgba(248,246,241,0.12)" }}>
          <div style={{ overflow: "hidden" }}>
            <motion.h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 400, color: ink, fontSize: "clamp(1.9rem,4.4vw,3.4rem)", lineHeight: 1.1, y: headY, opacity: headOp }}>
              {t.ctaLines[0]}<br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{t.ctaLines[1]}</em>
            </motion.h2>
          </div>
          <motion.div style={{ scale: ctaScale, opacity: ctaOp }}>
            <CircleCTA label={t.talk} size={140} onClick={() => navigate("/partnerships#contact")} />
          </motion.div>
        </div>

        {/* ── Link grid ── */}
        <motion.div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, padding: "56px 0 48px", borderBottom: "1px solid rgba(248,246,241,0.12)", opacity: gridOp, y: gridY }}>
          {/* Get in touch */}
          <div>
            <p style={colHead}>{t.getIn}</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: inkFaint, marginBottom: 14 }}>{t.hours}</p>
            <a href="mailto:hello@hilink.vn" style={{ ...link, color: ink, fontSize: 14.5 }} {...hov}>hello@hilink.vn</a>
            <a href="tel:+842439369197" style={{ ...link, color: ink, fontSize: 14.5, marginBottom: 24 }} {...hov}>(+84) 24 3936 9197</a>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[["LinkedIn", "https://www.linkedin.com"], ["Instagram", "https://www.instagram.com"], ["Facebook", "https://www.facebook.com"]].map(([s2, href]) => (
                <a key={s2} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", minHeight: 40, padding: "0 4px", fontFamily: "'Inter',sans-serif", fontSize: 14, letterSpacing: "0.04em", color: inkSoft, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = inkFaint}>{s2}</a>
              ))}
            </div>
          </div>
          {/* Address */}
          <div>
            <p style={colHead}>Address</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: inkSoft, lineHeight: 1.75 }}>60 Lý Thái Tổ, Hoàn Kiếm<br />15 Tôn Thất Tùng, Đống Đa<br />Hà Nội, Việt Nam</p>
          </div>
          {/* Explore */}
          <div>
            <p style={colHead}>{t.explore}</p>
            {[["Home", "/"], ["Locations", "/locations"], ["Solutions", "/solutions"], ["Partnerships", "/partnerships"], ["About us", "/about"], ["Careers", "/careers"], ["Forum", "/forum"]].map(([label, to]) => (
              <Link key={label} to={to} style={link} {...hov}>{label}</Link>
            ))}
          </div>
          {/* Legal */}
          <div>
            <p style={colHead}>{t.legal}</p>
            {[["Privacy Policy", "/privacy"], ["Terms and Conditions", "/terms"], ["Cookie Policy", "/cookies"], ["Accessibility", "/accessibility"]].map(([label, to]) => (
              <Link key={label} to={to} style={link} {...hov}>{label}</Link>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom row ── */}
        <div style={{ padding: "24px 0 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: inkFaint }}>© {new Date().getFullYear()} HiLink Workspaces. {t.rights}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: inkFaint, letterSpacing: "0.1em" }}>{t.group}</p>
        </div>

        {/* ── Brand logo — climbs out of a soft blur as the footer is uncovered.
               Uses the real HiLink lockup (cream recolour for the dark band),
               not a typeset approximation of the wordmark. ── */}
        <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", marginTop: 18, paddingBottom: 26, userSelect: "none", pointerEvents: "none" }}>
          <FooterLogo progress={progress} start={mStart} end={Math.min(mStart + mSpan, 1)} />
        </div>
      </motion.div>
    </footer>
  );
};

/* ── Footer uncover (avix curtain effect) ──────────────────────────────────
   The footer is pinned to the bottom of the *viewport* (fixed), sitting
   behind the page. The page is a solid sheet with a shadow; a transparent
   spacer equal to the footer's height sits at the end of the page, so as the
   sheet scrolls up its bottom edge slides off the footer and "uncovers" it
   from top to bottom — like lifting a card off the artwork beneath.
   scrollYProgress runs 0→1 across that spacer and scrubs every footer
   sub-animation (heading rise, CTA pop, giant wordmark climb).            */
const FooterReveal = () => {
  const loc = useLocation();
  const spacerRef = useRef(null);
  const innerRef = useRef(null);
  const [h, setH] = useState(680);
  const hidden = loc.pathname.startsWith("/portal");

  useLayoutEffect(() => {
    if (hidden) return;
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setH(Math.min(el.offsetHeight || 680, window.innerHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [hidden, loc.pathname]);

  /* progress across the spacer: 0 when its top hits the viewport bottom,
     1 when its bottom does — i.e. exactly while the footer is being exposed */
  const { scrollYProgress } = useScroll({ target: spacerRef, offset: ["start end", "end end"] });

  if (hidden) return null;
  return (
    <>
      {/* transparent spacer the page scrolls through to expose the fixed footer */}
      <div ref={spacerRef} aria-hidden="true" className="ft-snap" style={{ height: h, pointerEvents: "none" }} />
      {/* fixed footer, pinned to viewport bottom, behind the page sheet */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <div ref={innerRef}>
          <SiteFooter progress={scrollYProgress} />
        </div>
      </div>
    </>
  );
};

/* ── Page Transition + Footer ──
   Works with the RouteCurtain: on exit the page HOLDS perfectly still for
   0.55s while the curtain covers it (no fade, no slide — the curtain does
   the motion). On enter, the sheet settles up 28px under the curtain so the
   reveal feels alive. The settle transform lives on the inner sheet only,
   never the root, so the fixed footer's containing block is untouched. */
export const PageWrap = ({ children }) => (
  <div>
    {/* page sheet: opaque, casts a shadow onto the footer it slides over */}
    <div style={{ position: "relative", zIndex: 1, background: "var(--bg)", boxShadow: "0 40px 80px -10px rgba(0,0,0,0.6)" }}>
      {children}
    </div>
    <FooterReveal />
  </div>
);

/* ── Button ── */
export const Btn = ({ children, variant = "primary", size = "md", onClick, full, disabled, style: s }) => {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.18s ease", userSelect: "none",
    opacity: disabled ? 0.4 : 1, width: full ? "100%" : undefined,
    borderRadius: 2, ...s,
  };
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 13 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 15 },
    xl: { padding: "16px 36px", fontSize: 16 },
  };
  const variants = {
    primary: {
      background: hover ? "var(--gold)" : "var(--text)",
      color: "#FFFFFF",
      boxShadow: "none",
    },
    secondary: {
      background: hover ? "var(--bg-3)" : "var(--bg-2)",
      color: "var(--text)", border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: hover ? "var(--gold)" : "var(--text)",
      border: "1px solid " + (hover ? "var(--border-gold)" : "var(--border)"),
    },
    danger: {
      background: hover ? "rgba(192,57,43,0.08)" : "transparent",
      color: "var(--danger)", border: "1px solid rgba(192,57,43,0.25)",
    },
    "ghost-gold": {
      background: hover ? "var(--bg-3)" : "transparent",
      color: "var(--gold)", border: "1px solid var(--border-gold)",
    },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
};

/* ── Badge / Chip ── */
export const Chip = ({ status }) => {
  const map = {
    Confirmed: { bg: "rgba(45,106,79,0.10)",  color: "#2D6A4F", dot: "#2D6A4F" },
    Completed: { bg: "rgba(15,15,15,0.07)",   color: "#707070", dot: "#707070" },
    Cancelled:  { bg: "rgba(15,15,15,0.07)",  color: "#707070", dot: "#707070" },
    Pending:    { bg: "rgba(181,134,42,0.12)", color: "#B5862A", dot: "#B5862A" },
    Paid:       { bg: "rgba(45,106,79,0.10)",  color: "#2D6A4F", dot: "#2D6A4F" },
    Overdue:    { bg: "rgba(192,57,43,0.10)",  color: "#C0392B", dot: "#C0392B" },
  };
  const c = map[status] || map.Pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:c.bg, color:c.color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:0, fontFamily:"'Inter', sans-serif", whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {status}
    </span>
  );
};

/* ── Input Field ── */
export const Field = ({ label, type="text", value, onChange, error, success, placeholder, optional }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:500, marginBottom:6, color: focused ? "var(--gold)" : "var(--text-2)", fontFamily:"'Inter', sans-serif", transition:"color 0.15s", letterSpacing:"0.02em" }}>
        {label} {optional && <span style={{ color:"var(--text-3)", fontWeight:400 }}>(optional)</span>}
      </label>
      <div style={{ position:"relative" }}>
        <input
          type={type === "password" && show ? "text" : type}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width:"100%", padding:"11px 16px", fontSize:14, fontFamily:"'Inter', sans-serif",
            background: focused ? "#FFFFFF" : "var(--bg-2)",
            border: `1px solid ${error ? "var(--danger)" : focused ? "var(--border-gold)" : "var(--border)"}`,
            borderRadius:0, color:"var(--text)", outline:"none", transition:"all 0.18s",
            paddingRight: (type === "password" || success) ? 44 : 16,
          }}
        />
        {type === "password" && (
          <button onClick={() => setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", fontSize:15, padding:4 }}>
            {show ? "🙈" : "👁"}
          </button>
        )}
        {success && type !== "password" && (
          <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--success)", fontSize:14 }}>✓</span>
        )}
      </div>
      {error && <p style={{ color:"var(--danger)", fontSize:12, marginTop:5, fontFamily:"'Inter', sans-serif" }}>{error}</p>}
    </div>
  );
};

/* ── Tag / Pill ── */
export const Tag = ({ children, color = "default" }) => {
  const colors = {
    default: { bg:"var(--bg-3)", color:"var(--text-2)" },
    gold:    { bg:"rgba(168,143,92,0.12)", color:"var(--gold)" },
    success: { bg:"rgba(45,106,79,0.10)",  color:"var(--success)" },
    danger:  { bg:"rgba(192,57,43,0.10)",  color:"var(--danger)" },
    warning: { bg:"rgba(181,134,42,0.12)", color:"var(--warning)" },
  };
  const c = colors[color];
  return <span style={{ background:c.bg, color:c.color, fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:0, fontFamily:"'Inter', sans-serif" }}>{children}</span>;
};

/* ── Section Header ── */
export const SectionHeader = ({ eyebrow, title, center }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: 56 }}>
    {eyebrow && <p style={{ fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gold)", fontFamily:"'Inter', sans-serif", marginBottom:12 }}>{eyebrow}</p>}
    <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(28px, 4vw, 44px)", fontWeight:700, color:"var(--text)", lineHeight:1.15 }}>{title}</h2>
  </div>
);

/* ── Divider ── */
export const Divider = () => <div style={{ height:1, background:"var(--border)", margin:"0" }} />;

/* ── Avatar ── */
export const Avatar = ({ initials, size=36, gold }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background: gold ? "rgba(168,143,92,0.12)" : "var(--bg-3)", border:`1.5px solid ${gold ? "var(--border-gold)" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.round(size*0.34), fontWeight:600, color: gold ? "var(--gold)" : "var(--text-2)", fontFamily:"'Inter', sans-serif", flexShrink:0 }}>
    {initials}
  </div>
);

/* ── Amenity Icon ── */
/* ── Modern SVG line icons (Change 5) ── */
export const Icon = ({ name, size = 22, stroke = "var(--text)", strokeWidth = 1.5 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    wifi: <><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="0.5" fill={stroke}/></>,
    coffee: <><path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 4v1.5M11 4v1.5"/></>,
    phone: <><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 18h2"/></>,
    printer: <><path d="M7 9V4h10v5"/><rect x="5" y="9" width="14" height="7" rx="1"/><path d="M7 16h10v4H7z"/><circle cx="16.5" cy="11.5" r="0.5" fill={stroke}/></>,
    parking: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/></>,
    reception: <><path d="M4 18h16"/><path d="M6 18v-4a6 6 0 0 1 12 0v4"/><path d="M12 8V5"/><path d="M10 5h4"/></>,
    av: <><rect x="3" y="5" width="18" height="11" rx="1"/><path d="M8 20h8M12 16v4"/></>,
    light: <><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></>,
    chair: <><path d="M6 19v-3M18 19v-3M6 16h12"/><path d="M7 16l-1-9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2l-1 9"/><path d="M8 10h8"/></>,
    key: <><circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M16 6l2 2M14 8l1.5 1.5"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="1"/><path d="M4 9h16M9 3v4M15 3v4"/></>,
    mail: <><rect x="3" y="6" width="18" height="12" rx="1"/><path d="m3 7 9 6 9-6"/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 16l9 5 9-5" opacity="0.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    pin: <><path d="M12 21s-6.5-5.3-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.7 12 21 12 21Z"/><circle cx="12" cy="10.6" r="2.2"/></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></>,
    bolt: <><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M21 19a6 6 0 0 0-4-5.6"/></>,
    phone_mobile: <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 18h4"/></>,
    doc: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 5-5"/></>,
  };
  return <svg {...common}>{paths[name] || paths.check}</svg>;
};

export const AmenityIcon = ({ name, size=16 }) => {
  const m = { WiFi:"wifi", Coffee:"coffee", "Phone Booth":"phone", Printing:"printer", Parking:"parking", Reception:"reception", "A/V Setup":"av", "Natural Light":"light" };
  return <Icon name={m[name] || "check"} size={size} stroke="var(--gold)" />;
};

/* ── Top Navbar ──────────────────────────────────────────────────────
   Knotel-style header: logo left, transparent over hero, solid on scroll,
   hover dropdowns driven by the HiLink sitemap. Order per feedback:
   Home (logo) · Locations · Solutions · About · Partnerships · Forum ·
   Find my space · Sign up / Log in.
   ───────────────────────────────────────────────────────────────────── */

/* Primary navigation derived from the HiLink sitemap.
   `to` points at the live route today; sub-pages that don't exist yet
   fall back to the nearest existing landing so no link dead-ends. */
const NAV = [
  {
    label: "Locations", to: "/locations",
    items: [
      { label: "35 Nhà Chung",        to: "/locations?loc=nha-chung", img: LOC_IMG["nha-chung"] },
      { label: "F7 · 60 Lý Thái Tổ",   to: "/locations?loc=obc",       img: LOC_IMG["obc"] },
      { label: "F15 · 4 Tôn Thất Tùng", to: "/locations?loc=ttt-f15",  img: LOC_IMG["ttt-f15"] },
      { label: "F17 · 4 Tôn Thất Tùng", to: "/locations?loc=ttt-f17",  img: LOC_IMG["ttt-f17"] },
      { label: "F19 · 4 Tôn Thất Tùng", to: "/locations?loc=ttt-f19",  img: LOC_IMG["ttt-f19"] },
      { label: "F7 · 83 Lý Thường Kiệt", to: "/locations?loc=pp83",    img: LOC_IMG["pp83"] },
      { label: "49 Ngô Quyền",         to: "/locations?loc=nq49",      img: LOC_IMG["nq49"] },
    ],
  },
  {
    label: "Solutions", to: "/solutions", perItemArts: {
      "private-workspaces": [0, 1], "hybrid-work": [1, 2], "e-office": [2, 0],
      "corporate-suites": [0, 2], "specialized-suites": [1, 0], "enterprise": [2, 1],
    },
    items: [
      { label: "Private Workspaces", to: "/solutions/private-workspaces", img: "/mid/Cabin 2 copy.jpg.webp" },
      { label: "Hybrid Work",        to: "/solutions/hybrid-work", img: "/mid/Lounge 2 copy.jpg.webp" },
      { label: "e-Office",           to: "/solutions/e-office", img: "/mid/DSC06104.jpg.webp" },
      { label: "Corporate Suites",   to: "/solutions/corporate-suites", img: "/mid/Meeting room 6 copy.jpg.webp" },
      { label: "Specialized Suites", to: "/solutions/specialized-suites", img: "/mid/DSC05831(1).jpg.webp" },
      { label: "Enterprise Solutions", to: "/solutions/enterprise", img: "/mid/DSC06155(1).jpg.webp" },
    ],
  },
  {
    label: "About", to: "/about",
    items: [
      { label: "Origin Story",  to: "/about#origin" },
      { label: "Vision",        to: "/about#vision" },
      { label: "Mission",       to: "/about#mission" },
      { label: "Core Values",   to: "/about#values" },
      { label: "Team",          to: "/about#team" },
      { label: "Contact",       to: "/about#contact" },
    ],
  },
  {
    label: "Partnerships", to: "/partnerships",
    items: [
      { label: "Why Partner with HiLink",   to: "/partnerships#why" },
      { label: "Our Partners",              to: "/partnerships#partners" },
      { label: "For Business Services",     to: "/partnerships#contact" },
      { label: "For Landlords",             to: "/partnerships/landlords" },
      { label: "For Brokers",               to: "/partnerships/brokers" },
      { label: "For Enterprises",           to: "/partnerships/enterprise" },
      { label: "For Developers",            to: "/partnerships#contact" },
    ],
  },
  { label: "Forum", to: "/forum", items: null },
];

const navLinkStyle = (active, light) => ({
  textShadow: light ? "0 1px 3px rgba(0,0,0,0.85), 0 2px 14px rgba(0,0,0,0.65)" : "none",
  textDecoration: "none",
  fontSize: 12.5,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: active ? "var(--gold)" : (light ? "#FFFFFF" : "var(--text)"),
  transition: "color 0.2s",
  whiteSpace: "nowrap",
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
});

/* One top-level nav entry, with optional hover dropdown */

/* Mega-menu metadata: intro per section + related Forum articles */
const MEGA_INTRO = {
  Locations:    { d: "Seven characterful workspaces across central Hanoi — find the floor that fits.", arts: [0, 1] },
  Solutions:    { d: "From a registered address to a full private floor — solutions for every way of working.", arts: [1, 2] },
  About:        { d: "The story, the standard, and the people behind HiLink.", arts: [2, 0] },
  Partnerships: { d: "Landlords, brokers, and enterprises — grow with HiLink.", arts: [0, 2] },
};

const NavItem = ({ entry, light }) => {
  const [open, setOpen] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const loc = useLocation();
  const active = entry.to !== "/" && loc.pathname === entry.to.split("#")[0]
    || (entry.items || []).some(i => loc.pathname === i.to.split("#")[0] && i.to !== "/about");
  const hasImg = (entry.items || []).some(i => i.img);

  const closeTimer = useRef(null);
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 140); };

  if (!entry.items) {
    return (
      <Link to={entry.to} className="nav-top-link" style={{ ...navLinkStyle(loc.pathname.startsWith(entry.to), light) }}>{entry.label}</Link>
    );
  }

  return (
    <div
      style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <Link to={entry.to} className="nav-top-link" style={navLinkStyle(active, light)}>
        {entry.label}
        <span style={{ fontSize: 8, opacity: 0.55, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}>▾</span>
      </Link>

      {open && (
        <motion.div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "fixed", top: 64, left: 0, right: 0, zIndex: 98,
            background: "#FFFFFF", borderBottom: "1px solid var(--border)",
            boxShadow: "0 30px 60px -20px rgba(15,15,15,0.22)",
          }}
        >
          {/* hover bridge so the gap below the bar doesn't close the menu */}
          <div style={{ position: "absolute", top: -16, left: 0, right: 0, height: 16 }} />
          <div className="mega-grid" style={{ maxWidth: 1400, margin: "0 auto", padding: "44px 48px 48px", display: "grid", gridTemplateColumns: "1.1fr 1fr 1.5fr", gap: 64, alignItems: "start" }}>
            {/* ── Left: section intro + outlined CTA (WeWork pattern) ── */}
            <div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem,2.8vw,2.5rem)", fontWeight: 400, color: "var(--text)", marginBottom: 14, lineHeight: 1.08 }}>{entry.label}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>{(MEGA_INTRO[entry.label] || {}).d || ""}</p>
              <Link to={entry.to}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", border: "1px solid var(--text)", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.06em", color: "var(--text)", textDecoration: "none", transition: "background 0.2s, color 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "#F8F6F1"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}>
                {entry.label === "Locations" ? "All locations" : `Explore ${entry.label.toLowerCase()}`}
              </Link>
            </div>

            {/* ── Middle: plain link list, hover pill + chevron ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {entry.items.map(i => {
                const on = hoverItem === i.to;
                return (
                  <Link key={i.label} to={i.to} className="nav-drop-item"
                    onMouseEnter={() => setHoverItem(i.to)} onMouseLeave={() => setHoverItem(null)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "13px 18px", borderRadius: 10, textDecoration: "none",
                      fontFamily: "'Inter', sans-serif", fontSize: 15.5, fontWeight: on ? 600 : 400, color: "var(--text)",
                      background: on ? "var(--bg-2)" : "transparent", transition: "background 0.15s, font-weight 0.1s" }}>
                    {i.label}
                    <span aria-hidden="true" style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-6px)", transition: "opacity 0.18s, transform 0.25s cubic-bezier(0.16,1,0.3,1)", fontSize: 16, color: "var(--text)" }}>›</span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right: two large promo cards — image fill, caption overlaid ── */}
            <div className="mega-arts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {(() => {
                let picks = (MEGA_INTRO[entry.label] || {}).arts || [0, 1];
                if (hoverItem && entry.perItemArts) {
                  const slug = hoverItem.split("/").pop().split("?")[0];
                  if (entry.perItemArts[slug]) picks = entry.perItemArts[slug];
                }
                return picks.map(ai => ARTICLES[ai]).filter(Boolean);
              })().map(a => (
                <Link key={a.id} to={`/forum/${a.slug}`}
                  style={{ position: "relative", display: "block", aspectRatio: "4 / 3.6", borderRadius: 12, overflow: "hidden", textDecoration: "none", background: "var(--bg-2)" }}
                  onMouseEnter={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1)"; }}>
                  <img {...rs(thumb(a.image), SIZES.thumb)} alt={a.title} loading="lazy" decoding="async"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }} />
                  <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,8,0.78) 0%, rgba(10,10,8,0.22) 45%, rgba(10,10,8,0) 70%)" }} />
                  <span style={{ position: "absolute", left: 18, right: 18, bottom: 16 }}>
                    <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>{a.category}</span>
                    <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.35 }}>{a.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const { lang, toggle } = useLang();
  const { trigger } = useSplash();

  // Transparent at the top of the page, solid blurred bar once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Routes with a dark, full-bleed hero behind the (transparent) navbar.
  // On these, at the top, the bar uses white text + a white logo for legibility.
  const darkHero = loc.pathname === "/" || loc.pathname === "/about" || loc.pathname === "/partnerships" || loc.pathname === "/forum"
    || /^\/locations\/[^/]+$/.test(loc.pathname)
    || /^\/partnerships\/.+/.test(loc.pathname);
  const [barHover, setBarHover] = useState(false);
  const light = !scrolled && darkHero && !barHover;

  /* Focus-mode nav: on a section page, only that section's name stays in the
     bar; the other items collapse away and glide back in when the bar is
     hovered. On unmatched routes (home, tools) all items show. */
  const activeNavLabel =
    loc.pathname.startsWith("/locations") ? "Locations" :
    loc.pathname.startsWith("/solutions") ? "Solutions" :
    (loc.pathname.startsWith("/about") || loc.pathname.startsWith("/careers")) ? "About" :
    loc.pathname.startsWith("/partnerships") ? "Partnerships" :
    loc.pathname.startsWith("/forum") ? "Forum" : null;
  const focusMode = !!activeNavLabel;

  return (
    <>
      <nav onMouseEnter={() => setBarHover(true)} onMouseLeave={() => setBarHover(false)}
        onFocus={() => setBarHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setBarHover(false); }}
        className={`site-header${scrolled ? " is-scrolled" : ""}${light ? " is-light" : ""}`} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        background: scrolled ? "var(--nav-bg)" : (barHover ? "var(--surface)" : (light ? "linear-gradient(to bottom, rgba(10,11,6,0.62) 0%, rgba(10,11,6,0.28) 62%, rgba(10,11,6,0) 100%)" : "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 88%, transparent) 0%, color-mix(in srgb, var(--bg) 45%, transparent) 60%, transparent 100%)")),
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}>
       <div className="nav-inner" style={{ maxWidth: "100%", margin: "0 auto", height: "100%", padding: "0 56px", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 40, position: "relative" }}>

        {/* Logo — the one item kept apart, anchored to the left */}
        <div
          className="nav-logo"
          onClick={() => { trigger(); navigate("/"); }}
          style={{ cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", textDecoration: "none", outline: "none", WebkitTapHighlightColor: "transparent" }}
        >
          <img src="/logo-hilink-lockup.svg" alt="HiLink"
            style={{ aspectRatio: "2413 / 1669", height: 54, width: "auto", display: "block", border: "none", outline: "none",
              filter: light ? "brightness(0) invert(1)" : "none", transition: "filter 0.3s ease" }}/>
        </div>

        {/* Right — primary nav links pushed to the right */}
        <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 0, marginLeft: "auto" }}>
          {NAV.map(entry => {
            const show = !focusMode || barHover || entry.label === activeNavLabel;
            return (
              <div key={entry.label} style={{
                /* NOTE: no transform here — any transform (even translateX(0))
                   turns this overflow-hidden sliver into the containing block
                   for the fixed mega dropdown, clipping it invisible. The
                   collapse animates with max-width/opacity/padding only. */
                overflow: show ? "visible" : "hidden", whiteSpace: "nowrap",
                maxWidth: show ? 220 : 0,
                opacity: show ? 1 : 0,
                padding: show ? "0 13px" : "0",
                transition: "max-width 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, padding 0.55s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <NavItem entry={entry} light={light} />
              </div>
            );
          })}
        </div>

        {/* Right cluster — Find my space · EN/VI */}
        <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
          <Link to="/recommend" className="nav-top-link" style={navLinkStyle(loc.pathname === "/recommend", light)}>Find my space</Link>
          {/* EN/VI Language toggle */}
          <div style={{ display: "flex", alignItems: "center", fontFamily: "'Inter',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>
            <span onClick={() => lang !== "en" && toggle()}
              style={{ color: lang === "en" ? "var(--gold)" : (light ? "rgba(255,255,255,0.85)" : "var(--text-3)"), fontWeight: lang === "en" ? 600 : 400, cursor: lang === "en" ? "default" : "pointer", transition: "color 0.2s" }}>EN</span>
            <span style={{ color: light ? "rgba(255,255,255,0.5)" : "var(--text-3)", margin: "0 5px", fontWeight: 300 }}>/</span>
            <span onClick={() => lang !== "vi" && toggle()}
              style={{ color: lang === "vi" ? "var(--gold)" : (light ? "rgba(255,255,255,0.85)" : "var(--text-3)"), fontWeight: lang === "vi" ? 600 : 400, cursor: lang === "vi" ? "default" : "pointer", transition: "color 0.2s" }}>VI</span>
          </div>

        </div>


        {/* Mobile toggle — 44×44 tap target (WCAG / mobile-friendly audits) */}
        <button className="show-mob" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", marginLeft: "auto", width: 44, height: 44, alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0, WebkitTapHighlightColor: "transparent" }}>
          <span aria-hidden="true" style={{ position: "relative", display: "block", width: 22, height: 14 }}>
            {[0, 1].map(i => (
              <span key={i} style={{ position: "absolute", left: 0, right: 0, height: 1.5, borderRadius: 2,
                background: (menuOpen || !light) ? "var(--text)" : "#FFFFFF",
                top: menuOpen ? 6 : i * 12,
                transform: menuOpen ? `rotate(${i ? -45 : 45}deg)` : "none",
                transition: "top 0.25s ease, transform 0.25s ease, background 0.3s ease" }} />
            ))}
          </span>
        </button>
       </div>
      </nav>

      {/* Mobile menu — full-screen sheet, accordion sections, 48px tap rows */}
      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} lang={lang} toggleLang={toggle} />
    </>
  );
};

/* ── Mobile navigation sheet ────────────────────────────────────────────────
   Design goals (mobile audit fixes): every row ≥48px tall, 16–17px labels
   (no tiny text), one-thumb accordion instead of a long undifferentiated
   list, language toggle and primary CTA reachable at the bottom, body
   scroll locked while open. */
const MobileMenu = ({ open, close, lang, toggleLang }) => {
  const [openSection, setOpenSection] = useState(null);
  const loc = useLocation();

  /* Close on any navigation — covers the logo tap, which bypasses the rows */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sheet must dismiss after external navigation
    if (open) close();
  }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Lock page scroll behind the sheet */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* Reset accordion whenever the sheet closes */
  useEffect(() => { if (!open) setOpenSection(null); }, [open]);

  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 52,
    padding: "0 4px", color: "var(--text)", textDecoration: "none", background: "none", border: "none",
    width: "100%", cursor: "pointer", WebkitTapHighlightColor: "transparent",
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 400, textAlign: "left" };
  const subRow = { display: "flex", alignItems: "center", minHeight: 46, padding: "0 4px 0 18px",
    color: "var(--text-2)", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: 16 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 99,
            background: "var(--bg)", borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column" }}>

          <nav style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "8px 24px 24px" }}>
            {NAV.map(entry => {
              const expanded = openSection === entry.label;
              return (
                <div key={entry.label} style={{ borderBottom: "1px solid var(--border)" }}>
                  {entry.items ? (
                    <button style={row} aria-expanded={expanded}
                      onClick={() => setOpenSection(expanded ? null : entry.label)}>
                      {entry.label}
                      <span aria-hidden="true" style={{ fontSize: 13, color: "var(--text-3)",
                        transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}>▾</span>
                    </button>
                  ) : (
                    <Link to={entry.to} onClick={close} style={row}>{entry.label}</Link>
                  )}

                  {entry.items && (
                    <motion.div initial={false}
                      animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ paddingBottom: 10 }}>
                        <Link to={entry.to} onClick={close} style={{ ...subRow, color: "var(--gold)", fontWeight: 600 }}>
                          {entry.label === "Locations" ? "All locations" : `All ${entry.label.toLowerCase()}`}
                        </Link>
                        {entry.items.map(i => (
                          <Link key={i.label} to={i.to} onClick={close} style={subRow}>{i.label}</Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom bar — primary CTA + language, always reachable */}
          <div style={{ padding: "14px 24px calc(20px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 14, background: "var(--bg)" }}>
            <Link to="/recommend" onClick={close}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 50,
                background: "var(--text)", color: "#F8F6F1", borderRadius: 999, textDecoration: "none",
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.06em" }}>
              {lang === "en" ? "Find my space" : "Tìm không gian"}
            </Link>
            <button onClick={toggleLang} aria-label="Switch language"
              style={{ minWidth: 74, minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                background: "none", border: "1px solid var(--border)", borderRadius: 999, cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: "0.08em", WebkitTapHighlightColor: "transparent" }}>
              <span style={{ color: lang === "en" ? "var(--gold)" : "var(--text-3)", fontWeight: lang === "en" ? 700 : 400 }}>EN</span>
              <span style={{ color: "var(--text-3)", fontWeight: 300 }}>/</span>
              <span style={{ color: lang === "vi" ? "var(--gold)" : "var(--text-3)", fontWeight: lang === "vi" ? 700 : 400 }}>VI</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

