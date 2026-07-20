import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import { ARTICLES } from "../data/mockData.js";
import { useSeo, articleLd, breadcrumbLd } from "../lib/seo.js";
import { rs, SIZES } from "../lib/img.js";

const CATEGORIES = ["All","Insight","Guide","Member Story","Design","Neighbourhood"];


/* ── Forum — "Insights" listing, avix-style dark editorial ──────────────
   Header: eyebrow left, two-tone statement right. Below: filter tabs and a
   two-column card grid — large image with hover zoom, category tag, bold
   title, excerpt, and a VIEW POST rule-row with a travelling arrow.      */

const INK = "#F8F6F1";
const CARD_EASE = [0.16, 1, 0.3, 1];

const InsightCard = ({ a, i }) => {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (i % 2) * 0.1, ease: CARD_EASE }}>
      <Link to={`/forum/${a.slug}`} style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        <div style={{ overflow: "hidden", aspectRatio: "16 / 10", marginBottom: 26, borderRadius: 2 }}>
          <img {...rs(a.image, SIZES.half)} alt={a.title} loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: h ? "scale(1.05)" : "scale(1)", filter: h ? "brightness(0.92)" : "brightness(1)",
              transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1), filter 0.5s" }} />
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{a.category} · {a.readTime}</p>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.4rem,2.3vw,1.9rem)", fontWeight: 650, color: INK, lineHeight: 1.18, letterSpacing: "-0.01em", marginBottom: 14 }}>{a.title}</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "rgba(248,246,241,0.55)", lineHeight: 1.7, marginBottom: 24, maxWidth: 560 }}>{a.excerpt}</p>
        <div style={{ borderTop: `1px solid ${h ? "var(--gold)" : "rgba(248,246,241,0.2)"}`, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "border-color 0.3s" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: h ? "var(--gold)" : "rgba(248,246,241,0.7)", transition: "color 0.3s" }}>View post</span>
          <span aria-hidden="true" style={{ color: h ? "var(--gold)" : "rgba(248,246,241,0.5)", transform: h ? "translate(4px,-4px)" : "none", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.3s", fontSize: 16 }}>↗</span>
        </div>
      </Link>
    </motion.div>
  );
};

export function ForumPage() {
  useSeo({
    title: "Insights",
    description: "Ideas, trends and perspectives on workspace, design and doing business in Hanoi — from the HiLink team.",
  });
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? ARTICLES : ARTICLES.filter(a => a.category === cat);

  return (
    <PageWrap>
      <div style={{ paddingTop: 64, background: "#0F0F0F", minHeight: "100vh" }}>
        {/* ── Header: eyebrow left · two-tone statement right (avix) ── */}
        <section className="frm-head" style={{ maxWidth: 1360, margin: "0 auto", padding: "72px 48px 56px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px 64px", alignItems: "start" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>Insights</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: CARD_EASE, delay: 0.1 }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.5rem,2.6vw,2.1rem)", fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em", maxWidth: 860 }}>
            <span style={{ color: INK }}>Explore ideas, trends, and perspectives on workspace, design, and doing business in Hanoi. </span>
            <span style={{ color: "rgba(248,246,241,0.45)" }}>We share insights to inspire better decisions about how your team works.</span>
          </motion.h1>
        </section>

        {/* ── Category tabs ── */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px 44px", display: "flex", gap: 26, flexWrap: "wrap", borderBottom: "1px solid rgba(248,246,241,0.12)" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 16px", position: "relative",
                fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                color: cat === c ? "var(--gold)" : "rgba(248,246,241,0.45)", transition: "color 0.25s" }}
              onMouseEnter={e => { if (cat !== c) e.currentTarget.style.color = INK; }}
              onMouseLeave={e => { if (cat !== c) e.currentTarget.style.color = "rgba(248,246,241,0.45)"; }}>
              {c}
              <span aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: "var(--gold)", transform: cat === c ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }} />
            </button>
          ))}
        </div>

        {/* ── Cards grid ── */}
        <section className="frm-grid" style={{ maxWidth: 1360, margin: "0 auto", padding: "56px 48px 110px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px 56px" }}>
          {filtered.map((a, i) => <InsightCard key={a.id} a={a} i={i} />)}
          {filtered.length === 0 && (
            <p style={{ fontFamily: "'Inter',sans-serif", color: "rgba(248,246,241,0.5)", gridColumn: "1 / -1" }}>No posts in this category yet.</p>
          )}
        </section>
      </div>
    </PageWrap>
  );
}


