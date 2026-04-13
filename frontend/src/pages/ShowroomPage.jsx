import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { OUTLETS, CITY_NAV } from "./showroomData";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const ShowroomStyles = () => (
  <style>{`
    @keyframes sp-fadeUp    { from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);} }
    @keyframes sp-fadeIn    { from{opacity:0;}to{opacity:1;} }
    @keyframes sp-pulse     { 0%,100%{opacity:1;}50%{opacity:0.5;} }
    @keyframes sp-ticker    { from{transform:translateX(0);}to{transform:translateX(-50%);} }
    @keyframes sp-slideLeft { from{transform:translateX(40px);opacity:0;}to{transform:translateX(0);opacity:1;} }
    @keyframes sp-modalIn   { from{opacity:0;transform:translateY(30px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }

    .sp-anim-fadeUp { animation:sp-fadeUp  0.7s ease forwards; }
    .sp-anim-fadeIn { animation:sp-fadeIn  0.6s ease forwards; }

    .sp-ticker-inner { display:flex; white-space:nowrap; animation:sp-ticker 30s linear infinite; }
    .sp-ticker-inner:hover { animation-play-state:paused; }

    .sp-hero-slide { position:absolute; inset:0; transition:opacity 0.8s ease; }

    .sp-card-hover { transition:transform 0.4s ease,box-shadow 0.4s ease; }
    .sp-card-hover:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.12); }

    .sp-gold-line { width:60px; height:2px; background:linear-gradient(90deg,#b8963e,transparent); }

    .sp-gold-shimmer {
      background:linear-gradient(90deg,#b8963e 0%,#f0e4c2 40%,#b8963e 60%,#d4af5a 100%);
      background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text; animation:shimmer 4s linear infinite;
    }
    @keyframes shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }

    .sp-btn-gold {
      background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628;
      border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600;
      letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s ease;
      position:relative; overflow:hidden;
    }
    .sp-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .sp-btn-gold:hover::before { opacity:1; }
    .sp-btn-gold span { position:relative; z-index:1; }
    .sp-btn-gold:disabled { opacity:0.55; cursor:not-allowed; }

    .sp-btn-outline {
      background:transparent; border:1px solid #b8963e; color:#b8963e;
      cursor:pointer; font-family:'Jost',sans-serif; font-weight:500;
      letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s ease;
    }
    .sp-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .sp-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.72); z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(4px); }
    .sp-modal-box { background:#fff; border-radius:4px; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; animation:sp-modalIn 0.35s ease forwards; box-shadow:0 40px 120px rgba(0,0,0,0.4); }

    .sp-input { width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,0.15); border-radius:2px; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; box-sizing:border-box; transition:border-color 0.2s; }
    .sp-input:focus { border-color:#b8963e; }
    .sp-select { width:100%; padding:12px 14px; border:1px solid rgba(0,0,0,0.15); border-radius:2px; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; box-sizing:border-box; cursor:pointer; background:#fff; }
    .sp-select:focus { border-color:#b8963e; }
    .sp-label { font-size:11px; font-weight:600; letter-spacing:0.08em; color:#6b7280; text-transform:uppercase; margin-bottom:5px; display:block; }
  `}</style>
);

const W = { width:"100%", padding:"0 48px" };

// ── City → Google Maps URL ────────────────────────────────────────
const getMapUrl = (city) =>
  `https://www.google.com/maps/search/Manickbag+Tata+Motors+${encodeURIComponent(city)}`;

