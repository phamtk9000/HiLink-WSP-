import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { useSeo } from "../lib/seo.js";

const P = (n) => { const s = "/mid/" + n + ".webp"; try { return encodeURI(s); } catch { return s; } };
const fade = (d = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: d } });

const OLIVE = "#363D23";
const CREAMCARD = "#F0EBDD";

const T = {
  en: {
    heroTitle: "A workplace unlike any other",
    heroSub: "If you want to be part of shaping the future of work, we're always on the lookout for extraordinary people to join our dynamic teams.",
    aboutE: "About us", aboutT: "Be part of the future of work",
    about1: "Working at HiLink is an experience far from ordinary. Everyone here is fuelled by a desire to redefine the workplace of today and empower each other as we fulfil our mission.",
    about2: "Whether you want to work directly with members in our workspaces, or behind the scenes as part of our head-office teams, there's a role to suit you. And all in a supportive environment, built on creativity, collaboration and success.",
    join: "Join us", viewVac: "View vacancies", apply: "Apply", dept: "Department", loc: "Location",
    wayT: "The HiLink Way",
    benefitsE: "Benefits & perks", benefitsT: "More than just a workplace",
    benefitsSub: "At HiLink, we believe that a happy work environment is a productive one. That's why we're dedicated to enhancing your work-life experience with a wide selection of benefits and perks at work. Here's what we offer:",
    peopleT: "What our people say",
    cultureE: "Our culture & community", cultureT: "A place to belong",
    culture1: "Our culture isn't just about work. It's about building a vibrant, connected community where we put people first.",
    culture2: "But it's not all work and no play. From creative monthly mixers to unforgettable parties, we come together to celebrate the occasions that matter.",
    growE: "Personal & professional development", growT: "Grow with us",
    growSub: "We offer an extensive range of learning opportunities to help you build your own path and develop professionally and personally. Here are some of the opportunities on offer:",
    noRole: "Don't see your role?", noRoleSub: "We're always glad to meet talented people. Send your CV and a note about how you'd like to contribute.",
    sendCv: "Send your CV",
  },
  vi: {
    heroTitle: "Một nơi làm việc không giống bất kỳ đâu",
    heroSub: "Nếu bạn muốn góp phần định hình tương lai của công việc, chúng tôi luôn tìm kiếm những con người xuất sắc để gia nhập đội ngũ năng động của mình.",
    aboutE: "Về chúng tôi", aboutT: "Trở thành một phần của tương lai công việc",
    about1: "Làm việc tại HiLink là một trải nghiệm khác biệt. Mỗi người ở đây đều được thúc đẩy bởi khát khao định nghĩa lại nơi làm việc hôm nay và cùng nhau hoàn thành sứ mệnh.",
    about2: "Dù bạn muốn làm việc trực tiếp với thành viên tại các không gian, hay phía sau hậu trường trong đội ngũ văn phòng, luôn có một vị trí phù hợp với bạn — trong một môi trường hỗ trợ, xây trên sáng tạo, cộng tác và thành công.",
    join: "Gia nhập", viewVac: "Xem vị trí tuyển dụng", apply: "Ứng tuyển", dept: "Bộ phận", loc: "Địa điểm",
    wayT: "Phong cách HiLink",
    benefitsE: "Phúc lợi & đãi ngộ", benefitsT: "Hơn cả một nơi làm việc",
    benefitsSub: "Tại HiLink, chúng tôi tin môi trường làm việc hạnh phúc là môi trường hiệu quả. Vì vậy chúng tôi chăm chút trải nghiệm công việc – cuộc sống của bạn bằng nhiều phúc lợi. Đây là những gì chúng tôi mang lại:",
    peopleT: "Đội ngũ nói gì",
    cultureE: "Văn hoá & cộng đồng", cultureT: "Một nơi để thuộc về",
    culture1: "Văn hoá của chúng tôi không chỉ là công việc. Đó là xây dựng một cộng đồng gắn kết, sôi động, nơi con người được đặt lên trước.",
    culture2: "Và không chỉ có công việc. Từ những buổi giao lưu sáng tạo hàng tháng đến các bữa tiệc khó quên, chúng tôi cùng nhau kỷ niệm những dịp ý nghĩa.",
    growE: "Phát triển cá nhân & chuyên môn", growT: "Cùng nhau phát triển",
    growSub: "Chúng tôi mang đến nhiều cơ hội học tập để bạn tự xây lộ trình và phát triển cả chuyên môn lẫn cá nhân. Một số cơ hội tiêu biểu:",
    noRole: "Không thấy vị trí của bạn?", noRoleSub: "Chúng tôi luôn vui được gặp những người tài năng. Gửi CV và đôi lời về cách bạn muốn đóng góp.",
    sendCv: "Gửi CV",
  },
};

