import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import ContactForm from "../components/ContactForm.jsx";
import LandlordForm from "../components/LandlordForm.jsx";
import { LogoWall } from "../components/PartnerLogos.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { rs, SIZES } from "../lib/img.js";

/* map partner slug → canonical partnerType prefix for the enquiry payload */
const SLUG_PARTNER_TYPE = { landlords: "Landlord / Property Owner", brokers: "Broker", enterprise: "Enterprise" };

const P = (n) => { const s = "/mid/" + n + ".webp"; try { return encodeURI(s); } catch { return s; } };
const fade = (d = 0) => ({ initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: d } });

const UI = {
  en: { partnerships: "Partnerships", why: "Why partner", how: "How it works", trusted: "Trusted by", talk: "Talk to our partnerships team", back: "← All partnerships", explore: "Other ways to partner" },
  vi: { partnerships: "Hợp tác", why: "Vì sao hợp tác", how: "Cách hoạt động", trusted: "Được tin chọn bởi", talk: "Trao đổi với đội hợp tác", back: "← Tất cả hợp tác", explore: "Cách hợp tác khác" },
};

const DATA = {
  landlords: {
    title: { en: "Turn space into performance", vi: "Biến không gian thành hiệu quả" },
    tagline: { en: "Partner with HiLink to transform underused floors into fully managed, income-generating workspace.", vi: "Hợp tác cùng HiLink để biến những tầng ít dùng thành không gian làm việc quản lý trọn gói, sinh lời." },
    hero: P("DSC06155(1).jpg"), heroShape: "arc",
    quote: { en: "We handed HiLink an underused floor. Within a quarter it was fully fitted, fully let, and returning more than the building ever had.", vi: "Chúng tôi giao cho HiLink một tầng ít dùng. Trong một quý, nó được thi công, lấp đầy và sinh lời hơn bao giờ hết." },
    quoteBy: { en: "Asset Manager · Hoàn Kiếm tower", vi: "Quản lý Tài sản · Toà nhà Hoàn Kiếm" },
    lead: { en: "Your building, our operating model. We design, fit out, and run premium flexible workspace on your floors — then share the upside. No operational burden, just a stronger, more stable return.", vi: "Toà nhà của bạn, mô hình vận hành của chúng tôi. Chúng tôi thiết kế, thi công và vận hành không gian linh hoạt cao cấp trên các tầng của bạn — rồi chia sẻ lợi nhuận. Không gánh nặng vận hành, chỉ lợi nhuận ổn định hơn." },
    props: [
      { icon: "building", t: { en: "Higher, stabler income", vi: "Thu nhập cao & ổn định hơn" }, d: { en: "A managed workspace typically outperforms a traditional lease on net income.", vi: "Không gian quản lý thường vượt trội so với cho thuê truyền thống về thu nhập ròng." } },
      { icon: "key", t: { en: "Zero operational burden", vi: "Không gánh nặng vận hành" }, d: { en: "We handle fit-out, staffing, members, and day-to-day operations end to end.", vi: "Chúng tôi lo thi công, nhân sự, thành viên và vận hành hằng ngày trọn gói." } },
      { icon: "users", t: { en: "Elevated tenant experience", vi: "Trải nghiệm khách thuê nâng tầm" }, d: { en: "Amenities, events, and service that lift the whole building's appeal.", vi: "Tiện ích, sự kiện và dịch vụ nâng tầm sức hút cả toà nhà." } },
      { icon: "bolt", t: { en: "Future-proof your asset", vi: "Bảo chứng tương lai tài sản" }, d: { en: "Flexible workspace is what modern occupiers increasingly demand.", vi: "Không gian linh hoạt là điều khách thuê hiện đại ngày càng cần." } },
    ],
    steps: [
      { t: { en: "Assess", vi: "Đánh giá" }, d: { en: "We evaluate your floors, location, and market potential.", vi: "Chúng tôi đánh giá tầng, vị trí và tiềm năng thị trường." },
        details: [
          { t: { en: "Surveying & consulting", vi: "Khảo sát & tư vấn" }, d: { en: "On-site surveys and a real assessment of your floors, with advice on the right workspace model for the building.", vi: "Khảo sát thực địa và đánh giá thực tế các tầng, tư vấn mô hình không gian làm việc phù hợp cho toà nhà." } },
          { t: { en: "Market & demand analysis", vi: "Phân tích thị trường & nhu cầu" }, d: { en: "We map local demand, competitor pricing, and the member pipeline your location can capture.", vi: "Chúng tôi phân tích nhu cầu khu vực, giá đối thủ và tệp thành viên tiềm năng vị trí của bạn có thể thu hút." } },
          { t: { en: "Revenue modelling", vi: "Mô hình doanh thu" }, d: { en: "A transparent financial projection and revenue-share structure so you see the upside before committing.", vi: "Dự phóng tài chính minh bạch và cơ cấu chia sẻ doanh thu để bạn thấy rõ lợi ích trước khi quyết định." } },
          { t: { en: "Legal & utilities", vi: "Pháp lý & tiện ích" }, d: { en: "Support with licensing, insurance, electricity, water, and internet registration.", vi: "Hỗ trợ giấy phép, bảo hiểm, đăng ký điện, nước và internet." } },
          { t: { en: "Commercial terms", vi: "Điều khoản thương mại" }, d: { en: "Clear heads of terms covering fit-out investment, duration, and the split.", vi: "Điều khoản chính rõ ràng về đầu tư thi công, thời hạn và tỷ lệ chia sẻ." } },
        ] },
      { t: { en: "Design & fit out", vi: "Thiết kế & thi công" }, d: { en: "We build a premium workspace on our infrastructure.", vi: "Chúng tôi xây không gian cao cấp trên hạ tầng của mình." },
        details: [
          { t: { en: "Design & renovation", vi: "Thiết kế & cải tạo" }, d: { en: "Workspace expertise and design combine to create a product tuned to Hanoi's premium market.", vi: "Kết hợp chuyên môn vận hành và thiết kế để tạo sản phẩm phù hợp phân khúc cao cấp Hà Nội." } },
          { t: { en: "Furnishing & branding", vi: "Nội thất & thương hiệu" }, d: { en: "Full furnishing, FF&E, and HiLink brand standards throughout the floor.", vi: "Hoàn thiện nội thất, trang thiết bị và chuẩn thương hiệu HiLink trên toàn tầng." } },
          { t: { en: "Professional photography", vi: "Chụp ảnh chuyên nghiệp" }, d: { en: "The finished space is professionally shot for every sales channel.", vi: "Không gian hoàn thiện được chụp ảnh chuyên nghiệp cho mọi kênh bán hàng." } },
          { t: { en: "IT & infrastructure", vi: "Hạ tầng công nghệ" }, d: { en: "1 Gbps fibre, access control, meeting-room tech, and member systems installed.", vi: "Cáp quang 1 Gbps, kiểm soát ra vào, công nghệ phòng họp và hệ thống thành viên." } },
          { t: { en: "Listing & launch", vi: "Niêm yết & ra mắt" }, d: { en: "Your floor goes live across our website, brokers, and member pipeline with a launch campaign.", vi: "Tầng của bạn lên sóng trên website, mạng lưới môi giới và tệp thành viên với chiến dịch ra mắt." } },
        ] },
      { t: { en: "Operate & share", vi: "Vận hành & chia sẻ" }, d: { en: "We run it daily and share the revenue with you.", vi: "Chúng tôi vận hành hằng ngày và chia sẻ doanh thu với bạn." },
        details: [
          { t: { en: "Sales & occupancy", vi: "Kinh doanh & lấp đầy" }, d: { en: "Our team fills and re-fills the floor — enquiries, tours, contracts, and renewals.", vi: "Đội ngũ của chúng tôi lấp đầy và tái lấp đầy tầng — từ yêu cầu, tham quan, hợp đồng đến gia hạn." } },
          { t: { en: "Member services 24/7", vi: "Dịch vụ thành viên 24/7" }, d: { en: "Staffed reception, community events, and support that keeps members renewing.", vi: "Lễ tân túc trực, sự kiện cộng đồng và hỗ trợ giúp thành viên gắn bó lâu dài." } },
          { t: { en: "Cleaning & maintenance", vi: "Vệ sinh & bảo trì" }, d: { en: "Daily cleaning and immediate repairs so the space is always ready to show.", vi: "Vệ sinh hằng ngày và sửa chữa tức thời để không gian luôn sẵn sàng đón khách." } },
          { t: { en: "Status reports", vi: "Báo cáo tình trạng" }, d: { en: "Regular reporting on the floor, equipment, and asset condition.", vi: "Báo cáo định kỳ về tầng, trang thiết bị và tình trạng tài sản." } },
          { t: { en: "Monthly results & payouts", vi: "Kết quả & chi trả hằng tháng" }, d: { en: "A monthly business-results report with your revenue share paid on schedule.", vi: "Báo cáo kết quả kinh doanh hằng tháng cùng phần doanh thu chia sẻ chi trả đúng hạn." } },
        ] },
    ],
    stats: [{ n: "95%", l: { en: "Avg occupancy", vi: "Tỷ lệ lấp đầy TB" } }, { n: "6 wks", l: { en: "To launch", vi: "Để vận hành" } }, { n: "100%", l: { en: "Managed by us", vi: "Do chúng tôi quản lý" } }],
    logos: ["Hanoi Group", "Indochina Capital", "Facility Capital", "BlueOcean"],
    img: P("DSC05831(1).jpg"),
  },
  brokers: {
    title: { en: "Bring your clients to HiLink", vi: "Giới thiệu khách hàng đến HiLink" },
    tagline: { en: "Competitive commissions, fast responses, and space that closes deals.", vi: "Hoa hồng cạnh tranh, phản hồi nhanh và không gian giúp chốt giao dịch." },
    hero: P("DSC06084(1).jpg"),
    lead: { en: "We make it easy to place your clients. Register a lead, tour with confidence, and earn competitive commissions paid promptly on signing — backed by a team that responds fast and follows through.", vi: "Chúng tôi giúp bạn dễ dàng giới thiệu khách hàng. Đăng ký lead, tham quan tự tin và nhận hoa hồng cạnh tranh chi trả ngay khi ký — với đội ngũ phản hồi nhanh và theo sát." },
    props: [
      { icon: "check", t: { en: "Competitive commissions", vi: "Hoa hồng cạnh tranh" }, d: { en: "Paid promptly on signing, with clear, transparent terms.", vi: "Chi trả ngay khi ký, điều khoản rõ ràng minh bạch." } },
      { icon: "bolt", t: { en: "Fast, transparent process", vi: "Quy trình nhanh, minh bạch" }, d: { en: "Rapid responses and straightforward deal terms.", vi: "Phản hồi nhanh và điều khoản đơn giản." } },
      { icon: "reception", t: { en: "Dedicated broker support", vi: "Hỗ trợ môi giới chuyên trách" }, d: { en: "A single point of contact through every deal.", vi: "Một đầu mối liên hệ suốt mọi giao dịch." } },
      { icon: "building", t: { en: "Tour-ready spaces", vi: "Không gian sẵn sàng" }, d: { en: "Seven premium Hanoi locations your clients will love.", vi: "Bảy địa điểm cao cấp tại Hà Nội khách hàng sẽ thích." } },
    ],
    steps: [
      { t: { en: "Register your client", vi: "Đăng ký khách hàng" }, d: { en: "Submit a lead in minutes and we confirm it.", vi: "Gửi lead trong vài phút và chúng tôi xác nhận." } },
      { t: { en: "Tour & propose", vi: "Tham quan & đề xuất" }, d: { en: "We host the tour and shape the right deal.", vi: "Chúng tôi tổ chức tham quan và thiết kế giao dịch phù hợp." } },
      { t: { en: "Close & get paid", vi: "Chốt & nhận hoa hồng" }, d: { en: "Commission is paid promptly on signing.", vi: "Hoa hồng chi trả ngay khi ký." } },
    ],
    stats: [{ n: "24h", l: { en: "Response time", vi: "Thời gian phản hồi" } }, { n: "7", l: { en: "Locations", vi: "Địa điểm" } }, { n: "On signing", l: { en: "Commission paid", vi: "Trả hoa hồng" } }],
    logos: ["CBRE", "Savills", "Knight Frank", "Colliers"],
    quote: { en: "Fast answers, clear terms, and space my clients actually want to sign. HiLink has become my easiest placement.", vi: "Phản hồi nhanh, điều khoản rõ ràng và không gian khách hàng thật sự muốn ký. HiLink là nơi tôi giới thiệu dễ nhất." },
    quoteBy: { en: "Commercial Broker · Hanoi", vi: "Môi giới thương mại · Hà Nội" },
    img: P("L1001039.jpg"),
  },
  enterprise: {
    title: { en: "Workspace for enterprise teams", vi: "Không gian cho đội ngũ doanh nghiệp" },
    tagline: { en: "Flexible, managed, and scaled across the city — designed around how your company works.", vi: "Linh hoạt, quản lý trọn gói và mở rộng khắp thành phố — thiết kế theo cách công ty bạn vận hành." },
    hero: P("DSC06155(1).jpg"),
    lead: { en: "For teams of 50+, we design and operate workspace around your business — from a build-to-suit fit-out to a fully managed office you brand as your own, across one or many locations, on a single contract.", vi: "Cho đội ngũ 50+, chúng tôi thiết kế và vận hành không gian quanh doanh nghiệp bạn — từ build-to-suit đến văn phòng quản lý trọn gói mang thương hiệu của bạn, tại một hay nhiều địa điểm, trên một hợp đồng." },
    props: [
      { icon: "layers", t: { en: "Build-to-suit", vi: "Build-to-suit" }, d: { en: "A workspace designed and fitted to your exact specification.", vi: "Không gian thiết kế và thi công đúng yêu cầu của bạn." } },
      { icon: "reception", t: { en: "Fully managed", vi: "Quản lý trọn gói" }, d: { en: "We run operations so your team just works.", vi: "Chúng tôi lo vận hành để đội ngũ chỉ việc làm việc." } },
      { icon: "bolt", t: { en: "Flexible & scalable", vi: "Linh hoạt & mở rộng" }, d: { en: "Add or reduce space and seats as you grow.", vi: "Thêm hoặc giảm không gian và chỗ khi tăng trưởng." } },
      { icon: "check", t: { en: "One partner, one invoice", vi: "Một đối tác, một hoá đơn" }, d: { en: "Multi-site workspace, centrally managed and billed.", vi: "Không gian đa địa điểm, quản lý và thanh toán tập trung." } },
    ],
    steps: [
      { t: { en: "Discover", vi: "Tìm hiểu" }, d: { en: "We map your requirements and workflow.", vi: "Chúng tôi xác định yêu cầu và quy trình." } },
      { t: { en: "Design & build", vi: "Thiết kế & xây dựng" }, d: { en: "Fit-out to your spec on our infrastructure.", vi: "Thi công đúng yêu cầu trên hạ tầng của chúng tôi." } },
      { t: { en: "Manage", vi: "Quản lý" }, d: { en: "We operate it day to day, you focus on work.", vi: "Chúng tôi vận hành hằng ngày, bạn tập trung làm việc." } },
    ],
    stats: [{ n: "50+", l: { en: "Seats", vi: "Chỗ ngồi" } }, { n: "City-wide", l: { en: "Coverage", vi: "Phủ sóng" } }, { n: "1", l: { en: "Contract", vi: "Hợp đồng" } }],
    logos: ["NovaTech", "Seoul Tech", "Indochina Capital", "BlueOcean"],
    quote: { en: "HiLink built and now runs our Hanoi office exactly to spec. One partner, one invoice, and our team just works.", vi: "HiLink xây và vận hành văn phòng Hà Nội của chúng tôi đúng yêu cầu. Một đối tác, một hoá đơn, đội ngũ chỉ việc làm việc." },
    quoteBy: { en: "Head of Workplace · Regional tech firm", vi: "Trưởng bộ phận Văn phòng · Công ty công nghệ khu vực" },
    img: P("DSC06084(1).jpg"),
  },
};


