import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ─── API URL ──────────────────────────────────────────────────────
const API_URL = "https://yourdomain.com/backend/api/offers_enquiry.php";
const WHATSAPP_NUMBER = "919686024365"; // 91 prefix for India

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .cormorant { font-family: 'Cormorant Garamond', serif; }
    .jost      { font-family: 'Jost', sans-serif; }

    @keyframes co-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes co-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes co-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes co-ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes co-spin    { to { transform:rotate(360deg); } }
    @keyframes co-modalIn { from { opacity:0; transform:translateY(32px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes co-overlayIn { from { opacity:0; } to { opacity:1; } }

    .co-fadeUp { animation: co-fadeUp  0.6s ease forwards; }
    .co-fadeIn { animation: co-fadeIn  0.5s ease forwards; }

    .co-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
    .co-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.12); }

    .co-btn-gold {
      background: linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.12em; text-transform:uppercase;
      transition:all 0.3s ease;
    }
    .co-btn-gold:hover { opacity:0.88; transform:translateY(-1px); }

    .co-btn-outline {
      background:transparent; border:1px solid #b8963e; color:#b8963e;
      cursor:pointer; font-family:'Jost',sans-serif; font-weight:500;
      letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
    }
    .co-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .co-btn-whatsapp {
      background: linear-gradient(135deg,#25D366,#128C7E); color:#fff;
      border:none; cursor:pointer; font-family:'Jost',sans-serif;
      font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
      transition:all 0.3s ease; display:inline-flex; align-items:center; gap:8px;
    }
    .co-btn-whatsapp:hover { opacity:0.9; transform:translateY(-1px); }

    .co-gold-line { width:60px; height:2px; background:linear-gradient(90deg,#b8963e,transparent); }

    .co-filter-btn { transition:all 0.2s ease; cursor:pointer; }
    .co-filter-btn.active { background:#0c1f3f !important; color:#ffffff !important; border-color:#0c1f3f !important; }
    .co-filter-btn:hover { border-color:#b8963e !important; color:#b8963e !important; }

    .co-ticker-inner { display:flex; white-space:nowrap; animation:co-ticker 28s linear infinite; }
    .co-ticker-inner:hover { animation-play-state:paused; }

    /* ── Modal ── */
    .co-overlay {
      position:fixed; inset:0; z-index:1000;
      background:rgba(10,22,40,0.82); backdrop-filter:blur(6px);
      display:flex; align-items:center; justify-content:center; padding:20px;
      animation:co-overlayIn 0.25s ease;
    }
    .co-modal {
      background:#fff; width:100%; max-width:520px;
      max-height:90vh; overflow-y:auto; border-radius:4px;
      animation:co-modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
      position:relative;
    }
    .co-modal::-webkit-scrollbar { width:4px; }
    .co-modal::-webkit-scrollbar-thumb { background:#b8963e55; border-radius:2px; }

    .co-form-label {
      display:block; font-family:'Jost',sans-serif;
      font-size:10px; font-weight:600; letter-spacing:0.15em;
      text-transform:uppercase; color:#6b7280; margin-bottom:6px;
    }
    .co-form-input {
      width:100%; height:44px;
      border:1.5px solid rgba(10,31,63,0.18); border-radius:3px;
      padding:0 14px; font-family:'Jost',sans-serif; font-size:13px;
      color:#0c1f3f; outline:none; transition:border-color 0.2s;
      background:#fafaf9;
    }
    .co-form-input:focus { border-color:#b8963e; background:#fff; }
    .co-form-input.err   { border-color:#dc2626; }
    .co-form-err  { font-family:'Jost',sans-serif; font-size:11px; color:#dc2626; margin-top:4px; }

    .co-submit {
      width:100%; height:48px; border:none; border-radius:3px;
      background:linear-gradient(135deg,#b8963e,#d4af5a);
      color:#0a1628; font-family:'Jost',sans-serif;
      font-size:12px; font-weight:700; letter-spacing:0.15em;
      text-transform:uppercase; cursor:pointer; transition:all 0.3s; outline:none;
    }
    .co-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
    .co-submit:disabled { opacity:0.55; cursor:not-allowed; transform:none; }
    .co-submit.loading { position:relative; color:transparent; }
    .co-submit.loading::after {
      content:''; position:absolute; top:50%; left:50%;
      width:20px; height:20px; margin:-10px 0 0 -10px;
      border:2px solid rgba(10,22,40,0.25); border-top-color:#0a1628;
      border-radius:50%; animation:co-spin 0.7s linear infinite;
    }
    .co-close {
      position:absolute; top:14px; right:14px;
      width:30px; height:30px; border:none; background:rgba(0,0,0,0.06);
      border-radius:50%; cursor:pointer; font-size:13px; color:#6b7280;
      display:flex; align-items:center; justify-content:center;
      transition:all 0.2s; outline:none;
    }
    .co-close:hover { background:rgba(0,0,0,0.13); color:#0c1f3f; }

    @keyframes co-successIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
    .co-success { animation:co-successIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  `}</style>
);

const W = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px" };

// ─── DATA ────────────────────────────────────────────────────────
const offerCategories = [
  { id: "all",     label: "All Offers"        },
  { id: "ev",      label: "Electric Vehicles" },
  { id: "suv",     label: "SUVs"              },
  { id: "hatch",   label: "Hatchbacks"        },
  { id: "sedan",   label: "Sedans"            },
  { id: "festive", label: "Festive Specials"  },
];

const offers = [
  { id:1, category:"ev",      model:"Nexon EV",   tag:"Best Seller",     tagBg:"#1a5276", headline:"₹50,000 Cash Benefit",   subline:"On Nexon EV Max — Limited Period",            benefits:["₹50,000 consumer discount","Free home charger worth ₹18,000","Zero processing fee on loan","5-year battery warranty"],    validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/nexon_ev.avif",  badge:"🔋 EV Special"     },
  { id:2, category:"ev",      model:"Punch EV",   tag:"New Launch",      tagBg:"#1e8449", headline:"₹30,000 Launch Offer",    subline:"Punch EV — City Electric Made Easy",          benefits:["₹30,000 introductory benefit","Free 1st year insurance","Complimentary portable charger","3-year free service"],        validTill:"31 May 2026", image:"https://www.manickbag.in/images/punch_ev.avif",  badge:"⚡ Launch Special" },
  { id:3, category:"suv",     model:"Harrier",    tag:"Flagship",        tagBg:"#6c3483", headline:"₹75,000 Total Benefit",   subline:"Harrier Petrol — Commanding Presence",        benefits:["₹40,000 cash discount","₹15,000 exchange bonus","₹20,000 accessory package","Free extended warranty 1yr"],          validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/harrier.avif",   badge:"🏆 Flagship Deal"  },
  { id:4, category:"suv",     model:"Safari",     tag:"Premium",         tagBg:"#784212", headline:"₹60,000 Total Benefit",   subline:"Safari — 7-Seater Luxury Redefined",          benefits:["₹35,000 consumer offer","Free sunroof accessory kit","Low EMI from ₹16,999/mo","1yr free roadside assistance"],     validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/safari.avif",    badge:"👑 Premium Offer"  },
  { id:5, category:"suv",     model:"Nexon",      tag:"Top Seller",      tagBg:"#b8963e", headline:"₹45,000 Total Benefit",   subline:"Nexon Petrol — India's Safest SUV",           benefits:["₹25,000 direct discount","Free AMC 2 years","Zero cost EMI 12 months","Free first service"],                      validTill:"15 May 2026", image:"https://www.manickbag.in/images/naxon.avif",     badge:"⭐ Top Seller"     },
  { id:6, category:"hatch",   model:"Altroz",     tag:"Stylish",         tagBg:"#1a3d7c", headline:"₹35,000 Total Benefit",   subline:"Altroz — Premium Hatchback with 5-Star Safety",benefits:["₹20,000 cash benefit","Free metallic paint upgrade","Low EMI from ₹7,999/mo","2yr free maintenance"],             validTill:"31 May 2026", image:"https://www.manickbag.in/images/altroz.jpg",     badge:"🎨 Style Offer"    },
  { id:7, category:"hatch",   model:"Tiago",      tag:"Budget Friendly", tagBg:"#1e6b3e", headline:"₹25,000 Total Benefit",   subline:"Tiago — Most Value-Packed Hatchback",         benefits:["₹15,000 consumer discount","Free first year insurance","EMI from ₹5,499/mo","Free accessories worth ₹5,000"],     validTill:"31 May 2026", image:"https://www.manickbag.in/images/tiago.jpg",      badge:"💰 Value Deal"     },
  { id:8, category:"sedan",   model:"Tigor",      tag:"Compact Sedan",   tagBg:"#5d3f7a", headline:"₹30,000 Total Benefit",   subline:"Tigor — Boot Space Champion",                 benefits:["₹18,000 cash benefit","Free 1yr extended warranty","Zero processing fee","Free interior accessories"],             validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/tigor.jpg",      badge:"🚗 Sedan Offer"    },
  { id:9, category:"festive", model:"Any Model",  tag:"Festive Special", tagBg:"#b8963e", headline:"Up to ₹1,00,000 Benefit", subline:"Summer Bonanza — Across All Models",           benefits:["Up to ₹1L combined benefit","Exchange bonus up to ₹25,000","Loyalty bonus ₹10,000","Free 3yr service package"], validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/safari.avif",    badge:"🎉 Bonanza Offer"  },
];

const highlights = [
  { icon:"🏷️", value:"9+",         label:"Active Offers"   },
  { icon:"💰", value:"₹1 Lakh",    label:"Max Benefit"     },
  { icon:"📅", value:"April 2026", label:"Valid This Month" },
  { icon:"🚗", value:"All Models", label:"Covered"         },
];

// ─── TICKER ────────────────────────────────────────────────────────
const Ticker = () => {
  const items  = ["₹50K on Nexon EV","₹75K on Harrier","Free Charger with Punch EV","0% EMI on Tiago","₹1L Summer Bonanza","Exchange Bonus on Safari"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow:"hidden", padding:"10px 0" }}>
      <div className="co-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding:"0 28px", fontSize:11, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:BRAND.navy, display:"inline-flex", alignItems:"center", gap:14 }}>
            {item}<span style={{ opacity:0.35 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── OFFER ENQUIRY MODAL ──────────────────────────────────────────
function OfferModal({ offer, type, onClose }) {
  const [form, setForm]     = useState({ name:"", phone:"", email:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [apiErr, setApiErr] = useState("");

  const isKnowMore = type === "know_more";

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
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
        body:    JSON.stringify({
          name:           form.name.trim(),
          phone:          form.phone.trim(),
          email:          form.email.trim(),
          offer_id:       offer.id,
          offer_model:    offer.model,
          offer_headline: offer.headline,
          enquiry_type:   type,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setDone(true);
      } else {
        setApiErr(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setApiErr("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="co-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="co-modal">
        <button className="co-close" onClick={onClose}>✕</button>

        {done ? (
          /* ── Success State ── */
          <div className="co-success" style={{ textAlign:"center", padding:"52px 36px" }}>
            <div style={{ fontSize:58, marginBottom:18 }}>🎉</div>
            <div className="cormorant" style={{ fontSize:30, fontWeight:600, color:BRAND.navyMid, marginBottom:10 }}>
              {isKnowMore ? "Request Received!" : "Offer Claimed!"}
            </div>
            <p style={{ fontSize:13, color:BRAND.muted, lineHeight:1.8, maxWidth:340, margin:"0 auto 28px" }}>
              Thank you, <strong>{form.name}</strong>! Our advisor will call you on <strong>{form.phone}</strong> within 24 hours with full details on this offer.
            </p>
            {/* Offer summary */}
            <div style={{ background:BRAND.offWhite, border:"1px solid rgba(0,0,0,0.07)", borderRadius:3, padding:"16px 20px", marginBottom:28, textAlign:"left" }}>
              <div style={{ fontSize:10, letterSpacing:"0.15em", color:BRAND.muted, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", marginBottom:8 }}>
                Offer Details
              </div>
              <div className="cormorant" style={{ fontSize:20, fontWeight:600, color:BRAND.navyMid }}>{offer.headline}</div>
              <div style={{ fontSize:12, color:BRAND.muted, fontFamily:"'Jost',sans-serif", marginTop:4 }}>{offer.model} — {offer.subline}</div>
            </div>
            <button className="co-btn-gold" onClick={onClose} style={{ padding:"11px 36px", borderRadius:3, fontSize:11 }}>
              Back to Offers
            </button>
          </div>
        ) : (
          <>
            {/* ── Modal Header ── */}
            <div style={{ background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding:"26px 28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:28, height:1, background:BRAND.gold }} />
                <span style={{ fontSize:9, letterSpacing:"0.3em", color:BRAND.gold, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
                  {isKnowMore ? "Know More" : "Claim Offer"}
                </span>
              </div>
              <h2 className="cormorant" style={{ fontSize:26, fontWeight:600, color:BRAND.white, lineHeight:1.2 }}>
                {isKnowMore ? "Get Full Offer Details" : "Claim Your Exclusive Offer"}
              </h2>
              {/* Offer pill */}
              <div style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(184,150,62,0.25)", borderRadius:2, padding:"7px 14px" }}>
                <span style={{ fontSize:11, color:BRAND.gold, fontWeight:700, fontFamily:"'Jost',sans-serif" }}>{offer.headline}</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.45)", fontFamily:"'Jost',sans-serif" }}>· {offer.model}</span>
              </div>
            </div>

            <div style={{ padding:"26px 28px" }}>
              {/* Benefits list */}
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:10, letterSpacing:"0.15em", color:BRAND.muted, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", marginBottom:10 }}>
                  What's Included
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {offer.benefits.map((b, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:BRAND.gold, flexShrink:0, marginTop:5 }} />
                      <span style={{ fontSize:12, color:BRAND.navyMid, lineHeight:1.5, fontFamily:"'Jost',sans-serif" }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:10, fontSize:11, color:BRAND.muted, fontFamily:"'Jost',sans-serif" }}>
                  📅 Valid till <strong>{offer.validTill}</strong> — while stocks last
                </div>
              </div>

              {/* Form */}
              <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
                <div>
                  <label className="co-form-label">Full Name *</label>
                  <input className={`co-form-input ${errors.name ? "err" : ""}`}
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <div className="co-form-err">{errors.name}</div>}
                </div>
                <div>
                  <label className="co-form-label">Mobile Number *</label>
                  <input className={`co-form-input ${errors.phone ? "err" : ""}`}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    maxLength={10}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,"") }))}
                  />
                  {errors.phone && <div className="co-form-err">{errors.phone}</div>}
                </div>
                <div>
                  <label className="co-form-label">Email Address *</label>
                  <input className={`co-form-input ${errors.email ? "err" : ""}`}
                    placeholder="e.g. rajesh@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <div className="co-form-err">{errors.email}</div>}
                </div>
              </div>

              {apiErr && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:3, padding:"9px 14px", marginBottom:14, fontSize:12, color:"#dc2626", fontFamily:"'Jost',sans-serif" }}>
                  ⚠️ {apiErr}
                </div>
              )}

              <button
                className={`co-submit ${loading ? "loading" : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "" : isKnowMore ? "Send My Request →" : "Claim This Offer →"}
              </button>

              <p style={{ fontSize:10, color:BRAND.muted, textAlign:"center", marginTop:10, fontFamily:"'Jost',sans-serif", lineHeight:1.6 }}>
                Our team will contact you via call or WhatsApp within 24 hours.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── OFFER CARD ────────────────────────────────────────────────────
const OfferCard = ({ offer, index }) => {
  const [hovered,  setHovered]  = useState(false);
  const [modal,    setModal]    = useState(null); // null | "claim" | "know_more"

  return (
    <>
      {modal && (
        <OfferModal
          offer={offer}
          type={modal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="co-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background:BRAND.white, border:`1px solid ${hovered ? BRAND.borderLight : "rgba(0,0,0,0.06)"}`, overflow:"hidden", animation:`co-fadeUp 0.55s ease ${index * 0.08}s both`, display:"flex", flexDirection:"column" }}>

        {/* Image */}
        <div style={{ height:190, position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})` }}>
          <img src={offer.image} alt={offer.model}
            style={{ width:"100%", height:"100%", objectFit:"contain", transform:hovered ? "scale(1.07)":"scale(1)", transition:"transform 0.45s ease" }}
          />
          <div style={{ position:"absolute", top:14, left:14, background:offer.tagBg, color:BRAND.white, fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"4px 10px", textTransform:"uppercase" }}>{offer.tag}</div>
          <div style={{ position:"absolute", top:14, right:14, background:"rgba(10,22,40,0.82)", color:BRAND.gold, fontSize:10, fontWeight:600, padding:"4px 10px", backdropFilter:"blur(6px)", letterSpacing:"0.08em" }}>{offer.badge}</div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(10,22,40,0.75)", backdropFilter:"blur(4px)", padding:"6px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.55)", letterSpacing:"0.08em" }}>Valid till</span>
            <span style={{ fontSize:11, color:BRAND.gold, fontWeight:600, letterSpacing:"0.1em" }}>{offer.validTill}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"22px 24px", flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:BRAND.muted, textTransform:"uppercase", marginBottom:6 }}>{offer.model}</div>
          <h3 className="cormorant" style={{ fontSize:26, fontWeight:600, color:BRAND.navyMid, lineHeight:1.1, marginBottom:6 }}>{offer.headline}</h3>
          <p style={{ fontSize:12, color:BRAND.muted, lineHeight:1.6, marginBottom:18 }}>{offer.subline}</p>
          <div style={{ flex:1, marginBottom:20 }}>
            {offer.benefits.map((b, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"5px 0", borderBottom:"1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:BRAND.gold, flexShrink:0, marginTop:5 }} />
                <span style={{ fontSize:12, color:BRAND.navyMid, lineHeight:1.5 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {/* Claim Offer → opens modal type "claim" */}
            <button
              onClick={() => setModal("claim")}
              style={{ flex:1, padding:"11px", fontSize:11, borderRadius:2, fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s", background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`, color:BRAND.navy, border:"none" }}>
              Claim Offer
            </button>
            {/* Know More → opens modal type "know_more" */}
            <button
              className="co-btn-outline"
              onClick={() => setModal("know_more")}
              style={{ padding:"11px 16px", fontSize:11, borderRadius:2 }}>
              Know More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function CurrentOffers() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = offers.filter(o => activeCategory === "all" || o.category === activeCategory);

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello! I'd like to speak with an advisor about the current Tata offers at Manickbag.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <PageStyles />
      <Ticker />

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 55%,${BRAND.navy} 100%)`, padding:"80px 48px 72px", position:"relative", overflow:"hidden", width:"100%" }}>
        <div style={{ position:"absolute", right:-80, top:-80, width:500, height:500, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.07)` }} />
        <div style={{ position:"absolute", right:60,  top:60,  width:300, height:300, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.12)` }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.25, left:`${10+i*14}%`, top:`${25+(i%3)*22}%`, animation:`co-pulse ${2+i*0.35}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
        ))}

        <div style={W}>
          <div className="co-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:22, opacity:0, animationDelay:"0.1s" }}>
            <div style={{ width:36, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>April 2026 · Limited Period</span>
          </div>
          <h1 className="cormorant co-fadeUp" style={{ fontSize:"clamp(44px,6vw,82px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, maxWidth:700, opacity:0, animationDelay:"0.2s", whiteSpace:"pre-line" }}>
            {"Offers That Move\nYou Forward"}
          </h1>
          <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
          <p className="co-fadeUp" style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,0.6)", maxWidth:500, marginBottom:44, opacity:0, animationDelay:"0.35s" }}>
            Exclusive benefits on Tata's full range — cash discounts, free insurance, exchange bonuses, and EMI deals. Only at Manickbag.
          </p>
          <div className="co-fadeUp" style={{ display:"flex", gap:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", opacity:0, animationDelay:"0.45s", flexWrap:"wrap" }}>
            {highlights.map(h => (
              <div key={h.label}>
                <div className="cormorant" style={{ fontSize:38, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{h.value}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ ...W, padding:"64px 48px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div className="co-gold-line" />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Active Offers</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", fontWeight:600, color:BRAND.navyMid, lineHeight:1.15 }}>Current Month Deals</h2>
          </div>
          <div style={{ fontSize:12, color:BRAND.muted, textAlign:"right", lineHeight:1.7 }}>
            <div>All offers valid while stocks last.</div>
            <div>T&amp;C apply. Contact showroom for details.</div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display:"flex", gap:8, marginBottom:40, flexWrap:"wrap" }}>
          {offerCategories.map(c => (
            <button key={c.id} className={`co-filter-btn ${activeCategory === c.id ? "active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
              style={{ padding:"9px 22px", fontSize:12, borderRadius:2, background:"transparent", color:BRAND.navyMid, border:`1px solid rgba(10,31,63,0.2)`, fontFamily:"'Jost',sans-serif", fontWeight:500, letterSpacing:"0.06em" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {filtered.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:24 }}>
            {filtered.map((offer, i) => <OfferCard key={offer.id} offer={offer} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"80px 0", color:BRAND.muted }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <div className="cormorant" style={{ fontSize:28, color:BRAND.navyMid, marginBottom:8 }}>No offers in this category right now</div>
            <div style={{ fontSize:14 }}>Check back soon or view all offers.</div>
          </div>
        )}
      </div>

      {/* ── DISCLAIMER STRIP ── */}
      <div style={{ background:BRAND.offWhite, borderTop:"1px solid rgba(0,0,0,0.06)", padding:"32px 48px" }}>
        <div style={{ ...W, padding:0 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {[
              ["📅","Validity",    "Offers valid through April–May 2026 or while stocks last."],
              ["📍","Location",    "Available across all 12 Manickbag showrooms in North Karnataka."],
              ["📋","T&C Apply",   "Benefits are combinable only as per Tata Motors norms."],
              ["📞","Get Details", "Call +91 96860 24365 or visit your nearest showroom."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:BRAND.navyMid, marginBottom:4 }}>{title}</div>
                  <div style={{ fontSize:12, color:BRAND.muted, lineHeight:1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER — Book Test Drive removed, WhatsApp for Talk to Advisor ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"68px 48px" }}>
        <div style={{ ...W, padding:0, display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:14 }}>Don't miss out</div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,50px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:18 }}>
              Ready to Claim<br />Your Offer?
            </h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
              Chat with our advisor on WhatsApp right now, or visit any Manickbag showroom. Our team will walk you through every available benefit.
            </p>
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {/* WhatsApp CTA — replaces Book Test Drive, replaces Talk to Advisor */}
            <button className="co-btn-whatsapp" onClick={handleWhatsApp} style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Talk to Advisor
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}