import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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

// ─── FONT + GLOBAL STYLES ─────────────────────────────────────────
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
      from { transform: translateX(0); }
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

    .topbar-showrooms-link {
      color: rgba(255,255,255,0.55); text-decoration: none; cursor: pointer; transition: color 0.2s;
    }
    .topbar-showrooms-link:hover { color: #b8963e; text-decoration: underline; }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────
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

const otherServicesItems = [
  { label: "Accessories",  path: "/accessories" },
  { label: "VAS Services", path: "/vas" },
  { label: "Insurance",    path: "/insurance" },
  { label: "FASTag",       path: "/fastag" },
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
          <a
            href="#showrooms"
            onClick={e => { e.preventDefault(); onShowroomsClick && onShowroomsClick(); }}
            className="topbar-showrooms-link"
          >
            📍 12 Showrooms across North Karnataka
          </a>
          <span style={{ color: BRAND.borderLight }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>☎ +91 96860 24365</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          {["Careers","Investors","Media"].map(l => (
            <a key={l} href="#"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >{l}</a>
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
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [subOpen,     setSubOpen]     = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub,  setHoveredSub]  = useState(null);
  const navigate = useNavigate();

  const homeFilterItems = ["All Vehicles","Hatchback","Sedan","SUV"];
  const pageRoutes = {
    "Finance":           "/finance",
    "AMC":               "/amc",
    "Extended Warrenty": "/extended-warranty",
  };

  const handleFilterClick = (item) => {
    const type = item === "All Vehicles" ? "" : item;
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
      <Link to="/" className="nav-link"
        style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        Vehicles
      </Link>

      <div className="vehicles-dropdown"
        style={{ position: "absolute", top: "100%", left: 0, width: 220, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>

        {vehicleMenuCols.map((col, ci) => (
          <div key={ci} style={{ flex: 1, padding: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
              {col.heading}
            </div>

            {col.items.map(item => {
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
                        <Link key={sub.label} to={sub.path}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 20px",
                            paddingLeft: hoveredSub === si ? 24 : 20,
                            color: hoveredSub === si ? BRAND.gold : "#ccc",
                            borderLeft: hoveredSub === si ? `2px solid ${BRAND.gold}` : "2px solid transparent",
                            textDecoration: "none", fontSize: 13,
                            background: hoveredSub === si ? "rgba(184,150,62,0.07)" : "transparent",
                            transition: "all 0.18s ease",
                          }}
                          onMouseEnter={() => setHoveredSub(si)}
                          onMouseLeave={() => setHoveredSub(null)}
                        >{sub.label}</Link>
                      ))}
                    </div>
                  </div>
                );
              }

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
  const [hoveredSub,  setHoveredSub]  = useState(null);

  return (
    <div
      style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setOpenCity(null); }}
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
            return (
              <div key={item.city} style={{ position: "relative" }}
                onMouseEnter={() => setOpenCity(idx)}
                onMouseLeave={() => setOpenCity(null)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", paddingLeft: isActive ? 24 : 20, fontSize: 13, cursor: "pointer", userSelect: "none", color: isActive ? BRAND.goldLight : "#ccc", background: isActive ? "rgba(184,150,62,0.07)" : "transparent", borderLeft: isActive ? `2px solid ${BRAND.gold}` : "2px solid transparent", transition: "all 0.2s" }}>
                  <span>{item.city}</span>
                  {item.sub.length > 0 && <span style={{ fontSize: 11, opacity: 0.8, marginRight: 2 }}>›</span>}
                </div>
                {item.sub.length > 0 && (
                  <div className={`sub-menu-panel ${isActive ? "sub-menu-open" : "sub-menu-closed"}`}>
                    <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "6px 20px 10px", borderBottom: `1px solid rgba(184,150,62,0.15)`, marginBottom: 4 }}>
                      {item.city}
                    </div>
                    {item.sub.map((subItem, si) => {
                      const subKey = `${idx}-${si}`;
                      return (
                        <Link key={subItem.key} to={`/showrooms/${subItem.key}`}
                          style={{ display: "block", padding: "10px 20px", paddingLeft: hoveredSub === subKey ? 24 : 20, color: hoveredSub === subKey ? BRAND.gold : "#ccc", borderLeft: hoveredSub === subKey ? `2px solid ${BRAND.gold}` : "2px solid transparent", background: hoveredSub === subKey ? "rgba(184,150,62,0.07)" : "transparent", textDecoration: "none", fontSize: 13, transition: "all 0.18s ease" }}
                          onMouseEnter={() => setHoveredSub(subKey)}
                          onMouseLeave={() => setHoveredSub(null)}
                        >{subItem.label}</Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, textDecoration: "none" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: BRAND.white, letterSpacing: "0.02em", lineHeight: 1.1 }}>MANICKBAG</div>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, textTransform: "uppercase", fontWeight: 500 }}>AUTOMOBILES PVT LTD</div>
        </div>
      </Link>

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
                  <Link key={child.label} to={child.path}
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
        <div style={{ background: "#ffffff", color: "#0c1f3f", padding: "10px 16px", fontSize: 13, fontWeight: 500, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "slideLeft 0.3s ease", whiteSpace: "nowrap" }}>Chat with Us on WhatsApp</div>
      )}
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transform: hover ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>💬</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  LAYOUT WRAPPER — use this in every page
//
//  Props:
//    children        — your page content
//    onShowroomsClick — optional: scroll handler (only needed on Home)
//                       On other pages it scrolls to #showrooms if present,
//                       or you can pass a custom handler.
// ══════════════════════════════════════════════════════════════════
export default function Layout({ children, onShowroomsClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Default showrooms click: try to find #showrooms on current page
  const defaultShowroomsClick = () => {
    const el = document.getElementById("showrooms");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#ffffff", overflowX: "hidden" }}>
      <FontLink />
      <TopBar onShowroomsClick={onShowroomsClick || defaultShowroomsClick} />
      <Navbar scrolled={scrolled} />

      {/* Page content sits below the fixed navbar (TopBar 33px + Navbar 72px = 105px) */}
      <main style={{ paddingTop: 105 }}>
        {children}
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}