import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm.jsx";
import { useLang } from "../context/LanguageContext.jsx";

const P = (n) => { const s = "/mid/" + n + ".webp"; try { return encodeURI(s); } catch { return s; } };

const T = {
  en: {
    eyebrow: "Find a workspace that works for you",
    title: "We're here to help",
    body: "Our team are on hand to answer any questions and help you find the perfect workspace for you and your team.",
    cta: "Make an enquiry",
    sales: "Sales:",
  },
  vi: {
    eyebrow: "Tìm không gian làm việc phù hợp với bạn",
    title: "Chúng tôi luôn sẵn sàng",
    body: "Đội ngũ của chúng tôi sẵn sàng giải đáp mọi câu hỏi và giúp bạn tìm không gian hoàn hảo cho bạn và đội nhóm.",
    cta: "Gửi yêu cầu",
    sales: "Hotline:",
  },
};

/* ── Sage enquiry banner (reference: rounded band, text left, photo right,
      yellow pill CTA + monospace sales line). CTA expands the shared form. ── */
export default function EnquiryBanner({ showLocationSelect = false,
  formType = "general",
  source = "Website",
  defaultInterest,
  showInterest = true,
  image = P("DSC06104.jpg"),
  phone = "+84 24 3936 8888",
  eyebrow, title, body, location = "",
  unit = "",
  wrap = true,
}) {
  const { lang } = useLang();
  const t = T[lang];
  const [open, setOpen] = useState(false);

  const card = (
      <div style={{ maxWidth: 1320, margin: "0 auto", background: "#363D23", borderRadius: 16, padding: "clamp(28px, 4vw, 56px)" }}>
        <div className="enq-banner" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(28px, 4vw, 64px)", alignItems: "center" }}>
          {/* Text column */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 340, padding: "8px 0" }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(248,246,241,0.7)", marginBottom: 18 }}>
                {eyebrow || t.eyebrow}
              </p>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "#F8F6F1", lineHeight: 1.05 }}>
                {title || t.title}
              </h2>
            </div>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(248,246,241,0.75)", lineHeight: 1.6, maxWidth: 380, margin: "36px 0 26px" }}>
                {body || t.body}
              </p>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 22 }}>
                <button
                  onClick={() => setOpen(o => !o)}
                  style={{
                    background: "#F0C963", color: "#1F2418", border: "none", cursor: "pointer",
                    borderRadius: 999, padding: "13px 26px",
                    fontFamily: "'Inter', sans-serif", fontSize: 14.5, fontWeight: 500,
                    transition: "background 0.15s, transform 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#E9BE4E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F0C963"; }}
                >
                  {open ? "✕ " : ""}{t.cta}
                </button>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5, color: "#F8F6F1" }}>
                  {t.sales} {phone}
                </span>
              </div>
            </div>
          </div>

          {/* Photo column — rounded card like the reference */}
          <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16 / 11", background: "#2C3219" }}>
            <img src={image} alt={location ? `HiLink workspace at ${location}` : "HiLink premium workspace in Hanoi"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Expanding form */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ maxWidth: 640, paddingTop: 40 }}>
                <ContactForm showLocationSelect={showLocationSelect}
         dark formType={formType} source={source} defaultInterest={defaultInterest} showInterest={showInterest} location={location} unit={unit} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );

  if (!wrap) return <div style={{ padding: "56px 0" }}>{card}</div>;
  return (
    <section className="section-pad" style={{ padding: "48px 48px 72px", background: "var(--bg)" }}>
      {card}
    </section>
  );
}
