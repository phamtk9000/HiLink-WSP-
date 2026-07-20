import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";
import { addLead } from "../data/leadsStore.js";

/* ── Landlord / property-owner submission form ─────────────────────────────
   formType="landlord_listing" — the "For Owners" enquiry. Modeled on the
   reference: boxed fields with floating-style labels, inline validation
   ("This field is required" / "Should be numeric value"), phone country code,
   area with a m²/ft² unit select and asking rent with a currency select.
   Structured payload lands in lead.meta so the backend can parse listings.  */

const STR = {
  en: {
    title: "Ready to start the conversation?",
    intro1: "Please complete the form below and our team will contact you if we believe there may be an opportunity to work together. ",
    introNote: "PLEASE NOTE, however, that this form is intended for submissions by LANDLORDS and PROPERTY OWNERS ONLY — submissions by brokers will not be considered here",
    introBroker: " (brokers, we'd love to hear from you on our ",
    brokerLink: "broker partnership page",
    introEnd: ").",
    name: "Full name", owner: "Landlord / Property Owner", ownerHelp: "Who do you work for?",
    email: "Email address", phone: "Phone number",
    address: "Address", city: "City", state: "State / Province",
    area: "Available area", rent: "Asking rent", rentPer: "per month",
    notes: "Additional notes", notesPh: "Building story, current condition, timing…",
    submit: "Submit", required: "This field is required", numeric: "Should be numeric value, e.g. 1000 or 150.40", emailBad: "Please enter a valid email",
    doneTitle: "Thank you", doneBody: "Your property has been submitted. Our partnerships team will review it and contact you if there's an opportunity to work together.", again: "Submit another property",
  },
  vi: {
    title: "Sẵn sàng bắt đầu trao đổi?",
    intro1: "Vui lòng điền biểu mẫu bên dưới, đội ngũ của chúng tôi sẽ liên hệ nếu nhận thấy cơ hội hợp tác. ",
    introNote: "LƯU Ý: biểu mẫu này CHỈ dành cho CHỦ NHÀ và CHỦ SỞ HỮU BẤT ĐỘNG SẢN — hồ sơ từ môi giới sẽ không được xét tại đây",
    introBroker: " (môi giới vui lòng liên hệ qua ",
    brokerLink: "trang hợp tác môi giới",
    introEnd: ").",
    name: "Họ và tên", owner: "Chủ nhà / Chủ sở hữu", ownerHelp: "Bạn đại diện cho đơn vị nào?",
    email: "Địa chỉ email", phone: "Số điện thoại",
    address: "Địa chỉ", city: "Thành phố", state: "Tỉnh / Bang",
    area: "Diện tích cho thuê", rent: "Giá chào thuê", rentPer: "mỗi tháng",
    notes: "Ghi chú thêm", notesPh: "Câu chuyện toà nhà, hiện trạng, thời điểm…",
    submit: "Gửi hồ sơ", required: "Trường này là bắt buộc", numeric: "Phải là giá trị số, ví dụ 1000 hoặc 150.40", emailBad: "Vui lòng nhập email hợp lệ",
    doneTitle: "Cảm ơn bạn", doneBody: "Hồ sơ bất động sản đã được gửi. Đội ngũ hợp tác sẽ xem xét và liên hệ nếu có cơ hội hợp tác.", again: "Gửi bất động sản khác",
  },
};

const CODES = ["+84", "+36", "+65", "+82", "+81", "+1", "+44"];
const AREA_UNITS = ["m²", "ft²"];
const CURRENCIES = ["VND", "USD"];
const ERR = "#C0392B";

