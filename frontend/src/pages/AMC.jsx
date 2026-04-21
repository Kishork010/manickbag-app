import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const API_BASE = import.meta.env.VITE_API_URL || "/backend/api";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const WA_NUMBER = "919686024365"; // WhatsApp number (country code + number)
const SHOWROOM_MAP = "https://maps.app.goo.gl/4GzdK7SJqgW7rtRy5";
const PHONE_DISPLAY = "+91 96860 24365";

const PageStyles = () => (
  <style>{`
    @keyframes amc-fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes amc-fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes amc-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes amc-float { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-10px) rotate(2deg); } }
    @keyframes amc-modalIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

    .amc-fadeUp { animation: amc-fadeUp 0.7s ease forwards; }
    .amc-fadeIn { animation: amc-fadeIn 0.6s ease forwards; }
    .amc-pulse { animation: amc-pulse 2s ease-in-out infinite; }
    .amc-float { animation: amc-float 7s ease-in-out infinite; }

    .amc-btn-gold {
      background: linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.12em; text-transform:uppercase;
      transition:all 0.3s ease; position:relative; overflow:hidden;
    }
    .amc-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .amc-btn-gold:hover::before { opacity:1; }
    .amc-btn-gold span { position:relative; z-index:1; }

    .amc-btn-outline {
      background:transparent; border:1px solid #b8963e; color:#b8963e;
      cursor:pointer; font-family:'Jost',sans-serif; font-weight:500;
      letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
    }
    .amc-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .amc-card { transition:transform 0.4s ease, box-shadow 0.4s ease; }
    .amc-card:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.1); }

    .amc-modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,0.72); z-index:9999;
      display:flex; align-items:center; justify-content:center;
      padding:24px; backdrop-filter:blur(4px);
    }
    .amc-modal-box {
      background:#fff; border-radius:4px; max-width:560px; width:100%;
      max-height:90vh; overflow-y:auto;
      animation: amc-modalIn 0.35s ease forwards;
      box-shadow: 0 40px 120px rgba(0,0,0,0.4);
    }
    .amc-input {
      width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,0.15);
      border-radius:2px; font-family:'Jost',sans-serif; font-size:14px;
      color:#0c1f3f; outline:none; box-sizing:border-box; transition:border-color 0.2s;
    }
    .amc-input:focus { border-color:#b8963e; }
    .amc-label { font-size:12px; font-weight:600; letter-spacing:0.08em; color:#6b7280; text-transform:uppercase; margin-bottom:6px; display:block; }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ── Quote Form Modal ──────────────────────────────────────────────
const QuoteModal = ({ planName, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", vehicle_model: "", registration_no: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim()) return setMsg("Name is required");
    if (!/^\d{10}$/.test(form.phone.trim())) return setMsg("Enter a valid 10-digit phone number");
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/amc_enquiry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan_type: planName.toLowerCase().includes("gold") ? "gold"
            : planName.toLowerCase().includes("silver") ? "silver"
            : planName.toLowerCase().includes("protect") ? "protect_plus"
            : "p2p",
          message: `Quote request for plan: ${planName}`,
        }),
      });
      const data = await res.json();
      if (data.status === "success") { setStatus("success"); setMsg(data.message || "Enquiry submitted!"); }
      else { setStatus("error"); setMsg(data.message || "Something went wrong."); }
    } catch {
      setStatus("error"); setMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="amc-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="amc-modal-box">
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 8 }}>Get a Quote</div>
              <h3 className="cormorant" style={{ fontSize: 26, fontWeight: 700, color: BRAND.white, margin: 0 }}>{planName}</h3>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h4 style={{ color: BRAND.navyMid, fontSize: 18, marginBottom: 8 }}>Enquiry Submitted!</h4>
              <p style={{ color: BRAND.muted, fontSize: 14, lineHeight: 1.7 }}>{msg}</p>
              <button className="amc-btn-gold" onClick={onClose} style={{ marginTop: 24, padding: "12px 32px", fontSize: 12, borderRadius: 2 }}><span>Close</span></button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Full Name *", name: "name", placeholder: "Your full name" },
                  { label: "Phone *", name: "phone", placeholder: "10-digit mobile number" },
                  { label: "Email", name: "email", placeholder: "your@email.com", type: "email" },
                  { label: "City", name: "city", placeholder: "Your city" },
                  { label: "Vehicle Model", name: "vehicle_model", placeholder: "e.g. Nexon, Safari, Harrier" },
                  { label: "Registration No.", name: "registration_no", placeholder: "e.g. KA 05 AB 1234" },
                ].map(f => (
                  <div key={f.name}>
                    <label className="amc-label">{f.label}</label>
                    <input className="amc-input" type={f.type || "text"} name={f.name} value={form[f.name]} onChange={change} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              {msg && <div style={{ marginTop: 14, fontSize: 13, color: status === "error" ? "#dc2626" : BRAND.muted }}>{msg}</div>}
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="amc-btn-gold" onClick={submit} disabled={status === "loading"} style={{ flex: 1, padding: "14px", fontSize: 13, borderRadius: 2, opacity: status === "loading" ? 0.7 : 1 }}>
                  <span>{status === "loading" ? "Submitting…" : "Submit Enquiry"}</span>
                </button>
                <button className="amc-btn-outline" onClick={onClose} style={{ padding: "14px 24px", fontSize: 12, borderRadius: 2 }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Full Coverage Modal ───────────────────────────────────────────
const CoverageModal = ({ onClose }) => {
  const items = [
    { category: "All Plans", items: ["Engine Oil", "Oil Filter", "Fuel Filter", "Air Filter", "Brake Oil", "Power Steering Oil", "Coolant", "AC / Alternator Belt"] },
    { category: "Gold & Protect Plus Only", items: ["Brake Pads", "Clutch Plate", "Brake Disc", "Wiper Blades", "Clutch Cover", "Brake Shoe"] },
    { category: "Labour & Services", items: ["Scheduled Service Labour", "Wheel Alignment Check", "Battery & Electrical Check", "All Fluid Top-ups as per schedule"] },
  ];
  return (
    <div className="amc-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="amc-modal-box" style={{ maxWidth: 640 }}>
        <div style={{ background: `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 8 }}>AMC Coverage Details</div>
              <h3 className="cormorant" style={{ fontSize: 26, fontWeight: 700, color: BRAND.white, margin: 0 }}>Full Coverage Breakdown</h3>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
          </div>
        </div>
        <div style={{ padding: "32px" }}>
          {items.map(cat => (
            <div key={cat.category} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${BRAND.borderLight}` }}>{cat.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {cat.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: BRAND.navyMid }}>
                    <span style={{ color: BRAND.gold, fontWeight: 700, fontSize: 16 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Contact banner */}
          <div style={{ background: BRAND.offWhite, border: `1px solid ${BRAND.borderLight}`, borderRadius: 4, padding: "20px 24px", marginTop: 8 }}>
            <div style={{ fontSize: 13, color: BRAND.navyMid, fontWeight: 600, marginBottom: 10 }}>📞 For detailed plan coverage &amp; custom queries:</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`https://wa.me/${WA_NUMBER}?text=Hi, I need more details about AMC coverage plans`} target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                💬 WhatsApp Us
              </a>
              <a href={`tel:+91${WA_NUMBER.replace("91","")}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: BRAND.navyMid, color: "#fff", padding: "10px 20px", borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                📞 {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <button className="amc-btn-outline" onClick={onClose} style={{ marginTop: 20, padding: "12px 24px", fontSize: 12, borderRadius: 2 }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Hero ──────────────────────────────────────────────────────────
const Hero = ({ plansRef }) => {
  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });
  const openWhatsApp = () => window.open(`https://wa.me/${WA_NUMBER}?text=Hi, I'd like to contact the Manickbag showroom regarding AMC plans`, "_blank");

  return (
    <section style={{ minHeight: "60vh", background: `linear-gradient(135deg,${BRAND.navyMid} 0%,#0d2a5e 50%,${BRAND.navy} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div className="amc-float" style={{ position: "absolute", right: "6%", top: "8%", width: 360, height: 360, border: "1px solid rgba(184,150,62,0.1)", borderRadius: 4, transform: "rotate(20deg)" }} />
      <div style={{ position: "absolute", right: "10%", top: "18%", width: 240, height: 240, border: "1px solid rgba(184,150,62,0.16)", borderRadius: 4, transform: "rotate(40deg)", animation: "amc-float 5s ease-in-out infinite reverse" }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.3, left: `${10 + i * 13}%`, top: `${20 + (i % 3) * 20}%`, animation: `amc-pulse ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
      ))}
      <div style={{ ...W, paddingTop: 80, paddingBottom: 80 }}>
        <div className="amc-fadeIn" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, opacity: 0, animationDelay: "0.1s" }}>
          <Link to="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.08em" }}>Home</Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
          <Link to="/services" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.08em" }}>Services</Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
          <span style={{ fontSize: 12, color: BRAND.gold, letterSpacing: "0.08em" }}>AMC — Value Care</span>
        </div>
        <div className="amc-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, opacity: 0, animationDelay: "0.15s" }}>
          <div style={{ width: 32, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>Annual Maintenance Contract</span>
        </div>
        <h1 className="cormorant amc-fadeUp" style={{ fontSize: "clamp(44px,6vw,80px)", fontWeight: 300, lineHeight: 1.1, color: BRAND.white, maxWidth: 680, animationDelay: "0.2s", opacity: 0 }}>
          Value Care<br /><span className="gold-shimmer">AMC Plans</span>
        </h1>
        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "24px 0" }} />
        <p className="amc-fadeUp" style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 540, marginBottom: 40, animationDelay: "0.4s", opacity: 0 }}>
          Guaranteed protection against unexpected repairs. Substantial savings through protection against rising oil prices, consumable costs &amp; labour charges.
        </p>
        <div className="amc-fadeUp" style={{ display: "flex", gap: 16, animationDelay: "0.5s", opacity: 0 }}>
          {/* Explore Plans — smooth scroll to plans section */}
          <button className="amc-btn-gold" onClick={scrollToPlans} style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}>
            <span>Explore Plans</span>
          </button>
          {/* Contact Showroom — WhatsApp */}
          <button className="amc-btn-outline" onClick={openWhatsApp} style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}>
            Contact Showroom
          </button>
        </div>
        <div className="amc-fadeUp" style={{ display: "flex", gap: 48, marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", animationDelay: "0.6s", opacity: 0 }}>
          {[{ v: "4", l: "Plan Types" }, { v: "4 Yrs", l: "Max Coverage" }, { v: "60K", l: "Max KMs" }, { v: "EQI", l: "Easy Payment" }].map(s => (
            <div key={s.l}>
              <div className="cormorant" style={{ fontSize: 36, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Plans ─────────────────────────────────────────────────────────
const plans = [
  { name: "Value Care Gold", badge: "Most Comprehensive", highlight: true, color: BRAND.gold, duration: "1–4 Yrs / 15K–60K kms", when: "Before first Oil Change Service", features: ["Scheduled Services (Lubricants + Parts + Labour)", "Wear & Tear parts (Clutch Plate, Brake Pads, Wiper Blades etc.)", "All consumables covered", "Can be repurchased after expiry", "Tata Authorised Workshops only"], notIncluded: [] },
  { name: "Value Care Silver", badge: "Standard Plan", highlight: false, color: BRAND.navyLight, duration: "1–4 Yrs / 15K–60K kms", when: "Before first Oil Change Service", features: ["Scheduled Services (Lubricants + Parts + Labour)", "All consumables covered", "Can be repurchased after expiry", "Tata Authorised Workshops only"], notIncluded: ["Wear & Tear parts not included"] },
  { name: "Value Care Protect Plus", badge: "Extra Coverage", highlight: false, color: "#2d4a8a", duration: "1–4 Yrs / 15K–60K kms", when: "Before first Oil Change Service — one-time only", features: ["Scheduled Services + Wear & Tear", "All consumables covered", "Cannot be renewed (purchase once)", "Best for high-mileage users", "Tata Authorised Workshops only"], notIncluded: [] },
  { name: "Value Care P2P", badge: "Flexible Option", highlight: false, color: "#1a3d7c", duration: "No restriction on age or kms", when: "Can be purchased during any due service", features: ["Wear & Tear parts included", "No vehicle age restriction", "Purchased at workshop anytime", "Ideal for older vehicles", "Tata Authorised Workshops only"], notIncluded: [] },
];

const Plans = ({ plansRef, onGetQuote }) => (
  <section ref={plansRef} style={{ background: BRAND.offWhite, padding: "100px 0" }}>
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Choose a Plan</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>Value Care Maintenance Plans</h2>
        <p style={{ fontSize: 15, color: BRAND.muted, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>Protection against inflation and price volatility of lubricants — choose Gold, Silver, Protect Plus, or P2P.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {plans.map((p, i) => (
          <div key={p.name} className="amc-card" style={{ background: BRAND.white, borderTop: `4px solid ${p.highlight ? BRAND.gold : p.color}`, padding: "32px 24px", position: "relative", animation: `amc-fadeUp 0.5s ease ${i * 0.1}s both` }}>
            {p.highlight && <div style={{ position: "absolute", top: 16, right: 16, background: BRAND.gold, color: BRAND.navy, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 10px", textTransform: "uppercase" }}>Top Pick</div>}
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: p.highlight ? BRAND.gold : BRAND.muted, fontWeight: 600, marginBottom: 10 }}>{p.badge}</div>
            <h3 className="cormorant" style={{ fontSize: 22, fontWeight: 700, color: BRAND.navyMid, marginBottom: 8 }}>{p.name}</h3>
            <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>⏱ {p.duration}</div>
            <div style={{ fontSize: 11, color: BRAND.muted, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid rgba(0,0,0,0.06)` }}>🛒 {p.when}</div>
            <ul style={{ listStyle: "none", marginBottom: 28, padding: 0 }}>
              {p.features.map(f => <li key={f} style={{ fontSize: 13, color: BRAND.navyMid, marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ color: BRAND.gold, fontWeight: 700 }}>✓</span>{f}</li>)}
              {p.notIncluded.map(f => <li key={f} style={{ fontSize: 13, color: BRAND.muted, marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ color: "#ccc" }}>✗</span>{f}</li>)}
            </ul>
            {/* Get Quote — opens modal */}
            <button className="amc-btn-gold" onClick={() => onGetQuote(p.name)} style={{ width: "100%", padding: "12px", fontSize: 11, borderRadius: 2 }}>
              <span>Get Quote</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Consumables ───────────────────────────────────────────────────
const Consumables = ({ onViewCoverage }) => (
  <section style={{ background: BRAND.navyMid, padding: "100px 0", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -60, bottom: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,150,62,0.06) 0%,transparent 70%)" }} />
    <div style={W}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>What's Covered</span>
          </div>
          <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 24 }}>
            Consumables<br /><span className="gold-shimmer">Included in AMC</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>Your AMC covers all critical consumables replaced as per Tata Motors' recommended service schedule — no surprise bills.</p>
          {/* View Full Coverage — opens coverage modal */}
          <button className="amc-btn-gold" onClick={onViewCoverage} style={{ padding: "14px 32px", fontSize: 12, borderRadius: 2 }}>
            <span>View Full Coverage</span>
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {["Engine Oil","Oil Filter","Fuel Filter","Air Filter","Brake Oil","Power Steering Oil","Coolant","AC / Alternator Belt","Brake Pads (Gold)","Clutch Plate (Gold)","Brake Disc (Gold)","Wiper Blades (Gold)"].map((item, i) => (
            <div key={item} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.borderLight}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, animation: `amc-fadeIn 0.5s ease ${i * 0.06}s both` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.gold, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── FAQ ───────────────────────────────────────────────────────────
const faqs = [
  { q: "When can I buy an AMC?", a: "Gold, Silver & Protect Plus plans can be purchased before your first Oil Change Service. P2P can be purchased at any due service, with no restriction on vehicle age or kms." },
  { q: "Can I renew my AMC after it expires?", a: "Gold and Silver plans can be repurchased after expiry. Protect Plus is a one-time purchase only and cannot be renewed." },
  { q: "How many scheduled services are covered?", a: "Coverage depends on the period and km combination. For example, a 2 Yr / 30,000 km AMC on vehicles with 15,000 km oil change intervals covers 2 oil change services." },
  { q: "Can I buy an AMC with EQI?", a: "Yes! Value Care AMC plans can be purchased using EQI — Equated Quarterly Installments — for your convenience." },
  { q: "Is the AMC valid across India?", a: "Yes. Services are available at any Tata Motors Authorised Workshop across India." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ background: "#fff", padding: "100px 0" }}>
      <div style={W}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Common Questions</span>
            <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>FAQ</h2>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {faqs.map((f, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ borderBottom: `1px solid rgba(0,0,0,0.07)`, cursor: "pointer", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: BRAND.navyMid }}>{f.q}</span>
                <span style={{ fontSize: 20, color: BRAND.gold, transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
              </div>
              {open === i && <div style={{ fontSize: 14, lineHeight: 1.8, color: BRAND.muted, paddingBottom: 24, animation: "amc-fadeIn 0.3s ease" }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── CTA ───────────────────────────────────────────────────────────
const CTA = () => {
  const openMap = () => window.open(SHOWROOM_MAP, "_blank");
  const openWA = () => window.open(`https://wa.me/${WA_NUMBER}?text=Hi, I'd like to know more about AMC plans`, "_blank");

  return (
    <section style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "80px 0" }}>
      <div style={{ ...W, textAlign: "center" }}>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: BRAND.white, marginBottom: 16 }}>Drive With Zero Worry</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>Talk to our service advisors at any Manickbag showroom to find the AMC plan that's right for your vehicle.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {/* Find Showroom — opens Google Maps */}
          <button className="amc-btn-gold" onClick={openMap} style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}>
            <span>📍 Find Showroom</span>
          </button>
          {/* Phone number — opens WhatsApp */}
          <button className="amc-btn-outline" onClick={openWA} style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}>
            📞 Call: {PHONE_DISPLAY}
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Root ──────────────────────────────────────────────────────────
export default function AMC() {
  const plansRef = useRef(null);
  const [quoteModal, setQuoteModal] = useState(null); // plan name or null
  const [coverageModal, setCoverageModal] = useState(false);

  return (
    <Layout>
      <PageStyles />
      <Hero plansRef={plansRef} />
      <Plans plansRef={plansRef} onGetQuote={(planName) => setQuoteModal(planName)} />
      <Consumables onViewCoverage={() => setCoverageModal(true)} />
      <FAQ />
      <CTA />

      {/* Modals */}
      {quoteModal && <QuoteModal planName={quoteModal} onClose={() => setQuoteModal(null)} />}
      {coverageModal && <CoverageModal onClose={() => setCoverageModal(false)} />}
    </Layout>
  );
}
