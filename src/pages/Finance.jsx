import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";


const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const PageStyles = () => (
  <style>{`
    @keyframes fin-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fin-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes fin-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
    @keyframes fin-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
    @keyframes fin-countUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

    .fin-fadeUp { animation: fin-fadeUp 0.7s ease forwards; }
    .fin-fadeIn { animation: fin-fadeIn 0.5s ease forwards; }

    .fin-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; position:relative; overflow:hidden; }
    .fin-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .fin-btn-gold:hover::before { opacity:1; }
    .fin-btn-gold span { position:relative; z-index:1; }

    .fin-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .fin-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .fin-bank-card { transition:all 0.35s ease; cursor:default; }
    .fin-bank-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(0,0,0,0.1); border-color:#b8963e !important; }

    .fin-feature-card { transition:all 0.35s ease; }
    .fin-feature-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.08); border-bottom-color:#b8963e !important; }

    .fin-input { width:100%; padding:14px 16px; border:1px solid rgba(10,31,63,0.15); background:#fff; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; transition:border 0.3s, box-shadow 0.3s; border-radius:2px; }
    .fin-input:focus { border-color:#b8963e; box-shadow:0 0 0 3px rgba(184,150,62,0.1); }
    .fin-input::placeholder { color:#b0b7c3; }

    .fin-select { width:100%; padding:14px 16px; border:1px solid rgba(10,31,63,0.15); background:#fff; font-family:'Jost',sans-serif; font-size:14px; color:#0c1f3f; outline:none; cursor:pointer; transition:border 0.3s; appearance:none; border-radius:2px; }
    .fin-select:focus { border-color:#b8963e; box-shadow:0 0 0 3px rgba(184,150,62,0.1); }

    .fin-range { -webkit-appearance:none; width:100%; height:4px; background:linear-gradient(to right,#b8963e var(--val,50%),rgba(10,31,63,0.15) var(--val,50%)); border-radius:2px; outline:none; cursor:pointer; }
    .fin-range::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:linear-gradient(135deg,#b8963e,#d4af5a); cursor:pointer; box-shadow:0 2px 8px rgba(184,150,62,0.4); }

    .fin-step-line { position:absolute; top:36px; left:calc(50% + 36px); width:calc(100% - 72px); height:1px; background:linear-gradient(90deg,#b8963e,transparent); }

    .fin-success { animation: fin-fadeIn 0.4s ease; }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ── Hero ──────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ minHeight:"62vh", background:`linear-gradient(135deg,${BRAND.navy} 0%,#0e2a5c 55%,${BRAND.navyMid} 100%)`, display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
    {["₹","₹","₹"].map((s,i) => (
      <div key={i} style={{ position:"absolute", fontFamily:"'Cormorant Garamond',serif", fontSize:160+i*60, fontWeight:700, color:"rgba(184,150,62,0.03)", top:`${10+i*20}%`, right:`${2+i*8}%`, lineHeight:1, pointerEvents:"none", animation:`fin-float ${6+i*2}s ease-in-out infinite`, animationDelay:`${i*1.5}s` }}>{s}</div>
    ))}
    <div style={{ position:"absolute", right:"6%", top:"15%", width:360, height:360, border:"1px solid rgba(184,150,62,0.07)", borderRadius:4, transform:"rotate(20deg)", animation:"fin-float 8s ease-in-out infinite" }} />
    {[...Array(7)].map((_,i) => (
      <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.3, left:`${8+i*12}%`, top:`${20+(i%3)*22}%`, animation:`fin-pulse ${2+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.4}s` }} />
    ))}
    <div style={{ ...W, paddingTop:80, paddingBottom:80 }}>
      <div className="fin-fadeIn" style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32, opacity:0, animationDelay:"0.1s" }}>
        <Link to="/" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", letterSpacing:"0.08em" }}>Home</Link>
        <span style={{ color:"rgba(255,255,255,0.25)" }}>›</span>
        <span style={{ fontSize:12, color:BRAND.gold, letterSpacing:"0.08em" }}>Finance</span>
      </div>
      <div className="fin-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:24, opacity:0, animationDelay:"0.15s" }}>
        <div style={{ width:32, height:1, background:BRAND.gold }} />
        <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>Easy Vehicle Finance</span>
      </div>
      <h1 className="cormorant fin-fadeUp" style={{ fontSize:"clamp(44px,6vw,82px)", fontWeight:300, lineHeight:1.1, color:BRAND.white, maxWidth:700, animationDelay:"0.2s", opacity:0 }}>
        Drive Home Today.<br /><span className="gold-shimmer">Finance Made Simple.</span>
      </h1>
      <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
      <p className="fin-fadeUp" style={{ fontSize:17, lineHeight:1.8, color:"rgba(255,255,255,0.65)", maxWidth:540, marginBottom:40, animationDelay:"0.4s", opacity:0 }}>
        Partnered with leading national & local banks to bring you the lowest EMIs, quickest approvals, and most flexible repayment plans in North Karnataka.
      </p>
      <div className="fin-fadeUp" style={{ display:"flex", gap:16, animationDelay:"0.5s", opacity:0 }}>
        <a href="#apply" className="fin-btn-gold" style={{ padding:"14px 36px", fontSize:13, borderRadius:2, textDecoration:"none", display:"inline-flex" }}><span>Apply for Loan</span></a>
        <a href="#calculator" className="fin-btn-outline" style={{ padding:"14px 36px", fontSize:13, borderRadius:2, textDecoration:"none", display:"inline-flex" }}>EMI Calculator</a>
      </div>
      <div className="fin-fadeUp" style={{ display:"flex", gap:48, marginTop:64, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animationDelay:"0.6s", opacity:0, flexWrap:"wrap" }}>
        {[{ v:"10+", l:"Bank Partners" },{ v:"7.5%", l:"Interest From" },{ v:"84", l:"Months Max Tenure" },{ v:"90%", l:"Max Funding" }].map(s => (
          <div key={s.l}>
            <div className="cormorant" style={{ fontSize:38, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:11, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Why Us ────────────────────────────────────────────────────────
const features = [
  { icon:"💸", title:"Lowest EMI Guaranteed",  desc:"We negotiate with multiple lenders to get you the most competitive rate — so your monthly outgo stays minimal." },
  { icon:"⚡", title:"Quick Approval",          desc:"In-showroom processing with most approvals within 24–48 hours. Minimal documentation, maximum speed." },
  { icon:"📋", title:"Flexible Tenure",         desc:"Choose repayment from 12 to 84 months. Align your EMI with your monthly budget — your terms, your comfort." },
  { icon:"🏦", title:"10+ Lending Partners",    desc:"Access to national banks, private banks, NBFCs, and local co-operative banks — all under one roof." },
  { icon:"🔄", title:"Balance Transfer",        desc:"Already have a loan at a higher rate? Transfer to a better lender through us and save on interest cost." },
  { icon:"📱", title:"Digital Processing",      desc:"Apply online or in-showroom. Track your application status digitally with real-time updates from our team." },
];

const WhyUs = () => (
  <section style={{ background:BRAND.offWhite, padding:"100px 0" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Why Choose Us</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>Finance Benefits at Manickbag</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {features.map((f,i) => (
          <div key={f.title} className="fin-feature-card"
            style={{ background:BRAND.white, padding:"40px 32px", borderBottom:"2px solid transparent", transition:"all 0.3s", animation:`fin-fadeUp 0.5s ease ${i*0.1}s both` }}
            onMouseOver={e => { e.currentTarget.style.borderBottomColor=BRAND.gold; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.borderBottomColor="transparent"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ fontSize:36, marginBottom:20 }}>{f.icon}</div>
            <h3 className="cormorant" style={{ fontSize:21, fontWeight:600, color:BRAND.navyMid, marginBottom:12 }}>{f.title}</h3>
            <p style={{ fontSize:14, lineHeight:1.7, color:BRAND.muted }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Banks ─────────────────────────────────────────────────────────
const nationalBanks = [
  { name:"State Bank of India", short:"SBI",   rate:"8.50%", tenure:"84 months", logo:"🏛️" },
  { name:"Bank of Baroda",      short:"BOB",   rate:"8.70%", tenure:"84 months", logo:"🏦" },
  { name:"Canara Bank",         short:"CAN",   rate:"8.80%", tenure:"60 months", logo:"🏦" },
  { name:"HDFC Bank",           short:"HDFC",  rate:"7.50%", tenure:"84 months", logo:"🏢" },
  { name:"ICICI Bank",          short:"ICICI", rate:"7.90%", tenure:"84 months", logo:"🏢" },
  { name:"Axis Bank",           short:"AXIS",  rate:"8.00%", tenure:"84 months", logo:"🏢" },
];
const localBanks = [
  { name:"Karnataka Bank",        short:"KBL",  rate:"9.00%",  tenure:"60 months", logo:"🏦" },
  { name:"Vijaya Bank (BOB)",     short:"VBL",  rate:"8.90%",  tenure:"72 months", logo:"🏦" },
  { name:"KSCB Co-op Bank",       short:"KSCB", rate:"9.50%",  tenure:"48 months", logo:"🤝" },
  { name:"Bidar DCC Bank",        short:"BDCC", rate:"9.75%",  tenure:"48 months", logo:"🤝" },
  { name:"Gulbarga Urban Co-op",  short:"GUCB", rate:"10.00%", tenure:"36 months", logo:"🤝" },
  { name:"Hubballi Dharwad Bank", short:"HDB",  rate:"9.25%",  tenure:"60 months", logo:"🏦" },
];

const BankCard = ({ bank, i }) => (
  <div className="fin-bank-card" style={{ background:BRAND.white, border:`1px solid rgba(0,0,0,0.06)`, padding:"28px 24px", animation:`fin-fadeUp 0.5s ease ${i*0.08}s both` }}>
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
      <div style={{ width:48, height:48, background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{bank.logo}</div>
      <div>
        <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:BRAND.muted, marginBottom:3 }}>{bank.short}</div>
        <div style={{ fontSize:14, fontWeight:600, color:BRAND.navyMid, lineHeight:1.3 }}>{bank.name}</div>
      </div>
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", paddingTop:16, borderTop:"1px solid rgba(0,0,0,0.06)" }}>
      <div>
        <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:BRAND.muted, marginBottom:4 }}>Interest From</div>
        <div className="cormorant" style={{ fontSize:24, fontWeight:700, color:BRAND.gold }}>{bank.rate}</div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:BRAND.muted, marginBottom:4 }}>Max Tenure</div>
        <div className="cormorant" style={{ fontSize:24, fontWeight:700, color:BRAND.navyMid }}>{bank.tenure}</div>
      </div>
    </div>
  </div>
);

const Banks = () => {
  const [tab, setTab] = useState("national");
  return (
    <section style={{ background:"#ffffff", padding:"100px 0" }}>
      <div style={W}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Our Partners</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>Bank Partners</h2>
          <p style={{ fontSize:15, color:BRAND.muted, marginTop:12 }}>Indicative rates — actual rate depends on vehicle, profile & tenure.</p>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:0, marginBottom:48 }}>
          {[["national","🏛️  National Banks"],["local","🤝  Local & Co-op Banks"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:"13px 32px", fontSize:13, fontFamily:"'Jost',sans-serif", fontWeight:500, letterSpacing:"0.08em", cursor:"pointer", border:`1px solid ${BRAND.borderLight}`, borderRadius:0, background:tab===id?BRAND.navyMid:"transparent", color:tab===id?BRAND.white:BRAND.navyMid, transition:"all 0.3s" }}>
              {label}
            </button>
          ))}
        </div>
        <div key={tab} style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, animation:"fin-fadeIn 0.4s ease" }}>
          {(tab==="national"?nationalBanks:localBanks).map((b,i) => <BankCard key={b.name} bank={b} i={i} />)}
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:BRAND.muted, marginTop:28 }}>* Rates are indicative and subject to change. Contact our finance team for a personalised quote.</p>
      </div>
    </section>
  );
};

