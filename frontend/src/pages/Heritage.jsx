// ══════════════════════════════════════════════════════════════════
//  MANICKBAG AUTOMOBILES — HERITAGE SECTION
//  Now uses shared Layout component — nav/footer auto-syncs
//  across all pages when Layout.jsx is updated.
//
//  HOW TO ADD YOUR IMAGES:
//  Search for src="" in this file — each one is a photo placeholder.
//  Replace the empty string with your image URL, e.g.:
//    src="https://yoursite.com/images/founding-1913.jpg"
//
//  App.jsx route (already correct):
//    <Route path="/heritage/*" element={<Heritage />} />
// ══════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import Layout from "./Layout";   // ← shared nav + footer + ticker

// ─── BRAND TOKENS ────────────────────────────────────────────────
const BRAND = {
  navy:        "#0a1628",
  navyMid:     "#0c1f3f",
  navyLight:   "#1a3d7c",
  gold:        "#b8963e",
  goldLight:   "#d4af5a",
  goldPale:    "#f0e4c2",
  white:       "#ffffff",
  offWhite:    "#f7f5f0",
  muted:       "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
  sepia:       "#c8a96e",
};

const W = { width: "100%", padding: "0 48px" };

// ─── HERITAGE-SPECIFIC STYLES ─────────────────────────────────────
// Only styles NOT already in Layout.jsx go here
const HeritageStyles = () => (
  <style>{`
    @keyframes scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .anim-scaleIn { animation: scaleIn 0.7s ease forwards; }

    .cormorant-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; }

    ::-webkit-scrollbar-track { background: #f7f5f0; }

    .photo-frame { position: relative; display: inline-block; width: 100%; }
    .photo-frame::before {
      content: ''; position: absolute; inset: -8px;
      border: 1px solid rgba(184,150,62,0.3);
      pointer-events: none; z-index: 10;
    }
    .photo-frame::after {
      content: ''; position: absolute;
      top: 8px; left: 8px; right: -8px; bottom: -8px;
      background: rgba(184,150,62,0.08); z-index: -1;
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px; line-height: 0.7;
      color: rgba(184,150,62,0.15);
      position: absolute; top: 20px; left: 20px;
    }

    /* Heritage sub-nav */
    .heritage-subnav-link {
      display: flex; align-items: center; gap: 8px;
      padding: 0 24px; height: 100%; text-decoration: none;
      font-size: 12px; font-weight: 500; letter-spacing: 0.1em;
      text-transform: uppercase; transition: all 0.3s ease;
    }
    .heritage-subnav-link:hover { color: rgba(255,255,255,0.8) !important; }
  `}</style>
);

