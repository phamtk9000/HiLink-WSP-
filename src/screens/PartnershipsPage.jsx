import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { LogoMarquee } from "../components/PartnerLogos.jsx";
import { LineReveal, WordReveal, CircleCTA } from "../components/motionFx.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { useSeo } from "../lib/seo.js";

/* ── Partnerships — redesigned ─────────────────────────────────────────────
   Deliberately different from the photo-hero template used elsewhere:
   1 · Typographic index hero — huge serif headline over cream, then a live
       directory of the five partner audiences; hovering a row reveals its
       photo floating on the right (desktop).
   2 · Continuous partner-logo marquee.
   3 · "Why partner" as a dark olive numbered band.
   5 · Case study (dark) and a typed partnership enquiry form
       (formType="partnership" with the I-am-a prefix).                     */

const P = (n) => { const x = "/mid/" + n + ".webp"; try { return encodeURI(x); } catch { return x; } };
/* mid-size webp (1400w) for full-bleed bands — far cheaper to decode/scale */
const M = (n) => { const x = "/mid/" + n + ".webp"; try { return encodeURI(x); } catch { return x; } };
const anchor = { scrollMarginTop: 84 };
const OLIVE = "#1F2418";
const fade = (d = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: d } });

const T = {
  en: {
    eyebrow: "Partnerships", heroLines: ["We do space.", "We do growth.", "We do partnerships."],
    heroSub: "Whether you bring buildings, clients, or capital, there's a way to partner with HiLink — and share in how Vietnam works next.",
    talk: "Let's talk",
    dirLabel: "Choose your path",
    whyE: "Why partner", whyT: "Why partner with HiLink",
    why: "We combine premium design, disciplined operations, and a fast-growing membership base. Partners get a trusted brand, a proven operating model, and a team that delivers.",
    partnersE: "Our partners", partnersT: "In good company",
    learn: "Talk to our team",
    caseE: "Case study", caseT: "A landlord partnership that paid off",
    caseQuote: "We handed HiLink an underused floor. Within a quarter it was fully fitted, fully let, and generating more than the building had ever returned.",
    caseAuthor: "Asset Manager · Hoàn Kiếm tower",
    formE: "Get in touch", formT: "Let's build something together", formSub: "Tell us who you are and what you bring — the right team will pick it up from there.",
  },
  vi: {
    eyebrow: "Hợp tác", heroLines: ["Hợp lực không gian.", "Hợp lực tăng trưởng.", "Hợp tác cùng HiLink."],
    heroSub: "Dù bạn mang đến toà nhà, khách hàng hay nguồn vốn, luôn có cách hợp tác cùng HiLink — và cùng định hình cách Việt Nam làm việc.",
    talk: "Trao đổi ngay",
    dirLabel: "Chọn hướng hợp tác",
    whyE: "Vì sao hợp tác", whyT: "Vì sao hợp tác với HiLink",
    why: "Chúng tôi kết hợp thiết kế cao cấp, vận hành kỷ luật và tệp thành viên tăng trưởng nhanh. Đối tác có được thương hiệu uy tín, mô hình đã kiểm chứng và một đội ngũ thực thi.",
    partnersE: "Đối tác", partnersT: "Đồng hành cùng những tên tuổi",
    learn: "Trao đổi với đội ngũ",
    caseE: "Câu chuyện điển hình", caseT: "Một hợp tác chủ nhà sinh lời",
    caseQuote: "Chúng tôi giao cho HiLink một tầng ít sử dụng. Trong một quý, nó được thi công trọn vẹn, lấp đầy và sinh lời hơn bao giờ hết.",
    caseAuthor: "Quản lý Tài sản · Toà nhà Hoàn Kiếm",
    formE: "Liên hệ", formT: "Cùng nhau kiến tạo", formSub: "Cho chúng tôi biết bạn là ai và mang đến điều gì — đúng đội ngũ sẽ tiếp nhận từ đó.",
  },
};

const WHY = [
  { en: { t: "A trusted brand", d: "Premium addresses members recognise and seek out." }, vi: { t: "Thương hiệu uy tín", d: "Địa chỉ cao cấp được thành viên nhận biết và tìm đến." } },
  { en: { t: "Proven operations", d: "A disciplined model that fills and runs space well." }, vi: { t: "Vận hành đã kiểm chứng", d: "Mô hình kỷ luật giúp lấp đầy và vận hành tốt." } },
  { en: { t: "A growing demand base", d: "A pipeline of teams looking for their next space." }, vi: { t: "Nguồn cầu tăng trưởng", d: "Dòng khách hàng đang tìm không gian tiếp theo." } },
  { en: { t: "Aligned incentives", d: "We only win when our partners win." }, vi: { t: "Lợi ích đồng thuận", d: "Chúng tôi chỉ thắng khi đối tác thắng." } },
];

