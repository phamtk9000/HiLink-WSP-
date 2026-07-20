import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import MapCard from "../components/MapCard.jsx";
import { LOCATIONS, WORKSPACE_LINES, DISTRICTS, ALL_SOLUTIONS, MOVE_IN_OPTIONS } from "../data/locations.js";
import { useSeo } from "../lib/seo.js";

const T = {
  en: {
    eyebrow: "Locations", title: "Find your HiLink", sub: "Seven premium addresses across central Hanoi. Filter by what you need, then explore on the map.",
    fSolution: "Solution", fDistrict: "Location", fMoveIn: "Move-in", any: "All", search: "Search locations…",
    vacancies: "rooms available", moveInLabel: "Move-in", call: "Schedule a call", view: "View location",
    none: "No locations match these filters.", reset: "Reset filters", availSpaces: "Available spaces", sizes: "Sizes", floorWord: "Floor", cityLabel: "City", comingSoon: "Coming soon", availFrom: "Available from",
    mapTitle: "Central Hanoi",
    cName: "Full name", cEmail: "Email", cPhone: "Phone", cMsg: "What are you looking for?",
    cSend: "Request a callback", cEyebrow: "Get in touch", cTitle: "Not sure which location?",
    cSub: "Tell us your team size and timeline — we'll match you to the right space.",
    cDone: "Thanks — we'll be in touch within one business day.",
  },
  vi: {
    eyebrow: "Địa điểm", title: "Tìm HiLink của bạn", sub: "Bảy địa chỉ cao cấp tại trung tâm Hà Nội. Lọc theo nhu cầu và khám phá trên bản đồ.",
    fSolution: "Dịch vụ", fDistrict: "Khu vực", fMoveIn: "Thời điểm vào", any: "Tất cả", search: "Tìm địa điểm…",
    vacancies: "phòng còn trống", moveInLabel: "Vào ở", call: "Đặt lịch gọi", view: "Xem địa điểm",
    none: "Không có địa điểm phù hợp.", reset: "Đặt lại bộ lọc", availSpaces: "Phòng còn trống", sizes: "Diện tích", floorWord: "Tầng", cityLabel: "Thành phố", comingSoon: "Sắp ra mắt", availFrom: "Trống từ",
    mapTitle: "Trung tâm Hà Nội",
    cName: "Họ và tên", cEmail: "Email", cPhone: "Điện thoại", cMsg: "Bạn đang tìm gì?",
    cSend: "Yêu cầu gọi lại", cEyebrow: "Liên hệ", cTitle: "Chưa chắc chọn địa điểm nào?",
    cSub: "Cho chúng tôi biết quy mô đội ngũ và thời gian — chúng tôi sẽ gợi ý không gian phù hợp.",
    cDone: "Cảm ơn — chúng tôi sẽ liên hệ trong một ngày làm việc.",
  },
};

const selectStyle = {
  width: "100%", padding: "11px 12px", fontFamily: "'Inter', sans-serif", fontSize: 13,
  color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: 2, outline: "none", cursor: "pointer",
};
const inputStyle = { ...selectStyle, cursor: "text" };

