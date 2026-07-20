import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap, Icon } from "../components/index.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { getUnit, AMENITIES } from "../data/locations.js";

const T = {
  en: {
    back: "Back to", available: "available", floor: "Floor", area: "Area", capacity: "Capacity",
    seats: "seats", overview: "Overview", included: "What's included", amenities: "Building amenities",
    bookTour: "Book a tour", enquire: "Enquire about this unit", priceNote: "All-inclusive monthly price",
    enquireTitle: "Interested in this unit?", at: "at", photos: "photos",
    incl: ["Fully furnished & move-in ready", "Fibre Wi-Fi, utilities & cleaning included", "Flexible 3–24 month terms", "Branded & configured to your team", "24/7 secure access"],
    inclLabels: { furnished: "Furnished", flexible: "Flexible terms", access: "24/7 access", managed: "Fully managed" },
  },
  vi: {
    back: "Quay lại", available: "trống", floor: "Tầng", area: "Diện tích", capacity: "Sức chứa",
    seats: "chỗ", overview: "Tổng quan", included: "Bao gồm", amenities: "Tiện ích toà nhà",
    bookTour: "Đặt lịch tham quan", enquire: "Hỏi về phòng này", priceNote: "Giá thuê trọn gói hàng tháng",
    enquireTitle: "Quan tâm đến phòng này?", at: "tại", photos: "ảnh",
    incl: ["Nội thất đầy đủ, sẵn sàng vào ở", "Wi-Fi cáp quang, điện nước & vệ sinh", "Điều khoản linh hoạt 3–24 tháng", "Cấu hình & thương hiệu theo đội ngũ", "Ra vào an ninh 24/7"],
    inclLabels: { furnished: "Nội thất", flexible: "Linh hoạt", access: "Ra vào 24/7", managed: "Quản lý trọn gói" },
  },
};

export default function UnitDetail() {
  const { id, unitId } = useParams();
  const { lang } = useLang();
  const t = T[lang];
  const [shot, setShot] = useState(0);
  const res = getUnit(id, unitId);
  if (!res) return <Navigate to={`/locations/${id}`} replace />;
  const { loc, unit } = res;
  const gallery = unit.gallery && unit.gallery.length ? unit.gallery : [unit.img];

  const facts = [
    { icon: "clock", label: unit.status[lang] },
    { icon: "building", label: `${t.floor} ${unit.floor}` },
    { icon: "layers", label: `${unit.area} m²` },
    { icon: "users", label: `${unit.seats} ${t.seats}` },
  ];

  return (
    <PageWrap>
      <div style={{ paddingTop: 64, background: "var(--surface)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 48px 80px" }}>
          {/* Breadcrumb */}
          <Link to={`/locations/${loc.id}`} style={{ display: "inline-block", marginBottom: 22, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none" }}>← {t.back} {loc.name}</Link>

          {/* Gallery */}
          <div className="unit-gallery" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 40 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderRadius: 6, overflow: "hidden", aspectRatio: "16 / 11", background: "var(--bg-2)" }}>
              <img src={gallery[shot]} alt={`Unit ${unit.number}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
              {gallery.slice(1, 3).map((g, i) => (
                <div key={i} onClick={() => setShot(i + 1)} style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "var(--bg-2)" }}>
                  <img src={g} alt={`Unit ${unit.number} — photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Body: details + sticky enquiry */}
          <div className="unit-body" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 56, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>{loc.name} · {loc.district}</p>
              <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.6rem,5vw,4rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1, marginBottom: 24 }}>{unit.number}</h1>

              {/* Fact row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", paddingBottom: 28, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
                {facts.map((f, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text)" }}>
                    <Icon name={f.icon} size={17} stroke="var(--gold)" />{f.label}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text)", marginBottom: 14 }}>{t.overview}</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 40, maxWidth: 620 }}>{unit.desc[lang]}</p>

              {/* What's included */}
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text)", marginBottom: 18 }}>{t.included}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 40 }} className="unit-incl">
                {t.incl.map((it, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.5 }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}><Icon name="check" size={16} stroke="var(--gold)" /></span>{it}
                  </span>
                ))}
              </div>

              {/* Building amenities */}
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text)", marginBottom: 18 }}>{t.amenities}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 22px" }}>
                {(loc.amenityKeys || []).filter(k => AMENITIES[k]).map(k => (
                  <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "var(--text-3)" }}>
                    <Icon name={AMENITIES[k].icon} size={17} stroke="var(--gold)" />{AMENITIES[k].label[lang]}
                  </span>
                ))}
              </div>
            </div>

            {/* Sticky enquiry card */}
            <div className="unit-aside" style={{ position: "sticky", top: 88, border: "1px solid var(--border)", borderRadius: 6, padding: 28, background: "var(--bg)" }}>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.9rem", fontWeight: 400, color: "var(--text)", lineHeight: 1 }}>{unit.price[lang]}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "var(--text-3)", marginTop: 6, marginBottom: 20 }}>{t.priceNote}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
                {facts.map((f, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text-2)" }}>
                    <Icon name={f.icon} size={15} stroke="var(--text-3)" />{f.label}
                  </span>
                ))}
              </div>
              <button type="button" className="btn" data-variant="dark" style={{ width: "100%", marginBottom: 10 }}
                onClick={() => document.getElementById("unit-enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" })}>{t.bookTour}</button>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-3)", textAlign: "center", marginTop: 16 }}><a href={`tel:${loc.phone.replace(/\s/g, "")}`} style={{ color: "inherit", textDecoration: "none" }}>{loc.phone}</a></p>
            </div>
          </div>

          {/* Enquiry form */}
          <div id="unit-enquiry" style={{ marginTop: 72, scrollMarginTop: 84, background: "#363D23", borderRadius: 16, padding: "clamp(28px,4vw,56px)" }}>
            <div className="unit-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.7rem,3vw,2.4rem)", fontWeight: 400, color: "#F8F6F1", lineHeight: 1.1, marginBottom: 16 }}>{t.enquireTitle}</h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(248,246,241,0.75)", lineHeight: 1.7, maxWidth: 360 }}>{`${unit.number} ${t.at} ${loc.name}, ${loc.district}.`}</p>
              </div>
              <ContactForm dark formType="unit" source={`Unit ${unit.number} · ${loc.name}`} showInterest={false} defaultInterest="Private Workspaces" location={`${unit.number} · ${loc.name}`} unit={unit.number} />
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