const AUDIENCES = [
  { id: "landlords", to: "/partnerships/landlords", img: M("DSC06155(1).jpg"), tag: { en: "Owners", vi: "Chủ nhà" }, en: { t: "For Landlords & Owners", d: "Turn vacant or underused floors into a fully managed, income-generating workspace. We fit out, fill, and operate — you share the upside." }, vi: { t: "Cho Chủ nhà & Chủ sở hữu", d: "Biến những tầng trống hoặc ít dùng thành không gian làm việc quản lý trọn gói, sinh lời. Chúng tôi thi công, lấp đầy và vận hành — bạn chia sẻ lợi nhuận." } },
  { id: "brokers", to: "/partnerships/brokers", img: M("L1001039.jpg"), tag: { en: "Brokers", vi: "Môi giới" }, en: { t: "For Brokers", d: "Bring us your clients and earn competitive commissions, with fast responses, transparent terms, and space that closes deals." }, vi: { t: "Cho Môi giới", d: "Giới thiệu khách hàng và nhận hoa hồng cạnh tranh, với phản hồi nhanh, điều khoản minh bạch và không gian giúp chốt giao dịch." } },
  { id: "enterprises", to: "/partnerships/enterprise", img: M("DSC06084(1).jpg"), tag: { en: "Enterprise", vi: "Doanh nghiệp" }, en: { t: "For Enterprises", d: "Custom workspace programs for large teams across multiple sites — managed centrally, billed simply, scaled on demand." }, vi: { t: "Cho Doanh nghiệp", d: "Chương trình không gian tuỳ chỉnh cho đội ngũ lớn trên nhiều địa điểm — quản lý tập trung, thanh toán đơn giản, mở rộng theo nhu cầu." } },
  { id: "developers", to: "#contact", img: M("DSC05831(1).jpg"), tag: { en: "Developers", vi: "Nhà phát triển" }, en: { t: "For Developers", d: "Integrate flexible workspace into your development from day one — a proven amenity that lifts occupancy and asset value." }, vi: { t: "Cho Nhà phát triển", d: "Tích hợp không gian linh hoạt vào dự án ngay từ đầu — một tiện ích đã kiểm chứng giúp tăng tỷ lệ lấp đầy và giá trị tài sản." } },
  { id: "business-services", to: "#contact", img: M("Lounge 2 copy.jpg"), tag: { en: "Services", vi: "Dịch vụ" }, en: { t: "For Business Services Providers", d: "Reach thousands of members with your service — from IT and legal to catering and wellness. Become a preferred partner across every HiLink location." }, vi: { t: "Cho Nhà cung cấp Dịch vụ", d: "Tiếp cận hàng nghìn thành viên với dịch vụ của bạn — từ IT, pháp lý đến ẩm thực và chăm sóc sức khoẻ. Trở thành đối tác ưu tiên tại mọi địa điểm HiLink." } },
];

const goContact = (e) => { e.preventDefault(); document.getElementById("prt-form")?.scrollIntoView({ behavior: "smooth" }); };

/* ── Directory row — smooth reveal ─────────────────────────────────────────
   Constant row height (no layout animation) so every effect is GPU-only:
   opacity crossfade + slow transform settle on the image, translateX on the
   text, color transitions on the accents. All CSS transitions on a single
   `active` class-style toggle — no per-frame JS, no height/clip/blur work. */
const EASE_CSS = "cubic-bezier(0.16,1,0.3,1)";

