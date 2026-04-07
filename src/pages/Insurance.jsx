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
    @keyframes ins-fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ins-shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }

    .ins-fadeUp { animation: ins-fadeUp 0.6s ease forwards; }

    .ins-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; }
    .ins-btn-gold:hover { opacity:0.9; }

    .ins-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .ins-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .ins-card { transition:all 0.3s ease; }
    .ins-card:hover { transform:translateY(-6px); }
    .ins-card.featured { border:2px solid #b8963e !important; }
  `}</style>
);

const plans = [
  { name:"Third Party",     subtitle:"Mandatory Cover",  icon:"🛡️", price:"From ₹2,094/yr", featured:false, color:"#5a8a5a", covers:["Third-party bodily injury","Third-party property damage","Legal liability cover","Mandatory by IRDAI"],                                                                       notCovered:["Own vehicle damage","Theft","Natural calamities","Personal accident (add-on)"] },
  { name:"Comprehensive",   subtitle:"Recommended",      icon:"⭐", price:"From ₹8,500/yr",  featured:true,  color:BRAND.gold,  covers:["All third-party covers","Own vehicle damage","Theft protection","Natural calamity damage","Fire damage","Personal accident cover"],                                           notCovered:["Wear & tear","Mechanical breakdown","Drunk driving incidents"] },
  { name:"Zero Depreciation",subtitle:"Premium Add-on", icon:"💎", price:"From ₹12,000/yr", featured:false, color:"#4a90d9",   covers:["All Comprehensive covers","Zero depreciation on parts","Full claim settlement","Plastic & rubber parts covered","Fibre parts covered"],                                    notCovered:["Tyres (unless add-on)","Engine damage (unless add-on)","Electrical breakdown"] },
];

const insurancePartners = [
  { name:"Tata AIG",             logo:"🏢", type:"OEM Partner"       },
  { name:"HDFC ERGO",            logo:"🏦", type:"Preferred Partner"  },
  { name:"Bajaj Allianz",        logo:"🔵", type:"Tie-up Partner"     },
  { name:"ICICI Lombard",        logo:"🟠", type:"Tie-up Partner"     },
  { name:"New India Assurance",  logo:"🟢", type:"Government PSU"     },
  { name:"Oriental Insurance",   logo:"🔶", type:"Government PSU"     },
];

const steps = [
  { num:"01", title:"Share Vehicle Details", desc:"Provide your car's RC details, previous policy if renewal, and IDV preference." },
  { num:"02", title:"Get Instant Quotes",    desc:"Our team compares quotes from 6+ insurers and presents the best options within minutes." },
  { num:"03", title:"Choose Your Plan",      desc:"Select the coverage that suits your needs and budget. Add-ons available." },
  { num:"04", title:"Digital Policy Issued", desc:"Pay online and receive your policy document instantly via email and WhatsApp." },
];

export default function Insurance() {
  const [activeTab,     setActiveTab]     = useState("new");
  const [selectedPlan,  setSelectedPlan]  = useState("Comprehensive");

  return (
    <Layout>
      <PageStyles />

      {/* ── Hero ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,#0d2a52 60%,${BRAND.navyMid} 100%)`, padding:"80px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-80,  top:-80,  width:450, height:450, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.08)` }} />
        <div style={{ position:"absolute", right:60,   top:60,   width:260, height:260, borderRadius:"50%", border:`1px solid rgba(184,150,62,0.12)` }} />
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
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.08)", borderRadius:4, padding:4, gap:4, marginBottom:32 }}>
            {[["new","New Insurance"],["renew","Renew Policy"]].map(([id,label]) => (
              <button key={id} onClick={()=>setActiveTab(id)} style={{ padding:"10px 28px", fontSize:12, cursor:"pointer", borderRadius:2, border:"none", background:activeTab===id?BRAND.gold:"transparent", color:activeTab===id?BRAND.navy:"rgba(255,255,255,0.6)", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.08em", transition:"all 0.2s" }}>{label}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:40 }}>
            {[["6+","Insurer Partners"],["5 min","Quote Time"],["Instant","Policy Issuance"]].map(([val,lbl]) => (
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
          {plans.map((plan,i) => (
            <div key={plan.name} className={`ins-card ${plan.featured?"featured":""}`}
              onClick={()=>setSelectedPlan(plan.name)}
              style={{ background:selectedPlan===plan.name?BRAND.navyMid:BRAND.offWhite, border:`${plan.featured?2:1}px solid ${plan.featured?BRAND.gold:"rgba(0,0,0,0.06)"}`, overflow:"hidden", cursor:"pointer", position:"relative", animation:`ins-fadeUp 0.5s ease ${i*0.12}s both` }}>
              {plan.featured && <div style={{ background:BRAND.gold, color:BRAND.navy, fontSize:9, fontWeight:700, letterSpacing:"0.2em", textAlign:"center", padding:"6px", textTransform:"uppercase" }}>Most Recommended</div>}
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
                <button className="ins-btn-gold" style={{ width:"100%", padding:"12px", fontSize:12, borderRadius:2, marginTop:24 }}>Get Quote for {plan.name}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div style={{ background:BRAND.navyMid, padding:"48px 48px", marginBottom:48 }}>
          <h2 className="cormorant" style={{ fontSize:36, color:BRAND.white, textAlign:"center", marginBottom:40 }}>How It Works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32 }}>
            {steps.map((step,i) => (
              <div key={step.num} style={{ textAlign:"center", position:"relative" }}>
                {i<steps.length-1 && <div style={{ position:"absolute", top:24, left:"60%", width:"80%", height:1, background:`linear-gradient(90deg,${BRAND.gold},transparent)` }} />}
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
              <div key={p.name} style={{ background:BRAND.offWhite, border:`1px solid rgba(0,0,0,0.06)`, padding:"20px 16px", textAlign:"center", transition:"all 0.2s" }}
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
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>Don't let your policy lapse. Share your registration number and we'll retrieve your vehicle details instantly.</p>
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
            <button className="ins-btn-gold" style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>🔄 Renew Now</button>
            <button className="ins-btn-outline" style={{ padding:"16px 36px", fontSize:13, borderRadius:2 }}>📞 Call Expert</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}