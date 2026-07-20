import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import ContactForm from "../components/ContactForm.jsx";
import EnquiryBanner from "../components/EnquiryBanner.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { smartosBookUrl } from "../lib/booking.js";
import { useSeo, serviceLd, breadcrumbLd } from "../lib/seo.js";
import { WordReveal, LineReveal } from "../components/motionFx.jsx";
import { SOLUTIONS, SOLUTION_INDEX, getSolution, AMENITIES } from "../data/solutions.js";

const UI = {
  en: { overview: "Overview", enquire: "Enquire now", how: "How it works", features: "What's included", amenities: "Amenities", other: "Other solutions", explore: "Explore →", calcTitle: "Compare with a traditional lease", calcDesks: "Team size (desks)", calcTrad: "Traditional office", calcHilink: "HiLink private office", calcSave: "You save", calcNote: "Illustrative monthly estimate. Traditional assumes ~6 m²/desk at market rent plus fit-out, utilities & management; HiLink is all-inclusive.", index: "Solutions", indexSub: "Six ways to work with HiLink — from a single private office to a fully managed enterprise floor.", fName: "Full name", fCompany: "Company", fEmail: "Email", fPhone: "Phone", fMsg: "Tell us about your team", fSend: "Send enquiry", fDone: "Thank you — our team will be in touch within one business day." },
  vi: { overview: "Tổng quan", enquire: "Liên hệ ngay", how: "Cách hoạt động", features: "Bao gồm những gì", amenities: "Tiện ích", other: "Giải pháp khác", explore: "Khám phá →", calcTitle: "So sánh với thuê truyền thống", calcDesks: "Quy mô đội (số bàn)", calcTrad: "Văn phòng truyền thống", calcHilink: "Văn phòng riêng HiLink", calcSave: "Bạn tiết kiệm", calcNote: "Ước tính hàng tháng mang tính minh hoạ. Truyền thống giả định ~6 m²/bàn theo giá thị trường cộng thi công, tiện ích & quản lý; HiLink đã trọn gói.", index: "Giải pháp", indexSub: "Sáu cách làm việc cùng HiLink — từ một văn phòng riêng đến trọn tầng doanh nghiệp quản lý đầy đủ.", fName: "Họ và tên", fCompany: "Công ty", fEmail: "Email", fPhone: "Điện thoại", fMsg: "Cho chúng tôi biết về đội ngũ của bạn", fSend: "Gửi yêu cầu", fDone: "Cảm ơn — đội ngũ sẽ liên hệ trong một ngày làm việc." },
};

const inputStyle = { width: "100%", padding: "11px 13px", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2, outline: "none" };
const fmt = (n) => "₫" + Math.round(n).toLocaleString("en-US");

const Eyebrow = ({ children, style }) => (
  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 , ...style }}>{children}</p>
);
const SecTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem,2.6vw,2.1rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.15 }}>{children}</h2>
);
const EnquireLink = ({ children, dark }) => (
  <Link to="/recommend" className="btn" data-variant={dark ? "gold" : "dark"}>{children}</Link>
);

/* Private-office vs traditional-lease calculator (row 28) */
const LeaseCalculator = ({ t }) => {
  const [desks, setDesks] = useState(10);
  const tradPerDesk = 5_200_000;   // ~6 m²/desk × market rent + fit-out/utilities/mgmt
  const hilinkPerDesk = 3_600_000; // all-inclusive
  const trad = desks * tradPerDesk;
  const hilink = desks * hilinkPerDesk;
  const save = trad - hilink;
  return (
    <div style={{ background: "#1F2418", borderRadius: 6, padding: "30px 30px 26px", marginTop: 30, position: "relative", overflow: "hidden" }}>
      <span aria-hidden="true" style={{ position: "absolute", right: -16, bottom: -46, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 130, lineHeight: 1, color: "rgba(168,143,92,0.10)", pointerEvents: "none" }}>đ</span>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 18 }}>{t.calcTitle}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(248,246,241,0.75)" }}>{t.calcDesks}</label>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "var(--gold)" }}>{desks}</span>
      </div>
      <input className="hilink-range" type="range" min={2} max={50} value={desks} onChange={e => setDesks(+e.target.value)} style={{ width: "100%", marginBottom: 22 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: "16px 18px", background: "rgba(248,246,241,0.06)", borderRadius: 4 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(248,246,241,0.5)", marginBottom: 6 }}>{t.calcTrad}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 600, color: "rgba(248,246,241,0.55)", textDecoration: "line-through" }}>{fmt(trad)}</p>
        </div>
        <div style={{ padding: "16px 18px", background: "rgba(168,143,92,0.16)", border: "1px solid rgba(168,143,92,0.5)", borderRadius: 4 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--gold)", marginBottom: 6 }}>{t.calcHilink}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: "#F8F6F1" }}>{fmt(hilink)}</p>
        </div>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--gold)", fontWeight: 600, marginTop: 16 }}>{t.calcSave} ≈ {fmt(save)}/mo</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(248,246,241,0.45)", lineHeight: 1.5, marginTop: 10 }}>{t.calcNote}</p>
    </div>
  );
};

