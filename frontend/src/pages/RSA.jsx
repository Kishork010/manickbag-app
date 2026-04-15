import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const TOLL_FREE = "18002098282";

const PageStyles = () => (
  <style>{`
    @keyframes rsa-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes rsa-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes rsa-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes rsa-modalIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

    .rsa-fadeUp { animation: rsa-fadeUp 0.7s ease forwards; }
    .rsa-fadeIn { animation: rsa-fadeIn 0.6s ease forwards; }

    .rsa-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; position:relative; overflow:hidden; }
    .rsa-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .rsa-btn-gold:hover::before { opacity:1; }
    .rsa-btn-gold span { position:relative; z-index:1; }
    .rsa-btn-gold:disabled { opacity:0.55; cursor:not-allowed; }

    .rsa-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .rsa-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .rsa-service-card { transition:all 0.3s ease; }
    .rsa-service-card:hover { border-color:#b8963e !important; transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }

    .rsa-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.72); z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(4px); }
    .rsa-modal-box { background:#fff; border-radius:4px; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; animation: rsa-modalIn 0.35s ease forwards; box-shadow:0 40px 120px rgba(0,0,0,0.4); }

    .rsa-input { width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,0.15); border-radius:2px; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; box-sizing:border-box; transition:border-color 0.2s; }
    .rsa-input:focus { border-color:#b8963e; }
    .rsa-select { width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,0.15); border-radius:2px; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; box-sizing:border-box; cursor:pointer; background:#fff; }
    .rsa-select:focus { border-color:#b8963e; }
    .rsa-label { font-size:11px; font-weight:600; letter-spacing:0.08em; color:#6b7280; text-transform:uppercase; margin-bottom:5px; display:block; }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ══════════════════════════════════════════════════════════════════
//  RSA ENQUIRY MODAL (shared across all buttons)
// ══════════════════════════════════════════════════════════════════
const RSAModal = ({ planName, onClose }) => {
  const [form, setForm]     = useState({ name:"", phone:"", email:"", city:"", vehicle_model:"", registration_no:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg]       = useState("");

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim())                   return setMsg("Name is required");
    if (!/^\d{10}$/.test(form.phone.trim())) return setMsg("Enter a valid 10-digit phone number");
    setStatus("loading"); setMsg("");
    try {
      const res  = await fetch("/api/rsa_enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan_name: planName || "General RSA Enquiry" }),
      });
      const data = await res.json();
      if (data.success) { setStatus("success"); setMsg(data.message); }
      else              { setStatus("error");   setMsg(data.error || "Something went wrong."); }
    } catch {
      setStatus("error"); setMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="rsa-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rsa-modal-box">

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding:"28px 32px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:8 }}>
                RSA Plan Enquiry
              </div>
              <h3 className="cormorant" style={{ fontSize:26, fontWeight:700, color:BRAND.white, margin:0 }}>
                {planName ? planName : "Roadside Assistance"}
              </h3>
              {planName && (
                <div style={{ marginTop:8, display:"inline-block", background:"rgba(184,150,62,0.15)", border:`1px solid ${BRAND.borderLight}`, color:BRAND.gold, fontSize:12, padding:"4px 12px", borderRadius:2 }}>
                  Selected Plan: {planName}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:24, cursor:"pointer", lineHeight:1, padding:0 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"32px" }}>
          {status === "success" ? (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
              <h4 style={{ color:BRAND.navyMid, fontSize:20, marginBottom:10 }}>Enquiry Submitted!</h4>
              <p style={{ color:BRAND.muted, fontSize:14, lineHeight:1.8 }}>
                {msg}<br />Our team will contact you shortly.
              </p>
              <p style={{ color:BRAND.muted, fontSize:13, marginTop:12 }}>
                For immediate help call: <strong style={{ color:BRAND.navyMid }}>📞 1800 209 8282</strong>
              </p>
              <button className="rsa-btn-gold" onClick={onClose} style={{ marginTop:24, padding:"12px 32px", fontSize:12, borderRadius:2 }}>
                <span>Close</span>
              </button>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {/* Full Name */}
                <div>
                  <label className="rsa-label">Full Name *</label>
                  <input className="rsa-input" type="text" name="name" value={form.name} onChange={change} placeholder="Your full name" />
                </div>
                {/* Phone */}
                <div>
                  <label className="rsa-label">Phone *</label>
                  <input className="rsa-input" type="tel" name="phone" value={form.phone} onChange={change} placeholder="10-digit mobile number" />
                </div>
                {/* Email */}
                <div>
                  <label className="rsa-label">Email</label>
                  <input className="rsa-input" type="email" name="email" value={form.email} onChange={change} placeholder="your@email.com" />
                </div>
                {/* City */}
                <div>
                  <label className="rsa-label">City</label>
                  <select className="rsa-select" name="city" value={form.city} onChange={change}>
                    <option value="">Select city</option>
                    {["Belgaum","Hubbli","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {/* Vehicle Model */}
                <div>
                  <label className="rsa-label">Vehicle Model</label>
                  <input className="rsa-input" type="text" name="vehicle_model" value={form.vehicle_model} onChange={change} placeholder="e.g. Nexon, Safari, Harrier" />
                </div>
                {/* Registration No */}
                <div>
                  <label className="rsa-label">Registration No.</label>
                  <input className="rsa-input" type="text" name="registration_no" value={form.registration_no} onChange={change} placeholder="e.g. KA 05 AB 1234" />
                </div>
                {/* Message — full width */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <label className="rsa-label">Message (Optional)</label>
                  <textarea className="rsa-input" name="message" value={form.message} onChange={change} placeholder="Any specific questions or requirements..." rows={3} style={{ resize:"vertical" }} />
                </div>
              </div>

              {/* Error message */}
              {msg && (
                <div style={{ marginTop:14, fontSize:13, color: status==="error"?"#dc2626":BRAND.muted, padding:"10px 14px", background: status==="error"?"rgba(220,38,38,0.06)":"transparent", borderRadius:2 }}>
                  {status==="error" ? "⚠ " : ""}{msg}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                <button className="rsa-btn-gold" onClick={submit} disabled={status==="loading"} style={{ flex:1, padding:"14px", fontSize:13, borderRadius:2 }}>
                  <span>{status==="loading" ? "Submitting…" : "Submit Enquiry"}</span>
                </button>
                <button className="rsa-btn-outline" onClick={onClose} style={{ padding:"14px 24px", fontSize:12, borderRadius:2 }}>Cancel</button>
              </div>

              <div style={{ marginTop:14, textAlign:"center", fontSize:12, color:BRAND.muted }}>
                For immediate breakdown help: <strong>📞 1800 209 8282</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Hero ──────────────────────────────────────────────────────────
const Hero = ({ onBuyRSA }) => (
  <section style={{ minHeight:"60vh", background:`linear-gradient(135deg,#050f1f 0%,${BRAND.navyMid} 50%,#0a1f40 100%)`, display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", right:"12%", top:"50%", transform:"translateY(-50%)" }}>
      {[300,220,140].map((s,i) => (
        <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:s, height:s, borderRadius:"50%", border:`1px solid rgba(184,150,62,${0.06+i*0.04})`, animation:`rsa-pulse ${3+i}s ease-in-out infinite`, animationDelay:`${i*0.8}s` }} />
      ))}
      <div style={{ position:"relative", width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, zIndex:1 }}>📡</div>
    </div>
    {[...Array(5)].map((_,i) => (
      <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.3, left:`${10+i*15}%`, top:`${20+(i%3)*20}%`, animation:`rsa-pulse ${2+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
    ))}

    <div style={{ ...W, paddingTop:80, paddingBottom:80 }}>
      <div className="rsa-fadeIn" style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32, opacity:0, animationDelay:"0.1s" }}>
        <Link to="/" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", letterSpacing:"0.08em" }}>Home</Link>
        <span style={{ color:"rgba(255,255,255,0.25)" }}>›</span>
        <Link to="/services" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", letterSpacing:"0.08em" }}>Services</Link>
        <span style={{ color:"rgba(255,255,255,0.25)" }}>›</span>
        <span style={{ fontSize:12, color:BRAND.gold, letterSpacing:"0.08em" }}>Roadside Assistance</span>
      </div>
      <div className="rsa-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:24, opacity:0, animationDelay:"0.15s" }}>
        <div style={{ width:32, height:1, background:BRAND.gold }} />
        <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>24 × 7 On-Road Assistance</span>
      </div>
      <h1 className="cormorant rsa-fadeUp" style={{ fontSize:"clamp(44px,6vw,80px)", fontWeight:300, lineHeight:1.1, color:BRAND.white, maxWidth:660, animationDelay:"0.2s", opacity:0 }}>
        Roadside<br /><span className="gold-shimmer">Assistance</span><br />Anywhere in India
      </h1>
      <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
      <p className="rsa-fadeUp" style={{ fontSize:17, lineHeight:1.8, color:"rgba(255,255,255,0.65)", maxWidth:540, marginBottom:40, animationDelay:"0.4s", opacity:0 }}>
        In partnership with TVS Auto Assist — immediate and hassle-free support in the event of any car breakdown. Cities, highways, or hilly terrain.
      </p>
      <div className="rsa-fadeUp" style={{ display:"flex", gap:16, animationDelay:"0.5s", opacity:0 }}>
        {/* Toll-free → direct call */}
        <a href={`tel:${TOLL_FREE}`} style={{ textDecoration:"none" }}>
          <button className="rsa-btn-gold" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>
            <span>📞 1800 209 8282</span>
          </button>
        </a>
        {/* Buy RSA Plan → opens modal */}
        <button className="rsa-btn-outline" onClick={onBuyRSA} style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>
          Buy RSA Plan
        </button>
      </div>
      <div className="rsa-fadeUp" style={{ display:"flex", gap:48, marginTop:64, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animationDelay:"0.6s", opacity:0 }}>
        {[{ v:"24×7", l:"Always Available" },{ v:"800+", l:"Service Points" },{ v:"30 Min", l:"Avg Response" },{ v:"Free", l:"Within Warranty" }].map(s => (
          <div key={s.l}>
            <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:11, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Services Grid ─────────────────────────────────────────────────
const rsaServices = [
  { icon:"🚗", title:"Towing Assistance",    desc:"Car-to-car towing or flatbed to nearest authorised Tata dealer workshop. Available for mechanical breakdowns, accidents & key-lost cases." },
  { icon:"🔋", title:"Battery Jump Start",    desc:"Immediate battery jump-start in case of a rundown battery. TVS Auto Assist bears labour & conveyance charges." },
  { icon:"⛽", title:"Fuel Delivery",         desc:"Up to 5 litres of emergency fuel arranged at your breakdown location. Based on local availability." },
  { icon:"🔑", title:"Key Lockout",           desc:"Expert support to help you regain access to your vehicle in case of key lockout situations." },
  { icon:"🔧", title:"On-Site Repair",        desc:"Nearest Authorised Service Provider dispatched to diagnose & fix the problem on the spot wherever possible." },
  { icon:"🛞", title:"Flat Tyre Assistance",  desc:"Replacement of flat tyre with spare tyre, or tyre repair if spare is unavailable — based on location." },
  { icon:"👩", title:"Women Assist Program",  desc:"Dedicated assistance for women drivers from 8 PM to 5 AM. End-to-end follow-up with family notification." },
  { icon:"📍", title:"Location Tracking",     desc:"We track your GPS location and dispatch the nearest ASP immediately — no need to explain where you are." },
];

const ServicesGrid = () => (
  <section style={{ background:BRAND.offWhite, padding:"100px 0" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>What We Provide</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>RSA Services Covered</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
        {rsaServices.map((s,i) => (
          <div key={s.title} className="rsa-service-card" style={{ background:BRAND.white, padding:"36px 28px", border:"1px solid rgba(0,0,0,0.05)", cursor:"default", animation:`rsa-fadeUp 0.5s ease ${i*0.08}s both` }}>
            <div style={{ fontSize:36, marginBottom:18 }}>{s.icon}</div>
            <h3 className="cormorant" style={{ fontSize:20, fontWeight:600, color:BRAND.navyMid, marginBottom:10 }}>{s.title}</h3>
            <p style={{ fontSize:13, lineHeight:1.7, color:BRAND.muted }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Plans ─────────────────────────────────────────────────────────
const RSAPlans = ({ onSelectPlan }) => (
  <section style={{ background:BRAND.navyMid, padding:"100px 0", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", right:-80, top:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }} />
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>RSA Plans</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.white }}>Choose Your Coverage</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        {[
          {
            name:"Within Warranty", badge:"Complimentary", highlight:false,
            features:["Free mechanical breakdown towing","Car-to-car or winch & tow","Nearest Tata Authorised Workshop","Covers non-accident cases only","Automatically applicable"],
            btnLabel:"Enquire Now",
          },
          {
            name:"Premium Plan", badge:"Post-Warranty", highlight:true,
            features:["One free towing instance","24×7 availability","All RSA services included","Women Assist Program","Pan-India coverage","Available at any Tata workshop"],
            btnLabel:"Get Premium RSA",
          },
          {
            name:"Standard Plan", badge:"Annual Policy", highlight:false,
            features:["All RSA services on-demand","Fuel delivery (5 litres)","Battery jump-start","Key lockout assistance","Flat tyre support","Can be renewed annually"],
            btnLabel:"Learn More",
          },
        ].map((p,i) => (
          <div key={p.name} style={{ background:p.highlight?`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`:"rgba(255,255,255,0.05)", border:`1px solid ${p.highlight?"transparent":BRAND.borderLight}`, padding:"36px 28px", transition:"transform 0.3s", animation:`rsa-fadeUp 0.5s ease ${i*0.15}s both` }}>
            <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:p.highlight?BRAND.navy:BRAND.gold, fontWeight:600, marginBottom:8 }}>{p.badge}</div>
            <h3 className="cormorant" style={{ fontSize:26, fontWeight:700, color:p.highlight?BRAND.navy:BRAND.white, marginBottom:24 }}>{p.name}</h3>
            <ul style={{ listStyle:"none", marginBottom:28, padding:0 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:13, color:p.highlight?BRAND.navyMid:"rgba(255,255,255,0.7)", marginBottom:12, display:"flex", gap:8 }}>
                  <span style={{ color:p.highlight?BRAND.navyMid:BRAND.gold, fontWeight:700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            {/* Each plan button opens modal with plan name */}
            <button
              onClick={() => onSelectPlan(p.name)}
              style={{ width:"100%", padding:"12px", fontSize:11, borderRadius:2, background:p.highlight?BRAND.navy:"linear-gradient(135deg,#b8963e,#d4af5a)", color:p.highlight?BRAND.gold:BRAND.navy, border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.3s" }}>
              {p.btnLabel}
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.3)", marginTop:32 }}>
        Note: RSA services can be availed 48 hours after policy purchase. Not available in certain NE states, J&K, Andaman & Nicobar, and Lakshadweep.
      </p>
    </div>
  </section>
);

// ── Response Times ────────────────────────────────────────────────
const ResponseTimes = () => (
  <section style={{ background:"#fff", padding:"100px 0" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Response Times</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>How Quickly We Reach You</h2>
        <p style={{ fontSize:15, color:BRAND.muted, marginTop:12 }}>Indicative response times — actual time will be confirmed by our call centre at the time of breakdown.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {[
          { location:"Metro Cities",   time:"Within 30 mins", icon:"🏙️", desc:"Delhi, Mumbai, Bengaluru, Chennai, Hyderabad & other major metros." },
          { location:"Tier 2 Cities",  time:"Within 60 mins", icon:"🌆", desc:"Hubli, Dharwad, Gulbarga, Bidar, Belgaum & comparable cities." },
          { location:"Highway / Rural",time:"Within 90 mins", icon:"🛣️", desc:"National highways, state highways, and semi-rural stretches." },
        ].map((r,i) => (
          <div key={r.location} style={{ background:BRAND.offWhite, padding:"40px 32px", borderBottom:`4px solid ${BRAND.gold}`, animation:`rsa-fadeUp 0.5s ease ${i*0.15}s both` }}>
            <div style={{ fontSize:40, marginBottom:16 }}>{r.icon}</div>
            <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.muted, marginBottom:8 }}>{r.location}</div>
            <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.navyMid, marginBottom:12 }}>{r.time}</div>
            <p style={{ fontSize:13, lineHeight:1.7, color:BRAND.muted }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────
const CTA = ({ onBuyRSA }) => (
  <section style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"80px 0" }}>
    <div style={{ ...W, textAlign:"center" }}>
      <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:300, color:BRAND.white, marginBottom:16 }}>
        Stuck on the Road? We've Got You.
      </h2>
      <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", marginBottom:40, maxWidth:460, margin:"0 auto 40px" }}>
        Call our toll-free helpline or visit a Manickbag showroom to activate your RSA plan.
      </p>
      <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
        {/* Toll-free → direct call */}
        <a href={`tel:${TOLL_FREE}`} style={{ textDecoration:"none" }}>
          <button className="rsa-btn-gold" style={{ padding:"16px 40px", fontSize:14, borderRadius:2 }}>
            <span>📞 Toll-Free: 1800 209 8282</span>
          </button>
        </a>
        {/* Buy RSA Plan → same modal as hero */}
        <button className="rsa-btn-outline" onClick={onBuyRSA} style={{ padding:"16px 40px", fontSize:13, borderRadius:2 }}>
          Buy RSA Plan
        </button>
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════
export default function RSA() {
  // modal state: null = closed | string = plan name (or "" for general)
  const [modal, setModal] = useState(null);

  const openGeneral = ()     => setModal("General RSA Enquiry");
  const openPlan    = (name) => setModal(name);
  const closeModal  = ()     => setModal(null);

  return (
    <Layout>
      <PageStyles />
      <Hero        onBuyRSA={openGeneral} />
      <ServicesGrid />
      <RSAPlans    onSelectPlan={openPlan} />
      <ResponseTimes />
      <CTA         onBuyRSA={openGeneral} />

      {/* Shared Modal */}
      {modal !== null && (
        <RSAModal
          planName={modal}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
}