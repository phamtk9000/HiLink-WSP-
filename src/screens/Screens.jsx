import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap, Btn, Chip, Tag, Avatar, Field, AmenityIcon, Icon } from "../components/index.jsx";
import { addLead } from "../data/leadsStore.js";
import { SPACES, GRADIENTS, SPACE_DETAILS, DEFAULT_SPACE_DETAIL } from "../data/mockData.js";

// ─── Space Detail ──────────────────────────────────────────────────────────
const REVIEWS = [
  { name:"Minh Hoang", avatar:"MH", stars:5, date:"Jan 15, 2025", text:"Exceptional. The views and service are unlike anything else in Hanoi." },
  { name:"Jennifer Park", avatar:"JP", stars:5, date:"Jan 8, 2025", text:"Best coworking experience I've had anywhere in Southeast Asia." },
  { name:"Tran Van An", avatar:"TA", stars:4, date:"Dec 20, 2024", text:"Great facilities and professional staff. Highly recommended for client meetings." },
];
// ── SVG amenity icon definitions ──────────────────────────────────────────────
const AMENITY_ICONS = {
  "WiFi": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 18c4.1-4.1 9.7-6.7 15.5-6.7S31.5 13.9 35.5 18" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.5 22.5c2.8-2.8 6.6-4.5 10.5-4.5s7.7 1.7 10.5 4.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 27c1.6-1.6 3.8-2.5 6-2.5s4.4.9 6 2.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="32" r="1.5" fill="#0F0F0F"/>
    </svg>
  ),
  "Coffee": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 10c0-2 2-2 2-4M20 10c0-2 2-2 2-4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 16h18l-2 14H11L9 16z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M27 18h3a3 3 0 0 1 0 6h-3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="31" x2="33" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Phone Booth": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 8c0 4 3 7 3 7l-4 4c0 0 4 10 14 14l4-4c0 0 3 3 7 3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "Printing": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="18" width="18" height="12" rx="1" stroke="#0F0F0F" strokeWidth="1.5"/>
      <path d="M14 18v-6h12v6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="14" y="24" width="12" height="6" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="14" y1="27" x2="26" y2="27" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="29" cy="22" r="1" fill="#0F0F0F"/>
    </svg>
  ),
  "Parking": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="13" stroke="#0F0F0F" strokeWidth="1.5"/>
      <path d="M16 13h6a4 4 0 0 1 0 8h-6V13z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="16" y1="21" x2="16" y2="28" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Reception": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 9v2M12 23h16M20 11a9 9 0 0 1 9 9H11a9 9 0 0 1 9-9z" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="8" y="23" width="24" height="3" rx="1" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="20" y1="26" x2="20" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="31" x2="26" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "A/V Setup": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="24" height="16" rx="1.5" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="16" y1="26" x2="14" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="26" x2="26" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="31" x2="27" y2="31" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="14" y="13" width="12" height="9" rx="0.5" stroke="#0F0F0F" strokeWidth="1.5"/>
    </svg>
  ),
  "Natural Light": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="6" stroke="#0F0F0F" strokeWidth="1.5"/>
      <line x1="20" y1="8" x2="20" y2="11" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="29" x2="20" y2="32" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="20" x2="11" y2="20" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="29" y1="20" x2="32" y2="20" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11.5" y1="11.5" x2="13.6" y2="13.6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26.4" y1="26.4" x2="28.5" y2="28.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28.5" y1="11.5" x2="26.4" y2="13.6" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13.6" y1="26.4" x2="11.5" y2="28.5" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};
// Descriptions for each amenity icon card
const AMENITY_DESCS = {
  "WiFi":          "High-speed 1Gbps fibre throughout.",
  "Coffee":        "Specialty coffee bar, all day.",
  "Phone Booth":   "Private acoustic call booths.",
  "Printing":      "Colour printing and scanning.",
  "Parking":       "Secure on-site parking available.",
  "Reception":     "Dedicated reception and concierge.",
  "A/V Setup":     "4K displays and video conferencing.",
  "Natural Light": "Floor-to-ceiling windows throughout.",
};
const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const HR_TIERS = Array.from({length:24},(_,i)=>i<8||i>18?"off":i>=11&&i<=14?"peak":"std");

