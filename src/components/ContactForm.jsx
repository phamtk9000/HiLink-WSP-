import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";
import { LOCATIONS } from "../data/locations.js";
import { addLead } from "../data/leadsStore.js";

/* ── HiLink enquiry form ────────────────────────────────────────────────────
   One component, five typed variants — each declares a `formType` so the
   backend receives a routable, structured payload (see leadsStore.FORM_TYPES):

     1 · formType="general"        — general solutions enquiry (interest select)
     2 · formType="location_match" — "not sure which location?" matching form
     3 · formType="location"       — enquiry about one location (location row)
     4 · formType="unit"           — enquiry about a unit at a location
     5 · formType="partnership"    — partner enquiry with an "I am a …" prefix
                                     (Landlord, Broker, Enterprise, Developer…)

   Editorial underline style: uppercase micro-labels, borderless fields with a
   hairline underneath that turns gold on focus. `dark` adapts the palette for
   the olive enquiry surfaces. Name, email & phone required.                  */

const STR = {
  en: { name: "Full name", company: "Company", email: "Email", phone: "Phone", interest: "I'm interested in", message: "How can we help?", optional: "optional", send: "Send enquiry", doneTitle: "Thank you", doneBody: "We've received your enquiry — our team will be in touch within one business day.", again: "Send another", location: "Location", choose: "Choose…", other: "Other — tell us what you need", otherPh: "Describe what you are looking for", back: "Back to list", iam: "I am a", partnerReq: "Please tell us who you are so the right team receives your enquiry." },
  vi: { name: "Họ và tên", company: "Công ty", email: "Email", phone: "Điện thoại", interest: "Tôi quan tâm đến", message: "Chúng tôi có thể giúp gì?", optional: "không bắt buộc", send: "Gửi yêu cầu", doneTitle: "Cảm ơn bạn", doneBody: "Chúng tôi đã nhận được yêu cầu — đội ngũ sẽ liên hệ trong vòng một ngày làm việc.", again: "Gửi yêu cầu khác", location: "Địa điểm", choose: "Chọn…", other: "Khác — cho chúng tôi biết bạn cần gì", otherPh: "Mô tả nhu cầu của bạn", back: "Chọn từ danh sách", iam: "Tôi là", partnerReq: "Vui lòng cho biết bạn là ai để đúng đội ngũ tiếp nhận yêu cầu." },
};
const INTERESTS = ["Private Workspaces", "Hybrid Work", "e-Office", "Corporate Suites", "Specialized Suites", "Enterprise Solutions"];

/* Partnership audiences — value is the canonical key stored in meta.partnerType */
export const PARTNER_TYPES = [
  { value: "Landlord / Property Owner", en: "Landlord / Property Owner", vi: "Chủ nhà / Chủ sở hữu BĐS" },
  { value: "Broker",                    en: "Broker",                    vi: "Môi giới" },
  { value: "Enterprise",                en: "Enterprise",                vi: "Doanh nghiệp" },
  { value: "Developer",                 en: "Developer",                 vi: "Nhà phát triển" },
  { value: "Business Services Provider", en: "Business Services Provider", vi: "Nhà cung cấp Dịch vụ" },
];

