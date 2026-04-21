import { useState } from "react";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ─── API CONFIG ───────────────────────────────────────────────────
const API_URL = `${import.meta.env.VITE_API_URL || "/backend/api"}/service_booking.php`;

// ─── API HELPERS ──────────────────────────────────────────────────
async function submitAppointment(payload) {
  const res  = await fetch(`${API_URL}?type=appointment`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ...payload, booking_type: "appointment" }),
  });
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.message || "Booking failed.");
  return data;
}

async function submitPackageBooking(payload) {
  const res  = await fetch(`${API_URL}?type=package`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ...payload, booking_type: "package" }),
  });
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.message || "Package booking failed.");
  return data;
}

// ─── PAGE STYLES ─────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500;600;700&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    .cormorant { font-family:'Cormorant Garamond',serif; }
    .jost      { font-family:'Jost',sans-serif; }

    @keyframes sp-fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
    @keyframes sp-fadeIn { from{opacity:0;}to{opacity:1;} }
    @keyframes sp-pulse  { 0%,100%{opacity:1;}50%{opacity:0.3;} }
    @keyframes sp-spin   { to{transform:rotate(360deg);} }
    @keyframes sp-shimmer{ 0%{background-position:-200% center;}100%{background-position:200% center;} }

    .sp-fadeUp { animation:sp-fadeUp 0.6s ease forwards; }

    .gold-shimmer {
      background:linear-gradient(90deg,#b8963e 0%,#f0e4c2 40%,#b8963e 60%,#d4af5a 100%);
      background-size:200% auto;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text; animation:sp-shimmer 4s linear infinite;
    }

    .sp-btn-gold {
      background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s;
    }
    .sp-btn-gold:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
    .sp-btn-gold:disabled { opacity:0.42; cursor:not-allowed; transform:none; }

    .sp-btn-outline {
      background:transparent; border:1px solid #b8963e; color:#b8963e;
      cursor:pointer; font-family:'Jost',sans-serif; font-weight:500;
      letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
    }
    .sp-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .sp-service-card { transition:all 0.3s ease; cursor:pointer; border-radius:2px; }
    .sp-service-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.1); }

    /* ── Dark inputs (appointment form) ── */
    .sp-input {
      width:100%; padding:12px 16px;
      background:rgba(255,255,255,0.07);
      border:1px solid rgba(184,150,62,0.2);
      color:#ffffff; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; transition:border-color 0.2s;
    }
    .sp-input:focus { border-color:#b8963e; }
    .sp-input::placeholder { color:rgba(255,255,255,0.3); }
    .sp-input.err { border-color:#e57373; }

    .sp-select {
      width:100%; padding:12px 16px;
      background:rgba(255,255,255,0.07);
      border:1px solid rgba(184,150,62,0.2);
      color:#ffffff; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; cursor:pointer; appearance:none;
    }
    .sp-select option { background:#0c1f3f; color:#ffffff; }
    .sp-select.err { border-color:#e57373; }

    /* ── Light inputs (package popup) ── */
    .sp-input-light {
      width:100%; padding:11px 14px;
      background:#ffffff; border:1.5px solid rgba(10,31,63,0.15);
      color:#0c1f3f; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; transition:border-color 0.2s, box-shadow 0.2s;
    }
    .sp-input-light:focus { border-color:#b8963e; box-shadow:0 0 0 3px rgba(184,150,62,0.1); }
    .sp-input-light::placeholder { color:#b0b7c3; }
    .sp-input-light.err { border-color:#e53e3e; }

    .sp-select-light {
      width:100%; padding:11px 14px;
      background:#ffffff; border:1.5px solid rgba(10,31,63,0.15);
      color:#0c1f3f; font-family:'Jost',sans-serif; font-size:13px;
      outline:none; border-radius:2px; cursor:pointer; appearance:none;
    }
    .sp-select-light:focus { border-color:#b8963e; box-shadow:0 0 0 3px rgba(184,150,62,0.1); }
    .sp-select-light:disabled { background:#f5f5f5; color:#aaa; }
    .sp-select-light.err { border-color:#e53e3e; }

    /* Step dots */
    .sp-step-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; transition:all 0.3s; }
    .sp-step-dot.active  { background:#b8963e; color:#0a1628; }
    .sp-step-dot.done    { background:#4caf50; color:#fff; }
    .sp-step-dot.pending { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.4); }

    /* Popup overlay */
    .sp-overlay {
      position:fixed; inset:0; background:rgba(5,15,35,0.84);
      z-index:2000; display:flex; align-items:center; justify-content:center;
      padding:16px; animation:sp-fadeIn 0.25s ease; backdrop-filter:blur(5px);
    }
    .sp-popup {
      background:#ffffff; width:100%; max-width:640px;
      max-height:92vh; overflow-y:auto; border-radius:4px;
      box-shadow:0 32px 80px rgba(0,0,0,0.45);
      animation:sp-fadeUp 0.3s ease;
    }
    .sp-popup::-webkit-scrollbar { width:4px; }
    .sp-popup::-webkit-scrollbar-thumb { background:#b8963e; border-radius:2px; }

    .sp-field-err { font-size:11px; color:#e53e3e; margin-top:4px; font-family:'Jost',sans-serif; }

    /* Loading spinner */
    .sp-spin { display:inline-block; width:16px; height:16px; border:2px solid rgba(10,22,40,0.25); border-top-color:#0a1628; border-radius:50%; animation:sp-spin 0.7s linear infinite; vertical-align:middle; margin-right:6px; }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────
const serviceTypes = [
  { id:"periodic",   icon:"🔄", title:"Periodic Service",   desc:"Scheduled maintenance at 5K, 10K, 20K km intervals",  duration:"4-6 hrs",    price:"From ₹1,800" },
  { id:"repair",     icon:"🔧", title:"Repair Service",      desc:"Diagnosis and repair of specific faults or issues",    duration:"As required", price:"On estimate" },
  { id:"bodyshop",   icon:"🎨", title:"Body Shop & Denting", desc:"Paint, denting, panel repair and finish restoration",  duration:"1-5 days",   price:"On estimate" },
  { id:"wheel",      icon:"⚙️", title:"Wheel & Tyre",        desc:"Alignment, balancing, rotation and tyre replacement", duration:"2-3 hrs",    price:"From ₹800"   },
  { id:"electrical", icon:"⚡", title:"Electrical & AC",     desc:"Electrical diagnostics, AC servicing, battery check", duration:"2-4 hrs",    price:"From ₹1,200" },
  { id:"doorstep",   icon:"🏠", title:"Doorstep Service",    desc:"Home pickup and drop service across North Karnataka", duration:"Same day",   price:"From ₹2,500" },
];

const showrooms = [
  "Belgaum – Main Showroom","Hubbli – Main Showroom","Dharwad","Karwar",
  "Bijapur","Gulbarga","Bidar","Yadgiri",
];

const tataModels = [
  "Tiago","Tiago EV","Altroz","Tigor","Tigor EV","Punch","Punch EV",
  "Nexon","Nexon EV","Harrier","Harrier EV","Safari","Curvv","Curvv EV",
];

const modelVariants = {
  "Tiago":      ["XE","XM","XT","XZ","XZ+"],
  "Tiago EV":   ["XT","XZ","XZ+","XZ+ Dark Edition"],
  "Altroz":     ["XE","XM","XT","XZ","XZ+","XZ+ Dark"],
  "Tigor":      ["XE","XM","XT","XZ","XZ+"],
  "Tigor EV":   ["XM+","XT","XZ","XZ+"],
  "Punch":      ["Pure","Adventure","Accomplished","Creative"],
  "Punch EV":   ["Smart","Smart+","Adventure","Empowered","Empowered+"],
  "Nexon":      ["Smart","Smart+","Pure","Creative","Creative+","Fearless","Fearless+"],
  "Nexon EV":   ["Creative","Creative+","Fearless","Fearless+","Empowered","Empowered+"],
  "Harrier":    ["Smart","Smart+","Adventure","Adventure+","Fearless","Fearless+","Fearless S","Fearless S+"],
  "Harrier EV": ["Long Range"],
  "Safari":     ["Smart","Smart+","Adventure","Adventure+","Accomplished+","Gold","Gold+"],
  "Curvv":      ["Creative","Creative+","Accomplished","Accomplished+","Empowered"],
  "Curvv EV":   ["Creative+","Accomplished+","Empowered+","Empowered+ Jet"],
};

const timeslots = [
  "08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","02:00 PM","03:00 PM","04:00 PM",
];

const processSteps = [
  { icon:"📋", title:"Book Appointment",   desc:"Online form or walk-in — your choice." },
  { icon:"🔍", title:"Vehicle Inspection", desc:"Multi-point check by trained technician." },
  { icon:"📊", title:"Estimate Approval",  desc:"Transparent cost estimate before any work begins." },
  { icon:"🔧", title:"Service & Repair",   desc:"Genuine Tata parts. Certified tools." },
  { icon:"✅", title:"Quality Check",      desc:"Pre-delivery inspection and road test." },
  { icon:"🚗", title:"Vehicle Delivery",   desc:"Detailed service report and digital invoice." },
];

const servicePackages = [
  { km:"5,000 km",  label:"1st Free Service", price:"Free",        highlight:true,
    items:["Engine oil check","Fluid top-up","Multi-point inspection","Tyre pressure check"] },
  { km:"10,000 km", label:"2nd Service",       price:"From ₹1,800", highlight:false,
    items:["Engine oil change","Oil filter","Air filter check","Brake inspection"] },
  { km:"20,000 km", label:"Annual Service",    price:"From ₹3,200", highlight:false,
    items:["Full fluid change","Filters replaced","Spark plug check","Cabin filter change"] },
  { km:"40,000 km", label:"Major Service",     price:"From ₹6,500", highlight:false,
    items:["Complete fluid flush","Belt inspection","Brake overhaul","Full diagnostics"] },
];

// ─────────────────────────────────────────────────────────────────
//  PACKAGE BOOKING POPUP
// ─────────────────────────────────────────────────────────────────
function PackageBookingPopup({ pkg, onClose }) {
  const blank = { fullName:"", phone:"", email:"", address:"", model:"", variant:"", mfgYear:"", vehicleNumber:"", kms:"" };
  const [form,      setForm]      = useState(blank);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiErr,    setApiErr]    = useState("");

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())               e.fullName      = "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone    = "Enter valid 10-digit mobile number.";
    if (!form.model)                          e.model        = "Please select your Tata model.";
    if (!form.vehicleNumber.trim())           e.vehicleNumber= "Vehicle registration number is required.";
    if (!form.kms.trim())                     e.kms          = "Please enter current km reading.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiErr("");
    try {
      await submitPackageBooking({
        name:           form.fullName,
        phone:          form.phone.trim(),
        email:          form.email,
        address:        form.address,
        model:          form.model,
        variant:        form.variant,
        mfgYear:        form.mfgYear,
        vehicleNumber:  form.vehicleNumber.toUpperCase(),
        kms:            form.kms,
        package_km:     pkg.km,
        package_label:  pkg.label,
        package_price:  pkg.price,
      });
      setSubmitted(true);
    } catch (err) {
      setApiErr(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const overlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };
  const currentYear  = new Date().getFullYear();
  const mfgYears     = Array.from({ length: 12 }, (_, i) => String(currentYear - i));
  const variants     = modelVariants[form.model] || [];

  // Reusable field wrapper
  const LabelRow = ({ label, required, err, children }) => (
    <div>
      <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:BRAND.navyMid, marginBottom:6 }}>
        {label}{required && <span style={{ color:"#e53e3e" }}> *</span>}
      </label>
      {children}
      {err && <div className="sp-field-err">{err}</div>}
    </div>
  );

  const SelectWrap = ({ children }) => (
    <div style={{ position:"relative" }}>
      {children}
      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:11, color:BRAND.muted, pointerEvents:"none" }}>▾</span>
    </div>
  );

  return (
    <div className="sp-overlay" onClick={overlayClick}>
      <div className="sp-popup">

        {/* Header */}
        <div style={{ background:BRAND.navyMid, padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Book Service Package</div>
            <div className="cormorant" style={{ fontSize:22, color:BRAND.white, fontWeight:600 }}>{pkg.km} — {pkg.label}</div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.08)", border:"none", color:BRAND.white, width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s", fontFamily:"sans-serif" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
            ×
          </button>
        </div>

        <div style={{ padding:"28px" }}>
          {submitted ? (
            /* Success State */
            <div style={{ textAlign:"center", padding:"32px 16px" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
              <div className="cormorant" style={{ fontSize:30, color:BRAND.navyMid, fontWeight:600, marginBottom:10 }}>Booking Received!</div>
              <p style={{ fontSize:14, color:BRAND.muted, lineHeight:1.8, marginBottom:8 }}>
                We've received your <strong>{pkg.label}</strong> booking for your{" "}
                <strong style={{ color:BRAND.navyMid }}>{form.model}{form.variant ? " " + form.variant : ""}</strong>.
              </p>
              <p style={{ fontSize:13, color:BRAND.muted, marginBottom:24 }}>
                Our service advisor will call <strong style={{ color:BRAND.navyMid }}>{form.phone}</strong> within 30 minutes to confirm your appointment slot.
              </p>
              <div style={{ background:BRAND.offWhite, borderLeft:`4px solid ${BRAND.gold}`, padding:"16px 20px", textAlign:"left", marginBottom:24 }}>
                <div style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.gold, marginBottom:10 }}>Booking Summary</div>
                {[
                  ["Package",     `${pkg.km} — ${pkg.label}`],
                  ["Price",       pkg.price],
                  ["Vehicle",     `${form.model}${form.variant ? " " + form.variant : ""}`],
                  ["Reg. Number", form.vehicleNumber],
                  ["KMs Driven",  form.kms],
                ].map(([l, v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(0,0,0,0.05)", fontSize:13 }}>
                    <span style={{ color:BRAND.muted }}>{l}</span>
                    <span style={{ color:BRAND.navyMid, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="sp-btn-gold" onClick={onClose} style={{ padding:"12px 32px", fontSize:12, borderRadius:2 }}>Close</button>
            </div>

          ) : (
            <>
              {/* Package strip */}
              <div style={{ background:BRAND.offWhite, borderLeft:`4px solid ${BRAND.gold}`, padding:"12px 16px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:12, color:BRAND.muted }}>{pkg.items.join("  ·  ")}</div>
                <div className="cormorant" style={{ fontSize:20, fontWeight:700, color:BRAND.navyMid, flexShrink:0, marginLeft:12 }}>{pkg.price}</div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

                {/* Full Name */}
                <div style={{ gridColumn:"1/-1" }}>
                  <LabelRow label="Full Name" required err={errors.fullName}>
                    <input className={`sp-input-light ${errors.fullName ? "err" : ""}`}
                      placeholder="Enter your full name" value={form.fullName}
                      onChange={e => set("fullName", e.target.value)} />
                  </LabelRow>
                </div>

                {/* Phone */}
                <LabelRow label="Mobile Number" required err={errors.phone}>
                  <input className={`sp-input-light ${errors.phone ? "err" : ""}`}
                    placeholder="10-digit number" maxLength={10} value={form.phone}
                    onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} />
                </LabelRow>

                {/* Email */}
                <LabelRow label="Email Address" err={errors.email}>
                  <input className={`sp-input-light ${errors.email ? "err" : ""}`}
                    type="email" placeholder="you@email.com" value={form.email}
                    onChange={e => set("email", e.target.value)} />
                </LabelRow>

                {/* Address */}
                <div style={{ gridColumn:"1/-1" }}>
                  <LabelRow label="Address / City">
                    <input className="sp-input-light" placeholder="Your area / city"
                      value={form.address} onChange={e => set("address", e.target.value)} />
                  </LabelRow>
                </div>

                {/* Model */}
                <LabelRow label="Tata Model" required err={errors.model}>
                  <SelectWrap>
                    <select className={`sp-select-light ${errors.model ? "err" : ""}`}
                      value={form.model}
                      onChange={e => { set("model", e.target.value); set("variant", ""); }}>
                      <option value="">Select model</option>
                      {tataModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </SelectWrap>
                </LabelRow>

                {/* Variant */}
                <LabelRow label="Variant">
                  <SelectWrap>
                    <select className="sp-select-light" value={form.variant}
                      onChange={e => set("variant", e.target.value)} disabled={!form.model}>
                      <option value="">{form.model ? "Select variant" : "Select model first"}</option>
                      {variants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </SelectWrap>
                </LabelRow>

                {/* Mfg Year */}
                <LabelRow label="Manufacturing Year">
                  <SelectWrap>
                    <select className="sp-select-light" value={form.mfgYear}
                      onChange={e => set("mfgYear", e.target.value)}>
                      <option value="">Select year</option>
                      {mfgYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </SelectWrap>
                </LabelRow>

                {/* Vehicle Number */}
                <LabelRow label="Vehicle Number" required err={errors.vehicleNumber}>
                  <input className={`sp-input-light ${errors.vehicleNumber ? "err" : ""}`}
                    placeholder="KA-XX-XXXX" value={form.vehicleNumber}
                    onChange={e => set("vehicleNumber", e.target.value.toUpperCase())} />
                </LabelRow>

                {/* KMs */}
                <div style={{ gridColumn:"1/-1" }}>
                  <LabelRow label="Current KMs Driven" required err={errors.kms}>
                    <input className={`sp-input-light ${errors.kms ? "err" : ""}`}
                      placeholder="e.g. 18,500 km" value={form.kms}
                      onChange={e => set("kms", e.target.value)} />
                  </LabelRow>
                </div>

              </div>

              {apiErr && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:3, padding:"9px 14px", marginTop:16, fontSize:12, color:"#dc2626", fontFamily:"'Jost',sans-serif" }}>
                  ⚠️ {apiErr}
                </div>
              )}

              <div style={{ display:"flex", gap:10, marginTop:24 }}>
                <button className="sp-btn-outline" onClick={onClose}
                  style={{ flex:1, padding:"13px", fontSize:12, borderRadius:2 }}>
                  Cancel
                </button>
                <button className="sp-btn-gold" onClick={handleSubmit} disabled={loading}
                  style={{ flex:2, padding:"13px", fontSize:12, borderRadius:2 }}>
                  {loading ? <><span className="sp-spin" />Submitting…</> : "Confirm Booking →"}
                </button>
              </div>
              <p style={{ fontSize:11, color:BRAND.muted, textAlign:"center", marginTop:10, lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>
                Fields marked <span style={{ color:"#e53e3e" }}>*</span> are required. Our team will call to confirm your slot.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function ServicePage() {
  // ── Appointment form state ─────────────────────────────────
  const [selectedType, setSelectedType] = useState("");
  const [step,         setStep]         = useState(1);
  const [form,         setForm]         = useState({
    name:"", phone:"", regNo:"", model:"", showroom:"", date:"", time:"", issues:""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [apptErr,   setApptErr]   = useState("");
  const [formErrors,setFormErrors]= useState({});

  // ── Package popup state ────────────────────────────────────
  const [popupPkg, setPopupPkg] = useState(null);

  const updateForm = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setFormErrors(e => ({ ...e, [k]: "" }));
  };

  // Validation helpers
  const canProceed1 = Boolean(
    selectedType       !== "" &&
    form.name.trim()   !== "" &&
    form.phone.trim()  !== "" &&
    form.regNo.trim()  !== "" &&
    form.model         !== ""
  );
  const canProceed2 = Boolean(form.showroom !== "" && form.date !== "" && form.time !== "");

  // Step-1 field validation
  const validateStep1 = () => {
    const e = {};
    if (!selectedType)         e.serviceType = "Please select a service type above.";
    if (!form.name.trim())     e.name        = "Name is required.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit mobile number.";
    if (!form.regNo.trim())    e.regNo       = "Registration number is required.";
    if (!form.model)           e.model       = "Please select a vehicle model.";
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setFormErrors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!canProceed2) return;
    setLoading(true);
    setApptErr("");
    try {
      await submitAppointment({
        name:          form.name.trim(),
        phone:         form.phone.trim(),
        regNo:         form.regNo.trim(),
        model:         form.model,
        service_type:  selectedType,
        showroom:      form.showroom,
        date:          form.date,
        time:          form.time,
        issues:        form.issues,
      });
      setSubmitted(true);
    } catch (err) {
      setApptErr(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false); setStep(1); setApptErr(""); setFormErrors({});
    setForm({ name:"", phone:"", regNo:"", model:"", showroom:"", date:"", time:"", issues:"" });
    setSelectedType("");
  };

  return (
    <Layout>
      <PageStyles />

      {/* Package popup */}
      {popupPkg && <PackageBookingPopup pkg={popupPkg} onClose={() => setPopupPkg(null)} />}

      {/* ── Hero ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyMid} 60%,#0b2342 100%)`, padding:"72px 48px", position:"relative", overflow:"hidden" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.25, left:`${60+i*10}%`, top:`${20+(i%3)*25}%`, animation:`sp-pulse ${2+i*0.4}s ease-in-out infinite` }} />
        ))}
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Authorised Service Centre</span>
          </div>
          <h1 className="cormorant" style={{ fontSize:"clamp(40px,5vw,72px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, marginBottom:16 }}>
            Expert Care for <span className="gold-shimmer">Your Tata</span>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", maxWidth:520, lineHeight:1.8, marginBottom:40 }}>
            Factory-trained technicians. Genuine Tata parts. Transparent pricing. Book your service slot in 2 minutes.
          </p>
          <div style={{ display:"flex", gap:40 }}>
            {[["200+","Certified Technicians"],["100%","Genuine Parts"],["6 hrs","Avg. Turnaround"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.gold }}>{val}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service Types ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 48px 0" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Service Types</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.navyMid }}>What service do you need?</h2>
          <p style={{ fontSize:13, color:BRAND.muted, marginTop:8 }}>Select a type below — then fill the form to book your appointment.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:selectedType ? 24 : 48 }}>
          {serviceTypes.map((s, i) => (
            <div key={s.id} className="sp-service-card"
              onClick={() => { setSelectedType(s.id); setFormErrors(e => ({ ...e, serviceType:"" })); }}
              style={{ background:selectedType===s.id ? BRAND.navyMid : BRAND.offWhite, border:`2px solid ${selectedType===s.id ? BRAND.gold : "rgba(0,0,0,0.06)"}`, padding:"24px", animation:`sp-fadeUp 0.5s ease ${i*0.08}s both` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:36 }}>{s.icon}</span>
                {selectedType === s.id && <span style={{ fontSize:18, color:BRAND.gold, fontWeight:700 }}>✓</span>}
              </div>
              <h3 style={{ fontSize:16, fontWeight:600, color:selectedType===s.id ? BRAND.white : BRAND.navyMid, marginBottom:8 }}>{s.title}</h3>
              <p style={{ fontSize:12, color:selectedType===s.id ? "rgba(255,255,255,0.55)" : BRAND.muted, lineHeight:1.6, marginBottom:14 }}>{s.desc}</p>
              <div style={{ display:"flex", gap:16 }}>
                <div style={{ fontSize:11, color:selectedType===s.id ? BRAND.gold : BRAND.muted }}>⏱ {s.duration}</div>
                <div style={{ fontSize:11, color:selectedType===s.id ? BRAND.goldLight : BRAND.navyMid, fontWeight:500 }}>{s.price}</div>
              </div>
            </div>
          ))}
        </div>

        {formErrors.serviceType && (
          <div style={{ textAlign:"center", marginBottom:16, fontSize:13, color:"#e57373" }}>
            ⚠ {formErrors.serviceType}
          </div>
        )}

        {!selectedType && (
          <div style={{ textAlign:"center", marginBottom:48, padding:"14px 20px", background:"rgba(184,150,62,0.07)", border:"1px dashed rgba(184,150,62,0.35)", borderRadius:2 }}>
            <span style={{ fontSize:13, color:BRAND.gold }}>⬆ Select a service type above to enable the booking form</span>
          </div>
        )}

        {/* ── Booking Form + Process ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, marginBottom:64 }}>

          {/* ─── FORM PANEL ─── */}
          <div style={{ background:BRAND.navyMid, padding:"40px 36px" }}>

            {submitted ? (
              /* Success */
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
                <div className="cormorant" style={{ fontSize:36, color:BRAND.white, marginBottom:12 }}>Booking Confirmed!</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:24 }}>
                  We've received your service request. Our advisor will call{" "}
                  <strong style={{ color:BRAND.gold }}>{form.phone}</strong> within 30 minutes.
                </div>
                <div style={{ background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}`, padding:"20px 24px", textAlign:"left", marginBottom:24 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Booking Summary</div>
                  {[
                    ["Service",    serviceTypes.find(s => s.id === selectedType)?.title || "—"],
                    ["Vehicle",    form.model],
                    ["Showroom",   form.showroom],
                    ["Date",       form.date],
                    ["Time",       form.time],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{label}</span>
                      <span style={{ fontSize:12, color:BRAND.white, fontWeight:500 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button className="sp-btn-gold" onClick={resetForm} style={{ padding:"12px 28px", fontSize:12, borderRadius:2 }}>
                  Book Another Service
                </button>
              </div>

            ) : (
              <>
                {/* Step Indicator */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
                  {[1, 2].map((s, i) => (
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div className={`sp-step-dot ${step > s ? "done" : step === s ? "active" : "pending"}`}>
                        {step > s ? "✓" : s}
                      </div>
                      <div>
                        <div style={{ fontSize:11, color:step >= s ? BRAND.gold : "rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Step {s}</div>
                        <div style={{ fontSize:12, color:step >= s ? BRAND.white : "rgba(255,255,255,0.3)" }}>
                          {s === 1 ? "Vehicle Details" : "Appointment"}
                        </div>
                      </div>
                      {i === 0 && (
                        <div style={{ flex:1, height:1, background:step > 1 ? BRAND.gold : "rgba(255,255,255,0.1)", minWidth:32 }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* ─── STEP 1 ─── */}
                {step === 1 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Your Details</div>

                    {[
                      ["name",  "Full Name",           "text", "John Doe"],
                      ["phone", "Mobile Number",        "tel",  "10-digit number"],
                      ["regNo", "Registration Number",  "text", "KA-XX-XXXX"],
                    ].map(([k, l, t, p]) => (
                      <div key={k}>
                        <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>
                          {l} <span style={{ color:BRAND.gold }}>*</span>
                        </label>
                        <input type={t} placeholder={p} className={`sp-input ${formErrors[k] ? "err" : ""}`}
                          value={form[k]}
                          onChange={e => updateForm(k, t === "tel" ? e.target.value.replace(/\D/g,"") : e.target.value)}
                          maxLength={k === "phone" ? 10 : undefined}
                        />
                        {formErrors[k] && <div className="sp-field-err" style={{ color:"#e57373" }}>{formErrors[k]}</div>}
                      </div>
                    ))}

                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>
                        Vehicle Model <span style={{ color:BRAND.gold }}>*</span>
                      </label>
                      <select className={`sp-select ${formErrors.model ? "err" : ""}`}
                        value={form.model} onChange={e => updateForm("model", e.target.value)}>
                        <option value="">Select your Tata model</option>
                        {tataModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {formErrors.model && <div className="sp-field-err" style={{ color:"#e57373" }}>{formErrors.model}</div>}
                    </div>

                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>
                        Describe the Issue <span style={{ color:"rgba(255,255,255,0.25)" }}>(optional)</span>
                      </label>
                      <textarea className="sp-input" rows={3}
                        placeholder="e.g. Engine noise, AC not cooling..."
                        value={form.issues} onChange={e => updateForm("issues", e.target.value)}
                        style={{ resize:"vertical" }} />
                    </div>

                    {!selectedType && (
                      <div style={{ fontSize:12, color:"rgba(255,180,50,0.9)", padding:"9px 12px", background:"rgba(255,165,0,0.07)", border:"1px solid rgba(255,165,0,0.2)", borderRadius:2 }}>
                        ⚠ Please select a service type above first
                      </div>
                    )}

                    <button className="sp-btn-gold" onClick={handleNext} disabled={!canProceed1}
                      style={{ padding:"13px", fontSize:12, borderRadius:2 }}>
                      {canProceed1 ? "Next: Choose Slot →" : "Fill all required fields to continue"}
                    </button>

                    {selectedType && !canProceed1 && (
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
                        Still needed:{" "}
                        {[
                          !form.name.trim()  && "Name",
                          !form.phone.trim() && "Phone",
                          !form.regNo.trim() && "Reg. Number",
                          !form.model        && "Vehicle Model",
                        ].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 2 ─── */}
                {step === 2 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Schedule Appointment</div>

                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>
                        Select Showroom <span style={{ color:BRAND.gold }}>*</span>
                      </label>
                      <select className="sp-select" value={form.showroom} onChange={e => updateForm("showroom", e.target.value)}>
                        <option value="">Choose nearest location</option>
                        {showrooms.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>
                        Preferred Date <span style={{ color:BRAND.gold }}>*</span>
                      </label>
                      <input type="date" className="sp-input" value={form.date}
                        onChange={e => updateForm("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]} />
                    </div>

                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:8 }}>
                        Preferred Time <span style={{ color:BRAND.gold }}>*</span>
                      </label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                        {timeslots.map(t => (
                          <button key={t} type="button" onClick={() => updateForm("time", t)}
                            style={{ padding:"8px 4px", fontSize:11, cursor:"pointer",
                              border:`1px solid ${form.time === t ? BRAND.gold : "rgba(255,255,255,0.12)"}`,
                              background:form.time === t ? BRAND.gold : "rgba(255,255,255,0.05)",
                              color:form.time === t ? BRAND.navy : "rgba(255,255,255,0.65)",
                              borderRadius:2, fontFamily:"'Jost',sans-serif",
                              fontWeight:form.time === t ? 600 : 400, transition:"all 0.15s" }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {apptErr && (
                      <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:2, padding:"9px 12px", fontSize:12, color:"#e57373" }}>
                        ⚠️ {apptErr}
                      </div>
                    )}

                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <button className="sp-btn-outline" onClick={() => setStep(1)}
                        style={{ flex:1, padding:"12px", fontSize:12, borderRadius:2 }}>
                        ← Back
                      </button>
                      <button className="sp-btn-gold" onClick={handleSubmit}
                        disabled={!canProceed2 || loading}
                        style={{ flex:2, padding:"12px", fontSize:12, borderRadius:2 }}>
                        {loading ? <><span className="sp-spin" />Confirming…</> : "Confirm Booking ✓"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ─── SERVICE PROCESS ─── */}
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:16 }}>Our Service Process</div>
            <h3 className="cormorant" style={{ fontSize:32, color:BRAND.navyMid, marginBottom:28 }}>What to Expect</h3>
            {processSteps.map((s, i) => (
              <div key={s.title} style={{ display:"flex", gap:16, marginBottom:20, padding:"16px 20px", background:BRAND.offWhite, border:"1px solid rgba(0,0,0,0.05)", animation:`sp-fadeUp 0.5s ease ${i*0.08}s both` }}>
                <div style={{ width:36, height:36, background:BRAND.navyMid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Step {i + 1}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:BRAND.navyMid, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:BRAND.muted }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ background:BRAND.navyMid, padding:"20px 24px", display:"flex", gap:16, alignItems:"center" }}>
              <span style={{ fontSize:28 }}>📱</span>
              <div>
                <div style={{ fontSize:13, color:BRAND.white, fontWeight:600, marginBottom:4 }}>Track your service live</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Get real-time WhatsApp updates at every stage of your vehicle's service.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Service Packages ── */}
      <div style={{ background:BRAND.offWhite, padding:"60px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:12 }}>
            <h2 className="cormorant" style={{ fontSize:36, color:BRAND.navyMid }}>Standard Service Packages</h2>
            <p style={{ fontSize:13, color:BRAND.muted, marginTop:8 }}>
              Click <strong>Book This</strong> to open a quick booking form — your details go directly to our service team.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:40 }}>
            {servicePackages.map(pkg => (
              <div key={pkg.km} style={{ background:pkg.highlight ? BRAND.navyMid : BRAND.white, border:`1px solid ${pkg.highlight ? BRAND.gold : "rgba(0,0,0,0.06)"}`, padding:"24px 20px", position:"relative" }}>
                {pkg.highlight && (
                  <div style={{ position:"absolute", top:-1, left:-1, right:-1, height:3, background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight})` }} />
                )}
                <div className="cormorant" style={{ fontSize:28, fontWeight:600, color:pkg.highlight ? BRAND.gold : BRAND.navyMid, marginBottom:4 }}>{pkg.km}</div>
                <div style={{ fontSize:12, color:pkg.highlight ? "rgba(255,255,255,0.5)" : BRAND.muted, marginBottom:16, letterSpacing:"0.05em" }}>{pkg.label}</div>
                {pkg.items.map(item => (
                  <div key={item} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid rgba(${pkg.highlight ? "255,255,255" : "0,0,0"},0.06)`, alignItems:"center" }}>
                    <span style={{ color:BRAND.gold, fontSize:12 }}>›</span>
                    <span style={{ fontSize:12, color:pkg.highlight ? "rgba(255,255,255,0.7)" : BRAND.muted }}>{item}</span>
                  </div>
                ))}
                <div className="cormorant" style={{ fontSize:22, color:pkg.highlight ? BRAND.gold : BRAND.navyMid, fontWeight:600, marginTop:16, marginBottom:12 }}>{pkg.price}</div>
                <button
                  className={pkg.highlight ? "sp-btn-gold" : "sp-btn-outline"}
                  onClick={() => setPopupPkg(pkg)}
                  style={{ width:"100%", padding:"10px", fontSize:11, borderRadius:2 }}
                >
                  Book This
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