const DirRow = ({ a, i, lang }) => {
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  /* Hover ALWAYS activates (touch-capable laptops previously suppressed it);
     scrolling a row through the viewport centre also activates it, on every
     device — matching the original brief: "hover in or scroll down". */
  const active = hover || inView;
  const to = a.to.startsWith("#") ? "#contact" : a.to;

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ margin: "-40% 0px -40% 0px" }}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative", borderBottom: "1px solid rgba(248,246,241,0.16)", overflow: "hidden" }}>

      {/* full-bleed image band — opacity + transform only (composited) */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: active ? 1 : 0, transition: `opacity 0.5s ease`, willChange: "opacity" }}>
        <img src={a.img} alt={a.title || "HiLink workspace in Hanoi"} loading="lazy" decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
            filter: "brightness(0.5) saturate(0.9)",
            transform: active ? "scale(1.02)" : "scale(1.12)",
            transition: `transform 1.4s ${EASE_CSS}`, willChange: "transform" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(16,18,8,0.88) 0%, rgba(16,18,8,0.5) 45%, rgba(16,18,8,0.28) 100%)" }} />
      </div>

      <Link to={to} onClick={a.to.startsWith("#") ? goContact : undefined}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="prt-dir-row"
        style={{ position: "relative", display: "grid", gridTemplateColumns: "72px 1fr auto", alignItems: "center", gap: 24, minHeight: 128, padding: "20px 8px", textDecoration: "none" }}>
        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(1.4rem,2.4vw,2rem)", lineHeight: 1, color: active ? "var(--gold)" : "rgba(248,246,241,0.4)", transition: "color 0.35s ease" }}>0{i + 1}</span>

        <span style={{ display: "block", transform: active ? "translateX(16px)" : "translateX(0)", transition: `transform 0.7s ${EASE_CSS}`, willChange: "transform" }}>
          <span style={{ display: "block", fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.5rem,3vw,2.4rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.14 }}>{a[lang].t}</span>
          <span style={{ display: "block", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginTop: 6, color: active ? "var(--gold)" : "rgba(248,246,241,0.4)", letterSpacing: active ? "0.2em" : "0.14em", transition: "color 0.35s ease, letter-spacing 0.5s ease" }}>{a.tag[lang]}</span>
        </span>

        <span aria-hidden="true" style={{ fontFamily: "'Inter',sans-serif", fontSize: 22, paddingRight: 4, color: active ? "var(--gold)" : "rgba(248,246,241,0.4)", transform: active ? "translateX(6px)" : "translateX(0)", transition: `color 0.35s ease, transform 0.45s ${EASE_CSS}` }}>→</span>
      </Link>
    </motion.div>
  );
};

