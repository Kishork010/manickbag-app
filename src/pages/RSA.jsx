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
    @keyframes rsa-fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes rsa-fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes rsa-pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

    .rsa-fadeUp { animation: rsa-fadeUp 0.7s ease forwards; }
    .rsa-fadeIn { animation: rsa-fadeIn 0.6s ease forwards; }

    .rsa-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; position:relative; overflow:hidden; }
    .rsa-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .rsa-btn-gold:hover::before { opacity:1; }
    .rsa-btn-gold span { position:relative; z-index:1; }

    .rsa-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .rsa-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .rsa-service-card { transition:all 0.3s ease; }
    .rsa-service-card:hover { border-color:#b8963e !important; transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ── Hero ──────────────────────────────────────────────────────────
const Hero = () => (
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
        <button className="rsa-btn-gold" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}><span>📞 1800 209 8282</span></button>
        <button className="rsa-btn-outline" style={{ padding:"14px 36px", fontSize:13, borderRadius:2 }}>Buy RSA Plan</button>
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
  { icon:"🚗", title:"Towing Assistance",      desc:"Car-to-car towing or flatbed to nearest authorised Tata dealer workshop. Available for mechanical breakdowns, accidents & key-lost cases." },
  { icon:"🔋", title:"Battery Jump Start",      desc:"Immediate battery jump-start in case of a rundown battery. TVS Auto Assist bears labour & conveyance charges." },
  { icon:"⛽", title:"Fuel Delivery",           desc:"Up to 5 litres of emergency fuel arranged at your breakdown location. Based on local availability." },
  { icon:"🔑", title:"Key Lockout",             desc:"Expert support to help you regain access to your vehicle in case of key lockout situations." },
  { icon:"🔧", title:"On-Site Repair",          desc:"Nearest Authorised Service Provider dispatched to diagnose & fix the problem on the spot wherever possible." },
  { icon:"🛞", title:"Flat Tyre Assistance",    desc:"Replacement of flat tyre with spare tyre, or tyre repair if spare is unavailable — based on location." },
  { icon:"👩", title:"Women Assist Program",    desc:"Dedicated assistance for women drivers from 8 PM to 5 AM. End-to-end follow-up with family notification." },
  { icon:"📍", title:"Location Tracking",       desc:"We track your GPS location and dispatch the nearest ASP immediately — no need to explain where you are." },
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
const RSAPlans = () => (
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
          { name:"Within Warranty", badge:"Complimentary", highlight:false, features:["Free mechanical breakdown towing","Car-to-car or winch & tow","Nearest Tata Authorised Workshop","Covers non-accident cases only","Automatically applicable"] },
          { name:"Premium Plan",    badge:"Post-Warranty",  highlight:true,  features:["One free towing instance","24×7 availability","All RSA services included","Women Assist Program","Pan-India coverage","Available at any Tata workshop"] },
          { name:"Standard Plan",   badge:"Annual Policy",  highlight:false, features:["All RSA services on-demand","Fuel delivery (5 litres)","Battery jump-start","Key lockout assistance","Flat tyre support","Can be renewed annually"] },
        ].map((p,i) => (
          <div key={p.name} style={{ background:p.highlight?`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`:"rgba(255,255,255,0.05)", border:`1px solid ${p.highlight?"transparent":BRAND.borderLight}`, padding:"36px 28px", transition:"transform 0.3s", animation:`rsa-fadeUp 0.5s ease ${i*0.15}s both` }}>
            <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:p.highlight?BRAND.navy:BRAND.gold, fontWeight:600, marginBottom:8 }}>{p.badge}</div>
            <h3 className="cormorant" style={{ fontSize:26, fontWeight:700, color:p.highlight?BRAND.navy:BRAND.white, marginBottom:24 }}>{p.name}</h3>
            <ul style={{ listStyle:"none", marginBottom:28 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:13, color:p.highlight?BRAND.navyMid:"rgba(255,255,255,0.7)", marginBottom:12, display:"flex", gap:8 }}>
                  <span style={{ color:p.highlight?BRAND.navyMid:BRAND.gold, fontWeight:700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button className={p.highlight?"":"rsa-btn-gold"}
              style={{ width:"100%", padding:"12px", fontSize:11, borderRadius:2, background:p.highlight?BRAND.navy:undefined, color:p.highlight?BRAND.gold:undefined, border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.3s" }}>
              {p.highlight?"Get Premium RSA":"Learn More"}
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.3)", marginTop:32 }}>Note: RSA services can be availed 48 hours after policy purchase. Not available in certain NE states, J&K, Andaman & Nicobar, and Lakshadweep.</p>
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

const CTA = () => (
  <section style={{ background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding:"80px 0" }}>
    <div style={{ ...W, textAlign:"center" }}>
      <h2 className="cormorant" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:300, color:BRAND.white, marginBottom:16 }}>Stuck on the Road? We've Got You.</h2>
      <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", marginBottom:40, maxWidth:460, margin:"0 auto 40px" }}>Call our toll-free helpline or visit a Manickbag showroom to activate your RSA plan.</p>
      <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
        <button className="rsa-btn-gold" style={{ padding:"16px 40px", fontSize:14, borderRadius:2 }}><span>📞 Toll-Free: 1800 209 8282</span></button>
        <button className="rsa-btn-outline" style={{ padding:"16px 40px", fontSize:13, borderRadius:2 }}>Buy RSA Plan</button>
      </div>
    </div>
  </section>
);

export default function RSA() {
  return (
    <Layout>
      <PageStyles />
      <Hero />
      <ServicesGrid />
      <RSAPlans />
      <ResponseTimes />
      <CTA />
    </Layout>
  );
}