// ── Loan Services ─────────────────────────────────────────────────
const loanServices = [
  { icon:"🚗", title:"New Car Loan",              desc:"Finance up to 90% of the on-road price for any new Tata Motors vehicle. Competitive rates, quick disbursal, and flexible tenures up to 84 months.", tag:"Most Popular" },
  { icon:"🔄", title:"Used Car Loan",             desc:"Refinance your existing vehicle or purchase a certified pre-owned car with our used-car finance option. Age & condition norms apply.", tag:"" },
  { icon:"💳", title:"Top-Up Loan",              desc:"Already have a car loan with us? Get a top-up on your existing loan for accessories, service packages, insurance, or personal needs.", tag:"" },
  { icon:"🔁", title:"Balance Transfer",          desc:"Move your existing high-interest car loan to a better-rate lender through us. Save thousands over the remaining tenure.", tag:"Save More" },
  { icon:"🏢", title:"Corporate / Fleet Loan",   desc:"Special rates and bulk financing for companies, fleet operators, cab aggregators, and government purchasers. GST-friendly documentation.", tag:"B2B" },
  { icon:"📄", title:"Self-Employed / Business", desc:"Tailored loan products for business owners, farmers, and self-employed professionals with flexible income-proof norms.", tag:"" },
];

const LoanServices = () => (
  <section style={{ background:BRAND.navyMid, padding:"100px 0", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", left:-80, bottom:-80, width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }} />
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:60 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Finance Products</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.white }}>Loan Services We Provide</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {loanServices.map((s,i) => (
          <div key={s.title} style={{ background:"rgba(255,255,255,0.04)", padding:"36px 28px", borderBottom:"2px solid transparent", position:"relative", cursor:"default", transition:"all 0.3s", animation:`fin-fadeUp 0.5s ease ${i*0.1}s both` }}
            onMouseOver={e => { e.currentTarget.style.borderBottomColor=BRAND.gold; e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
            onMouseOut={e => { e.currentTarget.style.borderBottomColor="transparent"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
            {s.tag && <div style={{ position:"absolute", top:20, right:20, background:BRAND.gold, color:BRAND.navy, fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"4px 10px", textTransform:"uppercase" }}>{s.tag}</div>}
            <div style={{ fontSize:36, marginBottom:18 }}>{s.icon}</div>
            <h3 className="cormorant" style={{ fontSize:22, fontWeight:600, color:BRAND.white, marginBottom:12 }}>{s.title}</h3>
            <p style={{ fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.5)" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── EMI Calculator ────────────────────────────────────────────────
const EMICalculator = () => {
  const [principal, setPrincipal] = useState(600000);
  const [rate,      setRate]      = useState(8.5);
  const [tenure,    setTenure]    = useState(60);

  const calcEMI = (p,r,n) => { const m=r/(12*100); if(m===0) return Math.round(p/n); return Math.round((p*m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1)); };
  const emi        = calcEMI(principal,rate,tenure);
  const totalPay   = emi*tenure;
  const totalInt   = totalPay-principal;
  const intPercent = Math.round((totalInt/totalPay)*100);
  const fmtINR     = (n) => "₹"+n.toLocaleString("en-IN");

  return (
    <section id="calculator" style={{ background:BRAND.offWhite, padding:"100px 0" }}>
      <div style={W}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Plan Your EMI</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>EMI Calculator</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          <div style={{ background:BRAND.white, padding:"40px 36px" }}>
            {[
              { label:"Loan Amount", value:principal, min:100000, max:5000000, step:10000, set:setPrincipal, fmt:(v)=>fmtINR(v) },
              { label:"Interest Rate (% p.a.)", value:rate, min:6, max:18, step:0.1, set:setRate, fmt:(v)=>v.toFixed(1)+"%" },
              { label:"Tenure (Months)", value:tenure, min:12, max:84, step:6, set:setTenure, fmt:(v)=>v+" mo" },
            ].map(s => {
              const pct = ((s.value-s.min)/(s.max-s.min))*100;
              return (
                <div key={s.label} style={{ marginBottom:36 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:BRAND.navyMid }}>{s.label}</span>
                    <span className="cormorant" style={{ fontSize:22, fontWeight:700, color:BRAND.gold }}>{s.fmt(s.value)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.set(Number(e.target.value))}
                    className="fin-range" style={{ "--val":pct+"%" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                    <span style={{ fontSize:11, color:BRAND.muted }}>{s.fmt(s.min)}</span>
                    <span style={{ fontSize:11, color:BRAND.muted }}>{s.fmt(s.max)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div style={{ background:`linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding:"40px 36px", marginBottom:16 }}>
              <div style={{ fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:12 }}>Monthly EMI</div>
              <div className="cormorant" style={{ fontSize:"clamp(40px,5vw,64px)", fontWeight:700, color:BRAND.gold, lineHeight:1 }}>{fmtINR(emi)}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:8 }}>per month for {tenure} months</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
              {[["Principal Amount",fmtINR(principal)],["Total Interest",fmtINR(totalInt)],["Total Payable",fmtINR(totalPay)],["Interest Share",intPercent+"%"]].map(([label,val]) => (
                <div key={label} style={{ background:BRAND.white, padding:"24px 20px", border:`1px solid rgba(0,0,0,0.06)` }}>
                  <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:BRAND.muted, marginBottom:6 }}>{label}</div>
                  <div className="cormorant" style={{ fontSize:26, fontWeight:700, color:BRAND.navyMid }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, background:BRAND.white, padding:"20px 24px", border:`1px solid rgba(0,0,0,0.06)` }}>
              <div style={{ fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:BRAND.muted, marginBottom:12 }}>Principal vs Interest</div>
              <div style={{ height:8, borderRadius:4, overflow:"hidden", background:"rgba(10,31,63,0.08)", display:"flex" }}>
                <div style={{ width:`${100-intPercent}%`, background:`linear-gradient(90deg,${BRAND.navyMid},${BRAND.navyLight})`, transition:"width 0.6s ease" }} />
                <div style={{ width:`${intPercent}%`, background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight})`, transition:"width 0.6s ease" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:BRAND.muted }}><div style={{ width:10, height:10, background:BRAND.navyMid, borderRadius:2 }} /> Principal {100-intPercent}%</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:BRAND.muted }}><div style={{ width:10, height:10, background:BRAND.gold, borderRadius:2 }} /> Interest {intPercent}%</div>
              </div>
            </div>
            <a href="#apply" className="fin-btn-gold" style={{ display:"block", textAlign:"center", marginTop:16, padding:"14px", fontSize:12, borderRadius:2, textDecoration:"none" }}><span>Apply for This Loan →</span></a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Process ───────────────────────────────────────────────────────
const Process = () => (
  <section style={{ background:"#ffffff", padding:"100px 0" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:64 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Simple Process</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>How to Get Your Loan</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0, position:"relative" }}>
        {[{ step:"01",title:"Fill the Form",desc:"Share your basic details using the enquiry form below.",icon:"📝" },{ step:"02",title:"Team Calls You",desc:"Our finance advisor contacts you within 24 hours.",icon:"📞" },{ step:"03",title:"Document Check",desc:"Minimal KYC documents — Aadhaar, PAN, income proof.",icon:"📋" },{ step:"04",title:"Bank Approval",desc:"We apply to the most suitable lender for fastest approval.",icon:"🏦" },{ step:"05",title:"Drive Home!",desc:"Loan disbursed, keys in hand — you drive away.",icon:"🚗" }].map((s,i) => (
          <div key={s.step} style={{ textAlign:"center", padding:"0 16px", position:"relative", animation:`fin-fadeUp 0.5s ease ${i*0.12}s both` }}>
            {i<4 && <div className="fin-step-line" />}
            <div style={{ width:72, height:72, borderRadius:"50%", background:BRAND.navyMid, border:`2px solid ${BRAND.gold}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", position:"relative", zIndex:1 }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, fontWeight:600, marginBottom:6 }}>Step {s.step}</div>
            <h3 className="cormorant" style={{ fontSize:19, fontWeight:600, color:BRAND.navyMid, marginBottom:8 }}>{s.title}</h3>
            <p style={{ fontSize:12, lineHeight:1.7, color:BRAND.muted }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Documents ─────────────────────────────────────────────────────
const Documents = () => (
  <section style={{ background:BRAND.offWhite, padding:"80px 0" }}>
    <div style={W}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
        {[
          { title:"Salaried Applicants",       icon:"👔", docs:["PAN Card (mandatory)","Aadhaar Card / Passport","Last 3 months salary slips","Last 6 months bank statement","Form 16 or IT Returns (latest)","Employment ID / Offer Letter"] },
          { title:"Self-Employed / Business",  icon:"💼", docs:["PAN Card (mandatory)","Aadhaar Card","Last 2 years IT Returns","Last 6 months bank statement","GST Certificate (if applicable)","Business registration proof"] },
          { title:"Agricultural / Farmer",     icon:"🌾", docs:["PAN Card","Aadhaar Card","Land ownership documents","Khasra / Khatuni records","Last 6 months bank statement","Village Certificate (if applicable)"] },
        ].map((cat,i) => (
          <div key={cat.title} style={{ background:BRAND.white, padding:"36px 28px", borderTop:`4px solid ${BRAND.gold}`, animation:`fin-fadeUp 0.5s ease ${i*0.15}s both` }}>
            <div style={{ fontSize:36, marginBottom:16 }}>{cat.icon}</div>
            <h3 className="cormorant" style={{ fontSize:22, fontWeight:600, color:BRAND.navyMid, marginBottom:20 }}>{cat.title}</h3>
            <ul style={{ listStyle:"none" }}>
              {cat.docs.map(d => (
                <li key={d} style={{ display:"flex", gap:10, fontSize:13, color:BRAND.muted, marginBottom:10, alignItems:"flex-start" }}>
                  <span style={{ color:BRAND.gold, fontWeight:700, marginTop:1 }}>✓</span>{d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Apply Form ────────────────────────────────────────────────────
const ApplyForm = () => {
  const [form, setForm] = useState({ name:"",phone:"",email:"",city:"",vehicle:"",loanAmount:"",employmentType:"",message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const set = (k,v) => setForm(f => ({ ...f,[k]:v }));
  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name="Name is required";
    if(!/^\d{10}$/.test(form.phone)) e.phone="Enter valid 10-digit number";
    if(!form.vehicle) e.vehicle="Please select a vehicle";
    if(!form.loanAmount) e.loanAmount="Please select loan amount";
    return e;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs=validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  const vehicles    = ["Tiago","Tiago EV","Altroz","Tigor","Tigor EV","Punch","Punch EV","Nexon","Nexon EV","Harrier","Harrier EV","Safari","Curvv","Curvv EV","Sierra"];
  const loanAmounts = ["Up to ₹3 Lakh","₹3–5 Lakh","₹5–8 Lakh","₹8–12 Lakh","₹12–18 Lakh","₹18–25 Lakh","Above ₹25 Lakh"];
  const empTypes    = ["Salaried — Private","Salaried — Government","Self-Employed / Business","Farmer / Agriculture","Other"];
  const inputStyle  = { background:"#fff", border:`1px solid rgba(10,31,63,0.15)`, padding:"14px 16px", fontFamily:"'Jost',sans-serif", fontSize:14, color:BRAND.navyMid, outline:"none", width:"100%", borderRadius:2, transition:"border 0.3s, box-shadow 0.3s" };
  const labelStyle  = { fontSize:12, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:BRAND.navyMid, display:"block", marginBottom:8 };
  const errStyle    = { fontSize:11, color:"#e53e3e", marginTop:6 };

  return (
    <section id="apply" style={{ background:BRAND.navyMid, padding:"100px 0", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-100, bottom:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,150,62,0.06) 0%,transparent 70%)" }} />
      <div style={W}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:64, alignItems:"start" }}>
          <div style={{ paddingTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:48, height:1, background:BRAND.gold }} />
              <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Quick Enquiry</span>
            </div>
            <h2 className="cormorant" style={{ fontSize:"clamp(32px,3.5vw,52px)", fontWeight:300, color:BRAND.white, lineHeight:1.2, marginBottom:24 }}>
              Get Your Loan<br /><span className="gold-shimmer">In 48 Hours</span>
            </h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(255,255,255,0.5)", marginBottom:32 }}>Fill in your details and our dedicated finance advisor will call you within 24 hours with a personalised offer.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[["✅","Free consultation — no fees to apply"],["🏦","Access to 10+ lenders in one place"],["⚡","Approval in as fast as 24 hours"],["🔒","Your data is safe and never shared"],["📞","Dedicated RM assigned to your case"]].map(i => (
                <div key={i[1]} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18 }}>{i[0]}</span>
                  <span style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{i[1]}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:40, padding:"24px 28px", background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}`, borderLeft:`4px solid ${BRAND.gold}` }}>
              <div style={{ fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", color:BRAND.gold, marginBottom:8 }}>Helpline</div>
              <div className="cormorant" style={{ fontSize:28, fontWeight:600, color:BRAND.white }}>+91 96860 24365</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Mon – Sat · 9:00 AM – 7:00 PM</div>
            </div>
          </div>

          <div style={{ background:"rgba(255,255,255,0.97)", padding:"48px 40px" }}>
            {submitted ? (
              <div className="fin-success" style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
                <h3 className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.navyMid, marginBottom:16 }}>Application Received!</h3>
                <p style={{ fontSize:15, lineHeight:1.8, color:BRAND.muted, marginBottom:32 }}>Thank you, <strong>{form.name}</strong>! Our finance team will call you at <strong>{form.phone}</strong> within 24 hours.</p>
                <button className="fin-btn-gold" style={{ padding:"13px 32px", fontSize:12, borderRadius:2 }} onClick={() => { setSubmitted(false); setForm({ name:"",phone:"",email:"",city:"",vehicle:"",loanAmount:"",employmentType:"",message:"" }); }}><span>Submit Another Enquiry</span></button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:32 }}>
                  <h3 className="cormorant" style={{ fontSize:28, fontWeight:700, color:BRAND.navyMid, marginBottom:6 }}>Loan Enquiry Form</h3>
                  <p style={{ fontSize:13, color:BRAND.muted }}>Fields marked <span style={{ color:"#e53e3e" }}>*</span> are required.</p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color:"#e53e3e" }}>*</span></label>
                    <input className="fin-input" placeholder="Enter your full name" value={form.name}
                      onChange={e => { set("name",e.target.value); setErrors(er => ({...er,name:""})); }}
                      style={{ ...inputStyle, borderColor:errors.name?"#e53e3e":undefined }} />
                    {errors.name && <div style={errStyle}>{errors.name}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Mobile Number <span style={{ color:"#e53e3e" }}>*</span></label>
                    <input className="fin-input" placeholder="10-digit mobile" maxLength={10} value={form.phone}
                      onChange={e => { set("phone",e.target.value.replace(/\D/,"")); setErrors(er => ({...er,phone:""})); }}
                      style={{ ...inputStyle, borderColor:errors.phone?"#e53e3e":undefined }} />
                    {errors.phone && <div style={errStyle}>{errors.phone}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input className="fin-input" placeholder="you@email.com" type="email" value={form.email} onChange={e => set("email",e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>City / Town</label>
                    <input className="fin-input" placeholder="e.g. Hubli, Gulbarga" value={form.city} onChange={e => set("city",e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Vehicle Model <span style={{ color:"#e53e3e" }}>*</span></label>
                    <div style={{ position:"relative" }}>
                      <select className="fin-select" value={form.vehicle}
                        onChange={e => { set("vehicle",e.target.value); setErrors(er => ({...er,vehicle:""})); }}
                        style={{ ...inputStyle, borderColor:errors.vehicle?"#e53e3e":undefined }}>
                        <option value="">Select a Vehicle</option>
                        {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:12, color:BRAND.muted, pointerEvents:"none" }}>▾</span>
                    </div>
                    {errors.vehicle && <div style={errStyle}>{errors.vehicle}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Loan Amount <span style={{ color:"#e53e3e" }}>*</span></label>
                    <div style={{ position:"relative" }}>
                      <select className="fin-select" value={form.loanAmount}
                        onChange={e => { set("loanAmount",e.target.value); setErrors(er => ({...er,loanAmount:""})); }}
                        style={{ ...inputStyle, borderColor:errors.loanAmount?"#e53e3e":undefined }}>
                        <option value="">Select Range</option>
                        {loanAmounts.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:12, color:BRAND.muted, pointerEvents:"none" }}>▾</span>
                    </div>
                    {errors.loanAmount && <div style={errStyle}>{errors.loanAmount}</div>}
                  </div>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={labelStyle}>Employment Type</label>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {empTypes.map(t => (
                        <button key={t} type="button" onClick={() => set("employmentType",form.employmentType===t?"":t)}
                          style={{ padding:"9px 16px", fontSize:12, cursor:"pointer", borderRadius:2, fontFamily:"'Jost',sans-serif", background:form.employmentType===t?BRAND.navyMid:"transparent", color:form.employmentType===t?BRAND.white:BRAND.navyMid, border:`1px solid ${form.employmentType===t?BRAND.navyMid:"rgba(10,31,63,0.2)"}`, transition:"all 0.2s" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={labelStyle}>Additional Message</label>
                    <textarea className="fin-input" placeholder="Any specific requirement..." rows={3} value={form.message} onChange={e => set("message",e.target.value)}
                      style={{ ...inputStyle, resize:"vertical", fontFamily:"'Jost',sans-serif" }} />
                  </div>
                </div>
                <button className="fin-btn-gold" onClick={handleSubmit} disabled={loading}
                  style={{ width:"100%", marginTop:24, padding:"16px", fontSize:13, borderRadius:2, opacity:loading?0.8:1, cursor:loading?"wait":"pointer" }}>
                  <span>{loading?"Submitting…":"📩  Submit Enquiry — Our Team Will Call You"}</span>
                </button>
                <p style={{ fontSize:12, color:BRAND.muted, textAlign:"center", marginTop:16 }}>By submitting this form, you agree to be contacted by our finance team.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Finance() {
  // ← ADD THIS useEffect right here, at the top of the function
  useEffect(() => {
    if (window.location.hash === '#calculator') {
      setTimeout(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, []);

  return (
    <Layout>
      <PageStyles />
      <Hero />
      <WhyUs />
      <Banks />
      <LoanServices />
      <EMICalculator />
      <Process />
      <Documents />
      <ApplyForm />
    </Layout>
  );
}