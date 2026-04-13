import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const WA_NUMBER  = "919686024365";
const MAPS_URL   = "https://www.google.com/maps/search/Manickbag+Tata+Motors+Gulbarga";

const PageStyles = () => (
  <style>{`
    @keyframes eb-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes eb-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes eb-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes eb-ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes eb-arrow   { 0%,100% { transform:translateX(0); } 50% { transform:translateX(6px); } }

    .eb-fadeUp { animation: eb-fadeUp 0.6s ease forwards; }
    .eb-fadeIn { animation: eb-fadeIn 0.5s ease forwards; }

    .eb-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s ease; }
    .eb-btn-gold:hover { opacity:0.88; transform:translateY(-1px); }
    .eb-btn-gold:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

    .eb-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .eb-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .eb-gold-line { width:60px; height:2px; background:linear-gradient(90deg,#b8963e,transparent); }

    .eb-card { transition:transform 0.35s ease, box-shadow 0.35s ease; }
    .eb-card:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.12); }

    .eb-bonus-card { transition:all 0.3s ease; cursor:default; }
    .eb-bonus-card:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }

    .eb-model-pill { transition:all 0.2s ease; cursor:pointer; border:1px solid rgba(10,31,63,0.15); font-family:'Jost',sans-serif; }
    .eb-model-pill:hover { border-color:#b8963e; color:#b8963e; }

    .eb-input { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; transition:border-color 0.2s; box-sizing:border-box; }
    .eb-input:focus { border-color:#b8963e; }
    .eb-input::placeholder { color:rgba(255,255,255,0.3); }

    .eb-select { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; cursor:pointer; box-sizing:border-box; }
    .eb-select option { background:#0c1f3f; color:#fff; }

    .eb-ticker-inner { display:flex; white-space:nowrap; animation:eb-ticker 28s linear infinite; }
    .eb-ticker-inner:hover { animation-play-state:paused; }

    .eb-arrow { animation:eb-arrow 1.5s ease-in-out infinite; display:inline-block; }
  `}</style>
);

const W = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px" };

// ─── DATA ─────────────────────────────────────────────────────────
const exchangeBonusModels = [
  { name:"Tiago",    bonus:"₹15,000", extra:"+ ₹5,000 loyalty", image:"https://www.manickbag.in/images/tiago.jpg",      tag:"Budget Pick",   tagColor:"#1e6b3e", popular:false },
  { name:"Tiago EV", bonus:"₹20,000", extra:"+ Free charger",   image:"https://www.manickbag.in/images/tiago_ev.avif",  tag:"EV Special",    tagColor:"#1a5276", popular:false },
  { name:"Altroz",   bonus:"₹20,000", extra:"+ ₹5,000 loyalty", image:"https://www.manickbag.in/images/altroz.jpg",     tag:"Stylish Pick",  tagColor:"#5d3f7a", popular:false },
  { name:"Nexon",    bonus:"₹25,000", extra:"+ Free AMC 1yr",   image:"https://www.manickbag.in/images/naxon.avif",     tag:"Top Seller",    tagColor:"#b8963e", popular:false },
  { name:"Nexon EV", bonus:"₹35,000", extra:"+ Free charger",   image:"https://www.manickbag.in/images/nexon_ev.avif",  tag:"Green Bonus",   tagColor:"#1e6b3e", popular:false },
  { name:"Punch",    bonus:"₹20,000", extra:"+ ₹5,000 loyalty", image:"https://www.manickbag.in/images/Punch.png",      tag:"5-Star Safety", tagColor:"#784212", popular:false },
  { name:"Punch EV", bonus:"₹28,000", extra:"+ Free charger",   image:"https://www.manickbag.in/images/punch_ev.avif",  tag:"New Launch",    tagColor:"#1a5276", popular:false },
  { name:"Harrier",  bonus:"₹40,000", extra:"+ 1yr warranty",   image:"https://www.manickbag.in/images/harrier.avif",   tag:"Flagship",      tagColor:"#6c3483", popular:false },
  { name:"Safari",   bonus:"₹35,000", extra:"+ VAS Package",    image:"https://www.manickbag.in/images/safari.avif",    tag:"Premium",       tagColor:"#b8963e", popular:false },
];