const VACANCY_GROUPS = [
  {
    cat: { en: "Operations & Member Experience", vi: "Vận hành & Trải nghiệm Thành viên" },
    roles: [
      { t: "Community Manager", loc: "Hoàn Kiếm, Hanoi" },
      { t: "Member Experience Associate", loc: "Đống Đa, Hanoi" },
      { t: "Facilities Technician", loc: "Hanoi" },
    ],
  },
  {
    cat: { en: "Head Office", vi: "Văn phòng Trung tâm" },
    roles: [
      { t: "Interior Designer", loc: "Hanoi" },
      { t: "Sales Consultant", loc: "Hanoi" },
      { t: "Marketing Executive", loc: "Hanoi" },
    ],
  },
];

const WAY = [
  { img: "Lounge 2 copy.jpg", en: { t: "Why we exist", c: "Propelling businesses and their people forward" }, vi: { t: "Vì sao chúng tôi tồn tại", c: "Đưa doanh nghiệp và con người của họ tiến lên" } },
  { img: "DSC06084(1).jpg", en: { t: "Who we are", c: "We are experience makers" }, vi: { t: "Chúng tôi là ai", c: "Chúng tôi là những người kiến tạo trải nghiệm" } },
  { img: "Meeting room 6 copy.jpg", en: { t: "What we provide", c: "A collection of enriching and individual workspaces" }, vi: { t: "Chúng tôi mang lại gì", c: "Bộ sưu tập không gian làm việc giàu cảm hứng và cá tính" } },
  { img: "DSC05831(1).jpg", en: { t: "How we do it", c: "Creating an extraordinary workplace experience where people do their best work" }, vi: { t: "Cách chúng tôi làm", c: "Tạo trải nghiệm nơi làm việc phi thường để mọi người làm việc tốt nhất" } },
];

const PERKS = [
  { en: { t: "Unleash your potential", d: "Develop your skills and learn new ones with a personal learning budget and professional qualifications." }, vi: { t: "Bứt phá tiềm năng", d: "Phát triển kỹ năng với ngân sách học tập cá nhân và các chứng chỉ chuyên môn." } },
  { en: { t: "Flexible working", d: "Discover hybrid roles and supportive shift patterns across our teams." }, vi: { t: "Làm việc linh hoạt", d: "Các vị trí hybrid và ca làm việc linh hoạt, hỗ trợ lẫn nhau." } },
  { en: { t: "Wellness support", d: "Care for your mental health with wellness sessions, coaching and health insurance." }, vi: { t: "Chăm sóc sức khoẻ", d: "Chăm lo sức khoẻ tinh thần với các buổi wellness, coaching và bảo hiểm sức khoẻ." } },
  { en: { t: "Generous time off", d: "Enjoy generous annual leave, plus volunteering days for community service." }, vi: { t: "Nghỉ phép hào phóng", d: "Ngày phép hàng năm hào phóng, cộng thêm ngày tình nguyện vì cộng đồng." } },
  { en: { t: "Celebrate together", d: "Let loose at our lively summer and end-of-year parties." }, vi: { t: "Cùng nhau ăn mừng", d: "Bung xoã tại tiệc hè và tiệc cuối năm sôi động." } },
  { en: { t: "Healthy discounts", d: "Save at our in-house cafés and enjoy free use of member gyms and fitness events." }, vi: { t: "Ưu đãi lành mạnh", d: "Ưu đãi tại café nội bộ và dùng miễn phí phòng gym, sự kiện thể chất." } },
  { en: { t: "Wallet-friendly travel", d: "Commute support with transport allowances and parking." }, vi: { t: "Hỗ trợ đi lại", d: "Phụ cấp di chuyển và chỗ đỗ xe." } },
  { en: { t: "Fuel your day", d: "Begin your day with complimentary barista coffee, fresh fruit and monthly team lunches." }, vi: { t: "Nạp năng lượng mỗi ngày", d: "Cà phê barista, trái cây tươi miễn phí và bữa trưa đội nhóm hàng tháng." } },
  { en: { t: "Volunteering days", d: "Annual volunteer days to spend time with the causes you care about." }, vi: { t: "Ngày tình nguyện", d: "Ngày tình nguyện hàng năm cho những điều bạn quan tâm." } },
];