export default function LandlordForm({ source = "Partnerships · landlords", onDone }) {
  const { lang } = useLang();
  const t = STR[lang];
  const [f, setF] = useState({ name: "", owner: "", email: "", code: "+84", phone: "", address: "", city: "", state: "", area: "", areaUnit: "m²", rent: "", currency: "VND", notes: "" });
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [focus, setFocus] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF(v => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => { setFocus(""); setTouched(v => ({ ...v, [k]: true })); };

  const isNum = (s) => /^\d+([.,]\d+)?$/.test(String(s).trim());
  const errors = {
    name:    !f.name.trim()    ? t.required : "",
    owner:   !f.owner.trim()   ? t.required : "",
    email:   !f.email.trim()   ? t.required : (!/.+@.+\..+/.test(f.email.trim()) ? t.emailBad : ""),
    phone:   f.phone.replace(/\D/g, "").length < 8 ? t.required : "",
    address: !f.address.trim() ? t.required : "",
    city:    !f.city.trim()    ? t.required : "",
    state:   !f.state.trim()   ? t.required : "",
    area:    !f.area.trim()    ? t.required : (!isNum(f.area) ? t.numeric : ""),
    rent:    !f.rent.trim()    ? t.required : (!isNum(f.rent) ? t.numeric : ""),
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (k) => (tried || touched[k]) && errors[k];

  const submit = () => {
    setTried(true);
    if (hasErrors) return;
    addLead({
      formType: "landlord_listing",
      name: f.name, company: f.owner, email: f.email, phone: `${f.code} ${f.phone}`,
      interest: "[Landlord / Property Owner] Property submission",
      meta: {
        partnerType: "Landlord / Property Owner",
        owner: f.owner,
        address: f.address, city: f.city, state: f.state,
        availableArea: `${f.area} ${f.areaUnit}`,
        askingRent: `${f.rent} ${f.currency}/mo`,
      },
      note: `[Property: ${f.address}, ${f.city}, ${f.state}] [Area: ${f.area} ${f.areaUnit}] [Rent: ${f.rent} ${f.currency}/mo] ${f.notes}`,
      source,
    });
    setSent(true);
    onDone && onDone(f);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "48px 8px" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24 }}>✓</div>
        <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.5rem", fontWeight: 400, color: "var(--text)", marginBottom: 10 }}>{t.doneTitle}</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 400, margin: "0 auto 22px" }}>{t.doneBody}</p>
        <button onClick={() => { setSent(false); setTried(false); setTouched({}); setF({ name: "", owner: "", email: "", code: "+84", phone: "", address: "", city: "", state: "", area: "", areaUnit: "m²", rent: "", currency: "VND", notes: "" }); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>{t.again}</button>
      </motion.div>
    );
  }

  /* boxed field in the reference style — label sits inside as placeholder-like text */
  const box = (k, extra = {}) => ({
    width: "100%", padding: "10px 14px", fontSize: 15, fontFamily: "'Inter',sans-serif",
    background: "var(--surface)", color: "var(--text)", outline: "none", borderRadius: 3,
    border: `1px solid ${show(k) ? ERR : (focus === k ? "var(--gold)" : "var(--border)")}`,
    transition: "border-color 0.18s", ...extra,
  });
  const Lab = ({ k, children, help }) => (
    <span style={{ display: "block", marginBottom: 6 }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: show(k) ? ERR : "var(--text-3)" }}>
        {children} <span style={{ color: show(k) ? ERR : "var(--gold)" }}>*</span>
      </span>
      {help && <span style={{ display: "block", fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{help}</span>}
    </span>
  );
  const Err = ({ k }) => show(k) ? <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: ERR, marginTop: 6 }}>{show(k)}</p> : null;
  const selStyle = { border: "none", background: "var(--bg-2)", padding: "0 10px", fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "var(--text)", outline: "none", cursor: "pointer", borderRadius: "0 2px 2px 0", alignSelf: "stretch" };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.7rem,3vw,2.4rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.12, marginBottom: 16 }}>{t.title}</h2>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 720, marginBottom: 34 }}>
        {t.intro1}<strong style={{ color: "var(--text)" }}>{t.introNote}</strong>{t.introBroker}
        <a href="/partnerships/brokers" style={{ color: "var(--gold)", textDecoration: "underline" }}>{t.brokerLink}</a>{t.introEnd}
      </p>

      <div className="llf-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 28px" }}>
        {/* Row 1 */}
        <div><Lab k="name">{t.name}</Lab>
          <input style={box("name")} value={f.name} onChange={set("name")} onFocus={() => setFocus("name")} onBlur={blur("name")} />
          <Err k="name" /></div>
        <div><Lab k="owner" help={t.ownerHelp}>{t.owner}</Lab>
          <input style={box("owner")} value={f.owner} onChange={set("owner")} onFocus={() => setFocus("owner")} onBlur={blur("owner")} />
          <Err k="owner" /></div>

        {/* Row 2 */}
        <div><Lab k="email">{t.email}</Lab>
          <input type="email" style={box("email")} value={f.email} onChange={set("email")} onFocus={() => setFocus("email")} onBlur={blur("email")} />
          <Err k="email" /></div>
        <div><Lab k="phone">{t.phone}</Lab>
          <div style={{ display: "flex", borderRadius: 3, overflow: "hidden", border: `1px solid ${show("phone") ? ERR : (focus === "phone" ? "var(--gold)" : "var(--border)")}`, transition: "border-color 0.18s", background: "var(--surface)" }}>
            <select value={f.code} onChange={set("code")} style={{ ...selStyle, borderRight: "1px solid var(--border)", borderRadius: 0 }}>
              {CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="tel" style={{ flex: 1, border: "none", outline: "none", padding: "10px 14px", fontSize: 15, fontFamily: "'Inter',sans-serif", color: "var(--text)", background: "transparent" }}
              value={f.phone} onChange={set("phone")} onFocus={() => setFocus("phone")} onBlur={blur("phone")} />
          </div>
          <Err k="phone" /></div>

        {/* Row 3 */}
        <div><Lab k="address">{t.address}</Lab>
          <input style={box("address")} value={f.address} onChange={set("address")} onFocus={() => setFocus("address")} onBlur={blur("address")} />
          <Err k="address" /></div>
        <div><Lab k="city">{t.city}</Lab>
          <input style={box("city")} value={f.city} onChange={set("city")} onFocus={() => setFocus("city")} onBlur={blur("city")} />
          <Err k="city" /></div>

        {/* Row 4 */}
        <div><Lab k="state">{t.state}</Lab>
          <input style={box("state")} value={f.state} onChange={set("state")} onFocus={() => setFocus("state")} onBlur={blur("state")} />
          <Err k="state" /></div>
        <div><Lab k="area">{t.area}</Lab>
          <div style={{ display: "flex", borderRadius: 3, overflow: "hidden", border: `1px solid ${show("area") ? ERR : (focus === "area" ? "var(--gold)" : "var(--border)")}`, transition: "border-color 0.18s", background: "var(--surface)" }}>
            <input inputMode="decimal" style={{ flex: 1, border: "none", outline: "none", padding: "10px 14px", fontSize: 15, fontFamily: "'Inter',sans-serif", color: "var(--text)", background: "transparent" }}
              value={f.area} onChange={set("area")} onFocus={() => setFocus("area")} onBlur={blur("area")} />
            <select value={f.areaUnit} onChange={set("areaUnit")} style={{ ...selStyle, borderLeft: "1px solid var(--border)" }}>
              {AREA_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <Err k="area" /></div>

        {/* Row 5 */}
        <div><Lab k="rent">{t.rent} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>· {t.rentPer}</span></Lab>
          <div style={{ display: "flex", borderRadius: 3, overflow: "hidden", border: `1px solid ${show("rent") ? ERR : (focus === "rent" ? "var(--gold)" : "var(--border)")}`, transition: "border-color 0.18s", background: "var(--surface)" }}>
            <select value={f.currency} onChange={set("currency")} style={{ ...selStyle, borderRight: "1px solid var(--border)", borderRadius: 0 }}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input inputMode="decimal" style={{ flex: 1, border: "none", outline: "none", padding: "10px 14px", fontSize: 15, fontFamily: "'Inter',sans-serif", color: "var(--text)", background: "transparent" }}
              value={f.rent} onChange={set("rent")} onFocus={() => setFocus("rent")} onBlur={blur("rent")} />
          </div>
          <Err k="rent" /></div>
        <div><span style={{ display: "block", marginBottom: 6, fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>{t.notes}</span>
          <input placeholder={t.notesPh} style={box("notes")} value={f.notes} onChange={set("notes")} onFocus={() => setFocus("notes")} onBlur={() => setFocus("")} />
        </div>
      </div>

      <button onClick={submit}
        style={{ marginTop: 32, padding: "15px 40px", borderRadius: 999, border: "none", display: "inline-flex", alignItems: "center", gap: 10,
          background: "var(--gold)", color: "#0F0F0F", cursor: "pointer",
          fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: 600, letterSpacing: "0.04em", transition: "background 0.2s, color 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#0F0F0F"; e.currentTarget.style.color = "#FFFFFF"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "#0F0F0F"; }}>
        {t.submit} <span aria-hidden="true">→</span>
      </button>
      {tried && hasErrors && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: ERR, marginTop: 12 }}>{t.required}</p>}
    </div>
  );
}
