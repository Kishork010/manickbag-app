import { useState } from "react";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ─── CONFIG ───────────────────────────────────────────────────────
const API_URL          = "https://yourdomain.com/backend/api/insurance_enquiry.php";
const WHATSAPP_NUMBER  = "919686024365";

// ─── VEHICLE MODELS ───────────────────────────────────────────────
const VEHICLE_MODELS = [
  "Tata Nexon","Tata Nexon EV","Tata Harrier","Tata Harrier EV",
  "Tata Safari","Tata Punch","Tata Punch EV","Tata Altroz",
  "Tata Tiago","Tata Tiago EV","Tata Tigor","Tata Tigor EV",
  "Tata Curvv","Tata Curvv EV","Tata Sierra","Other",
];

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500;600;700&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    .cormorant { font-family:'Cormorant Garamond',serif; }
    .jost      { font-family:'Jost',sans-serif; }

    @keyframes ins-fadeUp   { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
    @keyframes ins-shimmer  { 0%{background-position:-200% center;}100%{background-position:200% center;} }
    @keyframes ins-spin     { to{transform:rotate(360deg);} }
    @keyframes ins-overlayIn{ from{opacity:0;}to{opacity:1;} }
    @keyframes ins-modalIn  { from{opacity:0;transform:translateY(30px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }
    @keyframes ins-successIn{ from{opacity:0;transform:scale(0.85);}to{opacity:1;transform:scale(1);} }

    .ins-fadeUp { animation:ins-fadeUp 0.6s ease forwards; }
    .gold-shimmer {
      background:linear-gradient(90deg,#b8963e 0%,#f0e4c2 40%,#b8963e 60%,#d4af5a 100%);
      background-size:200% auto;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text; animation:ins-shimmer 4s linear infinite;
    }

    .ins-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; }
    .ins-btn-gold:hover { opacity:0.9; transform:translateY(-1px); }

    .ins-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .ins-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .ins-btn-whatsapp {
      background:linear-gradient(135deg,#25D366,#128C7E); color:#fff;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
      transition:all 0.3s; display:inline-flex; align-items:center; gap:8px;
    }
    .ins-btn-whatsapp:hover { opacity:0.9; transform:translateY(-1px); }

    .ins-card { transition:all 0.3s ease; }
    .ins-card:hover { transform:translateY(-6px); }
    .ins-card.featured { border:2px solid #b8963e !important; }

    /* ── Modal ── */
    .ins-overlay {
      position:fixed; inset:0; z-index:1000;
      background:rgba(10,22,40,0.84); backdrop-filter:blur(7px);
      display:flex; align-items:center; justify-content:center; padding:16px;
      animation:ins-overlayIn 0.25s ease;
    }
    .ins-modal {
      background:#fff; width:100%; max-width:560px;
      max-height:92vh; overflow-y:auto; border-radius:4px;
      animation:ins-modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
      position:relative;
    }
    .ins-modal::-webkit-scrollbar { width:4px; }
    .ins-modal::-webkit-scrollbar-thumb { background:#b8963e55; border-radius:2px; }

    /* Form elements */
    .ins-label {
      display:block; font-family:'Jost',sans-serif;
      font-size:10px; font-weight:600; letter-spacing:0.15em;
      text-transform:uppercase; color:#6b7280; margin-bottom:5px;
    }
    .ins-input, .ins-select {
      width:100%; height:44px;
      border:1.5px solid rgba(10,31,63,0.18); border-radius:3px;
      padding:0 13px; font-family:'Jost',sans-serif; font-size:13px;
      color:#0c1f3f; outline:none; transition:border-color 0.2s;
      background:#fafaf9; appearance:none;
    }
    .ins-input:focus, .ins-select:focus { border-color:#b8963e; background:#fff; }
    .ins-input.err, .ins-select.err     { border-color:#dc2626; }
    .ins-err   { font-family:'Jost',sans-serif; font-size:11px; color:#dc2626; margin-top:3px; }

    .ins-submit {
      width:100%; height:48px; border:none; border-radius:3px;
      background:linear-gradient(135deg,#b8963e,#d4af5a);
      color:#0a1628; font-family:'Jost',sans-serif;
      font-size:12px; font-weight:700; letter-spacing:0.15em;
      text-transform:uppercase; cursor:pointer; transition:all 0.3s; outline:none;
    }
    .ins-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
    .ins-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .ins-submit.loading { position:relative; color:transparent; }
    .ins-submit.loading::after {
      content:''; position:absolute; top:50%; left:50%;
      width:20px; height:20px; margin:-10px 0 0 -10px;
      border:2px solid rgba(10,22,40,0.2); border-top-color:#0a1628;
      border-radius:50%; animation:ins-spin 0.7s linear infinite;
    }

    .ins-close {
      position:absolute; top:14px; right:14px;
      width:30px; height:30px; border:none; background:rgba(0,0,0,0.06);
      border-radius:50%; cursor:pointer; font-size:13px; color:#6b7280;
      display:flex; align-items:center; justify-content:center;
      transition:all 0.2s; outline:none; z-index:10;
    }
    .ins-close:hover { background:rgba(0,0,0,0.13); color:#0c1f3f; }

    /* Plan option pills inside modal */
    .plan-pill {
      display:flex; align-items:center; gap:10; padding:10px 14px;
      border:1.5px solid rgba(10,31,63,0.15); border-radius:3px;
      cursor:pointer; transition:all 0.2s; font-family:'Jost',sans-serif;
    }
    .plan-pill:hover  { border-color:#b8963e; }
    .plan-pill.active { border-color:#b8963e; background:#fdf6e3; }

    .ins-tab-active   { background:#b8963e !important; color:#0a1628 !important; }
    .ins-tab-inactive { background:transparent; color:rgba(255,255,255,0.6); }

    .ins-success { animation:ins-successIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }

    /* two-col grid helper */
    .ins-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    @media(max-width:480px) { .ins-grid2 { grid-template-columns:1fr; } }
  `}</style>
);

// ─── PLAN DATA ────────────────────────────────────────────────────
const plans = [
  {
    name:"Third Party", subtitle:"Mandatory Cover", icon:"🛡️",
    price:"From ₹2,094/yr", featured:false, color:"#5a8a5a",
    covers:["Third-party bodily injury","Third-party property damage","Legal liability cover","Mandatory by IRDAI"],
    notCovered:["Own vehicle damage","Theft","Natural calamities","Personal accident (add-on)"],
  },
  {
    name:"Comprehensive", subtitle:"Recommended", icon:"⭐",
    price:"From ₹8,500/yr", featured:true, color:BRAND.gold,
    covers:["All third-party covers","Own vehicle damage","Theft protection","Natural calamity damage","Fire damage","Personal accident cover"],
    notCovered:["Wear & tear","Mechanical breakdown","Drunk driving incidents"],
  },
  {
    name:"Zero Depreciation", subtitle:"Premium Add-on", icon:"💎",
    price:"From ₹12,000/yr", featured:false, color:"#4a90d9",
    covers:["All Comprehensive covers","Zero depreciation on parts","Full claim settlement","Plastic & rubber parts covered","Fibre parts covered"],
    notCovered:["Tyres (unless add-on)","Engine damage (unless add-on)","Electrical breakdown"],
  },
];

const insurancePartners = [
  { name:"Tata AIG",            logo:"🏢", type:"OEM Partner"      },
  { name:"HDFC ERGO",           logo:"🏦", type:"Preferred Partner" },
  { name:"Bajaj Allianz",       logo:"🔵", type:"Tie-up Partner"    },
  { name:"ICICI Lombard",       logo:"🟠", type:"Tie-up Partner"    },
  { name:"New India Assurance", logo:"🟢", type:"Government PSU"    },
  { name:"Oriental Insurance",  logo:"🔶", type:"Government PSU"    },
];

const steps = [
  { num:"01", title:"Share Vehicle Details",  desc:"Provide your car's RC details, previous policy if renewal, and IDV preference." },
  { num:"02", title:"Get Instant Quotes",     desc:"Our team compares quotes from 6+ insurers and presents the best options within minutes." },
  { num:"03", title:"Choose Your Plan",       desc:"Select the coverage that suits your needs and budget. Add-ons available." },
  { num:"04", title:"Digital Policy Issued",  desc:"Pay online and receive your policy document instantly via email and WhatsApp." },
];

// ─── INSURANCE MODAL ──────────────────────────────────────────────
function InsuranceModal({ type, preselectedPlan, onClose }) {
  // type: "new" | "renew"
  const isNew = type === "new";

  const [form, setForm] = useState({
    name:           "",
    phone:          "",
    email:          "",
    vehicle_model:  "",
    vehicle_number: "",
    chassis_no:     "",
    old_policy_no:  "",
    plan_selected:  preselectedPlan || "Comprehensive",
    message:        "",
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [apiErr, setApiErr]   = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit mobile number.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.vehicle_model) e.vehicle_model = "Select a vehicle model.";
    if (isNew && !form.chassis_no.trim())     e.chassis_no   = "Chassis number is required.";
    if (!isNew && !form.old_policy_no.trim()) e.old_policy_no = "Old policy number is required.";
    if (!isNew && !form.vehicle_number.trim())e.vehicle_number= "Vehicle registration number is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setApiErr("");

    try {
      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, phone: form.phone.trim(), enquiry_type: type }),
      });
      const data = await res.json();
      if (data.status === "success") setDone(true);
      else setApiErr(data.message || "Something went wrong. Please try again.");
    } catch {
      setApiErr("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const F = ({ field, label, placeholder, maxLen, type: inputType = "text", required = true }) => (
    <div>
      <label className="ins-label">{label}{required && " *"}</label>
      <input
        className={`ins-input ${errors[field] ? "err" : ""}`}
        type={inputType}
        placeholder={placeholder}
        value={form[field]}
        maxLength={maxLen}
        onChange={e => set(field, inputType === "tel" ? e.target.value.replace(/\D/g, "") : e.target.value)}
      />
      {errors[field] && <div className="ins-err">{errors[field]}</div>}
    </div>
  );

  return (
    <div className="ins-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ins-modal">
        <button className="ins-close" onClick={onClose}>✕</button>

        {done ? (
          /* ── Success ── */
          <div className="ins-success" style={{ textAlign:"center", padding:"52px 36px" }}>
            <div style={{ fontSize:58, marginBottom:18 }}>✅</div>
            <div className="cormorant" style={{ fontSize:30, fontWeight:600, color:BRAND.navyMid, marginBottom:10 }}>
              {isNew ? "Enquiry Received!" : "Renewal Request Sent!"}
            </div>
            <p style={{ fontSize:13, color:BRAND.muted, lineHeight:1.8, maxWidth:340, margin:"0 auto 26px" }}>
              Thank you, <strong>{form.name}</strong>! Our insurance team will call you on <strong>{form.phone}</strong> within a few hours with your quote.
            </p>
            <div style={{ background:BRAND.offWhite, border:"1px solid rgba(0,0,0,0.07)", borderRadius:3, padding:"14px 20px", marginBottom:26, textAlign:"left" }}>
              <div style={{ fontSize:10, letterSpacing:"0.15em", color:BRAND.muted, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", marginBottom:8 }}>
                Enquiry Summary
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:BRAND.navyMid, fontFamily:"'Jost',sans-serif" }}>{form.vehicle_model}</div>
              {isNew
                ? <div style={{ fontSize:12, color:BRAND.muted, fontFamily:"'Jost',sans-serif", marginTop:2 }}>Chassis: {form.chassis_no}</div>
                : <div style={{ fontSize:12, color:BRAND.muted, fontFamily:"'Jost',sans-serif", marginTop:2 }}>Policy: {form.old_policy_no} · Reg: {form.vehicle_number}</div>
              }
              <div style={{ fontSize:11, color:BRAND.gold, fontFamily:"'Jost',sans-serif", marginTop:6, fontWeight:600 }}>
                Plan: {form.plan_selected}
              </div>
            </div>
            <button className="ins-btn-gold" onClick={onClose} style={{ padding:"11px 36px", borderRadius:3, fontSize:11 }}>
              Back to Insurance
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div style={{ background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding:"26px 28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:28, height:1, background:BRAND.gold }} />
                <span style={{ fontSize:9, letterSpacing:"0.3em", color:BRAND.gold, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
                  {isNew ? "New Insurance" : "Policy Renewal"}
                </span>
              </div>
              <h2 className="cormorant" style={{ fontSize:26, fontWeight:600, color:BRAND.white, lineHeight:1.2 }}>
                {isNew ? "Get Your New Insurance Quote" : "Renew Your Policy in 5 Minutes"}
              </h2>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:8, fontFamily:"'Jost',sans-serif", lineHeight:1.6 }}>
                {isNew
                  ? "Fill in your details and we'll compare 6+ insurers to get you the best rate."
                  : "Share your old policy details and we'll handle the renewal instantly."}
              </p>
            </div>

            <div style={{ padding:"24px 28px" }}>

              {/* ── Section 1: Personal Details ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, letterSpacing:"0.18em", color:BRAND.gold, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:700, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span>01</span>
                  <div style={{ flex:1, height:1, background:"rgba(184,150,62,0.25)" }} />
                  <span>Personal Details</span>
                </div>
                <div className="ins-grid2">
                  <F field="name"  label="Full Name"      placeholder="e.g. Rajesh Kumar"        />
                  <F field="phone" label="Mobile Number"  placeholder="10-digit number" inputType="tel" maxLen={10} />
                </div>
                <div style={{ marginTop:14 }}>
                  <F field="email" label="Email Address"  placeholder="e.g. rajesh@email.com"    />
                </div>
              </div>

              {/* ── Section 2: Vehicle Details ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, letterSpacing:"0.18em", color:BRAND.gold, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:700, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span>02</span>
                  <div style={{ flex:1, height:1, background:"rgba(184,150,62,0.25)" }} />
                  <span>Vehicle Details</span>
                </div>

                {/* Model dropdown */}
                <div style={{ marginBottom:14 }}>
                  <label className="ins-label">Vehicle Model *</label>
                  <div style={{ position:"relative" }}>
                    <select
                      className={`ins-select ${errors.vehicle_model ? "err" : ""}`}
                      value={form.vehicle_model}
                      onChange={e => set("vehicle_model", e.target.value)}
                      style={{ paddingRight:32 }}
                    >
                      <option value="">Select your Tata model…</option>
                      {VEHICLE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:12, color:BRAND.muted }}>▾</span>
                  </div>
                  {errors.vehicle_model && <div className="ins-err">{errors.vehicle_model}</div>}
                </div>

                {/* Conditional fields */}
                {isNew ? (
                  /* NEW: chassis number + optional vehicle number */
                  <div className="ins-grid2">
                    <F field="chassis_no"     label="Chassis Number (VIN)"     placeholder="e.g. MAT123456789"   />
                    <F field="vehicle_number" label="Vehicle Reg. No. (if ready)" placeholder="e.g. KA01AB1234" required={false} />
                  </div>
                ) : (
                  /* RENEW: old policy + registration number */
                  <div className="ins-grid2">
                    <F field="old_policy_no"  label="Old Policy Number"  placeholder="e.g. HDFC-2024-XXXXX"   />
                    <F field="vehicle_number" label="Vehicle Reg. No."   placeholder="e.g. KA01AB1234"         />
                  </div>
                )}
              </div>

              {/* ── Section 3: Choose Plan ── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, letterSpacing:"0.18em", color:BRAND.gold, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:700, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span>03</span>
                  <div style={{ flex:1, height:1, background:"rgba(184,150,62,0.25)" }} />
                  <span>Choose Plan</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {plans.map(p => (
                    <div
                      key={p.name}
                      className={`plan-pill ${form.plan_selected === p.name ? "active" : ""}`}
                      onClick={() => set("plan_selected", p.name)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"10px 14px", border:`1.5px solid ${form.plan_selected === p.name ? BRAND.gold : "rgba(10,31,63,0.15)"}`, borderRadius:3, cursor:"pointer", background: form.plan_selected === p.name ? "#fdf6e3" : "#fafaf9", transition:"all 0.2s" }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:20 }}>{p.icon}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:BRAND.navyMid, fontFamily:"'Jost',sans-serif" }}>{p.name}</div>
                          <div style={{ fontSize:10, color:BRAND.muted, fontFamily:"'Jost',sans-serif" }}>{p.subtitle}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span className="cormorant" style={{ fontSize:15, fontWeight:600, color:BRAND.navyMid }}>{p.price}</span>
                        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${form.plan_selected === p.name ? BRAND.gold : "rgba(0,0,0,0.2)"}`, background: form.plan_selected === p.name ? BRAND.gold : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {form.plan_selected === p.name && <span style={{ fontSize:9, color:BRAND.navy, fontWeight:700 }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional message */}
              <div style={{ marginBottom:18 }}>
                <label className="ins-label">Additional Notes (Optional)</label>
                <textarea
                  className="ins-input"
                  placeholder="Any specific requirements or questions…"
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  style={{ height:72, resize:"vertical", paddingTop:10, lineHeight:1.5 }}
                />
              </div>

              {apiErr && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:3, padding:"9px 14px", marginBottom:14, fontSize:12, color:"#dc2626", fontFamily:"'Jost',sans-serif" }}>
                  ⚠️ {apiErr}
                </div>
              )}

              <button
                className={`ins-submit ${loading ? "loading" : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "" : isNew ? "Submit & Get Quote →" : "Submit Renewal Request →"}
              </button>

              <p style={{ fontSize:10, color:BRAND.muted, textAlign:"center", marginTop:10, fontFamily:"'Jost',sans-serif", lineHeight:1.6 }}>
                Our team will contact you within 24 hours via call or WhatsApp.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function Insurance() {
  const [activeTab,    setActiveTab]    = useState("new");
  const [selectedPlan, setSelectedPlan] = useState("Comprehensive");
  const [modal, setModal] = useState(null);
  // modal: null | { type:"new"|"renew", plan?: string }

  const openModal = (type, plan) => setModal({ type, plan: plan || selectedPlan });
  const closeModal = () => setModal(null);

  // Hero tab click: open modal
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    openModal(tab);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello! I'd like to speak with an insurance expert at Manickbag Tata Motors.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <PageStyles />

      {/* Insurance Modal */}
      {modal && (
        <InsuranceModal
          type={modal.type}
          preselectedPlan={modal.plan}
          onClose={closeModal}
        />
      )}

      {/* ── Hero ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,#0d2a52 60%,${BRAND.navyMid} 100%)`, padding:"80px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-80, top:-80, width:450, height:450, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.08)` }} />
        <div style={{ position:"absolute", right:60,  top:60,  width:260, height:260, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.12)` }} />
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Vehicle Insurance</span>
          </div>
          <h1 className="cormorant" style={{ fontSize:"clamp(40px,5vw,72px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, marginBottom:16 }}>
            Drive with <span className="gold-shimmer">Confidence</span>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", maxWidth:520, lineHeight:1.8, marginBottom:40 }}>
            New purchase insurance, renewals, and add-ons handled seamlessly at your Manickbag showroom. Compare 6+ insurers. Instant policy. Zero hassle.
          </p>

          {/* Tab toggle — clicking opens the modal directly */}
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.08)", borderRadius:4, padding:4, gap:4, marginBottom:32 }}>
            {[["new","🆕 New Insurance"],["renew","🔄 Renew Policy"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                style={{
                  padding:"10px 28px", fontSize:12, cursor:"pointer", borderRadius:2, border:"none",
                  background: activeTab === id ? BRAND.gold : "transparent",
                  color:      activeTab === id ? BRAND.navy : "rgba(255,255,255,0.6)",
                  fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.08em", transition:"all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", gap:40 }}>
            {[["6+","Insurer Partners"],["5 min","Quote Time"],["Instant","Policy Issuance"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.gold }}>{val}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Plans ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"64px 48px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Coverage Plans</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", color:BRAND.navyMid }}>Choose Your Protection</h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:64 }}>
          {plans.map((plan, i) => (
            <div key={plan.name}
              className={`ins-card ${plan.featured ? "featured" : ""}`}
              onClick={() => setSelectedPlan(plan.name)}
              style={{ background:selectedPlan===plan.name ? BRAND.navyMid : BRAND.offWhite, border:`${plan.featured?2:1}px solid ${plan.featured?BRAND.gold:"rgba(0,0,0,0.06)"}`, overflow:"hidden", cursor:"pointer", position:"relative", animation:`ins-fadeUp 0.5s ease ${i*0.12}s both` }}>
              {plan.featured && (
                <div style={{ background:BRAND.gold, color:BRAND.navy, fontSize:9, fontWeight:700, letterSpacing:"0.2em", textAlign:"center", padding:"6px", textTransform:"uppercase" }}>
                  Most Recommended
                </div>
              )}
              <div style={{ padding:"28px 28px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:40 }}>{plan.icon}</span>
                  <div style={{ padding:"4px 12px", background:plan.color, color:BRAND.white, fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>{plan.subtitle}</div>
                </div>
                <h3 className="cormorant" style={{ fontSize:28, fontWeight:600, color:selectedPlan===plan.name?BRAND.white:BRAND.navyMid, marginBottom:4 }}>{plan.name}</h3>
                <div className="cormorant" style={{ fontSize:22, color:plan.featured?BRAND.gold:(selectedPlan===plan.name?BRAND.goldLight:BRAND.navyMid), marginBottom:20 }}>{plan.price}</div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.gold, marginBottom:8, fontWeight:600 }}>Covers</div>
                  {plan.covers.map(c => (
                    <div key={c} style={{ display:"flex", gap:8, padding:"5px 0", alignItems:"center" }}>
                      <span style={{ color:"#4caf50", fontSize:14 }}>✓</span>
                      <span style={{ fontSize:12, color:selectedPlan===plan.name?"rgba(255,255,255,0.7)":BRAND.muted }}>{c}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#e57373", marginBottom:8, fontWeight:600 }}>Not Covered</div>
                  {plan.notCovered.map(c => (
                    <div key={c} style={{ display:"flex", gap:8, padding:"5px 0", alignItems:"center" }}>
                      <span style={{ color:"#e57373", fontSize:14 }}>✗</span>
                      <span style={{ fontSize:12, color:selectedPlan===plan.name?"rgba(255,255,255,0.5)":"#9ca3af" }}>{c}</span>
                    </div>
                  ))}
                </div>
                {/* Get Quote button — opens modal with this plan pre-selected */}
                <button
                  className="ins-btn-gold"
                  onClick={e => { e.stopPropagation(); openModal("new", plan.name); }}
                  style={{ width:"100%", padding:"12px", fontSize:12, borderRadius:2, marginTop:24 }}
                >
                  Get Quote for {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div style={{ background:BRAND.navyMid, padding:"48px 48px", marginBottom:48 }}>
          <h2 className="cormorant" style={{ fontSize:36, color:BRAND.white, textAlign:"center", marginBottom:40 }}>How It Works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ textAlign:"center", position:"relative" }}>
                {i < steps.length - 1 && (
                  <div style={{ position:"absolute", top:24, left:"60%", width:"80%", height:1, background:`linear-gradient(90deg,${BRAND.gold},transparent)` }} />
                )}
                <div className="cormorant" style={{ fontSize:52, fontWeight:700, color:"rgba(184,150,62,0.2)", lineHeight:1, marginBottom:12 }}>{step.num}</div>
                <div style={{ fontSize:15, fontWeight:600, color:BRAND.gold, marginBottom:8 }}>{step.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div className="cormorant" style={{ fontSize:32, color:BRAND.navyMid }}>Our Insurance Partners</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
            {insurancePartners.map(p => (
              <div key={p.name}
                style={{ background:BRAND.offWhite, border:`1px solid rgba(0,0,0,0.06)`, padding:"20px 16px", textAlign:"center", transition:"all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.background=BRAND.navyMid; e.currentTarget.style.borderColor=BRAND.borderLight; }}
                onMouseOut={e => { e.currentTarget.style.background=BRAND.offWhite; e.currentTarget.style.borderColor="rgba(0,0,0,0.06)"; }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{p.logo}</div>
                <div style={{ fontSize:12, fontWeight:600, color:BRAND.navyMid, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:10, color:BRAND.muted }}>{p.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Renewal CTA ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"60px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Quick Renewal</div>
            <h2 className="cormorant" style={{ fontSize:40, color:BRAND.white, marginBottom:16 }}>Renew in 5 Minutes</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
              Don't let your policy lapse. Share your registration number and we'll retrieve your vehicle details instantly.
            </p>
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", flexWrap:"wrap" }}>
            {/* Renew Now → opens modal with type "renew" */}
            <button
              className="ins-btn-gold"
              onClick={() => openModal("renew")}
              style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}
            >
              🔄 Renew Now
            </button>

            {/* Call Expert → WhatsApp */}
            <button
              className="ins-btn-whatsapp"
              onClick={handleWhatsApp}
              style={{ padding:"16px 28px", fontSize:13, borderRadius:2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Call Expert
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}