/* ── How it works — hover a stage to open its detailed breakdown ──────────
   The three step headers act as tabs: hovering (or tapping) a stage swaps a
   shared detail panel beneath, laid out like a service one-pager — numbered
   heading + bold sub-services with descriptions. Falls back to the simple
   3-column layout when a slug has no `details`. ── */
const fadeIn = (delay = 0) => ({ initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } });

const HowItWorks = ({ steps, lang, title }) => {
  const [active, setActive] = useState(0);
  const rich = steps.some(st => st.details);
  return (
    <section className="section-pad" style={{ background: "var(--bg)", padding: "80px 48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.6rem,2.6vw,2.2rem)", fontWeight: 400, color: "var(--text)", marginBottom: 40 }}>{title}</h2>
        <div className="prt-why" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {steps.map((st, i) => {
            const on = rich && active === i;
            return (
              <motion.div key={i} {...fadeIn(i * 0.08)}
                onMouseEnter={() => rich && setActive(i)}
                onClick={() => rich && setActive(i)}
                style={{ cursor: rich ? "pointer" : "default", padding: rich ? "20px 20px 22px" : 0, borderRadius: 14, background: on ? "var(--surface)" : "transparent", border: rich ? `1px solid ${on ? "var(--border-gold)" : "transparent"}` : "none", boxShadow: on ? "0 22px 44px -26px rgba(15,15,15,0.28)" : "none", transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: on ? "var(--gold)" : "var(--text)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", marginBottom: 18, transition: "background 0.3s" }}>{i + 1}</div>
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--text)", marginBottom: 10 }}>{st.t[lang]}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.7 }}>{st.d[lang]}</p>
              </motion.div>
            );
          })}
        </div>

        {rich && (
          <div style={{ marginTop: 36, borderTop: "1px solid var(--border)", position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: "44px 0 8px" }}>
                <p style={{ marginBottom: 30 }}>
                  <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(1.6rem,2.6vw,2.1rem)", color: "var(--gold)", marginRight: 14 }}>0{active + 1}.</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem,1.8vw,1.4rem)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text)" }}>{steps[active].t[lang]}</span>
                </p>
                <div className="hiw-detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "26px 48px" }}>
                  {(steps[active].details || []).map((it, j) => (
                    <motion.div key={j} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 + j * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{it.t[lang]}:</p>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{it.d[lang]}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};


/* ── Portfolio carousel — "Properties We Manage" ───────────────────────────
   Auto-advances right every few seconds (paused while hovered), with manual
   arrows. Cards: photo + tag chip, serif name, gold location pin, and a
   Units / Occupancy / Avg-Rent stat row whose numbers COUNT UP when the
   section first scrolls into view. ── */
/* mid-size webp (1600w) — cards render ~392px CSS, so thumbs would be soft on 2x screens */
const T = (n) => { const x = "/mid/" + n + ".webp"; try { return encodeURI(x); } catch { return x; } };

const QH = (i) => `/properties/quarter-house/qh-${String(i).padStart(2, "0")}.webp`;

/* Each property carries a gallery — the card cross-fades through it. */
const PORTFOLIO = [
  { name: "The Quarter House",      tag: "Boutique townhouse",    loc: { en: "Hoàn Kiếm, Hanoi", vi: "Hoàn Kiếm, Hà Nội" },
    imgs: [QH(1), QH(2), QH(3), QH(4), QH(5), QH(6), QH(7), QH(8)],
    units: "4",   occ: "95%", rent: "$4,000/mo" },
  { name: "The Metropolitan",       tag: "Premium residential",   loc: { en: "Ba Đình, Hanoi",   vi: "Ba Đình, Hà Nội" },
    imgs: [T("DSC06008.jpg"), T("DSC06084(1).jpg"), T("DSC06155(1).jpg")],
    units: "156", occ: "98%", rent: "$2,800/mo" },
  { name: "Opera Business Center",  tag: "Managed workspace",     loc: { en: "Hoàn Kiếm, Hanoi", vi: "Hoàn Kiếm, Hà Nội" },
    imgs: [T("DSC05831(1).jpg"), T("DSC05955(1).jpg"), T("Lounge 2 copy.jpg")],
    units: "42",  occ: "97%", rent: "$310/desk" },
  { name: "Lakeside Pavilion",      tag: "Mixed-use development", loc: { en: "Tây Hồ, Hanoi",    vi: "Tây Hồ, Hà Nội" },
    imgs: [T("DSC06104.jpg"), T("DSC05749.jpg")],
    units: "68",  occ: "92%", rent: "$1,900/mo" },
  { name: "The Botanic Residences", tag: "Luxury apartments",     loc: { en: "Đống Đa, Hanoi",   vi: "Đống Đa, Hà Nội" },
    imgs: [T("Cabin 2 copy.jpg"), T("L1001039.jpg")],
    units: "84",  occ: "96%", rent: "$2,200/mo" },
];

/* Card gallery — cross-fades through a property's photos on its own timer,
   offset per card so the cards don't all flip in lockstep. Pauses with the
   carousel (paused prop) and respects a single decode per image. */
const CardGallery = ({ imgs, alt, paused, offset = 0 }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || imgs.length < 2) return;
    let id;
    /* offset the start per card so the cards don't all cross-fade together */
    const kick = setTimeout(() => {
      id = setInterval(() => setI(v => (v + 1) % imgs.length), 3200);
    }, offset * 700);
    return () => { clearTimeout(kick); if (id) clearInterval(id); };
  }, [paused, imgs.length, offset]);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {imgs.map((src, k) => (
        <img key={src} {...rs(src, SIZES.carousel)} alt={k === 0 ? alt : ""} loading={k === 0 ? "eager" : "lazy"} decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
            opacity: k === i ? 1 : 0, transition: "opacity 0.9s ease", willChange: "opacity" }} />
      ))}
      {imgs.length > 1 && (
        <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", gap: 5 }}>
          {imgs.map((_, k) => (
            <span key={k} style={{ width: k === i ? 16 : 5, height: 5, borderRadius: 3, background: k === i ? "var(--gold)" : "rgba(255,255,255,0.55)", transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s" }} />
          ))}
        </div>
      )}
    </div>
  );
};