const exchangeSteps = [
  { num:"01", icon:"📋", title:"Submit Your Car Details",     desc:"Share make, model, year, km driven, and condition. Online or walk-in to any Manickbag showroom." },
  { num:"02", icon:"🔍", title:"Free Valuation",              desc:"Our expert evaluates your vehicle on-site using the latest Tata Motors exchange valuation tools." },
  { num:"03", icon:"💰", title:"Get Best Price + Bonus",      desc:"Receive your car's market value PLUS the exchange bonus on top. No hidden deductions." },
  { num:"04", icon:"🚗", title:"Drive Away in Your New Tata", desc:"Adjust the exchange value and bonus against your new vehicle and drive home the same day." },
];

const bonusHighlights = [
  { icon:"💎", title:"Up to ₹40,000",  sub:"Exchange Bonus",       desc:"On top of your old car's market value — additional benefit only at Manickbag." },
  { icon:"🔄", title:"All Brands",      sub:"Accepted",             desc:"We accept Maruti, Hyundai, Honda, Mahindra, Ford, and all other brands in exchange." },
  { icon:"⚡", title:"Same Day",        sub:"Processing",           desc:"Complete the exchange and take delivery of your new Tata on the very same day." },
  { icon:"📄", title:"Paperwork Free",  sub:"Hassle-free Transfer", desc:"We handle all RC transfer, NOC, and documentation on your behalf." },
  { icon:"🏆", title:"Fair Valuation",  sub:"Transparent Pricing",  desc:"Market-linked valuation with zero arbitrary deductions. You see every number." },
  { icon:"🛡️", title:"Loyalty Bonus",   sub:"Existing Tata Owners", desc:"Already own a Tata? Get an additional ₹5,000–₹10,000 loyalty bonus on exchange." },
];

const acceptedBrands = [
  "Maruti Suzuki","Hyundai","Honda","Mahindra","Kia","Toyota",
  "Renault","Volkswagen","Skoda","MG Motor","Ford","Nissan","Jeep","Tata Motors",
];

const faqs = [
  { q:"What is the Exchange Bonus?",                         a:"The exchange bonus is an additional amount offered by Manickbag over and above your old vehicle's market valuation. It ranges from ₹15,000 to ₹40,000 depending on the new model you choose." },
  { q:"Do you accept vehicles of all brands?",              a:"Yes. We accept all major brands including Maruti, Hyundai, Honda, Mahindra, Kia, Toyota, Renault, Ford, and more. Even older Tata vehicles are welcome." },
  { q:"Can I exchange a vehicle with a loan outstanding?",  a:"Yes, with conditions. The outstanding loan amount must be cleared either by you or adjusted from the exchange value. Our team will guide you through this process." },
  { q:"Is the valuation free?",                             a:"Absolutely. Vehicle evaluation at all Manickbag showrooms is completely free with no obligation to proceed." },
  { q:"What documents do I need for exchange?",             a:"Original RC book, valid insurance, PUC certificate, all service records, and a government ID proof. Our team will guide you through any additional paperwork." },
  { q:"Can I combine the exchange bonus with other offers?", a:"Yes! Exchange bonus is combinable with current month consumer discounts, finance schemes, and AMC packages — subject to Tata Motors norms." },
];