const QUOTES = [
  { bg: "#0F1B2D", q: { en: "Working at HiLink has truly elevated my career. Starting as a Member Host expanded my skillset and the ongoing opportunities here led me to the team I lead today. There's so much encouragement for growth — without it I would not be where I am.", vi: "Làm việc tại HiLink thật sự nâng tầm sự nghiệp của tôi. Bắt đầu là Member Host, kỹ năng của tôi mở rộng và những cơ hội liên tục đưa tôi đến đội ngũ tôi dẫn dắt hôm nay. Sự khích lệ phát triển ở đây rất lớn — không có nó tôi không thể như bây giờ." }, by: "Tùng Lâm", role: { en: "Talent Coordinator", vi: "Điều phối Nhân tài" } },
  { bg: OLIVE, q: { en: "The support at HiLink has been unmatched — it feels like the whole company is rooting for your success and growth. Having a clear path and ticking goals off with your manager gives a real sense of accomplishment.", vi: "Sự hỗ trợ tại HiLink là không gì sánh được — cảm giác như cả công ty đang cổ vũ cho thành công của bạn. Có lộ trình rõ ràng và cùng quản lý đánh dấu từng mục tiêu mang lại cảm giác thành tựu thật sự." }, by: "Thu Hằng", role: { en: "Member Experience Host", vi: "Member Experience Host" } },
];

const GROW = [
  { en: "Apprenticeships", vi: "Học nghề (Apprenticeships)" },
  { en: "Workshops and courses (internal and external)", vi: "Workshop và khoá học (nội bộ & bên ngoài)" },
  { en: "Development toolkits", vi: "Bộ công cụ phát triển" },
  { en: "Mentoring", vi: "Cố vấn (Mentoring)" },
  { en: "Secondment opportunities", vi: "Cơ hội luân chuyển" },
  { en: "Continual professional development", vi: "Phát triển chuyên môn liên tục" },
  { en: "Professional development support", vi: "Hỗ trợ phát triển nghề nghiệp" },
];

const Eyebrow = ({ children }) => (
  <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 15, color: "var(--gold)", marginBottom: 10 }}>{children}</p>
);
const H2 = ({ children, color = "var(--text)" }) => (
  <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3.2vw,2.6rem)", fontWeight: 400, color, lineHeight: 1.12 }}>{children}</h2>
);
const Body = ({ children, style }) => (
  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.75, ...style }}>{children}</p>
);
const Topline = ({ children, dark }) => (
  <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--text)"}`, paddingTop: 12 }}>{children}</div>
);

