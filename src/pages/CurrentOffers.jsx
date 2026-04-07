import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout"; // ← shared header/navbar/footer

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// Page-scoped styles only
const PageStyles = () => (
  <style>{`
    @keyframes co-fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes co-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes co-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes co-ticker  { from { transform:translateX(0); } to { transform:translateX(-50%); } }

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

    .co-gold-line { width:60px; height:2px; background:linear-gradient(90deg,#b8963e,transparent); }

    .co-filter-btn { transition:all 0.2s ease; cursor:pointer; }
    .co-filter-btn.active { background:#0c1f3f !important; color:#ffffff !important; border-color:#0c1f3f !important; }
    .co-filter-btn:hover { border-color:#b8963e !important; color:#b8963e !important; }

    .co-ticker-inner { display:flex; white-space:nowrap; animation:co-ticker 28s linear infinite; }
    .co-ticker-inner:hover { animation-play-state:paused; }
  `}</style>
);

const W = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px" };

// ─── DATA ────────────────────────────────────────────────────────
const offerCategories = [
  { id: "all",     label: "All Offers"         },
  { id: "ev",      label: "Electric Vehicles"  },
  { id: "suv",     label: "SUVs"               },
  { id: "hatch",   label: "Hatchbacks"         },
  { id: "sedan",   label: "Sedans"             },
  { id: "festive", label: "Festive Specials"   },
];

