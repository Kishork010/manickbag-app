import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const API_BASE = import.meta.env.VITE_API_URL || "/backend/api";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const PageStyles = () => (
  <style>{`
    @keyframes cd-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes cd-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes cd-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes cd-ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }

    .cd-fadeUp  { animation: cd-fadeUp  0.6s ease forwards; }
    .cd-fadeIn  { animation: cd-fadeIn  0.5s ease forwards; }

    .cd-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
    .cd-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.12); }

    .cd-btn-gold {
      background: linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.12em; text-transform:uppercase;
      transition:all 0.3s ease;
    }
    .cd-btn-gold:hover { opacity:0.88; transform:translateY(-1px); }
    .cd-btn-gold:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

    .cd-btn-outline {
      background:transparent; border:1px solid #b8963e; color:#b8963e;
      cursor:pointer; font-family:'Jost',sans-serif; font-weight:500;
      letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
    }
    .cd-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .cd-gold-line { width:60px; height:2px; background:linear-gradient(90deg,#b8963e,transparent); }

    .cd-fleet-card { transition:all 0.3s ease; cursor:pointer; }
    .cd-fleet-card:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }
    .cd-fleet-card.selected { border-color:#b8963e !important; background:#0c1f3f !important; }

    .cd-input {
      width:100%; padding:12px 16px;
      background:rgba(255,255,255,0.07);
      border:1px solid rgba(184,150,62,0.2);
      color:#ffffff; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; transition:border-color 0.2s;
      box-sizing:border-box;
    }
    .cd-input:focus { border-color:#b8963e; }
    .cd-input::placeholder { color:rgba(255,255,255,0.3); }

    .cd-select {
      width:100%; padding:12px 16px;
      background:rgba(255,255,255,0.07);
      border:1px solid rgba(184,150,62,0.2);
      color:#ffffff; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; cursor:pointer;
      box-sizing:border-box;
    }
    .cd-select option { background:#0c1f3f; color:#fff; }

    .cd-ticker-inner { display:flex; white-space:nowrap; animation:cd-ticker 28s linear infinite; }
    .cd-ticker-inner:hover { animation-play-state:paused; }
  `}</style>
);

const W = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px" };

// ─── DATA ─────────────────────────────────────────────────────────
const corporateBenefits = [
  { icon: "💰", title: "Special Corporate Pricing",  desc: "Exclusive price benefits over and above standard offers, negotiated directly with Tata Motors for registered corporates." },
  { icon: "🏦", title: "Preferential Finance Rates",  desc: "Interest rates starting from 7.99% p.a. through our banking partners for corporate employees and fleet purchases." },
  { icon: "📋", title: "Bulk Fleet Discounts",        desc: "Progressive discounting structure — the more vehicles you order, the higher the benefit per unit." },
  { icon: "🔧", title: "Dedicated Fleet Service",     desc: "Priority service lanes, AMC packages, and fleet manager support across all 12 Manickbag locations." },
  { icon: "📱", title: "Fleet Management Support",    desc: "Digital fleet tracking, service reminders, and dedicated account manager for corporates with 5+ vehicles." },
  { icon: "🚗", title: "Demo & Test Drive Fleet",     desc: "Arrange bulk test drives at your office premises. We bring the vehicles to you." },
];