export default function CareersPage() {
  const { lang } = useLang();
  const t = T[lang];
  useSeo({
    lang,
    title: lang === "vi" ? "Tuyển dụng" : "Careers",
    description: lang === "vi"
      ? "Gia nhập HiLink — xây dựng không gian làm việc cao cấp tại Hà Nội. Xem vị trí đang tuyển."
      : "Join HiLink — build premium workspaces in Hanoi. See our open roles and life at HiLink.",
  });

  const [openCat, setOpenCat] = useState(null);
  const [quote, setQuote] = useState(0);
  const Q = QUOTES[quote];

  return (
    <PageWrap>
      <div style={{ paddingTop: 64, background: "var(--bg)", position: "relative" }}>
        {/* ── ambient page backdrop: soft paper texture + warm glows ── */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `url(${P("auth-texture.png")})`, backgroundSize: 480, backgroundRepeat: "repeat", opacity: 0.05 }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(900px 520px at 12% 4%, rgba(168,143,92,0.10), transparent 65%), radial-gradient(760px 480px at 92% 30%, rgba(54,61,35,0.07), transparent 70%), radial-gradient(820px 560px at 8% 78%, rgba(168,143,92,0.07), transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══ 1 · Hero — image left, headline right (reference) ══ */}
        <section className="section-pad" style={{ padding: "56px 48px 72px", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
          {/* ghost word + gold arcs behind the hero */}
          <span aria-hidden="true" style={{ position: "absolute", right: -20, top: -28, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(120px,17vw,260px)", lineHeight: 1, color: "rgba(168,143,92,0.08)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>{lang === "vi" ? "Gia nhập" : "Careers"}</span>
          <div aria-hidden="true" style={{ position: "absolute", bottom: -180, right: -140, width: 420, height: 420, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.25)", pointerEvents: "none" }} />
          <div className="crs-hero" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 64, alignItems: "center", position: "relative" }}>
            <motion.div {...fade()} style={{ position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: "-14px 14px 14px -14px", border: "1px solid rgba(168,143,92,0.4)", borderRadius: 18, pointerEvents: "none" }} />
              <div style={{ aspectRatio: "7 / 6", overflow: "hidden", borderRadius: 16 }}>
                <img src={P("DSC05955(1).jpg")} alt="Careers at HiLink" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </motion.div>
            <motion.div {...fade(0.1)}>
              <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.4rem,4.6vw,3.6rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.08, marginBottom: 22, maxWidth: 420 }}>{t.heroTitle}</h1>
              <Body style={{ maxWidth: 360 }}>{t.heroSub}</Body>
            </motion.div>
          </div>
        </section>

        {/* ══ 2 · About us — text left, image right (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px", borderBottom: "1px solid var(--border)", background: "var(--surface-tint)" }}>
          <div className="crs-about" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 72, alignItems: "center" }}>
            <motion.div {...fade()}>
              <div style={{ borderTop: "1px solid var(--text)", paddingTop: 16, maxWidth: 320 }}>
                <Eyebrow>{t.aboutE}</Eyebrow>
                <H2>{t.aboutT}</H2>
                <Body style={{ fontSize: 14, marginTop: 18 }}>{t.about1}</Body>
                <Body style={{ fontSize: 14, marginTop: 12 }}>{t.about2}</Body>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} style={{ aspectRatio: "10 / 7", overflow: "hidden", borderRadius: 16 }}>
              <img src={P("DSC06104.jpg")} alt="The HiLink team at work in Hanoi" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
          </div>
        </section>

        {/* ══ 3 · Join us — green vacancy bands (reference) ══ */}
        <section className="section-pad" style={{ padding: "80px 48px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <H2>{t.join}</H2>
            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              {VACANCY_GROUPS.map((g, gi) => (
                <div key={gi}>
                  <button onClick={() => setOpenCat(openCat === gi ? null : gi)}
                    style={{ width: "100%", textAlign: "left", background: OLIVE, color: "#FFFFFF", border: "none", cursor: "pointer", padding: "26px 28px 30px" }}>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 6 }}>{g.cat[lang]}</p>
                    <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.85)", borderBottom: "1px solid rgba(255,255,255,0.5)", paddingBottom: 1 }}>
                      {t.viewVac} {openCat === gi ? "−" : "→"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openCat === gi && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden", border: "1px solid var(--border)", borderTop: "none", background: "var(--surface)" }}>
                      {g.roles.map((r, ri) => (
                        <div key={ri} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 28px", borderBottom: ri < g.roles.length - 1 ? "1px solid var(--border)" : "none", flexWrap: "wrap" }}>
                          <div>
                            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.15rem", color: "var(--text)" }}>{r.t}</p>
                            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>{g.cat[lang]} · {r.loc}</p>
                          </div>
                          <a href="mailto:careers@hilink.vn" className="btn btn-sm" data-variant="dark">{t.apply}</a>
                        </div>
                      ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4 · The HiLink Way — heading left, 2×2 grid (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px", borderBottom: "1px solid var(--border)" }}>
          <div className="crs-way" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2.1fr", gap: 56, alignItems: "start" }}>
            <motion.div {...fade()}><H2>{t.wayT}</H2></motion.div>
            <div className="crs-way-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "44px 40px" }}>
              {WAY.map((w, i) => (
                <motion.div key={i} {...fade(i * 0.06)}>
                  <Topline>
                    <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.25rem", fontWeight: 400, color: "var(--text)", marginBottom: 14 }}>{w[lang].t}</h3>
                  </Topline>
                  <div style={{ aspectRatio: "5 / 4", overflow: "hidden", borderRadius: 16, marginBottom: 12 }}>
                    <img src={P(w.img)} alt={w[lang].t} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{w[lang].c}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5 · Benefits & perks — image left, text right (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px 40px", background: "var(--surface-soft)" }}>
          <div className="crs-about" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 72, alignItems: "center" }}>
            <motion.div {...fade()} style={{ aspectRatio: "10 / 7", overflow: "hidden", borderRadius: 16 }}>
              <img src={P("DSC06155(1).jpg")} alt="Life and culture at HiLink Workspaces" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
            <motion.div {...fade(0.1)}>
              <div style={{ borderTop: "1px solid var(--text)", paddingTop: 16, maxWidth: 340 }}>
                <Eyebrow>{t.benefitsE}</Eyebrow>
                <H2>{t.benefitsT}</H2>
                <Body style={{ fontSize: 14, marginTop: 18 }}>{t.benefitsSub}</Body>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ 6 · Perk cards — 3×3 cream grid (reference) ══ */}
        <section className="section-pad" style={{ padding: "40px 48px 88px", borderBottom: "1px solid var(--border)", background: "var(--surface-soft)" }}>
          <div className="crs-perks" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
            {PERKS.map((p, i) => (
              <motion.div key={i} {...fade((i % 3) * 0.05)} style={{ background: CREAMCARD, padding: "26px 24px 30px" }}>
                <Topline>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.15rem", fontWeight: 400, color: "var(--text)", marginBottom: 12 }}>{p[lang].t}</h3>
                </Topline>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{p[lang].d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ 7 · What our people say — carousel card (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <H2>{t.peopleT}</H2>
            <AnimatePresence mode="wait">
              <motion.div key={quote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ background: Q.bg, padding: "clamp(32px,5vw,64px)", marginTop: 28 }}>
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.15rem,2vw,1.5rem)", color: "#DCE8CF", lineHeight: 1.6, maxWidth: 760 }}>{Q.q[lang]}</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.35)", marginTop: 28, paddingTop: 14, maxWidth: 560 }}>
                  <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 14.5, color: "#FFFFFF" }}>{Q.by}, {Q.role[lang]}</p>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 28 }}>
                  {QUOTES.map((_, qi) => (
                    <button key={qi} onClick={() => setQuote(qi)} aria-label={`Quote ${qi + 1}`}
                      style={{ width: 44, height: 3, border: "none", cursor: "pointer", background: qi === quote ? "#FFFFFF" : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══ 8 · A place to belong — text left, image right (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px", borderBottom: "1px solid var(--border)", background: "var(--surface-tint)" }}>
          <div className="crs-about" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 72, alignItems: "center" }}>
            <motion.div {...fade()}>
              <div style={{ borderTop: "1px solid var(--text)", paddingTop: 16, maxWidth: 320 }}>
                <Eyebrow>{t.cultureE}</Eyebrow>
                <H2>{t.cultureT}</H2>
                <Body style={{ fontSize: 14, marginTop: 18 }}>{t.culture1}</Body>
                <Body style={{ fontSize: 14, marginTop: 12 }}>{t.culture2}</Body>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} style={{ aspectRatio: "10 / 7", overflow: "hidden", borderRadius: 16 }}>
              <img src={P("L1001039.jpg")} alt="Working at HiLink in central Hanoi" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
          </div>
        </section>

        {/* ══ 9 · Grow with us — text left, checklist right (reference) ══ */}
        <section className="section-pad" style={{ padding: "88px 48px", borderBottom: "1px solid var(--border)" }}>
          <div className="crs-grow" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 72, alignItems: "start" }}>
            <motion.div {...fade()}>
              <div style={{ borderTop: "1px solid var(--text)", paddingTop: 16 }}>
                <Eyebrow>{t.growE}</Eyebrow>
                <H2>{t.growT}</H2>
                <Body style={{ fontSize: 14, marginTop: 18, maxWidth: 480 }}>{t.growSub}</Body>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} style={{ display: "grid", gap: 16, paddingTop: 16 }}>
              {GROW.map((g, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text)" }}>
                  <Icon name="check" size={18} stroke="var(--gold)" />{g[lang]}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ 10 · CTA ══ */}
        <section className="section-pad" style={{ background: OLIVE, padding: "80px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.6rem,2.6vw,2.2rem)", fontWeight: 400, color: "#FFFFFF", marginBottom: 14 }}>{t.noRole}</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 28 }}>{t.noRoleSub}</p>
            <a href="mailto:careers@hilink.vn" className="btn" data-variant="light">{t.sendCv}</a>
          </div>
        </section>
        </div>
      </div>
    </PageWrap>
  );
}
