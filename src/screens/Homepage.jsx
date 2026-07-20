import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Avatar } from "../components/index.jsx";
import EnquiryBanner from "../components/EnquiryBanner.jsx";
import { LOCATIONS, DISTRICTS } from "../data/locations.js";
import { FilterSelect } from "./LocationsPage.jsx";
import { ARTICLES } from "../data/mockData.js";
import { useLang } from "../context/LanguageContext.jsx";
import { useSeo } from "../lib/seo.js";
import { TESTIMONIALS } from "../data/mockData.js";
import { rs, SIZES } from "../lib/img.js";

/* Image path normalizer — handles spaces/parentheses in filenames */
const img = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|blob:)/.test(p)) return p;
  let s = p.replace(/^public\//, "");
  if (!s.startsWith("/")) s = "/" + s;
  try { return encodeURI(decodeURI(s)); } catch { return s; }
};

/* ── HERO carousel slides (row 5: full-screen, rotating) ─────────────── */
const HERO_SLIDES = [
  img("/mid/BG_HOME.jpg.webp"),
  img("/mid/DSC06084(1).jpg.webp"),
  img("/mid/Lounge 9 copy.jpg.webp"),
  img("/mid/Meeting room 6 copy.jpg.webp"),
];

/* ── Hero search filters (row 6) ─────────────────────────────────────── */
const CITY_OPTIONS = ["Hanoi"];
const SOLUTION_OPTIONS = [
  "Private Workspaces", "Hybrid Work", "e-Office",
  "Corporate Suites", "Specialized Suites", "Enterprise Solutions",
];

/* ── Section 1: Solutions (rows 8–10) ───────────────────────────────── */
const SOLUTIONS = [
  { code: "Private Workspaces", points: { en: ["Lockable offices for 2–50 people", "Fitted, furnished & move-in ready", "All-inclusive monthly pricing"], vi: ["Văn phòng có khoá cho 2–50 người", "Đã thi công, nội thất, vào ở ngay", "Giá trọn gói hàng tháng"] }, to: "/solutions/private-workspaces",   img: img("/mid/Cabin 2 copy.jpg.webp"),
    desc: { en: "Lockable offices for 2–50 people, fully furnished.", vi: "Văn phòng riêng 2–50 người, đầy đủ nội thất." } },
  { code: "Meeting Rooms", points: { en: ["Boardrooms & huddle spaces by the hour", "Pro A/V, whiteboards & catering", "Bookable on demand"], vi: ["Phòng họp lớn nhỏ theo giờ", "A/V chuyên nghiệp, bảng & catering", "Đặt theo nhu cầu"] },      to: "/solutions/corporate-suites", img: img("/mid/Meeting room 6 copy.jpg.webp"),
    desc: { en: "Boardrooms & collaboration spaces, by the hour.", vi: "Phòng họp & không gian cộng tác, theo giờ." } },
  { code: "HyFlex Memberships", points: { en: ["One pass, every HiLink floor", "Lounges, cafés & focus zones", "Scale seats up or down monthly"], vi: ["Một thẻ, mọi tầng HiLink", "Lounge, café & khu tập trung", "Tăng giảm chỗ theo tháng"] }, to: "/solutions/hybrid-work",     img: img("/mid/DSC05749.jpg.webp"),
    desc: { en: "Roam across every HiLink floor on one pass.", vi: "Linh hoạt tại mọi tầng HiLink với một thẻ." } },
  { code: "e-Office", points: { en: ["Prestigious registered address", "Mail, calls & reception in your name", "Meeting-room credits included"], vi: ["Địa chỉ đăng ký danh giá", "Thư, cuộc gọi & lễ tân theo tên bạn", "Kèm tín dụng phòng họp"] },           to: "/solutions/e-office",  img: img("/mid/9422f5054b4e72a0f5d2a5da96428320cc07f603-1490x2000.avif.webp"),
    desc: { en: "Premium business address, mail & call handling.", vi: "Địa chỉ doanh nghiệp cao cấp, nhận thư & cuộc gọi." } },
];

