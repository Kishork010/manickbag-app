import { useState } from "react";
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
    @keyframes ew-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ew-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes ew-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes ew-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

    .ew-fadeUp { animation: ew-fadeUp 0.7s ease forwards; }
    .ew-fadeIn { animation: ew-fadeIn 0.6s ease forwards; }

    .ew-btn-gold {
      background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer;
      font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase;
      transition:all 0.3s ease; position:relative; overflow:hidden;
    }
    .ew-btn-gold::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#d4af5a,#b8963e); opacity:0; transition:opacity 0.3s; }
    .ew-btn-gold:hover::before { opacity:1; }
    .ew-btn-gold span { position:relative; z-index:1; }

    .ew-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s ease; }
    .ew-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .ew-card { transition:transform 0.4s ease, box-shadow 0.4s ease; }
    .ew-card:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.1); }

    .ew-benefit-card { transition:border-color 0.3s; }
    .ew-benefit-card:hover { border-color:#b8963e !important; }

    .ew-plan-card { transition:transform 0.4s ease, box-shadow 0.4s ease; }
    .ew-plan-card:hover { transform:translateY(-8px); box-shadow:0 32px 64px rgba(0,0,0,0.12); }
  `}</style>
);

const W = { width: "100%", padding: "0 48px", maxWidth: 1280, margin: "0 auto" };

// ── Hero ──────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ minHeight: "60vh", background: `linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 60%,${BRAND.navy} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", right: "8%", top: "10%", width: 380, height: 380, border: "1px solid rgba(184,150,62,0.08)", borderRadius: "50%", animation: "ew-float 6s ease-in-out infinite" }} />
    <div style={{ position: "absolute", right: "12%", top: "20%", width: 260, height: 260, border: "1px solid rgba(184,150,62,0.14)", borderRadius: "50%", animation: "ew-float 8s ease-in-out infinite reverse" }} />
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.35, left: `${10 + i * 14}%`, top: `${25 + (i % 3) * 20}%`, animation: `ew-pulse ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
    ))}

    <div style={{ ...W, paddingTop: 80, paddingBottom: 80 }}>
      <div className="ew-fadeIn" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, opacity: 0, animationDelay: "0.1s" }}>
        <Link to="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.08em" }}>Home</Link>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>›</span>
        <Link to="/services" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.08em" }}>Services</Link>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>›</span>
        <span style={{ fontSize: 12, color: BRAND.gold, letterSpacing: "0.08em" }}>Extended Warranty</span>
      </div>

      <div className="ew-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, opacity: 0, animationDelay: "0.15s" }}>
        <div style={{ width: 32, height: 1, background: BRAND.gold }} />
        <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>Service Protection</span>
      </div>

      <h1 className="cormorant ew-fadeUp" style={{ fontSize: "clamp(44px,6vw,80px)", fontWeight: 300, lineHeight: 1.1, color: BRAND.white, maxWidth: 700, animationDelay: "0.2s", opacity: 0 }}>
        Extended<br /><span className="gold-shimmer">Warranty</span><br />Programme
      </h1>

      <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "24px 0" }} />

      <p className="ew-fadeUp" style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 540, marginBottom: 40, animationDelay: "0.4s", opacity: 0 }}>
        Secure your car against breakdowns and repair bills, even after the original warranty expires. Extend by 1 or 2 years — up to 1,50,000 kms.
      </p>

      <div className="ew-fadeUp" style={{ display: "flex", gap: 16, animationDelay: "0.5s", opacity: 0 }}>
        <button className="ew-btn-gold" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}><span>Get a Quote</span></button>
        <button className="ew-btn-outline" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}>Learn More</button>
      </div>

      <div className="ew-fadeUp" style={{ display: "flex", gap: 48, marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", animationDelay: "0.6s", opacity: 0 }}>
        {[{ v: "1-2", l: "Extra Years" }, { v: "1.5L", l: "Max KMs Covered" }, { v: "800+", l: "Authorised Workshops" }, { v: "100%", l: "Genuine Parts" }].map(s => (
          <div key={s.l}>
            <div className="cormorant" style={{ fontSize: 36, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Benefits ──────────────────────────────────────────────────────
const benefits = [
  { icon: "🛡️", title: "Unforeseen Repair Protection", desc: "Shields against unexpected breakdowns and costly repair bills after your factory warranty ends." },
  { icon: "🗺️", title: "Pan-India Coverage",           desc: "Accepted at all Tata Motors authorised workshops across India — wherever you travel." },
  { icon: "📋", title: "Paperless & Hassle-Free",       desc: "No documentation needed. Backed by Tata Motors CRMDMS system for instant processing." },
  { icon: "🔧", title: "Genuine Parts & Expert Techs",  desc: "Only trained technicians and genuine Tata spare parts — ensuring quality and reliability." },
  { icon: "💰", title: "Boosts Resale Value",           desc: "Extended Warranty is transferable on resale, making your car more attractive to buyers." },
  { icon: "💳", title: "Cashless Claims",               desc: "Near-cashless settlement — once approved, you pay nothing for covered parts and labour." },
];

const Benefits = () => (
  <section style={{ background: BRAND.offWhite, padding: "100px 0" }}>
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Why Choose EW</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>Key Benefits</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
        {benefits.map((b, i) => (
          <div key={b.title} className="ew-benefit-card ew-card"
            style={{ background: BRAND.white, padding: "40px 32px", cursor: "pointer", borderBottom: "2px solid transparent", transition: "border-color 0.3s", animation: `ew-fadeUp 0.5s ease ${i * 0.1}s both` }}
            onMouseOver={e => e.currentTarget.style.borderBottomColor = BRAND.gold}
            onMouseOut={e => e.currentTarget.style.borderBottomColor = "transparent"}>
            <div style={{ fontSize: 38, marginBottom: 20 }}>{b.icon}</div>
            <h3 className="cormorant" style={{ fontSize: 20, fontWeight: 600, color: BRAND.navyMid, marginBottom: 12 }}>{b.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: BRAND.muted }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Plans ─────────────────────────────────────────────────────────
const Plans = () => (
  <section style={{ background: BRAND.navyMid, padding: "100px 0", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", right: -80, top: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,150,62,0.06) 0%,transparent 70%)" }} />
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Coverage Options</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.white }}>Choose Your Plan</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>Extend your warranty by 1 or 2 years. Coverage starts immediately after your original warranty expires.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto" }}>
        {[
          { label: "1 Year Extension", km: "Up to 75,000 kms", highlight: false, features: ["Mechanical breakdown cover","Electrical breakdown cover","Genuine Tata spare parts","800+ authorised workshops","Transferable on resale","Cashless claims"] },
          { label: "2 Year Extension", km: "Up to 1,50,000 kms", highlight: true,  features: ["Everything in 1-Year plan","Maximum peace of mind","Best resale advantage","Longer protection window","Priority claim processing","Pan-India validity"] },
        ].map((p, i) => (
          <div key={p.label} className="ew-plan-card" style={{ background: p.highlight ? `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})` : "rgba(255,255,255,0.05)", border: `1px solid ${p.highlight ? "transparent" : BRAND.borderLight}`, padding: "40px 32px", position: "relative", animation: `ew-fadeUp 0.6s ease ${i * 0.15}s both` }}>
            {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: BRAND.navy, color: BRAND.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", padding: "6px 20px", textTransform: "uppercase" }}>Most Popular</div>}
            <div className="cormorant" style={{ fontSize: 28, fontWeight: 700, color: p.highlight ? BRAND.navy : BRAND.white, marginBottom: 8 }}>{p.label}</div>
            <div style={{ fontSize: 13, color: p.highlight ? BRAND.navyMid : "rgba(255,255,255,0.5)", marginBottom: 28, letterSpacing: "0.05em" }}>{p.km}</div>
            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {p.features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: p.highlight ? BRAND.navy : "rgba(255,255,255,0.7)", marginBottom: 12 }}>
                  <span style={{ color: p.highlight ? BRAND.navyMid : BRAND.gold, fontWeight: 700, marginTop: 1 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button className={p.highlight ? "" : "ew-btn-gold"}
              style={{ width: "100%", padding: "14px", fontSize: 12, borderRadius: 2, background: p.highlight ? BRAND.navy : undefined, color: p.highlight ? BRAND.gold : undefined, border: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.3s" }}>
              <span>Get This Plan</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── How It Works ──────────────────────────────────────────────────
const HowItWorks = () => (
  <section style={{ background: "#fff", padding: "100px 0" }}>
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Simple Process</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>How to Purchase</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
        <div style={{ position: "absolute", top: 40, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg,transparent,${BRAND.gold},transparent)` }} />
        {[
          { step: "01", title: "Visit Showroom", desc: "Walk into any Manickbag or Tata Motors authorised showroom." },
          { step: "02", title: "Choose Plan",    desc: "Select 1 or 2 year extension based on your driving needs." },
          { step: "03", title: "Purchase EW",    desc: "Simple, paperless purchase backed by Tata Motors CRMDMS." },
          { step: "04", title: "Drive Carefree", desc: "Coverage activates right after your factory warranty ends." },
        ].map((s, i) => (
          <div key={s.step} style={{ textAlign: "center", padding: "0 24px", animation: `ew-fadeUp 0.5s ease ${i * 0.12}s both` }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: BRAND.navyMid, border: `2px solid ${BRAND.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", position: "relative", zIndex: 1 }}>
              <span className="cormorant" style={{ fontSize: 24, fontWeight: 700, color: BRAND.gold }}>{s.step}</span>
            </div>
            <h3 className="cormorant" style={{ fontSize: 20, fontWeight: 600, color: BRAND.navyMid, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: BRAND.muted }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Exclusions ────────────────────────────────────────────────────
const Exclusions = () => (
  <section style={{ background: BRAND.offWhite, padding: "80px 0" }}>
    <div style={W}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Important Note</span>
          </div>
          <h2 className="cormorant" style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 600, color: BRAND.navyMid, lineHeight: 1.3, marginBottom: 20 }}>What's Not Covered</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: BRAND.muted, marginBottom: 24 }}>The Extended Warranty does not cover damage arising from accidents, fire, flood, theft, natural calamities, vandalism, or misuse. It also excludes damage from lack of servicing or continued use after a fault becomes evident.</p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: BRAND.muted }}>For a complete and detailed list of exclusions, please contact your nearest Manickbag showroom or authorised Tata Motors workshop.</p>
          <button className="ew-btn-gold" style={{ marginTop: 32, padding: "12px 28px", fontSize: 12, borderRadius: 2 }}><span>Contact Us for Details</span></button>
        </div>
        <div style={{ background: BRAND.white, padding: "36px 32px", border: `1px solid rgba(0,0,0,0.06)`, borderLeft: `4px solid ${BRAND.gold}` }}>
          <h3 className="cormorant" style={{ fontSize: 22, fontWeight: 600, color: BRAND.navyMid, marginBottom: 20 }}>Quick Summary</h3>
          {["✅  Mechanical & electrical breakdowns","✅  All Tata authorised workshops across India","✅  Transferable on vehicle resale","✅  Near-cashless claims settlement","✅  Genuine spare parts & trained technicians","❌  Accident or collision damage","❌  Natural calamities & theft","❌  Normal wear & tear","❌  Damage due to misuse or neglect"].map(item => (
            <div key={item} style={{ fontSize: 14, color: item.startsWith("✅") ? BRAND.navyMid : BRAND.muted, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: 8 }}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "80px 0" }}>
    <div style={{ ...W, textAlign: "center" }}>
      <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: BRAND.white, marginBottom: 16 }}>Ready to Protect Your Vehicle?</h2>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>Visit your nearest Manickbag showroom or call us to purchase your Extended Warranty today.</p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button className="ew-btn-gold" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}><span>📍 Find Showroom</span></button>
        <button className="ew-btn-outline" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}>📞 Call: +91 96860 24365</button>
      </div>
    </div>
  </section>
);

export default function EW() {
  return (
    <Layout>
      <PageStyles />
      <Hero />
      <Benefits />
      <Plans />
      <HowItWorks />
      <Exclusions />
      <CTA />
    </Layout>
  );
}