/* count-up: parses "156", "95%", "$4,000/mo" and animates the numeric part */
const CountUp = ({ value, run }) => {
  const m = String(value).match(/^([^0-9]*)([\d,\.]+)(.*)$/);
  const target = m ? parseFloat(m[2].replace(/,/g, "")) : 0;
  const [n, setN] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    const t0 = performance.now(); const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(target * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, target]);
  if (!m) return value;
  const isInt = !m[2].includes(".");
  const shown = isInt ? Math.round(n).toLocaleString("en-US") : n.toFixed(1);
  return `${m[1]}${shown}${m[3]}`;
};

const StatCell = ({ label, value, run }) => (
  <div>
    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: 6 }}>{label}</p>
    <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.25rem", color: "var(--text)", lineHeight: 1 }}><CountUp value={value} run={run} /></p>
  </div>
);

const PortfolioCarousel = ({ lang }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [shift, setShift] = useState(0);
  const GAP = 26;
  const L = { units: { en: "Units", vi: "Số căn" }, occ: { en: "Occupancy", vi: "Lấp đầy" }, rent: { en: "Avg Rent", vi: "Giá thuê TB" },
    title: { en: "Properties We Manage", vi: "Bất động sản chúng tôi quản lý" },
    sub: { en: "A diverse portfolio of premium residential and commercial assets", vi: "Danh mục đa dạng các tài sản nhà ở và thương mại cao cấp" } };

  /* Geometry is cached and only recomputed on resize. Reading layout
     (getBoundingClientRect / scrollWidth / clientWidth) inside the advance
     tick forced a synchronous reflow on every step — Lighthouse measured
     166ms of forced reflow from exactly this pattern. */
  const metrics = useRef({ step: 392 + 26, max: 0 });
  const remeasure = () => {
    const wrap = wrapRef.current, track = trackRef.current;
    if (!wrap || !track) return;
    const first = track.firstElementChild;
    metrics.current = {
      step: (first ? first.getBoundingClientRect().width : 392) + GAP,
      max: Math.max(0, track.scrollWidth - wrap.clientWidth),
    };
  };
  useLayoutEffect(() => {
    remeasure();
    const ro = new ResizeObserver(remeasure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  const stepSize = () => metrics.current.step;
  const maxShift = () => metrics.current.max;
  useEffect(() => { setShift(Math.min(idx * stepSize(), maxShift())); }, [idx]);

  /* auto-advance right; loop back; pause while hovered */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx(i => ((i + 1) * stepSize() > maxShift() ? 0 : i + 1));
    }, 3800);
    return () => clearInterval(id);
  }, [paused]);

  const arrow = (dir) => () => setIdx(i => {
    const next = i + dir;
    if (next < 0) return Math.ceil(maxShift() / stepSize());
    if (next * stepSize() > maxShift()) return 0;
    return next;
  });

  const arrowStyle = { width: 46, height: 46, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s, color 0.2s" };
  const hoverInk = e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "#F8F6F1"; };
  const hoverOut = e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text)"; };

  return (
    <section className="section-pad" style={{ background: "var(--surface)", padding: "88px 0", borderBottom: "1px solid var(--border)", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div onViewportEnter={() => setInView(true)} viewport={{ once: true, margin: "-120px" }}
        style={{ width: "100%", padding: "0 clamp(20px,4vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 44 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, color: "var(--text)", marginBottom: 10 }}>{L.title[lang]}</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text-2)" }}>{L.sub[lang]}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button aria-label="Previous properties" onClick={arrow(-1)} style={arrowStyle} onMouseEnter={hoverInk} onMouseLeave={hoverOut}>←</button>
            <button aria-label="Next properties" onClick={arrow(1)} style={arrowStyle} onMouseEnter={hoverInk} onMouseLeave={hoverOut}>→</button>
          </div>
        </div>
      </motion.div>

      <div ref={wrapRef} style={{ width: "100%", padding: "0 clamp(20px,4vw,64px)" }}>
        <div ref={trackRef} style={{ display: "flex", gap: GAP, transform: `translateX(-${shift}px)`, transition: "transform 0.85s cubic-bezier(0.16,1,0.3,1)", willChange: "transform" }}>
          {PORTFOLIO.map((pr, i) => (
            <article key={i} className="pf-card" style={{ flex: "0 0 392px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 44px -30px rgba(15,15,15,0.3)" }}>
              <div style={{ position: "relative", aspectRatio: "16 / 11", overflow: "hidden" }}>
                <CardGallery imgs={pr.imgs} alt={pr.name} paused={!inView} offset={i} />
                <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.95)", color: "var(--text)", fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 12px", borderRadius: 3, zIndex: 2 }}>{pr.tag}</span>
              </div>
              <div style={{ padding: "22px 24px 24px" }}>
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.45rem", fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>{pr.name}</h3>
                <p style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: "var(--gold)", marginBottom: 18 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {pr.loc[lang]}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <StatCell label={L.units[lang]} value={pr.units} run={inView} />
                  <StatCell label={L.occ[lang]}   value={pr.occ}   run={inView} />
                  <StatCell label={L.rent[lang]}  value={pr.rent}  run={inView} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const SLUGS = Object.keys(DATA);

export default function PartnerPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const t = UI[lang];
  const { hash } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);
  const d = DATA[slug];
  if (!d) return <Navigate to="/partnerships" replace />;

  const others = SLUGS.filter(s => s !== slug);

  return (
    <PageWrap>
      <div>
        {/* Hero */}
        {d.heroShape === "arc" ? (
          /* ── Redesigned landlord hero: olive editorial panel + arched image ── */
          <section style={{ position: "relative", background: "#1F2418", overflow: "hidden" }}>
            {/* faint oversized ghost numeral */}
            <span aria-hidden="true" style={{ position: "absolute", left: -30, bottom: -90, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "clamp(200px,30vw,420px)", lineHeight: 1, color: "rgba(248,246,241,0.04)", pointerEvents: "none", userSelect: "none" }}>01</span>
            <div className="prt-lhero" style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(36px,5vw,88px)", alignItems: "center", minHeight: "88vh", padding: "120px 48px 64px" }}>
              {/* Text column */}
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ position: "relative", zIndex: 2 }}>
                <Link to="/partnerships" style={{ display: "inline-block", marginBottom: 20, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(248,246,241,0.55)", textDecoration: "none" }}>{t.back}</Link>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 18 }}>{t.partnerships} · {lang === "vi" ? "Cho Chủ nhà" : "For Owners"}</p>
                <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.7rem,5.4vw,4.8rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.03, marginBottom: 22, maxWidth: 600 }}>
                  {lang === "vi" ? <>Biến không gian thành <em style={{ fontStyle: "italic", color: "var(--gold)" }}>hiệu quả</em></> : <>Turn space into <em style={{ fontStyle: "italic", color: "var(--gold)" }}>performance</em></>}
                </h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,1.4vw,17.5px)", color: "rgba(248,246,241,0.75)", lineHeight: 1.7, maxWidth: 470, marginBottom: 32 }}>{d.tagline[lang]}</p>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 18, marginBottom: 44 }}>
                  <button type="button" className="btn" data-variant="gold" onClick={() => document.getElementById("prt-contact")?.scrollIntoView({ behavior: "smooth" })}>{t.talk}</button>
                  <a href="tel:+842439369197" style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(248,246,241,0.7)", textDecoration: "none" }}>+84 24 3936 9197</a>
                </div>
                {/* Inline stat strip */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 44px", borderTop: "1px solid rgba(248,246,241,0.15)", paddingTop: 26 }}>
                  {d.stats.map((s, i) => (
                    <div key={i}>
                      <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.5rem,2.4vw,2rem)", color: "var(--gold)", lineHeight: 1 }}>{s.n}</p>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(248,246,241,0.5)", marginTop: 7 }}>{s.l[lang]}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              {/* Image column — arched window with gold offset frame */}
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} style={{ position: "relative", justifySelf: "center", width: "min(100%, 480px)" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "-16px -16px 16px 16px", border: "1px solid rgba(168,143,92,0.45)", borderRadius: "999px 999px 6px 6px", pointerEvents: "none" }} />
                <div style={{ aspectRatio: "4 / 5", overflow: "hidden", borderRadius: "999px 999px 6px 6px", boxShadow: "0 40px 90px -40px rgba(0,0,0,0.6)" }}>
                  <img src={d.hero} alt={d.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ position: "absolute", left: "50%", bottom: -22, transform: "translateX(-50%)", background: "var(--gold)", color: "#0F0F0F", borderRadius: 999, padding: "10px 22px", fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {lang === "vi" ? "Vận hành trọn gói bởi HiLink" : "Fully managed by HiLink"}
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          <section style={{ position: "relative", height: "100vh", minHeight: 520, overflow: "hidden", background: "#0F0F0F" }}>
            <img src={d.hero} alt={d.title[lang]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.25) 55%, rgba(15,15,15,0.4) 100%)" }} />
            <div className="section-pad" style={{ position: "relative", height: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 52 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Link to="/partnerships" style={{ display: "inline-block", marginBottom: 18, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>{t.back}</Link>
                <p className="hero-shadow" style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.partnerships}</p>
                <h1 className="hero-shadow" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 16, maxWidth: 760 }}>{d.title[lang]}</h1>
                <p className="hero-shadow" style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,1.4vw,18px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, maxWidth: 600 }}>{d.tagline[lang]}</p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Lead + image */}
        <section className="section-pad" style={{ background: "var(--bg)", padding: "80px 48px", borderBottom: "1px solid var(--border)" }}>
          <div className="ab-split" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }}>
            <motion.div {...fade()}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{t.why}</p>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.5 }}>{d.lead[lang]}</p>
            </motion.div>
            <motion.div {...fade(0.1)} style={{ overflow: "hidden", borderRadius: 3 }}>
              <img src={d.img} alt="HiLink partnership workspace in Hanoi" style={{ width: "100%", height: "100%", maxHeight: 380, objectFit: "cover", display: "block" }} />
            </motion.div>
          </div>
        </section>

        {/* Value props */}
        <section className="section-pad" style={{ background: "var(--surface)", padding: "80px 48px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="prt-why" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
              {d.props.map((p, i) => (
                <motion.div key={i} {...fade(i * 0.06)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 3, padding: "26px 22px" }}>
                  <Icon name={p.icon} size={26} stroke="var(--gold)" />
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.15rem", fontWeight: 400, color: "var(--text)", margin: "14px 0 8px" }}>{p.t[lang]}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{p.d[lang]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — interactive stage details */}
        <HowItWorks steps={d.steps} lang={lang} title={t.how} />

        {/* Portfolio — properties HiLink manages (landlords only) */}
        {slug === "landlords" && <PortfolioCarousel lang={lang} />}

        {/* Stats band */}
        <section style={{ background: "#0F0F0F" }}>
          <div className="stats-band" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${d.stats.length},1fr)` }}>
            {d.stats.map((s, i) => (
              <div key={i} style={{ padding: "48px 32px", textAlign: "center", borderRight: i < d.stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: 10 }}>{s.l[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        {d.quote && (
          <section className="section-pad" style={{ background: "var(--bg-2)", padding: "84px 48px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
              <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "3rem", color: "var(--gold)", lineHeight: 0.5, display: "inline-block", marginBottom: 18 }}>“</span>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,2.6vw,2.1rem)", fontStyle: "italic", fontWeight: 400, color: "var(--text)", lineHeight: 1.5, marginBottom: 24 }}>{d.quote[lang]}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>{d.quoteBy[lang]}</p>
            </div>
          </section>
        )}

        {/* Trusted by */}
        <section className="section-pad" style={{ background: "var(--surface)", padding: "64px 48px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 24 }}>{t.trusted}</p>
            <LogoWall logos={d.logos} height={34} />
          </div>
        </section>

        {/* CTA form — slug-specific enquiry type */}
        {slug === "landlords" ? (
          /* For Owners: dedicated landlord property submission (formType="landlord_listing") */
          <section id="prt-contact" className="section-pad" style={{ background: "var(--bg)", padding: "80px 48px", scrollMarginTop: 72 }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "clamp(28px,4.5vw,56px)" }}>
              <LandlordForm source="Partnerships · landlords" />
            </div>
            <p style={{ maxWidth: 1000, margin: "18px auto 0", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>partnerships@hilink.vn · +84 24 3936 9197</p>
          </section>
        ) : (
          <section id="prt-contact" className="section-pad" style={{ background: "#363D23", padding: "80px 48px", scrollMarginTop: 72 }}>
            <div className="ab-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.1, marginBottom: 16 }}>{t.talk}</h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(248,246,241,0.75)", lineHeight: 1.7, maxWidth: 380, marginBottom: 24 }}>{d.tagline[lang]}</p>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(248,246,241,0.7)" }}>partnerships@hilink.vn · +84 24 3936 9197</p>
              </div>
              <div>
                <ContactForm dark formType="partnership" defaultPartnerType={SLUG_PARTNER_TYPE[slug] || ""} source={`Partnerships · ${slug}`} showInterest={false} />
              </div>
            </div>
          </section>
        )}

        {/* Other partnerships */}
        <section className="section-pad" style={{ background: "var(--bg-2)", padding: "64px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 18 }}>{t.explore}</p>
            <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {others.map(os => (
                <Link key={os} to={`/partnerships/${os}`} className="hover-lift" style={{ textDecoration: "none", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden", background: "var(--surface)", display: "flex", alignItems: "center", gap: 18, padding: 16 }}>
                  <span style={{ width: 80, height: 60, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                    <img src={DATA[os].hero} alt={`${DATA[os].title[lang]} — HiLink partnership`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <span>
                    <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--text)", marginBottom: 4 }}>{DATA[os].title[lang]}</h3>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>Explore →</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageWrap>
  );
}
