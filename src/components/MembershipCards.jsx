import { useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useLang } from "../context/LanguageContext.jsx";
import { LineReveal, WordReveal, useIsTouch } from "./motionFx.jsx";

/* ── HiLink Business Club — membership card showcase ───────────────────────
   Dark editorial section presenting the three physical membership cards.
   Cards flip front→back in 3D on hover (desktop) or tap (touch), with a
   subtle mouse tilt, staggered rise-in, and avix-style text reveals.       */

const T = {
  en: {
    eyebrow: "HiLink Business Club",
    lines: ["One card.", "Every door."],
    body: "Every HiLink membership comes with a Business Club card — your key to our workspaces, lounges, member events and partner privileges across Hanoi. Three tiers, one extraordinary standard.",
    flip: "Hover to flip", tap: "Tap to flip",
    tiers: {
      club:      { name: "Club",      d: "The essential membership. Workspace access, member rates on rooms, and the HiLink community calendar." },
      premier:   { name: "Premier",   d: "For residents and teams. Priority booking, guest passes, and lounge access across every location." },
      executive: { name: "Executive", d: "By invitation. Concierge service, event hosting privileges, and access to the private Business Club floor." },
    },
  },
  vi: {
    eyebrow: "HiLink Business Club",
    lines: ["Một tấm thẻ.", "Mọi cánh cửa."],
    body: "Mỗi thành viên HiLink đều nhận thẻ Business Club — chìa khoá mở không gian làm việc, lounge, sự kiện thành viên và đặc quyền đối tác khắp Hà Nội. Ba hạng thẻ, một chuẩn mực khác biệt.",
    flip: "Di chuột để lật", tap: "Chạm để lật",
    tiers: {
      club:      { name: "Club",      d: "Hạng thẻ thiết yếu. Truy cập không gian làm việc, giá thành viên cho phòng họp và lịch cộng đồng HiLink." },
      premier:   { name: "Premier",   d: "Cho cư dân và đội nhóm. Ưu tiên đặt chỗ, vé khách mời và lounge tại mọi địa điểm." },
      executive: { name: "Executive", d: "Chỉ theo lời mời. Dịch vụ concierge, đặc quyền tổ chức sự kiện và tầng Business Club riêng tư." },
    },
  },
};

const CARDS = [
  /* Club uses the personalised sample so visitors see a real, issued card */
  { id: "club",      front: "/business-club/sample-front.webp",    back: "/business-club/sample-back.webp" },
  { id: "premier",   front: "/business-club/premier-front.webp",   back: "/business-club/premier-back.webp" },
  { id: "executive", front: "/business-club/executive-front.webp", back: "/business-club/executive-back.webp" },
];

function FlipCard({ card, tier, i, touch, hint }) {
  const [flip, setFlip] = useState(false);
  /* tilt runs on motion values + springs — zero React re-renders per mousemove */
  const tx = useMotionValue(0);
  const tz = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 180, damping: 22 });
  const sz = useSpring(tz, { stiffness: 180, damping: 22 });
  const flipDeg = useMotionValue(0);
  const sFlip = useSpring(flipDeg, { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`rotateY(${sFlip}deg) rotateX(${sx}deg) rotateZ(${sz}deg)`;

  const setFlipTo = (v) => { setFlip(v); flipDeg.set(v ? 180 : 0); };
  const onMove = (e) => {
    if (touch) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx.set(py * -8); tz.set(px * 1.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 1.0, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: "center" }}>
      <div
        role="button" tabIndex={0} aria-label={`${tier.name} membership card`}
        onMouseEnter={() => !touch && setFlipTo(true)}
        onMouseLeave={() => { if (!touch) { setFlipTo(false); tx.set(0); tz.set(0); } }}
        onMouseMove={onMove}
        onClick={() => touch && setFlipTo(!flip)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipTo(!flip); } }}
        style={{ perspective: 1200, cursor: "pointer", outline: "none" }}>
        <motion.div style={{
          position: "relative", width: "100%", aspectRatio: "1011 / 638",
          transformStyle: "preserve-3d",
          transform,
          willChange: "transform",
        }}>
          {/* front */}
          <img src={card.front} alt={`${tier.name} card front`} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 14, boxShadow: "0 34px 68px -26px rgba(0,0,0,0.75)" }} />
          {/* back */}
          <img src={card.back} alt={`${tier.name} card back`} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 14, boxShadow: "0 34px 68px -26px rgba(0,0,0,0.75)", transform: "rotateY(180deg)" }} />
        </motion.div>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "1.6rem", fontWeight: 400, color: "var(--gold)", margin: "26px 0 10px" }}>{tier.name}</h3>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "rgba(248,246,241,0.6)", lineHeight: 1.65, maxWidth: 300, margin: "0 auto" }}>{tier.d}</p>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(248,246,241,0.32)", marginTop: 12 }}>{hint}</p>
    </motion.div>
  );
}

export default function MembershipCards() {
  const { lang } = useLang();
  const t = T[lang];
  const touch = useIsTouch();
  const hint = touch ? t.tap : t.flip;

  return (
    <section style={{ background: "#101208", position: "relative", overflow: "hidden" }} className="section-pad">
      {/* ambient gold glow + arcs */}
      <div aria-hidden="true" style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,143,92,0.10) 0%, transparent 62%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -260, right: -200, width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(168,143,92,0.16)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "104px 48px 112px", position: "relative" }}>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 22, textAlign: "center" }}>{t.eyebrow}</motion.p>
        <LineReveal as="h2"
          lines={[t.lines[0], <em key="i" style={{ fontStyle: "italic", color: "var(--gold)" }}>{t.lines[1]}</em>]}
          style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 400, color: "#F8F6F1", fontSize: "clamp(2.6rem,6vw,4.6rem)", lineHeight: 1.05, textAlign: "center", marginBottom: 30 }}
        />
        <WordReveal text={t.body}
          style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 76px", textAlign: "center" }} />
        <div className="bc-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "56px 44px", alignItems: "start" }}>
          {CARDS.map((c, i) => <FlipCard key={c.id} card={c} tier={t.tiers[c.id]} i={i} touch={touch} hint={hint} />)}
        </div>
      </div>
    </section>
  );
}
