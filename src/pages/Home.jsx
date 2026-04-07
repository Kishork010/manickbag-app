import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ─── BRAND TOKENS ────────────────────────────────────────────────
const BRAND = {
  navy: "#0a1628",
  navyMid: "#0c1f3f",
  navyLight: "#1a3d7c",
  gold: "#b8963e",
  goldLight: "#d4af5a",
  goldPale: "#f0e4c2",
  white: "#ffffff",
  offWhite: "#f7f5f0",
  muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ─── FONT INJECT ─────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }
    body { font-family: 'Jost', sans-serif; background: #ffffff; color: #0c1f3f; }

    .cormorant { font-family: 'Cormorant Garamond', serif; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #ffffff; }
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

    .anim-fadeUp    { animation: fadeUp    0.7s ease forwards; }
    .anim-fadeIn    { animation: fadeIn    0.6s ease forwards; }
    .anim-slideLeft { animation: slideLeft 0.6s ease forwards; }

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

    /* ── standard dropdown ── */
    .dropdown-menu {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }

    /* ── vehicles mega dropdown ── */
    .vehicles-dropdown {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .vehicles-nav-item:hover .vehicles-dropdown {
      opacity: 1; visibility: visible; transform: translateY(0);
    }

    /* ── shared flyout sub-menu panel ── */
    .sub-menu-open   { opacity: 1; visibility: visible;  transform: translateX(0);  }
    .sub-menu-closed { opacity: 0; visibility: hidden;   transform: translateX(6px); }
    .sub-menu-panel {
      position: absolute; left: 100%; top: -2px;
      min-width: 195px;
      background: rgba(6,14,28,0.99);
      border: 1px solid rgba(184,150,62,0.25);
      border-left: 2px solid #b8963e;
      padding: 8px 0;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      z-index: 20;
    }

    .ticker-inner { display: flex; white-space: nowrap; animation: ticker 30s linear infinite; }
    .ticker-inner:hover { animation-play-state: paused; }

    .hero-slide { position: absolute; inset: 0; transition: opacity 0.8s ease; }

    .topbar-showrooms-link {
      color: rgba(255,255,255,0.55); text-decoration: none; cursor: pointer; transition: color 0.2s;
    }
    .topbar-showrooms-link:hover { color: #b8963e; text-decoration: underline; }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────
  const heroSlides = [
  {tag: "Celebrating 6 Decades", headline: "A Legacy Built\non Trust & Steel", sub: "Manickbag Automobiles — North Karnataka's most trusted Tata Motors partner since 1913.", cta: "Explore Our Story",
    gradient: "linear-gradient(135deg,#0a1628 0%,#1a3d7c 60%,#0a1628 100%)",shape: "hexagon",action: "navigate",link: "/heritage"},
  {tag: "New Arrivals 2026",headline: "Drive the Future.\nTata EV Collection",sub: "Experience the full Nexon EV, Punch EV & Tiago EV lineup at our Kalaburagi showroom.",
    cta: "View EV Range",gradient: "linear-gradient(135deg,#050f1f 0%,#0c2d5e 50%,#1a5276 100%)",shape: "circle",action: "scrollVehicles"},
  {tag: "12 Showrooms Across Karnataka",headline: "Wherever You Are,\nWe Are Near",sub: "Bagalkot · Bidar · Dharwad · Gadag · Haveri · Kalaburagi · Raichur · Vijayapura & more.",
    cta: "Find a Showroom",gradient: "linear-gradient(135deg,#0a1628 0%,#2d1810 50%,#1a0a00 100%)",shape: "diamond",action: "external",link: "https://maps.app.goo.gl/Unv8NQ4Dro4jEcnWA"},
];


const vehicles = [
  { name: "Tiago",      category: "Hatchback",   fuel: ["Petrol", "iCNG"],     tag: "Budget Friendly", color: "#64b5f6", image: "https://www.manickbag.in/images/tiago.jpg" },
  { name: "Tiago EV",   category: "Hatchback",   fuel: "Electric",   tag: "City EV",         color: "#00e676", image: "https://www.manickbag.in/images/tiago_ev.avif" },
  { name: "Altroz",     category: "Hatchback",   fuel: ["Petrol", "Diesel", "iCNG"],     tag: "Stylish",         color: "#f48fb1", image: "https://www.manickbag.in/images/altroz.jpg" },
  { name: "Tigor",      category: "Sedan",       fuel: "Petrol",     tag: "Compact Sedan",   color: "#9575cd", image: "https://www.manickbag.in/images/tigor.jpg" },
  { name: "Tigor EV",   category: "Sedan",       fuel: "Electric",   tag: "Fleet Favorite",  color: "#00e676", image: "https://www.manickbag.in/images/tigor_ev.avif" },
  { name: "Punch",      category: "SUV",         fuel: ["Petrol", "iCNG"],     tag: "5-Star Safety",   color: "#ffca28", image: "https://www.manickbag.in/images/Punch.png" },
  { name: "Punch EV",   category: "SUV",         fuel: "Electric",   tag: "New Launch",       color: "#00e676", image: "https://www.manickbag.in/images/punch_ev.avif" },
  { name: "Nexon",      category: "SUV",         fuel: ["Petrol", "Diesel", "iCNG"],     tag: "Top Seller",      color: "#ff8a65", image: "https://www.manickbag.in/images/naxon.avif" },
  { name: "Nexon EV",   category: "SUV",         fuel: "Electric",   tag: "Best Seller",     color: "#4fc3f7", image: "https://www.manickbag.in/images/nexon_ev.avif" },
  { name: "Harrier",    category: "UV",          fuel: ["Petrol", "Diesel"],     tag: "Flagship",        color: "#ce93d8", image: "https://www.manickbag.in/images/harrier.avif" },
  { name: "Harrier EV", category: "UV",          fuel: "Electric",   tag: "Upcoming",        color: "#00e676", image: "https://www.manickbag.in/images/harrier_ev.webp" },
  { name: "Safari",     category: "UV",          fuel: ["Petrol", "Diesel"],     tag: "Premium",         color: "#b8963e", image: "https://www.manickbag.in/images/safari.avif" },
  { name: "Curvv",      category: "Coupe",       fuel: ["Petrol", "Diesel"],     tag: "Upcoming",        color: "#90caf9", image: "https://www.manickbag.in/images/curvv.avif" },
  { name: "Curvv EV",   category: "Coupe",       fuel: "Electric",   tag: "Future EV",       color: "#00e676", image: "https://www.manickbag.in/images/curvv_ev.avif" },
  { name: "Sierra",     category: "SUV",         fuel: ["Petrol", "Diesel"],     tag: "Concept",         color: "#a1887f", image: "https://www.manickbag.in/images/sierra2.avif" },
  { name: "Xpress T",   category: "Sedan",       fuel: ["Petrol", "iCNG"],     tag: "Future Concept",  color: "#ce93d8", image: "https://www.manickbag.in/images/express t pv.avif" },
  { name: "Xpress T EV",category: "Sedan",       fuel: "Electric",   tag: "Future Concept",  color: "#00e676", image: "https://www.manickbag.in/images/xpress t ev.avif" },
];

const services = [
  { icon: "🔧", title: "Authorised Service",  desc: "Factory-trained technicians with genuine Tata parts and diagnostic tools." },
  { icon: "💳", title: "Finance & Insurance", desc: "Tailored EMI plans, low-interest partnerships with leading banks & NBFCs." },
  { icon: "🚗", title: "Extended Warranty",   desc: "Peace of mind with coverage plans extending up to 5 years." },
  { icon: "🔄", title: "Exchange Programme",  desc: "Upgrade seamlessly — fair valuations, instant processing." },
  { icon: "📱", title: "Digital Booking",     desc: "Book test drives, service slots, and accessories from your phone." },
  { icon: "🏠", title: "Doorstep Service",    desc: "Home pickup & drop for servicing across major North Karnataka cities." },
];

const stats = [
  { value: "62+",  label: "Years of Excellence" },
  { value: "12+",  label: "Showrooms" },
  { value: "50K+", label: "Happy Families" },
  { value: "3",    label: "States Served" },
];

const locations = ["Belgaum","Hubli","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"];

const showroomMenuItems = [
  { city: "Belgaum", sub: [
    { label: "3'S Belgaum",        key: "belgaum-3s" },
    { label: "EMO Chikkodi",       key: "belgaum-emo-chikkodi" },
    { label: "EMO Ramdurg",        key: "belgaum-emo-ramdurg" },
    { label: "EMO Savadatti",      key: "belgaum-emo-savadatti" },
    { label: "EMO Raibag",         key: "belgaum-emo-raibag" },
    { label: "EMO Bailhongal",     key: "belgaum-emo-bailhongal" },
  ]},
  { city: "Hubli", sub: [
    { label: "3'S Hubli",          key: "hubli-3s" },
    { label: "EMO Haveri",         key: "hubli-emo-haveri" },
    { label: "EMO Mudeshwar",      key: "hubli-emo-mudeshwar" },
    { label: "EMO Sirsi",          key: "hubli-emo-sirsi" },
  ]},
  { city: "Dharwad", sub: [
    { label: "3'S Dharwad",        key: "dharwad-3s" },
  ]},
  { city: "Karwar", sub: [
    { label: "3'S Karwar",         key: "karwar-3s" },
    { label: "EMO Ankola",         key: "karwar-emo-ankola" },
  ]},
  { city: "Bijapur", sub: [
    { label: "3'S Bijapur",        key: "bijapur-3s" },
  ]},
  { city: "Gulbarga", sub: [
    { label: "3'S Kalaburagi",     key: "gulbarga-3s" },
    { label: "EMO Bidar",          key: "gulbarga-emo-bidar" },
    { label: "EMO Yadgiri",        key: "gulbarga-emo-yadgiri" },
  
  ]},
];
// ─── VEHICLES MENU COLUMNS ────────────────────────────────────────
// "All Vehicles", "Hatchback", "Sedan", "SUV" → /#vehicles?type=X  (stay on home, scroll & filter)
// "Finance", "AMC", "Extended Warranty"        → separate pages
// "Other Services"                             → flyout sub-menu
const vehicleMenuCols = [
  {
    heading: "",
    items: ["Hatchback","Sedan","SUV","Finance","AMC","Extended Warrenty","Other Services"],
  },
];

const navItems = [
  {
    label: "Services",
    children: [
      { label: "Book Service",       path: "/service" },
      { label: "Renewal Insurance",  path: "/insurance" },
      { label: "AMC",                path: "/amc" },
      { label: "Extended Warranty",  path: "/extended-warranty" },
      { label: "RAS",                path: "/rsa" },
      { label: "Accessories",        path: "/accessories" },
      { label: "VAS",                path: "/vas" },
    ],
  },
  {
    label: "Heritage",
    children: [
      { label: "Our Story",           path: "/heritage" },
      { label: "Shah & Mirji Legacy", path: "/heritage/legacy" },
      { label: "Milestones",          path: "/heritage/milestones" },
      { label: "Leadership",          path: "/heritage/leadership" },
    ],
  },
  // ✅ FIXED — all paths set
  {
    label: "Offers",
    children: [
      { label: "Current Offers",   path: "/current-offers" },
      { label: "Corporate Deals",  path: "/corporate-deals" },
      { label: "Exchange Bonus",   path: "/exchange-bonus" },
      { label: "Finance Schemes",  path: "/finance-schemes" },
    ],
  },
];

const W = { width: "100%", padding: "0 48px" };

// ══════════════════════════════════════════════════════════════════
//  TOP BAR
// ══════════════════════════════════════════════════════════════════
const TopBar = ({ onShowroomsClick }) => (
  <div style={{ background: BRAND.navyMid, borderBottom: `1px solid ${BRAND.borderLight}`, padding: "6px 0", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 24, fontSize: 12, letterSpacing: "0.05em" }}>
          <a href="#showrooms" onClick={e => { e.preventDefault(); onShowroomsClick(); }} className="topbar-showrooms-link">
            📍 12 Showrooms across North Karnataka
          </a>
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
//  OTHER SERVICES items (flyout)
// ══════════════════════════════════════════════════════════════════
const otherServicesItems = [
  { label: "Accessories",  path: "/accessories" },
  { label: "VAS Services", path: "/vas" },
  { label: "Insurance",    path: "/insurance" },
  { label: "FASTag",       path: "/fastag" },
];

// ══════════════════════════════════════════════════════════════════
//  VEHICLES NAV ITEM
//  — category items (All Vehicles / Hatchback / Sedan / SUV)
//    navigate to /?type=Hatchback  → Home reads param, scrolls & filters
//  — Finance / AMC / Extended Warranty → separate pages
// ══════════════════════════════════════════════════════════════════
const VehiclesNavItem = () => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [subOpen,     setSubOpen]     = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub,  setHoveredSub]  = useState(null);
  const navigate = useNavigate();

  // Items that stay on Home and scroll to the vehicles section
  const homeFilterItems = ["All Vehicles","Hatchback","Sedan","SUV"];

  // Items that go to a dedicated page
  const pageRoutes = {
    "Finance":           "/finance",
    "AMC":               "/amc",
    "Extended Warrenty": "/extended-warranty",
  };

  const handleFilterClick = (item) => {
    const type = item === "All Vehicles" ? "" : item;
    // Navigate to home with ?type=X; Home will scroll + apply filter
    navigate(type ? `/?type=${type}` : "/");
    setMenuOpen(false);
  };

  return (
    <div
      className="vehicles-nav-item"
      style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setSubOpen(false); }}
    >
      <a href="/" className="nav-link"
        style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        Vehicles
      </a>

      <div className="vehicles-dropdown"
        style={{ position: "absolute", top: "100%", left: 0, width: 220, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>

        {vehicleMenuCols.map((col, ci) => (
          <div key={ci} style={{ flex: 1, padding: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
              {col.heading}
            </div>

            {col.items.map(item => {

              // ── OTHER SERVICES flyout ──
              if (item === "Other Services") {
                return (
                  <div key={item} style={{ position: "relative" }}
                    onMouseEnter={() => setSubOpen(true)}
                    onMouseLeave={() => setSubOpen(false)}
                  >
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 20px", fontSize: 13, cursor: "pointer", userSelect: "none",
                      color: subOpen ? BRAND.goldLight : "#ccc",
                      background: subOpen ? "rgba(184,150,62,0.07)" : "transparent",
                      borderLeft: subOpen ? `2px solid ${BRAND.gold}` : "2px solid transparent",
                      paddingLeft: subOpen ? 24 : 20,
                      transition: "all 0.2s",
                    }}>
                      <span>Other Services</span>
                      <span style={{ fontSize: 11, opacity: 0.8, marginRight: 2 }}>›</span>
                    </div>

                    <div className={`sub-menu-panel ${subOpen ? "sub-menu-open" : "sub-menu-closed"}`}>
                      <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "6px 20px 10px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
                        Other Services
                      </div>
                      {otherServicesItems.map((sub, si) => (
                          <Link
                            key={sub.label}
                            to={sub.path}   // ✅ FIXED
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 20px",
                              paddingLeft: hoveredSub === si ? 24 : 20,
                              color: hoveredSub === si ? BRAND.gold : "#ccc",
                              borderLeft: hoveredSub === si ? `2px solid ${BRAND.gold}` : "2px solid transparent",
                              textDecoration: "none",
                              fontSize: 13,
                              background: hoveredSub === si ? "rgba(184,150,62,0.07)" : "transparent",
                              transition: "all 0.18s ease",
                            }}
                            onMouseEnter={() => setHoveredSub(si)}
                            onMouseLeave={() => setHoveredSub(null)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                );
              }

              // ── DEDICATED PAGE ITEMS (Finance / AMC / Extended Warranty) ──
              if (pageRoutes[item]) {
                return (
                  <Link key={item} to={pageRoutes[item]}
                    style={{
                      display: "block", textDecoration: "none", fontSize: 13,
                      padding: "10px 20px",
                      paddingLeft: hoveredItem === `${ci}-${item}` ? 24 : 20,
                      color: hoveredItem === `${ci}-${item}` ? BRAND.gold : "#ccc",
                      borderLeft: hoveredItem === `${ci}-${item}` ? `2px solid ${BRAND.gold}` : "2px solid transparent",
                      background: hoveredItem === `${ci}-${item}` ? "rgba(184,150,62,0.07)" : "transparent",
                      transition: "all 0.18s ease",
                    }}
                    onMouseEnter={() => setHoveredItem(`${ci}-${item}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >{item}</Link>
                );
              }

              // ── HOME FILTER ITEMS (All Vehicles / Hatchback / Sedan / SUV) ──
              return (
                <div key={item}
                  onClick={() => handleFilterClick(item)}
                  style={{
                    display: "block", fontSize: 13, cursor: "pointer",
                    padding: "10px 20px",
                    paddingLeft: hoveredItem === `${ci}-${item}` ? 24 : 20,
                    color: hoveredItem === `${ci}-${item}` ? BRAND.gold : "#ccc",
                    borderLeft: hoveredItem === `${ci}-${item}` ? `2px solid ${BRAND.gold}` : "2px solid transparent",
                    background: hoveredItem === `${ci}-${item}` ? "rgba(184,150,62,0.07)" : "transparent",
                    transition: "all 0.18s ease",
                    userSelect: "none",
                  }}
                  onMouseEnter={() => setHoveredItem(`${ci}-${item}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >{item}</div>
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
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [openCity,    setOpenCity]    = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [hoveredSub,  setHoveredSub]  = useState(null);

  return (
    <div
      style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setOpenCity(null); setHoveredCity(null); }}
    >
      <a href="/showrooms" className="nav-link"
        style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        Showrooms
      </a>

      {menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 200, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0", zIndex: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
            Our Locations
          </div>

          {showroomMenuItems.map((item, idx) => {
            const isActive = openCity === idx;

            if (item.sub.length > 0) {
              return (
                <div key={item.city} style={{ position: "relative" }}
                  onMouseEnter={() => { setOpenCity(idx); setHoveredCity(idx); }}
                  onMouseLeave={() => { setOpenCity(null); setHoveredCity(null); }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", paddingLeft: isActive ? 24 : 20, fontSize: 13, cursor: "pointer", userSelect: "none", color: isActive ? BRAND.goldLight : "#ccc", background: isActive ? "rgba(184,150,62,0.07)" : "transparent", borderLeft: isActive ? `2px solid ${BRAND.gold}` : "2px solid transparent", transition: "all 0.2s" }}>
                    <span>{item.city}</span>
                    <span style={{ fontSize: 11, opacity: 0.8, marginRight: 2 }}>›</span>
                  </div>
                  <div className={`sub-menu-panel ${isActive ? "sub-menu-open" : "sub-menu-closed"}`}>
                    <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "6px 20px 10px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
                      {item.city}
                    </div>
                    {item.sub.map((subItem, si) => {
                      const subKey = `${idx}-${si}`;
                      return (
                        <Link
                          key={subItem.key}
                          to={`/showrooms/${subItem.key}`}
                          style={{ display: "block", padding: "10px 20px", paddingLeft: hoveredSub === subKey ? 24 : 20, color: hoveredSub === subKey ? BRAND.gold : "#ccc", borderLeft: hoveredSub === subKey ? `2px solid ${BRAND.gold}` : "2px solid transparent", background: hoveredSub === subKey ? "rgba(184,150,62,0.07)" : "transparent", textDecoration: "none", fontSize: 13, transition: "all 0.18s ease" }}
                          onMouseEnter={() => setHoveredSub(subKey)}
                          onMouseLeave={() => setHoveredSub(null)}
                        >{subItem.label}</Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.city} to={`/showrooms/${item.city.toLowerCase()}-3s`}
                style={{ display: "block", textDecoration: "none", fontSize: 13, padding: "10px 20px", color: "#ccc", borderLeft: "2px solid transparent" }}
                onMouseOver={e => { e.currentTarget.style.color = BRAND.gold; e.currentTarget.style.borderLeftColor = BRAND.gold; e.currentTarget.style.paddingLeft = "24px"; }}
                onMouseOut={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}>
                {item.city}
              </Link>
            );
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
  <nav style={{ position: "fixed", top: scrolled ? 0 : 33, left: 0, right: 0, zIndex: 900, background: scrolled ? "rgba(10,22,40,0.97)" : BRAND.navyMid, backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? BRAND.borderLight : "transparent"}`, transition: "all 0.4s ease", boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none", width: "100%" }}>
    <div style={{ ...W, display: "flex", alignItems: "center", height: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: BRAND.white, letterSpacing: "0.02em", lineHeight: 1.1 }}>MANICKBAG</div>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, textTransform: "uppercase", fontWeight: 500 }}>AUTOMOBILES PVT LTD</div>
        </div>
      </div>

      <div style={{ marginLeft: 20, padding: "3px 10px", border: `1px solid ${BRAND.borderLight}`, borderRadius: 2, fontSize: 10, color: BRAND.gold, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: "1.6" }}>
        <div>Tata Motors Passenger Vehicle</div>
        <div>Tata Motors Electric Mobility</div>
      </div>
      <div style={{ marginLeft: 20, padding: "3px 10px", border: `1px solid ${BRAND.borderLight}`, borderRadius: 2, fontSize: 10, color: BRAND.gold, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Tata Motors Authorized Dealer
      </div>

      <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
        <VehiclesNavItem />
        <ShowroomsNavItem />

        {navItems.map(item => (
          <div key={item.label} className="nav-item" style={{ position: "relative", padding: "0 4px" }}>
            <a href="#" className="nav-link"
              style={{ display: "block", padding: "8px 16px", color: BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = BRAND.gold}
              onMouseOut={e => e.currentTarget.style.color = BRAND.white}
            >{item.label}</a>
        
            {item.children && (
              <div className="dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, minWidth: 200, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>
                {item.children.map(child => (
                  <Link
                    key={child.label}
                    to={child.path}
                    style={{ display: "block", padding: "10px 20px", color: "#ccc", textDecoration: "none", fontSize: 13, transition: "all 0.2s", borderLeft: "2px solid transparent" }}
                    onMouseOver={e => { e.currentTarget.style.color = BRAND.gold; e.currentTarget.style.borderLeftColor = BRAND.gold; e.currentTarget.style.paddingLeft = "24px"; }}
                    onMouseOut={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}
                  >{child.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
        

        <button className="btn-gold" style={{ marginLeft: 16, padding: "10px 24px", fontSize: 12, borderRadius: 2 }}>
          <span>Book Test Drive</span>
        </button>
      </div>
    </div>
  </nav>
);

// ══════════════════════════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════════════════════════
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey]  = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => { setCurrent(c => (c + 1) % heroSlides.length); setAnimKey(k => k + 1); }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[current];
  const radius = slide.shape === "circle" ? "50%" : slide.shape === "hexagon" ? "30%" : "4px";

  const handleCTA = () => {
  if (slide.action === "navigate") {
    navigate(slide.link);
  }

  if (slide.action === "scrollVehicles") {
    navigate("/?type=All Vehicles"); // triggers your existing scroll logic
  }

  if (slide.action === "external") {
    window.open(slide.link, "_blank");
  }
};
  return (
    <section style={{ height: "100vh", minHeight: 700, position: "relative", overflow: "hidden", width: "100%" }}>
      {heroSlides.map((s, i) => (
        <div key={i} className="hero-slide" style={{ background: s.gradient, opacity: i === current ? 1 : 0 }} />
      ))}

      <div style={{ position: "absolute", right: "8%", top: "15%", width: 420, height: 420, border: "1px solid rgba(184,150,62,0.08)", borderRadius: radius, transform: "rotate(15deg)", transition: "all 1s ease" }} />
      <div style={{ position: "absolute", right: "12%", top: "20%", width: 300, height: 300, border: "1px solid rgba(184,150,62,0.15)", borderRadius: radius, transform: "rotate(30deg)", transition: "all 1s ease" }} />

      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.3, left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%`, animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
      ))}

      <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: 10, letterSpacing: "0.3em", color: "rgba(184,150,62,0.5)", textTransform: "uppercase" }}>Since 1913 · Kalaburagi · Karnataka</div>

      <div style={{ position: "relative", zIndex: 2, width: "100%", padding: "0 48px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div key={`tag-${animKey}`} className="anim-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, animationDelay: "0.1s", opacity: 0 }}>
          <div style={{ width: 32, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>{slide.tag}</span>
        </div>

        <h1 key={`h1-${animKey}`} className="cormorant anim-fadeUp" style={{ fontSize: "clamp(48px,7vw,88px)", fontWeight: 300, lineHeight: 1.1, color: BRAND.white, maxWidth: 700, animationDelay: "0.2s", opacity: 0, whiteSpace: "pre-line" }}>{slide.headline}</h1>

        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "24px 0" }} />

        <p key={`sub-${animKey}`} className="anim-fadeUp" style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: 520, marginBottom: 40, animationDelay: "0.4s", opacity: 0 }}>{slide.sub}</p>

        <div key={`btns-${animKey}`} className="anim-fadeUp" style={{ display: "flex", gap: 16, flexWrap: "wrap", animationDelay: "0.5s", opacity: 0 }}>
          <button
              onClick={handleCTA}
              className="btn-gold"
              style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}
            >
              <span>{slide.cta}</span>
            </button>
          <button className="btn-outline" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}>Contact Us</button>
        </div>

        <div key={`stats-${animKey}`} className="anim-fadeUp" style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", animationDelay: "0.6s", opacity: 0 }}>
          {stats.map(s => (
            <div key={s.label}>
              <div className="cormorant" style={{ fontSize: 40, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setAnimKey(k => k + 1); }} style={{ width: i === current ? 32 : 8, height: 3, border: "none", cursor: "pointer", background: i === current ? BRAND.gold : "rgba(255,255,255,0.2)", transition: "all 0.4s ease", borderRadius: 2 }} />
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 36, right: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</div>
        <div style={{ width: 1, height: 48, background: `linear-gradient(${BRAND.gold},transparent)`, animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  TICKER
// ══════════════════════════════════════════════════════════════════
const Ticker = () => {
  const items = ["Tiago","Tigor","Altroz","Curvv","Nexon","Punch","Safari","Sierra","Harrier","Tiago EV","Tigor EV","Nexon EV","Punch EV","Curvv EV","Harrier EV"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: `linear-gradient(90deg,${BRAND.gold} 0%,${BRAND.goldLight} 50%,${BRAND.gold} 100%)`, overflow: "hidden", padding: "12px 0", width: "100%" }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding: "0 32px", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.navy, display: "inline-flex", alignItems: "center", gap: 16 }}>
            {item}<span style={{ opacity: 0.4 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  VEHICLES SECTION
//  — reads ?type= from URL, applies filter, scrolls into view
// ══════════════════════════════════════════════════════════════════
const VehiclesSection = ({ sectionRef }) => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [fuelFilter,   setFuelFilter]   = useState("All");
  const filters   = ["All","Hatchback","Sedan","Coupe","SUV","UV"];
  const fuelTypes = ["All","Petrol","Diesel","iCNG","Electric"];

  // ── Read ?type= param and apply filter + scroll ──────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type   = params.get("type");
    if (type && filters.includes(type)) {
      setActiveFilter(type);
      setFuelFilter("All");
      // Small delay so section is rendered before scrolling
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (!type) {
      setActiveFilter("All");
    }
  }, [location.search]); // re-run whenever query string changes

    const filtered = vehicles.filter(v =>
      (activeFilter === "All" || v.category === activeFilter) &&
      (fuelFilter === "All" || v.fuel.includes(fuelFilter))
    );

  return (
    <section ref={sectionRef} id="vehicles" style={{ background: BRAND.offWhite, padding: "100px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="gold-line" />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Our Fleet</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: 600, color: BRAND.navyMid, lineHeight: 1.15 }}>
              {activeFilter === "All" ? "The Complete" : activeFilter} <br />
              {activeFilter === "All" ? "Tata Motors Range" : "Collection"}
            </h2>
          </div>
          <button
            onClick={() => { setActiveFilter("All"); setFuelFilter("All"); }}
            className="btn-outline"
            style={{ padding: "12px 28px", fontSize: 12, borderRadius: 2, borderColor: BRAND.navyMid, color: BRAND.navyMid }}
          >
            View All Models
          </button>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => { setActiveFilter(f); setFuelFilter("All"); }}
              style={{ padding: "8px 20px", fontSize: 12, cursor: "pointer", borderRadius: 2, background: activeFilter === f ? BRAND.navyMid : "transparent", color: activeFilter === f ? BRAND.white : BRAND.navyMid, border: `1px solid ${activeFilter === f ? BRAND.navyMid : "rgba(10,31,63,0.2)"}` }}>
              {f}
            </button>
          ))}
        </div>

          {/* Fuel Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
            {fuelTypes.map(f => (
              <button key={f} onClick={() => setFuelFilter(f)}
                style={{ padding: "6px 16px", fontSize: 11, cursor: "pointer", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", background: fuelFilter === f ? BRAND.gold : "transparent", color: fuelFilter === f ? BRAND.navy : BRAND.navyMid, border: `1px solid ${fuelFilter === f ? BRAND.gold : "rgba(0,0,0,0.2)"}`, transition: "all 0.2s" }}>
                {f}
              </button>
            ))}
          </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
          {filtered.map((v, i) => (
            <div key={v.name} className="card-hover" style={{ background: BRAND.white, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
              <div style={{ height: 180, background: `linear-gradient(135deg,${BRAND.navyMid}15,${v.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.4s ease" }}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", top: 16, left: 16, background: v.category.includes("Electric") ? "#4fc3f7" : BRAND.gold, color: BRAND.navy, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 10px", textTransform: "uppercase" }}>{v.tag}</div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: BRAND.muted, textTransform: "uppercase", marginBottom: 6 }}>{v.category}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: BRAND.navyMid, fontFamily: "'Cormorant Garamond',serif", margin: 0 }}>{v.name}</h3>
                  {fuelFilter === "All" && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(Array.isArray(v.fuel) ? v.fuel : [v.fuel]).map(f => (
                        <span key={f} style={{
                          fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
                          padding: "3px 7px", textTransform: "uppercase",
                          background: f === "Electric" ? "rgba(79,195,247,0.15)" : "rgba(184,150,62,0.12)",
                          color: f === "Electric" ? "#0288d1" : BRAND.gold,
                          border: `1px solid ${f === "Electric" ? "rgba(79,195,247,0.4)" : "rgba(184,150,62,0.35)"}`,
                          borderRadius: 2,
                        }}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "10px", fontSize: 11, cursor: "pointer", background: BRAND.navyMid, color: BRAND.white, border: "none", fontFamily: "'Jost',sans-serif", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = BRAND.navyLight}
                    onMouseOut={e => e.currentTarget.style.background = BRAND.navyMid}>Explore</button>
                  <button style={{ padding: "10px 14px", fontSize: 11, cursor: "pointer", background: "transparent", color: BRAND.gold, border: `1px solid ${BRAND.gold}`, fontFamily: "'Jost',sans-serif", transition: "all 0.2s" }}
                    onMouseOver={e => { e.currentTarget.style.background = BRAND.gold; e.currentTarget.style.color = BRAND.navy; }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND.gold; }}>EMI</button>
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
//  HERITAGE
// ══════════════════════════════════════════════════════════════════
const HeritageSection = () => {
  const navigate = useNavigate(); // ADD THIS LINE

  const milestones = [
    { year: "1913", event: "Founded in Kalaburagi by Shri. Mirji & Shah families" },
    { year: "1951", event: "Simpsons dealership — first automotive win" },
    { year: "1984", event: "First branch outside Belgaum opened in Hubli" },
    { year: "1992", event: "TATA Motors dealership awarded" },
    { year: "1999", event: "Best CSI All India award by Shri Ratan Tata" },
    { year: "2024", event: "Leading North Karnataka into the EV era" },
  ];
  return (
    <section style={{ background: BRAND.navyMid, padding: "100px 0", position: "relative", overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", right: -100, top: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }} />
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 60, height: 1, background: BRAND.gold }} />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Our Heritage</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 24 }}>
              Six Decades of<br /><span className="gold-shimmer">Trust & Excellence</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>What began as a single showroom in Kalaburagi has grown into North Karnataka's most respected automotive institution. The Manickbag legacy is built on relationships — not transactions.</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", marginBottom: 40 }}>Across three generations of the Shah and Mirji families, we have served over 50,000 families with integrity, expertise, and genuine care.</p>
            <button className="btn-gold" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }} onClick={() => navigate("/heritage")}><span>Read Our Full Story</span></button>
          </div>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(${BRAND.gold},transparent)` }} />
            {milestones.map((m, i) => (
              <div key={m.year} style={{ display: "flex", gap: 24, marginBottom: 32, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ position: "relative", flexShrink: 0, marginLeft: -40 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: i === 0 ? BRAND.gold : "rgba(184,150,62,0.3)", border: `2px solid ${BRAND.gold}`, marginTop: 4 }} />
                </div>
                <div>
                  <div className="cormorant" style={{ fontSize: 24, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{m.year}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4, lineHeight: 1.6 }}>{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  SERVICES
// ══════════════════════════════════════════════════════════════════
const ServicesSection = () => (
  <section style={{ background: "#ffffff", padding: "100px 0", width: "100%" }}>
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>What We Offer</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>Complete Ownership Experience</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
        {services.map((s, i) => (
          <div key={s.title} className="card-hover" style={{ background: BRAND.offWhite, padding: "40px 32px", cursor: "pointer", position: "relative", overflow: "hidden", borderBottom: "2px solid transparent", transition: "border-color 0.3s", animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}
            onMouseOver={e => e.currentTarget.style.borderBottomColor = BRAND.gold}
            onMouseOut={e => e.currentTarget.style.borderBottomColor = "transparent"}
          >
            <div style={{ fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: BRAND.navyMid, fontFamily: "'Cormorant Garamond',serif", marginBottom: 12, letterSpacing: "0.02em" }}>{s.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: BRAND.muted }}>{s.desc}</p>
            <div style={{ marginTop: 24, fontSize: 12, color: BRAND.gold, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8 }}>Learn More <span>→</span></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  SHOWROOMS SECTION
// ══════════════════════════════════════════════════════════════════
const ShowroomsSection = ({ sectionRef }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <section ref={sectionRef} id="showrooms" style={{ background: BRAND.offWhite, padding: "100px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="gold-line" />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Find Us</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 600, color: BRAND.navyMid, lineHeight: 1.2, marginBottom: 24 }}>12 Showrooms Across<br />North Karnataka</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: BRAND.muted, marginBottom: 32 }}>From Kalaburagi to Dharwad, we bring the full Tata Motors experience closer to where you live and work.</p>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ padding: "16px 20px", background: BRAND.navyMid, color: BRAND.white, textAlign: "center" }}>
                <div className="cormorant" style={{ fontSize: 32, fontWeight: 600, color: BRAND.gold }}>12</div>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", marginTop: 4 }}>Showrooms</div>
              </div>
              <div style={{ padding: "16px 20px", background: "rgba(10,31,63,0.08)", textAlign: "center" }}>
                <div className="cormorant" style={{ fontSize: 32, fontWeight: 600, color: BRAND.navyMid }}>6+</div>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", color: BRAND.muted, marginTop: 4 }}>Districts</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {locations.map((loc, i) => (
              <div key={loc} onMouseOver={() => setHovered(i)} onMouseOut={() => setHovered(null)}
                style={{ padding: "20px 24px", background: hovered === i ? BRAND.navyMid : BRAND.white, border: `1px solid ${hovered === i ? BRAND.navyMid : "rgba(0,0,0,0.06)"}`, cursor: "pointer", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: hovered === i ? BRAND.gold : BRAND.navyMid, transition: "background 0.3s", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: hovered === i ? BRAND.white : BRAND.navyMid, transition: "color 0.3s" }}>{loc}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, opacity: hovered === i ? 1 : 0, transition: "opacity 0.3s", color: BRAND.gold }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  CTA
// ══════════════════════════════════════════════════════════════════
const CTASection = () => (
  <section style={{ background: `linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 100%)`, padding: "80px 0", position: "relative", overflow: "hidden", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 20 }}>Ready to Drive Home<br />Your Dream Tata?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>Book a test drive at your nearest Manickbag showroom. Our experts will guide you to the perfect vehicle for your lifestyle and budget.</p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button className="btn-gold" style={{ padding: "16px 40px", fontSize: 14, borderRadius: 2 }}><span>📅 Book Test Drive</span></button>
          <button className="btn-outline" style={{ padding: "16px 40px", fontSize: 14, borderRadius: 2 }}>📞 Call Now</button>
        </div>
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════════
const Footer = () => (
  <footer style={{ background: "#0a1628", padding: "64px 0 32px", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: BRAND.navy, fontFamily: "'Cormorant Garamond',serif" }}>M</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: BRAND.white }}>MANICKBAG</div>
              <div style={{ fontSize: 8, letterSpacing: "0.25em", color: BRAND.gold }}>AUTOMOBILES</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", maxWidth: 280, marginBottom: 24 }}>North Karnataka's most trusted Tata Motors dealer since 1962. Serving families across 12 locations with integrity and excellence.</p>
          <div style={{ display: "flex", gap: 12 }}>
            {["F","I","L","Y"].map((s, i) => (
              <div key={i} style={{ width: 36, height: 36, border: `1px solid rgba(184,150,62,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: BRAND.gold, transition: "all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.background = BRAND.gold; e.currentTarget.style.color = BRAND.navy; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND.gold; }}>{s}</div>
            ))}
          </div>
        </div>
        {[
          { title: "Vehicles", links: ["SUVs","Hatchbacks","Sedans","Electric Vehicles","Commercial"] },
            { title: "Services", links: ["Book Service","Finance & EMI","Insurance","Accessories","Exchange"] },
            { title: "Company",  links: ["About Us","Heritage","Leadership","Careers","Media","Contact"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 20 }}>{col.title}</h4>
            {col.links.map(item => (
              <a key={item} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color = BRAND.goldLight}
                onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{item}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2025 Manickbag Automobiles. Authorised Tata Motors Dealer. All Rights Reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy","Terms of Use","Cookie Policy"].map(item => (
            <a key={item} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.25)"}>{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ══════════════════════════════════════════════════════════════════
//  FLOATING WHATSAPP
// ══════════════════════════════════════════════════════════════════
const FloatingWA = () => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
      style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      {hover && (
        <div style={{ background: BRAND.white, color: BRAND.navyMid, padding: "10px 16px", fontSize: 13, fontWeight: 500, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "slideLeft 0.3s ease", whiteSpace: "nowrap" }}>Chat with Us on WhatsApp</div>
      )}
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transform: hover ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>💬</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  HOME PAGE
// ══════════════════════════════════════════════════════════════════
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const showroomsRef  = useRef(null);
  const vehiclesSectionRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToShowrooms = () => {
    showroomsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#ffffff", overflowX: "hidden" }}>
      <FontLink />
      <TopBar onShowroomsClick={scrollToShowrooms} />
      <Navbar scrolled={scrolled} />
      <Hero />
      <Ticker />
      {/* Pass the ref so VehiclesSection can scroll into view when a filter is applied via URL */}
      <VehiclesSection sectionRef={vehiclesSectionRef} />
      <HeritageSection />
      <ServicesSection />
      <ShowroomsSection sectionRef={showroomsRef} />
      <CTASection />
      <Footer />
      <FloatingWA />
    </div>
  );
}