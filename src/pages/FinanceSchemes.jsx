import { useState } from "react";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const PageStyles = () => (
  <style>{`
    @keyframes fs-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fs-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes fs-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes fs-ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes fs-countUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

    .fs-fadeUp  { animation: fs-fadeUp  0.6s ease forwards; }
    .fs-fadeIn  { animation: fs-fadeIn  0.5s ease forwards; }

    .fs-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s ease; }
    .fs-btn-gold:hover { opacity:0.88; transform:translateY(-1px); }

    .fs-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .fs-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .fs-bank-card { transition:all 0.25s ease; cursor:default; }
    .fs-bank-card:hover { transform:translateY(-3px); border-color:rgba(184,150,62,0.3) !important; }

    .fs-scheme-tab { cursor:pointer; transition:all 0.25s ease; border-bottom:2px solid transparent; font-family:'Jost',sans-serif; }
    .fs-scheme-tab.active { border-bottom-color:#b8963e; color:#b8963e !important; }
    .fs-scheme-tab:hover { color:#b8963e !important; }

    .fs-input { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; transition:border-color 0.2s; }
    .fs-input:focus { border-color:#b8963e; }
    .fs-input::placeholder { color:rgba(255,255,255,0.3); }

    .fs-select { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; cursor:pointer; }
    .fs-select option { background:#0c1f3f; color:#fff; }

    .fs-slider { -webkit-appearance:none; width:100%; height:3px; background:rgba(184,150,62,0.2); border-radius:2px; outline:none; cursor:pointer; }
    .fs-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#b8963e; cursor:pointer; box-shadow:0 0 8px rgba(184,150,62,0.4); }

    .fs-emi-result { animation: fs-countUp 0.3s ease forwards; }

    .fs-ticker-inner { display:flex; white-space:nowrap; animation:fs-ticker 28s linear infinite; }
    .fs-ticker-inner:hover { animation-play-state:paused; }
  `}</style>
);

const W = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px" };

// ─── DATA ─────────────────────────────────────────────────────────
const financeSchemes = [
  { id:"low-emi",  tag:"Most Popular",        tagColor:BRAND.gold,  title:"Low EMI Scheme",           subtitle:"Minimum Monthly Outflow",        icon:"📉", highlight:"EMI from ₹5,499/mo",        desc:"Stretch your loan tenure up to 84 months for the lowest possible monthly EMI. Ideal for salaried individuals managing monthly budgets.", features:["Tenure up to 84 months","EMI as low as ₹5,499/month","Loan up to 90% on-road price","Minimal documentation","Doorstep processing available"], rate:"8.99% p.a.", tenure:"Up to 84 months", eligible:"Salaried & Self-Employed" },
  { id:"zero-dp",  tag:"Zero Down Payment",   tagColor:"#1a5276",   title:"Zero Down Payment",          subtitle:"Drive Now, Pay Later",           icon:"🚀", highlight:"100% On-Road Funding",       desc:"Own your new Tata without paying anything upfront. We fund the full on-road price including insurance and registration for eligible applicants.", features:["Zero down payment required","100% on-road price funded","Insurance included in loan","Registration charges covered","Subject to credit approval"], rate:"9.49% p.a.", tenure:"Up to 72 months", eligible:"Select profiles — Govt & PSU employees preferred" },
  { id:"zero-cost",tag:"Limited Period",       tagColor:"#1e8449",   title:"Zero Cost EMI",              subtitle:"No Interest, No Processing Fee", icon:"✨", highlight:"0% Interest — Selected Models",desc:"Pay only the vehicle cost spread across equal monthly instalments with zero interest and zero processing fees on select Tata models.", features:["0% interest rate","Zero processing fee","Available on Tiago, Tigor, Punch","6 / 9 / 12 month plans","Valid April–May 2026"], rate:"0% p.a.", tenure:"6 / 9 / 12 months", eligible:"Credit card & select bank customers" },
  { id:"balloon",  tag:"Smart Plan",           tagColor:"#5d3f7a",   title:"Balloon Payment Scheme",     subtitle:"Low EMI + Residual Value",       icon:"🎈", highlight:"Pay Less Every Month",        desc:"Pay a smaller EMI every month for the tenure with a larger balloon payment at the end. Ideal if you expect a lump sum income in the future.", features:["30–40% lower monthly EMI","Residual value at end of tenure","Tenure 36 or 48 months","Option to refinance balloon amount","Great for business owners"], rate:"9.25% p.a.", tenure:"36 / 48 months", eligible:"Business owners & HNIs" },
  { id:"loyalty",  tag:"Existing Tata Owners", tagColor:"#784212",   title:"Loyalty Finance Scheme",     subtitle:"Reward for Being a Tata Family", icon:"🏆", highlight:"Special Rate + ₹10,000 Bonus", desc:"Existing Tata vehicle owners get preferential interest rates and an additional ₹10,000 cash benefit when they finance their next Tata through us.", features:["Rate as low as 7.99% p.a.","₹10,000 loyalty cash benefit","Faster approval — pre-verified","Top-up loan option available","No foreclosure charges (year 3+)"], rate:"From 7.99% p.a.", tenure:"Up to 84 months", eligible:"Existing Tata vehicle owners" },
  { id:"ev-special",tag:"EV Special",          tagColor:"#1e6b3e",   title:"Green EV Finance",           subtitle:"Special Rates for Electric Vehicles",icon:"🔋",highlight:"Lowest Rate for EV Buyers",  desc:"Government-backed green vehicle financing with the lowest interest rates available, subsidised processing, and longer loan tenure for all Tata EVs.", features:["Rate from 7.49% p.a.","FAME-II subsidy assistance","Longer tenure up to 96 months","Free home charger with loan","Battery insurance included"], rate:"From 7.49% p.a.", tenure:"Up to 96 months", eligible:"All EV buyers" },
];