const SOLUTION_BANNERS = [
  { code: "Enterprise Solutions", to: "/solutions/enterprise", img: img("/mid/DSC06155(1).jpg.webp"),
    desc: { en: "Build-to-suit, turnkey & dedicated managed offices for scaling teams.",
            vi: "Build-to-suit, turnkey & văn phòng quản lý chuyên biệt cho đội ngũ mở rộng." } },
  { code: "Workspace Partnership Program", to: "/partnerships", img: img("/mid/DSC06084(1).jpg.webp"),
    desc: { en: "For landlords, brokers & developers — partner with HiLink.",
            vi: "Dành cho chủ nhà, môi giới & nhà phát triển — hợp tác cùng HiLink." } },
];

/* ── Section 2: Featured Workspaces (row 11) ─────────────────────────── *
 * Codes are from the client brief. Addresses confirmed where known
 * (OBC = 60 Lý Thái Tổ from asset); others are best-mapped to the sitemap
 * and should be verified before launch. */
/* Count-up numeral: animates 0 → target when scrolled into view */
const CountUp = ({ to, suffix = "", duration = 1.6 }) => {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const start = () => {
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  return (
    <motion.span onViewportEnter={start} viewport={{ once: true }}>
      {val.toLocaleString("en-US")}{suffix}
    </motion.span>
  );
};

/* ── Featured-workspaces marquee row (Knotel reference):
      drifts slowly, pauses on hover, cards link to the location. ── */
const MarqueeRow = ({ items, lang, viewLabel, reverse = false }) => {
  const doubled = [...items, ...items];
  return (
    <div className="marq-row" style={{ marginTop: reverse ? 20 : 0 }}>
      <div className={`marq-track${reverse ? " rev" : ""}`}>
        {doubled.map((l, i) => (
          <Link key={`${l.id}-${i}`} to={`/locations/${l.id}`} className="marq-card"
            style={{ position: "relative", flexShrink: 0, width: "clamp(300px, 32vw, 460px)", aspectRatio: "16 / 10", borderRadius: 4, overflow: "hidden", textDecoration: "none", display: "block" }}>
            <img {...rs(l.img, SIZES.card)} alt={l.name} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="marq-shade" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.75) 0%, rgba(15,15,15,0.15) 55%, rgba(15,15,15,0.05) 100%)", transition: "background 0.3s" }} />
            <div style={{ position: "absolute", left: 22, bottom: 20, right: 22 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>{l.district}</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem,2vw,1.7rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 14 }}>{l.name}</p>
              <span className="marq-view" style={{ display: "inline-block", padding: "10px 18px", border: "1px solid rgba(255,255,255,0.85)", color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0, transform: "translateY(6px)", transition: "opacity 0.25s, transform 0.25s" }}>{viewLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const FEATURED = [
  { code: "CNC15", name: { en: "Central Tower · Floor 15", vi: "Central Tower · Tầng 15" }, address: "4 Tôn Thất Tùng, Đống Đa", img: img("/mid/DSC05955(1).jpg.webp") },
  { code: "PP83",  name: { en: "83 Lý Thường Kiệt",        vi: "83 Lý Thường Kiệt" },        address: "83 Lý Thường Kiệt, Hoàn Kiếm", img: img("/mid/DSC06008.jpg.webp") },
  { code: "OBC",   name: { en: "60 Lý Thái Tổ",            vi: "60 Lý Thái Tổ" },            address: "60 Lý Thái Tổ, Hoàn Kiếm",     img: img("/mid/DSC05831(1).jpg.webp") },
  { code: "NQ49",  name: { en: "49 Ngô Quyền",             vi: "49 Ngô Quyền" },             address: "49 Ngô Quyền, Hoàn Kiếm",      img: img("/mid/L1001039.jpg.webp") },
];

/* ── Section 3: HiLink Business Club (row 12) ────────────────────────── */
const CLUB_SERVICES = [
  { en: { t: "Business Club Lounges", d: "As a member of our prestigious club, you enter a realm of refined elegance and exceptional service." }, vi: { t: "Phòng chờ Business Club", d: "Là thành viên câu lạc bộ danh giá, bạn bước vào không gian sang trọng và dịch vụ đẳng cấp." } },
  { en: { t: "Networking opportunities", d: "Mingle with a select group of industry leaders, influencers and visionaries." }, vi: { t: "Cơ hội kết nối", d: "Giao lưu cùng nhóm chọn lọc gồm lãnh đạo, người ảnh hưởng và nhà tiên phong." } },
  { en: { t: "Concierge & Lifestyle", d: "Enjoy an array of bespoke services and privileges tailored to your every need." }, vi: { t: "Concierge & Phong cách sống", d: "Tận hưởng loạt dịch vụ và đặc quyền thiết kế riêng cho mọi nhu cầu của bạn." } },
  { en: { t: "Global reciprocal Clubs", d: "Beyond our club, access a global network of partner clubs." }, vi: { t: "Câu lạc bộ đối tác toàn cầu", d: "Vượt ra ngoài câu lạc bộ, tiếp cận mạng lưới đối tác toàn cầu." } },
  { en: { t: "Business Support Services", d: "A comprehensive network of business support provided by trusted partners." }, vi: { t: "Dịch vụ hỗ trợ doanh nghiệp", d: "Mạng lưới hỗ trợ doanh nghiệp toàn diện từ các đối tác tin cậy." } },
  { en: { t: "Research", d: "Legal, Accounting, HR, Finance, Marketing, and many other business services." }, vi: { t: "Nghiên cứu", d: "Pháp lý, Kế toán, Nhân sự, Tài chính, Marketing và nhiều dịch vụ khác." } },
];

const CLUB_TIERS = [
  /* Actual HiLink Business Club artwork (public/business-club) — Club uses
     the personalised sample so visitors see a real, issued card. */
  { name: "Club",      front: "/business-club/sample-front.webp",    back: "/business-club/sample-back.webp" },
  { name: "Premier",   front: "/business-club/premier-front.webp",   back: "/business-club/premier-back.webp" },
  { name: "Executive", front: "/business-club/executive-front.webp", back: "/business-club/executive-back.webp" },
];

const CLUB_LOCATIONS = [
  { code: "OBC", name: "60 Lý Thái Tổ", img: img("/mid/Lounge 2 copy.jpg.webp") },
  { code: "HHH", name: "Hoàn Kiếm Club Lounge", img: img("/mid/Lounge 9 copy.jpg.webp") },
];

/* ── i18n strings ────────────────────────────────────────────────────── */
const T = {
  en: {
    heroEyebrow: "Premium Workspaces · Hanoi, Vietnam",
    heroTitleA: "Workspaces to make your everyday",
    heroTitleEm: "extraordinary.",
    heroSub: "Premium flexible workspaces for startups, SMEs, and global enterprises in the heart of Hanoi.",
    searchCity: "Area", searchSolution: "Solution", searchAny: "All", searchBtn: "Search",
    heroCta: "Let us find your next workspace",
    solEyebrow: "What we do", solTitle: "Solutions for every way of working", solExplore: "Explore →",
    featEyebrow: "Locations", featTitle: "Featured workspaces", featView: "View location →", featAll: "All locations →", viewOffice: "View office",
    clubEyebrow: "Members only", clubTitle: "HiLink Business Club", clubSub: "An exclusive club for members — premium lounges, events, and a community of Hanoi's leaders.", clubCta: "Enquire about membership →",
    testiEyebrow: "Social proof", testiTitle: "Trusted by leaders",
    membersEyebrow: "Our members", membersTitle: "Companies that call HiLink home",
    contactEyebrow: "Get in touch", contactTitle: "Let's find your space", contactSub: "Tell us what you need and our team will be in touch within one business day.",
    fName: "Full name", fCompany: "Company", fEmail: "Email", fPhone: "Phone", fInterest: "I'm interested in", fMessage: "Message", fSend: "Send enquiry", fSentTitle: "Thank you", fSentBody: "We've received your enquiry — our team will reach out shortly.", fAnother: "Send another enquiry",
  },
  vi: {
    heroEyebrow: "Không gian làm việc cao cấp · Hà Nội",
    heroTitleA: "Không gian làm việc cho mỗi ngày thêm",
    heroTitleEm: "phi thường.",
    heroSub: "Không gian làm việc linh hoạt cao cấp cho startup, SME và doanh nghiệp quốc tế tại trung tâm Hà Nội.",
    searchCity: "Khu vực", searchSolution: "Dịch vụ", searchAny: "Tất cả", searchBtn: "Tìm kiếm",
    heroCta: "Để chúng tôi tìm không gian cho bạn",
    solEyebrow: "Dịch vụ", solTitle: "Giải pháp cho mọi cách làm việc", solExplore: "Khám phá →",
    featEyebrow: "Địa điểm", featTitle: "Không gian nổi bật", featView: "Xem địa điểm →", featAll: "Tất cả địa điểm →", viewOffice: "Xem văn phòng",
    clubEyebrow: "Thành viên", clubTitle: "HiLink Business Club", clubSub: "Câu lạc bộ độc quyền cho thành viên — phòng chờ cao cấp, sự kiện và cộng đồng lãnh đạo Hà Nội.", clubCta: "Tìm hiểu hội viên →",
    testiEyebrow: "Đánh giá", testiTitle: "Được tin chọn bởi các nhà lãnh đạo",
    membersEyebrow: "Thành viên", membersTitle: "Những doanh nghiệp chọn HiLink",
    contactEyebrow: "Liên hệ", contactTitle: "Cùng tìm không gian của bạn", contactSub: "Cho chúng tôi biết nhu cầu của bạn — đội ngũ sẽ liên hệ trong vòng một ngày làm việc.",
    fName: "Họ và tên", fCompany: "Công ty", fEmail: "Email", fPhone: "Điện thoại", fInterest: "Tôi quan tâm đến", fMessage: "Lời nhắn", fSend: "Gửi yêu cầu", fSentTitle: "Cảm ơn bạn", fSentBody: "Chúng tôi đã nhận được yêu cầu — đội ngũ sẽ liên hệ sớm.", fAnother: "Gửi yêu cầu khác",
  },
};

/* ── Reusable bits ───────────────────────────────────────────────────── */
const Eyebrow = ({ children, light }) => (
  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: light ? "var(--gold)" : "var(--gold)", marginBottom: 14 }}>{children}</p>
);

const H2 = ({ children, light }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: light ? "#FFFFFF" : "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>{children}</h2>
);

const textLink = {
  display: "inline-flex", alignItems: "center", gap: 8,
  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
  letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)",
  textDecoration: "none", borderBottom: "1px solid var(--text)", paddingBottom: 2,
  transition: "color 0.2s, border-color 0.2s",
};

const inputStyle = {
  width: "100%", padding: "12px 14px", fontFamily: "'Inter', sans-serif", fontSize: 14,
  color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: 2, outline: "none", transition: "border-color 0.15s",
};

const Homepage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];

  useSeo({
    lang,
    title: lang === "vi" ? "Không gian làm việc cao cấp tại Hà Nội" : "Premium Coworking & Serviced Offices in Hanoi",
    description: lang === "vi"
      ? "Không gian làm việc linh hoạt cao cấp giữa trung tâm Hà Nội — văn phòng riêng, coworking, phòng họp và văn phòng ảo tại bảy địa điểm giàu bản sắc."
      : "Premium flexible workspaces in central Hanoi — private offices, coworking, meeting rooms and virtual offices across seven characterful locations.",
  });

  /* Hero carousel */
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  /* Hero search */
  const [district, setDistrict] = useState("");
  const [solution, setSolution] = useState("");
  const doSearch = () => {
    const p = new URLSearchParams();
    if (district) p.set("district", district);
    if (solution) p.set("solution", solution);
    const qs = p.toString();
    navigate(`/locations${qs ? "?" + qs : ""}`);
  };

  /* Contact form handled by shared <ContactForm /> (Section 6) */

  return (
    <PageWrap>
      {/* ══ HERO (rows 5–7): full-screen carousel · white text · search · CTA ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: "#0F0F0F" }}>
        {/* Rotating slides (clipped here so dropdown panels can escape the hero) */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <AnimatePresence>
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, ease: "linear" } }}
            style={{ position: "absolute", inset: 0, backgroundImage: `url("${HERO_SLIDES[slide]}")`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        </AnimatePresence>
        {/* Legibility overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.82) 0%, rgba(15,15,15,0.45) 45%, rgba(15,15,15,0.55) 100%)" }} />
        </div>

        {/* Hero content */}
        <div className="section-pad" style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "120px 48px 80px", width: "100%", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 26 }}>{t.heroEyebrow}</p>
            <h1 className="hero-shadow" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.6rem, 6vw, 5.2rem)", fontWeight: 400, lineHeight: 1.06, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 28, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
              {t.heroTitleA} <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{t.heroTitleEm}</em>
            </h1>
            <p className="hero-shadow" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px,1.4vw,18px)", color: "rgba(255,255,255,0.92)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 40px" }}>{t.heroSub}</p>
          </motion.div>

          {/* Search bar — city (left) · solution (right) · search (row 6) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="hero-search"
            style={{ display: "flex", alignItems: "stretch", gap: 12, maxWidth: 780, margin: "0 auto 24px", position: "relative", zIndex: 200 }}
          >
            <div style={{ flex: 1, textAlign: "left" }}>
              <FilterSelect label={t.searchCity} value={district} onChange={setDistrict} options={["Hoàn Kiếm", "Kim Liên", "Cửa Nam"]} anyLabel={t.searchAny} groupLabel="Hanoi" />
            </div>
            <div style={{ flex: 1.4, textAlign: "left" }}>
              <FilterSelect label={t.searchSolution} value={solution} onChange={setSolution} options={SOLUTION_OPTIONS} anyLabel={t.searchAny} />
            </div>
            <button onClick={doSearch} className="btn" data-variant="gold" style={{ flexShrink: 0, borderRadius: 8, padding: "0 34px", boxShadow: "0 18px 44px -18px rgba(0,0,0,0.55)" }}>
              {t.searchBtn}
            </button>
          </motion.div>

          {/* "Let us find your next workspace" → contact form (row 7) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.35 }}>
            <Link to="/recommend" className="tlink tlink-light">
              {t.heroCta} →
            </Link>
          </motion.div>
        </div>

        {/* Slide indicators — bottom right, out of the way of the search/CTA */}
        <div style={{ position: "absolute", bottom: 32, right: 48, zIndex: 3, display: "flex", gap: 10 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
              style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === slide ? "var(--gold)" : "rgba(255,255,255,0.5)", transition: "all 0.3s" }} />
          ))}
        </div>
      </section>

      {/* ══ SECTION 1 — Solutions (rows 8–10) ════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--bg)", padding: "96px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <Eyebrow>{t.solEyebrow}</Eyebrow>
            <H2>{t.solTitle}</H2>
          </div>

          {/* 4 primary solution tiles — bold full-image cards */}
          <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {SOLUTIONS.map((s, i) => (
              <motion.div key={s.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                onClick={() => navigate(s.to)} className="sol-tile"
                style={{ position: "relative", minHeight: 440, borderRadius: 6, overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "flex-end" }}>
                <img {...rs(s.img, SIZES.card)} alt={s.code} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.9) 0%, rgba(15,15,15,0.35) 55%, rgba(15,15,15,0.08) 100%)", transition: "background 0.3s" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "var(--gold)", transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.35s ease" }} className="sol-tile-bar" />
                <div style={{ position: "relative", padding: "24px 24px 26px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.25rem,1.7vw,1.55rem)", fontWeight: 400, color: "#FFFFFF", marginBottom: 8, lineHeight: 1.15 }}>{s.code}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 14, maxWidth: 480 }}>{s.desc[lang]}</p>
                  {s.points && (
                    <div style={{ display: "grid", gap: 7 }}>
                      {s.points[lang].map((p, pi) => (
                        <span key={pi} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                          <span style={{ color: "var(--gold)", fontSize: 12 }}>✓</span>{p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enterprise + Partnership — Fora-style dual band (picture 1) */}
          <div style={{ marginTop: 28, borderRadius: 16, overflow: "hidden" }}>
            <div className="banner-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {SOLUTION_BANNERS.map((b, i) => (
                <motion.div key={b.code} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                  onClick={() => navigate(b.to)} className="duo-half"
                  style={{ position: "relative", minHeight: 520, overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "flex-end" }}>
                  <img {...rs(b.img, SIZES.half)} alt={b.code} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 1s cubic-bezier(0.22,1,0.36,1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.7) 0%, rgba(15,15,15,0.2) 45%, rgba(15,15,15,0.12) 100%)" }} />
                  <div style={{ position: "relative", padding: "0 40px 44px" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem,2.4vw,2.1rem)", fontWeight: 400, color: "#FFFFFF", marginBottom: 14, lineHeight: 1.15 }}>{b.code}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", lineHeight: 1.65, maxWidth: 440, marginBottom: 22 }}>{b.desc[lang]}</p>
                    <span className="duo-link" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#FFFFFF" }}>
                      {b.link ? b.link[lang] : (lang === "en" ? "Find out more" : "Tìm hiểu thêm")} <span style={{ transition: "transform 0.25s" }} className="duo-arrow">→</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — Featured Workspaces: dual-direction marquee ═════ */}
      <section className="section-pad" style={{ background: "var(--surface)", padding: "96px 0 88px", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>{t.featEyebrow}</Eyebrow>
              <H2>{t.featTitle}</H2>
            </div>
            <Link to="/locations" style={textLink}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}>
              {t.featAll}
            </Link>
          </div>
        </div>

        {/* Row 1 — drifts right → left */}
        <MarqueeRow items={LOCATIONS} lang={lang} viewLabel={t.viewOffice} />
        {/* Row 2 — opposite direction, offset start */}
        <MarqueeRow items={[...LOCATIONS.slice(3), ...LOCATIONS.slice(0, 3)]} lang={lang} viewLabel={t.viewOffice} reverse />
      </section>

      {/* ══ SECTION 3 — HiLink Business Club: services + membership cards ═ */}
      <section className="section-pad" style={{ background: "#0F0F0F", padding: "104px 48px 96px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Eyebrow>{lang === "en" ? "Business Club" : "Câu lạc bộ Doanh nhân"}</Eyebrow>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.1, marginBottom: 56, maxWidth: 720 }}>
            {lang === "en" ? "Business support services, exclusively for our members" : "Dịch vụ hỗ trợ doanh nghiệp, dành riêng cho thành viên"}
          </h2>

          {/* Six numbered services */}
          <div className="club-svc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 72px", marginBottom: 88 }}>
            {CLUB_SERVICES.map((sv, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.1 }}
                style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "start" }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "2.4rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1, paddingTop: 2 }}>{i + 1}</span>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem,2vw,1.7rem)", fontWeight: 400, color: "#F8F6F1", marginBottom: 12 }}>{sv[lang].t}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "rgba(248,246,241,0.72)", lineHeight: 1.7, maxWidth: 420 }}>{sv[lang].d}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Membership tiers — flip cards (hover to reveal back) */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow>{lang === "en" ? "Membership tiers" : "Hạng thành viên"}</Eyebrow>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(248,246,241,0.55)" }}>{lang === "en" ? "Hover a card to see the details" : "Di chuột vào thẻ để xem chi tiết"}</p>
          </div>
          <div className="club-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 52 }}>
            {CLUB_TIERS.map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="club-flip" style={{ perspective: 1400 }}>
                <div className="club-flip-inner" style={{ position: "relative", width: "100%", aspectRatio: "1.586 / 1", transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)", transformStyle: "preserve-3d" }}>
                  <img src={tier.front} alt={`${tier.name} card`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", backfaceVisibility: "hidden", borderRadius: 16, boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)" }} />
                  <img src={tier.back} alt={`${tier.name} card back`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 16, boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)" }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA → HiLink main website */}
          <div style={{ textAlign: "center" }}>
            <a href="https://hilink.vn" target="_blank" rel="noopener noreferrer" className="btn" data-variant="light">
              {lang === "en" ? "Explore the Business Club" : "Khám phá Business Club"} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — Testimonials (row 13) ════════════════════════════ */}
      <section className="pattern-soft-radial section-pad" style={{ background: "var(--surface)", padding: "96px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Eyebrow>{t.testiEyebrow}</Eyebrow>
          <H2>{t.testiTitle}</H2>
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 56 }}>
            {TESTIMONIALS.map((tt, i) => (
              <motion.div key={tt.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                style={{ padding: i > 0 ? "0 40px" : "0 40px 0 0", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.75, marginBottom: 32 }}>“{tt.text}”</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials={tt.avatar} size={38} gold />
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>{tt.name}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-3)", margin: 0 }}>{tt.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — Our Members (row 14) ═════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--bg-2)", padding: "72px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", textAlign: "center", marginBottom: 8 }}>{t.membersEyebrow}</p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.4rem,2.4vw,1.9rem)", fontWeight: 400, color: "var(--text)", textAlign: "center", marginBottom: 40 }}>{t.membersTitle}</p>
          <div style={{ position: "relative", overflow: "hidden", maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
            <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", gap: 0 }}>
              {[0, 1].map(copy => (
                <span key={copy} style={{ display: "inline-flex", gap: 0 }}>
                  {["NovaTech", "Studio LFA", "Seoul Tech", "BlueOcean", "Indochina Capital", "Acme", "Hằng Studio", "Linh & Co", "Bảo Logistics", "NovaTech", "Studio LFA"].map((name, i) => (
                    <span key={name + i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1rem,1.5vw,1.3rem)", fontWeight: 400, color: "var(--text-3)", paddingRight: 72, letterSpacing: "0.01em", display: "inline-block" }}>{name}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5b — From the Forum (SEO: internal article links) ═══ */}
      <section className="section-pad" style={{ background: "var(--bg)", padding: "96px 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>{lang === "en" ? "The Forum" : "Diễn đàn"}</Eyebrow>
              <H2>{lang === "en" ? "Insights on the future of work" : "Góc nhìn về tương lai công việc"}</H2>
            </div>
            <Link to="/forum" style={textLink}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}>
              {lang === "en" ? "Visit the Forum" : "Xem Diễn đàn"}
            </Link>
          </div>
          <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {ARTICLES.slice(0, 3).map((a, i) => (
              <motion.article key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}>
                <Link to={`/forum/${a.slug}`} className="hover-lift" style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16 }}>
                    <img src={a.image} alt={a.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>{a.category} · {a.readTime}</p>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontWeight: 400, color: "var(--text)", lineHeight: 1.3, marginBottom: 10 }}>{a.title}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{a.excerpt}</p>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)" }}>{lang === "en" ? "Read article" : "Đọc bài viết"} →</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BAND — vibrant full-bleed call to action ════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "#0F0F0F" }}>
        <img src={img("/mid/DSC06155(1).jpg.webp")} alt="HiLink coworking lounge in central Hanoi" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.32 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(168,143,92,0.25), transparent 60%)" }} />
        <div className="section-pad" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "88px 48px", textAlign: "center" }}>
          <h2 className="hero-shadow" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 18 }}>
            {lang === "en" ? "Ready to find your space?" : "Sẵn sàng tìm không gian của bạn?"}
          </h2>
          <p className="hero-shadow" style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>
            {lang === "en" ? "Tour a location, compare solutions, or let us match you in minutes." : "Tham quan địa điểm, so sánh giải pháp, hoặc để chúng tôi gợi ý trong vài phút."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/locations" className="btn" data-variant="light">{lang === "en" ? "Explore locations" : "Khám phá địa điểm"}</Link>
            <Link to="/recommend" className="btn" data-variant="ghost-light">{t.heroCta} →</Link>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — Enquiry banner (sage reference design) ═══════════ */}
      <div id="home-enquiry"><EnquiryBanner formType="general" source="Homepage" defaultInterest="Hybrid Work" image={img("/mid/DSC06104.jpg.webp")} /></div>

      {/* Section 7 — Footer is rendered by PageWrap (SiteFooter) */}
    </PageWrap>
  );
};

export default Homepage;
