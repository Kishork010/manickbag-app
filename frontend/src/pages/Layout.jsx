import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideLeft { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes iplPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(196,48,43,0.55); } 50% { box-shadow: 0 0 0 7px rgba(196,48,43,0); } }
    @keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .anim-fadeUp { animation: fadeUp 0.7s ease forwards; }
    .anim-fadeIn { animation: fadeIn 0.6s ease forwards; }
    .anim-slideLeft { animation: slideLeft 0.6s ease forwards; }
    .gold-shimmer {
      background: linear-gradient(90deg, #b8963e 0%, #f0e4c2 40%, #b8963e 60%, #d4af5a 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }
    .nav-link::after { content: ''; display: block; height: 1px; background: #b8963e; width: 0; transition: width 0.3s ease; }
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
    .btn-gold::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #d4af5a, #b8963e); opacity: 0; transition: opacity 0.3s; }
    .btn-gold:hover::before { opacity: 1; }
    .btn-gold span { position: relative; z-index: 1; }
    .btn-outline { background: transparent; border: 1px solid #b8963e; color: #b8963e; cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; }
    .btn-outline:hover { background: #b8963e; color: #0a1628; }
    .gold-line { width: 60px; height: 2px; background: linear-gradient(90deg, #b8963e, transparent); }
    .dropdown-menu { opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease; }
    .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
    .vehicles-dropdown { opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease; }
    .vehicles-nav-item:hover .vehicles-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
    .sub-menu-open { opacity: 1; visibility: visible; transform: translateX(0); }
    .sub-menu-closed { opacity: 0; visibility: hidden; transform: translateX(6px); }
    .sub-menu-panel {
      position: absolute; left: 100%; top: -2px; min-width: 195px;
      background: rgba(6,14,28,0.99); border: 1px solid rgba(184,150,62,0.25);
      border-left: 2px solid #b8963e; padding: 8px 0;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease; z-index: 20;
    }
    .ticker-inner { display: flex; white-space: nowrap; animation: ticker 30s linear infinite; }
    .ticker-inner:hover { animation-play-state: paused; }
    .ipl-ticker-inner { display: flex; white-space: nowrap; animation: ticker 28s linear infinite; }
    .ipl-ticker-inner:hover { animation-play-state: paused; }
    .topbar-showrooms-link { color: rgba(255,255,255,0.55); text-decoration: none; cursor: pointer; transition: color 0.2s; }
    .topbar-showrooms-link:hover { color: #b8963e; text-decoration: underline; }
    .td-overlay {
      position: fixed; inset: 0; background: rgba(5,12,28,0.82);
      backdrop-filter: blur(6px); z-index: 9999;
      display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .td-box {
      background: #ffffff; width: 100%; max-width: 680px;
      max-height: 92vh; overflow-y: auto; border-radius: 3px;
      animation: modalIn 0.35s ease forwards; position: relative;
    }
    .td-box::-webkit-scrollbar { width: 3px; }
    .td-box::-webkit-scrollbar-thumb { background: #b8963e; }
    .td-inp {
      width: 100%; padding: 11px 14px; border: 1px solid rgba(10,31,63,0.18);
      font-family: 'Jost', sans-serif; font-size: 13.5px; color: #0c1f3f;
      background: #fafafa; outline: none; border-radius: 2px;
      transition: border-color 0.2s, background 0.2s;
    }
    .td-inp:focus { border-color: #b8963e; background: #fff; }
    .td-inp::placeholder { color: #9ca3af; }
    .td-lbl { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
    .td-field { margin-bottom: 18px; }
    .td-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .td-btn {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #b8963e, #d4af5a);
      color: #0a1628; border: none; font-family: 'Jost', sans-serif; font-weight: 700;
      font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase;
      cursor: pointer; border-radius: 2px; transition: opacity 0.2s;
    }
    .td-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .td-btn:not(:disabled):hover { opacity: 0.9; }
    .td-ok { background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 2px; margin-bottom: 20px; font-size: 13.5px; }
    .td-err { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 2px; margin-bottom: 20px; font-size: 13.5px; }
    .td-ref { display: inline-block; margin-top: 8px; padding: 6px 14px; background: #0c1f3f; color: #b8963e; font-weight: 700; font-size: 15px; border-radius: 2px; letter-spacing: 0.08em; }
    @media (max-width: 600px) { .td-grid2 { grid-template-columns: 1fr; } }
  `}</style>
);

const VEHICLES = [
  "Tiago","Tiago EV","Altroz","Tigor","Tigor EV",
  "Punch","Punch EV","Nexon","Nexon EV",
  "Harrier","Harrier EV","Safari","Curvv","Curvv EV",
  "Sierra","Xpress T","Xpress T EV",
];

const SHOWROOM_CITIES = [
  { city: "Belgaum",  branches: ["3'S Belgaum","EMO Chikkodi","EMO Ramdurg","EMO Savadatti","EMO Raibag","EMO Bailhongal"] },
  { city: "Hubli",    branches: ["3'S Hubli","EMO Haveri","EMO Mudeshwar","EMO Sirsi"] },
  { city: "Dharwad",  branches: ["3'S Dharwad"] },
  { city: "Karwar",   branches: ["3'S Karwar","EMO Ankola"] },
  { city: "Bijapur",  branches: ["3'S Bijapur"] },
  { city: "Gulbarga", branches: ["3'S Kalaburagi","EMO Bidar","EMO Yadgiri"] },
];

const TIME_SLOTS = [
  "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
];

const FUEL_TYPES = ["Petrol","Diesel","iCNG","Electric"];

const API_BASE = import.meta.env.VITE_API_URL || "https://www.manickbag.in/backend/api";

async function apiPost(endpoint, body) {
  const res = await fetch(API_BASE + "/" + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

const showroomMenuItems = [
  { city: "Belgaum", sub: [
    { label: "3'S Belgaum",    key: "belgaum-3s" },
    { label: "EMO Chikkodi",   key: "belgaum-emo-chikkodi" },
    { label: "EMO Ramdurg",    key: "belgaum-emo-ramdurg" },
    { label: "EMO Savadatti",  key: "belgaum-emo-savadatti" },
    { label: "EMO Raibag",     key: "belgaum-emo-raibag" },
    { label: "EMO Bailhongal", key: "belgaum-emo-bailhongal" },
  ]},
  { city: "Hubli", sub: [
    { label: "3'S Hubli",      key: "hubli-3s" },
    { label: "EMO Haveri",     key: "hubli-emo-haveri" },
    { label: "EMO Mudeshwar",  key: "hubli-emo-mudeshwar" },
    { label: "EMO Sirsi",      key: "hubli-emo-sirsi" },
  ]},
  { city: "Dharwad",  sub: [{ label: "3'S Dharwad",   key: "dharwad-3s" }] },
  { city: "Karwar",   sub: [
    { label: "3'S Karwar",     key: "karwar-3s" },
    { label: "EMO Ankola",     key: "karwar-emo-ankola" },
  ]},
  { city: "Bijapur",  sub: [{ label: "3'S Bijapur",   key: "bijapur-3s" }] },
  { city: "Gulbarga", sub: [
    { label: "3'S Kalaburagi", key: "gulbarga-3s" },
    { label: "EMO Bidar",      key: "gulbarga-emo-bidar" },
    { label: "EMO Yadgiri",    key: "gulbarga-emo-yadgiri" },
  ]},
];

const vehicleMenuCols = [
  { heading: "", items: ["Hatchback","Sedan","SUV","Finance","AMC","Extended Warrenty","Other Services"] },
];

const navItems = [
  { label: "Services", children: [
    { label: "Book Service",      path: "/service" },
    { label: "Renewal Insurance", path: "/insurance" },
    { label: "AMC",               path: "/amc" },
    { label: "Extended Warranty", path: "/extended-warranty" },
    { label: "RAS",               path: "/rsa" },
    { label: "Accessories",       path: "/accessories" },
    { label: "VAS",               path: "/vas" },
  ]},
  { label: "Heritage", children: [
    { label: "Our Story",           path: "/heritage" },
    { label: "Shah & Mirji Legacy", path: "/heritage/legacy" },
    { label: "Milestones",          path: "/heritage/milestones" },
    { label: "Leadership",          path: "/heritage/leadership" },
  ]},
  { label: "Offers", children: [
    { label: "Current Offers",  path: "/current-offers" },
    { label: "Corporate Deals", path: "/corporate-deals" },
    { label: "Exchange Bonus",  path: "/exchange-bonus" },
    { label: "Finance Schemes", path: "/finance-schemes" },
  ]},
];

const otherServicesItems = [
  { label: "Accessories",  path: "/accessories" },
  { label: "VAS Services", path: "/vas" },
  { label: "Insurance",    path: "/insurance" },
  { label: "FASTag",       path: "/fastag" },
];

const IPL_TICKER_ITEMS = [
  "🔴 RCB vs CSK — Apr 12, 7:30 PM · Chinnaswamy",
  "🔵 MI vs KKR — Apr 13, 3:30 PM · Wankhede",
  "🏆 Points Leader: RCB — 12 pts (NRR +1.245)",
  "⚡ Orange Cap: Virat Kohli — 412 runs",
  "🎳 Purple Cap: Jasprit Bumrah — 14 wickets",
  "🟠 SRH vs DC — Apr 14, 7:30 PM · Rajiv Gandhi Stadium",
];

const W = { width: "100%", padding: "0 48px" };

function TestDriveModal({ onClose }) {
  const EMPTY = {
    full_name: "", mobile: "", email: "", vehicle_name: "",
    fuel_type: "", preferred_date: "", preferred_time: "",
    showroom_city: "", showroom_branch: "", message: "",
  };

  const [form,       setForm]       = useState(EMPTY);
  const [loading,    setLoading]    = useState(false);
  const [feedback,   setFeedback]   = useState({ type: "", text: "" });
  const [bookingRef, setBookingRef] = useState("");
  const [branches,   setBranches]   = useState([]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const found = SHOWROOM_CITIES.find((s) => s.city === form.showroom_city);
    setBranches(found ? found.branches : []);
    setForm((prev) => ({ ...prev, showroom_branch: "" }));
  }, [form.showroom_city]);

  const handle = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const today  = new Date().toISOString().split("T")[0];
  const maxDay = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  const validate = () => {
    if (!form.full_name.trim())            return "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return "Enter a valid 10-digit Indian mobile number.";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (!form.vehicle_name)                return "Please select a vehicle.";
    if (!form.preferred_date)             return "Please choose a preferred date.";
    if (!form.showroom_city)              return "Please select a showroom city.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });
    setBookingRef("");
    const err = validate();
    if (err) { setFeedback({ type: "error", text: err }); return; }
    setLoading(true);
    try {
      const res = await apiPost("test-drive.php", form);
      setFeedback({ type: "success", text: res.message });
      setBookingRef(res.data?.booking_ref || "");
      setTimeout(onClose, 5000);
    } catch (err) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const overlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="td-overlay" onClick={overlayClick}>
      <div className="td-box">

        <div style={{ background: "linear-gradient(135deg,#0a1628 0%,#1a3d7c 100%)", padding: "28px 32px 24px", position: "relative" }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 18, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", width: 32, height: 32, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            &#x2715;
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 2, background: "#b8963e" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#b8963e", textTransform: "uppercase" }}>Manickbag Automobiles</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
            Book a Test Drive
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
            We will confirm your appointment within 2 hours via SMS or call.
          </p>
        </div>

        <div style={{ padding: "28px 32px 32px" }}>

          {feedback.text && (
            <div className={feedback.type === "success" ? "td-ok" : "td-err"}>
              {feedback.text}
              {bookingRef && (
                <div style={{ marginTop: 10 }}>
                  Your Booking Reference: <span className="td-ref">{bookingRef}</span>
                </div>
              )}
              {feedback.type === "success" && (
                <div style={{ fontSize: 12, color: "#065f46", marginTop: 8, opacity: 0.8 }}>
                  This window will close automatically in 5 seconds.
                </div>
              )}
            </div>
          )}

          {feedback.type !== "success" && (
            <form onSubmit={handleSubmit} noValidate>

              <div className="td-grid2">
                <div className="td-field">
                  <label className="td-lbl">Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="td-inp" name="full_name" value={form.full_name} onChange={handle} placeholder="e.g. Rajesh Kumar" maxLength={100} required />
                </div>
                <div className="td-field">
                  <label className="td-lbl">Mobile Number <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="td-inp" name="mobile" value={form.mobile} onChange={handle} placeholder="10-digit mobile" maxLength={10} inputMode="numeric" required />
                </div>
              </div>

              <div className="td-grid2">
                <div className="td-field">
                  <label className="td-lbl">Email Address</label>
                  <input className="td-inp" name="email" type="email" value={form.email} onChange={handle} placeholder="optional" />
                </div>
                <div className="td-field">
                  <label className="td-lbl">Select Vehicle <span style={{ color: "#ef4444" }}>*</span></label>
                  <select className="td-inp" name="vehicle_name" value={form.vehicle_name} onChange={handle} required>
                    <option value="">-- Choose a model --</option>
                    {VEHICLES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="td-grid2">
                <div className="td-field">
                  <label className="td-lbl">Fuel Type</label>
                  <select className="td-inp" name="fuel_type" value={form.fuel_type} onChange={handle}>
                    <option value="">-- Any fuel type --</option>
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="td-field">
                  <label className="td-lbl">Showroom City <span style={{ color: "#ef4444" }}>*</span></label>
                  <select className="td-inp" name="showroom_city" value={form.showroom_city} onChange={handle} required>
                    <option value="">-- Select city --</option>
                    {SHOWROOM_CITIES.map((s) => (
                      <option key={s.city} value={s.city}>{s.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="td-grid2">
                <div className="td-field">
                  <label className="td-lbl">Showroom Branch</label>
                  <select className="td-inp" name="showroom_branch" value={form.showroom_branch} onChange={handle} disabled={branches.length === 0}>
                    <option value="">{branches.length ? "-- Select branch --" : "Select city first"}</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="td-field">
                  <label className="td-lbl">Preferred Date <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="td-inp" type="date" name="preferred_date" value={form.preferred_date} onChange={handle} min={today} max={maxDay} required />
                </div>
              </div>

              <div className="td-field" style={{ maxWidth: "50%", paddingRight: 8 }}>
                <label className="td-lbl">Preferred Time</label>
                <select className="td-inp" name="preferred_time" value={form.preferred_time} onChange={handle}>
                  <option value="">-- Any time slot --</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="td-field">
                <label className="td-lbl">Special Requirements</label>
                <textarea className="td-inp" name="message" value={form.message} onChange={handle} placeholder="Any specific colour, variant, or accessibility needs..." rows={3} maxLength={500} style={{ resize: "vertical" }} />
              </div>

              <p style={{ fontSize: 11.5, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
                Your details are used only to confirm your test drive appointment and will not be shared with third parties.
              </p>

              <button type="submit" className="td-btn" disabled={loading}>
                {loading ? "Booking your slot..." : "Confirm Test Drive Booking"}
              </button>
            </form>
          )}

          {feedback.type === "success" && (
            <button
              onClick={onClose}
              style={{ marginTop: 12, width: "100%", padding: "12px", background: "transparent", border: "1px solid #0c1f3f", color: "#0c1f3f", fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
            >
              Close Window
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

function IPLTicker() {
  const navigate = useNavigate();
  const doubled = [...IPL_TICKER_ITEMS, ...IPL_TICKER_ITEMS];
  return (
    <div
      onClick={() => navigate("/ipl")}
      title="View IPL 2026 Page"
      style={{ background: "#C4302B", overflow: "hidden", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.2)", cursor: "pointer", width: "100%" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 16px 0 20px", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ background: "#fff", color: "#C4302B", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", padding: "3px 7px", borderRadius: 2, textTransform: "uppercase" }}>IPL 2026</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em" }}>LIVE UPDATES</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>&#x203A;</span>
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="ipl-ticker-inner">
            {doubled.map((item, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.92)", letterSpacing: "0.04em", padding: "0 48px", flexShrink: 0 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: "0 16px 0 12px", borderLeft: "1px solid rgba(255,255,255,0.2)", fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}>
          Full Scoreboard <span style={{ fontSize: 14 }}>&#x2192;</span>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onShowroomsClick }) {
  return (
    <div style={{ background: BRAND.navyMid, borderBottom: "1px solid " + BRAND.borderLight, padding: "6px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 24, fontSize: 12, letterSpacing: "0.05em" }}>
            <a
              href="#showrooms"
              onClick={(e) => { e.preventDefault(); if (onShowroomsClick) onShowroomsClick(); }}
              className="topbar-showrooms-link"
            >
              📍 12 Showrooms across North Karnataka
            </a>
            <span style={{ color: BRAND.borderLight }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>☎ +91 96860 24365</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
            {["Careers", "Investors", "Media"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={(e) => { e.target.style.color = BRAND.gold; }}
                onMouseOut={(e) => { e.target.style.color = "rgba(255,255,255,0.5)"; }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VehiclesNavItem() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [subOpen,     setSubOpen]     = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub,  setHoveredSub]  = useState(null);
  const navigate = useNavigate();

  const pageRoutes = {
    Finance: "/finance",
    AMC: "/amc",
    "Extended Warrenty": "/extended-warranty",
  };

  const handleFilterClick = (item) => {
    const type = item === "All Vehicles" ? "" : item;
    navigate(type ? "/?type=" + type : "/");
    setMenuOpen(false);
  };

  return (
    <div
      className="vehicles-nav-item"
      style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setSubOpen(false); }}
    >
      <Link
        to="/"
        className="nav-link"
        style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
      >
        Vehicles
      </Link>

      <div
        className="vehicles-dropdown"
        style={{ position: "absolute", top: "100%", left: 0, width: 220, background: "rgba(10,22,40,0.98)", border: "1px solid " + BRAND.borderLight, borderTop: "2px solid " + BRAND.gold, backdropFilter: "blur(12px)", padding: "8px 0" }}
      >
        {vehicleMenuCols.map((col, ci) => (
          <div key={ci}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: "1px solid rgba(184,150,62,0.15)", marginBottom: 4 }}>
              {col.heading}
            </div>
            {col.items.map((item) => {
              if (item === "Other Services") {
                return (
                  <div
                    key={item}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setSubOpen(true)}
                    onMouseLeave={() => setSubOpen(false)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", fontSize: 13, cursor: "pointer", userSelect: "none", color: subOpen ? BRAND.goldLight : "#ccc", background: subOpen ? "rgba(184,150,62,0.07)" : "transparent", borderLeft: subOpen ? "2px solid " + BRAND.gold : "2px solid transparent", paddingLeft: subOpen ? 24 : 20, transition: "all 0.2s" }}>
                      <span>Other Services</span>
                      <span style={{ fontSize: 11, opacity: 0.8, marginRight: 2 }}>&#x203A;</span>
                    </div>
                    <div className={"sub-menu-panel " + (subOpen ? "sub-menu-open" : "sub-menu-closed")}>
                      <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "6px 20px 10px", borderBottom: "1px solid rgba(184,150,62,0.15)", marginBottom: 4 }}>
                        Other Services
                      </div>
                      {otherServicesItems.map((sub, si) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", paddingLeft: hoveredSub === si ? 24 : 20, color: hoveredSub === si ? BRAND.gold : "#ccc", borderLeft: hoveredSub === si ? "2px solid " + BRAND.gold : "2px solid transparent", textDecoration: "none", fontSize: 13, background: hoveredSub === si ? "rgba(184,150,62,0.07)" : "transparent", transition: "all 0.18s ease" }}
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
              if (pageRoutes[item]) {
                return (
                  <Link
                    key={item}
                    to={pageRoutes[item]}
                    style={{ display: "block", textDecoration: "none", fontSize: 13, padding: "10px 20px", paddingLeft: hoveredItem === ci + "-" + item ? 24 : 20, color: hoveredItem === ci + "-" + item ? BRAND.gold : "#ccc", borderLeft: hoveredItem === ci + "-" + item ? "2px solid " + BRAND.gold : "2px solid transparent", background: hoveredItem === ci + "-" + item ? "rgba(184,150,62,0.07)" : "transparent", transition: "all 0.18s ease" }}
                    onMouseEnter={() => setHoveredItem(ci + "-" + item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item}
                  </Link>
                );
              }
              return (
                <div
                  key={item}
                  onClick={() => handleFilterClick(item)}
                  style={{ display: "block", fontSize: 13, cursor: "pointer", padding: "10px 20px", paddingLeft: hoveredItem === ci + "-" + item ? 24 : 20, color: hoveredItem === ci + "-" + item ? BRAND.gold : "#ccc", borderLeft: hoveredItem === ci + "-" + item ? "2px solid " + BRAND.gold : "2px solid transparent", background: hoveredItem === ci + "-" + item ? "rgba(184,150,62,0.07)" : "transparent", transition: "all 0.18s ease", userSelect: "none" }}
                  onMouseEnter={() => setHoveredItem(ci + "-" + item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowroomsNavItem() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [openCity,   setOpenCity]   = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);

  return (
    <div
      style={{ position: "relative", padding: "0 4px" }}
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => { setMenuOpen(false); setOpenCity(null); }}
    >
      <a
        href="/showrooms"
        className="nav-link"
        style={{ display: "block", padding: "8px 16px", color: menuOpen ? BRAND.gold : BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
      >
        Showrooms
      </a>
      {menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 200, background: "rgba(10,22,40,0.98)", border: "1px solid " + BRAND.borderLight, borderTop: "2px solid " + BRAND.gold, backdropFilter: "blur(12px)", padding: "8px 0", zIndex: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "10px 20px 8px", borderBottom: "1px solid rgba(184,150,62,0.15)", marginBottom: 4 }}>
            Our Locations
          </div>
          {showroomMenuItems.map((item, idx) => {
            const isActive = openCity === idx;
            return (
              <div
                key={item.city}
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenCity(idx)}
                onMouseLeave={() => setOpenCity(null)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", paddingLeft: isActive ? 24 : 20, fontSize: 13, cursor: "pointer", userSelect: "none", color: isActive ? BRAND.goldLight : "#ccc", background: isActive ? "rgba(184,150,62,0.07)" : "transparent", borderLeft: isActive ? "2px solid " + BRAND.gold : "2px solid transparent", transition: "all 0.2s" }}>
                  <span>{item.city}</span>
                  {item.sub.length > 0 && <span style={{ fontSize: 11, opacity: 0.8, marginRight: 2 }}>&#x203A;</span>}
                </div>
                {item.sub.length > 0 && (
                  <div className={"sub-menu-panel " + (isActive ? "sub-menu-open" : "sub-menu-closed")}>
                    <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, padding: "6px 20px 10px", borderBottom: "1px solid rgba(184,150,62,0.15)", marginBottom: 4 }}>
                      {item.city}
                    </div>
                    {item.sub.map((subItem, si) => {
                      const subKey = idx + "-" + si;
                      return (
                        <Link
                          key={subItem.key}
                          to={"/showrooms/" + subItem.key}
                          style={{ display: "block", padding: "10px 20px", paddingLeft: hoveredSub === subKey ? 24 : 20, color: hoveredSub === subKey ? BRAND.gold : "#ccc", borderLeft: hoveredSub === subKey ? "2px solid " + BRAND.gold : "2px solid transparent", background: hoveredSub === subKey ? "rgba(184,150,62,0.07)" : "transparent", textDecoration: "none", fontSize: 13, transition: "all 0.18s ease" }}
                          onMouseEnter={() => setHoveredSub(subKey)}
                          onMouseLeave={() => setHoveredSub(null)}
                        >
                          {subItem.label}
                        </Link>
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
}

function Navbar({ scrolled, onBookTestDrive }) {
  return (
    <nav style={{ position: "fixed", top: scrolled ? 0 : 66, left: 0, right: 0, zIndex: 900, background: scrolled ? "rgba(10,22,40,0.97)" : BRAND.navyMid, backdropFilter: "blur(12px)", borderBottom: "1px solid " + (scrolled ? BRAND.borderLight : "transparent"), transition: "all 0.4s ease", boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none", width: "100%" }}>
      <div style={{ ...W, display: "flex", alignItems: "center", height: 72 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, textDecoration: "none" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: BRAND.white, letterSpacing: "0.02em", lineHeight: 1.1 }}>MANICKBAG</div>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, textTransform: "uppercase", fontWeight: 500 }}>AUTOMOBILES PVT LTD</div>
          </div>
        </Link>

        <div style={{ marginLeft: 20, padding: "3px 10px", border: "1px solid " + BRAND.borderLight, borderRadius: 2, fontSize: 10, color: BRAND.gold, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: "1.6" }}>
          <div>Tata Motors Passenger Vehicle</div>
          <div>Tata Motors Electric Mobility</div>
        </div>
        <div style={{ marginLeft: 20, padding: "3px 10px", border: "1px solid " + BRAND.borderLight, borderRadius: 2, fontSize: 10, color: BRAND.gold, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Tata Motors Authorized Dealer
        </div>

        <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
          <VehiclesNavItem />
          <ShowroomsNavItem />

          {navItems.map((item) => (
            <div key={item.label} className="nav-item" style={{ position: "relative", padding: "0 4px" }}>
              <a
                href="#"
                className="nav-link"
                style={{ display: "block", padding: "8px 16px", color: BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.color = BRAND.gold; }}
                onMouseOut={(e) => { e.currentTarget.style.color = BRAND.white; }}
              >
                {item.label}
              </a>
              {item.children && (
                <div className="dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, minWidth: 200, background: "rgba(10,22,40,0.98)", border: "1px solid " + BRAND.borderLight, borderTop: "2px solid " + BRAND.gold, backdropFilter: "blur(12px)", padding: "8px 0" }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      style={{ display: "block", padding: "10px 20px", color: "#ccc", textDecoration: "none", fontSize: 13, transition: "all 0.2s", borderLeft: "2px solid transparent" }}
                      onMouseOver={(e) => { e.currentTarget.style.color = BRAND.gold; e.currentTarget.style.borderLeftColor = BRAND.gold; e.currentTarget.style.paddingLeft = "24px"; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ padding: "0 6px", display: "flex", alignItems: "center" }}>
            <Link
              to="/ipl"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 11px 4px 7px", background: "#C4302B", borderRadius: 2, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Jost', sans-serif", transition: "background 0.25s ease", animation: "iplPulse 2.4s ease-in-out infinite" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#9b2422"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#C4302B"; }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", flexShrink: 0 }} />
              IPL 2026
            </Link>
          </div>

          <button
            className="btn-gold"
            style={{ marginLeft: 12, padding: "10px 24px", fontSize: 12, borderRadius: 2 }}
            onClick={onBookTestDrive}
          >
            <span>Book Test Drive</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0a1628", padding: "64px 0 32px", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg," + BRAND.gold + "," + BRAND.goldLight + ")", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: BRAND.navy, fontFamily: "'Cormorant Garamond',serif" }}>M</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: BRAND.white }}>MANICKBAG</div>
                <div style={{ fontSize: 8, letterSpacing: "0.25em", color: BRAND.gold }}>AUTOMOBILES</div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", maxWidth: 280, marginBottom: 24 }}>
              North Karnataka most trusted Tata Motors dealer since 1962. Serving families across 12 locations with integrity and excellence.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["F", "I", "L", "Y"].map((s, i) => (
                <div
                  key={i}
                  style={{ width: 36, height: 36, border: "1px solid rgba(184,150,62,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: BRAND.gold, transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = BRAND.gold; e.currentTarget.style.color = BRAND.navy; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND.gold; }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Vehicles", links: ["SUVs", "Hatchbacks", "Sedans", "Electric Vehicles", "Commercial"] },
            { title: "Services", links: ["Book Service", "Finance & EMI", "Insurance", "Accessories", "Exchange"] },
            { title: "Company",  links: ["About Us", "Heritage", "Leadership", "Careers", "Media", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 20 }}>{col.title}</h4>
              {col.links.map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseOver={(e) => { e.target.style.color = BRAND.goldLight; }}
                  onMouseOut={(e) => { e.target.style.color = "rgba(255,255,255,0.4)"; }}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ margin: "0 0 32px", padding: "14px 24px", background: "rgba(196,48,43,0.12)", border: "1px solid rgba(196,48,43,0.3)", borderLeft: "4px solid #C4302B", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "#C4302B", color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", padding: "3px 8px", borderRadius: 2, textTransform: "uppercase", flexShrink: 0 }}>IPL 2026</div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Follow the Indian Premier League — live scores, points table and highlights</span>
          </div>
          <Link
            to="/ipl"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#C4302B", textDecoration: "none", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", border: "1px solid #C4302B", borderRadius: 2, transition: "all 0.25s", flexShrink: 0 }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#C4302B"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C4302B"; }}
          >
            View IPL Page
          </Link>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            &copy; 2025 Manickbag Automobiles. Authorised Tata Motors Dealer. All Rights Reserved.
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={(e) => { e.target.style.color = BRAND.gold; }}
                onMouseOut={(e) => { e.target.style.color = "rgba(255,255,255,0.25)"; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWA() {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
    >
      {hover && (
        <div style={{ background: "#ffffff", color: "#0c1f3f", padding: "10px 16px", fontSize: 13, fontWeight: 500, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "slideLeft 0.3s ease", whiteSpace: "nowrap" }}>
          Chat with Us on WhatsApp
        </div>
      )}
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transform: hover ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>
        💬
      </div>
    </div>
  );
}

export default function Layout({ children, onShowroomsClick }) {
  const [scrolled,      setScrolled]      = useState(false);
  const [showTestDrive, setShowTestDrive] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const defaultShowroomsClick = () => {
    const el = document.getElementById("showrooms");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#ffffff", overflowX: "hidden" }}>
      <FontLink />

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 901 }}>
        <TopBar onShowroomsClick={onShowroomsClick || defaultShowroomsClick} />
        <IPLTicker />
      </div>

      <Navbar
        scrolled={scrolled}
        onBookTestDrive={() => setShowTestDrive(true)}
      />

      <main style={{ paddingTop: 138 }}>
        {children}
      </main>

      <Footer />
      <FloatingWA />

      {showTestDrive && (
        <TestDriveModal onClose={() => setShowTestDrive(false)} />
      )}
    </div>
  );
}