import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Avix-style motion toolkit ─────────────────────────────────────────────
   Shared scroll/reveal effects inspired by avix.framer.website:

   <WordReveal>   — paragraph whose words brighten one-by-one as you scroll
   <LineReveal>   — headline lines sliding up out of an overflow mask
   <LetterRise>   — giant wordmark letters rising with a stagger (footer)
   <CircleCTA>    — round "Let's talk ↗" button with hover fill
   useIsTouch()   — coarse-pointer detection (hover effects → in-view)      */

export const useIsTouch = () => {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const upd = () => setTouch(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);
  return touch;
};

/* Scroll-linked word-by-word reveal (the avix statement effect).
   `dim` / `lit` are the before/after colors. Words listed in `accents`
   (case/punctuation-insensitive) light up in gold italic serif. */
export function WordReveal({ text, style, dim = "rgba(248,246,241,0.22)", lit = "#F8F6F1", accents = [], offset = ["start 0.9", "start 0.35"] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const words = String(text).split(" ");
  const accSet = new Set(accents.map(a => a.toLowerCase()));
  const isAcc = (w) => accSet.has(w.toLowerCase().replace(/[.,!?;:—–]/g, ""));
  return (
    <p ref={ref} style={{ ...style }}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} dim={dim}
          lit={isAcc(w) ? "var(--gold)" : lit}
          accent={isAcc(w)}>{w}</Word>
      ))}
    </p>
  );
}
const Word = ({ children, progress, range, dim, lit, accent }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const accStyle = accent ? { fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic" } : {};
  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: "0.28em", ...accStyle }}>
      <span aria-hidden="true" style={{ color: dim }}>{children}</span>
      <motion.span style={{ position: "absolute", left: 0, top: 0, color: lit, opacity }}>{children}</motion.span>
    </span>
  );
};

/* Headline lines sliding up from a mask, staggered. `lines` = array of nodes.
   trigger="mount" animates immediately (reliable for above-the-fold heroes);
   trigger="view" waits for the element to scroll into view. */
export function LineReveal({ lines = [], as = "h1", style, lineStyle, delay = 0, stagger = 0.09, duration = 0.9, once = true, trigger = "view" }) {
  const Tag = motion[as] || motion.h1;
  const anim = trigger === "mount"
    ? { animate: { y: "0%" } }
    : { whileInView: { y: "0%" }, viewport: { once } };
  return (
    <Tag style={style}>
      {lines.map((ln, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "block", willChange: "transform", ...lineStyle }}
            initial={{ y: "115%" }}
            {...anim}
            transition={{ duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {ln}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Giant wordmark: each letter rises out of a mask with a stagger (footer). */
export function LetterRise({ text, style, letterStyle, stagger = 0.045, duration = 1.0, delay = 0, once = false }) {
  return (
    <span aria-label={text} style={{ display: "inline-flex", overflow: "hidden", ...style }}>
      {String(text).split("").map((ch, i) => (
        <motion.span key={i} aria-hidden="true"
          style={{ display: "inline-block", willChange: "transform", ...letterStyle }}
          initial={{ y: "110%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once, amount: 0.4 }}
          transition={{ duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* Round CTA — "LET'S TALK ↗" circle that fills gold on hover. */
export function CircleCTA({ label = "Let's talk", href, onClick, size = 132, dark = true, style, className = "circle-cta" }) {
  const [h, setH] = useState(false);
  const inner = (
    <span className={className}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: size, height: size, borderRadius: "50%",
        display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        border: `1px solid ${dark ? "rgba(248,246,241,0.4)" : "rgba(15,15,15,0.4)"}`,
        background: h ? "var(--gold)" : "transparent",
        color: h ? "#0F0F0F" : (dark ? "#F8F6F1" : "var(--text)"),
        transform: h ? "scale(1.06)" : "scale(1)",
        transition: "background 0.3s, color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s",
        cursor: "pointer", textAlign: "center", flexShrink: 0, ...style,
      }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.4, padding: "0 12px" }}>{label}</span>
      <span aria-hidden="true" style={{ fontSize: 16, transform: h ? "translate(3px,-3px)" : "none", transition: "transform 0.3s" }}>↗</span>
    </span>
  );
  if (href) return <a href={href} onClick={onClick} style={{ textDecoration: "none" }}>{inner}</a>;
  return <button type="button" onClick={onClick} style={{ background: "none", border: "none", padding: 0 }}>{inner}</button>;
}