// ══════════════════════════════════════════════════════════════════
//  HERITAGE SUB-NAV
//  Sticky below the main navbar (138px header = paddingTop of Layout)
// ══════════════════════════════════════════════════════════════════
const HeritageSubNav = () => {
  const location = useLocation();
  const tabs = [
    { label: "Our Story",           path: "/heritage",             icon: "📜" },
    { label: "Shah & Mirji Legacy", path: "/heritage/legacy",      icon: "👑" },
    { label: "Milestones",          path: "/heritage/milestones",  icon: "🏛" },
    { label: "Leadership",          path: "/heritage/leadership",  icon: "👤" },
  ];
  return (
    <div style={{
      background: BRAND.navy,
      borderBottom: `1px solid ${BRAND.borderLight}`,
      position: "sticky",
      top: 72,     // sticks just below the scrolled navbar (72px)
      zIndex: 800,
      width: "100%",
    }}>
      <div style={{ ...W, display: "flex", gap: 0, alignItems: "center", height: 52 }}>
        {tabs.map(tab => {
          const isActive =
            location.pathname === tab.path ||
            (tab.path === "/heritage" && location.pathname === "/heritage/");
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className="heritage-subnav-link"
              style={{
                color: isActive ? BRAND.gold : "rgba(255,255,255,0.5)",
                borderBottom: isActive ? `2px solid ${BRAND.gold}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE HERO — HERITAGE VARIANT
// ══════════════════════════════════════════════════════════════════
const HeritageHero = ({ tag, headline, sub }) => (
  <section style={{
    background: `linear-gradient(135deg,#050d1a 0%,#0c1f3f 55%,#0a1628 100%)`,
    paddingTop: 80, paddingBottom: 80,
    position: "relative", overflow: "hidden", width: "100%",
  }}>
    <div style={{ position:"absolute",right:"-5%",top:"5%",width:500,height:500,border:"1px solid rgba(184,150,62,0.07)",borderRadius:"50%" }}/>
    <div style={{ position:"absolute",right:"5%",top:"15%",width:320,height:320,border:"1px solid rgba(184,150,62,0.12)",borderRadius:"50%" }}/>
    <div style={{ position:"absolute",left:"-80px",bottom:"-80px",width:360,height:360,border:"1px solid rgba(184,150,62,0.05)",borderRadius:"50%" }}/>
    {[...Array(7)].map((_,i)=>(
      <div key={i} style={{position:"absolute",width:3,height:3,borderRadius:"50%",background:BRAND.gold,opacity:0.25,left:`${10+i*13}%`,top:`${30+(i%3)*20}%`,animation:`pulse ${2+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}/>
    ))}
    <div style={{ position:"absolute",right:48,top:"50%",transform:"translateY(-50%) rotate(90deg)",fontSize:10,letterSpacing:"0.3em",color:"rgba(184,150,62,0.3)",textTransform:"uppercase" }}>
      Since 1913 · Kalaburagi · Karnataka
    </div>
    <div style={{ position:"relative",zIndex:2,...W }}>
      <div className="anim-fadeIn" style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:24,opacity:0,animationDelay:"0.1s" }}>
        <div style={{ width:32,height:1,background:BRAND.gold }}/>
        <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,fontWeight:500 }}>{tag}</span>
        <div style={{ width:32,height:1,background:BRAND.gold }}/>
      </div>
      <h1 className="cormorant anim-fadeUp" style={{ fontSize:"clamp(44px,6.5vw,84px)",fontWeight:300,lineHeight:1.05,color:BRAND.white,maxWidth:720,opacity:0,animationDelay:"0.2s",whiteSpace:"pre-line" }}>
        {headline}
      </h1>
      <div style={{ width:60,height:2,background:`linear-gradient(90deg,${BRAND.gold},transparent)`,margin:"28px 0" }}/>
      {sub && (
        <p className="anim-fadeUp" style={{ fontSize:17,lineHeight:1.8,color:"rgba(255,255,255,0.6)",maxWidth:560,opacity:0,animationDelay:"0.4s" }}>
          {sub}
        </p>
      )}
      <div className="anim-fadeUp" style={{ display:"flex",gap:8,alignItems:"center",marginTop:36,opacity:0,animationDelay:"0.5s" }}>
        <Link to="/" style={{ fontSize:12,color:"rgba(255,255,255,0.35)",textDecoration:"none",letterSpacing:"0.08em" }}>Home</Link>
        <span style={{ color:BRAND.gold,fontSize:10 }}>›</span>
        <span style={{ fontSize:12,color:BRAND.gold,letterSpacing:"0.08em" }}>Heritage</span>
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  OldPhoto — IMAGE COMPONENT
// ══════════════════════════════════════════════════════════════════
const OldPhoto = ({ src, label, year, style = {}, objectPos = "center top" }) => {
  const [hovered,     setHovered]     = useState(false);
  const [loaded,      setLoaded]      = useState(false);
  const [error,       setError]       = useState(false);
  const [aspectRatio, setAspectRatio] = useState("4/3");

  const handleLoad = (e) => {
    const img = e.target;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
    }
    setLoaded(true);
  };

  return (
    <div
      className="photo-frame"
      style={{ position:"relative", ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width:"100%",
        aspectRatio: loaded ? aspectRatio : "4/3",
        position:"relative", overflow:"hidden",
        background:"#0f0d0a", display:"block",
        transition:"aspect-ratio 0.3s ease",
      }}>
        {/* Loading skeleton */}
        {!loaded && !error && src && (
          <div style={{ position:"absolute",inset:0,zIndex:1,background:"linear-gradient(135deg,#1a1410,#2a2018,#1a1410)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12 }}>
            <div style={{ width:28,height:28,border:"2px solid rgba(184,150,62,0.2)",borderTopColor:"#b8963e",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
            <div style={{ fontSize:10,color:"rgba(184,150,62,0.4)",letterSpacing:"0.15em",textTransform:"uppercase" }}>Loading</div>
          </div>
        )}

        {/* Empty / no src */}
        {!src && (
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1814,#0f0d0a)",gap:12 }}>
            <div style={{ fontSize:32,opacity:0.3 }}>🖼</div>
            <div style={{ fontSize:10,color:"rgba(184,150,62,0.35)",letterSpacing:"0.2em",textTransform:"uppercase",textAlign:"center",padding:"0 20px" }}>Add src="" URL<br />to show photo</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1814,#0f0d0a)",gap:10 }}>
            <div style={{ fontSize:28,opacity:0.3 }}>⚠</div>
            <div style={{ fontSize:10,color:"rgba(200,100,80,0.5)",letterSpacing:"0.15em",textTransform:"uppercase",textAlign:"center",padding:"0 16px" }}>Image could not load</div>
          </div>
        )}

        {/* Actual image */}
        {src && (
          <img
            src={src} alt={label || "Heritage photo"}
            onLoad={handleLoad} onError={() => setError(true)}
            style={{
              position:"absolute",inset:0,width:"100%",height:"100%",
              objectFit:"cover", objectPosition:objectPos, display:"block",
              opacity: loaded ? 1 : 0,
              transition:"opacity 0.6s ease, filter 0.5s ease",
              filter: hovered
                ? "grayscale(25%) contrast(1.04) brightness(1.02) sepia(8%)"
                : "grayscale(78%) contrast(1.1) brightness(0.92) sepia(22%)",
            }}
          />
        )}

        {/* Film grain */}
        <div style={{ position:"absolute",inset:0,zIndex:3,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.055) 0px,rgba(0,0,0,0.055) 1px,transparent 1px,transparent 4px)" }}/>
        {/* Vignette */}
        <div style={{ position:"absolute",inset:0,zIndex:4,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 45%,transparent 28%,rgba(0,0,0,0.62) 100%)" }}/>
        {/* Corner burns */}
        <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",background:"radial-gradient(ellipse at 0% 0%,rgba(0,0,0,0.28) 0%,transparent 48%)" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",background:"radial-gradient(ellipse at 100% 100%,rgba(0,0,0,0.22) 0%,transparent 48%)" }}/>

        {/* Hover caption */}
        {(label || year) && (
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,zIndex:7,
            padding:"36px 16px 14px",
            background:"linear-gradient(transparent,rgba(10,8,4,0.92))",
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            opacity: hovered ? 1 : 0,
            transition:"all 0.35s ease",
          }}>
            {label && <div style={{ fontSize:12,fontWeight:600,color:"#f0e8d0",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",lineHeight:1.3,marginBottom:4 }}>{label}</div>}
            {year  && <div style={{ fontSize:10,color:"#c8a96e",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif" }}>{year}</div>}
          </div>
        )}

        {/* Always-visible year badge */}
        {year && (
          <div style={{
            position:"absolute",bottom:10,right:10,zIndex:7,
            padding:"3px 9px",background:"rgba(10,8,4,0.68)",
            border:"1px solid rgba(184,150,62,0.38)",
            fontSize:9,color:"#c8a96e",letterSpacing:"0.12em",
            fontFamily:"'Jost',sans-serif",
            opacity: hovered ? 0 : 1, transition:"opacity 0.3s",
          }}>{year}</div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE 1: OUR STORY
// ══════════════════════════════════════════════════════════════════
const OurStory = () => (
  <>
    <section style={{ background:BRAND.white,padding:"80px 0 60px",width:"100%" }}>
      <div style={W}>
        <div style={{ maxWidth:800,margin:"0 auto",textAlign:"center" }}>
          <div className="cormorant-italic anim-fadeIn" style={{ fontSize:"clamp(24px,3vw,36px)",fontWeight:300,color:BRAND.navyMid,lineHeight:1.6,position:"relative",padding:"40px 60px",opacity:0 }}>
            <span className="quote-mark">"</span>
            "What began in 1913 as the shared vision of two families — the Shahs and the Mirjis — grew into one of North Karnataka's most enduring business legacies. From rice mills to diesel engines to TATA electric vehicles, one principle has never changed: <span className="gold-shimmer" style={{ fontStyle:"normal",fontWeight:600 }}>integrity over everything.</span>"
          </div>
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.offWhite,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }}>
          <div className="anim-fadeUp" style={{ opacity:0,animationDelay:"0.1s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Beginning · 1913</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>Two Visionaries,<br />One Bold Dream</h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>In 1913, <strong style={{ color:BRAND.navyMid }}>Mr. Manickchand Shah</strong> and <strong style={{ color:BRAND.navyMid }}>Mr. Dharmappa Mirji</strong> joined hands in Kalaburagi with a resolve that would outlast empires and epochs. They were not merely businessmen — they were builders of community.</p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>Their journey began with <strong style={{ color:BRAND.navyMid }}>rice mills and a soap factory</strong>. As the region's needs evolved, so did Manickbag, diversifying into <strong style={{ color:BRAND.navyMid }}>groundnut oil manufacturing and export</strong>, building trade routes that extended well beyond Karnataka's borders.</p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted }}>Their story is one of patient, principled enterprise, built brick by brick over more than a century.</p>
          </div>
          <div className="anim-scaleIn" style={{ opacity:0,animationDelay:"0.3s" }}>
            <OldPhoto src="https://manickbag.in/images/FOUNDERS.jpg" label="The Founding Partners" year="1913"/>
            <div style={{ marginTop:16,padding:"16px 20px",background:BRAND.navy,borderLeft:`3px solid ${BRAND.gold}` }}>
              <div className="cormorant-italic" style={{ fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.7 }}>"The name Manickbag comes from our founder Manickchand — and 'bag' reflects the garden of enterprise they cultivated for all of us."</div>
              <div style={{ fontSize:11,color:BRAND.gold,marginTop:10,letterSpacing:"0.1em" }}>— Family Archive</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.white,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }}>
          <div className="anim-scaleIn" style={{ opacity:0,animationDelay:"0.2s" }}>
            <OldPhoto src="https://manickbag.in/images/manickbagold.png" label="Manickbag Engineers Workshop" year="circa 1950"/>
            <div style={{ display:"flex",gap:2,marginTop:2 }}>
              <OldPhoto src="https://manickbag.in/images/engine.png" label="Diesel Engine Conversion" year="Early 1950s" style={{ flex:1 }}/>
              <OldPhoto src="https://manickbag.in/images/innergarge.png" label="Simpson Dealership" year="1951" style={{ flex:1 }}/>
            </div>
          </div>
          <div className="anim-fadeUp" style={{ opacity:0,animationDelay:"0.1s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Pivot · 1950</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>The Wheels Begin<br /><span className="gold-shimmer">To Turn</span></h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>In 1950, the families entered automobiles with <strong style={{ color:BRAND.navyMid }}>Manickbag Engineers</strong>. Their pioneering work converting petrol-engine vehicles to diesel engines was a technological leap that caught the attention of the entire region.</p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>This expertise won them the <strong style={{ color:BRAND.navyMid }}>Simpsons dealership in 1951</strong> and the <strong style={{ color:BRAND.navyMid }}>MICO dealership in 1956</strong>. The <strong style={{ color:BRAND.navyMid }}>Ashok Leyland sub-dealership</strong> followed — and Manickbag Automobiles was born.</p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted }}>They also launched <strong style={{ color:BRAND.navyMid }}>Manickbag Garage</strong> — a full machine shop with crankshaft grinders and block boring machines.</p>
          </div>
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.navyMid,padding:"80px 0",position:"relative",overflow:"hidden",width:"100%" }}>
      <div style={{ position:"absolute",right:-100,top:-100,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }}/>
      <div style={{ position:"relative",zIndex:1,...W }}>
        <div style={{ textAlign:"center",marginBottom:60 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
            <div style={{ width:40,height:1,background:BRAND.gold }}/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Expansion Era · 1979–2004</span><div style={{ width:40,height:1,background:BRAND.gold }}/>
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:300,color:BRAND.white,lineHeight:1.2 }}>Growing Across<br /><span className="gold-shimmer">Karnataka & Beyond</span></h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
          {[
            { year:"1979",icon:"🛵",title:"TVS & Sundaram Clayton",desc:"Manickbag took up the dealership of Sundaram Clayton and TVS mopeds, entering the two-wheeler market." },
            { year:"1984",icon:"🏢",title:"First Branch — Hubli",desc:"The first showroom outside Belgaum opens in Hubli — proving Manickbag's model could grow beyond its founding city." },
            { year:"1992",icon:"🚛",title:"TATA Motors Dealership",desc:"A pivotal milestone: Manickbag becomes an authorised TATA Motors diesel dealer — the most important chapter begins." },
            { year:"1993–1995",icon:"📍",title:"Bijapur & Ankola",desc:"New showrooms in Bijapur (1993) and Ankola (1995) bring the Manickbag promise to more families." },
            { year:"1999",icon:"🏆",title:"TATA Car + Best CSI All India",desc:"TATA car dealership launched. In year one, Manickbag wins Best CSI All India from Shri Ratan Tata himself." },
            { year:"2004",icon:"🌟",title:"Gulbarga & Gokak",desc:"New branches complete a network that proudly serves North Karnataka across 12 locations." },
          ].map((item,i)=>(
            <div key={item.year} className="anim-fadeUp card-hover" style={{ background:"rgba(255,255,255,0.04)",border:`1px solid ${BRAND.borderLight}`,padding:"32px 28px",animationDelay:`${i*0.1}s`,opacity:0 }}>
              <div style={{ fontSize:32,marginBottom:16 }}>{item.icon}</div>
              <div style={{ fontSize:10,letterSpacing:"0.2em",color:BRAND.gold,textTransform:"uppercase",marginBottom:8,fontWeight:600 }}>{item.year}</div>
              <h3 className="cormorant" style={{ fontSize:22,fontWeight:600,color:BRAND.white,marginBottom:12 }}>{item.title}</h3>
              <p style={{ fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.5)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.offWhite,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"grid",gridTemplateColumns:"5fr 4fr",gap:80,alignItems:"center" }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Today's Manickbag Group</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>A Family Enterprise,<br />Still Growing Strong</h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>More than 110 years after its founding, Manickbag remains family-led. The third and fourth generations of the Shah and Mirji families continue with the same values their forefathers built — hard work, honesty, and genuine service.</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:32 }}>
              {[
                { div:"Manickbag Diesel",    desc:"MICO Dealers — Belgaum (Vijay Shah) & Hubli (Milind Shah)" },
                { div:"Manickbag Engineers", desc:"TVS Motors Dealers, Belgaum — managed by Swapnil Shah" },
                { div:"Manickbag Industries",desc:"Sesa Goa — pig iron & coke — managed by Sheel Mirji" },
                { div:"Manickbag Oil Mills",  desc:"Hindustan Petroleum Dealers — Petrol Bunk, Belgaum" },
                { div:"TATA Car Division",    desc:"Hubbli showroom managed by Sanjot Shah" },
                { div:"New TATA Cars Belgaum",desc:"Khanapur Road — managed by Sheel & Shirish Shah" },
              ].map((item,i)=>(
                <div key={item.div} className="anim-fadeUp" style={{ background:BRAND.white,border:`1px solid rgba(0,0,0,0.06)`,borderLeft:`3px solid ${BRAND.gold}`,padding:"20px",animationDelay:`${i*0.08}s`,opacity:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:BRAND.navyMid,marginBottom:6 }}>{item.div}</div>
                  <div style={{ fontSize:12,color:BRAND.muted,lineHeight:1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {[{value:"112+",label:"Years of Enterprise"},{value:"6",label:"Business Divisions"},{value:"2",label:"Founding Families"},{value:"4th",label:"Generation Running"}].map((s,i)=>(
              <div key={s.label} className="anim-fadeUp" style={{ background:BRAND.navy,padding:"28px 32px",display:"flex",alignItems:"center",gap:24,animationDelay:`${i*0.1}s`,opacity:0 }}>
                <div className="cormorant" style={{ fontSize:52,fontWeight:600,color:BRAND.gold,lineHeight:1,flexShrink:0 }}>{s.value}</div>
                <div style={{ fontSize:11,letterSpacing:"0.15em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </>
);

// ══════════════════════════════════════════════════════════════════
//  PAGE 2: SHAH & MIRJI LEGACY
// ══════════════════════════════════════════════════════════════════
const ShahMirjiLegacy = () => (
  <>
    <section style={{ background:BRAND.white,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ textAlign:"center",maxWidth:700,margin:"0 auto 64px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
            <div style={{ width:40,height:1,background:BRAND.gold }}/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Two Families · One Vision</span><div style={{ width:40,height:1,background:BRAND.gold }}/>
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.2,marginBottom:20 }}>The Families That Built<br /><span className="gold-shimmer">a Century of Trust</span></h2>
          <p style={{ fontSize:16,lineHeight:1.8,color:BRAND.muted }}>In 1913, two families from different walks of life found common ground in an uncommon ambition. Their partnership, forged in the dusty lanes of Kalaburagi, created an enterprise that outlasted colonial rule, independence, industrialisation, and now the digital age.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4 }}>
          {/* SHAH */}
          <div className="anim-fadeUp" style={{ background:BRAND.navy,padding:"60px 48px",position:"relative",overflow:"hidden",opacity:0,animationDelay:"0.1s" }}>
            <div style={{ position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.08) 0%,transparent 70%)" }}/>
            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ width:64,height:64,background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:BRAND.navy,marginBottom:24 }}>S</div>
              <div style={{ fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,marginBottom:12 }}>The Shah Family</div>
              <h3 className="cormorant" style={{ fontSize:36,fontWeight:600,color:BRAND.white,lineHeight:1.1,marginBottom:8 }}>Manickchand Shah</h3>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:28 }}>Co-Founder & Visionary, 1913</div>
              <div style={{ width:"100%",height:1,background:"rgba(184,150,62,0.2)",marginBottom:28 }}/>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:20 }}>Mr. Manickchand Shah brought to the partnership a merchant's acumen and an entrepreneur's restlessness. It was his name — Manickchand — that gave the venture its identity: <em style={{ color:BRAND.gold }}>Manickbag</em>.</p>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:28 }}>His lineage continues today across multiple business arms of the Manickbag Group.</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {["Vijay Shah — Manickbag Diesel, Belgaum","Milind Shah — Manickbag Diesel, Hubli","Swapnil Shah — Manickbag Engineers (TVS)","Sanjot Shah — TATA Car Division, Hubli","Sheel & Shirish Shah — TATA Cars, Belgaum"].map((name,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"rgba(184,150,62,0.06)",borderLeft:`2px solid ${BRAND.gold}` }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:BRAND.gold,flexShrink:0 }}/>
                    <span style={{ fontSize:13,color:"rgba(255,255,255,0.65)" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* MIRJI */}
          <div className="anim-fadeUp" style={{ background:"rgba(10,22,40,0.96)",border:`1px solid ${BRAND.borderLight}`,padding:"60px 48px",position:"relative",overflow:"hidden",opacity:0,animationDelay:"0.25s" }}>
            <div style={{ position:"absolute",top:-40,left:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.06) 0%,transparent 70%)" }}/>
            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ width:64,height:64,background:`linear-gradient(135deg,#6b4c1a,${BRAND.gold})`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:BRAND.navy,marginBottom:24 }}>M</div>
              <div style={{ fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,marginBottom:12 }}>The Mirji Family</div>
              <h3 className="cormorant" style={{ fontSize:36,fontWeight:600,color:BRAND.white,lineHeight:1.1,marginBottom:8 }}>Dharmappa Mirji</h3>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:28 }}>Co-Founder & Pillar of Operations, 1913</div>
              <div style={{ width:"100%",height:1,background:"rgba(184,150,62,0.2)",marginBottom:28 }}/>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:20 }}>Mr. Dharmappa Mirji was the operational backbone. Where Manickchand Shah dreamed expansively, Dharmappa grounded those dreams in disciplined execution and deep community relationships.</p>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:28 }}>Sheel Mirji leads Manickbag Industries today, managing the Sesa Goa partnership for pig iron and coke.</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {["Dharmappa Mirji — Co-Founder, 1913","Sheel Mirji — Manickbag Industries (Sesa Goa)","Continuing family presence across group entities"].map((name,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"rgba(184,150,62,0.06)",borderLeft:`2px solid ${BRAND.gold}` }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:BRAND.gold,flexShrink:0 }}/>
                    <span style={{ fontSize:13,color:"rgba(255,255,255,0.65)" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.offWhite,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
          <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Heritage Gallery</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:4 }}>
          <OldPhoto src="https://manickbag.in/images/multi.png" label="The Founding Partners" year="Manickbag Automobiles" objectPos="center center"/>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            <OldPhoto src="https://manickbag.in/images/mktruck.png" label="Manickbag Engineers" year="Belgaum · 1950"/>
            <OldPhoto src="https://manickbag.in/images/tk.png" label="Diesel Conversion Bay" year="Early 1950s"/>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            <OldPhoto src="https://manickbag.in/images/int.png" label="Simpsons Dealership" year="1951"/>
            <OldPhoto src="https://manickbag.in/images/out.png" label="MICO & Ashok Leyland" year="1956"/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4,marginTop:4 }}>
          <OldPhoto src="https://manickbag.in/images/innergarge.png" label="TVS Motors Dealership" year="1979"/>
          <OldPhoto src="https://manickbag.in/images/engine.png" label="Hubbli Branch Opening" year="1984"/>
          <OldPhoto src="https://manickbag.in/images/int.png" label="TATA Commercial Vehicles" year="1992"/>
          <OldPhoto src="https://manickbag.in/images/tk.png" label="TATA Car Dealership" year="1999"/>
        </div>
      </div>
    </section>

    <section style={{ background:BRAND.navyMid,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
          <div style={{ width:60,height:1,background:BRAND.gold }}/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Values We Inherited</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2 }}>
          {[
            { icon:"🤝",title:"Partnership",  desc:"Two families, one handshake, and a partnership that has lasted over a century without a single written contract between them." },
            { icon:"📿",title:"Integrity",    desc:"Every business decision — from rice mills to EVs — guided by the principle that your word is your bond." },
            { icon:"🌱",title:"Reinvention",  desc:"From soap factories to diesel conversions to electric vehicles — Manickbag has always embraced change with courage." },
            { icon:"🏡",title:"Community",    desc:"The Shahs and Mirjis never saw themselves as businessmen alone. They saw themselves as stewards of North Karnataka." },
          ].map((v,i)=>(
            <div key={v.title} className="anim-fadeUp card-hover" style={{ background:"rgba(255,255,255,0.03)",border:`1px solid ${BRAND.borderLight}`,padding:"40px 28px",animationDelay:`${i*0.1}s`,opacity:0 }}>
              <div style={{ fontSize:36,marginBottom:20 }}>{v.icon}</div>
              <h3 className="cormorant" style={{ fontSize:24,fontWeight:600,color:BRAND.white,marginBottom:12 }}>{v.title}</h3>
              <p style={{ fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.45)" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

// ══════════════════════════════════════════════════════════════════
//  PAGE 3: MILESTONES
// ══════════════════════════════════════════════════════════════════
const Milestones = () => {
  const milestones = [
    { year:"1913",     era:"Foundation",  icon:"🏛", headline:"Manickbag Is Born",                  detail:"Mr. Manickchand Shah and Mr. Dharmappa Mirji establish Manickbag in Kalaburagi. Operations begin with rice mills and a soap factory.", highlight:true },
    { year:"1920s",    era:"Growth",      icon:"🌾", headline:"Groundnut Oil & Export",             detail:"Manickbag diversifies into groundnut oil manufacturing and begins exporting — establishing trading routes across the region.", highlight:false },
    { year:"1950",     era:"Automobiles", icon:"🔧", headline:"Manickbag Engineers",                detail:"A workshop opens for petrol-to-diesel engine conversions — revolutionary technology for its time.", highlight:true },
    { year:"1951",     era:"Dealerships", icon:"🚗", headline:"Simpsons Dealership",               detail:"The success of Manickbag Engineers earns them the prestigious Simpsons dealership.", highlight:false },
    { year:"1956",     era:"Dealerships", icon:"⚙️", headline:"MICO & Ashok Leyland",             detail:"MICO dealership secured. Ashok Leyland sub-dealership established — Manickbag Automobiles officially named.", highlight:false },
    { year:"1956",     era:"Expansion",   icon:"🏗", headline:"Manickbag Garage",                  detail:"A full machine shop launched with rebuilding machines, crankshaft grinder, and block boring machine.", highlight:false },
    { year:"1979",     era:"Two-Wheelers",icon:"🛵", headline:"TVS & Sundaram Clayton",             detail:"Manickbag takes up dealership of Sundaram Clayton and TVS mopeds.", highlight:false },
    { year:"1984",     era:"Expansion",   icon:"🏢", headline:"First Branch — Hubli",               detail:"The very first showroom outside Belgaum opens in Hubli.", highlight:true },
    { year:"1992",     era:"TATA Motors", icon:"🚛", headline:"TATA Diesel Dealership",            detail:"Manickbag is awarded the TATA Motors dealership for diesel vehicles.", highlight:true },
    { year:"1993",     era:"Expansion",   icon:"📍", headline:"Bijapur Branch",                    detail:"New showroom opens in Bijapur, extending the Manickbag network.", highlight:false },
    { year:"1995",     era:"Expansion",   icon:"📍", headline:"Ankola Branch",                     detail:"Ankola branch established — coastal Karnataka now served by Manickbag.", highlight:false },
    { year:"1999",     era:"Milestone",   icon:"🏆", headline:"TATA Car + Best CSI All India",     detail:"TATA car dealership launched. In year one, Manickbag wins Best CSI All India from Shri Ratan Tata himself.", highlight:true },
    { year:"2004",     era:"Expansion",   icon:"🌟", headline:"Gulbarga Branch",                   detail:"New branch added in Gulbarga, strengthening the Hyderabad-Karnataka region.", highlight:false },
    { year:"2005",     era:"Expansion",   icon:"🌟", headline:"Gokak Branch",                      detail:"Gokak showroom opened — Manickbag's footprint expands across Belgaum district.", highlight:false },
    { year:"2024+",    era:"Future",      icon:"⚡", headline:"Electric Vehicle Era",              detail:"Manickbag leads North Karnataka into the EV era with the full TATA Electric lineup across 12 showrooms.", highlight:true },
  ];

  return (
    <section style={{ background:BRAND.offWhite,padding:"80px 0",width:"100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
          <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>1913 — Present</span>
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.2,marginBottom:60 }}>
          A Century of<br /><span className="gold-shimmer">Defining Moments</span>
        </h2>
        <div style={{ position:"relative",paddingLeft:48 }}>
          <div style={{ position:"absolute",left:20,top:0,bottom:0,width:2,background:`linear-gradient(${BRAND.gold},rgba(184,150,62,0.1))` }}/>
          {milestones.map((m,i)=>(
            <div key={`${m.year}-${i}`} className="anim-fadeUp" style={{ display:"flex",gap:32,marginBottom:40,alignItems:"flex-start",opacity:0,animationDelay:`${i*0.07}s`,position:"relative" }}>
              <div style={{ position:"absolute",left:-42,top:8,width:m.highlight?18:12,height:m.highlight?18:12,borderRadius:"50%",background:m.highlight?BRAND.gold:"rgba(184,150,62,0.4)",border:`2px solid ${m.highlight?BRAND.gold:"rgba(184,150,62,0.6)"}`,boxShadow:m.highlight?`0 0 0 4px rgba(184,150,62,0.15)`:"none",zIndex:2,marginLeft:m.highlight?-3:0 }}/>
              <div style={{ flex:1,background:BRAND.white,border:`1px solid ${m.highlight?BRAND.gold:"rgba(0,0,0,0.06)"}`,borderLeft:m.highlight?`4px solid ${BRAND.gold}`:`4px solid rgba(184,150,62,0.2)`,padding:`${m.highlight?32:24}px 28px`,boxShadow:m.highlight?"0 8px 32px rgba(0,0,0,0.08)":"none" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
                      <span style={{ fontSize:m.highlight?28:22 }}>{m.icon}</span>
                      <div>
                        <span style={{ fontSize:m.highlight?13:11,fontWeight:700,color:BRAND.gold,letterSpacing:"0.15em",textTransform:"uppercase" }}>{m.year}</span>
                        <span style={{ fontSize:10,color:BRAND.muted,marginLeft:12,letterSpacing:"0.1em",textTransform:"uppercase" }}>{m.era}</span>
                      </div>
                    </div>
                    <h3 className="cormorant" style={{ fontSize:m.highlight?28:22,fontWeight:600,color:BRAND.navyMid,marginBottom:8,lineHeight:1.2 }}>{m.headline}</h3>
                    <p style={{ fontSize:14,lineHeight:1.7,color:BRAND.muted }}>{m.detail}</p>
                  </div>
                  {m.highlight && <div style={{ padding:"6px 14px",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",flexShrink:0,alignSelf:"flex-start",marginTop:4 }}>KEY MILESTONE</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE 4: LEADERSHIP
// ══════════════════════════════════════════════════════════════════
const Leadership = () => {
  const [hovered, setHovered] = useState(null);
  const leaders = [
    { name:"Vijay Shah",              role:"Director — Manickbag Diesel (Belgaum)", division:"MICO Dealership · Belgaum",      family:"Shah",  generation:"3rd Generation", quote:"My grandfather started with a rice mill. I run a diesel dealership. My son will lead EVs. The name changes. The values don't.", src:"" },
    { name:"Milind Shah",             role:"Director — Manickbag Diesel (Hubli)",   division:"MICO Dealership · Hubli",        family:"Shah",  generation:"3rd Generation", quote:"Being a Manickbag director is not a title — it's a responsibility to every family that walks through our doors.", src:"" },
    { name:"Swapnil Shah",            role:"Director — Manickbag Engineers",        division:"TVS Motors · Belgaum",           family:"Shah",  generation:"3rd Generation", quote:"The two-wheeler market is the heartbeat of small-town India. We serve that heartbeat every single day.", src:"" },
    { name:"Sheel Mirji",             role:"Director — Manickbag Industries",       division:"Sesa Goa (Pig Iron & Coke)",     family:"Mirji", generation:"3rd Generation", quote:"The Mirji family has always believed in diversification — not just for profit, but to stay rooted in the real economy.", src:"" },
    { name:"Sanjot Shah",             role:"Director — TATA Car Division",          division:"TATA Motors Cars · Hubli",       family:"Shah",  generation:"3rd Generation", quote:"Selling a car is easy. Building a 20-year relationship with that customer's family — that's the Manickbag way.", src:"" },
    { name:"Sheel Shah & Shirish Shah",role:"Directors — New TATA Car Showroom",   division:"Khanapur Road · Belgaum",        family:"Shah",  generation:"4th Generation", quote:"We are the next chapter. We carry 110 years of trust in our hands — and we don't take that lightly.", src:"" },
  ];

  return (
    <>
      <section style={{ background:BRAND.white,padding:"80px 0 60px",width:"100%" }}>
        <div style={W}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Leadership Today</span>
              </div>
              <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>Four Generations,<br /><span className="gold-shimmer">One Direction</span></h2>
              <p style={{ fontSize:16,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>The Manickbag Group today is led by the third and fourth generations of the Shah and Mirji families. They did not simply inherit a business — they inherited a responsibility, a set of values, and a name that carries 110 years of promise.</p>
              <p style={{ fontSize:16,lineHeight:1.9,color:BRAND.muted }}>Across six business divisions and twelve showrooms, each director is united by the founding compact: <strong style={{ color:BRAND.navyMid }}>serve the customer the way you would serve family.</strong></p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:2 }}>
              {[{num:"2",label:"Founding Families"},{num:"4+",label:"Generations"},{num:"6",label:"Business Divisions"},{num:"110+",label:"Years Together"}].map((s,i)=>(
                <div key={s.label} className="anim-scaleIn" style={{ background:i%2===0?BRAND.navy:BRAND.offWhite,padding:"40px 28px",textAlign:"center",opacity:0,animationDelay:`${i*0.1}s` }}>
                  <div className="cormorant" style={{ fontSize:56,fontWeight:600,color:i%2===0?BRAND.gold:BRAND.navyMid,lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontSize:10,letterSpacing:"0.15em",color:i%2===0?"rgba(255,255,255,0.4)":BRAND.muted,textTransform:"uppercase",marginTop:8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background:BRAND.offWhite,padding:"80px 0",width:"100%" }}>
        <div style={W}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
            <div className="gold-line"/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Our Directors</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
            {leaders.map((leader,i)=>(
              <div key={leader.name} className="anim-fadeUp"
                onMouseOver={()=>setHovered(i)} onMouseOut={()=>setHovered(null)}
                style={{ background:BRAND.white,border:`1px solid ${hovered===i?BRAND.gold:"rgba(0,0,0,0.06)"}`,overflow:"hidden",transition:"border-color 0.3s,box-shadow 0.3s",boxShadow:hovered===i?"0 16px 48px rgba(0,0,0,0.1)":"none",opacity:0,animationDelay:`${i*0.1}s`,cursor:"pointer" }}>
                <div style={{ height:240,position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})` }}>
                  {leader.src ? (
                    <img src={leader.src} alt={leader.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"grayscale(70%) contrast(1.08) brightness(0.92) sepia(15%)",transition:"filter 0.5s ease",display:"block" }} onMouseOver={e=>e.target.style.filter="grayscale(20%)"} onMouseOut={e=>e.target.style.filter="grayscale(70%) contrast(1.08) brightness(0.92) sepia(15%)"}/>
                  ) : (
                    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12 }}>
                      <div style={{ width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,rgba(184,150,62,0.2),rgba(184,150,62,0.4))`,border:`2px solid ${BRAND.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32 }}>👤</div>
                      <div style={{ fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase" }}>Add src="" for photo</div>
                    </div>
                  )}
                  <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 4px)" }}/>
                  <div style={{ position:"absolute",top:16,right:16,padding:"4px 12px",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase" }}>{leader.family} Family</div>
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"12px 20px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))" }}>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em",textTransform:"uppercase" }}>{leader.generation}</div>
                  </div>
                </div>
                <div style={{ padding:"28px" }}>
                  <h3 className="cormorant" style={{ fontSize:26,fontWeight:600,color:BRAND.navyMid,lineHeight:1.1,marginBottom:6 }}>{leader.name}</h3>
                  <div style={{ fontSize:12,color:BRAND.gold,letterSpacing:"0.08em",fontWeight:600,textTransform:"uppercase",marginBottom:4 }}>{leader.role}</div>
                  <div style={{ fontSize:12,color:BRAND.muted,marginBottom:20 }}>{leader.division}</div>
                  <div style={{ width:"100%",height:1,background:"rgba(0,0,0,0.06)",marginBottom:20 }}/>
                  <div style={{ padding:"0 0 0 16px",borderLeft:`2px solid ${hovered===i?BRAND.gold:"rgba(184,150,62,0.3)"}`,transition:"border-color 0.3s" }}>
                    <p className="cormorant-italic" style={{ fontSize:15,lineHeight:1.7,color:BRAND.navyMid,opacity:0.7 }}>"{leader.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:BRAND.navy,padding:"80px 0",width:"100%" }}>
        <div style={W}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
              <div style={{ width:40,height:1,background:BRAND.gold }}/><span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Founders</span><div style={{ width:40,height:1,background:BRAND.gold }}/>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3.5vw,44px)",fontWeight:300,color:BRAND.white }}>Those Who Started It All</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,maxWidth:800,margin:"0 auto" }}>
            {[
              { name:"Manickchand Shah", role:"Co-Founder", year:"1913–Legacy", family:"Shah Family",  src:"" },
              { name:"Dharmappa Mirji",  role:"Co-Founder", year:"1913–Legacy", family:"Mirji Family", src:"" },
            ].map((f,i)=>(
              <div key={f.name} className="anim-fadeUp" style={{ background:"rgba(255,255,255,0.04)",border:`1px solid ${BRAND.borderLight}`,overflow:"hidden",opacity:0,animationDelay:`${i*0.15}s` }}>
                <div style={{ height:220,position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navy})` }}>
                  {f.src ? (
                    <img src={f.src} alt={f.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"grayscale(75%) contrast(1.1) brightness(0.9) sepia(20%)",display:"block" }}/>
                  ) : (
                    <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <div style={{ width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:BRAND.navy }}>{f.name[0]}</div>
                    </div>
                  )}
                  <div style={{ position:"absolute",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 45%,transparent 30%,rgba(0,0,0,0.55) 100%)" }}/>
                </div>
                <div style={{ padding:"28px 32px",textAlign:"center" }}>
                  <h3 className="cormorant" style={{ fontSize:28,fontWeight:600,color:BRAND.white,marginBottom:8 }}>{f.name}</h3>
                  <div style={{ fontSize:12,color:BRAND.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4 }}>{f.role}</div>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em",marginBottom:16 }}>{f.year}</div>
                  <div style={{ padding:"6px 16px",display:"inline-block",border:`1px solid ${BRAND.borderLight}`,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em",textTransform:"uppercase" }}>{f.family}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
//  HERO DATA MAP
// ══════════════════════════════════════════════════════════════════
const HERO_DATA = {
  "/heritage":            { tag:"Our Heritage · Since 1913",   headline:"The Manickbag\nStory",              sub:"From rice mills to electric vehicles — 110 years of enterprise, integrity, and family." },
  "/heritage/legacy":     { tag:"Shah & Mirji Families",       headline:"Two Families,\nOne Century",        sub:"The story of the visionaries who bet on each other in 1913 — and never looked back." },
  "/heritage/milestones": { tag:"Our Journey · 1913–Present",  headline:"Milestones That\nShaped a Legacy",  sub:"Every dealership, every branch, every award — charted across more than a century." },
  "/heritage/leadership": { tag:"The People Behind the Brand", headline:"Our Leadership\nToday",             sub:"Four generations of the Shah and Mirji families, continuing the founding vision." },
};

// ══════════════════════════════════════════════════════════════════
//  INNER WRAPPER (hero + subnav + page content)
//  Layout handles nav, footer, ticker, paddingTop=138
// ══════════════════════════════════════════════════════════════════
function HeritageInner() {
  const location = useLocation();
  const heroData = HERO_DATA[location.pathname] || HERO_DATA["/heritage"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <HeritageStyles />
      <HeritageHero tag={heroData.tag} headline={heroData.headline} sub={heroData.sub} />
      <HeritageSubNav />
      <Routes>
        <Route index            element={<OurStory />} />
        <Route path="legacy"       element={<ShahMirjiLegacy />} />
        <Route path="milestones"   element={<Milestones />} />
        <Route path="leadership"   element={<Leadership />} />
      </Routes>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
//  ROOT EXPORT — wraps everything in shared Layout
// ══════════════════════════════════════════════════════════════════
export default function Heritage() {
  return (
    <Layout>
      <HeritageInner />
    </Layout>
  );
}