// ══════════════════════════════════════════════════════════════════
//  SHARED ENQUIRY MODAL
// ══════════════════════════════════════════════════════════════════
const EnquiryModal = ({ title, subtitle, outlet, extraFields = [], onClose }) => {
  const [form, setForm]     = useState({ name:"", phone:"", email:"", city: outlet?.city || "", vehicle_model:"", message:"", ...Object.fromEntries(extraFields.map(f => [f.name, ""])) });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg]       = useState("");

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim())                   return setMsg("Name is required");
    if (!/^\d{10}$/.test(form.phone.trim())) return setMsg("Enter a valid 10-digit phone number");
    setStatus("loading"); setMsg("");
    try {
      const res  = await fetch("/api/showroom_enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          outlet_name: outlet?.outletName || "",
          outlet_city: outlet?.city       || "",
          enquiry_type: title,
        }),
      });
      const data = await res.json();
      if (data.success) { setStatus("success"); setMsg(data.message); }
      else              { setStatus("error");   setMsg(data.error || "Something went wrong."); }
    } catch {
      setStatus("error"); setMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal-box">
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding:"28px 32px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:8 }}>{subtitle}</div>
              <h3 className="cormorant" style={{ fontSize:26, fontWeight:700, color:BRAND.white, margin:0 }}>{title}</h3>
              {outlet && (
                <div style={{ marginTop:8, fontSize:12, color:"rgba(255,255,255,0.45)" }}>
                  {outlet.outletName} · {outlet.city}
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
              <h4 style={{ color:BRAND.navyMid, fontSize:20, marginBottom:10 }}>Submitted Successfully!</h4>
              <p style={{ color:BRAND.muted, fontSize:14, lineHeight:1.8 }}>{msg}<br />Our team will contact you shortly.</p>
              <button className="sp-btn-gold" onClick={onClose} style={{ marginTop:24, padding:"12px 32px", fontSize:12, borderRadius:2 }}><span>Close</span></button>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {/* Default fields */}
                <div>
                  <label className="sp-label">Full Name *</label>
                  <input className="sp-input" type="text" name="name" value={form.name} onChange={change} placeholder="Your full name" />
                </div>
                <div>
                  <label className="sp-label">Phone *</label>
                  <input className="sp-input" type="tel" name="phone" value={form.phone} onChange={change} placeholder="10-digit mobile" />
                </div>
                <div>
                  <label className="sp-label">Email</label>
                  <input className="sp-input" type="email" name="email" value={form.email} onChange={change} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="sp-label">City</label>
                  <input className="sp-input" type="text" name="city" value={form.city} onChange={change} placeholder="Your city" readOnly={!!outlet?.city} style={{ background: outlet?.city ? "#f9f9f9" : "#fff" }} />
                </div>

                {/* Extra fields (e.g. vehicle model, preferred date for test drive) */}
                {extraFields.map(f => (
                  <div key={f.name} style={{ gridColumn: f.fullWidth ? "1 / -1" : "auto" }}>
                    <label className="sp-label">{f.label}</label>
                    {f.type === "select" ? (
                      <select className="sp-select" name={f.name} value={form[f.name]} onChange={change}>
                        <option value="">Select {f.label.toLowerCase()}</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input className="sp-input" type={f.type || "text"} name={f.name} value={form[f.name]} onChange={change} placeholder={f.placeholder || ""} />
                    )}
                  </div>
                ))}

                {/* Message */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <label className="sp-label">Message (Optional)</label>
                  <textarea className="sp-input" name="message" value={form.message} onChange={change} placeholder="Any specific questions or requirements..." rows={3} style={{ resize:"vertical" }} />
                </div>
              </div>

              {msg && (
                <div style={{ marginTop:14, fontSize:13, color: status==="error"?"#dc2626":BRAND.muted, padding:"10px 14px", background: status==="error"?"rgba(220,38,38,0.06)":"transparent", borderRadius:2 }}>
                  {status==="error" ? "⚠ " : ""}{msg}
                </div>
              )}

              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                <button className="sp-btn-gold" onClick={submit} disabled={status==="loading"} style={{ flex:1, padding:"14px", fontSize:13, borderRadius:2 }}>
                  <span>{status==="loading" ? "Submitting…" : "Submit"}</span>
                </button>
                <button className="sp-btn-outline" onClick={onClose} style={{ padding:"14px 24px", fontSize:12, borderRadius:2 }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Vehicle data ──────────────────────────────────────────────────
const vehicles = [
  { name:"Tiago",       category:"Hatchback", fuel:"Petrol",   tag:"Budget Friendly", color:"#64b5f6", image:"https://www.manickbag.in/images/tiago.jpg" },
  { name:"Tiago EV",    category:"Hatchback", fuel:"Electric", tag:"City EV",         color:"#00e676", image:"https://www.manickbag.in/images/tiago_ev.avif" },
  { name:"Altroz",      category:"Hatchback", fuel:"Petrol",   tag:"Stylish",         color:"#f48fb1", image:"https://www.manickbag.in/images/altroz.jpg" },
  { name:"Tigor",       category:"Sedan",     fuel:"Petrol",   tag:"Compact Sedan",   color:"#9575cd", image:"https://www.manickbag.in/images/tigor.jpg" },
  { name:"Tigor EV",    category:"Sedan",     fuel:"Electric", tag:"Fleet Favorite",  color:"#00e676", image:"https://www.manickbag.in/images/tigor_ev.avif" },
  { name:"Punch",       category:"SUV",       fuel:"Petrol",   tag:"5-Star Safety",   color:"#ffca28", image:"https://www.manickbag.in/images/Punch.png" },
  { name:"Punch EV",    category:"SUV",       fuel:"Electric", tag:"New Launch",      color:"#00e676", image:"https://www.manickbag.in/images/punch_ev.avif" },
  { name:"Nexon",       category:"SUV",       fuel:"Petrol",   tag:"Top Seller",      color:"#ff8a65", image:"https://www.manickbag.in/images/naxon.avif" },
  { name:"Nexon EV",    category:"SUV",       fuel:"Electric", tag:"Best Seller",     color:"#4fc3f7", image:"https://www.manickbag.in/images/nexon_ev.avif" },
  { name:"Harrier",     category:"UV",        fuel:"Petrol",   tag:"Flagship",        color:"#ce93d8", image:"https://www.manickbag.in/images/harrier.avif" },
  { name:"Harrier EV",  category:"UV",        fuel:"Electric", tag:"Upcoming",        color:"#00e676", image:"https://www.manickbag.in/images/harrier_ev.webp" },
  { name:"Safari",      category:"UV",        fuel:"Petrol",   tag:"Premium",         color:"#b8963e", image:"https://www.manickbag.in/images/safari.avif" },
  { name:"Curvv",       category:"Coupe",     fuel:"Petrol",   tag:"Upcoming",        color:"#90caf9", image:"https://www.manickbag.in/images/curvv.avif" },
  { name:"Curvv EV",    category:"Coupe",     fuel:"Electric", tag:"Future EV",       color:"#00e676", image:"https://www.manickbag.in/images/curvv_ev.avif" },
  { name:"Sierra",      category:"SUV",       fuel:"Petrol",   tag:"Concept",         color:"#a1887f", image:"https://www.manickbag.in/images/sierra2.avif" },
  { name:"Xpress T",    category:"Sedan",     fuel:"Petrol",   tag:"Future Concept",  color:"#ce93d8", image:"https://www.manickbag.in/images/express t pv.avif" },
  { name:"Xpress T EV", category:"Sedan",     fuel:"Electric", tag:"Future Concept",  color:"#00e676", image:"https://www.manickbag.in/images/xpress t ev.avif" },
];

const stats_global = [
  { value:"62+",  label:"Years of Excellence" },
  { value:"12+",  label:"Showrooms" },
  { value:"50K+", label:"Happy Families" },
  { value:"3",    label:"States Served" },
];

// ══════════════════════════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════════════════════════
const Hero = ({ outlet, onBookTestDrive, onEnquire }) => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const slides = outlet.heroSlides;
  const slide  = slides[current];

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
      setAnimKey(k => k + 1);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section style={{ height:"100vh", minHeight:700, position:"relative", overflow:"hidden", width:"100%" }}>
      {slides.map((_, i) => (
        <div key={i} className="sp-hero-slide" style={{ opacity:i===current?1:0 }}>
          <img src={outlet.heroImage} alt={outlet.outletName} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
          <div style={{ position:"absolute", inset:0, background:outlet.gradient, opacity:0.84 }} />
        </div>
      ))}

      <div style={{ position:"absolute", right:"8%", top:"15%", width:420, height:420, border:"1px solid rgba(184,150,62,0.08)", borderRadius:"30%", transform:"rotate(15deg)" }} />
      <div style={{ position:"absolute", right:"12%", top:"20%", width:300, height:300, border:"1px solid rgba(184,150,62,0.15)", borderRadius:"30%", transform:"rotate(30deg)" }} />
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.3, left:`${15+i*10}%`, top:`${20+(i%3)*25}%`, animation:`sp-pulse ${2+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
      ))}

      <div style={{ position:"absolute", right:40, top:"50%", transform:"translateY(-50%) rotate(90deg)", fontSize:10, letterSpacing:"0.3em", color:"rgba(184,150,62,0.5)", textTransform:"uppercase", whiteSpace:"nowrap" }}>
        {outlet.city} · {outlet.outletName} · Karnataka
      </div>

      <div style={{ position:"relative", zIndex:2, width:"100%", padding:"0 48px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div key={`tag-${animKey}`} className="sp-anim-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:28, animationDelay:"0.1s", opacity:0 }}>
          <div style={{ width:32, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>{slide.tag}</span>
        </div>

        <h1 key={`h1-${animKey}`} className="cormorant sp-anim-fadeUp" style={{ fontSize:"clamp(48px,7vw,88px)", fontWeight:300, lineHeight:1.1, color:BRAND.white, maxWidth:700, animationDelay:"0.2s", opacity:0, whiteSpace:"pre-line" }}>
          {slide.headline}
        </h1>

        <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />

        <p key={`sub-${animKey}`} className="sp-anim-fadeUp" style={{ fontSize:16, lineHeight:1.7, color:"rgba(255,255,255,0.65)", maxWidth:520, marginBottom:40, animationDelay:"0.4s", opacity:0 }}>
          {slide.sub}
        </p>

        <div key={`btns-${animKey}`} className="sp-anim-fadeUp" style={{ display:"flex", gap:16, flexWrap:"wrap", animationDelay:"0.5s", opacity:0 }}>
          {/* CTA → opens enquiry modal */}
          <button className="sp-btn-gold" onClick={onEnquire} style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>
            <span>{slide.cta}</span>
          </button>
          {/* Phone → direct call */}
          <a href={`tel:${outlet.phone}`} style={{ textDecoration:"none" }}>
            <button className="sp-btn-outline" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>📞 {outlet.phone}</button>
          </a>
          {/* WhatsApp → opens WA chat */}
          <a href={`https://wa.me/${outlet.whatsapp}?text=Hi, I'd like to know more about Tata vehicles at ${outlet.outletName}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <button style={{ padding:"14px 36px", fontSize:13, borderRadius:2, cursor:"pointer", background:"#25D366", color:"#fff", border:"none", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              💬 WhatsApp
            </button>
          </a>
        </div>

        <div key={`stats-${animKey}`} className="sp-anim-fadeUp" style={{ display:"flex", gap:48, marginTop:72, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animationDelay:"0.6s", opacity:0, flexWrap:"wrap" }}>
          {stats_global.map(s => (
            <div key={s.label}>
              <div className="cormorant" style={{ fontSize:40, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setAnimKey(k => k+1); }}
            style={{ width:i===current?32:8, height:3, border:"none", cursor:"pointer", background:i===current?BRAND.gold:"rgba(255,255,255,0.2)", transition:"all 0.4s ease", borderRadius:2 }} />
        ))}
      </div>
      <div style={{ position:"absolute", bottom:36, right:48, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", writingMode:"vertical-rl" }}>Scroll</div>
        <div style={{ width:1, height:48, background:`linear-gradient(${BRAND.gold},transparent)`, animation:"sp-pulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
};

// ── Ticker ────────────────────────────────────────────────────────
const Ticker = () => {
  const items = ["Tiago","Tigor","Altroz","Curvv","Nexon","Punch","Safari","Sierra","Harrier","Tiago EV","Tigor EV","Nexon EV","Punch EV","Curvv EV","Harrier EV"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background:`linear-gradient(90deg,${BRAND.gold} 0%,${BRAND.goldLight} 50%,${BRAND.gold} 100%)`, overflow:"hidden", padding:"12px 0", width:"100%" }}>
      <div className="sp-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding:"0 32px", fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.navy, display:"inline-flex", alignItems:"center", gap:16 }}>
            {item}<span style={{ opacity:0.4 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  VEHICLES SECTION
// ══════════════════════════════════════════════════════════════════
const VehiclesSection = ({ sectionRef, outlet, onTestDrive }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [fuelFilter,   setFuelFilter]   = useState("All");
  // selected vehicle for test drive modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filters   = ["All","Hatchback","Sedan","Coupe","SUV","UV"];
  const fuelTypes = ["All","Petrol","Diesel","iCNG","Electric"];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type   = params.get("type");
    if (type && filters.includes(type)) {
      setActiveFilter(type); setFuelFilter("All");
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
    } else if (!type) { setActiveFilter("All"); }
  }, [location.search]);

  const filtered = vehicles.filter(v =>
    (activeFilter === "All" || v.category === activeFilter) &&
    (fuelFilter   === "All" || v.fuel     === fuelFilter)
  );

  return (
    <section ref={sectionRef} id="vehicles" style={{ background:BRAND.offWhite, padding:"100px 0", width:"100%" }}>
      <div style={W}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:56 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div className="sp-gold-line" />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Our Fleet</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(36px,4vw,52px)", fontWeight:600, color:BRAND.navyMid, lineHeight:1.15 }}>
              {activeFilter === "All" ? "The Complete" : activeFilter}<br />
              {activeFilter === "All" ? "Tata Motors Range" : "Collection"}
            </h2>
          </div>
          <button onClick={() => { setActiveFilter("All"); setFuelFilter("All"); }}
            className="sp-btn-outline" style={{ padding:"12px 28px", fontSize:12, borderRadius:2, borderColor:BRAND.navyMid, color:BRAND.navyMid }}>
            View All Models
          </button>
        </div>

        {/* Category filters */}
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => { setActiveFilter(f); setFuelFilter("All"); }}
              style={{ padding:"8px 20px", fontSize:12, cursor:"pointer", borderRadius:2, background:activeFilter===f?BRAND.navyMid:"transparent", color:activeFilter===f?BRAND.white:BRAND.navyMid, border:`1px solid ${activeFilter===f?BRAND.navyMid:"rgba(10,31,63,0.2)"}` }}>
              {f}
            </button>
          ))}
        </div>

        {/* Fuel filters */}
        <div style={{ display:"flex", gap:8, marginBottom:30, flexWrap:"wrap" }}>
          {fuelTypes.map(f => (
            <button key={f} onClick={() => setFuelFilter(f)}
              style={{ padding:"6px 16px", fontSize:11, cursor:"pointer", borderRadius:2, letterSpacing:"0.08em", textTransform:"uppercase", background:fuelFilter===f?BRAND.gold:"transparent", color:fuelFilter===f?BRAND.navy:BRAND.navyMid, border:`1px solid ${fuelFilter===f?BRAND.gold:"rgba(0,0,0,0.2)"}`, transition:"all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
          {filtered.map((v, i) => (
            <div key={v.name} className="sp-card-hover"
              style={{ background:BRAND.white, border:"1px solid rgba(0,0,0,0.06)", overflow:"hidden", cursor:"pointer", animation:`sp-fadeUp 0.5s ease ${i*0.08}s both` }}>
              <div style={{ height:180, background:`linear-gradient(135deg,${BRAND.navyMid}15,${v.color}20)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                <img src={v.image} alt={v.name} style={{ width:"100%", height:"100%", objectFit:"contain", transition:"transform 0.4s ease" }}
                  onMouseOver={e => e.currentTarget.style.transform="scale(1.1)"}
                  onMouseOut={e  => e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position:"absolute", top:16, left:16, background:v.fuel==="Electric"?"#4fc3f7":BRAND.gold, color:BRAND.navy, fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"4px 10px", textTransform:"uppercase" }}>{v.tag}</div>
              </div>
              <div style={{ padding:"20px 24px" }}>
                <div style={{ fontSize:10, letterSpacing:"0.15em", color:BRAND.muted, textTransform:"uppercase", marginBottom:6 }}>{v.category}</div>
                <h3 style={{ fontSize:22, fontWeight:600, color:BRAND.navyMid, fontFamily:"'Cormorant Garamond',serif", marginBottom:16 }}>{v.name}</h3>
                <div style={{ display:"flex", gap:8 }}>
                  {/* Explore → opens test drive modal for this vehicle */}
                  <button style={{ flex:1, padding:"10px", fontSize:11, cursor:"pointer", background:BRAND.navyMid, color:BRAND.white, border:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", transition:"background 0.2s" }}
                    onClick={() => setSelectedVehicle(v.name)}
                    onMouseOver={e => e.currentTarget.style.background=BRAND.navyLight}
                    onMouseOut={e  => e.currentTarget.style.background=BRAND.navyMid}>
                    Explore
                  </button>
                  {/* EMI → navigate to Finance page with calculator */}
                  <button style={{ padding:"10px 14px", fontSize:11, cursor:"pointer", background:"transparent", color:BRAND.gold, border:`1px solid ${BRAND.gold}`, fontFamily:"'Jost',sans-serif", transition:"all 0.2s" }}
                    onClick={() => navigate("/finance#calculator")}
                    onMouseOver={e => { e.currentTarget.style.background=BRAND.gold; e.currentTarget.style.color=BRAND.navy; }}
                    onMouseOut={e  => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=BRAND.gold; }}>
                    EMI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Test Drive Modal */}
      {selectedVehicle && (
        <EnquiryModal
          title={`Book Test Drive — ${selectedVehicle}`}
          subtitle="Test Drive Request"
          outlet={outlet}
          extraFields={[
            { name:"preferred_date", label:"Preferred Date", type:"date", fullWidth:false },
            { name:"preferred_time", label:"Preferred Time", type:"select", options:["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"], fullWidth:false },
          ]}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  HERITAGE
// ══════════════════════════════════════════════════════════════════
const HeritageSection = ({ outlet }) => {
  const navigate = useNavigate();
  const milestones = [
    { year:"1962", event:"Manickbag Automobiles founded in Kalaburagi by the Shah & Mirji families." },
    { year:"1975", event:`${outlet.city} operations launched, bringing Tata Motors closer to this region.` },
    { year:"1992", event:"Highest sales recognition awarded by Tata Motors to Manickbag." },
    { year:"2008", event:"Crossed 10,000 cumulative vehicle deliveries across all outlets." },
    { year:"2015", event:"Digital service booking platform launched across all locations." },
    { year:"2022", event:`${outlet.outletName} expanded with a modern facility and a dedicated team.` },
  ];

  return (
    <section style={{ background:BRAND.navyMid, padding:"100px 0", position:"relative", overflow:"hidden", width:"100%" }}>
      <div style={{ position:"absolute", right:-100, top:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }} />
      <div style={W}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:60, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Our Heritage</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(36px,4vw,56px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:24 }}>
              Six Decades of<br /><span className="sp-gold-shimmer">Trust & Excellence</span>
            </h2>
            <p style={{ fontSize:16, lineHeight:1.8, color:"rgba(255,255,255,0.55)", marginBottom:32 }}>
              What began as a single showroom in Kalaburagi has grown into North Karnataka's most respected automotive institution. The {outlet.outletName} outlet carries that same legacy forward.
            </p>
            <p style={{ fontSize:16, lineHeight:1.8, color:"rgba(255,255,255,0.55)", marginBottom:40 }}>
              Across three generations of the Shah and Mirji families, we have served over 50,000 families with integrity, expertise, and genuine care.
            </p>
            {/* Read Our Story → navigate to /about or /heritage */}
            <button className="sp-btn-gold" onClick={() => navigate("/about")} style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>
              <span>Read Our Full Story</span>
            </button>
          </div>
          <div style={{ position:"relative", paddingLeft:32 }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:`linear-gradient(${BRAND.gold},transparent)` }} />
            {milestones.map((m, i) => (
              <div key={m.year} style={{ display:"flex", gap:24, marginBottom:32, animation:`sp-fadeUp 0.5s ease ${i*0.1}s both` }}>
                <div style={{ position:"relative", flexShrink:0, marginLeft:-40 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:i===0?BRAND.gold:"rgba(184,150,62,0.3)", border:`2px solid ${BRAND.gold}`, marginTop:4 }} />
                </div>
                <div>
                  <div className="cormorant" style={{ fontSize:24, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{m.year}</div>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginTop:4, lineHeight:1.6 }}>{m.event}</div>
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
const ServicesSection = ({ outlet }) => (
  <section style={{ background:"#ffffff", padding:"100px 0", width:"100%" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>What We Offer</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>Complete Ownership Experience</h2>
        <p style={{ fontSize:13, color:BRAND.muted, marginTop:10, letterSpacing:"0.05em" }}>At {outlet.outletName} · {outlet.city}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {outlet.services.map((s, i) => (
          <div key={s.title} className="sp-card-hover"
            style={{ background:BRAND.offWhite, padding:"40px 32px", cursor:"pointer", borderBottom:"2px solid transparent", transition:"border-color 0.3s", animation:`sp-fadeUp 0.5s ease ${i*0.1}s both` }}
            onMouseOver={e => e.currentTarget.style.borderBottomColor=BRAND.gold}
            onMouseOut={e  => e.currentTarget.style.borderBottomColor="transparent"}>
            <div style={{ fontSize:36, marginBottom:20 }}>{s.icon}</div>
            <h3 style={{ fontSize:18, fontWeight:600, color:BRAND.navyMid, fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>{s.title}</h3>
            <p style={{ fontSize:13, lineHeight:1.7, color:BRAND.muted }}>{s.desc}</p>
            <div style={{ marginTop:24, fontSize:12, color:BRAND.gold, letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:8 }}>Learn More <span>→</span></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  SHOWROOMS SECTION
// ══════════════════════════════════════════════════════════════════
const ShowroomsSection = ({ outlet, sectionRef }) => {
  const [hovered, setHovered] = useState(null);
  const siblings = outlet.siblings || [];

  return (
    <section ref={sectionRef} id="showrooms" style={{ background:BRAND.offWhite, padding:"100px 0", width:"100%" }}>
      <div style={W}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:64, alignItems:"start" }}>
          {/* Left panel */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div className="sp-gold-line" />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Find Us</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,3.5vw,48px)", fontWeight:600, color:BRAND.navyMid, lineHeight:1.2, marginBottom:24 }}>
              {outlet.outletName}<br />{outlet.city}
            </h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:BRAND.muted, marginBottom:24 }}>
              {outlet.tagline} — your trusted Tata Motors partner right here in {outlet.city}.
            </p>
            {[
              { icon:"📍", label:"Address", value:outlet.address },
              { icon:"📞", label:"Phone",   value:outlet.phone   },
              { icon:"✉️", label:"Email",   value:outlet.email   },
              { icon:"🕐", label:"Hours",   value:outlet.hours   },
            ].map(item => (
              <div key={item.label} style={{ display:"flex", gap:14, padding:"12px 16px", background:BRAND.white, borderLeft:`3px solid ${BRAND.gold}`, marginBottom:10 }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, fontWeight:600, marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:BRAND.navyMid, lineHeight:1.5 }}>{item.value}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:20 }}>
              <div style={{ padding:"16px 20px", background:BRAND.navyMid, color:BRAND.white, textAlign:"center" }}>
                <div className="cormorant" style={{ fontSize:32, fontWeight:600, color:BRAND.gold }}>{outlet.stats[0].value}</div>
                <div style={{ fontSize:11, letterSpacing:"0.1em", marginTop:4 }}>{outlet.stats[0].label}</div>
              </div>
              <div style={{ padding:"16px 20px", background:"rgba(10,31,63,0.08)", textAlign:"center" }}>
                <div className="cormorant" style={{ fontSize:32, fontWeight:600, color:BRAND.navyMid }}>{outlet.stats[2].value}</div>
                <div style={{ fontSize:11, letterSpacing:"0.1em", color:BRAND.muted, marginTop:4 }}>{outlet.stats[2].label}</div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div>
            {/* Map — city-specific Google Maps link */}
            <div style={{ width:"100%", height:200, background:BRAND.navyMid, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(184,150,62,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(184,150,62,0.04) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
              <div style={{ textAlign:"center", color:"rgba(255,255,255,0.5)", position:"relative", zIndex:1 }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🗺</div>
                <div style={{ fontSize:12, marginBottom:12 }}>{outlet.address}</div>
                {/* Open Google Maps with city-specific search */}
                <a href={getMapUrl(outlet.city)} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
                  <button className="sp-btn-gold" style={{ padding:"9px 20px", fontSize:11, borderRadius:2 }}><span>Open Google Maps →</span></button>
                </a>
              </div>
            </div>

            {/* Team */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:24 }}>
              {outlet.team.map(m => (
                <div key={m.name} style={{ padding:"14px 16px", background:BRAND.white, border:"1px solid rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${BRAND.gold}33,${outlet.accentColor}33)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>👤</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:BRAND.navyMid, fontFamily:"'Cormorant Garamond',serif" }}>{m.name}</div>
                    <div style={{ fontSize:10, color:BRAND.gold, letterSpacing:"0.06em" }}>{m.role}</div>
                    <div style={{ fontSize:10, color:BRAND.muted }}>Ext. {m.ext}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sibling outlets */}
            {siblings.length > 0 && (
              <>
                <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, fontWeight:600, marginBottom:12 }}>
                  Other {outlet.city} Outlets
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                  {siblings.map((key, i) => {
                    const sib = OUTLETS[key];
                    if (!sib) return null;
                    return (
                      <Link key={key} to={`/showrooms/${key}`} style={{ textDecoration:"none" }}>
                        <div onMouseOver={() => setHovered(i)} onMouseOut={() => setHovered(null)}
                          style={{ padding:"16px 20px", background:hovered===i?BRAND.navyMid:BRAND.white, border:`1px solid ${hovered===i?BRAND.navyMid:"rgba(0,0,0,0.06)"}`, cursor:"pointer", transition:"all 0.3s ease", display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:hovered===i?BRAND.gold:BRAND.navyMid, transition:"background 0.3s", flexShrink:0 }} />
                          <div>
                            <div style={{ fontSize:13, fontWeight:500, color:hovered===i?BRAND.white:BRAND.navyMid, transition:"color 0.3s" }}>{sib.outletName}</div>
                            <div style={{ fontSize:10, color:hovered===i?"rgba(255,255,255,0.4)":BRAND.muted, letterSpacing:"0.06em" }}>{sib.type}</div>
                          </div>
                          <span style={{ marginLeft:"auto", fontSize:10, opacity:hovered===i?1:0, transition:"opacity 0.3s", color:BRAND.gold }}>→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  CTA SECTION
// ══════════════════════════════════════════════════════════════════
const CTASection = ({ outlet, onBookTestDrive }) => (
  <section style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 100%)`, padding:"80px 0", position:"relative", overflow:"hidden", width:"100%" }}>
    <div style={W}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
        <div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:20 }}>
            Ready to Drive Home<br />Your Dream Tata?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.8 }}>
            Book a test drive at {outlet.outletName}, {outlet.city}. Our experts will guide you to the perfect vehicle for your lifestyle and budget.
          </p>
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {/* Book Test Drive → opens modal */}
          <button className="sp-btn-gold" onClick={onBookTestDrive} style={{ padding:"16px 40px", fontSize:14, borderRadius:2 }}>
            <span>📅 Book Test Drive</span>
          </button>
          {/* Call Now → direct phone */}
          <a href={`tel:${outlet.phone}`} style={{ textDecoration:"none" }}>
            <button className="sp-btn-outline" style={{ padding:"16px 40px", fontSize:14, borderRadius:2 }}>📞 Call Now</button>
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ── Floating WhatsApp ─────────────────────────────────────────────
const FloatingWA = ({ outlet }) => {
  const [hover, setHover] = useState(false);
  return (
    <a href={`https://wa.me/${outlet.whatsapp}?text=Hi, I'd like to enquire about vehicles at ${outlet.outletName}, ${outlet.city}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
      <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
        style={{ position:"fixed", bottom:32, right:32, zIndex:999, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
        {hover && (
          <div style={{ background:BRAND.white, color:BRAND.navyMid, padding:"10px 16px", fontSize:13, fontWeight:500, borderRadius:2, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", animation:"sp-slideLeft 0.3s ease", whiteSpace:"nowrap" }}>
            Chat with {outlet.outletName}
          </div>
        )}
        <div style={{ width:52, height:52, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:"0 4px 20px rgba(37,211,102,0.4)", transform:hover?"scale(1.1)":"scale(1)", transition:"transform 0.3s ease" }}>💬</div>
      </div>
    </a>
  );
};

// ── 404 ───────────────────────────────────────────────────────────
const NotFound = ({ outletKey }) => (
  <Layout>
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, background:BRAND.offWhite }}>
      <div className="cormorant" style={{ fontSize:80, color:BRAND.gold, lineHeight:1 }}>404</div>
      <h2 style={{ fontSize:24, color:BRAND.navyMid, margin:"16px 0 8px", fontFamily:"'Cormorant Garamond',serif" }}>Outlet Not Found</h2>
      <p style={{ color:BRAND.muted, marginBottom:8 }}>"{outletKey}" doesn't match any outlet.</p>
      <Link to="/" style={{ textDecoration:"none" }}>
        <button className="sp-btn-gold" style={{ padding:"12px 28px", fontSize:12, borderRadius:2 }}><span>← Back to Home</span></button>
      </Link>
    </div>
  </Layout>
);

// ══════════════════════════════════════════════════════════════════
//  ROOT EXPORT
// ══════════════════════════════════════════════════════════════════
export default function ShowroomPage() {
  const { outletKey }  = useParams();
  const outlet         = OUTLETS[outletKey];

  const showroomsRef       = useRef(null);
  const vehiclesSectionRef = useRef(null);

  // Modal state
  const [modal, setModal] = useState(null);
  // null | "enquire" | "testdrive"

  useEffect(() => { window.scrollTo(0, 0); }, [outletKey]);

  if (!outlet) return <NotFound outletKey={outletKey} />;

  const scrollToShowrooms = () =>
    showroomsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  // Test Drive extra fields — city pre-filled from outlet
  const testDriveFields = [
    {
      name:"vehicle_model", label:"Vehicle of Interest", type:"select", fullWidth:false,
      options: vehicles.map(v => v.name),
    },
    { name:"preferred_date", label:"Preferred Date", type:"date",   fullWidth:false },
    { name:"preferred_time", label:"Preferred Time", type:"select", fullWidth:false,
      options:["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"] },
  ];

  return (
    <Layout onShowroomsClick={scrollToShowrooms}>
      <ShowroomStyles />

      <Hero
        outlet={outlet}
        onEnquire={() => setModal("enquire")}
        onBookTestDrive={() => setModal("testdrive")}
      />
      <Ticker />
      <VehiclesSection sectionRef={vehiclesSectionRef} outlet={outlet} />
      <HeritageSection outlet={outlet} />
      <ServicesSection outlet={outlet} />
      <ShowroomsSection outlet={outlet} sectionRef={showroomsRef} />
      <CTASection outlet={outlet} onBookTestDrive={() => setModal("testdrive")} />
      <FloatingWA outlet={outlet} />

      {/* General Enquiry Modal */}
      {modal === "enquire" && (
        <EnquiryModal
          title="General Enquiry"
          subtitle="We'll get back to you shortly"
          outlet={outlet}
          extraFields={[
            { name:"vehicle_model", label:"Vehicle of Interest", type:"select", fullWidth:false,
              options: vehicles.map(v => v.name) },
          ]}
          onClose={() => setModal(null)}
        />
      )}

      {/* Test Drive Modal */}
      {modal === "testdrive" && (
        <EnquiryModal
          title="Book Test Drive"
          subtitle="Experience your dream Tata"
          outlet={outlet}
          extraFields={testDriveFields}
          onClose={() => setModal(null)}
        />
      )}
    </Layout>
  );
}