const fleetModels = [
  { name: "Tiago",     category: "Hatchback",      fuel: "Petrol / CNG",    image: "https://www.manickbag.in/images/tiago.jpg",      corporatePrice: "₹5.99L onwards",  corporateBenefit: "₹20,000 off", tag: "Budget Fleet",    tagColor: "#1e6b3e", popular: false },
  { name: "Tigor",     category: "Compact Sedan",  fuel: "Petrol / CNG",    image: "https://www.manickbag.in/images/tigor.jpg",      corporatePrice: "₹7.49L onwards",  corporateBenefit: "₹25,000 off", tag: "Executive Fleet", tagColor: "#5d3f7a", popular: false },
  { name: "Tigor EV",  category: "Electric Sedan", fuel: "Electric",        image: "https://www.manickbag.in/images/tigor_ev.avif",  corporatePrice: "₹12.49L onwards", corporateBenefit: "₹40,000 off", tag: "Fleet Favourite", tagColor: "#1a5276", popular: true  },
  { name: "Nexon",     category: "Compact SUV",    fuel: "Petrol / Diesel", image: "https://www.manickbag.in/images/naxon.avif",     corporatePrice: "₹8.49L onwards",  corporateBenefit: "₹35,000 off", tag: "Top Seller",      tagColor: "#b8963e", popular: false },
  { name: "Nexon EV",  category: "Electric SUV",   fuel: "Electric",        image: "https://www.manickbag.in/images/nexon_ev.avif",  corporatePrice: "₹14.99L onwards", corporateBenefit: "₹50,000 off", tag: "Green Fleet",     tagColor: "#1e6b3e", popular: true  },
  { name: "Harrier",   category: "Premium SUV",    fuel: "Petrol",          image: "https://www.manickbag.in/images/harrier.avif",   corporatePrice: "₹15.49L onwards", corporateBenefit: "₹60,000 off", tag: "CXO Choice",      tagColor: "#6c3483", popular: false },
];

const fleetSizes = [
  { range: "1–4",   label: "Small Team",  benefit: "Standard Corporate Rate",  icon: "🚗" },
  { range: "5–9",   label: "Mid Fleet",   benefit: "Extra ₹5,000 per vehicle", icon: "🚙" },
  { range: "10–24", label: "Large Fleet", benefit: "Extra ₹10,000 per vehicle",icon: "🚐" },
  { range: "25+",   label: "Enterprise",  benefit: "Custom deal — call us",     icon: "🏢" },
];

const eligibleCompanies = [
  "IT & Software Companies", "BFSI & Banking", "Manufacturing & Industrial",
  "Government PSUs", "Healthcare & Pharma", "Logistics & Transport",
  "Education Institutions", "Hospitality & Hotels",
];

const steps = [
  { num: "01", title: "Submit Enquiry", desc: "Fill the corporate enquiry form with your company and fleet requirement details." },
  { num: "02", title: "Verification",   desc: "Our corporate desk verifies your company GST, size, and eligibility within 24 hours." },
  { num: "03", title: "Custom Quote",   desc: "Receive a tailored quote with all applicable discounts, finance options, and add-ons." },
  { num: "04", title: "Fleet Delivery", desc: "Coordinated delivery to your office or any of our 12 showrooms across North Karnataka." },
];