/* ── What We Offer — tabbed section (replaces reviews) ── */
const OFFER_TABS = [
  {
    id:"office", label:"HiLink Office",
    img:"/mid/7f697d83c67bd824c915269932304e1e50668dd0-1800x1200.avif.webp",
    desc:"Private offices for teams of 2 to 50, ready to move into tomorrow on flexible terms, with the option to tailor the space to the unique needs of you and your team.",
    points:[
      "Ready-to-use private offices, bespoke design and furnishings available upon request",
      "Flexible licenses, 1-month minimum term, full floor occupancy available with option to scale",
      "24/7 access to your home workspace and business hours access across all HiLink floors",
      "Member discount and priority booking on meeting rooms across our collection",
    ],
    from:"₫45,000,000 /mo", link:"/membership/office",
  },
  {
    id:"roam", label:"HiLink Roam",
    img:"/mid/9a14157465692369d4ceb0727313b5f1dd56d2cd-6500x4334.avif.webp",
    desc:"Flexible hot desk access across all our floors. Switch up your working days in an inspiring, uniquely designed workspace — pay only for the time you use.",
    points:[
      "Hot desk access across all three HiLink floors, any time during opening hours",
      "Pay as you go — by the hour, day, or month with no long-term commitment",
      "Book your preferred floor and zone in advance via the HiLink portal",
      "Full access to specialty coffee, phone booths, printing, and community events",
    ],
    from:"₫89,000 /hr", link:"/membership/roam",
  },
  {
    id:"virtual", label:"HiLink Virtual",
    img:"/mid/761e2d35fafc758157f6414d741bde04927cf465-6720x4480.avif.webp",
    desc:"A prestigious Hanoi business address and professional services without the cost of a full office. Build a credible presence from anywhere in the world.",
    points:[
      "Register your business at our premium OBC 60 Lý Thái Tổ or 15 Tôn Thất Tùng address",
      "Mail handling, signing, and forwarding with email notifications",
      "Dedicated Hanoi business number with call forwarding",
      "5 physical day passes per month for meetings or focused work",
    ],
    from:"₫3,500,000 /mo", link:"/membership/virtual",
  },
  {
    id:"meeting", label:"Meeting rooms",
    img:"/mid/ad7f4d6f9e6ba26fc29098d62b6911062f900bf1-2048x1365.avif.webp",
    desc:"Thoughtfully designed meeting rooms and boardrooms, all equipped with the latest technology to keep your session running smoothly.",
    points:[
      "Boardrooms and meeting rooms for 1 to 40 people across our floors",
      "85″ 4K displays, video conferencing bridge, and wireless presentation",
      "Acoustic treatment and natural light in every room",
      "Book by the hour through the portal — member rates available",
    ],
    from:"₫180,000 /hr", link:"/spaces/meeting-rooms",
  },
];