const PartnershipsPage = () => {
  const { lang } = useLang();
  const t = T[lang];
  useSeo({
    lang,
    title: lang === "vi" ? "Hợp tác cùng HiLink" : "Partnerships",
    description: lang === "vi"
      ? "Dù bạn mang đến toà nhà, khách hàng hay nguồn vốn — luôn có cách hợp tác cùng HiLink tại Hà Nội."
      : "Whether you bring buildings, clients or capital, there's a way to partner with HiLink in Hanoi.",
  });

  const { hash } = useLocation();
  useEffect(() => { if (hash) { const el = document.getElementById(hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80); } }, [hash]);

  return (
    <PageWrap>
      <div>
        {/* ══ 1 · Dark statement hero + directory — atmospheric, tight ══ */}
        <section style={{ position: "relative", background: "#101208", paddingTop: 116, overflow: "hidden" }}>
          {/* atmospheric masked photo, dark-toned, anchoring the right side */}
          <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "min(58vw, 880px)", height: "78vh", pointerEvents: "none",
            WebkitMaskImage: "radial-gradient(120% 100% at 100% 0%, #000 30%, transparent 72%)",
            maskImage: "radial-gradient(120% 100% at 100% 0%, #000 30%, transparent 72%)" }}>
            <img src={M("DSC06104.jpg")} alt="HiLink coworking space in Hanoi" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.38) saturate(0.8)" }} />
          </div>
          {/* grain + gold arcs for texture */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.16,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.28'/%3E%3C/svg%3E\")" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: -240, right: -180, width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.22)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: -170, right: -110, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.12)", pointerEvents: "none" }} />

          <div className="section-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 72px", position: "relative" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)" }}>{t.eyebrow}</p>
              <span aria-hidden="true" style={{ width: 64, height: 1, background: "var(--gold)", opacity: 0.6 }} />
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(248,246,241,0.4)" }}>Hà Nội · Est. 2020</p>
            </motion.div>

            {/* Statement headline — animates on MOUNT (always visible) */}
            <LineReveal trigger="mount" delay={0.25}
              lines={[
                t.heroLines[0],
                t.heroLines[1],
                <em key="e" style={{ fontStyle: "italic", color: "var(--gold)" }}>{t.heroLines[2]}</em>,
              ]}
              style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.02, fontSize: "clamp(2.8rem,8vw,6.8rem)", marginBottom: 44, maxWidth: 1050 }}
            />

            {/* Statement + CTA on one editorial row */}
            <div className="prt-hero-head" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "28px 72px", alignItems: "center", borderTop: "1px solid rgba(248,246,241,0.14)", paddingTop: 36, marginBottom: 72 }}>
              <WordReveal text={t.heroSub} offset={["start 1.05", "start 0.55"]}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(15.5px,1.7vw,21px)", lineHeight: 1.68, maxWidth: 640 }} />
              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }} className="prt-hero-cta">
                <CircleCTA label={t.talk} size={148} onClick={goContact} />
              </motion.div>
            </div>

            {/* Directory — rows reveal a dark-toned image behind on hover / scroll */}
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,246,241,0.45)", marginBottom: 6 }}>{t.dirLabel}</motion.p>
            <div style={{ borderTop: "1px solid rgba(248,246,241,0.85)" }}>
              {AUDIENCES.map((a, i) => <DirRow key={a.id} a={a} i={i} lang={lang} />)}
            </div>
          </div>
        </section>

        {/* ══ 2 · Partner logo marquee ══ */}
        <section id="partners" style={{ ...anchor, background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "44px 0" }}>
          <p style={{ textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 30 }}>{t.partnersE} — {t.partnersT}</p>
          <LogoMarquee logos={["Hanoi Group", "Indochina Capital", "NovaTech", "BlueOcean", "Seoul Tech", "Facility Capital", "CBRE", "Savills", "Knight Frank", "Colliers"]} height={36} speed={38} />
        </section>

        {/* ══ 3 · Why partner — dark olive band ══ */}
        <section id="why" style={{ ...anchor, background: OLIVE }} className="section-pad">
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 48px" }}>
            <div className="prt2-why-head" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px 64px", marginBottom: 56 }}>
              <div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.whyE}</p>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3.4vw,2.8rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.12 }}>{t.whyT}</h2>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(248,246,241,0.72)", lineHeight: 1.75, alignSelf: "end" }}>{t.why}</p>
            </div>
            <div className="prt2-why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderLeft: "1px solid rgba(248,246,241,0.14)" }}>
              {WHY.map((w, i) => (
                <motion.div key={i} {...fade(i * 0.07)} style={{ borderRight: "1px solid rgba(248,246,241,0.14)", padding: "8px 26px 4px" }}>
                  <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "2.2rem", color: "var(--gold)", lineHeight: 1 }}>0{i + 1}</span>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.25rem", fontWeight: 400, color: "#F8F6F1", margin: "16px 0 10px", lineHeight: 1.25 }}>{w[lang].t}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "rgba(248,246,241,0.62)", lineHeight: 1.65 }}>{w[lang].d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5 · Case study ══ */}
        <section id="case" style={{ ...anchor, background: "#0F0F0F" }} className="section-pad">
          <div className="prt-case" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ overflow: "hidden", borderRadius: 2 }}>
              <img src={M("DSC05831(1).jpg")} alt="Case study" style={{ width: "100%", height: "100%", maxHeight: 380, objectFit: "cover", display: "block" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.caseE}</p>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.5rem,2.4vw,2rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 18 }}>{t.caseT}</h2>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.3rem", fontStyle: "italic", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 18 }}>“{t.caseQuote}”</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>{t.caseAuthor}</p>
            </div>
          </div>
        </section>

        {/* ══ 6 · Partnership enquiry (formType="partnership", type 5) ══ */}
        <section id="contact" style={{ ...anchor, background: "#363D23" }} className="section-pad">
          <div id="prt-form" className="ab-split" style={{ width: "100%", padding: "96px clamp(28px,5vw,84px)", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(40px,6vw,110px)", alignItems: "start", scrollMarginTop: 72 }}>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.formE}</p>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.9rem,3.4vw,2.8rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.1, marginBottom: 16 }}>{t.formT}</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(248,246,241,0.75)", lineHeight: 1.7, maxWidth: 400, marginBottom: 26 }}>{t.formSub}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(248,246,241,0.7)" }}>partnerships@hilink.vn · +84 24 3936 9197</p>
            </div>
            <ContactForm dark formType="partnership" source="Partnerships hub" showInterest={false} />
          </div>
        </section>
      </div>
    </PageWrap>
  );
};

export default PartnershipsPage;
