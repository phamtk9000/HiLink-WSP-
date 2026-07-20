import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PageWrap } from "../components/index.jsx";
import EnquiryBanner from "../components/EnquiryBanner.jsx";
import { useSeo } from "../lib/seo.js";

const img = (p) => { if (!p) return ""; if (/^https?:/.test(p)) return p; let s = p.replace(/^public\//, ""); if (!s.startsWith("/")) s = "/" + s; try { return encodeURI(decodeURI(s)); } catch { return s; } };
const P = (n) => img("/mid/" + n + ".webp");
const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay } });
const anchor = { scrollMarginTop: 80 };

const LogoMark = () => (
  <div style={{ width: 92, height: 92, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
    <img src={"/logo-hilink-lockup.svg"} alt="HiLink" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
  </div>
);

const TEAM = [
  { role: "Founder & CEO", name: "Phạm Gia Khanh", photo: P("ef9cc0f2eae3e1f55e0fd32916c6e81e2bcd7e9f-1000x1500.avif"),
    bio: "With a decade in property and hospitality, Khanh founded HiLink to prove a workspace could feel considered rather than corporate. He leads the company's vision, design standard, and growth across Hanoi." },
  { role: "Head of Operations", name: "Ngọc Lan", photo: P("19664fdfc1b75028ee1c29a5a20eba70b3550e35-1004x1500.avif"),
    bio: "Lan runs the day-to-day across every HiLink floor, holding the bar on service, maintenance, and the member experience that keeps renewal rates high." },
  { role: "Design Lead", name: "Hải Dương", photo: P("3cc3771207592a087306c8dc2cf6376fb6b28183-800x1200.avif"),
    bio: "Hải shapes the look and feel of every space — from lighting and materials to the last detail of a meeting room — translating the HiLink standard into each new site." },
  { role: "Head of Partnerships", name: "Thanh Tùng", photo: P("a665b9317ac3b0e14261cf4defef0b33e698271d-4580x6107.avif"),
    bio: "Tùng builds HiLink's relationships with landlords, brokers, and enterprise clients, turning buildings and briefs into long-term partnerships." },
  { role: "Member Experience", name: "Minh Anh", photo: P("e3356eda275930ce1c6f14429c514ddf996312ae-5342x7123.avif"),
    bio: "Minh Anh leads community and events, making sure every member feels looked after and that the HiLink calendar stays full of reasons to connect." },
];

function TeamSection() {
  const [open, setOpen] = useState(null);
  const sel = open != null ? TEAM[open] : null;
  return (
    <section id="team" style={{ ...anchor, background: "#363D23", padding: "96px 64px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 400, color: "#FFFFFF", letterSpacing: "-0.01em", marginBottom: 56 }}>Our Team</h2>

        <AnimatePresence mode="wait">
          {!sel ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ borderTop: "1px solid rgba(255,255,255,0.16)" }}>
              {TEAM.map((m, i) => (
                <button key={i} onClick={() => setOpen(i)}
                  className="team-row"
                  style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.16)", cursor: "pointer", display: "grid", gridTemplateColumns: "minmax(180px,1fr) 2fr auto", alignItems: "center", gap: 24, padding: "26px 0", textAlign: "left" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>{m.role}</span>
                  <span className="team-name" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.5rem,2.8vw,2.3rem)", fontWeight: 400, color: "#F8F6F1", paddingLeft: 24, borderLeft: "1px solid rgba(255,255,255,0.16)" }}>{m.name}</span>
                  <span className="team-plus" style={{ fontSize: 26, color: "var(--gold)", lineHeight: 1, transition: "color .2s, transform .2s" }}>+</span>
                </button>
              ))}
              <p style={{ textAlign: "right", fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.1rem,1.8vw,1.5rem)", fontWeight: 400, fontStyle: "italic", color: "rgba(248,246,241,0.85)", marginTop: 32 }}>and many other great individuals.</p>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ borderTop: "1px solid rgba(255,255,255,0.16)", paddingTop: 28 }}>
              <div className="team-detail" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", minHeight: 520, justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
                    <div>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 24 }}>{sel.role}</p>
                      <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 400, color: "#F8F6F1", letterSpacing: "-0.01em" }}>{sel.name}</h3>
                    </div>
                    <button onClick={() => setOpen(null)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 28, lineHeight: 1, flexShrink: 0 }}>✕</button>
                  </div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(248,246,241,0.78)", lineHeight: 1.8, maxWidth: 520 }}>{sel.bio}</p>
                </div>
                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "3 / 4", background: "#2C3219", maxHeight: 560 }}>
                  <img src={sel.photo} alt={sel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useSeo({
    title: "About HiLink",
    description: "HiLink builds premium workspaces in Hanoi — sustainable, people-first, and shaping how Vietnam works next.",
  });

  const navigate = useNavigate();
  const { hash } = useLocation();
  useEffect(() => { if (hash) { const el = document.getElementById(hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80); } }, [hash]);

  return (
    <PageWrap>
      <div>

        {/* S1: HERO */}
        <section style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
          <img src={P("ce3706ad314592e4588da9dbc73a6256eed5159a-7195x4802.avif")} alt="HiLink"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)" }} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", bottom: 0, left: 0, padding: "0 64px 80px", maxWidth: 800 }}>
            <h1 className="hero-shadow" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(3.5rem,7vw,6rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, margin: 0 }}>
              Your extraordinary everyday
            </h1>
          </motion.div>
        </section>

        {/* S2: OWN YOUR WORKSTYLE — image L, text R (mission) */}
        <section id="mission" style={{ ...anchor, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }} className="ab-split">
          <div style={{ overflow: "hidden" }}>
            <img src={P("DSC06084(1).jpg")} alt="Workstyle" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <motion.div {...fade()} style={{ background: "var(--surface)", padding: "80px 72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontStyle: "italic", color: "var(--gold)", marginBottom: 12 }}>Own your workstyle</p>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: "var(--text)", marginBottom: 24, lineHeight: 1.15 }}>Where work works for you</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.85 }}>
              Whether you're a quiet seeker, a noise needer, a solo thinker or a social butterfly — HiLink is the office, but not as you know it. Be empowered to do your best work in your own unique way across premium floors in the heart of Hanoi.
            </p>
          </motion.div>
        </section>

        {/* S3: A NEW WORLD OF WORK — text L, image R (origin) */}
        <section id="origin" style={{ ...anchor, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }} className="ab-split">
          <motion.div {...fade()} style={{ background: "var(--bg-2)", padding: "80px 72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontStyle: "italic", color: "var(--gold)", marginBottom: 16 }}>A new world of work</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.85 }}>
              We provide a seamless end-to-end workspace experience, offering beautifully designed private offices for businesses of all sizes that are ready to move in or tailored to suit you. With flexible contracts and three-month minimum terms, you'll pay just one monthly bill including WiFi, utilities, and maintenance. Plus, enjoy access to communal amenities throughout your building: bookable meeting rooms, cafés, coworking areas, private phone booths, and more. We've been a trusted partner of leading businesses in Hanoi since 2021 and will be by your side through every stage of your journey.
            </p>
          </motion.div>
          <div style={{ overflow: "hidden" }}>
            <img src={P("Lounge 2 copy.jpg")} alt="New world" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </section>

        {/* S4: 3-UP FEATURE CARDS (values) */}
        <section id="values" style={{ ...anchor, background: "var(--surface)", padding: "80px 64px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 48 }} className="ab-3col">
            {[
              { img: P("DSC05749.jpg"), h3: "For your unique workstyle", body: "Everyone has their own way of working. From buzzy breakout areas and quiet focus booths to energising fitness areas and calming spaces – it's all here for however you work best." },
              { img: P("Lounge 9 copy.jpg"), h3: "For extraordinary experiences", body: "The HiLink experience is all about ease, so you can focus on what matters most. With curated member events and wellness initiatives, you can shape your own unique company culture while being part of a wider community." },
              { img: P("a57e2c5781bc65cf0e2a061375bf32119341b3b2-2048x1366.avif"), h3: "For progressive thinkers", body: "We're here for businesses of every size, from emerging ventures to global brands. Always innovating, always setting a higher standard — bringing your team together in a consciously designed workspace." },
            ].map((c, i) => (
              <motion.div key={c.h3} {...fade(i * 0.1)}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 16, marginBottom: 24 }}>
                  <img src={c.img} alt={c.h3} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.1rem,1.6vw,1.35rem)", fontWeight: 400, color: "var(--text)", marginBottom: 14, lineHeight: 1.25 }}>{c.h3}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.75 }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* S5: CEO BLOCKQUOTE (vision) */}
        <section id="vision" style={{ ...anchor, background: "var(--bg-2)", padding: "96px 64px", textAlign: "center" }}>
          <motion.div {...fade()}>
            <LogoMark />
            <blockquote style={{ maxWidth: 760, margin: "0 auto" }}>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,2.8vw,2.2rem)", fontStyle: "italic", fontWeight: 400, color: "var(--text)", lineHeight: 1.55, marginBottom: 32 }}>
                "By leading, challenging and setting the standard for what the workspace experience should be, we are energising and empowering people to create their best work in their best way."
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>Pham Gia Khanh</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "var(--text-3)" }}>CEO, HiLink</p>
            </blockquote>
          </motion.div>
        </section>

        {/* S6: MEDIA BANNER */}
        <section style={{ position: "relative", height: 400, overflow: "hidden" }}>
          <img src={P("9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif")} alt="Discover HiLink"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)" }}>Discover HiLink</p>
            <div style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ color: "#FFFFFF", fontSize: 20, marginLeft: 4 }}>▶</span>
            </div>
            <p className="hero-shadow" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontStyle: "italic", color: "#FFFFFF" }}>Where work works for you.</p>
          </div>
        </section>

        {/* S7: 3-COL VARIED ASPECT (people & wellness) */}
        <section id="wellness" style={{ ...anchor, background: "var(--surface)", padding: "80px 64px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, alignItems: "start" }} className="ab-3col">
            {/* Each card opens a related story on the Forum (Insights) page */}
            {[
              { img: P("ef9cc0f2eae3e1f55e0fd32916c6e81e2bcd7e9f-1000x1500.avif"), aspect: "3/4", h3: "Do good, feel good", to: "/forum/workspace-design-focus-productivity", body: "At HiLink, we know that redefining the office experience means creating working environments that are fit for future generations. Through our sustainability and wellness initiatives, we look after both the people in our spaces and the world around us." },
              { img: P("19664fdfc1b75028ee1c29a5a20eba70b3550e35-1004x1500.avif"), aspect: "3/4", h3: "For the future", to: "/forum/future-of-flexible-workspaces-hanoi", body: "We're committed to driving positive change by running our buildings in the most sustainable way possible — 100% renewable electricity, zero waste to landfill, optimised air quality, and products that are kinder to people and planet. When you choose HiLink, every day contributes to a better future." },
              { img: P("DSC06104.jpg"), aspect: "4/3", h3: "For mind, body and soul", to: "/forum/guide-to-productive-remote-work-vietnam", body: "We understand the importance of a happy and healthy team. Our wellness facilities cater for physical and mental health in equal measures — complimentary fitness sessions, monthly bookable classes, personal training, and exclusive discounts." },
            ].map((c, i) => (
              <motion.div key={c.h3} {...fade(i * 0.1)}>
                <Link to={c.to} style={{ textDecoration: "none", display: "block", cursor: "pointer" }}
                  onMouseEnter={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1.04)"; const tl = e.currentTarget.querySelector(".ab-card-link"); if (tl) tl.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1)"; const tl = e.currentTarget.querySelector(".ab-card-link"); if (tl) tl.style.color = "var(--text)"; }}>
                  <div style={{ aspectRatio: c.aspect, overflow: "hidden", marginBottom: 24 }}>
                    <img src={c.img} alt={c.h3} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.1rem,1.6vw,1.35rem)", fontWeight: 400, color: "var(--text)", marginBottom: 14, lineHeight: 1.25 }}>{c.h3}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 20 }}>{c.body}</p>
                  <span className="ab-card-link" style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)", borderBottom: "1px solid currentColor", paddingBottom: 2, transition: "color 0.25s" }}>Read the story →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* S8: SECOND BLOCKQUOTE */}
        <section style={{ background: "var(--surface)", padding: "80px 64px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
          <motion.div {...fade()}>
            <LogoMark />
            <blockquote style={{ maxWidth: 680, margin: "0 auto" }}>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.2rem,2vw,1.7rem)", fontStyle: "italic", fontWeight: 400, color: "var(--text)", lineHeight: 1.6, marginBottom: 28 }}>
                "Our characterful workspaces are uniquely designed to make your everyday extraordinary."
              </p>
            </blockquote>
            <span onClick={() => navigate("/locations")} className="tlink" style={{ fontSize: 13, cursor: "pointer" }}>Discover our spaces →</span>
          </motion.div>
        </section>

        {/* S8b: TEAM — black, expandable rows (role | name | +) → bio + portrait */}
        <TeamSection />

        {/* S9: 5-IMAGE COLLAGE — varied heights (not fixed rectangles) */}
        <div style={{ display: "flex", gap: 4, height: 480, overflow: "hidden" }} className="ab-collage">
          {[
            { src: P("3cc3771207592a087306c8dc2cf6376fb6b28183-800x1200.avif"), tall: true },
            { src: P("DSC05955(1).jpg"), tall: false },
            { src: P("a665b9317ac3b0e14261cf4defef0b33e698271d-4580x6107.avif"), tall: true },
            { src: P("DSC06008.jpg"), tall: false },
            { src: P("e3356eda275930ce1c6f14429c514ddf996312ae-5342x7123.avif"), tall: true },
          ].map((im, i) => (
            <div key={i} style={{ flex: 1, overflow: "hidden", alignSelf: im.tall ? "stretch" : "center", height: im.tall ? "100%" : "70%" }}>
              <img src={im.src} alt={`HiLink workspace in Hanoi ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
            </div>
          ))}
        </div>

        {/* S10: TAILORED DESIGN — text L, 3 stacked images R */}
        <section style={{ background: "var(--bg-2)", padding: "96px 64px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="ab-split">
            <motion.div {...fade()}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontStyle: "italic", color: "var(--gold)", marginBottom: 12 }}>Tailored design</p>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: "var(--text)", marginBottom: 24, lineHeight: 1.1 }}>Tailored to suit your needs</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "var(--text-2)", lineHeight: 1.85 }}>
                From standing desks and acoustic panels to branded walls and plants that boost productivity, our spaces are a canvas for you to transform in your own extraordinary way. Our expert in-house design team will work with you to bring your vision to life.
              </p>
            </motion.div>
            <motion.div {...fade(0.15)} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[P("Meeting room 6 copy.jpg"), P("DSC05809.jpg"), P("Cabin 2 copy.jpg")].map((src, i) => (
                <div key={i} style={{ height: 210, overflow: "hidden" }}>
                  <img src={src} alt={`HiLink custom-designed workspace ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* S11: DUO-PANEL CTA */}
        <section style={{ background: "var(--surface)", padding: 48 }}>
          <div style={{ borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="ab-duo">
            {[
              { img: P("DSC06104.jpg"), title: "Our solutions", body: "Private offices, hybrid memberships, e-Office and enterprise — designed to suit the way you and your team work best.", link: "View solutions →", href: "/solutions" },
              { img: P("BG_HOME.jpg"), title: "Find your perfect space", body: "Explore our floors across Hanoi and find a workspace for your business to call home.", link: "See all locations →", href: "/locations" },
            ].map((p, i) => (
              <div key={i} style={{ position: "relative", minHeight: 480, overflow: "hidden", cursor: "pointer" }}
                onClick={() => navigate(p.href)}
                onMouseEnter={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1)"; }}>
                <img src={p.img} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.70) 0%,rgba(0,0,0,0.2) 55%,transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 40px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 400, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.65, maxWidth: 340, marginBottom: 20 }}>{p.body}</p>
                  <span className="tlink tlink-light" style={{ fontSize: 13 }}>{p.link}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* S12: CONTACT — sage enquiry banner (reference design) */}
        <div id="contact" style={{ ...anchor }}>
          <EnquiryBanner source="About page" showInterest={false} image={P("DSC06104.jpg")} phone="+84 24 3936 9197" />
        </div>

      </div>
    </PageWrap>
  );
}