const offers = [
  { id:1, category:"ev",      model:"Nexon EV",   tag:"Best Seller",     tagBg:"#1a5276", headline:"₹50,000 Cash Benefit",      subline:"On Nexon EV Max — Limited Period",        benefits:["₹50,000 consumer discount","Free home charger worth ₹18,000","Zero processing fee on loan","5-year battery warranty"],               validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/nexon_ev.avif",   badge:"🔋 EV Special"      },
  { id:2, category:"ev",      model:"Punch EV",   tag:"New Launch",      tagBg:"#1e8449", headline:"₹30,000 Launch Offer",       subline:"Punch EV — City Electric Made Easy",       benefits:["₹30,000 introductory benefit","Free 1st year insurance","Complimentary portable charger","3-year free service"],                      validTill:"31 May 2026", image:"https://www.manickbag.in/images/punch_ev.avif",   badge:"⚡ Launch Special"  },
  { id:3, category:"suv",     model:"Harrier",    tag:"Flagship",        tagBg:"#6c3483", headline:"₹75,000 Total Benefit",      subline:"Harrier Petrol — Commanding Presence",     benefits:["₹40,000 cash discount","₹15,000 exchange bonus","₹20,000 accessory package","Free extended warranty 1yr"],                           validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/harrier.avif",    badge:"🏆 Flagship Deal"   },
  { id:4, category:"suv",     model:"Safari",     tag:"Premium",         tagBg:"#784212", headline:"₹60,000 Total Benefit",      subline:"Safari — 7-Seater Luxury Redefined",       benefits:["₹35,000 consumer offer","Free sunroof accessory kit","Low EMI from ₹16,999/mo","1yr free roadside assistance"],                      validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/safari.avif",     badge:"👑 Premium Offer"   },
  { id:5, category:"suv",     model:"Nexon",      tag:"Top Seller",      tagBg:"#b8963e", headline:"₹45,000 Total Benefit",      subline:"Nexon Petrol — India's Safest SUV",        benefits:["₹25,000 direct discount","Free AMC 2 years","Zero cost EMI 12 months","Free first service"],                                         validTill:"15 May 2026", image:"https://www.manickbag.in/images/naxon.avif",      badge:"⭐ Top Seller"      },
  { id:6, category:"hatch",   model:"Altroz",     tag:"Stylish",         tagBg:"#1a3d7c", headline:"₹35,000 Total Benefit",      subline:"Altroz — Premium Hatchback with 5-Star Safety", benefits:["₹20,000 cash benefit","Free metallic paint upgrade","Low EMI from ₹7,999/mo","2yr free maintenance"],                        validTill:"31 May 2026", image:"https://www.manickbag.in/images/altroz.jpg",      badge:"🎨 Style Offer"     },
  { id:7, category:"hatch",   model:"Tiago",      tag:"Budget Friendly", tagBg:"#1e6b3e", headline:"₹25,000 Total Benefit",      subline:"Tiago — Most Value-Packed Hatchback",       benefits:["₹15,000 consumer discount","Free first year insurance","EMI from ₹5,499/mo","Free accessories worth ₹5,000"],                      validTill:"31 May 2026", image:"https://www.manickbag.in/images/tiago.jpg",       badge:"💰 Value Deal"      },
  { id:8, category:"sedan",   model:"Tigor",      tag:"Compact Sedan",   tagBg:"#5d3f7a", headline:"₹30,000 Total Benefit",      subline:"Tigor — Boot Space Champion",               benefits:["₹18,000 cash benefit","Free 1yr extended warranty","Zero processing fee","Free interior accessories"],                               validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/tigor.jpg",       badge:"🚗 Sedan Offer"     },
  { id:9, category:"festive", model:"Any Model",  tag:"Festive Special", tagBg:"#b8963e", headline:"Up to ₹1,00,000 Benefit",    subline:"Summer Bonanza — Across All Models",        benefits:["Up to ₹1L combined benefit","Exchange bonus up to ₹25,000","Loyalty bonus ₹10,000","Free 3yr service package"],                    validTill:"30 Apr 2026", image:"https://www.manickbag.in/images/safari.avif",     badge:"🎉 Bonanza Offer"   },
];

const highlights = [
  { icon:"🏷️", value:"9+",         label:"Active Offers"   },
  { icon:"💰", value:"₹1 Lakh",    label:"Max Benefit"     },
  { icon:"📅", value:"April 2026", label:"Valid This Month" },
  { icon:"🚗", value:"All Models", label:"Covered"         },
];

// ─── TICKER ────────────────────────────────────────────────────────
const Ticker = () => {
  const items = ["₹50K on Nexon EV","₹75K on Harrier","Free Charger with Punch EV","0% EMI on Tiago","₹1L Summer Bonanza","Exchange Bonus on Safari"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: `linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow: "hidden", padding: "10px 0" }}>
      <div className="co-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding: "0 28px", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND.navy, display: "inline-flex", alignItems: "center", gap: 14 }}>
            {item}<span style={{ opacity: 0.35 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── OFFER CARD ────────────────────────────────────────────────────
const OfferCard = ({ offer, index }) => {
  const [hovered,  setHovered]  = useState(false);
  const [enquired, setEnquired] = useState(false);

  return (
    <div className="co-card"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: BRAND.white, border: `1px solid ${hovered ? BRAND.borderLight : "rgba(0,0,0,0.06)"}`, overflow: "hidden", animation: `co-fadeUp 0.55s ease ${index * 0.08}s both`, display: "flex", flexDirection: "column" }}>
      {/* Image */}
      <div style={{ height: 190, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})` }}>
        <img src={offer.image} alt={offer.model} style={{ width: "100%", height: "100%", objectFit: "contain", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.45s ease" }} />
        <div style={{ position: "absolute", top: 14, left: 14, background: offer.tagBg, color: BRAND.white, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 10px", textTransform: "uppercase" }}>{offer.tag}</div>
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(10,22,40,0.82)", color: BRAND.gold, fontSize: 10, fontWeight: 600, padding: "4px 10px", backdropFilter: "blur(6px)", letterSpacing: "0.08em" }}>{offer.badge}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,22,40,0.75)", backdropFilter: "blur(4px)", padding: "6px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>Valid till</span>
          <span style={{ fontSize: 11, color: BRAND.gold, fontWeight: 600, letterSpacing: "0.1em" }}>{offer.validTill}</span>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: BRAND.muted, textTransform: "uppercase", marginBottom: 6 }}>{offer.model}</div>
        <h3 className="cormorant" style={{ fontSize: 26, fontWeight: 600, color: BRAND.navyMid, lineHeight: 1.1, marginBottom: 6 }}>{offer.headline}</h3>
        <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6, marginBottom: 18 }}>{offer.subline}</p>
        <div style={{ flex: 1, marginBottom: 20 }}>
          {offer.benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "5px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.gold, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: BRAND.navyMid, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setEnquired(true)}
            style={{ flex: 1, padding: "11px", fontSize: 11, borderRadius: 2, fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
              background: enquired ? "#1e8449" : `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,
              color: enquired ? BRAND.white : BRAND.navy, border: "none" }}>
            {enquired ? "✓ Enquiry Sent" : "Claim Offer"}
          </button>
          <button className="co-btn-outline" style={{ padding: "11px 16px", fontSize: 11, borderRadius: 2 }}>Know More</button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function CurrentOffers() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = offers.filter(o => activeCategory === "all" || o.category === activeCategory);

  return (
    <Layout>
      <PageStyles />
      <Ticker />

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 55%,${BRAND.navy} 100%)`, padding: "80px 48px 72px", position: "relative", overflow: "hidden", width: "100%" }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(184,150,62,0.07)` }} />
        <div style={{ position: "absolute", right: 60,  top: 60,  width: 300, height: 300, borderRadius: "50%", border: `1px solid rgba(184,150,62,0.12)` }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.25, left: `${10 + i * 14}%`, top: `${25 + (i % 3) * 22}%`, animation: `co-pulse ${2 + i * 0.35}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
        ))}

        <div style={W}>
          <div className="co-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 22, opacity: 0, animationDelay: "0.1s" }}>
            <div style={{ width: 36, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>April 2026 · Limited Period</span>
          </div>
          <h1 className="cormorant co-fadeUp" style={{ fontSize: "clamp(44px,6vw,82px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.1, maxWidth: 700, opacity: 0, animationDelay: "0.2s", whiteSpace: "pre-line" }}>
            {"Offers That Move\nYou Forward"}
          </h1>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "24px 0" }} />
          <p className="co-fadeUp" style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 500, marginBottom: 44, opacity: 0, animationDelay: "0.35s" }}>
            Exclusive benefits on Tata's full range — cash discounts, free insurance, exchange bonuses, and EMI deals. Only at Manickbag.
          </p>
          <div className="co-fadeUp" style={{ display: "flex", gap: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", opacity: 0, animationDelay: "0.45s", flexWrap: "wrap" }}>
            {highlights.map(h => (
              <div key={h.label}>
                <div className="cormorant" style={{ fontSize: 38, fontWeight: 600, color: BRAND.gold, lineHeight: 1 }}>{h.value}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ ...W, padding: "64px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div className="co-gold-line" />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Active Offers</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 600, color: BRAND.navyMid, lineHeight: 1.15 }}>Current Month Deals</h2>
          </div>
          <div style={{ fontSize: 12, color: BRAND.muted, textAlign: "right", lineHeight: 1.7 }}>
            <div>All offers valid while stocks last.</div>
            <div>T&amp;C apply. Contact showroom for details.</div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {offerCategories.map(c => (
            <button key={c.id} className={`co-filter-btn ${activeCategory === c.id ? "active" : ""}`} onClick={() => setActiveCategory(c.id)}
              style={{ padding: "9px 22px", fontSize: 12, borderRadius: 2, background: "transparent", color: BRAND.navyMid, border: `1px solid rgba(10,31,63,0.2)`, fontFamily: "'Jost',sans-serif", fontWeight: 500, letterSpacing: "0.06em" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((offer, i) => <OfferCard key={offer.id} offer={offer} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: BRAND.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="cormorant" style={{ fontSize: 28, color: BRAND.navyMid, marginBottom: 8 }}>No offers in this category right now</div>
            <div style={{ fontSize: 14 }}>Check back soon or view all offers.</div>
          </div>
        )}
      </div>

      {/* ── DISCLAIMER STRIP ── */}
      <div style={{ background: BRAND.offWhite, borderTop: "1px solid rgba(0,0,0,0.06)", padding: "32px 48px" }}>
        <div style={{ ...W, padding: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[["📅","Validity","Offers valid through April–May 2026 or while stocks last."],
              ["📍","Location","Available across all 12 Manickbag showrooms in North Karnataka."],
              ["📋","T&C Apply","Benefits are combinable only as per Tata Motors norms."],
              ["📞","Get Details","Call +91 96860 24365 or visit your nearest showroom."]].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.navyMid, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "68px 48px" }}>
        <div style={{ ...W, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 14 }}>Don't miss out</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(30px,3.5vw,50px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 18 }}>Ready to Claim<br />Your Offer?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>Visit any Manickbag showroom with your documents or book a slot online. Our team will walk you through every available benefit.</p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button className="co-btn-gold" style={{ padding: "16px 36px", fontSize: 13, borderRadius: 2 }}>📅 Book Test Drive</button>
            <button className="co-btn-outline" style={{ padding: "16px 36px", fontSize: 13, borderRadius: 2 }}>📞 Talk to Advisor</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}