const bankPartners = [
  { name:"HDFC Bank",        icon:"🏦", rate:"From 8.50%", type:"Preferred Partner" },
  { name:"ICICI Bank",       icon:"🟠", rate:"From 8.75%", type:"Preferred Partner" },
  { name:"SBI",              icon:"🟦", rate:"From 8.25%", type:"Govt. Bank"        },
  { name:"Axis Bank",        icon:"🔴", rate:"From 8.99%", type:"Partner Bank"      },
  { name:"Kotak Mahindra",   icon:"🟤", rate:"From 8.75%", type:"Partner Bank"      },
  { name:"Tata Capital",     icon:"⭐", rate:"From 7.99%", type:"OEM Finance Arm"   },
  { name:"Bajaj Finserv",    icon:"🔵", rate:"From 9.25%", type:"NBFC Partner"      },
  { name:"Mahindra Finance", icon:"🟢", rate:"From 9.50%", type:"NBFC Partner"      },
];

const eligibilityDocs = [
  { icon:"🪪", title:"Identity Proof",    items:["Aadhaar Card","PAN Card","Passport"] },
  { icon:"📍", title:"Address Proof",     items:["Aadhaar Card","Utility Bill","Rent Agreement"] },
  { icon:"💼", title:"Income Proof",      items:["3 months salary slips","6 months bank statement","ITR (self-employed)"] },
  { icon:"📄", title:"Vehicle Documents", items:["Proforma Invoice","Insurance quote","RC (for exchange)"] },
];

const faqs = [
  { q:"What is the minimum income required to get a car loan?",     a:"For salaried individuals, a minimum net monthly income of ₹15,000 is generally required. Self-employed applicants must show an annual income of ₹2L+ through ITR. Criteria vary by bank." },
  { q:"How long does loan approval take at Manickbag?",             a:"We process most applications within 4–24 hours. Our in-house finance team has dedicated relationships with 8+ banks to expedite approvals, often on the same day." },
  { q:"Can I prepay or foreclose my car loan early?",               a:"Yes. Most banks allow foreclosure after 6–12 months. Foreclosure charges typically range from 2–5% of the outstanding principal. Tata Capital and SBI waive charges after year 3." },
  { q:"Is there a processing fee?",                                  a:"Processing fees range from 0.5% to 1.5% of the loan amount depending on the bank and scheme. Zero Cost EMI scheme has zero processing fees. We negotiate the lowest possible fee for you." },
  { q:"What is the maximum loan amount I can get?",                  a:"Banks fund up to 90% of the on-road price for most applicants. Under the Zero Down Payment scheme, 100% on-road funding is possible for select credit profiles." },
  { q:"Can I apply for finance before choosing a specific model?",   a:"Yes! You can get a pre-approved loan sanction letter from us, which gives you a clear budget and faster delivery once you finalise your model." },
];