/* ── Section renderers ───────────────────────────────────────────────── */
/* Supporting photo pool — every offering gets an editorial collage: the
   primary photo plus a second frame drawn from here (rotated by index).
   Swap any path for licensed stock (e.g. Shutterstock) — drop-in. */
const POOL = ["DSC05997.jpg","DSC06008.jpg","DSC06198.jpg","Cabin 2 copy.jpg","Meeting room 4  (1).jpg","DSC05749.jpg","DSC05809.jpg"].map(n => encodeURI("/mid/" + n + ".webp"));

const Offering = ({ s, idx, lang, t }) => {
  const flip = idx % 2 === 1;
  const num = String(idx + 1).padStart(2, "0");
  const alt = POOL[idx % POOL.length] === s.img ? POOL[(idx + 1) % POOL.length] : POOL[idx % POOL.length];
  return (
    <motion.div id={s.id} className="sol-offering"
      initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(40px,5vw,84px)", alignItems: "center", padding: "88px 0", position: "relative", borderTop: idx > 0 ? "1px solid var(--border)" : "none" }}>

      {/* oversized ghost numeral anchoring the block */}
      <span aria-hidden="true" style={{ position: "absolute", top: 34, [flip ? "left" : "right"]: -10, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(110px,13vw,190px)", lineHeight: 1, color: "rgba(168,143,92,0.10)", pointerEvents: "none", userSelect: "none" }}>{num}</span>

      {/* ── Media: one clean rounded frame, gold hairline offset, quiet caption ── */}
      <div className="sol-media" style={{ order: flip ? 2 : 1, position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative" }}>
          {/* offset gold hairline frame */}
          <div aria-hidden="true" style={{ position: "absolute", inset: flip ? "-14px -14px 14px 14px" : "-14px 14px 14px -14px", border: "1px solid var(--border-gold)", borderRadius: 20, pointerEvents: "none" }} />
          <div style={{ position: "relative", aspectRatio: "4 / 4.6", overflow: "hidden", borderRadius: 16, boxShadow: "0 34px 70px -30px rgba(15,15,15,0.4)" }}>
            <img src={s.img} alt={s.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
          </div>
        </motion.div>
        {/* quiet caption under the frame, aligned to the copy side */}
        <p style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span aria-hidden="true" style={{ width: 28, height: 1, background: "var(--gold)" }} />
          {num} · {s.name}
        </p>
      </div>

      {/* ── Copy column ── */}
      <div className="sol-copy" style={{ order: flip ? 1 : 2, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "1.5rem", color: "var(--gold)", lineHeight: 1 }}>{num}</span>
          <span aria-hidden="true" style={{ width: 44, height: 1, background: "var(--gold)", opacity: 0.6 }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>{s.name}</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.9rem,3.2vw,2.7rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.1, marginBottom: 16 }}>{s.name}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 30, maxWidth: 520 }}>{s.desc[lang]}</p>

        {s.how && (
          <div style={{ marginBottom: 30 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 18 }}>{t.how}</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {s.how.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", paddingBottom: i < s.how.length - 1 ? 18 : 0, position: "relative" }}>
                  {i < s.how.length - 1 && <span style={{ position: "absolute", left: 16, top: 34, bottom: 2, width: 1, background: "var(--border-gold)" }} />}
                  <span style={{ flexShrink: 0, width: 33, height: 33, borderRadius: "50%", border: "1px solid var(--gold)", color: "var(--gold)", fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, background: "var(--bg)" }}>{i + 1}</span>
                  <div style={{ paddingTop: 4 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>{h.t[lang]}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text-3)", lineHeight: 1.6 }}>{h.d[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {s.features && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12 }}>{t.features}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {s.features[lang].map((f, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-2)", border: "1px solid var(--border-gold)", borderRadius: 999, padding: "6px 14px", background: "transparent" }}>
                  <Icon name="check" size={13} stroke="var(--gold)" />{f}
                </span>
              ))}
            </div>
          </div>
        )}

        {s.amenityKeys && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", marginBottom: 30, paddingTop: 4, borderTop: "1px solid var(--border)", paddingBottom: 2, marginTop: 4 }}>
            {s.amenityKeys.map(k => (
              <span key={k} title={AMENITIES[k].label[lang]} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                <Icon name={AMENITIES[k].icon} size={17} stroke="var(--gold)" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)" }}>{AMENITIES[k].label[lang]}</span>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <EnquireLink>{t.enquire}</EnquireLink>
          {s.find && (
            <Link to={`/locations?solution=${encodeURIComponent(s.find.solution)}`} className="tlink">{s.find.label[lang]} →</Link>
          )}
        </div>

        {s.comparison && <LeaseCalculator t={t} />}
      </div>
    </motion.div>
  );
};

const Benefits = ({ s, lang }) => (
  <div style={{ padding: "56px 0", borderBottom: "1px solid var(--border)" }}>
    <SecTitle>{s.title[lang]}</SecTitle>
    <div className="sol-benefits" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32 }}>
      {s.items.map((it, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2, padding: "24px 22px" }}>
          <Icon name={it.icon} size={26} stroke="var(--gold)" />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 400, color: "var(--text)", margin: "14px 0 8px" }}>{it.t[lang]}</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{it.d[lang]}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const FindLocations = ({ s, lang, t }) => (
  <div style={{ padding: "56px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
    <div>
      <SecTitle>{s.title[lang]}</SecTitle>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 460, marginTop: 12 }}>{s.text[lang]}</p>
    </div>
    <Link to={`/locations?solution=${encodeURIComponent(s.solution)}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", background: "var(--text)", padding: "13px 24px", textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap", transition: "background 0.18s" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.background = "var(--text)"}>
      {s.title[lang]} →
    </Link>
  </div>
);

const Packages = ({ s, lang, t }) => (
  <div style={{ padding: "56px 0", borderBottom: "1px solid var(--border)" }}>
    <SecTitle>{s.title[lang]}</SecTitle>
    <div className="sol-packages" style={{ display: "grid", gridTemplateColumns: `repeat(${s.plans.length}, 1fr)`, gap: 20, marginTop: 32, maxWidth: 760 }}>
      {s.plans.map((p, i) => (
        <div key={i} style={{ background: p.featured ? "#0F0F0F" : "#FFFFFF", border: `1px solid ${p.featured ? "#0F0F0F" : "var(--border)"}`, borderRadius: 2, padding: "26px 24px" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: p.featured ? "var(--gold)" : "var(--text-3)", marginBottom: 10 }}>{p.name}</p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", fontWeight: 400, color: p.featured ? "#FFFFFF" : "var(--text)", marginBottom: 18 }}>{p.price[lang]}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {p.features[lang].map((f, j) => (
              <span key={j} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: p.featured ? "rgba(255,255,255,0.8)" : "var(--text-2)" }}>
                <Icon name="check" size={15} stroke="var(--gold)" />{f}
              </span>
            ))}
          </div>
          <EnquireLink dark={p.featured}>{t.enquire}</EnquireLink>
        </div>
      ))}
    </div>
  </div>
);

const CaseStudy = ({ s, lang }) => (
  <div className="sol-case" style={{ padding: "56px 0", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
    <div style={{ overflow: "hidden", borderRadius: 2 }}>
      <img src={s.img} alt="Case study" style={{ width: "100%", height: "100%", maxHeight: 360, objectFit: "cover", display: "block" }} />
    </div>
    <div>
      <Eyebrow>{s.title[lang]}</Eyebrow>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem,2vw,1.7rem)", fontStyle: "italic", color: "var(--text)", lineHeight: 1.55, marginBottom: 18 }}>“{s.quote[lang]}”</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-2)" }}>{s.author[lang]}</p>
    </div>
  </div>
);

const Customers = ({ s, lang }) => (
  <div style={{ padding: "56px 0", borderBottom: "1px solid var(--border)" }}>
    <SecTitle>{s.title[lang]}</SecTitle>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 48px", marginTop: 28 }}>
      {s.logos.map((l, i) => (
        <span key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "var(--text-3)" }}>{l}</span>
      ))}
    </div>
  </div>
);

const EnquiryForm = ({ s, lang, t, solTitle, slug }) => {
  const book = smartosBookUrl({ solution: slug });
  return (
    <div id="sol-enquiry">
      <EnquiryBanner
        formType="general"
        wrap={false}
        source={`Solutions · ${solTitle || "Enquiry"}`}
        defaultInterest={solTitle}
        showLocationSelect
        title={s.title[lang]}
      />
      {/* instant-booking handoff to the white-label SmartOS platform */}
      <div style={{ background: "#101208", borderTop: "1px solid rgba(248,246,241,0.1)", padding: "18px 48px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "rgba(248,246,241,0.6)" }}>
          {lang === "vi" ? "Muốn đặt chỗ ngay? " : "Prefer to book instantly? "}
          <a href={book} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: 2 }}>
            {lang === "vi" ? "Đặt trên HiLink SmartOS" : "Book on HiLink SmartOS"} ↗
          </a>
        </p>
      </div>
    </div>
  );
};

/* ── Main page ───────────────────────────────────────────────────────── */
const SolutionPage = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  const t = UI[lang];
  const sol = getSolution(slug);

  useSeo(sol ? {
    lang,
    title: sol.title,
    description: sol.tagline?.[lang] || sol.intro?.[lang],
    image: sol.heroImg,
    jsonLd: [
      serviceLd({ title: sol.title, tagline: sol.tagline?.[lang], slug, image: sol.heroImg }),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: sol.title, path: `/solutions/${slug}` },
      ]),
    ],
  } : {});

  if (!sol) return <Navigate to="/solutions" replace />;

  let offeringIdx = 0;

  return (
    <PageWrap>
      <div>
        {/* ══ Hero — cinematic full-bleed image, grain, line-mask title ══ */}
        <section style={{ position: "relative", minHeight: "86vh", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#101208" }}>
          <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }} style={{ position: "absolute", inset: 0 }}>
            <img src={sol.heroImg} alt={sol.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </motion.div>
          {/* scrim + grain */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,13,7,0.88) 0%, rgba(12,13,7,0.35) 48%, rgba(12,13,7,0.45) 100%)" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.14,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")" }} />

          <div className="section-pad" style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1400, margin: "0 auto", padding: "140px 48px 64px" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <Link to="/solutions" style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,246,241,0.6)", textDecoration: "none" }}>Solutions</Link>
              <span aria-hidden="true" style={{ width: 40, height: 1, background: "var(--gold)", opacity: 0.7 }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>{sol.title}</span>
            </motion.div>
            <LineReveal trigger="mount" delay={0.25}
              lines={[sol.title]}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.8rem,6.6vw,5.6rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.03, letterSpacing: "-0.01em", marginBottom: 20, maxWidth: 900 }} />
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px,1.5vw,19px)", color: "rgba(248,246,241,0.82)", lineHeight: 1.7, maxWidth: 560, marginBottom: 34 }}>{sol.tagline[lang]}</motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <a href="#sol-enquiry" onClick={(e) => { e.preventDefault(); document.getElementById("sol-enquiry")?.scrollIntoView({ behavior: "smooth" }); }} className="btn" data-variant="gold">{sol.enquireLabel ? sol.enquireLabel[lang] : "Enquire"}</a>
              <a href={smartosBookUrl({ solution: slug })} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: 3 }}>
                {lang === "vi" ? "Đặt ngay" : "Book instantly"} ↗
              </a>
              <Link to="/solutions" style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(248,246,241,0.85)", textDecoration: "none", borderBottom: "1px solid rgba(248,246,241,0.5)", paddingBottom: 3 }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(248,246,241,0.85)"; e.currentTarget.style.borderColor = "rgba(248,246,241,0.5)"; }}>
                All solutions →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ Intro — olive statement band, scroll word-reveal ══ */}
        <section className="section-pad" style={{ background: "#363D23", padding: "76px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
            <WordReveal text={sol.intro[lang]} offset={["start 1.0", "start 0.5"]}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.35rem,2.3vw,2rem)", fontWeight: 400, lineHeight: 1.5, maxWidth: 760 }} />
            <a href="#sol-enquiry" onClick={(e) => { e.preventDefault(); document.getElementById("sol-enquiry")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: 4, whiteSpace: "nowrap" }}>
              {sol.enquireLabel ? sol.enquireLabel[lang] : "Enquire"} →
            </a>
          </div>
        </section>

        {/* Body sections — alternating bands so it isn't a flat white wall */}
        {sol.sections.map((s, i) => {
          let inner = null;
          let band = "#FFFFFF";
          let cls = "section-pad";
          if (s.type === "offering") {
            const even = offeringIdx % 2 === 0;
            band = even ? "#FFFFFF" : "var(--bg)";
            cls = even ? "section-pad pattern-soft-radial" : "section-pad";
            inner = <Offering key={i} s={s} idx={offeringIdx} lang={lang} t={t} />;
            offeringIdx++;
          } else if (s.type === "benefits") { band = "var(--bg)"; inner = <Benefits key={i} s={s} lang={lang} />; }
          else if (s.type === "findLocations") { band = "#FFFFFF"; inner = <FindLocations key={i} s={s} lang={lang} t={t} />; }
          else if (s.type === "packages") { band = "var(--bg)"; inner = <Packages key={i} s={s} lang={lang} t={t} />; }
          else if (s.type === "caseStudy") { band = "#FFFFFF"; inner = <CaseStudy key={i} s={s} lang={lang} />; }
          else if (s.type === "customers") { band = "var(--bg)"; inner = <Customers key={i} s={s} lang={lang} />; }
          else if (s.type === "enquiryForm") { band = "#FFFFFF"; inner = <EnquiryForm key={i} s={s} lang={lang} t={t} solTitle={sol.title} slug={slug} />; }
          if (!inner) return null;
          return (
            <section key={i} className={cls} style={{ background: band, padding: "0 48px" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>{inner}</div>
            </section>
          );
        })}

        {/* Fallback enquiry — guarantees every solution page has a form to
            scroll to (only e-office/enterprise declare one in the data). */}
        {!sol.sections.some(x => x.type === "enquiryForm") && (
          <section className="section-pad" style={{ background: "#FFFFFF", padding: "0 48px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <EnquiryForm
                s={{ title: { en: `Enquire about ${sol.title}`, vi: `Yêu cầu về ${sol.title}` } }}
                lang={lang} t={t} solTitle={sol.title} slug={slug} />
            </div>
          </section>
        )}

        {/* Other solutions */}
        <section className="section-pad" style={{ background: "var(--bg-2)", padding: "80px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Eyebrow>{t.other}</Eyebrow>
            <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${sol.other.length}, 1fr)`, gap: 18, marginTop: 22 }}>
              {sol.other.map(os => {
                const o = SOLUTIONS[os];
                return (
                  <Link key={os} to={`/solutions/${os}`} className="other-sol-card"
                    style={{ position: "relative", display: "block", textDecoration: "none", borderRadius: 4, overflow: "hidden", minHeight: 260 }}>
                    <img src={o.heroImg} alt={o.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.88) 0%, rgba(15,15,15,0.25) 60%, rgba(15,15,15,0.15) 100%)" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 22px 24px" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.15rem,1.5vw,1.4rem)", fontWeight: 400, color: "#FFFFFF", marginBottom: 10, lineHeight: 1.2 }}>{o.title}</h3>
                      <span className="other-sol-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)" }}>
                        {t.explore}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageWrap>
  );
};

