import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

const PageStyles = () => (
  <style>{`
    @keyframes vas-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes vas-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes vas-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes vas-rotate  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

    .vas-fadeUp { animation: vas-fadeUp 0.7s ease forwards; }
    .vas-fadeIn { animation: vas-fadeIn 0.6s ease forwards; }

    .vas-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; position:relative; overflow:hidden; }
    .vas-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .vas-btn-gold:hover::before { opacity:1; }
    .vas-btn-gold span { position:relative; z-index:1; }

    .vas-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .vas-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .vas-card-item { transition:all 0.35s ease; border:1px solid rgba(0,0,0,0.06); }
    .vas-card-item:hover { transform:translateY(-6px); box-shadow:0 24px 56px rgba(0,0,0,0.1); border-color:#b8963e; }

    .vas-tab-btn { cursor:pointer; transition:all 0.3s ease; background:transparent; border:none; font-family:'Jost',sans-serif; }
    .vas-tab-btn:hover { color:#b8963e; }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ── Hero ──────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ minHeight:"60vh", background:`linear-gradient(135deg,${BRAND.navy} 0%,#0c2448 50%,${BRAND.navyMid} 100%)`, display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", right:"8%",  top:"10%", width:380, height:380, border:"1px solid rgba(184,150,62,0.07)", borderRadius:"30%", transform:"rotate(15deg)", animation:"vas-rotate 30s linear infinite" }} />
    <div style={{ position:"absolute", right:"11%", top:"15%", width:260, height:260, border:"1px solid rgba(184,150,62,0.12)", borderRadius:"30%", transform:"rotate(30deg)", animation:"vas-rotate 20s linear infinite reverse" }} />
    {[...Array(6)].map((_,i) => (
      <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.3, left:`${8+i*14}%`, top:`${25+(i%3)*20}%`, animation:`vas-pulse ${2+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }} />
    ))}
    <div style={{ ...W, paddingTop:80, paddingBottom:80 }}>
      <div className="vas-fadeIn" style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32, opacity:0, animationDelay:"0.1s" }}>
        <Link to="/" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", letterSpacing:"0.08em" }}>Home</Link>
        <span style={{ color:"rgba(255,255,255,0.25)" }}>›</span>
        <Link to="/services" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", letterSpacing:"0.08em" }}>Services</Link>
        <span style={{ color:"rgba(255,255,255,0.25)" }}>›</span>
        <span style={{ fontSize:12, color:BRAND.gold, letterSpacing:"0.08em" }}>Value Added Services</span>
      </div>
      <div className="vas-fadeIn" style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:24, opacity:0, animationDelay:"0.15s" }}>
        <div style={{ width:32, height:1, background:BRAND.gold }} />
        <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold, fontWeight:500 }}>Vehicle Care & Protection</span>
      </div>
      <h1 className="cormorant vas-fadeUp" style={{ fontSize:"clamp(44px,6vw,80px)", fontWeight:300, lineHeight:1.1, color:BRAND.white, maxWidth:680, animationDelay:"0.2s", opacity:0 }}>
        Value Added<br /><span className="gold-shimmer">Services</span>
      </h1>
      <div style={{ width:60, height:2, background:`linear-gradient(90deg,${BRAND.gold},transparent)`, margin:"24px 0" }} />
      <p className="vas-fadeUp" style={{ fontSize:17, lineHeight:1.8, color:"rgba(255,255,255,0.65)", maxWidth:520, marginBottom:40, animationDelay:"0.4s", opacity:0 }}>
        Renewal and enrichment services to maintain your car in like-new condition. Protection, detailing, and preservation treatments for every vehicle.
      </p>
      <div className="vas-fadeUp" style={{ display:"flex", gap:16, animationDelay:"0.5s", opacity:0 }}>
        <button className="vas-btn-gold" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}><span>Explore Services</span></button>
        <button className="vas-btn-outline" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>Book Now</button>
      </div>
      <div className="vas-fadeUp" style={{ display:"flex", gap:48, marginTop:64, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animationDelay:"0.6s", opacity:0 }}>
        {[{ v:"6+", l:"Service Types" },{ v:"3M", l:"Certified Products" },{ v:"12+", l:"Showrooms" },{ v:"100%", l:"Genuine Treatment" }].map(s => (
          <div key={s.l}>
            <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.gold, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:11, letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:6 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── VAS Section ───────────────────────────────────────────────────
const vasCategories = [
  {
    id:"antirust", label:"Anti-Rust", icon:"🛡️",
    headline:"Anti-Rust Treatment",
    sub:"Protect your vehicle against corrosion for years — recommended by Tata Motors",
    items:[
      { name:"Underbody Anti-Rust Coating",  desc:"A protective rubber-based layer applied to the undercarriage, wheel wells and trunk. Prevents contact of metal with air, resists stone chips, and deadens road noise.",  benefits:["Prevents hidden corrosion","Stone chip resistance","Sound deadening","Long-lasting protection"] },
      { name:"Internal Panel Coating",        desc:"Wax-like rust-preventive compound applied inside cavities of door skins, fenders, and frame rails — areas prone to invisible rust accumulation.",                          benefits:["Cavity & hollow protection","Door skin rust prevention","Fender & frame rail coverage","Seals moisture out"] },
      { name:"Full Body Coating",             desc:"A combination of Underbody Anti-Rust and Internal Panel Coating for complete 360° corrosion protection — the ultimate anti-rust package.",                               benefits:["Complete vehicle coverage","Under + internal cavities","Maximum resale protection","Extends body shell life"] },
    ],
  },
  {
    id:"detailing", label:"Car Detailing", icon:"✨",
    headline:"Car Detailing Treatments",
    sub:"Specialised treatments that make your car look factory-new",
    items:[
      { name:"Paint Protection Treatment", desc:"Restores UV inhibitors in the clear coat finish, protecting paint from fading, oxidation, environmental pollution, and stubborn stains. Delivers a brilliant 'wet look' finish.", benefits:["UV fade protection","Removes oxidation & stains","Brilliant wet-look finish","Environmental pollution guard"] },
      { name:"Ceramic Coating",            desc:"Advanced hydrophilic technology that forms a hardened crystal-like layer on paint, glass, vinyl, plastic, wheels & leather. Self-cleaning, repels corrosion, UV & acid rain.",  benefits:["360° surface protection","Self-cleaning effect","Acid rain & UV resistance","Enhances gloss & colour"] },
      { name:"Teflon / Paint Sealant",     desc:"Creates a thin protective layer on painted surfaces to reduce the effect of dust and coarse fabric. Minimises swirl marks and minor scratches from everyday washing.",           benefits:["Scratch & swirl reduction","Dust-repellent barrier","Easy-clean surface","Preserves factory paint"] },
    ],
  },
  {
    id:"engine", label:"Engine Protection", icon:"⚙️",
    headline:"Engine Wax Coating",
    sub:"Protect the heart of your vehicle from corrosion and heat",
    items:[
      { name:"Engine Wax Treatment",            desc:"A beige-coloured transparent lacquer coating applied to the engine compartment. Prevents corrosion of engine components and comes with a 1-year warranty.",                                                               benefits:["Corrosion prevention","Transparent finish","1-year warranty","Applied by trained technicians"] },
      { name:"Engine Compartment Protection",   desc:"Comprehensive protection package for the engine bay, including heat-resistant coating and moisture seal to extend the life of electrical and mechanical components.",                                                    benefits:["Heat-resistant formula","Moisture seal","Extends component life","Protects electrical systems"] },
    ],
  },
  {
    id:"bodyshop", label:"Body Shop", icon:"🔨",
    headline:"Minor Dent & Scratch Repair",
    sub:"Get those minor imperfections fixed during your regular service visit",
    items:[
      { name:"Spot Dent Removal",           desc:"A 'focused' approach for minor dent repair. Get small dents and dings removed efficiently during your scheduled service — making your car look almost new without the cost of a full body job.", benefits:["Cost-effective fix","Done during service visit","No repainting required","Restores original look"] },
      { name:"Scratch Removal & Touch-Up",  desc:"Surface and medium scratch treatment that removes oxidation, stubborn stains and other paint imperfections like orange peels and dust nibs using professional-grade compounds.",                 benefits:["Medium scratch removal","Oxidation treatment","Orange peel correction","Restores paint clarity"] },
    ],
  },
];

const VASSection = () => {
  const [activeTab, setActiveTab] = useState("antirust");
  const active = vasCategories.find(c => c.id === activeTab);

  return (
    <section style={{ background:BRAND.offWhite, padding:"100px 0" }}>
      <div style={W}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Our Offerings</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.navyMid }}>VAS Categories</h2>
        </div>

        <div style={{ display:"flex", gap:0, borderBottom:`1px solid rgba(0,0,0,0.08)`, marginBottom:48 }}>
          {vasCategories.map(cat => (
            <button key={cat.id} onClick={()=>setActiveTab(cat.id)} className="vas-tab-btn"
              style={{ padding:"16px 28px", fontSize:13, fontWeight:500, letterSpacing:"0.06em", background:"transparent", border:"none", borderBottom:activeTab===cat.id?`2px solid ${BRAND.gold}`:"2px solid transparent", color:activeTab===cat.id?BRAND.gold:BRAND.muted, cursor:"pointer", transition:"all 0.3s", marginBottom:-1 }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div key={active.id} style={{ animation:"vas-fadeIn 0.4s ease" }}>
          <div style={{ marginBottom:40 }}>
            <h3 className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.navyMid, marginBottom:8 }}>{active.headline}</h3>
            <p style={{ fontSize:15, color:BRAND.muted }}>{active.sub}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(active.items.length,3)},1fr)`, gap:20 }}>
            {active.items.map((item,i) => (
              <div key={item.name} className="vas-card-item" style={{ background:BRAND.white, padding:"32px 28px", animation:`vas-fadeUp 0.5s ease ${i*0.1}s both` }}>
                <h4 className="cormorant" style={{ fontSize:22, fontWeight:600, color:BRAND.navyMid, marginBottom:12 }}>{item.name}</h4>
                <p style={{ fontSize:14, lineHeight:1.7, color:BRAND.muted, marginBottom:20 }}>{item.desc}</p>
                <div style={{ borderTop:`1px solid rgba(0,0,0,0.06)`, paddingTop:16 }}>
                  {item.benefits.map(b => (
                    <div key={b} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:BRAND.navyMid, marginBottom:8 }}>
                      <span style={{ color:BRAND.gold, fontWeight:700 }}>✓</span>{b}
                    </div>
                  ))}
                </div>
                <button className="vas-btn-gold" style={{ marginTop:24, padding:"10px 24px", fontSize:11, borderRadius:2 }}><span>Book This Service</span></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Why VAS ───────────────────────────────────────────────────────
const WhyVAS = () => (
  <section style={{ background:BRAND.navyMid, padding:"100px 0", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", right:-100, top:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(184,150,62,0.05) 0%,transparent 70%)" }} />
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:64 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
          <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Why VAS Matters</span>
          <div style={{ width:40, height:1, background:BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:600, color:BRAND.white }}>Protect Your Investment</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {[
          { icon:"💰", title:"Preserves Resale Value",  desc:"A well-protected, well-maintained vehicle commands a significantly higher resale price. VAS keeps your car in showroom condition." },
          { icon:"🛡️", title:"Tata Certified Products",  desc:"We collaborate with industry leaders like 3M, Würth, Bardahl, and BG Car Care to deliver the highest quality treatments." },
          { icon:"🔬", title:"Expert Application",       desc:"All treatments are applied by Tata-trained technicians using manufacturer-recommended processes and tools." },
          { icon:"⏱️", title:"During Your Service",      desc:"Most VAS treatments can be done during your scheduled service visit — saving you an extra trip and your valuable time." },
          { icon:"📋", title:"Warranty Backed",          desc:"Select treatments like Engine Wax come with a 1-year warranty, giving you documented peace of mind." },
          { icon:"✨", title:"Always New-Forever",       desc:"Our goal is your vehicle looking and performing like new, every day — aligned with Tata Motors' 'New Forever' commitment." },
        ].map((item,i) => (
          <div key={item.title}
            style={{ background:"rgba(255,255,255,0.04)", padding:"36px 28px", borderBottom:"2px solid transparent", transition:"border-color 0.3s, background 0.3s", cursor:"default", animation:`vas-fadeUp 0.5s ease ${i*0.08}s both` }}
            onMouseOver={e => { e.currentTarget.style.borderBottomColor=BRAND.gold; e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
            onMouseOut={e => { e.currentTarget.style.borderBottomColor="transparent"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
            <div style={{ fontSize:36, marginBottom:18 }}>{item.icon}</div>
            <h3 className="cormorant" style={{ fontSize:22, fontWeight:600, color:BRAND.white, marginBottom:12 }}>{item.title}</h3>
            <p style={{ fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.5)" }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Partners ──────────────────────────────────────────────────────
const Partners = () => (
  <section style={{ background:"#fff", padding:"60px 0" }}>
    <div style={W}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Certified Product Partners</span>
      </div>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:48, flexWrap:"wrap" }}>
        {["3M","Würth","Bardahl","BG Car Care","SK Car Care","Sikand Stanley"].map(p => (
          <div key={p} style={{ padding:"16px 28px", border:`1px solid rgba(0,0,0,0.08)`, fontSize:15, fontWeight:600, color:BRAND.navyMid, letterSpacing:"0.05em", transition:"all 0.3s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor=BRAND.gold; e.currentTarget.style.color=BRAND.gold; }}
            onMouseOut={e => { e.currentTarget.style.borderColor="rgba(0,0,0,0.08)"; e.currentTarget.style.color=BRAND.navyMid; }}>
            {p}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"80px 0" }}>
    <div style={{ ...W, textAlign:"center" }}>
      <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:300, color:BRAND.white, marginBottom:16 }}>Keep Your Car Pristine</h2>
      <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", marginBottom:40, maxWidth:480, margin:"0 auto 40px" }}>Book a VAS appointment at any Manickbag showroom. Contact us for pricing specific to your vehicle.</p>
      <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
        <button className="vas-btn-gold" style={{ padding:"16px 40px", fontSize:13, borderRadius:2 }}><span>📅 Book VAS Service</span></button>
        <button className="vas-btn-outline" style={{ padding:"16px 40px", fontSize:13, borderRadius:2 }}>📞 +91 96860 24365</button>
      </div>
    </div>
  </section>
);

export default function VAS() {
  return (
    <Layout>
      <PageStyles />
      <Hero />
      <VASSection />
      <WhyVAS />
      <Partners />
      <CTA />
    </Layout>
  );
}