// ─── TICKER ───────────────────────────────────────────────────────
const Ticker = () => {
  const items = ["Up to ₹40,000 Exchange Bonus","All Brands Accepted","Same Day Processing","Free Valuation","Loyalty Bonus for Tata Owners","Zero Paperwork Hassle"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow:"hidden", padding:"10px 0" }}>
      <div className="eb-ticker-inner">
        {doubled.map((item,i) => (
          <span key={i} style={{ padding:"0 28px", fontSize:11, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:BRAND.navy, display:"inline-flex", alignItems:"center", gap:14 }}>
            {item}<span style={{ opacity:0.35 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function ExchangeBonus() {
  const [openFaq,      setOpenFaq]      = useState(null);
  const [selectedNew,  setSelectedNew]  = useState(null);
  const [formData,     setFormData]     = useState({ name:"", phone:"", oldBrand:"", oldModel:"", oldYear:"", oldKm:"", newModel:"", city:"" });
  const [submitted,    setSubmitted]    = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | error
  const [errorMsg,     setErrorMsg]     = useState("");

  const updateForm = (k, v) => setFormData(f => ({ ...f, [k]: v }));
  const canSubmit  = formData.name && formData.phone && formData.oldBrand && formData.oldModel;

  // ── API Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Phone validation
    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setSubmitStatus("error");
      setErrorMsg("Enter a valid 10-digit mobile number");
      return;
    }

    setSubmitStatus("loading");
    setErrorMsg("");

    try {
      const res  = await fetch("/api/exchange_enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       formData.name.trim(),
          phone:      cleanPhone,
          old_brand:  formData.oldBrand,
          old_model:  formData.oldModel.trim(),
          old_year:   formData.oldYear.trim(),
          old_km:     formData.oldKm.trim(),
          new_model:  formData.newModel,
          city:       formData.city,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setSubmitStatus("idle");
      } else {
        setSubmitStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitStatus("idle");
    setErrorMsg("");
    setFormData({ name:"", phone:"", oldBrand:"", oldModel:"", oldYear:"", oldKm:"", newModel:"", city:"" });
    setSelectedNew(null);
  };

  // ── CTA actions ─────────────────────────────────────────────────
  const openMap = () => window.open(MAPS_URL, "_blank");
  const openWA  = () => window.open(`https://wa.me/${WA_NUMBER}?text=Hi, I'd like to know more about the Exchange Bonus programme`, "_blank");

  return (
    <Layout>
      <PageStyles />
      <Ticker />

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 55%,${BRAND.navy} 100%)`, padding:"80px 48px 72px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-80, top:-80, width:500, height:500, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.07)` }} />
        <div style={{ position:"absolute", right:60,  top:60,  width:280, height:280, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.12)` }} />
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.22, left:`${10+i*14}%`, top:`${25+(i%3)*22}%`, animation:`eb-pulse ${2+i*0.35}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
        ))}
        <div style={W}>
          <div className="eb-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:22, opacity:0, animationDelay:"0.1s" }}>
            <div style={{ width:36, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>Exchange & Upgrade Programme</span>
          </div>
          <h1 className="cormorant eb-fadeUp" style={{ fontSize:"clamp(44px,6vw,82px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, maxWidth:780, opacity:0, animationDelay:"0.2s", whiteSpace:"pre-line" }}>
            {"Trade In. Upgrade.\nDrive Better."}
          </h1>
          <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
          <p className="eb-fadeUp" style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,0.6)", maxWidth:540, marginBottom:44, opacity:0, animationDelay:"0.35s" }}>
            Get the best price for your old car — plus an exclusive exchange bonus of up to ₹40,000 — when you upgrade to a brand new Tata. Any brand accepted.
          </p>
          <div className="eb-fadeUp" style={{ display:"flex", alignItems:"center", gap:24, marginBottom:44, opacity:0, animationDelay:"0.4s" }}>
            <div style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${BRAND.borderLight}`, padding:"16px 24px", borderRadius:4 }}>
              <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Your Old Car</div>
              <div className="cormorant" style={{ fontSize:24, color:BRAND.white }}>Any Brand</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <span className="eb-arrow" style={{ fontSize:28, color:BRAND.gold }}>→</span>
              <span style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.gold }}>+ Bonus</span>
            </div>
            <div style={{ background:`linear-gradient(135deg,rgba(184,150,62,0.2),rgba(184,150,62,0.08))`, border:`1px solid ${BRAND.gold}`, padding:"16px 24px", borderRadius:4 }}>
              <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>New Tata + Bonus</div>
              <div className="cormorant" style={{ fontSize:24, color:BRAND.gold }}>Up to ₹40,000</div>
            </div>
          </div>
          <div className="eb-fadeUp" style={{ display:"flex", gap:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", opacity:0, animationDelay:"0.5s", flexWrap:"wrap" }}>
            {[["₹40K","Max Exchange Bonus"],["All","Brands Accepted"],["Same Day","Delivery Possible"],["Free","Valuation"]].map(([val,lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize:38, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BONUS HIGHLIGHTS ── */}
      <div style={{ background:BRAND.offWhite, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Why Exchange at Manickbag</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", color:BRAND.navyMid }}>The Manickbag Exchange Advantage</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
            {bonusHighlights.map((b,i) => (
              <div key={b.title} className="eb-bonus-card"
                style={{ background:BRAND.white, padding:"36px 30px", borderBottom:"2px solid transparent", transition:"border-color 0.3s", animation:`eb-fadeUp 0.5s ease ${i*0.08}s both` }}
                onMouseOver={e => e.currentTarget.style.borderBottomColor=BRAND.gold}
                onMouseOut={e  => e.currentTarget.style.borderBottomColor="transparent"}>
                <div style={{ fontSize:38, marginBottom:14 }}>{b.icon}</div>
                <div className="cormorant" style={{ fontSize:26, fontWeight:600, color:BRAND.navyMid, lineHeight:1.1, marginBottom:4 }}>{b.title}</div>
                <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12, fontWeight:600 }}>{b.sub}</div>
                <p style={{ fontSize:13, color:BRAND.muted, lineHeight:1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXCHANGE BONUS BY MODEL ── */}
      <div style={{ background:BRAND.white, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:44 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div className="eb-gold-line" />
                <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Bonus by Model</span>
              </div>
              <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", color:BRAND.navyMid }}>Choose Your New Tata</h2>
            </div>
            <div style={{ fontSize:12, color:BRAND.muted, textAlign:"right", lineHeight:1.7 }}>
              <div>Click a model to select for your enquiry.</div>
              <div>Bonuses valid April–May 2026.</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
            {exchangeBonusModels.map((m,i) => {
              const isSelected = selectedNew === m.name;
              return (
                <div key={m.name} className="eb-card"
                  onClick={() => { setSelectedNew(m.name); updateForm("newModel", m.name); }}
                  style={{ background:isSelected?BRAND.navyMid:BRAND.offWhite, border:`2px solid ${isSelected?BRAND.gold:"rgba(0,0,0,0.06)"}`, overflow:"hidden", cursor:"pointer", animation:`eb-fadeUp 0.5s ease ${i*0.07}s both` }}>
                  <div style={{ height:160, position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})` }}>
                    <img src={m.image} alt={m.name} style={{ width:"100%", height:"100%", objectFit:"contain", transition:"transform 0.4s ease", transform:isSelected?"scale(1.06)":"scale(1)" }} />
                    <div style={{ position:"absolute", top:12, left:12, background:m.tagColor, color:BRAND.white, fontSize:9, fontWeight:700, letterSpacing:"0.12em", padding:"3px 8px", textTransform:"uppercase" }}>{m.tag}</div>
                    {isSelected && <div style={{ position:"absolute", top:12, right:12, width:24, height:24, borderRadius:"50%", background:BRAND.gold, color:BRAND.navy, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>✓</div>}
                  </div>
                  <div style={{ padding:"18px 20px" }}>
                    <h3 className="cormorant" style={{ fontSize:22, fontWeight:600, color:isSelected?BRAND.white:BRAND.navyMid, marginBottom:10 }}>{m.name}</h3>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                      <div>
                        <div style={{ fontSize:10, color:isSelected?"rgba(255,255,255,0.4)":BRAND.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2 }}>Exchange Bonus</div>
                        <div className="cormorant" style={{ fontSize:26, fontWeight:700, color:BRAND.gold }}>{m.bonus}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, color:isSelected?BRAND.gold:"#1e8449", fontWeight:600 }}>{m.extra}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:BRAND.navyMid, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Exchange Process</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", color:BRAND.white }}>How the Exchange <span className="gold-shimmer">Works</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {exchangeSteps.map((step,i) => (
              <div key={step.num} style={{ textAlign:"center", position:"relative", animation:`eb-fadeUp 0.5s ease ${i*0.1}s both` }}>
                {i < exchangeSteps.length-1 && (
                  <div style={{ position:"absolute", top:36, left:"65%", width:"70%", height:1, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, zIndex:0 }} />
                )}
                <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 16px", position:"relative", zIndex:1 }}>{step.icon}</div>
                <div className="cormorant" style={{ fontSize:13, color:BRAND.gold, letterSpacing:"0.2em", marginBottom:6 }}>STEP {step.num}</div>
                <div style={{ fontSize:15, fontWeight:600, color:BRAND.white, marginBottom:8 }}>{step.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FORM + ACCEPTED BRANDS ── */}
      <div style={{ background:BRAND.white, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>

            {/* ── FORM ── */}
            <div style={{ background:BRAND.navyMid, padding:"40px 36px" }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Free Car Valuation</div>
              <h3 className="cormorant" style={{ fontSize:34, color:BRAND.white, marginBottom:28 }}>Get Your Exchange Quote</h3>

              {submitted ? (
                /* ── SUCCESS ── */
                <div style={{ textAlign:"center", padding:"36px 0" }}>
                  <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
                  <div className="cormorant" style={{ fontSize:32, color:BRAND.white, marginBottom:10 }}>Quote Request Sent!</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:20 }}>
                    Our exchange specialist will call <strong style={{ color:BRAND.gold }}>{formData.phone}</strong> within 2 hours.
                  </div>
                  {formData.newModel && (
                    <div style={{ background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}`, padding:"14px 18px", marginBottom:20, textAlign:"left" }}>
                      <div style={{ fontSize:11, color:BRAND.gold, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>New Model of Interest</div>
                      <div style={{ fontSize:16, color:BRAND.white, fontFamily:"'Cormorant Garamond',serif" }}>{formData.newModel}</div>
                    </div>
                  )}
                  <button className="eb-btn-outline" onClick={handleReset} style={{ padding:"12px 28px", fontSize:12, borderRadius:2 }}>
                    New Enquiry
                  </button>
                </div>
              ) : (
                /* ── FORM FIELDS ── */
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Your Details */}
                  <div style={{ fontSize:10, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", paddingBottom:4, borderBottom:`1px solid rgba(184,150,62,0.1)`, marginBottom:2 }}>Your Details</div>
                  {[
                    ["name",  "Your Name *",     "text", "Full name"],
                    ["phone", "Mobile Number *", "tel",  "+91 98765 43210"],
                  ].map(([k,l,t,p]) => (
                    <div key={k}>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>{l}</label>
                      <input type={t} placeholder={p} className="eb-input" value={formData[k]} onChange={e => updateForm(k, e.target.value)} />
                    </div>
                  ))}

                  {/* Current Vehicle */}
                  <div style={{ fontSize:10, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", paddingBottom:4, borderBottom:`1px solid rgba(184,150,62,0.1)`, marginTop:4, marginBottom:2 }}>Your Current Vehicle</div>
                  <div>
                    <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Vehicle Brand *</label>
                    <select className="eb-select" value={formData.oldBrand} onChange={e => updateForm("oldBrand", e.target.value)}>
                      <option value="">Select brand</option>
                      {acceptedBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {[
                    ["oldModel", "Model Name *",       "text", "e.g. Swift, Creta"],
                    ["oldYear",  "Year of Purchase",   "text", "e.g. 2019"],
                    ["oldKm",    "Kilometres Driven",  "text", "e.g. 45,000 km"],
                  ].map(([k,l,t,p]) => (
                    <div key={k}>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>{l}</label>
                      <input type={t} placeholder={p} className="eb-input" value={formData[k]} onChange={e => updateForm(k, e.target.value)} />
                    </div>
                  ))}

                  {/* New Vehicle & Location */}
                  <div style={{ fontSize:10, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", paddingBottom:4, borderBottom:`1px solid rgba(184,150,62,0.1)`, marginTop:4, marginBottom:2 }}>New Vehicle & Location</div>
                  <div>
                    <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>New Tata Model Interested In</label>
                    <select className="eb-select" value={formData.newModel} onChange={e => { updateForm("newModel", e.target.value); setSelectedNew(e.target.value); }}>
                      <option value="">Select model</option>
                      {exchangeBonusModels.map(m => <option key={m.name} value={m.name}>{m.name} — Bonus {m.bonus}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Nearest Showroom City</label>
                    <select className="eb-select" value={formData.city} onChange={e => updateForm("city", e.target.value)}>
                      <option value="">Select city</option>
                      {["Belgaum","Hubbli","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Error message */}
                  {submitStatus === "error" && (
                    <div style={{ fontSize:13, color:"#f87171", padding:"10px 14px", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:2 }}>
                      ⚠ {errorMsg}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    className="eb-btn-gold"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitStatus === "loading"}
                    style={{ padding:"14px", fontSize:12, borderRadius:2, marginTop:4 }}
                  >
                    {submitStatus === "loading" ? "Submitting…" : "Get My Exchange Quote →"}
                  </button>
                </div>
              )}
            </div>

            {/* ── ACCEPTED BRANDS + DOCS ── */}
            <div>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Accepted Brands</div>
              <h3 className="cormorant" style={{ fontSize:34, color:BRAND.navyMid, marginBottom:20 }}>We Accept All Major Brands</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
                {acceptedBrands.map(b => (
                  <span key={b} className="eb-model-pill" style={{ padding:"8px 16px", fontSize:12, borderRadius:2, background:BRAND.offWhite, color:BRAND.navyMid }}>{b}</span>
                ))}
              </div>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Documents Required</div>
              <div style={{ background:BRAND.offWhite, padding:"24px" }}>
                {[
                  ["📄","Original RC Book",  "Registration Certificate — original required"],
                  ["🛡️","Valid Insurance",    "Current policy copy"],
                  ["🌿","PUC Certificate",   "Valid Pollution Under Control cert"],
                  ["🪪","Photo ID",           "Aadhaar / PAN / Passport"],
                  ["📋","Service Records",   "All available service history booklets"],
                  ["🔑","All Keys",           "Both sets of vehicle keys"],
                ].map(([icon,title,desc]) => (
                  <div key={title} style={{ display:"flex", gap:14, padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.05)", alignItems:"flex-start" }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:BRAND.navyMid }}>{title}</div>
                      <div style={{ fontSize:11, color:BRAND.muted, marginTop:2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background:BRAND.offWhite, padding:"64px 48px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Common Questions</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.navyMid }}>Exchange FAQs</h2>
          </div>
          {faqs.map((faq,i) => (
            <div key={i} style={{ borderBottom:`1px solid rgba(10,31,63,0.08)`, overflow:"hidden" }}>
              <div onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0", cursor:"pointer" }}>
                <span style={{ fontSize:14, fontWeight:500, color:BRAND.navyMid, paddingRight:24 }}>{faq.q}</span>
                <span style={{ color:BRAND.gold, fontSize:20, flexShrink:0, transition:"transform 0.3s", display:"inline-block", transform:openFaq===i?"rotate(45deg)":"rotate(0)" }}>+</span>
              </div>
              <div style={{ maxHeight:openFaq===i?200:0, overflow:"hidden", transition:"max-height 0.35s ease" }}>
                <p style={{ fontSize:13, color:BRAND.muted, lineHeight:1.8, paddingBottom:20 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"68px 48px" }}>
        <div style={{ ...W, padding:0, display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:14 }}>Ready to Upgrade?</div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,50px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:18 }}>Visit Your Nearest<br />Manickbag Showroom</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>Walk in with your old car and walk out with a brand new Tata — same day. Our exchange specialists are ready across all 12 locations.</p>
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {/* Find Showroom → Google Maps */}
            <button className="eb-btn-gold" onClick={openMap} style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>
              📍 Find Showroom
            </button>
            {/* Call Exchange Desk → WhatsApp */}
            <button className="eb-btn-outline" onClick={openWA} style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>
              📞 Call Exchange Desk
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}