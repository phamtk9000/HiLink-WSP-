import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { useSeo, localBusinessLd, breadcrumbLd } from "../lib/seo.js";
import MapCard from "../components/MapCard.jsx";
import EnquiryBanner from "../components/EnquiryBanner.jsx";
import { getLocation, LOCATIONS, AMENITIES, WORKSPACE_LINES } from "../data/locations.js";


const enc = (p) => { try { return encodeURI(decodeURI(p)); } catch { return p; } };
// Map a service to a representative photo for the hover preview (item 8).
const SVC = {
  meeting:  enc("/mid/Meeting room 6 copy.jpg.webp"),
  desk:     enc("/mid/DSC05749.jpg.webp"),
  media:    enc("/mid/DSC06198.jpg.webp"),
  lounge:   enc("/mid/Lounge 9 copy.jpg.webp"),
  eoffice:  enc("/mid/9422f5054b4e72a0f5d2a5da96428320cc07f603-1490x2000.avif.webp"),
  office:   enc("/mid/Cabin 2 copy.jpg.webp"),
  enterprise: enc("/mid/DSC06084(1).jpg.webp"),
};
/* Units offered under each solution (drives the pic-3 style results switch) */
const unitsForSolution = (name, units = []) => {
  switch (name) {
    case "Corporate Suites":     return units.filter(u => u.area >= 62);
    case "Specialized Suites":   return units.filter(u => u.area >= 45);
    case "e-Office":             return units.filter(u => u.area <= 45);
    case "Hybrid Work":          return units.filter(u => u.seats <= 24);
    case "Enterprise Solutions": return units.filter(u => u.area >= 45);
    default:                     return units;
  }
};

/* Selector metadata for "Find your ideal workspace" (Industrious ref) */
const SVC_TAGS = {
  "Private Workspaces":   { en: "For teams",        vi: "Cho đội nhóm" },
  "Hybrid Work":          { en: "For flexibility",  vi: "Cho linh hoạt" },
  "e-Office":             { en: "For registration", vi: "Cho đăng ký KD" },
  "Corporate Suites":     { en: "For companies",    vi: "Cho doanh nghiệp" },
  "Specialized Suites":   { en: "For specialists",  vi: "Cho chuyên biệt" },
  "Enterprise Solutions": { en: "For scale",        vi: "Cho quy mô lớn" },
  default:                { en: "For teams",        vi: "Cho đội nhóm" },
};
const SVC_DESCS = {
  "Private Workspaces":   { en: "Lockable, fully furnished offices for focused teams — fitted, serviced, and move-in ready.", vi: "Văn phòng riêng có khoá, nội thất đầy đủ cho đội ngũ tập trung — đã thi công, có dịch vụ, sẵn sàng vào ở." },
  "Hybrid Work":          { en: "Flexible desks and part-time plans that scale with how your team actually works.", vi: "Bàn linh hoạt và gói bán thời gian, mở rộng theo đúng cách đội bạn làm việc." },
  "e-Office":             { en: "A prestigious registered address with mail, calls, and rooms on demand.", vi: "Địa chỉ đăng ký danh giá kèm thư tín, cuộc gọi và phòng họp theo nhu cầu." },
  "Corporate Suites":     { en: "Full-floor, branded suites for established companies — private and fully managed.", vi: "Suite nguyên tầng mang thương hiệu riêng cho công ty — riêng tư và được quản lý trọn gói." },
  "Specialized Suites":   { en: "Purpose-built spaces tailored to studios, clinics, and specialist teams.", vi: "Không gian thiết kế riêng cho studio, phòng khám và đội ngũ chuyên biệt." },
  "Enterprise Solutions": { en: "Custom build-outs, SLAs, and multi-location programmes for large organisations.", vi: "Thi công theo yêu cầu, SLA và chương trình đa địa điểm cho tổ chức lớn." },
  default:                { en: "High quality workspace on demand, equipped with amenities and professional support.", vi: "Không gian chất lượng cao theo nhu cầu, đầy đủ tiện ích và hỗ trợ chuyên nghiệp." },
};
const SVC_SLUGS = {
  "Private Workspaces": "private-workspaces", "Hybrid Work": "hybrid-work", "e-Office": "e-office",
  "Corporate Suites": "corporate-suites", "Specialized Suites": "specialized-suites", "Enterprise Solutions": "enterprise",
};