/* Index grid at /solutions */
export const SolutionsIndex = () => {
  const { lang } = useLang();
  const t = UI[lang];
  useSeo({
    lang,
    title: lang === "vi" ? "Giải pháp không gian làm việc" : "Workspace Solutions",
    description: lang === "vi"
      ? "Sáu cách làm việc cùng HiLink — từ một văn phòng riêng đến cả tầng doanh nghiệp được vận hành trọn gói tại Hà Nội."
      : "Six ways to work with HiLink — from a single private office to a fully managed enterprise floor in Hanoi.",
  });
  const [active, setActive] = useState(SOLUTION_INDEX[0].slug);
  const ICONS = { "private-workspaces": "lock", "hybrid-work": "users", "e-office": "building", "corporate-suites": "layers", "specialized-suites": "chair", "enterprise": "bolt" };

  const jump = (slug) => { setActive(slug); document.getElementById(`sol-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const scrollRail = (dir) => { const el = document.getElementById("sol-rail"); if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" }); };

  return (
    <PageWrap>
      <div style={{ paddingTop: 64 }}>
        {/* Intro — editorial statement with scroll word-reveal + ghost numeral */}
        <section className="section-pad" style={{ background: "var(--bg)", padding: "72px 48px 44px", position: "relative", overflow: "hidden" }}>
          {/* decorative: giant ghost "06" + gold arcs, echoing the six solutions */}
          <span aria-hidden="true" style={{ position: "absolute", right: -8, top: -46, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(150px,22vw,320px)", lineHeight: 1, color: "rgba(168,143,92,0.09)", pointerEvents: "none", userSelect: "none" }}>06</span>
          <div aria-hidden="true" style={{ position: "absolute", left: -160, bottom: -220, width: 380, height: 380, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.22)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <Eyebrow style={{ marginBottom: 0 }}>{t.index}</Eyebrow>
              <span aria-hidden="true" style={{ flex: "0 0 64px", height: 1, background: "var(--gold)", opacity: 0.6 }} />
            </div>
            <WordReveal
              text={t.indexSub}
              accents={["HiLink"]}
              dim="color-mix(in srgb, var(--text) 17%, transparent)" lit="var(--text)"
              offset={["start 1.05", "start 0.45"]}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.3rem,4.6vw,4rem)", fontWeight: 400, lineHeight: 1.14, maxWidth: 1050, marginBottom: 8 }}
            />
          </div>
        </section>

        {/* Sticky selector rail — icons + labels, arrow scroller (picture 4) */}
        <div style={{ position: "sticky", top: 64, zIndex: 40, background: "var(--nav-bg)", backdropFilter: "blur(10px)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, padding: "0 20px" }}>
            <button onClick={() => scrollRail(-1)} aria-label="Previous" className="sol-rail-arrow" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", color: "var(--text-2)", fontSize: 20, cursor: "pointer" }}>‹</button>
            <div id="sol-rail" style={{ display: "flex", justifyContent: "space-between", gap: 8, overflowX: "auto", scrollbarWidth: "none", flex: 1 }}>
              {SOLUTION_INDEX.map(({ slug }) => {
                const o = SOLUTIONS[slug]; const on = active === slug;
                return (
                  <button key={slug} onClick={() => jump(slug)}
                    style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px 16px", background: "none", border: "none", cursor: "pointer", borderBottom: `2px solid ${on ? "var(--gold)" : "transparent"}`, transition: "border-color 0.2s" }}>
                    <Icon name={ICONS[slug] || "layers"} size={22} stroke={on ? "var(--gold)" : "var(--text-2)"} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: on ? 600 : 500, color: on ? "var(--text)" : "var(--text-2)", whiteSpace: "nowrap" }}>{o.title}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => scrollRail(1)} aria-label="Next" className="sol-rail-arrow" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", color: "var(--text-2)", fontSize: 20, cursor: "pointer" }}>›</button>
          </div>
        </div>

        {/* One section per solution */}
        {SOLUTION_INDEX.map(({ slug }, si) => {
          const o = SOLUTIONS[slug];
          return (
            <section key={slug} id={`sol-${slug}`} style={{ scrollMarginTop: 130, background: si % 2 === 0 ? "var(--bg)" : "#FFFFFF", borderBottom: "1px solid var(--border)" }}
              onMouseEnter={() => setActive(slug)}>
              <div className="sol-idx-row section-pad" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: si % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: "clamp(28px,4vw,64px)", alignItems: "center", padding: "72px 48px" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }} style={{ order: si % 2 === 0 ? 1 : 2 }}>
                  <Eyebrow>{o.title}</Eyebrow>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.12, marginBottom: 16 }}>{o.tagline[lang]}</h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 26, maxWidth: 480 }}>{o.intro && (typeof o.intro === "string" ? o.intro : o.intro[lang])}</p>
                  <Link to={`/solutions/${slug}`} className="btn" data-variant="dark">{t.explore}</Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ order: si % 2 === 0 ? 2 : 1, aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 16 }}>
                  <img src={o.heroImg} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>
    </PageWrap>
  );
};

export default SolutionPage;