/* Custom brand dropdown (replaces native select) */
const BrandSelect = ({ value, display, options, onChange, onOther, otherLabel, dark, placeholder, ink, inkFaint, line }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const rows = onOther ? ["", ...options, "__OTHER__"] : ["", ...options];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: `1px solid ${open ? "var(--gold)" : line}`, borderRadius: 0, padding: "9px 0 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 15, color: value ? ink : inkFaint, transition: "border-color 0.2s" }}>
        {display || value || placeholder}
        <span style={{ fontSize: 9, color: "var(--gold)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 70, background: dark ? "#2C3219" : "#FFFFFF", border: `1px solid ${dark ? "rgba(248,246,241,0.2)" : "var(--border)"}`, borderTop: "2px solid var(--gold)", boxShadow: "0 22px 48px -18px rgba(15,15,15,0.45)", maxHeight: "min(60vh, 460px)", overflowY: "auto" }}>
          {rows.map((o, i) => {
            const val = typeof o === "object" ? o.value : o;
            const lab = typeof o === "object" ? o.label : (o || placeholder);
            return (
              <button key={i} type="button" onClick={() => { if (val === "__OTHER__") { onOther(); } else { onChange(val); } setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "11px 16px", border: "none", cursor: "pointer",
                  background: val === "__OTHER__" ? (dark ? "#242A14" : "var(--bg-2)") : "transparent",
                  position: val === "__OTHER__" ? "sticky" : "static", bottom: 0,
                  borderTop: val === "__OTHER__" ? `1px solid ${dark ? "rgba(248,246,241,0.2)" : "var(--border)"}` : "none",
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: value === val ? "var(--gold)" : (dark ? "#F8F6F1" : "var(--text)"), transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(248,246,241,0.08)" : "var(--bg-2)"}
                onMouseLeave={e => e.currentTarget.style.background = val === "__OTHER__" ? (dark ? "#242A14" : "var(--bg-2)") : "transparent"}>
                <span style={val === "__OTHER__" ? { fontStyle: "italic", color: "var(--gold)" } : undefined}>{val === "__OTHER__" ? otherLabel : lab}</span>
                {value === val && <span style={{ color: "var(--gold)", fontSize: 12 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function ContactForm({
  formType = "general",             // general | location_match | location | unit | partnership
  source = "Website",
  defaultInterest = "",
  defaultPartnerType = "",          // preselect for formType="partnership"
  showInterest = true,
  showCompany = true,
  showPhone = true,
  dark = false,
  location = "",                     // shown for formType location / unit
  unit = "",                         // unit number for formType="unit"
  showLocationSelect = false,        // optional "preferred location" dropdown
  onDone,
}) {
  const { lang } = useLang();
  const t = STR[lang];
  const isPartnership = formType === "partnership";
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", interest: defaultInterest, partnerType: defaultPartnerType, locSel: "", message: "" });
  const [focus, setFocus] = useState("");
  const [sent, setSent] = useState(false);
  const [customInterest, setCustomInterest] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const emailOk = /.+@.+\..+/.test(form.email.trim());
  const phoneOk = form.phone.replace(/\D/g, "").length >= 8;
  const canSend = form.name.trim() && emailOk && (!showPhone || phoneOk) && (!isPartnership || form.partnerType);

  const ink       = dark ? "#F8F6F1" : "var(--text)";
  const inkSoft   = dark ? "rgba(248,246,241,0.65)" : "var(--text-2)";
  const inkFaint  = dark ? "rgba(248,246,241,0.45)" : "var(--text-3)";
  const line      = dark ? "rgba(248,246,241,0.35)" : "rgba(15,15,15,0.28)";
  const lineFocus = "var(--gold)";

  const Label = ({ children, required }) => (
    <span style={{ display: "block", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4, color: inkFaint, fontFamily: "'Inter', sans-serif" }}>
      {children}{required && <span style={{ color: "var(--gold)", marginLeft: 4 }}>*</span>}
    </span>
  );

  const base = (name) => ({
    width: "100%", padding: "9px 0 10px", fontSize: 15, fontFamily: "'Inter', sans-serif",
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focus === name ? lineFocus : line}`,
    borderRadius: 0, color: ink, outline: "none", transition: "border-color 0.2s",
  });
  const bind = (name) => ({ onFocus: () => setFocus(name), onBlur: () => setFocus("") });

  const submit = () => {
    if (!canSend) return;
    /* interest field carries a routing prefix for partnership enquiries,
       e.g. "[Landlord / Property Owner] Managed workspace" — and the
       structured meta object mirrors it for the backend. */
    const interest = isPartnership
      ? `[${form.partnerType}]${form.interest ? " " + form.interest : ""}`
      : (form.interest || defaultInterest || "General enquiry");
    addLead({
      formType,
      name: form.name, company: form.company, email: form.email, phone: form.phone,
      interest,
      meta: {
        ...(location ? { location } : {}),
        ...(form.locSel ? { location: form.locSel } : {}),
        ...(unit ? { unit } : {}),
        ...(isPartnership ? { partnerType: form.partnerType } : {}),
      },
      note: (location ? `[Location: ${location}] ` : (form.locSel ? `[Location: ${form.locSel}] ` : "")) + form.message,
      source,
    });
    setSent(true);
    onDone && onDone(form);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "32px 8px" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24 }}>✓</div>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 400, color: ink, marginBottom: 10 }}>{t.doneTitle}</h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: inkSoft, lineHeight: 1.6, marginBottom: 22, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>{t.doneBody}</p>
        <button onClick={() => { setForm({ name: "", company: "", email: "", phone: "", interest: defaultInterest, partnerType: defaultPartnerType, message: "" }); setSent(false); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>{t.again}</button>
      </motion.div>
    );
  }

  const partnerOptions = PARTNER_TYPES.map(p => ({ value: p.value, label: p[lang] }));
  const partnerDisplay = isPartnership && form.partnerType ? (PARTNER_TYPES.find(p => p.value === form.partnerType)?.[lang] || form.partnerType) : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {/* Type 5 — partnership audience prefix, first field so it frames the enquiry */}
      {isPartnership && (
        <div>
          <Label required>{t.iam}</Label>
          <BrandSelect value={form.partnerType} display={partnerDisplay} options={partnerOptions}
            onChange={(v) => setForm(fm => ({ ...fm, partnerType: v }))}
            dark={dark} placeholder={t.choose} ink={ink} inkFaint={inkFaint} line={line} />
          {!form.partnerType && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: inkFaint, marginTop: 6 }}>{t.partnerReq}</p>}
        </div>
      )}
      {/* Types 3 & 4 — pinned location / unit context row */}
      {location && (
        <div>
          <Label>{t.location}</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0 10px", borderBottom: `1px solid ${line}` }}>
            <span style={{ color: "var(--gold)", display: "inline-flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-6.5-5.3-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.7 12 21 12 21Z"/><circle cx="12" cy="10.6" r="2.2"/></svg>
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: ink }}>{location}</span>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: showCompany ? "1fr 1fr" : "1fr", gap: "26px 32px" }}>
        <label style={{ display: "block" }}><Label required>{t.name}</Label><input style={base("name")} {...bind("name")} value={form.name} onChange={set("name")} /></label>
        {showCompany && <label style={{ display: "block" }}><Label>{t.company} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({t.optional})</span></Label><input style={base("company")} {...bind("company")} value={form.company} onChange={set("company")} /></label>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: showPhone ? "1fr 1fr" : "1fr", gap: "26px 32px" }}>
        <label style={{ display: "block" }}><Label required>{t.email}</Label><input type="email" style={base("email")} {...bind("email")} value={form.email} onChange={set("email")} /></label>
        {showPhone && <label style={{ display: "block" }}><Label required>{t.phone}</Label><input type="tel" style={base("phone")} {...bind("phone")} value={form.phone} onChange={set("phone")} /></label>}
      </div>
      {showInterest && !isPartnership && (
        <div>
          <Label>{t.interest} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({t.optional})</span></Label>
          {customInterest ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input autoFocus placeholder={t.otherPh} style={{ ...base("interest"), flex: 1 }} {...bind("interest")} value={form.interest} onChange={set("interest")} />
              <button type="button" onClick={() => { setCustomInterest(false); setForm(fm => ({ ...fm, interest: "" })); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", whiteSpace: "nowrap" }}>↺ {t.back}</button>
            </div>
          ) : (
            <BrandSelect value={form.interest} options={INTERESTS} onChange={(v) => setForm(fm => ({ ...fm, interest: v }))} onOther={() => { setCustomInterest(true); setForm(fm => ({ ...fm, interest: "" })); }} otherLabel={t.other} dark={dark} placeholder={t.choose} ink={ink} inkFaint={inkFaint} line={line} />
          )}
        </div>
      )}
      {showLocationSelect && (
        <div>
          <Label>{t.location} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({t.optional})</span></Label>
          <BrandSelect value={form.locSel}
            options={LOCATIONS.map(l => l.name)}
            onChange={(v) => setForm(fm => ({ ...fm, locSel: v }))}
            dark={dark} placeholder={t.choose} ink={ink} inkFaint={inkFaint} line={line} />
        </div>
      )}
      <label style={{ display: "block" }}>
        <Label>{t.message} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({t.optional})</span></Label>
        <textarea rows={3} style={{ ...base("message"), resize: "vertical", minHeight: 64 }} {...bind("message")} value={form.message} onChange={set("message")} />
      </label>
      <button onClick={submit} disabled={!canSend} aria-disabled={!canSend}
        style={{ alignSelf: "flex-start", marginTop: 4, padding: "14px 34px", borderRadius: 999, border: "none",
          display: "inline-flex", alignItems: "center", gap: 10,
          background: canSend ? "var(--gold)" : (dark ? "rgba(248,246,241,0.18)" : "var(--border)"),
          color: canSend ? "#0F0F0F" : (dark ? "rgba(248,246,241,0.5)" : "#FFFFFF"),
          cursor: canSend ? "pointer" : "not-allowed",
          fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, letterSpacing: "0.04em", transition: "background 0.2s, color 0.2s" }}
        onMouseEnter={e => { if (canSend) { e.currentTarget.style.background = dark ? "#F8F6F1" : "#0F0F0F"; e.currentTarget.style.color = dark ? "#0F0F0F" : "#FFFFFF"; } }}
        onMouseLeave={e => { if (canSend) { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "#0F0F0F"; } }}>
        {t.send} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