const WhatWeOffer = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("office");
  const active = OFFER_TABS.find(t=>t.id===tab) || OFFER_TABS[0];
  return (
    <div>
      <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:24 }}>What we offer</h2>
      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid var(--border)", marginBottom:32, flexWrap:"wrap" }}>
        {OFFER_TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"12px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?"var(--text)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:tab===t.id?600:400, color:tab===t.id?"var(--text)":"var(--text-3)", letterSpacing:"0.04em", transition:"all 0.2s", marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {/* Content — animated swap */}
      <AnimatePresence mode="wait">
        <motion.div key={active.id}
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.32, ease:[0.22,1,0.36,1] }}
          style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          {/* Image */}
          <div style={{ overflow:"hidden", height:380 }}>
            <img src={active.img} alt={active.label} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease" }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
          </div>
          {/* Text */}
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:"var(--text)", lineHeight:1.6, marginBottom:28 }}>{active.desc}</p>
            <div style={{ marginBottom:28 }}>
              {active.points.map((p,i)=>(
                <div key={i} style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start" }}>
                  <span style={{ flexShrink:0, marginTop:1 }}><Icon name="check" size={18} stroke="var(--gold)" /></span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.6 }}>{p}</p>
                </div>
              ))}
            </div>
            <button onClick={()=>navigate(active.link)} className="hover-gold-line"
              style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, color:"var(--text)", marginBottom:32, display:"inline-block" }}>
              Discover {active.label} →
            </button>
            <div style={{ borderTop:"1px solid var(--border)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
              <div>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:6 }}>From</p>
                <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.6rem", fontWeight:400, color:"var(--text)" }}>{active.from}<span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-3)" }}> per person</span></p>
              </div>
              <button onClick={()=>navigate(active.link)}
                style={{ padding:"13px 28px", background:"var(--gold)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", borderRadius:24, transition:"background 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--text)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}>
                Make an enquiry
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const space = SPACES.find(s=>s.id===id) || SPACES[0];
  const detail = SPACE_DETAILS[space.id] || DEFAULT_SPACE_DETAIL;

  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [dur, setDur] = useState("Hourly");
  const [hrs, setHrs] = useState(2);
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaseDur, setLeaseDur] = useState("3 months");
  const [booked, setBooked] = useState(false);
  const [enquired, setEnquired] = useState(false);

  const from = location.state?.from?.pathname || "/portal/dashboard";
  const images = detail.images;
  const manager = detail.manager;
  const travel = detail.travel;

  const unitPrice = dur==="Hourly" ? space.price : dur==="Daily" ? (space.pricePerDay||space.price*8) : (space.pricePerMonth||space.price*160);
  const total = unitPrice * (dur==="Hourly"?hrs:1);

  const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const HR_TIERS = Array.from({length:24},(_,i)=>i<8||i>18?"off":i>=11&&i<=14?"peak":"std");

  // Demand data: value 0–1, label
  const DEMAND = [
    { day:"M", val:0.85 }, { day:"T", val:0.4 }, { day:"W", val:0.7 },
    { day:"T", val:0.9  }, { day:"F", val:0.6 }, { day:"S", val:0.2 }, { day:"S", val:0.1 },
  ];

  return (
    <PageWrap>
      <div className="pattern-soft-radial" style={{ paddingTop:64, minHeight:"100vh", background:"var(--bg)" }}>
        {/* Breadcrumb */}
        <div style={{ padding:"12px 48px", borderBottom:"1px solid var(--border)", background:"#FFFFFF", display:"flex", alignItems:"center", gap:8 }}>
          <Link to="/spaces" style={{ fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-3)", textDecoration:"none" }}>Spaces</Link>
          <span style={{ color:"var(--text-3)", fontSize:12 }}>/</span>
          <span style={{ fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-2)" }}>{space.name}</span>
        </div>

        {/* ── PHOTO GRID (Airbnb-style 4-up) ── */}
        <div style={{ background:"#FFFFFF", paddingBottom:0 }}>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"32px 48px 0" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"300px 200px", gap:4, overflow:"hidden" }}>
              {/* Hero image */}
              <div style={{ gridRow:"1 / 3", overflow:"hidden", cursor:"pointer", position:"relative" }} onClick={()=>setLightbox(true)}>
                <img src={images[0]} alt={space.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(15,15,15,0.2),transparent)", pointerEvents:"none" }} />
              </div>
              {/* Right top */}
              <div style={{ overflow:"hidden", cursor:"pointer" }} onClick={()=>{ setActiveImg(1); setLightbox(true); }}>
                <img src={images[1]} alt={`${space.name} — HiLink workspace photo`} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
              </div>
              {/* Right bottom — split into 2 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, overflow:"hidden" }}>
                {images.slice(2,4).map((img,i) => (
                  <div key={i} style={{ overflow:"hidden", cursor:"pointer", position:"relative" }} onClick={()=>{ setActiveImg(i+2); setLightbox(true); }}>
                    <img src={img} alt={`${space.name} — photo ${i + 3}`} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease" }}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                    {i===1 && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(15,15,15,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"#FFFFFF" }}>+{images.length-4} photos</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={()=>setLightbox(true)}
              style={{ marginTop:12, background:"none", border:"none", fontFamily:"'Inter', sans-serif", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text)", borderBottom:"1px solid var(--text)", cursor:"pointer", paddingBottom:1 }}>
              Show all {images.length} photos
            </button>
          </div>
        </div>

        {/* Lightbox — categorized gallery */}
        {lightbox && (() => {
          // Photo categories
          const PHOTO_CATS = [
            { label:"First impressions", desc:"This distinctive workspace is designed to empower your unique workstyle.", imgs: images.slice(0,2).concat(images[2]?[images[2]]:[]) },
            { label:"Step inside",       desc:"Access premium amenities and create your own work-life harmony.", imgs: images.slice(1,3).concat(images[3]?[images[3]]:[]) },
            { label:"Choose your spot",  desc:"An open, communal area where you can catch up on emails, welcome your guests or grab a coffee.", imgs: [images[0],images[2]||images[0],images[1],images[3]||images[1]] },
          ];
          const ALL_CATS = [{ label:"All", desc:"", imgs:images }, ...PHOTO_CATS];
          const activeCat = ALL_CATS.find(c=>c.label===galleryCategory) || ALL_CATS[0];

          return (
            <div style={{ position:"fixed", inset:0, background:"#FFFFFF", zIndex:1000, display:"flex", overflowY:"auto" }} onClick={()=>setLightbox(false)}>
              {/* Left sidebar — categories */}
              <div style={{ width:260, flexShrink:0, background:"var(--bg-2)", borderRight:"1px solid var(--border)", padding:"32px 0", position:"sticky", top:0, height:"100vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                <div style={{ padding:"0 24px 24px", borderBottom:"1px solid var(--border)", marginBottom:16 }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Gallery</p>
                  <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"1.1rem", fontWeight:400, color:"var(--text)" }}>{space.name}</h3>
                </div>
                {ALL_CATS.map(cat => (
                  <button key={cat.label} onClick={()=>setGalleryCategory(cat.label)}
                    style={{ width:"100%", textAlign:"left", padding:"12px 24px", background:galleryCategory===cat.label?"rgba(168,143,92,0.08)":"transparent", border:"none", borderLeft:`3px solid ${galleryCategory===cat.label?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, color:galleryCategory===cat.label?"var(--gold)":"var(--text-2)", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all 0.12s" }}>
                    {cat.label}
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>{cat.imgs.length}</span>
                  </button>
                ))}
                <div style={{ padding:"24px", borderTop:"1px solid var(--border)", marginTop:16 }}>
                  <button onClick={()=>setLightbox(false)} style={{ width:"100%", padding:"10px", background:"var(--text)", border:"none", color:"#FFFFFF", fontFamily:"'Inter',sans-serif", fontSize:12, cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase" }}>Close ×</button>
                </div>
              </div>

              {/* Right — photo grid */}
              <div style={{ flex:1, padding:"48px 56px", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:400, color:"var(--text)", marginBottom:10 }}>{activeCat.label}</h2>
                {activeCat.desc && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"var(--text-3)", marginBottom:32, maxWidth:600, lineHeight:1.7 }}>{activeCat.desc}</p>}
                {/* 2-column masonry grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {activeCat.imgs.map((img, i) => (
                    <div key={i} style={{ overflow:"hidden", cursor:"zoom-in", position:"relative" }}
                      onClick={()=>setActiveImg(i)}>
                      <img src={img} alt={`${activeCat.label} — HiLink Hanoi`} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block", transition:"transform 0.5s ease" }}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"48px 48px", display:"grid", gridTemplateColumns:"1fr 360px", gap:48, alignItems:"start" }}>
          {/* LEFT */}
          <div>
            {/* Title block */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)" }}>{space.type}</span>
                {space.floor && <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", letterSpacing:"0.1em" }}>· Floor {space.floor}</span>}
                <span style={{ fontFamily:"'Inter', sans-serif", fontSize:10, letterSpacing:"0.1em", color: space.availability==="available"?"var(--success)":space.availability==="limited"?"var(--warning)":"var(--danger)" }}>
                  · {space.availability.charAt(0).toUpperCase()+space.availability.slice(1)}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight:400, color:"var(--text)", marginBottom:16, lineHeight:1.1 }}>{space.name}</h1>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:15, color:"var(--text-2)", lineHeight:1.8 }}>{space.description}</p>
            </div>

            {/* Amenities — SVG line icon cards */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.4rem", fontWeight:400, color:"var(--text)", marginBottom:24 }}>Amenities</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {Object.entries(AMENITY_ICONS).map(([name, icon]) => {
                  const active = space.amenities.includes(name);
                  return (
                    <div key={name} className={active ? "hover-lift" : ""} style={{ background:"#FFFFFF", border:"1px solid var(--border)", borderRadius:8, padding:28, display:"flex", flexDirection:"column", alignItems:"center", gap:16, opacity: active?1:0.3, transition:"opacity 0.2s" }}>
                      {icon}
                      <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-2)", lineHeight:1.55, textAlign:"center", margin:0 }}>{AMENITY_DESCS[name]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── TRAVEL LINKS (with mini-map) ── */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, alignItems:"center" }}>
                {/* Left: SVG mini-map */}
                <div style={{ overflow:"hidden", height:340, position:"relative", border:"1px solid var(--border)" }}>
                  <svg viewBox="0 0 500 340" style={{ width:"100%", height:"100%", display:"block" }} xmlns="http://www.w3.org/2000/svg">
                    <rect width="500" height="340" fill="#EDE8DF"/>
                    {/* Water */}
                    <ellipse cx="360" cy="130" rx="70" ry="44" fill="#C5D9E8" stroke="#A8C4D8" strokeWidth="1"/>
                    <text x="360" y="134" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="9" fill="#6A95AF" letterSpacing="0.06em">HOÀN KIẾM LAKE</text>
                    {/* Roads */}
                    <line x1="0" y1="180" x2="500" y2="180" stroke="#D8D0C0" strokeWidth="11" strokeLinecap="round"/>
                    <line x1="180" y1="0" x2="180" y2="340" stroke="#D8D0C0" strokeWidth="8" strokeLinecap="round"/>
                    <line x1="300" y1="0" x2="300" y2="340" stroke="#D8D0C0" strokeWidth="6"/>
                    <line x1="0" y1="250" x2="500" y2="250" stroke="#E2DAC8" strokeWidth="4"/>
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#E2DAC8" strokeWidth="3"/>
                    <line x1="420" y1="0" x2="420" y2="340" stroke="#E2DAC8" strokeWidth="3"/>
                    {/* Road labels */}
                    <text x="60" y="172" fontFamily="'Inter',sans-serif" fontSize="8" fill="#9A907A" letterSpacing="0.08em">HÀNG BÔNG</text>
                    <text x="190" y="280" fontFamily="'Inter',sans-serif" fontSize="8" fill="#9A907A" letterSpacing="0.08em">OLD QUARTER</text>
                    {/* Location pin (HiLink) */}
                    <g transform="translate(180,180)">
                      <ellipse cx="0" cy="30" rx="9" ry="3.5" fill="rgba(0,0,0,0.14)"/>
                      <path d="M0,-30 C12,-30 20,-19 20,-10 C20,3 7,16 0,30 C-7,16 -20,3 -20,-10 C-20,-19 -12,-30 0,-30 Z" fill="var(--gold)"/>
                      <circle cx="0" cy="-9" r="7" fill="rgba(255,255,255,0.92)"/>
                      <text x="0" y="-5.5" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="9" fontWeight="700" fill="var(--gold)">H</text>
                      <g transform="translate(26,-16)">
                        <rect x="0" y="-11" width="62" height="20" rx="2" fill="#1C1710"/>
                        <text x="8" y="3" fontFamily="'Inter',sans-serif" fontSize="9" fontWeight="600" fill="#F8F6F1" letterSpacing="0.06em">HiLink</text>
                      </g>
                    </g>
                    {/* Compass */}
                    <g transform="translate(468,28)">
                      <circle r="16" fill="rgba(248,246,241,0.9)" stroke="#D8D0C0" strokeWidth="1"/>
                      <text x="0" y="-3" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="8" fontWeight="700" fill="#0F0F0F">N</text>
                      <polygon points="0,-13 2,-6 -2,-6" fill="var(--gold)"/>
                    </g>
                  </svg>
                </div>
                {/* Right: travel info */}
                <div style={{ padding:"0 48px" }}>
                  <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:32 }}>Travel links</h2>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Getting here</p>
                  <div style={{ borderTop:"1px solid var(--border)" }}>
                    {travel.map((t,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text)" }}>{t.label}</span>
                        <span style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)", letterSpacing:"0.08em" }}>{t.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── ON-SITE SUPPORT (Image 3 style) ── */}
            <div style={{ marginBottom:40, paddingBottom:40, borderBottom:"1px solid var(--border)", background:"var(--bg-2)", padding:"40px", margin:"0 0 40px" }}>
              <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.8rem", fontWeight:400, color:"var(--text)", marginBottom:8 }}>On-site support</h2>
              <p style={{ fontFamily:"'Inter', sans-serif", fontSize:14, color:"var(--text-3)", letterSpacing:"0.06em", marginBottom:28, fontVariantNumeric:"tabular-nums" }}>
                {manager.hours}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                {/* Avatar circle */}
                <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--bg-3)", border:"1.5px solid var(--border-gold)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:20, fontWeight:400, color:"var(--gold)" }}>{manager.avatar}</span>
                </div>
                <div>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:6 }}>{manager.role}</p>
                  <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"1.1rem", fontWeight:400, color:"var(--text)", marginBottom:4, letterSpacing:"0.04em" }}>{manager.name.toUpperCase()}</p>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-2)" }}>{manager.phone}</p>
                </div>
              </div>
            </div>

            {/* ── WHAT WE OFFER (tabbed section) ── */}
            <WhatWeOffer />
          </div>

          {/* RIGHT — sticky booking panel */}
          <div style={{ position:"sticky", top:80 }}>
            <div style={{ background:"#FFFFFF", border:"1px solid var(--border)", padding:"32px", boxShadow:"0 4px 32px rgba(15,15,15,0.08)" }}>
              {/* Price */}
              <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid var(--border)" }}>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Starting from</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:42, fontWeight:400, color:"var(--gold)" }}>₫{space.price.toLocaleString()}</span>
                  <span style={{ fontFamily:"'Inter', sans-serif", fontSize:13, color:"var(--text-3)" }}>/hr</span>
                </div>
              </div>

              {/* Duration tabs */}
              <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:20 }}>
                {["Hourly","Daily","Monthly"].map(d=>(
                  <button key={d} onClick={()=>setDur(d)} style={{ flex:1, padding:"10px 0", border:"none", borderBottom:`2px solid ${dur===d?"var(--gold)":"transparent"}`, cursor:"pointer", fontFamily:"'Inter', sans-serif", fontSize:11, fontWeight:dur===d?600:400, letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", color:dur===d?"var(--gold)":"var(--text-3)", transition:"all 0.15s", marginBottom:-1 }}>{d}</button>
                ))}
              </div>

              {/* Date */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>{dur === "Monthly" ? "Lease start date" : "Date"}</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
              </div>

              {/* Lease Duration — only for Monthly */}
              <AnimatePresence>
                {dur === "Monthly" && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ overflow:"hidden" }}>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.14em" }}>Lease duration</label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4 }}>
                        {["1 month","3 months","6 months","12 months","24 months","Custom"].map(l=>(
                          <button key={l} onClick={()=>setLeaseDur(l)} style={{ padding:"7px 4px", border:`1px solid ${leaseDur===l?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontSize:10, fontFamily:"'Inter', sans-serif", background:leaseDur===l?"rgba(168,143,92,0.10)":"transparent", color:leaseDur===l?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Number of desks — Daily/Monthly */}
              <AnimatePresence>
                {(dur === "Daily" || dur === "Monthly") && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }} style={{ overflow:"hidden" }}>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Number of desks / offices</label>
                      <input type="number" min={1} max={space.capacity||50} value={hrs} onChange={e=>setHrs(Math.max(1,+e.target.value))}
                        style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time slots */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.14em" }}>Start time</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
                  {TIMES.map(t=>(
                    <button key={t} onClick={()=>setTime(t)} style={{ padding:"7px 4px", border:`1px solid ${time===t?"var(--border-gold)":"var(--border)"}`, cursor:"pointer", fontSize:11, fontFamily:"'Inter', sans-serif", background:time===t?"rgba(168,143,92,0.10)":"transparent", color:time===t?"var(--gold)":"var(--text-3)", transition:"all 0.12s" }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              {dur==="Hourly" && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.14em" }}>Duration (hours)</label>
                  <input type="number" min={1} max={8} value={hrs} onChange={e=>setHrs(Math.max(1,+e.target.value))}
                    style={{ width:"100%", padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", color:"var(--text)", fontFamily:"'Inter', sans-serif", fontSize:14, outline:"none" }} />
                </div>
              )}

              {/* Total */}
              <div style={{ background:"rgba(168,143,92,0.06)", border:"1px solid var(--border-gold)", padding:"16px", marginBottom:20 }}>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:10, color:"var(--text-3)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.14em" }}>Estimated total</p>
                <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-2)", marginBottom:4 }}>
                  {dur==="Hourly" ? `${hrs} hr × ₫${unitPrice.toLocaleString()}` : "Flat rate"}
                </p>
                <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:30, fontWeight:400, color:"var(--gold)" }}>₫{total.toLocaleString()}</p>
              </div>

              {/* Book via payment OR enquiry */}
              {enquired ? (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  style={{ background:"rgba(168,143,92,0.10)", border:"1px solid var(--border-gold)", padding:"20px", textAlign:"center" }}>
                  <p style={{ fontSize:20, marginBottom:8 }}>✉</p>
                  <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:15, color:"var(--text)", marginBottom:6 }}>Enquiry sent!</p>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:12, color:"var(--text-3)" }}>
                    Our team will contact you about {space.name} shortly — no payment taken.
                  </p>
                </motion.div>
              ) : (
                <div style={{ display:"grid", gap:10 }}>
                  <button onClick={() => {
                      addLead({
                        name: "Website visitor",
                        email: "",
                        source: "Website form",
                        interest: `${space.name} · ${space.type}`,
                      });
                      setEnquired(true);
                    }}
                    style={{ width:"100%", padding:"14px", background:"var(--text)", color:"#FFFFFF", border:"none", fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
                    Make an enquiry →
                  </button>
                  <p style={{ fontFamily:"'Inter', sans-serif", fontSize:11, color:"var(--text-3)", textAlign:"center", lineHeight:1.5 }}>
                    Enquire and our team will follow up — no payment taken.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
};