const svcImg = (s) => {
  const n = (s.name || "").toLowerCase();
  if (/meeting|board|conference/.test(n)) return SVC.meeting;
  if (/media|creative|studio/.test(n)) return SVC.media;
  if (/lounge|club/.test(n)) return SVC.lounge;
  if (/e-office|virtual/.test(n)) return SVC.eoffice;
  if (/desk|roam|hyflex|membership/.test(n)) return SVC.desk;
  if (/enterprise|floor|managed|turnkey|build/.test(n)) return SVC.enterprise;
  return SVC.office;
};

// Shared interior pool so the "view all" gallery has a full, categorised grid.
const POOL = {
  inside:    ["/mid/DSC05749.jpg.webp", "/mid/DSC05997.jpg.webp", "/mid/DSC05809.jpg.webp", "/mid/DSC06198.jpg.webp"].map(enc),
  workspaces:["/mid/Cabin 2 copy.jpg.webp", "/mid/Meeting room 4  (1).jpg.webp", "/mid/Meeting room 6 copy.jpg.webp", "/mid/Locker 1.jpg.webp"].map(enc),
};

const T = {
  en: {
    back: "All locations", scheduleCall: "Schedule a call", enquire: "Enquire",
    overview: "Overview", hours: "Hours", address: "Address", contact: "Contact",
    solutions: "Solutions at this location", units: "units", book: "Book", from: "",
    floorPlan: "Floor plan", floorSoon: "Floor plan available on request — schedule a viewing and our team will walk you through the layout.",
    amenities: "Amenities", gettingHere: "Getting here", directions: "Open in Google Maps",
    other: "Other locations", vacancies: "rooms available", moveIn: "Move-in",
    viewAll: "View all photos", photos: "Photos", close: "Close",
    availUnits: "Available units", seats: "seats", area: "Area", floorLbl: "Floor", viewUnit: "View unit", findIdeal: "Find your ideal workspace", startingFrom: "Starting from", learnMore: "Learn more", unit: "Unit",
    gFirst: "First impressions", gInside: "Step inside", gWork: "Workspaces & amenities",
  },
  vi: {
    back: "Tất cả địa điểm", scheduleCall: "Đặt lịch gọi", enquire: "Yêu cầu",
    overview: "Tổng quan", hours: "Giờ hoạt động", address: "Địa chỉ", contact: "Liên hệ",
    solutions: "Dịch vụ tại địa điểm này", units: "phòng", book: "Đặt", from: "",
    floorPlan: "Sơ đồ mặt bằng", floorSoon: "Sơ đồ mặt bằng có theo yêu cầu — đặt lịch tham quan để đội ngũ hướng dẫn bố cục.",
    amenities: "Tiện ích", gettingHere: "Đường đi", directions: "Mở trong Google Maps",
    other: "Địa điểm khác", vacancies: "phòng còn trống", moveIn: "Vào ở",
    viewAll: "Xem tất cả ảnh", photos: "Hình ảnh", close: "Đóng",
    availUnits: "Phòng còn trống", seats: "chỗ", area: "Diện tích", floorLbl: "Tầng", viewUnit: "Xem phòng", findIdeal: "Tìm không gian lý tưởng của bạn", startingFrom: "Từ", learnMore: "Tìm hiểu thêm", unit: "Phòng",
    gFirst: "Ấn tượng đầu tiên", gInside: "Bên trong", gWork: "Không gian & tiện ích",
  },
};