// ─── TICKER ───────────────────────────────────────────────────────
const Ticker = () => {
  const items = [
    "Corporate Pricing Available", "Fleet Discounts Up to ₹60,000",
    "Dedicated Account Manager", "Priority Service Lanes",
    "GST Benefits on Fleet Purchase", "EMI from 7.99% p.a.",
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: `linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow: "hidden", padding: "10px 0" }}>
      <div className="cd-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding: "0 28px", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND.navy, display: "inline-flex", alignItems: "center", gap: 14 }}>
            {item}<span style={{ opacity: 0.35 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function CorporateDeals() {
  const [selectedModels, setSelectedModels] = useState([]);
  const [formData, setFormData]     = useState({ company: "", name: "", phone: "", email: "", gst: "", fleetSize: "", city: "" });
  const [submitted, setSubmitted]   = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg]     = useState("");

  const toggleModel = (name) =>
    setSelectedModels(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]);

  const updateForm = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  const canSubmit = formData.company && formData.name && formData.phone && formData.fleetSize;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitStatus("loading");
    setErrorMsg("");
    try {
      const res  = await fetch(`${API_BASE}/corporate_enquiry.php`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selectedModels: selectedModels,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSubmitted(true);
        setSubmitStatus("idle");
      } else {
        setSubmitStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitStatus("idle");
    setErrorMsg("");
    setFormData({ company: "", name: "", phone: "", email: "", gst: "", fleetSize: "", city: "" });
    setSelectedModels([]);
  };

  return (
    <Layout>
      <PageStyles />
      <Ticker />

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 55%,${BRAND.navy} 100%)`, padding: "80px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(184,150,62,0.07)` }} />
        <div style={{ position: "absolute", right: 60,  top: 60,  width: 280, height: 280, borderRadius: "50%", border: `1px solid rgba(184,150,62,0.12)` }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.22, left: `${10 + i * 14}%`, top: `${25 + (i % 3) * 22}%`, animation: `cd-pulse ${2 + i * 0.35}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
        ))}
        <div style={W}>
          <div className="cd-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 22, opacity: 0, animationDelay: "0.1s" }}>
            <div style={{ width: 36, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>Corporate Fleet Programme</span>
          </div>
          <h1 className="cormorant cd-fadeUp" style={{ fontSize: "clamp(44px,6vw,82px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.1, maxWidth: 780, opacity: 0, animationDelay: "0.2s", whiteSpace: "pre-line" }}>
            {"Drive Your Business\nForward with Tata"}
          </h1>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "24px 0" }} />
          <p className="cd-fadeUp" style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 540, marginBottom: 44, opacity: 0, animationDelay: "0.35s" }}>
            Exclusive pricing, preferential finance, dedicated service, and flexible fleet solutions — designed for businesses that demand the best from their vehicles.
          </p>
          <div className="cd-fadeUp" style={{ display: "flex", gap: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", opacity: 0, animationDelay: "0.45s", flexWrap: "wrap" }}>
            {[["500+","Corporate Clients"],["₹60K","Max Benefit/Vehicle"],["7.99%","Finance Rate p.a."],["12","Service Locations"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize: 38, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLEET SIZE SLABS ── */}
      <div style={{ background: BRAND.offWhite, padding: "64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 1, background: BRAND.gold }} />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Fleet Size Slabs</span>
              <div style={{ width: 40, height: 1, background: BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,46px)", color: BRAND.navyMid }}>More Vehicles, More Savings</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {fleetSizes.map((s, i) => (
              <div key={s.range} className="cd-card" style={{ background: BRAND.white, border: `1px solid rgba(0,0,0,0.06)`, padding: "32px 24px", textAlign: "center", animation: `cd-fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <div className="cormorant" style={{ fontSize: 42, fontWeight: 700, color: BRAND.gold, lineHeight: 1, marginBottom: 4 }}>{s.range}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.muted, marginBottom: 16 }}>Vehicles</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.navyMid, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: BRAND.gold, fontWeight: 500, padding: "8px 12px", background: "rgba(184,150,62,0.08)", borderRadius: 2 }}>{s.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORPORATE BENEFITS ── */}
      <div style={{ background: BRAND.white, padding: "64px 48px" }}>
        <div style={W}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div className="cd-gold-line" />
                <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Why Choose Us</span>
              </div>
              <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,46px)", color: BRAND.navyMid }}>Corporate Programme Benefits</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {corporateBenefits.map((b, i) => (
              <div key={b.title}
                style={{ background: BRAND.offWhite, padding: "36px 30px", borderBottom: "2px solid transparent", transition: "border-color 0.3s", animation: `cd-fadeUp 0.5s ease ${i * 0.08}s both`, cursor: "default" }}
                onMouseOver={e => e.currentTarget.style.borderBottomColor = BRAND.gold}
                onMouseOut={e  => e.currentTarget.style.borderBottomColor = "transparent"}>
                <div style={{ fontSize: 36, marginBottom: 18 }}>{b.icon}</div>
                <h3 className="cormorant" style={{ fontSize: 22, fontWeight: 600, color: BRAND.navyMid, marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLEET MODELS ── */}
      <div style={{ background: BRAND.offWhite, padding: "64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 1, background: BRAND.gold }} />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Fleet-Ready Models</span>
              <div style={{ width: 40, height: 1, background: BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,46px)", color: BRAND.navyMid }}>Choose Your Corporate Fleet</h2>
            <p style={{ fontSize: 14, color: BRAND.muted, marginTop: 10 }}>Click to select models for your enquiry</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 32 }}>
            {fleetModels.map((m, i) => {
              const isSelected = selectedModels.includes(m.name);
              return (
                <div key={m.name}
                  className={`cd-fleet-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleModel(m.name)}
                  style={{ background: isSelected ? BRAND.navyMid : BRAND.white, border: `2px solid ${isSelected ? BRAND.gold : "rgba(0,0,0,0.06)"}`, overflow: "hidden", animation: `cd-fadeUp 0.5s ease ${i * 0.08}s both` }}>
                  {m.popular && (
                    <div style={{ background: BRAND.gold, color: BRAND.navy, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center", padding: "5px", textTransform: "uppercase" }}>
                      ⭐ Most Popular for Fleets
                    </div>
                  )}
                  <div style={{ height: 160, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})` }}>
                    <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.4s ease", transform: isSelected ? "scale(1.05)" : "scale(1)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, background: m.tagColor, color: BRAND.white, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", padding: "3px 8px", textTransform: "uppercase" }}>{m.tag}</div>
                    {isSelected && (
                      <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: "50%", background: BRAND.gold, color: BRAND.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✓</div>
                    )}
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.15em", color: isSelected ? "rgba(255,255,255,0.45)" : BRAND.muted, textTransform: "uppercase", marginBottom: 4 }}>{m.category} · {m.fuel}</div>
                    <h3 className="cormorant" style={{ fontSize: 22, fontWeight: 600, color: isSelected ? BRAND.white : BRAND.navyMid, marginBottom: 12 }}>{m.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.4)" : BRAND.muted }}>Corporate Price</div>
                        <div className="cormorant" style={{ fontSize: 20, fontWeight: 600, color: isSelected ? BRAND.gold : BRAND.navyMid }}>{m.corporatePrice}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.4)" : BRAND.muted }}>You Save</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.gold }}>{m.corporateBenefit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected models bar */}
          {selectedModels.length > 0 && (
            <div style={{ background: BRAND.navyMid, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${BRAND.borderLight}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: BRAND.gold }}>Selected:</span>
                {selectedModels.map(m => (
                  <span key={m} style={{ background: "rgba(184,150,62,0.15)", border: `1px solid ${BRAND.borderLight}`, color: BRAND.gold, fontSize: 12, padding: "4px 12px", borderRadius: 2 }}>{m}</span>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Add to your enquiry below ↓</span>
            </div>
          )}
        </div>
      </div>

      {/* ── ENQUIRY FORM + PROCESS ── */}
      <div style={{ background: BRAND.white, padding: "64px 48px" }}>
        <div style={W}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

            {/* ── FORM ── */}
            <div style={{ background: BRAND.navyMid, padding: "40px 36px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 12 }}>Corporate Enquiry</div>
              <h3 className="cormorant" style={{ fontSize: 34, color: BRAND.white, marginBottom: 28 }}>Get Your Fleet Quote</h3>

              {submitted ? (
                /* ── SUCCESS STATE ── */
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 60, marginBottom: 16 }}>🏢</div>
                  <div className="cormorant" style={{ fontSize: 32, color: BRAND.white, marginBottom: 10 }}>Enquiry Received!</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 24 }}>
                    Our corporate desk will contact <strong style={{ color: BRAND.gold }}>{formData.name}</strong> at <strong style={{ color: BRAND.gold }}>{formData.phone}</strong> within 4 business hours.
                  </div>
                  {selectedModels.length > 0 && (
                    <div style={{ background: "rgba(184,150,62,0.1)", border: `1px solid ${BRAND.borderLight}`, padding: "16px 20px", textAlign: "left", marginBottom: 20 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 10 }}>Models of Interest</div>
                      {selectedModels.map(m => (
                        <div key={m} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", padding: "4px 0" }}>› {m}</div>
                      ))}
                    </div>
                  )}
                  <button className="cd-btn-outline" onClick={handleReset} style={{ padding: "12px 28px", fontSize: 12, borderRadius: 2 }}>
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                /* ── FORM FIELDS ── */
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    ["company", "Company / Organisation Name *", "text",  "ABC Pvt Ltd"],
                    ["name",    "Contact Person Name *",          "text",  "Your name"],
                    ["phone",   "Mobile Number *",                "tel",   "+91 98765 43210"],
                    ["email",   "Business Email",                 "email", "name@company.com"],
                    ["gst",     "GST Number (Optional)",          "text",  "29XXXXX1234Z1ZX"],
                  ].map(([k, l, t, p]) => (
                    <div key={k}>
                      <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 5 }}>{l}</label>
                      <input
                        type={t}
                        placeholder={p}
                        className="cd-input"
                        value={formData[k]}
                        onChange={e => updateForm(k, e.target.value)}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 5 }}>Fleet Size Required *</label>
                    <select className="cd-select" value={formData.fleetSize} onChange={e => updateForm("fleetSize", e.target.value)}>
                      <option value="">Select fleet size</option>
                      {[["1-4","1–4 Vehicles"],["5-9","5–9 Vehicles"],["10-24","10–24 Vehicles"],["25+","25+ Vehicles"]].map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 5 }}>City / Location</label>
                    <select className="cd-select" value={formData.city} onChange={e => updateForm("city", e.target.value)}>
                      <option value="">Select nearest showroom city</option>
                      {["Belgaum","Hubbli","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selected models preview inside form */}
                  {selectedModels.length > 0 && (
                    <div style={{ background: "rgba(184,150,62,0.08)", border: `1px solid ${BRAND.borderLight}`, padding: "12px 16px" }}>
                      <div style={{ fontSize: 10, color: BRAND.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Selected Models</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{selectedModels.join(" · ")}</div>
                    </div>
                  )}

                  {/* Error message */}
                  {submitStatus === "error" && (
                    <div style={{ fontSize: 13, color: "#f87171", padding: "10px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 2 }}>
                      ⚠ {errorMsg}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    className="cd-btn-gold"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitStatus === "loading"}
                    style={{ padding: "14px", fontSize: 12, borderRadius: 2, marginTop: 4 }}
                  >
                    {submitStatus === "loading" ? "Submitting…" : "Submit Fleet Enquiry →"}
                  </button>
                </div>
              )}
            </div>

            {/* ── PROCESS + ELIGIBILITY ── */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 12 }}>How It Works</div>
              <h3 className="cormorant" style={{ fontSize: 34, color: BRAND.navyMid, marginBottom: 28 }}>4 Steps to Your Fleet</h3>
              {steps.map((step, i) => (
                <div key={step.num} style={{ display: "flex", gap: 20, marginBottom: 24, animation: `cd-fadeUp 0.5s ease ${i * 0.1}s both` }}>
                  <div className="cormorant" style={{ fontSize: 48, fontWeight: 700, color: "rgba(10,31,63,0.08)", lineHeight: 1, flexShrink: 0, width: 52 }}>{step.num}</div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.navyMid, marginBottom: 6 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.7 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: BRAND.navyMid, padding: "28px", marginTop: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 16 }}>Eligible Sectors</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {eligibleCompanies.map(c => (
                    <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.gold, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "68px 48px" }}>
        <div style={{ ...W, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 14 }}>Talk to Our Corporate Desk</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,50px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 18 }}>Need a Custom<br />Fleet Solution?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>For enterprise orders of 25+ vehicles or unique procurement requirements, our corporate team will build a fully customised deal for you.</p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Call Corporate Desk */}
            <a href="tel:+919686024365" style={{ textDecoration: "none" }}>
              <button className="cd-btn-gold" style={{ padding: "16px 36px", fontSize: 13, borderRadius: 2 }}>
                📞 Call Corporate Desk
              </button>
            </a>
            {/* Email Us */}
            <a href="mailto:ketan@manickbag.com?subject=Corporate Fleet Enquiry" style={{ textDecoration: "none" }}>
              <button className="cd-btn-outline" style={{ padding: "16px 36px", fontSize: 13, borderRadius: 2 }}>
                📧 Email Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