/* ── Schematic offline SVG map of central Hanoi ──────────────────────── */
/* Stylised but realistic central-Hanoi map — brand palette, per-location pin + callout */
/* City picker — Hanoi live, others flagged coming-soon */
const CitySelect = ({ label, comingSoon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const CITIES = [
    { name: "Hanoi", live: true },
    { name: "HCM City", live: false },
    { name: "Da Nang", live: false },
  ];
  return (
    <div ref={ref} style={{ position: "relative", background: "#FFFFFF", border: "1px solid rgba(29,28,26,0.14)", borderRadius: 8, boxShadow: "0 14px 38px -20px rgba(15,15,15,0.45)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", height: "100%", background: open ? "var(--bg-2)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textAlign: "left", transition: "background 0.15s" }}>
        <Icon name="pin" size={18} stroke="var(--gold)" />
        <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B867A", marginBottom: 2 }}>{label}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text)" }}>Hanoi</span>
        </span>
        <span style={{ fontSize: 9, color: "var(--gold)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}
          style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, minWidth: 240, zIndex: 400, background: "var(--surface)", border: "1px solid var(--border)", borderTop: "2px solid var(--gold)", boxShadow: "0 22px 48px -18px rgba(15,15,15,0.35)" }}>
          {CITIES.map((c, i) => (
            <button key={i} disabled={!c.live} onClick={() => c.live && setOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", textAlign: "left", padding: "12px 16px", border: "none", background: "transparent", cursor: c.live ? "pointer" : "default", fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: c.live ? "var(--text)" : "var(--text-3)", transition: "background 0.12s" }}
              onMouseEnter={e => { if (c.live) e.currentTarget.style.background = "var(--bg-2)"; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {c.name}
              {c.live
                ? <span style={{ color: "var(--gold)", fontSize: 12 }}>✓</span>
                : <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 12, color: "var(--text-3)" }}>{comingSoon}</span>}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

/* ── Custom search-bar dropdown (replaces native <select>) ──
   Brand-styled panel: cream surface, hairline rows, gold hover, ✓ on active. */
export const FilterSelect = ({ label, value, onChange, options, anyLabel, groupLabel }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const pick = (v) => { onChange(v); setOpen(false); };
  /* Fixed ink-on-white palette: this control floats over photos and dark
     bands, so it must stay readable in BOTH themes. */
  const rowStyle = (active) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    width: "100%", textAlign: "left", padding: "11px 16px", border: "none", cursor: "pointer",
    background: "transparent", fontFamily: "'Inter', sans-serif", fontSize: 13.5,
    color: active ? "var(--gold)" : "#1D1C1A", transition: "background 0.12s, color 0.12s",
  });
  return (
    <div ref={ref} style={{ position: "relative", background: "#FFFFFF", border: "1px solid rgba(29,28,26,0.14)", borderRadius: 8, boxShadow: "0 14px 38px -20px rgba(15,15,15,0.45)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", height: "100%", background: open ? "#F0EDE6" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px 16px", textAlign: "left", transition: "background 0.15s" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B867A", marginBottom: 2 }}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: value ? "#1D1C1A" : "#8B867A" }}>
          {value || anyLabel}
          <span style={{ fontSize: 9, color: "var(--gold)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
        </span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}
          style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, minWidth: 220, zIndex: 400,
            background: "#FFFFFF", border: "1px solid rgba(29,28,26,0.14)", borderTop: "2px solid var(--gold)",
            boxShadow: "0 22px 48px -18px rgba(15,15,15,0.4)", maxHeight: "min(70vh, 520px)", overflowY: "auto" }}>
          {groupLabel && (
            <div style={{ padding: "10px 16px 6px", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 13.5, color: "var(--text-3)", opacity: 0.75, borderBottom: "1px solid var(--border)", filter: "blur(0.2px)" }}>{groupLabel}</div>
          )}
          {["", ...options].map((o, oi) => {
            const active = value === o;
            return (
              <button key={oi} onClick={() => pick(o)} style={rowStyle(active)}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                <span style={{ borderBottom: oi === 0 ? "none" : undefined }}>{o || anyLabel}</span>
                {active && <span style={{ color: "var(--gold)", fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

/* Brand-styled calendar popover (replaces the native date input) */
const MONTHS = { en: ["January","February","March","April","May","June","July","August","September","October","November","December"], vi: ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"] };
const DOW = { en: ["Mo","Tu","We","Th","Fr","Sa","Su"], vi: ["T2","T3","T4","T5","T6","T7","CN"] };
const DatePicker = ({ label, value, onChange, lang, anyLabel }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => { const d = value ? new Date(value) : new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const first = new Date(view.y, view.m, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const sel = value ? new Date(value) : null;
  const fmt = (d) => `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const shift = (n) => setView(v => { let m = v.m + n, y = v.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { y, m }; });
  return (
    <div ref={ref} style={{ position: "relative", background: "#FFFFFF", border: "1px solid rgba(29,28,26,0.14)", borderRadius: 8, boxShadow: "0 14px 38px -20px rgba(15,15,15,0.45)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", height: "100%", background: open ? "var(--bg-2)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textAlign: "left", transition: "background 0.15s" }}>
        <Icon name="clock" size={17} stroke="var(--gold)" />
        <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B867A", marginBottom: 2 }}>{label}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: value ? "var(--text)" : "var(--text-3)" }}>{value ? fmt(sel) : anyLabel}</span>
        </span>
        <span style={{ fontSize: 9, color: "var(--gold)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}
          style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 400, width: 300, background: "var(--surface)", border: "1px solid var(--border)", borderTop: "2px solid var(--gold)", boxShadow: "0 22px 48px -18px rgba(15,15,15,0.35)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <button onClick={() => shift(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", fontSize: 16, padding: 4 }}>‹</button>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", color: "var(--text)" }}>{MONTHS[lang][view.m]} {view.y}</span>
            <button onClick={() => shift(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", fontSize: 16, padding: 4 }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
            {DOW[lang].map(d => <span key={d} style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "var(--text-3)" }}>{d}</span>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {Array.from({ length: startDow }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: days }).map((_, i) => {
              const d = new Date(view.y, view.m, i + 1);
              const past = d < today;
              const isSel = sel && d.toDateString() === sel.toDateString();
              return (
                <button key={i} disabled={past} onClick={() => { onChange(iso(d)); setOpen(false); }}
                  style={{ aspectRatio: "1", border: "none", borderRadius: "50%", cursor: past ? "default" : "pointer",
                    background: isSel ? "var(--gold)" : "transparent", color: isSel ? "#0F0F0F" : (past ? "var(--text-3)" : "var(--text)"),
                    opacity: past ? 0.4 : 1, fontFamily: "'Inter', sans-serif", fontSize: 12.5, transition: "background 0.12s" }}
                  onMouseEnter={e => { if (!past && !isSel) e.currentTarget.style.background = "var(--bg-2)"; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          {value && (
            <button onClick={() => { onChange(""); setOpen(false); }}
              style={{ marginTop: 12, width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>{anyLabel}</button>
          )}
        </motion.div>
      )}
    </div>
  );
};

const MAP_STREETS = [
  // major avenues
  "M0 38 C20 36, 38 40, 52 44 C66 48, 78 44, 100 46",
  "M0 64 C22 62, 40 66, 56 62 C70 59, 84 64, 100 60",
  "M30 0 C32 18, 28 34, 34 50 C38 64, 34 82, 36 100",
  "M62 0 C60 16, 66 30, 62 44 C58 60, 64 80, 60 100",
  "M0 20 C24 18, 46 22, 66 18 C78 16, 88 20, 100 18",
  // old-quarter grid (north of the lake)
  "M44 16 L72 24", "M46 24 L74 32", "M48 32 L70 40",
  "M50 14 L44 40", "M58 14 L52 42", "M66 16 L60 40",
  // đống đa lanes (lower-left)
  "M10 56 L40 72", "M14 70 L42 84", "M22 50 L30 86",
];

export const HanoiMap = ({ active, onSelect }) => {
  const act = LOCATIONS.find(l => l.id === active);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }} role="img" aria-label="Map of HiLink locations in Hanoi">
      <rect x="0" y="0" width="100" height="100" fill="#EFEADD" />
      {/* city blocks (soft fills) */}
      <g fill="#E7E0CD">
        <path d="M44 16 L72 24 L70 40 L48 32 Z" />
        <rect x="8" y="52" width="34" height="34" transform="rotate(-6 25 69)" />
        <rect x="66" y="26" width="20" height="30" opacity="0.7" />
      </g>
      {/* Red River (Sông Hồng) */}
      <path d="M80 0 C76 18, 88 34, 81 52 C76 68, 86 84, 81 100 L100 100 L100 0 Z" fill="#D7DECF" />
      <path d="M80 0 C76 18, 88 34, 81 52 C76 68, 86 84, 81 100" fill="none" stroke="#C2CBB6" strokeWidth="0.7" />
      {/* streets */}
      <g fill="none" stroke="#E0D7C0" strokeLinecap="round">
        {MAP_STREETS.map((d, i) => <path key={i} d={d} strokeWidth={i < 5 ? 1.4 : 0.7} />)}
      </g>
      {/* Hoàn Kiếm Lake */}
      <path d="M56 41 C61 39, 66 43, 66 48 C66 54, 61 58, 56 57 C51 56, 51 49, 52 45 C53 42, 54 42, 56 41 Z" fill="#BCD2C4" stroke="#A6C0B0" strokeWidth="0.5" />
      <circle cx="58.5" cy="49" r="0.7" fill="#9DB7A6" />
      {/* labels */}
      <text x="60" y="30" fontSize="3" fill="#9A8E72" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.3">HOÀN KIẾM</text>
      <text x="26" y="48" fontSize="3" fill="#9A8E72" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.3">ĐỐNG ĐA</text>
      <text x="22" y="14" fontSize="2.6" fill="#A9A088" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.2">BA ĐÌNH</text>
      <text x="91" y="78" fontSize="2.6" fill="#A9A088" fontFamily="Inter, sans-serif" textAnchor="middle" transform="rotate(80 91 78)">SÔNG HỒNG</text>
      {/* pins */}
      {LOCATIONS.map(l => {
        const on = active === l.id;
        const c = WORKSPACE_LINES[l.line].color;
        return (
          <g key={l.id} style={{ cursor: "pointer" }} onClick={() => onSelect && onSelect(l.id)} transform={`translate(${l.mapX} ${l.mapY})`}>
            {on && <circle r="4.6" fill={c} opacity="0.2" />}
            <path d="M0 -4 C2.3 -4 3.4 -2.2 3.4 -0.6 C3.4 1.6 0 4.4 0 4.4 C0 4.4 -3.4 1.6 -3.4 -0.6 C-3.4 -2.2 -2.3 -4 0 -4 Z"
              fill={on ? c : "#FFFFFF"} stroke={c} strokeWidth="0.7" style={{ transition: "all 0.2s" }} />
            <circle cy="-0.7" r="1" fill={on ? "#FFFFFF" : c} />
          </g>
        );
      })}
      {/* active callout */}
      {act && (
        <g transform={`translate(${act.mapX} ${act.mapY})`} style={{ pointerEvents: "none" }}>
          <g transform="translate(4 -9)">
            <rect x="0" y="0" width={Math.max(act.name.length * 1.7 + 6, 18)} height="7" rx="1.4" fill="#0F0F0F" />
            <text x="3" y="4.9" fontSize="3.1" fill="#FFFFFF" fontFamily="'Playfair Display', Georgia, serif">{act.name}</text>
          </g>
        </g>
      )}
    </svg>
  );
};

const LineBadge = ({ line }) => {
  const meta = WORKSPACE_LINES[line];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 2, background: meta.color + "1A", border: `1px solid ${meta.color}40` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: meta.color }}>{line}</span>
    </span>
  );
};

const LocationsPage = () => {
  const { lang } = useLang();
  const t = T[lang];
  useSeo({
    lang,
    title: lang === "vi" ? "Địa điểm tại Hà Nội" : "Locations in Hanoi",
    description: lang === "vi"
      ? "Bảy không gian làm việc giàu bản sắc khắp trung tâm Hà Nội — Hoàn Kiếm, Đống Đa và hơn thế. Tìm tầng phù hợp với bạn."
      : "Seven characterful workspaces across central Hanoi — Hoàn Kiếm, Đống Đa and beyond. Find the floor that fits.",
  });

  const navigate = useNavigate();

  const [solution, setSolution] = useState("");
  const [district, setDistrict] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [q, setQ] = useState("");
  const [active, setActive] = useState(LOCATIONS[0].id);

  // Deep-link: /locations?loc=obc selects that site on load
  const [params] = useSearchParams();
  useEffect(() => {
    const loc = params.get("loc");
    if (loc && LOCATIONS.some(l => l.id === loc)) setActive(loc);
    const sol = params.get("solution");
    if (sol && ALL_SOLUTIONS.includes(sol)) setSolution(sol);
    const dist = params.get("district");
    if (dist && DISTRICTS.includes(dist)) setDistrict(dist);
  }, [params]);

  const filtered = useMemo(() => LOCATIONS.filter(l => {
    if (solution && !l.solutions.includes(solution)) return false;
    if (district && l.district !== district) return false;
    if (moveIn && l.vacancies === 0) return false; /* a date picked → must have availability */
    if (q && !`${l.name} ${l.code} ${l.address}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [solution, district, moveIn, q]);

  const resetFilters = () => { setSolution(""); setDistrict(""); setMoveIn(""); setQ(""); };

  /* Enquiry handled by shared <ContactForm /> */

  return (
    <PageWrap>
      <div style={{ paddingTop: 64 }}>
        {/* Header */}
        <section style={{ background: "var(--bg)", padding: "18px 48px 18px", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 30 }}>
          <div>

            {/* Filter bar (row 18) — unified card with labelled segments */}
            <div className="loc-filters" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr auto", gap: 14, marginTop: 0 }}>
              <CitySelect label={t.cityLabel} comingSoon={t.comingSoon} />
              {[
                { label: t.fSolution, value: solution, set: setSolution, opts: ALL_SOLUTIONS },
                { label: t.fDistrict, value: district, set: setDistrict, opts: DISTRICTS },
              ].map((f, i) => (
                <FilterSelect key={i} label={f.label} value={f.value} onChange={f.set} options={f.opts} anyLabel={t.any} />
              ))}
              {/* Available from — custom calendar */}
              <DatePicker label={t.availFrom} value={moveIn} onChange={setMoveIn} lang={lang} anyLabel={t.any} />
              {(q || solution || district || moveIn) ? (
                <button onClick={() => { setQ(""); setSolution(""); setDistrict(""); setMoveIn(""); }}
                  style={{ border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", cursor: "pointer", padding: "0 20px", boxShadow: "0 10px 30px -22px rgba(15,15,15,0.28)", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", whiteSpace: "nowrap", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--gold)"}>
                  ↺ {t.reset}
                </button>
              ) : <span style={{ padding: "0 8px" }} />}
            </div>
          </div>
        </section>

        {/* List + Map (row 17) */}
        <section style={{ background: "var(--bg)", padding: 0 }}>
          <div className="loc-shell" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0, alignItems: "start" }}>
            {/* Left — location list */}
            <div className="loc-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignContent: "start", padding: "28px 32px 80px 48px" }}>
              {filtered.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: 2 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-3)", marginBottom: 14 }}>{t.none}</p>
                  <button onClick={resetFilters} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>{t.reset}</button>
                </div>
              )}
              {filtered.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  onMouseEnter={() => setActive(l.id)} onClick={() => navigate(`/locations/${l.id}`)}
                  style={{ background: "var(--surface)", border: `1px solid ${active === l.id ? "var(--gold)" : "var(--border)"}`, borderRadius: 4, overflow: "hidden", cursor: "pointer", transition: "border-color 0.25s, box-shadow 0.25s", boxShadow: active === l.id ? "0 16px 40px -20px rgba(15,15,15,0.3)" : "none" }}
                >
                  {/* Photo */}
                  <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16 }}>
                    <img src={l.img} alt={l.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>

                  <div style={{ padding: "22px 26px 24px" }}>
                    {/* Name + line badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.45rem", fontWeight: 400, color: "var(--text)", lineHeight: 1.15 }}>{l.name}</h3>
                      <LineBadge line={l.line} />
                    </div>

                    {/* Pin + address */}
                    <p style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text-2)", marginBottom: 6 }}>
                      <Icon name="pin" size={15} stroke="var(--text)" />{l.address}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)", marginBottom: 18, paddingLeft: 23 }}>{l.code} · {l.district} · <a href={`tel:${l.phone.replace(/\s/g, "")}`} onClick={e => e.stopPropagation()} style={{ color: "var(--text-3)", textDecoration: "none" }}>{l.phone}</a> · <a href={`mailto:${l.email}`} onClick={e => e.stopPropagation()} style={{ color: "var(--gold)", textDecoration: "none" }}>{l.email}</a></p>

                    {/* AVAILABLE SPACES row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)" }}>{t.availSpaces}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: l.vacancies > 0 ? "var(--text)" : "var(--text-3)" }}>{l.vacancies}</span>
                    </div>

                    {/* Move-in + view link */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 0 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-2)" }}>{t.moveInLabel}: {l.moveIn}</span>
                      <Link to={`/locations/${l.id}`} onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", whiteSpace: "nowrap" }}>{t.view} →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — sticky map (site-wide MapCard treatment, follows the
                active location as the list is browsed) */}
            <div className="loc-map" style={{ position: "sticky", top: 64, height: "calc(100vh - 64px)", alignSelf: "start" }}>
              <div style={{ borderLeft: "1px solid var(--border)", borderRadius: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <MapCard key={active} name={LOCATIONS.find(l => l.id === active)?.name || "HiLink"} address={LOCATIONS.find(l => l.id === active)?.address || "Hoàn Kiếm"} coords={LOCATIONS.find(l => l.id === active)?.coords} minHeight={0} style={{ flex: 1, border: "none", borderRadius: 0 }} />
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>{t.mapTitle}</span>
                  <div style={{ display: "flex", gap: 14 }}>
                    {Object.entries(WORKSPACE_LINES).map(([k, v]) => (
                      <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 10, color: "var(--text-2)" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form (row 19) */}
        <section className="section-pad" style={{ background: "#363D23", padding: "80px 48px" }}>
          <div className="loc-contact" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.cEyebrow}</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 16 }}>{t.cTitle}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(248,246,241,0.7)", lineHeight: 1.7, maxWidth: 380 }}>{t.cSub}</p>
            </div>
            <div>
              <ContactForm dark formType="location_match" source="Locations page" defaultInterest="" showInterest={false} />
            </div>
          </div>
        </section>
      </div>
    </PageWrap>
  );
};

export default LocationsPage;