// ─── TICKER ───────────────────────────────────────────────────────
const Ticker = () => {
  const items = ["EMI from ₹5,499/month","0% Interest on Select Models","Zero Down Payment Available","Loan Approval in 4 Hours","8+ Bank Partners","EV Finance from 7.49% p.a."];
  const doubled = [...items, ...items];
  return (
    <div style={{ background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow:"hidden", padding:"10px 0" }}>
      <div className="fs-ticker-inner">
        {doubled.map((item,i) => (
          <span key={i} style={{ padding:"0 28px", fontSize:11, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:BRAND.navy, display:"inline-flex", alignItems:"center", gap:14 }}>
            {item}<span style={{ opacity:0.35 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── EMI CALCULATOR ───────────────────────────────────────────────
const EMICalculator = () => {
  const [loanAmt, setLoanAmt] = useState(600000);
  const [rate,    setRate]    = useState(8.99);
  const [tenure,  setTenure]  = useState(60);

  const mr  = rate/12/100;
  const emi = loanAmt*mr*Math.pow(1+mr,tenure)/(Math.pow(1+mr,tenure)-1);
  const tp  = emi*tenure;
  const ti  = tp-loanAmt;
  const fmt = (n) => "₹"+Math.round(n).toLocaleString("en-IN");

  return (
    <div style={{ background:BRAND.navyMid, padding:"40px 36px" }}>
      <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>EMI Calculator</div>
      <h3 className="cormorant" style={{ fontSize:32, color:BRAND.white, marginBottom:28 }}>Plan Your Monthly Budget</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
        {[{ label:"Loan Amount", value:loanAmt, min:100000, max:3000000, step:10000, set:setLoanAmt, fmt:fmt },
          { label:"Interest Rate (% p.a.)", value:rate, min:7, max:15, step:0.25, set:setRate, fmt:(v)=>v.toFixed(2)+"% p.a." },
          { label:"Loan Tenure", value:tenure, min:12, max:96, step:12, set:setTenure, fmt:(v)=>v+" months" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <label style={{ fontSize:11, letterSpacing:"0.1em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{s.label}</label>
              <span className="cormorant" style={{ fontSize:20, color:BRAND.gold, fontWeight:600 }}>{s.fmt(s.value)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={e => s.set(Number(e.target.value))} className="fs-slider" />
          </div>
        ))}
        <div style={{ background:"rgba(184,150,62,0.08)", border:`1px solid ${BRAND.borderLight}`, padding:"24px" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:6 }}>Your Monthly EMI</div>
            <div className="cormorant fs-emi-result" key={`${loanAmt}-${rate}-${tenure}`}
              style={{ fontSize:52, fontWeight:700, color:BRAND.gold, lineHeight:1 }}>{fmt(emi)}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:4 }}>per month</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["Principal",fmt(loanAmt)],["Total Interest",fmt(ti)],["Total Payable",fmt(tp)],["Tenure",`${tenure} months`]].map(([label,val]) => (
              <div key={label} style={{ padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:2 }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                <div className="cormorant" style={{ fontSize:18, color:BRAND.white, fontWeight:600 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center" }}>* Indicative values only. Actual EMI subject to bank approval.</div>
        </div>
        <button className="fs-btn-gold" style={{ padding:"14px", fontSize:12, borderRadius:2 }}>Apply for This Loan →</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function FinanceSchemes() {
  const [activeScheme, setActiveScheme] = useState("low-emi");
  const [openFaq,      setOpenFaq]      = useState(null);
  const [formData,     setFormData]     = useState({ name:"",phone:"",income:"",employment:"",model:"",city:"" });
  const [submitted,    setSubmitted]    = useState(false);

  const updateForm = (k,v) => setFormData(f => ({ ...f,[k]:v }));
  const canSubmit = formData.name && formData.phone && formData.employment;
  const selected = financeSchemes.find(s => s.id === activeScheme);

  return (
    <Layout>
      <PageStyles />
      <Ticker />

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 55%,${BRAND.navy} 100%)`, padding:"80px 48px 72px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-80, top:-80, width:500, height:500, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.07)` }} />
        <div style={{ position:"absolute", right:60,  top:60,  width:280, height:280, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.12)` }} />
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.22, left:`${10+i*14}%`, top:`${25+(i%3)*22}%`, animation:`fs-pulse ${2+i*0.35}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
        ))}
        <div style={W}>
          <div className="fs-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:22, opacity:0, animationDelay:"0.1s" }}>
            <div style={{ width:36, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>Finance & Loan Schemes</span>
          </div>
          <h1 className="cormorant fs-fadeUp" style={{ fontSize:"clamp(44px,6vw,82px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, maxWidth:780, opacity:0, animationDelay:"0.2s", whiteSpace:"pre-line" }}>
            {"Your Dream Tata.\nAffordable Today."}
          </h1>
          <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
          <p className="fs-fadeUp" style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,0.6)", maxWidth:540, marginBottom:44, opacity:0, animationDelay:"0.35s" }}>
            Six tailored finance schemes — from zero down payment to EV-special green loans — designed to fit every budget, profession, and lifestyle across North Karnataka.
          </p>
          <div className="fs-fadeUp" style={{ display:"flex", gap:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", opacity:0, animationDelay:"0.45s", flexWrap:"wrap" }}>
            {[["7.49%","Lowest Rate p.a."],["₹5,499","EMI Starting From"],["8+","Bank Partners"],["4 hrs","Loan Approval"]].map(([val,lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize:38, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCHEME TABS ── */}
      <div style={{ background:BRAND.offWhite, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Our Schemes</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", color:BRAND.navyMid }}>Choose Your Finance Plan</h2>
          </div>
          <div style={{ display:"flex", gap:0, borderBottom:`1px solid rgba(0,0,0,0.08)`, marginBottom:40, overflowX:"auto" }}>
            {financeSchemes.map(s => (
              <button key={s.id} className={`fs-scheme-tab ${activeScheme===s.id?"active":""}`}
                onClick={() => setActiveScheme(s.id)}
                style={{ padding:"12px 22px", fontSize:12, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", background:"transparent", border:"none", color:activeScheme===s.id?BRAND.gold:BRAND.muted, whiteSpace:"nowrap" }}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>
          {selected && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, animation:"fs-fadeUp 0.4s ease both" }}>
              <div>
                <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:44 }}>{selected.icon}</span>
                  <div>
                    <div style={{ display:"inline-block", background:selected.tagColor, color:BRAND.white, fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"3px 10px", textTransform:"uppercase", marginBottom:6 }}>{selected.tag}</div>
                    <h3 className="cormorant" style={{ fontSize:34, fontWeight:600, color:BRAND.navyMid, lineHeight:1.1 }}>{selected.title}</h3>
                  </div>
                </div>
                <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12, fontWeight:600 }}>{selected.subtitle}</div>
                <div className="cormorant" style={{ fontSize:28, color:BRAND.navyMid, marginBottom:16, fontWeight:600 }}>{selected.highlight}</div>
                <p style={{ fontSize:14, color:BRAND.muted, lineHeight:1.8, marginBottom:24 }}>{selected.desc}</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
                  {[["Interest Rate",selected.rate],["Tenure",selected.tenure],["Eligible",selected.eligible]].map(([label,val]) => (
                    <div key={label} style={{ background:BRAND.white, padding:"16px 14px", border:`1px solid rgba(0,0,0,0.06)` }}>
                      <div style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.muted, marginBottom:6 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:BRAND.navyMid, lineHeight:1.4 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12, fontWeight:600 }}>Scheme Highlights</div>
                {selected.features.map((f,i) => (
                  <div key={i} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(0,0,0,0.05)", alignItems:"center" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:BRAND.gold, flexShrink:0 }} />
                    <span style={{ fontSize:13, color:BRAND.navyMid }}>{f}</span>
                  </div>
                ))}
                <button className="fs-btn-gold" style={{ padding:"13px 32px", fontSize:12, borderRadius:2, marginTop:28 }}>Apply for {selected.title} →</button>
              </div>
              <div style={{ background:BRAND.navyMid, padding:"36px 32px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:16 }}>Scheme at a Glance</div>
                {[["Scheme Type",selected.title],["Interest Rate",selected.rate],["Loan Tenure",selected.tenure],["Eligibility",selected.eligible],["Processing","In-house at Manickbag"],["Disbursement","Within 24–48 hours"]].map(([label,val]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{label}</span>
                    <span style={{ fontSize:13, color:BRAND.white, fontWeight:500, textAlign:"right", maxWidth:"55%" }}>{val}</span>
                  </div>
                ))}
                <div style={{ marginTop:28, padding:"20px", background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}` }}>
                  <div style={{ fontSize:11, color:BRAND.gold, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Key Benefit</div>
                  <div className="cormorant" style={{ fontSize:24, color:BRAND.white, lineHeight:1.3 }}>{selected.highlight}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CALCULATOR + FORM ── */}
      <div style={{ background:BRAND.white, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Tools & Application</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,46px)", color:BRAND.navyMid }}>Calculate & Apply</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
            <EMICalculator />
            <div style={{ background:BRAND.navyMid, padding:"40px 36px" }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Quick Application</div>
              <h3 className="cormorant" style={{ fontSize:32, color:BRAND.white, marginBottom:28 }}>Get Pre-Approved Today</h3>
              {submitted ? (
                <div style={{ textAlign:"center", padding:"36px 0" }}>
                  <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
                  <div className="cormorant" style={{ fontSize:32, color:BRAND.white, marginBottom:10 }}>Application Received!</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:20 }}>Our finance team will call <strong style={{ color:BRAND.gold }}>{formData.phone}</strong> within 4 hours.</div>
                  <button className="fs-btn-outline" onClick={() => { setSubmitted(false); setFormData({ name:"",phone:"",income:"",employment:"",model:"",city:"" }); }}
                    style={{ padding:"12px 28px", fontSize:12, borderRadius:2 }}>New Application</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[["name","Full Name","text","Your full name"],["phone","Mobile Number","tel","+91 98765 43210"]].map(([k,l,t,p]) => (
                    <div key={k}>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>{l}</label>
                      <input type={t} placeholder={p} className="fs-input" value={formData[k]} onChange={e => updateForm(k,e.target.value)} />
                    </div>
                  ))}
                  {[["employment","Employment Type",[["salaried","Salaried — Private Company"],["govt","Salaried — Government / PSU"],["selfemployed","Self-Employed / Business"],["professional","Professional (Doctor/CA/Lawyer)"],["farmer","Farmer / Agricultural"]]],
                    ["income","Monthly Income (approx.)",[["15-25k","₹15,000 – ₹25,000"],["25-50k","₹25,000 – ₹50,000"],["50-100k","₹50,000 – ₹1,00,000"],["100k+","Above ₹1,00,000"]]],
                    ["model","Vehicle of Interest",["Tiago","Tiago EV","Altroz","Tigor","Tigor EV","Punch","Punch EV","Nexon","Nexon EV","Harrier","Harrier EV","Safari","Curvv","Curvv EV"].map(m=>[m,m])],
                    ["city","Nearest Showroom City",["Belgaum","Hubbli","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"].map(c=>[c,c])],
                  ].map(([k,l,opts]) => (
                    <div key={k}>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>{l}</label>
                      <select className="fs-select" value={formData[k]} onChange={e => updateForm(k,e.target.value)}>
                        <option value="">Select {l.toLowerCase()}</option>
                        {opts.map(([v,label]) => <option key={v} value={v}>{label}</option>)}
                      </select>
                    </div>
                  ))}
                  <button className="fs-btn-gold" onClick={() => canSubmit && setSubmitted(true)}
                    style={{ padding:"14px", fontSize:12, borderRadius:2, marginTop:4, opacity:canSubmit?1:0.5 }}>
                    Get Pre-Approval →
                  </button>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", textAlign:"center", lineHeight:1.6 }}>No credit score impact. Pre-approval is a soft enquiry only.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BANK PARTNERS ── */}
      <div style={{ background:BRAND.offWhite, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Finance Partners</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.navyMid }}>8+ Bank & NBFC Partners</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {bankPartners.map((b,i) => (
              <div key={b.name} className="fs-bank-card"
                style={{ background:BRAND.white, border:"1px solid rgba(0,0,0,0.06)", padding:"24px 20px", textAlign:"center", animation:`fs-fadeUp 0.5s ease ${i*0.07}s both` }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{b.icon}</div>
                <div style={{ fontSize:14, fontWeight:600, color:BRAND.navyMid, marginBottom:6 }}>{b.name}</div>
                <div className="cormorant" style={{ fontSize:22, color:BRAND.gold, fontWeight:600, marginBottom:6 }}>{b.rate}</div>
                <div style={{ fontSize:10, color:BRAND.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{b.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DOCS ── */}
      <div style={{ background:BRAND.navyMid, padding:"64px 48px" }}>
        <div style={W}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.white, marginBottom:10 }}>Documents You'll Need</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)" }}>Gather these in advance to speed up your loan approval.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {eligibilityDocs.map((d,i) => (
              <div key={d.title} style={{ animation:`fs-fadeUp 0.5s ease ${i*0.1}s both` }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{d.icon}</div>
                <div style={{ fontSize:15, fontWeight:600, color:BRAND.gold, marginBottom:12 }}>{d.title}</div>
                {d.items.map(item => (
                  <div key={item} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", alignItems:"center" }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:BRAND.gold, flexShrink:0, opacity:0.6 }} />
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background:BRAND.white, padding:"64px 48px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Common Questions</span>
              <div style={{ width:40, height:1, background:BRAND.gold }} />
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.navyMid }}>Finance FAQs</h2>
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
            <div style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, marginBottom:14 }}>Talk to a Finance Expert</div>
            <h2 className="cormorant" style={{ fontSize:"clamp(30px,3.5vw,50px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:18 }}>Let Us Find the Best<br />Scheme for You</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>Our in-house finance advisors compare across 8+ banks to get you the lowest rate and fastest approval — at zero extra cost to you.</p>
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"flex-end" }}>
            <button className="fs-btn-gold" style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>📞 Talk to Finance Advisor</button>
            <button className="fs-btn-outline" style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>📍 Visit Showroom</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}