/* ── Article detail page ─────────────────────────────────────────────── */
export function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug);

  /* Unconditional hook — noindex the not-found state instead of 200-ing it. */
  useSeo(article ? {
    title: article.title,
    description: article.excerpt,
    image: article.image,
    type: "article",
    jsonLd: [
      articleLd(article),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Forum", path: "/forum" },
        { name: article.title, path: `/forum/${article.slug}` },
      ]),
    ],
  } : { title: "Article not found", noindex: true });

  if (!article) return (
    <PageWrap>
      <div style={{ paddingTop:64, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"2rem", color:"var(--text)", marginBottom:16 }}>Story not found</h2>
          <Link to="/forum" style={{ color:"var(--gold)", fontFamily:"'Inter', sans-serif", fontSize:13 }}>← Back to The Forum</Link>
        </div>
      </div>
    </PageWrap>
  );

  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0,2);

  return (
    <PageWrap>
      <div style={{ paddingTop:64, background:"var(--bg)" }}>
        {/* Back */}
        <div style={{ background:"#FFFFFF", borderBottom:"1px solid var(--border)", padding:"16px 64px" }}>
          <Link to="/forum" style={{ fontFamily:"'Inter', sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-3)", textDecoration:"none" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--text-3)"}>
            ← The Forum
          </Link>
        </div>

        {/* Article header */}
        <section style={{ background:"#FFFFFF", padding:"64px 64px 0" }}>
          <div style={{ maxWidth:780, margin:"0 auto" }}>
            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:28 }}>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", margin:0 }}>{article.category}</p>
              <span style={{ color:"var(--border)" }}>·</span>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)" }}>{article.readTime}</span>
              <span style={{ color:"var(--border)" }}>·</span>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)" }}>{article.date}</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(2rem, 4vw, 3.2rem)", fontWeight:400, color:"var(--text)", lineHeight:1.1, marginBottom:24 }}>{article.title}</h1>
            <p style={{ fontFamily:"'Inter', sans-serif", fontSize:18, color:"var(--text-2)", lineHeight:1.7, marginBottom:48, fontStyle:"italic" }}>{article.excerpt}</p>
          </div>
        </section>

        {/* Hero image */}
        <div style={{ height:480, overflow:"hidden" }}>
          <img src={article.image} alt={article.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>

        {/* Body */}
        <section style={{ background:"#FFFFFF", padding:"64px 64px 80px" }}>
          <div style={{ maxWidth:780, margin:"0 auto" }}>
            {article.body.split("\n\n").map((para, i) => (
              <motion.p key={i}
                initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.04 }}
                style={{ fontFamily:"'Inter', sans-serif", fontSize:16, color:"var(--text-2)", lineHeight:1.85, marginBottom:28 }}>
                {para}
              </motion.p>
            ))}
            <div style={{ paddingTop:40, borderTop:"1px solid var(--border)", marginTop:16 }}>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-3)" }}>
                Written by <strong style={{ color:"var(--text)" }}>{article.author}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ background:"var(--bg-2)", borderTop:"1px solid var(--border)", padding:"64px 64px" }}>
            <div style={{ maxWidth:1400, margin:"0 auto" }}>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:40 }}>More stories</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
                {related.map(a => (
                  <Link key={a.id} to={`/forum/${a.slug}`} style={{ textDecoration:"none" }}>
                    <div style={{ cursor:"pointer" }}
                      onMouseEnter={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.04)";}}
                      onMouseLeave={e=>{const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";}}>
                      <div style={{ height:200, overflow:"hidden", marginBottom:16 }}>
                        <img src={a.image} alt={a.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }} />
                      </div>
                      <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontStyle:"italic", color:"var(--gold)", marginBottom:8 }}>{a.category}</p>
                      <h3 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.15rem", fontWeight:400, color:"var(--text)", lineHeight:1.2 }}>{a.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageWrap>
  );
}
