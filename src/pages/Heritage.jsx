// ══════════════════════════════════════════════════════════════════
//  MANICKBAG AUTOMOBILES — HERITAGE SECTION
//  4 sub-pages: Our Story | Shah & Mirji Legacy | Milestones | Leadership
//
//  HOW TO ADD YOUR IMAGES:
//  Search for src="" in this file — each one is a photo placeholder.
//  Replace the empty string with your image URL, e.g.:
//    src="https://yoursite.com/images/founding-1913.jpg"
//
//  Add to App.jsx:
//    import Heritage from "./pages/Heritage";
//    <Route path="/heritage/*" element={<Heritage />} />
// ══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";

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

// ─── GLOBAL STYLES ───────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }
    body { font-family: 'Jost', sans-serif; background: #ffffff; color: #0c1f3f; }

    .cormorant { font-family: 'Cormorant Garamond', serif; }
    .cormorant-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #f7f5f0; }
    ::-webkit-scrollbar-thumb { background: #b8963e; border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideLeft {
      from { transform: translateX(40px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes ticker  {
      from { transform: translateX(0);    }
      to   { transform: translateX(-50%); }
    }
    @keyframes scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .anim-fadeUp    { animation: fadeUp    0.7s ease forwards; }
    .anim-fadeIn    { animation: fadeIn    0.6s ease forwards; }
    .anim-slideLeft { animation: slideLeft 0.6s ease forwards; }
    .anim-scaleIn   { animation: scaleIn  0.7s ease forwards; }

    .gold-shimmer {
      background: linear-gradient(90deg, #b8963e 0%, #f0e4c2 40%, #b8963e 60%, #d4af5a 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }

    .nav-link::after {
      content: ''; display: block; height: 1px;
      background: #b8963e; width: 0; transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }

    .card-hover { transition: transform 0.4s ease, box-shadow 0.4s ease; }
    .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.12); }

    .btn-gold {
      background: linear-gradient(135deg, #b8963e, #d4af5a);
      color: #0a1628; border: none; cursor: pointer;
      font-family: 'Jost', sans-serif; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      transition: all 0.3s ease; position: relative; overflow: hidden;
    }
    .btn-gold::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, #d4af5a, #b8963e);
      opacity: 0; transition: opacity 0.3s;
    }
    .btn-gold:hover::before { opacity: 1; }
    .btn-gold span { position: relative; z-index: 1; }

    .btn-outline {
      background: transparent; border: 1px solid #b8963e; color: #b8963e;
      cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease;
    }
    .btn-outline:hover { background: #b8963e; color: #0a1628; }

    .gold-line { width: 60px; height: 2px; background: linear-gradient(90deg, #b8963e, transparent); }

    .dropdown-menu {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }

    .vehicles-dropdown {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .vehicles-nav-item:hover .vehicles-dropdown {
      opacity: 1; visibility: visible; transform: translateY(0);
    }

    .sub-menu-open   { opacity: 1; visibility: visible;  transform: translateX(0);  }
    .sub-menu-closed { opacity: 0; visibility: hidden;   transform: translateX(6px); }
    .sub-menu-panel {
      position: absolute; left: 100%; top: -2px; min-width: 195px;
      background: rgba(6,14,28,0.99);
      border: 1px solid rgba(184,150,62,0.25);
      border-left: 2px solid #b8963e;
      padding: 8px 0;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      z-index: 20;
    }

    .topbar-link {
      color: rgba(255,255,255,0.55); text-decoration: none; cursor: pointer; transition: color 0.2s;
    }
    .topbar-link:hover { color: #b8963e; }

    .photo-frame {
      position: relative;
      display: inline-block;
      width: 100%;
    }
    .photo-frame::before {
      content: '';
      position: absolute;
      inset: -8px;
      border: 1px solid rgba(184,150,62,0.3);
      pointer-events: none;
      z-index: 10;
    }
    .photo-frame::after {
      content: '';
      position: absolute;
      top: 8px; left: 8px; right: -8px; bottom: -8px;
      background: rgba(184,150,62,0.08);
      z-index: -1;
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px;
      line-height: 0.7;
      color: rgba(184,150,62,0.15);
      position: absolute;
      top: 20px; left: 20px;
    }

    .old-photo-img {
      width: 100%;
      display: block;
      filter: grayscale(80%) contrast(1.08) brightness(0.95) sepia(20%);
      transition: filter 0.5s ease;
    }
    .old-photo-img:hover {
      filter: grayscale(30%) contrast(1.04) brightness(1) sepia(5%);
    }
  `}</style>
);

// ─── NAV DATA ─────────────────────────────────────────────────────
const showroomMenuItems = [
  { city: "Belgaum", sub: ["3'S Belgaum","EMO Chikkodi","EMO Ramdurga","EMO Savadatti","EMO Raibag","EMO Bailhongal"] },
  { city: "Hubbli",  sub: ["3'S Hubbli","EMO Haveri","EMO Mudeshwar","EMO Sirsi"] },
  { city: "Dharwad", sub: ["3'S Dharwad"] },
  { city: "Karwar",  sub: ["3'S Karwar","EMO Ankola"] },
  { city: "Bijapur",  sub: [] },
  { city: "Gulbarga", sub: [] },
  { city: "Bidar",    sub: [] },
  { city: "Yadgiri",  sub: [] },
];

const vehicleMenuCols = [{ heading: "", items: ["Hatchback","Sedan","SUV","Finance","AMC","Extended Warrenty","Other Services"] }];

const navItems = [
  { label: "Services", children: [
    { label: "Book Service", path: "/service" },
    { label: "Renewal Insurance", path: "/insurance" },
    { label: "AMC", path: "/amc" },
    { label: "Extended Warranty", path: "/extended-warranty" },
    { label: "RAS", path: "/rsa" },
    { label: "Accessories", path: "/accessories" },
    { label: "VAS", path: "/vas" },
  ]},
  { label: "Heritage", children: [
    { label: "Our Story",           path: "/heritage" },
    { label: "Shah & Mirji Legacy", path: "/heritage/legacy" },
    { label: "Milestones",          path: "/heritage/milestones" },
    { label: "Leadership",          path: "/heritage/leadership" },
  ]},
  { label: "Offers", children: [
  { label: "Current Offers",  path: "/current-offers" },  // change from "#"
  { label: "Corporate Deals", path: "/corporate-deals" }, // change from "#"
  { label: "Exchange Bonus",  path: "/exchange-bonus" },  // change from "#"
  { label: "Finance Schemes", path: "/finance-schemes" }, // change from "#"
]},
];

const otherServicesItems = [
  { label: "Accessories",  path: "/accessories" },
  { label: "VAS Services", path: "/vas" },
  { label: "Insurance",    path: "/insurance" },
  { label: "FASTag",       path: "/fastag" },
];

// ══════════════════════════════════════════════════════════════════
//  TOP BAR
// ══════════════════════════════════════════════════════════════════
const TopBar = () => (
  <div style={{ background: BRAND.navyMid, borderBottom: `1px solid ${BRAND.borderLight}`, padding: "6px 0", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 24, fontSize: 12, letterSpacing: "0.05em" }}>
          <Link to="/showrooms" className="topbar-link">📍 12 Showrooms across North Karnataka</Link>
          <span style={{ color: BRAND.borderLight }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>☎ +91 96860 24365</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          {["Careers","Investors","Media"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  VEHICLES NAV ITEM
// ══════════════════════════════════════════════════════════════════
const VehiclesNavItem = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen,  setSubOpen]  = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub,  setHoveredSub]  = useState(null);
  const navigate = useNavigate();

  const pageRoutes = { "Finance": "/finance", "AMC": "/amc", "Extended Warrenty": "/extended-warranty" };

  return (
    <div className="vehicles-nav-item" style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setSubOpen(false); }}>
      <Link to="/" className="nav-link" style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>Vehicles</Link>
      <div className="vehicles-dropdown" style={{ position: "absolute", top: "100%", left: 0, width: 220, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>
        {vehicleMenuCols.map((col, ci) => (
          <div key={ci}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>{col.heading}</div>
            {col.items.map(item => {
              if (item === "Other Services") return (
                <div key={item} style={{ position: "relative" }} onMouseEnter={() => setSubOpen(true)} onMouseLeave={() => setSubOpen(false)}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",fontSize:13,cursor:"pointer",userSelect:"none",color:subOpen?BRAND.goldLight:"#ccc",background:subOpen?"rgba(184,150,62,0.07)":"transparent",borderLeft:subOpen?`2px solid ${BRAND.gold}`:"2px solid transparent",paddingLeft:subOpen?24:20,transition:"all 0.2s" }}>
                    <span>Other Services</span><span style={{fontSize:11,opacity:0.8,marginRight:2}}>›</span>
                  </div>
                  <div className={`sub-menu-panel ${subOpen?"sub-menu-open":"sub-menu-closed"}`}>
                    <div style={{fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:BRAND.gold,fontWeight:600,padding:"6px 20px 10px",borderBottom:`1px solid rgba(184,150,62,0.15)`,marginBottom:4}}>Other Services</div>
                    {otherServicesItems.map((sub,si) => (
                      <Link key={sub.label} to={sub.path} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",paddingLeft:hoveredSub===si?24:20,color:hoveredSub===si?BRAND.gold:"#ccc",borderLeft:hoveredSub===si?`2px solid ${BRAND.gold}`:"2px solid transparent",textDecoration:"none",fontSize:13,background:hoveredSub===si?"rgba(184,150,62,0.07)":"transparent",transition:"all 0.18s ease"}} onMouseEnter={()=>setHoveredSub(si)} onMouseLeave={()=>setHoveredSub(null)}>{sub.label}</Link>
                    ))}
                  </div>
                </div>
              );
              if (pageRoutes[item]) return (
                <Link key={item} to={pageRoutes[item]} style={{display:"block",textDecoration:"none",fontSize:13,padding:"10px 20px",paddingLeft:hoveredItem===`${ci}-${item}`?24:20,color:hoveredItem===`${ci}-${item}`?BRAND.gold:"#ccc",borderLeft:hoveredItem===`${ci}-${item}`?`2px solid ${BRAND.gold}`:"2px solid transparent",background:hoveredItem===`${ci}-${item}`?"rgba(184,150,62,0.07)":"transparent",transition:"all 0.18s ease"}} onMouseEnter={()=>setHoveredItem(`${ci}-${item}`)} onMouseLeave={()=>setHoveredItem(null)}>{item}</Link>
              );
              return (
                <div key={item} onClick={() => navigate(item==="All Vehicles"?"/":`/?type=${item}`)} style={{display:"block",fontSize:13,cursor:"pointer",padding:"10px 20px",paddingLeft:hoveredItem===`${ci}-${item}`?24:20,color:hoveredItem===`${ci}-${item}`?BRAND.gold:"#ccc",borderLeft:hoveredItem===`${ci}-${item}`?`2px solid ${BRAND.gold}`:"2px solid transparent",background:hoveredItem===`${ci}-${item}`?"rgba(184,150,62,0.07)":"transparent",transition:"all 0.18s ease",userSelect:"none"}} onMouseEnter={()=>setHoveredItem(`${ci}-${item}`)} onMouseLeave={()=>setHoveredItem(null)}>{item}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  SHOWROOMS NAV ITEM
// ══════════════════════════════════════════════════════════════════
const ShowroomsNavItem = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCity, setOpenCity] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  return (
    <div style={{ position:"relative",padding:"0 4px" }} onMouseEnter={()=>setMenuOpen(true)} onMouseLeave={()=>{setMenuOpen(false);setOpenCity(null);}}>
      <Link to="/showrooms" className="nav-link" style={{ display:"block",padding:"8px 16px",color:menuOpen?BRAND.gold:BRAND.white,textDecoration:"none",fontSize:13,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",transition:"color 0.2s" }}>Showrooms</Link>
      {menuOpen && (
        <div style={{ position:"absolute",top:"100%",left:0,minWidth:200,background:"rgba(10,22,40,0.98)",border:`1px solid ${BRAND.borderLight}`,borderTop:`2px solid ${BRAND.gold}`,backdropFilter:"blur(12px)",padding:"8px 0",zIndex:10 }}>
          <div style={{ fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:BRAND.gold,fontWeight:600,padding:"10px 20px 8px",borderBottom:`1px solid rgba(184,150,62,0.15)`,marginBottom:4 }}>Our Locations</div>
          {showroomMenuItems.map((item,idx) => {
            const isActive = openCity===idx;
            if (item.sub.length>0) return (
              <div key={item.city} style={{position:"relative"}} onMouseEnter={()=>setOpenCity(idx)} onMouseLeave={()=>setOpenCity(null)}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",paddingLeft:isActive?24:20,fontSize:13,cursor:"pointer",userSelect:"none",color:isActive?BRAND.goldLight:"#ccc",background:isActive?"rgba(184,150,62,0.07)":"transparent",borderLeft:isActive?`2px solid ${BRAND.gold}`:"2px solid transparent",transition:"all 0.2s"}}>
                  <span>{item.city}</span><span style={{fontSize:11,opacity:0.8,marginRight:2}}>›</span>
                </div>
                <div className={`sub-menu-panel ${isActive?"sub-menu-open":"sub-menu-closed"}`}>
                  <div style={{fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:BRAND.gold,fontWeight:600,padding:"6px 20px 10px",borderBottom:`1px solid rgba(184,150,62,0.15)`,marginBottom:4}}>{item.city}</div>
                  {item.sub.map((subName,si)=>{const subKey=`${idx}-${si}`;return(
                    <a key={subName} href="#" style={{display:"block",padding:"10px 20px",paddingLeft:hoveredSub===subKey?24:20,color:hoveredSub===subKey?BRAND.gold:"#ccc",borderLeft:hoveredSub===subKey?`2px solid ${BRAND.gold}`:"2px solid transparent",background:hoveredSub===subKey?"rgba(184,150,62,0.07)":"transparent",textDecoration:"none",fontSize:13,transition:"all 0.18s ease"}} onMouseEnter={()=>setHoveredSub(subKey)} onMouseLeave={()=>setHoveredSub(null)}>{subName}</a>
                  );})}
                </div>
              </div>
            );
            return <Link key={item.city} to={`/showrooms?city=${item.city}`} style={{display:"block",textDecoration:"none",fontSize:13,padding:"10px 20px",color:"#ccc"}}>{item.city}</Link>;
          })}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════════════
const Navbar = ({ scrolled }) => (
  <nav style={{ position:"fixed",top:scrolled?0:33,left:0,right:0,zIndex:900,background:scrolled?"rgba(10,22,40,0.97)":BRAND.navyMid,backdropFilter:"blur(12px)",borderBottom:`1px solid ${scrolled?BRAND.borderLight:"transparent"}`,transition:"all 0.4s ease",boxShadow:scrolled?"0 4px 32px rgba(0,0,0,0.4)":"none",width:"100%" }}>
    <div style={{ ...W,display:"flex",alignItems:"center",height:72 }}>
      <Link to="/" style={{ display:"flex",alignItems:"center",gap:14,textDecoration:"none",flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:BRAND.white,letterSpacing:"0.02em",lineHeight:1.1 }}>MANICKBAG</div>
          <div style={{ fontSize:9,letterSpacing:"0.25em",color:BRAND.gold,textTransform:"uppercase",fontWeight:500 }}>AUTOMOBILES PVT LTD</div>
        </div>
      </Link>
      <div style={{ marginLeft:20,padding:"3px 10px",border:`1px solid ${BRAND.borderLight}`,borderRadius:2,fontSize:10,color:BRAND.gold,letterSpacing:"0.15em",textTransform:"uppercase",lineHeight:"1.6" }}>
        <div>Tata Motors Passenger Vehicle</div>
        <div>Tata Motors Electric Mobility</div>
      </div>
      <div style={{ marginLeft:20,padding:"3px 10px",border:`1px solid ${BRAND.borderLight}`,borderRadius:2,fontSize:10,color:BRAND.gold,letterSpacing:"0.15em",textTransform:"uppercase" }}>Tata Motors Authorized Dealer</div>
      <div style={{ display:"flex",gap:4,marginLeft:"auto",alignItems:"center" }}>
        <VehiclesNavItem />
        <ShowroomsNavItem />
        {navItems.map(item => (
          <div key={item.label} className="nav-item" style={{ position:"relative",padding:"0 4px" }}>
            <span className="nav-link"
              style={{ display:"block", padding:"8px 16px", color:BRAND.white, 
                      textDecoration:"none", fontSize:13, fontWeight:500, 
                      letterSpacing:"0.06em", textTransform:"uppercase", 
                      transition:"color 0.2s", cursor:"pointer" }}
              onMouseOver={e=>e.currentTarget.style.color=BRAND.gold}
              onMouseOut={e=>e.currentTarget.style.color=BRAND.white}
            >{item.label}</span>
            {item.children && (
              <div className="dropdown-menu" style={{ position:"absolute",top:"100%",left:0,minWidth:200,background:"rgba(10,22,40,0.98)",border:`1px solid ${BRAND.borderLight}`,borderTop:`2px solid ${BRAND.gold}`,backdropFilter:"blur(12px)",padding:"8px 0" }}>
                {item.children.map(child => (
                  <Link key={child.label} to={child.path} style={{ display:"block",padding:"10px 20px",color:"#ccc",textDecoration:"none",fontSize:13,transition:"all 0.2s",borderLeft:"2px solid transparent" }}
                    onMouseOver={e=>{e.currentTarget.style.color=BRAND.gold;e.currentTarget.style.borderLeftColor=BRAND.gold;e.currentTarget.style.paddingLeft="24px";}}
                    onMouseOut={e=>{e.currentTarget.style.color="#ccc";e.currentTarget.style.borderLeftColor="transparent";e.currentTarget.style.paddingLeft="20px";}}>{child.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="btn-gold" style={{ marginLeft:16,padding:"10px 24px",fontSize:12,borderRadius:2 }}><span>Book Test Drive</span></button>
      </div>
    </div>
  </nav>
);

// ══════════════════════════════════════════════════════════════════
//  HERITAGE SUB-NAV
// ══════════════════════════════════════════════════════════════════
const HeritageSubNav = () => {
  const location = useLocation();
  const tabs = [
    { label: "Our Story",           path: "/heritage" },
    { label: "Shah & Mirji Legacy", path: "/heritage/legacy" },
    { label: "Milestones",          path: "/heritage/milestones" },
    { label: "Leadership",          path: "/heritage/leadership" },
  ];
  return (
    <div style={{ background: BRAND.navy, borderBottom: `1px solid ${BRAND.borderLight}`, position: "sticky", top: 72, zIndex: 800, width: "100%" }}>
      <div style={{ ...W, display: "flex", gap: 0, alignItems: "center", height: 52 }}>
        {tabs.map((tab, i) => {
          const isActive = location.pathname === tab.path || (tab.path === "/heritage" && location.pathname === "/heritage/");
          return (
            <Link key={tab.label} to={tab.path}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 24px", height: "100%", textDecoration: "none", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: isActive ? BRAND.gold : "rgba(255,255,255,0.5)", borderBottom: isActive ? `2px solid ${BRAND.gold}` : "2px solid transparent", transition: "all 0.3s ease" }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            >
              {i === 0 && <span style={{ fontSize: 14 }}>📜</span>}
              {i === 1 && <span style={{ fontSize: 14 }}>👑</span>}
              {i === 2 && <span style={{ fontSize: 14 }}>🏛</span>}
              {i === 3 && <span style={{ fontSize: 14 }}>👤</span>}
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
  <section style={{ background: `linear-gradient(135deg,#050d1a 0%,#0c1f3f 55%,#0a1628 100%)`, paddingTop: 200, paddingBottom: 80, position: "relative", overflow: "hidden", width: "100%" }}>
    <div style={{ position:"absolute",right:"-5%",top:"5%",width:500,height:500,border:"1px solid rgba(184,150,62,0.07)",borderRadius:"50%" }} />
    <div style={{ position:"absolute",right:"5%",top:"15%",width:320,height:320,border:"1px solid rgba(184,150,62,0.12)",borderRadius:"50%" }} />
    <div style={{ position:"absolute",left:"-80px",bottom:"-80px",width:360,height:360,border:"1px solid rgba(184,150,62,0.05)",borderRadius:"50%" }} />
    {[...Array(7)].map((_,i)=>(
      <div key={i} style={{position:"absolute",width:3,height:3,borderRadius:"50%",background:BRAND.gold,opacity:0.25,left:`${10+i*13}%`,top:`${30+(i%3)*20}%`,animation:`pulse ${2+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}/>
    ))}
    <div style={{ position:"absolute",right:48,top:"50%",transform:"translateY(-50%) rotate(90deg)",fontSize:10,letterSpacing:"0.3em",color:"rgba(184,150,62,0.3)",textTransform:"uppercase" }}>Since 1913 · Kalaburagi · Karnataka</div>
    <div style={{ position:"relative",zIndex:2,...W }}>
      <div className="anim-fadeIn" style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:24,opacity:0,animationDelay:"0.1s" }}>
        <div style={{ width:32,height:1,background:BRAND.gold }}/>
        <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,fontWeight:500 }}>{tag}</span>
        <div style={{ width:32,height:1,background:BRAND.gold }}/>
      </div>
      <h1 className="cormorant anim-fadeUp" style={{ fontSize:"clamp(44px,6.5vw,84px)",fontWeight:300,lineHeight:1.05,color:BRAND.white,maxWidth:720,opacity:0,animationDelay:"0.2s",whiteSpace:"pre-line" }}>{headline}</h1>
      <div style={{ width:60,height:2,background:`linear-gradient(90deg,${BRAND.gold},transparent)`,margin:"28px 0" }}/>
      {sub && <p className="anim-fadeUp" style={{ fontSize:17,lineHeight:1.8,color:"rgba(255,255,255,0.6)",maxWidth:560,opacity:0,animationDelay:"0.4s" }}>{sub}</p>}
      <div className="anim-fadeUp" style={{ display:"flex",gap:8,alignItems:"center",marginTop:36,opacity:0,animationDelay:"0.5s" }}>
        <Link to="/" style={{ fontSize:12,color:"rgba(255,255,255,0.35)",textDecoration:"none",letterSpacing:"0.08em" }}>Home</Link>
        <span style={{ color:BRAND.gold,fontSize:10 }}>›</span>
        <span style={{ fontSize:12,color:BRAND.gold,letterSpacing:"0.08em" }}>Heritage</span>
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════════
const Footer = () => (
  <footer style={{ background: BRAND.navy, padding: "64px 0 32px", width: "100%" }}>
    <div style={W}>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:20 }}>
            <div style={{ width:40,height:40,background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:BRAND.navy,fontFamily:"'Cormorant Garamond',serif" }}>M</div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:BRAND.white }}>MANICKBAG</div>
              <div style={{ fontSize:8,letterSpacing:"0.25em",color:BRAND.gold }}>AUTOMOBILES</div>
            </div>
          </div>
          <p style={{ fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.35)",maxWidth:280,marginBottom:24 }}>North Karnataka's most trusted Tata Motors dealer since 1913. Serving families across 12 locations with integrity and excellence.</p>
          <div style={{ display:"flex",gap:12 }}>
            {["F","I","L","Y"].map((s,i)=>(
              <div key={i} style={{ width:36,height:36,border:`1px solid rgba(184,150,62,0.2)`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:BRAND.gold,transition:"all 0.2s" }}
                onMouseOver={e=>{e.currentTarget.style.background=BRAND.gold;e.currentTarget.style.color=BRAND.navy;}}
                onMouseOut={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=BRAND.gold;}}>{s}</div>
            ))}
          </div>
        </div>
        {[
          { title:"Vehicles",links:["SUVs","Hatchbacks","Sedans","Electric Vehicles","Commercial"] },
          { title:"Services",links:["Book Service","Finance & EMI","Insurance","Accessories","Exchange"] },
          { title:"Company", links:["About Us","Heritage","Leadership","Careers","Media","Contact"] },
        ].map(col=>(
          <div key={col.title}>
            <h4 style={{ fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.gold,marginBottom:20 }}>{col.title}</h4>
            {col.links.map(item=>(
              <a key={item} href="#" style={{ display:"block",fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",marginBottom:10,transition:"color 0.2s" }}
                onMouseOver={e=>e.target.style.color=BRAND.goldLight}
                onMouseOut={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{item}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.25)" }}>© 2025 Manickbag Automobiles. Authorised Tata Motors Dealer. All Rights Reserved.</div>
        <div style={{ display:"flex",gap:24 }}>
          {["Privacy Policy","Terms of Use","Cookie Policy"].map(item=>(
            <a key={item} href="#" style={{ fontSize:11,color:"rgba(255,255,255,0.25)",textDecoration:"none",transition:"color 0.2s" }}
              onMouseOver={e=>e.target.style.color=BRAND.gold}
              onMouseOut={e=>e.target.style.color="rgba(255,255,255,0.25)"}>{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const FloatingWA = () => {
  const [hover,setHover]=useState(false);
  return (
    <div onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)} style={{ position:"fixed",bottom:32,right:32,zIndex:999,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
      {hover&&<div style={{ background:BRAND.white,color:BRAND.navyMid,padding:"10px 16px",fontSize:13,fontWeight:500,borderRadius:2,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",animation:"slideLeft 0.3s ease",whiteSpace:"nowrap" }}>Chat with Us on WhatsApp</div>}
      <div style={{ width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 4px 20px rgba(37,211,102,0.4)",transform:hover?"scale(1.1)":"scale(1)",transition:"transform 0.3s ease" }}>💬</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  OldPhoto — IMAGE COMPONENT
//
//  USAGE:
//    <OldPhoto
//      src="https://your-image-url.jpg"   ← PASTE YOUR IMAGE URL HERE
//      label="Caption text"
//      year="1954"
//    />
//
//  - src      : your image web URL (required — no SVG fallback)
//  - label    : caption shown on hover
//  - year     : year badge shown bottom-right
//  - style    : extra wrapper styles e.g. { flex: 1 }
//  - objectPos: CSS object-position value, default "center top"
//               use "center center" for group shots
//               use "center bottom" for scenes with people at bottom
// ══════════════════════════════════════════════════════════════════
const OldPhoto = ({ src, label, year, style = {}, objectPos = "center top" }) => {
  const [hovered, setHovered] = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [error,   setError]   = useState(false);
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
      style={{ position: "relative", ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer wrapper — aspect ratio auto-adjusts to the real image */}
      <div style={{
        width: "100%",
        aspectRatio: loaded ? aspectRatio : "4/3",
        position: "relative",
        overflow: "hidden",
        background: "#0f0d0a",
        display: "block",
        transition: "aspect-ratio 0.3s ease",
      }}>

        {/* Loading skeleton */}
        {!loaded && !error && src && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(135deg,#1a1410,#2a2018,#1a1410)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{
              width: 28, height: 28,
              border: "2px solid rgba(184,150,62,0.2)",
              borderTopColor: "#b8963e",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 10, color: "rgba(184,150,62,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading</div>
          </div>
        )}

        {/* Empty / no src state */}
        {!src && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#1a1814,#0f0d0a)",
            gap: 12,
          }}>
            <div style={{ fontSize: 32, opacity: 0.3 }}>🖼</div>
            <div style={{ fontSize: 10, color: "rgba(184,150,62,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", padding: "0 20px" }}>
              Add src="" URL<br />to show photo
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#1a1814,#0f0d0a)",
            gap: 10,
          }}>
            <div style={{ fontSize: 28, opacity: 0.3 }}>⚠</div>
            <div style={{ fontSize: 10, color: "rgba(200,100,80,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", padding: "0 16px" }}>
              Image could not load
            </div>
          </div>
        )}

        {/* THE ACTUAL IMAGE */}
        {src && (
          <img
            src={src}
            alt={label || "Heritage photo"}
            onLoad={handleLoad}
            onError={() => setError(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: objectPos,
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.6s ease, filter 0.5s ease",
              filter: hovered
                ? "grayscale(25%) contrast(1.04) brightness(1.02) sepia(8%)"
                : "grayscale(78%) contrast(1.1) brightness(0.92) sepia(22%)",
            }}
          />
        )}

        {/* Film grain scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.055) 0px,rgba(0,0,0,0.055) 1px,transparent 1px,transparent 4px)",
        }} />

        {/* Deep vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 45%,transparent 28%,rgba(0,0,0,0.62) 100%)",
        }} />

        {/* Corner burns */}
        <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",background:"radial-gradient(ellipse at 0% 0%,rgba(0,0,0,0.28) 0%,transparent 48%)" }} />
        <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",background:"radial-gradient(ellipse at 100% 100%,rgba(0,0,0,0.22) 0%,transparent 48%)" }} />

        {/* Hover caption */}
        {(label || year) && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 7,
            padding: "36px 16px 14px",
            background: "linear-gradient(transparent, rgba(10,8,4,0.92))",
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.35s ease",
          }}>
            {label && (
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#f0e8d0",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.08em", lineHeight: 1.3, marginBottom: 4,
              }}>{label}</div>
            )}
            {year && (
              <div style={{
                fontSize: 10, color: "#c8a96e",
                letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Jost', sans-serif",
              }}>{year}</div>
            )}
          </div>
        )}

        {/* Always-visible year badge (bottom-right, hides when caption shows) */}
        {year && (
          <div style={{
            position: "absolute", bottom: 10, right: 10, zIndex: 7,
            padding: "3px 9px",
            background: "rgba(10,8,4,0.68)",
            border: "1px solid rgba(184,150,62,0.38)",
            fontSize: 9, color: "#c8a96e",
            letterSpacing: "0.12em",
            fontFamily: "'Jost', sans-serif",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s",
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
    {/* Opening quote */}
    <section style={{ background: BRAND.white, padding: "80px 0 60px", width: "100%" }}>
      <div style={W}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="cormorant-italic anim-fadeIn" style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 300, color: BRAND.navyMid, lineHeight: 1.6, position: "relative", padding: "40px 60px", opacity: 0 }}>
            <span className="quote-mark">"</span>
            "What began in 1913 as the shared vision of two families — the Shahs and the Mirjis — grew into one of North Karnataka's most enduring business legacies. From rice mills to diesel engines to TATA electric vehicles, one principle has never changed: <span className="gold-shimmer" style={{ fontStyle: "normal", fontWeight: 600 }}>integrity over everything.</span>"
          </div>
        </div>
      </div>
    </section>

    {/* Story Section 1 — The Beginning */}
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="anim-fadeUp" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/>
              <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Beginning · 1913</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>
              Two Visionaries,<br />One Bold Dream
            </h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
              In 1913, <strong style={{ color: BRAND.navyMid }}>Mr. Manickchand Shah</strong> and <strong style={{ color: BRAND.navyMid }}>Mr. Dharmappa Mirji</strong> joined hands in Kalaburagi (then Gulbarga) with a resolve that would outlast empires and epochs. They were not merely businessmen — they were builders of community.
            </p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
              Their journey began with <strong style={{ color: BRAND.navyMid }}>rice mills and a soap factory</strong> — essentials for the growing town. As the region's needs evolved, so did Manickbag, diversifying into <strong style={{ color: BRAND.navyMid }}>groundnut oil manufacturing and export</strong>, building trade routes that extended well beyond Karnataka's borders.
            </p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted }}>
              Their story is not one of overnight success — it is one of patient, principled enterprise, built brick by brick over more than a century.
            </p>
          </div>

          <div className="anim-scaleIn" style={{ opacity: 0, animationDelay: "0.3s" }}>
            {/* ── IMAGE 1 ── Our Story · Section 1 · Right side portrait */}
            <OldPhoto
              src="https://manickbag.in/images/FOUNDERS.jpg"
              label="The Founding Partners"
              year="1913"
            />
            <div style={{ marginTop: 16, padding: "16px 20px", background: BRAND.navy, borderLeft: `3px solid ${BRAND.gold}` }}>
              <div className="cormorant-italic" style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>"The name Manickbag comes from our founder Manickchand — and 'bag' reflects the garden of enterprise they cultivated for all of us."</div>
              <div style={{ fontSize: 11, color: BRAND.gold, marginTop: 10, letterSpacing: "0.1em" }}>— Family Archive</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Story Section 2 — Into Automobiles */}
    <section style={{ background: BRAND.white, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="anim-scaleIn" style={{ opacity: 0, animationDelay: "0.2s" }}>
            {/* ── IMAGE 2 ── Our Story · Section 2 · Top large photo */}
            <OldPhoto
              src="https://manickbag.in/images/manickbagold.png"
              label="Manickbag Engineers Workshop"
              year="circa 1950"
            />
            <div style={{ display: "flex", gap: 2, marginTop: 2}}>
              {/* ── IMAGE 3 ── Our Story · Section 2 · Bottom left */}
              <OldPhoto
                src="https://manickbag.in/images/engine.png"
                label="Diesel Engine Conversion"
                year="Early 1950s"
                style={{ flex: 1 }}
              />
              {/* ── IMAGE 4 ── Our Story · Section 2 · Bottom right */}
              <OldPhoto
                src="https://manickbag.in/images/innergarge.png"
                label="Simpson Dealership"
                year="1951"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="anim-fadeUp" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/>
              <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Pivot · 1950</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>
              The Wheels Begin<br /><span className="gold-shimmer">To Turn</span>
            </h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
              In 1950, the families entered the automobile line with an engineering workshop — <strong style={{ color: BRAND.navyMid }}>Manickbag Engineers</strong>. Their pioneering work converting petrol-engine vehicles to diesel engines was a technological leap that caught the attention of the entire region.
            </p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
              This expertise won them the prestigious <strong style={{ color: BRAND.navyMid }}>Simpsons dealership in 1951</strong> and the <strong style={{ color: BRAND.navyMid }}>MICO dealership in 1956</strong>. The same year, the <strong style={{ color: BRAND.navyMid }}>Ashok Leyland sub-dealership</strong> under Sundaram Motors was established — and Manickbag Automobiles as an identity was born.
            </p>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted }}>
              They also launched <strong style={{ color: BRAND.navyMid }}>Manickbag Garage</strong> — a full machine shop with crankshaft grinders and block boring machines — cementing their reputation as the region's most capable automotive engineers.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Story Section 3 — Growth */}
    <section style={{ background: BRAND.navyMid, padding: "80px 0", position: "relative", overflow: "hidden", width: "100%" }}>
      <div style={{ position:"absolute",right:-100,top:-100,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }}/>
      <div style={{ position:"relative",zIndex:1,...W }}>
        <div style={{ textAlign:"center",marginBottom:60 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
            <div style={{ width:40,height:1,background:BRAND.gold }}/>
            <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Expansion Era · 1979–2004</span>
            <div style={{ width:40,height:1,background:BRAND.gold }}/>
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:300,color:BRAND.white,lineHeight:1.2 }}>
            Growing Across<br /><span className="gold-shimmer">Karnataka & Beyond</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { year:"1979", icon:"🛵", title:"TVS & Sundaram Clayton", desc:"Manickbag took up the dealership of Sundaram Clayton and TVS mopeds, entering the two-wheeler market with characteristic confidence." },
            { year:"1984", icon:"🏢", title:"First Branch — Hubli", desc:"The first showroom outside Belgaum was opened in Hubli — a landmark moment that proved Manickbag's model could grow beyond its founding city." },
            { year:"1992", icon:"🚛", title:"TATA Motors Dealership", desc:"A pivotal milestone: Manickbag became an authorised dealer for TATA Motors diesel vehicles, beginning the most important chapter in their automotive journey." },
            { year:"1993–1995", icon:"📍", title:"Bijapur & Ankola", desc:"Expansion continued with new showrooms in Bijapur (1993) and Ankola (1995), bringing the Manickbag promise to more families across the region." },
            { year:"1999", icon:"🏆", title:"TATA Car Dealership — Best CSI", desc:"TATA Motors car dealership was launched — and in the very first year, Manickbag was awarded Best CSI All India by the honourable Chairman Shri Ratan Tata himself." },
            { year:"2004", icon:"🌟", title:"Gulbarga & Gokak Expand", desc:"New branches opened in Gulbarga (2004) and Gokak (2005), completing a network that now proudly serves North Karnataka's families across 12 locations." },
          ].map((item, i) => (
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

    {/* Story Section 4 — Today */}
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div className="gold-line"/>
              <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Today's Manickbag Group</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>
              A Family Enterprise,<br />Still Growing Strong
            </h2>
            <p style={{ fontSize:15,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
              More than 110 years after its founding, Manickbag remains a family-led institution. The third and fourth generations of the Shah and Mirji families continue to guide the group with the same values their forefathers built — hard work, honesty, and genuine service.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
              {[
                { div:"Manickbag Diesel", desc:"MICO Dealers — Belgaum (Vijay Shah) & Hubli (Milind Shah)" },
                { div:"Manickbag Engineers", desc:"TVS Motors Dealers, Belgaum — managed by Swapnil Shah" },
                { div:"Manickbag Industries", desc:"Sesa Goa — pig iron & coke — managed by Sheel Mirji" },
                { div:"Manickbag Oil Mills", desc:"Hindustan Petroleum Dealers — Petrol Bunk, Belgaum" },
                { div:"TATA Car Division", desc:"Hubbli showroom managed by Sanjot Shah" },
                { div:"New TATA Cars Belgaum", desc:"Khanapur Road — managed by Sheel & Shirish Shah" },
              ].map((item,i) => (
                <div key={item.div} className="anim-fadeUp" style={{ background:BRAND.white,border:`1px solid rgba(0,0,0,0.06)`,borderLeft:`3px solid ${BRAND.gold}`,padding:"20px",animationDelay:`${i*0.08}s`,opacity:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:BRAND.navyMid,marginBottom:6 }}>{item.div}</div>
                  <div style={{ fontSize:12,color:BRAND.muted,lineHeight:1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ value:"112+",label:"Years of Enterprise" },{ value:"6",label:"Business Divisions" },{ value:"2",label:"Founding Families" },{ value:"4th",label:"Generation Running" }].map((s,i)=>(
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
    <section style={{ background: BRAND.white, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ textAlign:"center",maxWidth:700,margin:"0 auto 64px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
            <div style={{ width:40,height:1,background:BRAND.gold }}/>
            <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Two Families · One Vision</span>
            <div style={{ width:40,height:1,background:BRAND.gold }}/>
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.2,marginBottom:20 }}>The Families That Built<br /><span className="gold-shimmer">a Century of Trust</span></h2>
          <p style={{ fontSize:16,lineHeight:1.8,color:BRAND.muted }}>In 1913, two families from different walks of life found common ground in an uncommon ambition. Their partnership, forged in the dusty lanes of Kalaburagi, created an enterprise that outlasted colonial rule, independence, industrialisation, and now the digital age.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {/* SHAH FAMILY */}
          <div className="anim-fadeUp" style={{ background:BRAND.navy,padding:"60px 48px",position:"relative",overflow:"hidden",opacity:0,animationDelay:"0.1s" }}>
            <div style={{ position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.08) 0%,transparent 70%)" }}/>
            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ width:64,height:64,background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:BRAND.navy,marginBottom:24 }}>S</div>
              <div style={{ fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,marginBottom:12 }}>The Shah Family</div>
              <h3 className="cormorant" style={{ fontSize:36,fontWeight:600,color:BRAND.white,lineHeight:1.1,marginBottom:8 }}>Manickchand Shah</h3>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:28,letterSpacing:"0.05em" }}>Co-Founder & Visionary, 1913</div>
              <div style={{ width:"100%",height:1,background:"rgba(184,150,62,0.2)",marginBottom:28 }}/>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:20 }}>
                Mr. Manickchand Shah brought to the partnership a merchant's acumen and an entrepreneur's restlessness. It was his name — Manickchand — that gave the venture its identity: <em style={{color:BRAND.gold}}>Manickbag</em>.
              </p>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:28 }}>
                His lineage continues today, with the Shah family present across multiple business arms of the Manickbag Group.
              </p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  "Vijay Shah — Manickbag Diesel, Belgaum",
                  "Milind Shah — Manickbag Diesel, Hubli",
                  "Swapnil Shah — Manickbag Engineers (TVS)",
                  "Sanjot Shah — TATA Car Division, Hubli",
                  "Sheel & Shirish Shah — TATA Cars, Belgaum",
                ].map((name,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"rgba(184,150,62,0.06)",borderLeft:`2px solid ${BRAND.gold}` }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:BRAND.gold,flexShrink:0 }}/>
                    <span style={{ fontSize:13,color:"rgba(255,255,255,0.65)" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIRJI FAMILY */}
          <div className="anim-fadeUp" style={{ background:"rgba(10,22,40,0.96)",border:`1px solid ${BRAND.borderLight}`,padding:"60px 48px",position:"relative",overflow:"hidden",opacity:0,animationDelay:"0.25s" }}>
            <div style={{ position:"absolute",top:-40,left:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,150,62,0.06) 0%,transparent 70%)" }}/>
            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ width:64,height:64,background:`linear-gradient(135deg,#6b4c1a,${BRAND.gold})`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:BRAND.navy,marginBottom:24 }}>M</div>
              <div style={{ fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold,marginBottom:12 }}>The Mirji Family</div>
              <h3 className="cormorant" style={{ fontSize:36,fontWeight:600,color:BRAND.white,lineHeight:1.1,marginBottom:8 }}>Dharmappa Mirji</h3>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:28,letterSpacing:"0.05em" }}>Co-Founder & Pillar of Operations, 1913</div>
              <div style={{ width:"100%",height:1,background:"rgba(184,150,62,0.2)",marginBottom:28 }}/>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:20 }}>
                Mr. Dharmappa Mirji was the operational backbone of the Manickbag enterprise. Where Manickchand Shah dreamed expansively, Dharmappa grounded those dreams in disciplined execution and deep community relationships.
              </p>
              <p style={{ fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.6)",marginBottom:28 }}>
                The Mirji family legacy is equally present today. Sheel Mirji leads Manickbag Industries, managing the Sesa Goa partnership for pig iron and coke.
              </p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  "Dharmappa Mirji — Co-Founder, 1913",
                  "Sheel Mirji — Manickbag Industries (Sesa Goa)",
                  "Continuing family presence across group entities",
                ].map((name,i)=>(
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

    {/* Heritage Photos Wall */}
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
          <div className="gold-line"/>
          <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Heritage Gallery</span>
        </div>

        {/* Row 1 — big + 2 columns of 2 */}
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:4 }}>
          {/* ── IMAGE 5 ── Legacy · Gallery · Large top-left */}
          <OldPhoto
            src="https://manickbag.in/images/multi.png"
            label="The Founding Partners"
            year="Manwickbag Automobiles"
            objectPos="center center"
          />
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            {/* ── IMAGE 6 ── Legacy · Gallery · Middle-top */}
            <OldPhoto
              src="https://manickbag.in/images/mktruck.png"
              label="Manickbag Engineers"
              year="Belgaum · 1950"
            />
            {/* ── IMAGE 7 ── Legacy · Gallery · Middle-bottom */}
            <OldPhoto
              src="https://manickbag.in/images/tk.png"
              label="Diesel Conversion Bay"
              year="Early 1950s"
            />
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            {/* ── IMAGE 8 ── Legacy · Gallery · Right-top */}
            <OldPhoto
              src="https://manickbag.in/images/int.png"
              label="Simpsons Dealership"
              year="1951"
            />
            {/* ── IMAGE 9 ── Legacy · Gallery · Right-bottom */}
            <OldPhoto
              src="https://manickbag.in/images/out.png"
              label="MICO & Ashok Leyland"
              year="1956"
            />
          </div>
        </div>

        {/* Row 2 — 4 equal photos */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4,marginTop:4 }}>
          {/* ── IMAGE 10 ── Legacy · Gallery · Bottom row 1 */}
          <OldPhoto
            src="https://manickbag.in/images/innergarge.png"
            label="TVS Motors Dealership"
            year="1979"
          />
          {/* ── IMAGE 11 ── Legacy · Gallery · Bottom row 2 */}
          <OldPhoto
            src="https://manickbag.in/images/engine.png"
            label="Hubbli Branch Opening"
            year="1984"
          />
          {/* ── IMAGE 12 ── Legacy · Gallery · Bottom row 3 */}
          <OldPhoto
            src="https://manickbag.in/images/int.png"
            label="TATA Commercial Vehicles"
            year="1992"
          />
          {/* ── IMAGE 13 ── Legacy · Gallery · Bottom row 4 */}
          <OldPhoto
            src="https://manickbag.in/images/tk.png"
            label="TATA Car Dealership"
            year="1999"
          />
        </div>
      </div>
    </section>

    {/* Partnership Values */}
    <section style={{ background: BRAND.navyMid, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
          <div style={{ width:60,height:1,background:BRAND.gold }}/>
          <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Values We Inherited</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2 }}>
          {[
            { icon:"🤝",title:"Partnership",desc:"Two families, one handshake, and a partnership that has lasted over a century without a single written contract between them." },
            { icon:"📿",title:"Integrity",desc:"Every business decision — from rice mills to EVs — has been guided by the principle that your word is your bond." },
            { icon:"🌱",title:"Reinvention",desc:"From soap factories to diesel conversions to electric vehicles — Manickbag has always embraced change with courage." },
            { icon:"🏡",title:"Community",desc:"The Shahs and Mirjis never saw themselves as businessmen alone. They saw themselves as stewards of North Karnataka." },
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
    { year:"1913", era:"Foundation", icon:"🏛", headline:"Manickbag Is Born", detail:"Mr. Manickchand Shah and Mr. Dharmappa Mirji establish Manickbag in Kalaburagi. Operations begin with rice mills and a soap factory.", highlight:true },
    { year:"1920s", era:"Growth", icon:"🌾", headline:"Groundnut Oil & Export", detail:"Manickbag diversifies into groundnut oil manufacturing and begins exporting — establishing trading routes across the region.", highlight:false },
    { year:"1950", era:"Automobiles", icon:"🔧", headline:"Manickbag Engineers", detail:"The automobile chapter begins. A workshop is opened for petrol-to-diesel engine conversions — revolutionary technology for its time.", highlight:true },
    { year:"1951", era:"Dealerships", icon:"🚗", headline:"Simpsons Dealership", detail:"The success of Manickbag Engineers earns them the prestigious Simpsons dealership — the first of many to come.", highlight:false },
    { year:"1956", era:"Dealerships", icon:"⚙️", headline:"MICO & Ashok Leyland", detail:"MICO dealership secured. Ashok Leyland sub-dealership under Sundaram Motors established — Manickbag Automobiles officially named.", highlight:false },
    { year:"1956", era:"Expansion", icon:"🏗", headline:"Manickbag Garage", detail:"A full machine shop launched with rebuilding machines, crankshaft grinder, and block boring machine.", highlight:false },
    { year:"1979", era:"Two-Wheelers", icon:"🛵", headline:"TVS & Sundaram Clayton", detail:"Manickbag takes up dealership of Sundaram Clayton and TVS mopeds — diversifying into two-wheelers.", highlight:false },
    { year:"1984", era:"Expansion", icon:"🏢", headline:"First Branch — Hubli", detail:"The very first showroom outside Belgaum opens in Hubli.", highlight:true },
    { year:"1992", era:"TATA Motors", icon:"🚛", headline:"TATA Diesel Dealership", detail:"Manickbag is awarded the TATA Motors dealership for diesel vehicles — the beginning of the most significant partnership in their history.", highlight:true },
    { year:"1993", era:"TATA Expansion", icon:"📍", headline:"Bijapur Branch", detail:"New showroom opens in Bijapur, extending the Manickbag network.", highlight:false },
    { year:"1995", era:"TATA Expansion", icon:"📍", headline:"Ankola Branch", detail:"Ankola branch established — coastal Karnataka now served by Manickbag.", highlight:false },
    { year:"1999", era:"Milestone", icon:"🏆", headline:"TATA Car Dealership + Best CSI All India", detail:"TATA Motors car dealership launched. In the very first year, Manickbag is awarded Best CSI All India by Honorable Chairman Shri Ratan Tata himself.", highlight:true },
    { year:"2004", era:"Expansion", icon:"🌟", headline:"Gulbarga Branch", detail:"New branch added in Gulbarga, strengthening the Hyderabad-Karnataka region presence.", highlight:false },
    { year:"2005", era:"Expansion", icon:"🌟", headline:"Gokak Branch", detail:"Gokak showroom opened — Manickbag's footprint expands across Belgaum district.", highlight:false },
    { year:"2024+", era:"Future", icon:"⚡", headline:"Electric Vehicle Era", detail:"Manickbag leads North Karnataka into the EV era with the full TATA Electric lineup across 12 showrooms.", highlight:true },
  ];

  return (
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
          <div className="gold-line"/>
          <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>1913 — Present</span>
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.2,marginBottom:60 }}>
          A Century of<br /><span className="gold-shimmer">Defining Moments</span>
        </h2>

        <div style={{ position:"relative",paddingLeft:48 }}>
          <div style={{ position:"absolute",left:20,top:0,bottom:0,width:2,background:`linear-gradient(${BRAND.gold},rgba(184,150,62,0.1))` }}/>
          {milestones.map((m, i) => (
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
                  {m.highlight && (
                    <div style={{ padding:"6px 14px",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",flexShrink:0,alignSelf:"flex-start",marginTop:4 }}>KEY MILESTONE</div>
                  )}
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
    {
      name: "Vijay Shah",
      role: "Director — Manickbag Diesel (Belgaum)",
      division: "MICO Dealership · Belgaum",
      family: "Shah",
      generation: "3rd Generation",
      quote: "My grandfather started with a rice mill. I run a diesel dealership. My son will lead EVs. The name changes. The values don't.",
      // ── IMAGE 14 ── Leadership · Vijay Shah portrait
      src: "",
    },
    {
      name: "Milind Shah",
      role: "Director — Manickbag Diesel (Hubli)",
      division: "MICO Dealership · Hubli",
      family: "Shah",
      generation: "3rd Generation",
      quote: "Being a Manickbag director is not a title — it's a responsibility to every family that walks through our doors.",
      // ── IMAGE 15 ── Leadership · Milind Shah portrait
      src: "",
    },
    {
      name: "Swapnil Shah",
      role: "Director — Manickbag Engineers",
      division: "TVS Motors · Belgaum",
      family: "Shah",
      generation: "3rd Generation",
      quote: "The two-wheeler market is the heartbeat of small-town India. We serve that heartbeat every single day.",
      // ── IMAGE 16 ── Leadership · Swapnil Shah portrait
      src: "",
    },
    {
      name: "Sheel Mirji",
      role: "Director — Manickbag Industries",
      division: "Sesa Goa (Pig Iron & Coke)",
      family: "Mirji",
      generation: "3rd Generation",
      quote: "The Mirji family has always believed in diversification — not just for profit, but to stay rooted in the real economy.",
      // ── IMAGE 17 ── Leadership · Sheel Mirji portrait
      src: "",
    },
    {
      name: "Sanjot Shah",
      role: "Director — TATA Car Division",
      division: "TATA Motors Cars · Hubli",
      family: "Shah",
      generation: "3rd Generation",
      quote: "Selling a car is easy. Building a 20-year relationship with that customer's family — that's the Manickbag way.",
      // ── IMAGE 18 ── Leadership · Sanjot Shah portrait
      src: "",
    },
    {
      name: "Sheel Shah & Shirish Shah",
      role: "Directors — New TATA Car Showroom",
      division: "Khanapur Road · Belgaum",
      family: "Shah",
      generation: "4th Generation",
      quote: "We are the next chapter. We carry 110 years of trust in our hands — and we don't take that lightly.",
      // ── IMAGE 19 ── Leadership · Sheel & Shirish Shah portrait
      src: "",
    },
  ];

  return (
    <>
      <section style={{ background: BRAND.white, padding: "80px 0 60px", width: "100%" }}>
        <div style={W}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                <div className="gold-line"/>
                <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Leadership Today</span>
              </div>
              <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)",fontWeight:600,color:BRAND.navyMid,lineHeight:1.15,marginBottom:24 }}>
                Four Generations,<br /><span className="gold-shimmer">One Direction</span>
              </h2>
              <p style={{ fontSize:16,lineHeight:1.9,color:BRAND.muted,marginBottom:20 }}>
                The Manickbag Group today is led by the third and fourth generations of the Shah and Mirji families. They did not simply inherit a business — they inherited a responsibility, a set of values, and a name that carries 110 years of promise.
              </p>
              <p style={{ fontSize:16,lineHeight:1.9,color:BRAND.muted }}>
                Across six business divisions and twelve showrooms, each director brings their own expertise — but they are united by the founding compact: <strong style={{ color: BRAND.navyMid }}>serve the customer the way you would serve family.</strong>
              </p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:2 }}>
              {[{ num:"2",label:"Founding Families" },{ num:"4+",label:"Generations" },{ num:"6",label:"Business Divisions" },{ num:"110+",label:"Years Together" }].map((s,i)=>(
                <div key={s.label} className="anim-scaleIn" style={{ background:i%2===0?BRAND.navy:BRAND.offWhite,padding:"40px 28px",textAlign:"center",opacity:0,animationDelay:`${i*0.1}s` }}>
                  <div className="cormorant" style={{ fontSize:56,fontWeight:600,color:i%2===0?BRAND.gold:BRAND.navyMid,lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontSize:10,letterSpacing:"0.15em",color:i%2===0?"rgba(255,255,255,0.4)":BRAND.muted,textTransform:"uppercase",marginTop:8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Cards */}
      <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
        <div style={W}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:48 }}>
            <div className="gold-line"/>
            <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>Our Directors</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
            {leaders.map((leader, i) => (
              <div key={leader.name}
                className="anim-fadeUp"
                onMouseOver={() => setHovered(i)}
                onMouseOut={() => setHovered(null)}
                style={{ background:BRAND.white,border:`1px solid ${hovered===i?BRAND.gold:"rgba(0,0,0,0.06)"}`,overflow:"hidden",transition:"border-color 0.3s, box-shadow 0.3s",boxShadow:hovered===i?"0 16px 48px rgba(0,0,0,0.1)":"none",opacity:0,animationDelay:`${i*0.1}s`,cursor:"pointer" }}>

                {/* Photo area — uses OldPhoto if src provided, placeholder if not */}
                <div style={{ height: 240, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})` }}>
                  {leader.src ? (
                    <img
                      src={leader.src}
                      alt={leader.name}
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", objectPosition: "center top",
                        filter: "grayscale(70%) contrast(1.08) brightness(0.92) sepia(15%)",
                        transition: "filter 0.5s ease",
                        display: "block",
                      }}
                      onMouseOver={e => e.target.style.filter = "grayscale(20%) contrast(1.04) brightness(1)"}
                      onMouseOut={e => e.target.style.filter = "grayscale(70%) contrast(1.08) brightness(0.92) sepia(15%)"}
                    />
                  ) : (
                    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12 }}>
                      <div style={{ width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,rgba(184,150,62,0.2),rgba(184,150,62,0.4))`,border:`2px solid ${BRAND.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32 }}>👤</div>
                      <div style={{ fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase" }}>Add src="" for photo</div>
                    </div>
                  )}
                  {/* Scanline overlay */}
                  <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 4px)" }}/>
                  {/* Family badge */}
                  <div style={{ position:"absolute",top:16,right:16,padding:"4px 12px",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase" }}>{leader.family} Family</div>
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"12px 20px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))" }}>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em",textTransform:"uppercase" }}>{leader.generation}</div>
                  </div>
                </div>

                <div style={{ padding:"28px 28px" }}>
                  <h3 className="cormorant" style={{ fontSize:26,fontWeight:600,color:BRAND.navyMid,lineHeight:1.1,marginBottom:6 }}>{leader.name}</h3>
                  <div style={{ fontSize:12,color:BRAND.gold,letterSpacing:"0.08em",fontWeight:600,textTransform:"uppercase",marginBottom:4 }}>{leader.role}</div>
                  <div style={{ fontSize:12,color:BRAND.muted,marginBottom:20,letterSpacing:"0.04em" }}>{leader.division}</div>
                  <div style={{ width:"100%",height:1,background:"rgba(0,0,0,0.06)",marginBottom:20 }}/>
                  <div style={{ position:"relative",padding:"0 0 0 16px",borderLeft:`2px solid ${hovered===i?BRAND.gold:"rgba(184,150,62,0.3)"}`,transition:"border-color 0.3s" }}>
                    <p className="cormorant-italic" style={{ fontSize:15,lineHeight:1.7,color:BRAND.navyMid,opacity:0.7 }}>"{leader.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Visionaries */}
      <section style={{ background:BRAND.navy,padding:"80px 0",width:"100%" }}>
        <div style={W}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16 }}>
              <div style={{ width:40,height:1,background:BRAND.gold }}/>
              <span style={{ fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:BRAND.gold }}>The Founders</span>
              <div style={{ width:40,height:1,background:BRAND.gold }}/>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3.5vw,44px)",fontWeight:300,color:BRAND.white }}>Those Who Started It All</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,maxWidth:800,margin:"0 auto" }}>
            {[
              { name:"Manickchand Shah",  role:"Co-Founder", year:"1913–Legacy", family:"Shah Family",
                // ── IMAGE 20 ── Leadership · Manickchand Shah founder portrait
                src: "" },
              { name:"Dharmappa Mirji",   role:"Co-Founder", year:"1913–Legacy", family:"Mirji Family",
                // ── IMAGE 21 ── Leadership · Dharmappa Mirji founder portrait
                src: "" },
            ].map((f,i)=>(
              <div key={f.name} className="anim-fadeUp" style={{ background:"rgba(255,255,255,0.04)",border:`1px solid ${BRAND.borderLight}`,overflow:"hidden",opacity:0,animationDelay:`${i*0.15}s` }}>
                {/* Founder photo area */}
                <div style={{ height:220,position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navy})` }}>
                  {f.src ? (
                    <img src={f.src} alt={f.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"grayscale(75%) contrast(1.1) brightness(0.9) sepia(20%)",display:"block" }} />
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
//  LAYOUT WRAPPER
// ══════════════════════════════════════════════════════════════════
const heritageHeroData = {
  "/heritage":              { tag:"Our Heritage · Since 1913",    headline:"The Manickbag\nStory",              sub:"From rice mills to electric vehicles — 110 years of enterprise, integrity, and family." },
  "/heritage/legacy":       { tag:"Shah & Mirji Families",        headline:"Two Families,\nOne Century",       sub:"The story of the visionaries who bet on each other in 1913 — and never looked back." },
  "/heritage/milestones":   { tag:"Our Journey · 1913–Present",   headline:"Milestones That\nShaped a Legacy", sub:"Every dealership, every branch, every award — charted across more than a century." },
  "/heritage/leadership":   { tag:"The People Behind the Brand",  headline:"Our Leadership\nToday",            sub:"Four generations of the Shah and Mirji families, continuing the founding vision." },
};

function HeritageLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const heroData = heritageHeroData[location.pathname] || heritageHeroData["/heritage"];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [location.pathname]);

  return (
    <div style={{ minHeight:"100vh",width:"100%",background:BRAND.white,overflowX:"hidden" }}>
      <FontLink />
      <TopBar />
      <Navbar scrolled={scrolled} />
      <HeritageHero tag={heroData.tag} headline={heroData.headline} sub={heroData.sub} />
      <HeritageSubNav />
      <main>{children}</main>
      <Footer />
      <FloatingWA />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  ROOT EXPORT
// ══════════════════════════════════════════════════════════════════
export default function Heritage() {
  return (
    <HeritageLayout>
      <Routes>
        <Route index          element={<OurStory />} />
        <Route path="legacy"       element={<ShahMirjiLegacy />} />
        <Route path="milestones"   element={<Milestones />} />
        <Route path="leadership"   element={<Leadership />} />
      </Routes>
    </HeritageLayout>
  );
}