const Section = ({ children, bg = "var(--bg)", border = true }) => (
  <section className="section-pad" style={{ background: bg, padding: "72px 48px", borderBottom: border ? "1px solid var(--border)" : "none" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
  </section>
);

const SectionTitle = ({ children, light }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem,2.6vw,2.2rem)", fontWeight: 400, color: light ? "#FFFFFF" : "var(--text)", lineHeight: 1.15, marginBottom: 32 }}>{children}</h2>
);

const LocationDetail = () => {
  const { id } = useParams();
  const { lang } = useLang();
  const t = T[lang];
  const loc = getLocation(id);
  const [shot, setShot] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeSvc, setActiveSvc] = useState(0);

  /* Called unconditionally (rules of hooks) — tolerates a missing location. */
  useSeo(loc ? {
    lang,
    title: lang === "vi" ? `${loc.name} · Không gian làm việc` : `${loc.name} · Workspace in Hanoi`,
    description: lang === "vi"
      ? `Không gian làm việc HiLink tại ${loc.address}. Văn phòng riêng, phòng họp và chỗ ngồi linh hoạt — đặt lịch tham quan.`
      : `HiLink workspace at ${loc.address}. Private offices, meeting rooms and flexible desks — book a tour.`,
    image: loc.img,
    type: "business.business",
    jsonLd: [
      localBusinessLd(loc),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: loc.name, path: `/locations/${loc.id}` },
      ]),
    ],
  } : {});

  if (!loc) return <Navigate to="/locations" replace />;

  const line = WORKSPACE_LINES[loc.line];
  const gallery = loc.gallery && loc.gallery.length ? loc.gallery : [loc.img];
  const others = LOCATIONS.filter(l => l.id !== loc.id).slice(0, 3);

  // Categorised photo groups for the "view all" modal (ref: foraspace gallery)
  const groups = [
    { title: t.gFirst,  photos: gallery.slice(0, 2) },
    { title: t.gInside, photos: [...gallery.slice(2), ...POOL.inside] },
    { title: t.gWork,   photos: POOL.workspaces },
  ].filter(g => g.photos.length);
  const totalPhotos = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <PageWrap>
      <div style={{ paddingTop: 64 }}>

        {/* ══ SECTION 1 — Hero gallery (row 20) ════════════════════════ */}
        <section style={{ position: "relative", background: "#0F0F0F" }}>
          <div style={{ position: "relative", height: "62vh", minHeight: 440, overflow: "hidden" }}>
            <motion.img key={shot} src={gallery[shot]} alt={loc.name}
              initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.15) 45%, rgba(15,15,15,0.35) 100%)" }} />

            {/* Back link */}
            <div style={{ position: "absolute", top: 24, left: 0, right: 0 }}>
              <div className="section-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
                <Link to="/locations" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>← {t.back}</Link>
              </div>
            </div>

            {/* Name overlay + CTA */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
              <div className="section-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px", borderRadius: 2, background: "rgba(255,255,255,0.12)", border: `1px solid ${line.color}`, marginBottom: 14 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: line.color }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#FFFFFF" }}>{loc.line} · {loc.code}</span>
                  </span>
                  <h1 className="hero-shadow" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem,4.5vw,3.6rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.01em" }}>{loc.name}</h1>
                  <p className="hero-shadow" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 8 }}>{loc.address}</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
                  <a href="#loc-enquiry" onClick={(e) => { e.preventDefault(); document.getElementById("loc-enquiry")?.scrollIntoView({ behavior: "smooth" }); }} className="btn" data-variant="light">{t.scheduleCall}</a>
                  <button onClick={() => setGalleryOpen(true)} className="btn" data-variant="ghost-light">
                    <Icon name="layers" size={15} stroke="currentColor" /> {t.viewAll} · {totalPhotos}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div style={{ background: "#0F0F0F", padding: "12px 48px 18px" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, overflowX: "auto" }}>
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`}
                    style={{ flexShrink: 0, width: 96, height: 64, padding: 0, border: i === shot ? "2px solid var(--gold)" : "2px solid transparent", borderRadius: 2, overflow: "hidden", cursor: "pointer", background: "none", opacity: i === shot ? 1 : 0.6, transition: "opacity 0.15s" }}>
                    <img src={g} alt={`${loc.name} — gallery photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ══ SECTION 2 — Overview (row 21) ════════════════════════════ */}
        <Section>
          <div className="ld-overview" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.overview}</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem,2vw,1.7rem)", fontWeight: 400, fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 32 }}>{loc.intro[lang]}</p>
              {/* Signature amenity icons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 28px" }}>
                {loc.amenityKeys.slice(0, 6).map(k => (
                  <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Icon name={AMENITIES[k].icon} size={20} stroke="var(--gold)" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-2)" }}>{AMENITIES[k].label[lang]}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Info card */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2, padding: 28 }}>
              {[
                { icon: "building", label: t.address, value: loc.address },
                { icon: "clock", label: t.hours, value: loc.hours },
                { icon: "phone", label: t.contact, value: loc.phone, href: `tel:${loc.phone.replace(/\s/g, "")}` },
                { icon: "mail", label: "Email", value: loc.email, gold: true, href: `mailto:${loc.email}` },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                  <Icon name={row.icon} size={18} stroke="var(--gold)" />
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3 }}>{row.label}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: row.gold ? "var(--gold)" : "var(--text)", lineHeight: 1.5 }}>
                      {row.href ? <a href={row.href} style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid var(--border-gold)" }}>{row.value}</a> : row.value}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, display: "flex", gap: 16, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-2)" }}>
                <span><strong style={{ color: loc.vacancies > 0 ? "var(--success)" : "var(--text-3)" }}>{loc.vacancies}</strong> {t.vacancies}</span>
                <span>· {t.moveIn}: {loc.moveIn}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ══ SECTION 3 — Find your ideal workspace (Industrious reference):
               selector cards for solutions at this location + unit cards grid ══ */}
        <Section bg="#FFFFFF">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 400, color: "var(--text)", textAlign: "center", marginBottom: 32 }}>{t.findIdeal}</h2>

          {/* Selector cards */}
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 6 }}>
            <div className="ld-selector" style={{ display: "grid", gridTemplateColumns: `repeat(${loc.services.length}, 1fr)` }}>
              {loc.services.map((s, i) => {
                const on = activeSvc === i;
                return (
                  <button key={s.name} onClick={() => setActiveSvc(i)}
                    style={{ textAlign: "left", cursor: "pointer", padding: "22px 22px 24px", borderRadius: 8,
                      background: on ? "#FFFFFF" : "transparent",
                      border: on ? "1.5px solid var(--text)" : "1.5px solid transparent",
                      borderRight: on ? "1.5px solid var(--text)" : (i < loc.services.length - 1 ? "1px solid var(--border)" : "1.5px solid transparent"),
                      boxShadow: on ? "0 10px 30px -18px rgba(15,15,15,0.4)" : "none", transition: "all 0.18s" }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.05rem,1.5vw,1.35rem)", fontWeight: 400, color: "var(--text)", marginBottom: 10 }}>{s.name}</p>
                    <span style={{ display: "inline-block", fontFamily: "'Inter', sans-serif", fontSize: 11.5, padding: "4px 10px", borderRadius: 999, marginBottom: 12,
                      background: on ? "rgba(168,143,92,0.16)" : "rgba(15,15,15,0.05)", color: on ? "var(--gold)" : "var(--text-3)" }}>
                      {(SVC_TAGS[s.name] || SVC_TAGS.default)[lang]}
                    </span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-2)" }}>
                      {t.startingFrom} <span style={{ fontWeight: 600, color: "var(--text)" }}>{s.price[lang]}</span>
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected solution description + link to its detail page */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--text-2)", textAlign: "center", maxWidth: 720, margin: "26px auto 0", lineHeight: 1.65 }}>
            {(SVC_DESCS[loc.services[activeSvc].name] || SVC_DESCS.default)[lang]}{" "}
            <Link to={`/solutions/${SVC_SLUGS[loc.services[activeSvc].name] || "private-workspaces"}`}
              style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid var(--border-gold)", paddingBottom: 1, whiteSpace: "nowrap" }}>
              {t.learnMore} →
            </Link>
          </p>

          {/* Unit cards grid (picture-2 card style) */}
          {loc.units && loc.units.length > 0 && (
            <motion.div key={activeSvc} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="ld-unit-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 40 }}>
              {unitsForSolution(loc.services[activeSvc].name, loc.units).map((u) => (
                <Link key={u.id} to={`/locations/${loc.id}/units/${u.id}`} className="unit-card" style={{ textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}>
                  <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--bg-2)" }}>
                    <img src={u.img} alt={`Unit ${u.number}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <span style={{ position: "absolute", left: 10, bottom: 10, background: "var(--surface)", color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 4, boxShadow: "0 4px 14px -6px rgba(15,15,15,0.4)" }}>{u.price[lang]}</span>
                  </div>
                  <div style={{ padding: "16px 16px 18px" }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", color: "var(--text)", marginBottom: 8 }}>{t.unit} {u.number}</p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text-2)", marginBottom: 10 }}>
                      <Icon name="users" size={15} stroke="var(--text-3)" />{u.seats} {t.seats}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
                      {[
                        { icon: "building", label: `${t.floorLbl} ${u.floor}` },
                        { icon: "layers", label: `${u.area} m²` },
                        { icon: "clock", label: u.status[lang] },
                      ].map((m, j) => (
                        <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)" }}>
                          <Icon name={m.icon} size={13} stroke="var(--text-3)" />{m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </Section>

        {/* ══ SECTION 4 — Floor plan (row 23) ══════════════════════════ */}
        <Section>
          <SectionTitle>{t.floorPlan}</SectionTitle>
          {loc.floorPlan ? (
            <div style={{ border: "1px solid var(--border)", borderRadius: 2, overflow: "hidden", background: "var(--surface)", padding: 16 }}>
              <img src={loc.floorPlan} alt={`${loc.name} floor plan`} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          ) : (
            <div style={{ border: "1px dashed var(--border)", borderRadius: 2, padding: "48px 32px", textAlign: "center", background: "var(--surface)" }}>
              <Icon name="layers" size={28} stroke="var(--text-3)" />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-3)", lineHeight: 1.6, maxWidth: 460, margin: "16px auto 0" }}>{t.floorSoon}</p>
            </div>
          )}
        </Section>

        {/* ══ SECTION 5 — Amenities icons (row 24) ═════════════════════ */}
        <Section bg="#FFFFFF">
          <SectionTitle>{t.amenities}</SectionTitle>
          <div className="ld-amenities" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
            {loc.amenityKeys.map(k => (
              <div key={k} style={{ background: "var(--surface)", padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                <Icon name={AMENITIES[k].icon} size={26} stroke="var(--gold)" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-2)", lineHeight: 1.4 }}>{AMENITIES[k].label[lang]}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ SECTION 6 — Map + travel links (row 25) ══════════════════ */}
        <Section>
          <SectionTitle>{t.gettingHere}</SectionTitle>
          <div className="ld-map" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "stretch" }}>
            <MapCard name={loc.name} address={loc.address} coords={loc.coords} />
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 22 }}>{loc.address}</p>
              <div style={{ border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 24 }}>
                {loc.directions.map((d, i) => {
                  const icon = d.mode === "Walk" ? "users" : d.mode === "Bus" ? "building" : d.mode === "Drive" ? "key" : "clock";
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderBottom: i < loc.directions.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface)" }}>
                      <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "rgba(168,143,92,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name={icon} size={18} stroke="var(--gold)" />
                      </span>
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 2 }}>{d.mode}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text)" }}>{d.text[lang]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn" data-variant="ghost">
                <Icon name="building" size={15} stroke="currentColor" /> {t.directions} →
              </a>
            </div>
          </div>
        </Section>

        {/* Enquiry — location pre-saved on the lead */}
        <div id="loc-enquiry">
          <EnquiryBanner formType="location" source={`Location · ${loc.name}`} defaultInterest="Private Workspaces" location={`${loc.name} · ${loc.address}`} image={loc.img} phone={loc.phone} />
        </div>

        {/* Other locations — large cards, arrow scroller */}
        <Section bg="var(--bg-2)" border={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <SectionTitle>{t.other}</SectionTitle>
            <div style={{ display: "flex", gap: 10 }}>
              {["←", "→"].map((ar, ai) => (
                <button key={ai} onClick={() => { const el = document.getElementById("other-loc-track"); if (el) el.scrollBy({ left: (ai === 0 ? -1 : 1) * (el.clientWidth * 0.8), behavior: "smooth" }); }}
                  aria-label={ai === 0 ? "Previous" : "Next"}
                  style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--text)", background: "transparent", color: "var(--text)", fontSize: 18, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}>
                  {ar}
                </button>
              ))}
            </div>
          </div>
          <div id="other-loc-track" style={{ display: "flex", gap: 24, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 8, scrollbarWidth: "none" }}>
            {others.map(o => (
              <Link key={o.id} to={`/locations/${o.id}`} className="hover-lift"
                style={{ flexShrink: 0, width: "min(480px, 82vw)", scrollSnapAlign: "start", textDecoration: "none", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--surface)", display: "block" }}>
                <div style={{ aspectRatio: "16 / 10", overflow: "hidden" }}>
                  <img src={o.img} alt={o.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>{o.name}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-3)" }}>{o.code} · {o.district}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

      </div>

      {/* ── Categorised "view all photos" gallery — white bg, masonry ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "var(--surface)", overflowY: "auto" }}>
            <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "var(--text)" }}>{loc.name}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)" }}>{totalPhotos} {t.photos.toLowerCase()}</p>
              </div>
              <button onClick={() => setGalleryOpen(false)} className="btn" data-variant="ghost">✕ {t.close}</button>
            </div>

            {/* Vertical section rail — right side */}
            <div className="gal-rail hide-mob" style={{ position: "fixed", right: 40, top: "50%", transform: "translateY(-50%)", zIndex: 4, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
              {groups.map((g, gi) => (
                <button key={gi} onClick={() => document.getElementById(`gal-sec-${gi}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="gal-rail-item"
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", padding: 0, transition: "color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; }}>
                  <span style={{ textAlign: "right" }}>{g.title}</span>
                  <span style={{ width: 22, height: 1, background: "currentColor", display: "inline-block" }} />
                </button>
              ))}
            </div>

            <div style={{ maxWidth: 1160, margin: "0 auto", padding: "44px 48px 90px" }}>
              {groups.map((g, gi) => (
                <div key={gi} id={`gal-sec-${gi}`} style={{ scrollMarginTop: 90, marginBottom: 56 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem,2.4vw,2rem)", fontWeight: 400, color: "var(--text)", marginBottom: 22 }}>{g.title}</h3>
                  {/* Masonry: images keep their natural aspect ratio */}
                  <div className="gallery-masonry" style={{ columnCount: 3, columnGap: 14 }}>
                    {g.photos.map((p, pi) => (
                      <motion.img key={pi} src={p} alt={`${g.title} — ${loc.name}, HiLink Hanoi`} loading="lazy"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: pi * 0.03 }}
                        style={{ width: "100%", height: "auto", display: "block", borderRadius: 4, marginBottom: 14, breakInside: "avoid" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
};

export default LocationDetail;
