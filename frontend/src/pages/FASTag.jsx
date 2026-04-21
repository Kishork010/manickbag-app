import { useState } from "react";
import Layout from "./Layout";

const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ── API ───────────────────────────────────────────────────────────
const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : "/backend/api";

async function apiPost(endpoint, body) {
  const res = await fetch(API_BASE + "/" + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

// ── Validation ────────────────────────────────────────────────────
function clientValidate(form) {
  if (!form.name.trim())  return "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
                          return "Enter a valid 10-digit Indian mobile number.";
  if (!form.regNo.trim()) return "Vehicle registration number is required.";
  if (!/^[A-Z0-9\- ]{4,15}$/i.test(form.regNo.trim()))
                          return "Enter a valid registration number (e.g. KA-01-AB-1234).";
  return null;
}

// ── Styles ────────────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @keyframes ft-fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ft-scanline { 0% { transform:translateY(-100%); opacity:0; } 50% { opacity:1; } 100% { transform:translateY(400%); opacity:0; } }

    .ft-fadeUp   { animation: ft-fadeUp 0.6s ease forwards; }
    .ft-scanline { animation: ft-scanline 2.5s ease-in-out infinite; }

    .ft-btn-gold {
      background: linear-gradient(135deg,#b8963e,#d4af5a);
      color: #0a1628; border: none; cursor: pointer;
      font-family: 'Jost',sans-serif; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.3s;
    }
    .ft-btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }
    .ft-btn-gold:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .ft-btn-outline {
      background: transparent; border: 1px solid #b8963e; color: #b8963e;
      cursor: pointer; font-family: 'Jost',sans-serif; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s;
    }
    .ft-btn-outline:hover { background: #b8963e; color: #0a1628; }

    .ft-step-card { transition: all 0.3s ease; }
    .ft-step-card:hover { transform: translateY(-4px); }

    .ft-inp {
      width: 100%; padding: 12px 16px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(184,150,62,0.2);
      color: #ffffff; font-family: 'Jost',sans-serif; font-size: 13px;
      outline: none; border-radius: 2px;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .ft-inp:focus { border-color: #b8963e; background: rgba(255,255,255,0.11); }
    .ft-inp::placeholder { color: rgba(255,255,255,0.3); }

    .ft-feedback-ok {
      background: rgba(16,185,129,0.12); color: #6ee7b7;
      border: 1px solid rgba(110,231,183,0.3); border-left: 4px solid #10b981;
      padding: 14px 18px; border-radius: 2px; margin-bottom: 16px;
      font-size: 13px; line-height: 1.6;
    }
    .ft-feedback-err {
      background: rgba(239,68,68,0.1); color: #fca5a5;
      border: 1px solid rgba(252,165,165,0.3); border-left: 4px solid #ef4444;
      padding: 14px 18px; border-radius: 2px; margin-bottom: 16px;
      font-size: 13px; line-height: 1.6;
    }
  `}</style>
);

// ── Data ─────────────────────────────────────────────────────────
const steps = [
  { num:"01", icon:"📋", title:"Submit Documents", desc:"Bring RC copy, valid ID proof, and vehicle at the showroom. Or apply online via our portal." },
  { num:"02", icon:"🔍", title:"Verification",     desc:"Our team verifies your documents and vehicle details in real-time through NHAI systems." },
  { num:"03", icon:"🏷️", title:"Tag Affixed",      desc:"FASTag sticker is professionally affixed to your windshield as per NHAI guidelines." },
  { num:"04", icon:"💳", title:"Load & Go",         desc:"Load minimum balance and your FASTag is instantly active at all toll plazas pan-India." },
];

const banks = [
  { name:"HDFC Bank",           color:"#003087" },
  { name:"ICICI Bank",          color:"#F7521E" },
  { name:"SBI",                 color:"#22409A" },
  { name:"Axis Bank",           color:"#800000" },
  { name:"Paytm Payments Bank", color:"#00BAF2" },
  { name:"Kotak Mahindra",      color:"#E31837" },
];

const faqs = [
  { q:"Is FASTag mandatory for all vehicles in India?",                a:"Yes. As per NHAI and Ministry of Road Transport, FASTag is mandatory for all 4-wheelers using national & state highways with toll plazas." },
  { q:"What documents are needed for FASTag at Manickbag?",           a:"You need your vehicle's RC (Registration Certificate), a valid photo ID (Aadhaar/PAN/Passport), and a passport-size photograph." },
  { q:"How much does FASTag cost at Manickbag?",                      a:"The FASTag tag costs Rs.100 (one-time). A minimum security deposit of Rs.200 and Rs.100 initial load is required — total Rs.400 to get started." },
  { q:"Can I get FASTag for a new Tata vehicle being delivered?",     a:"Yes! We affix FASTag at the time of new vehicle delivery. This is included as part of your delivery process at all Manickbag showrooms." },
  { q:"How do I recharge my FASTag?",                                 a:"You can recharge through net banking, UPI, Paytm, PhonePe, or any bank's mobile app linked to your FASTag account. No need to visit the showroom." },
  { q:"What if my vehicle passes a toll with insufficient FASTag balance?", a:"The toll operator will charge double the toll fee in cash. Always keep a minimum balance of Rs.200 to avoid penalties." },
];

const FORM_FIELDS = [
  { field:"name",    label:"Full Name",                  type:"text", placeholder:"Enter your full name" },
  { field:"phone",   label:"Mobile Number",              type:"tel",  placeholder:"+91 XXXXX XXXXX" },
  { field:"regNo",   label:"Vehicle Registration No.",   type:"text", placeholder:"KA-01-AB-1234" },
  { field:"vehicle", label:"Vehicle Model (optional)",   type:"text", placeholder:"e.g. Tata Nexon" },
];

// ══════════════════════════════════════════════════════════════════
//  FASTAG ENQUIRY FORM — connected to fastag.php + fastag_enquiries table
// ══════════════════════════════════════════════════════════════════
function FASTagForm() {
  const EMPTY = { name: "", phone: "", regNo: "", vehicle: "" };
  const [formData,  setFormData]  = useState(EMPTY);
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback,  setFeedback]  = useState({ type: "", text: "" });

  const handle = (field, value) => setFormData((d) => ({ ...d, [field]: value }));

  const handleSubmit = async () => {
    setFeedback({ type: "", text: "" });

    // Client-side validation first
    const err = clientValidate(formData);
    if (err) { setFeedback({ type: "error", text: err }); return; }

    setLoading(true);
    try {
      await apiPost("fastag.php", formData);
      setSubmitted(true);
    } catch (ex) {
      setFeedback({ type: "error", text: ex.message });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>&#x2705;</div>
        <div className="cormorant" style={{ fontSize: 28, color: BRAND.white, marginBottom: 8 }}>Request Received!</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          Our team will contact you within 2 hours to schedule your FASTag appointment.
        </div>
        <button
          onClick={() => { setSubmitted(false); setFormData(EMPTY); setFeedback({ type: "", text: "" }); }}
          style={{ marginTop: 24, padding: "10px 28px", background: "transparent", border: "1px solid rgba(184,150,62,0.4)", color: BRAND.gold, fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {feedback.text && (
        <div className={feedback.type === "success" ? "ft-feedback-ok" : "ft-feedback-err"}>
          {feedback.text}
        </div>
      )}

      {FORM_FIELDS.map(({ field, label, type, placeholder }) => (
        <div key={field}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 6 }}>
            {label}
            {field !== "vehicle" && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
          </label>
          <input
            className="ft-inp"
            type={type}
            placeholder={placeholder}
            value={formData[field]}
            maxLength={field === "phone" ? 10 : field === "regNo" ? 15 : 100}
            inputMode={field === "phone" ? "numeric" : "text"}
            onChange={(e) => handle(field, e.target.value)}
          />
        </div>
      ))}

      <button
        className="ft-btn-gold"
        onClick={handleSubmit}
        disabled={loading}
        style={{ padding: "14px", fontSize: 13, borderRadius: 2, marginTop: 8 }}
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════
export default function FASTag() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <Layout>
      <PageStyles />

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg," + BRAND.navy + " 0%," + BRAND.navyMid + " 50%,#0b2240 100%)", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 200, height: 100, background: "linear-gradient(135deg,#ff6b35,#f7931e)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(247,147,30,0.3)", overflow: "hidden" }}>
          <div className="ft-scanline" style={{ position: "absolute", width: "100%", height: 2, background: "rgba(255,255,255,0.6)", top: 0 }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: BRAND.white, letterSpacing: 2 }}>FASTAG</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>NHAI · RFID ENABLED</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: "10%", top: "15%", width: 240, height: 120, border: "1px dashed rgba(247,147,30,0.3)", borderRadius: 10 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>FASTag Services</span>
          </div>
          <h1 className="cormorant" style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.1, marginBottom: 16 }}>
            Toll-Free <span className="gold-shimmer">Travel</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 480, lineHeight: 1.8, marginBottom: 40 }}>
            Get your NHAI-issued FASTag at any Manickbag showroom. Mandatory for all 4-wheelers. New vehicle deliveries include FASTag as standard.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["⚡","Same Day Activation","Walk-in or prior appointment"],["🏪","12 Showroom Locations","Across North Karnataka"]].map(([icon, title, sub]) => (
              <div key={title} style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.07)", padding: "12px 20px", borderRadius: 4 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, color: BRAND.white, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{sub}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(184,150,62,0.15)", padding: "12px 20px", borderRadius: 4, border: "1px solid " + BRAND.borderLight }}>
              <span style={{ fontSize: 20 }}>&#x1F697;</span>
              <div>
                <div style={{ fontSize: 13, color: BRAND.gold, fontWeight: 500 }}>Free with New Delivery</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>All new Tata vehicles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: BRAND.gold }} />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Simple Process</span>
            <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", color: BRAND.navyMid }}>Get Your FASTag in 4 Steps</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 64 }}>
          {steps.map((step, i) => (
            <div key={step.num} className="ft-step-card"
              style={{ background: BRAND.offWhite, padding: "32px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)", position: "relative", animation: "ft-fadeUp 0.5s ease " + (i * 0.1) + "s both" }}>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", color: BRAND.gold, fontSize: 20, zIndex: 1 }}>&#x203A;</div>
              )}
              <div className="cormorant" style={{ fontSize: 56, fontWeight: 700, color: "rgba(10,31,63,0.06)", lineHeight: 1, marginBottom: -8 }}>{step.num}</div>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: BRAND.navyMid, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Form + Requirements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 64 }}>

          {/* ── FORM (backend connected) ── */}
          <div style={{ background: BRAND.navyMid, padding: "40px 36px" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 12 }}>Quick Enquiry</div>
            <h3 className="cormorant" style={{ fontSize: 32, color: BRAND.white, marginBottom: 24 }}>Apply for FASTag</h3>
            <FASTagForm />
          </div>

          {/* ── Documents + Pricing ── */}
          <div>
            <div style={{ background: BRAND.offWhite, padding: "32px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: BRAND.navyMid, marginBottom: 20 }}>Documents Required</h3>
              {[
                ["📄","Vehicle RC","Original + Photocopy"],
                ["🪪","Photo ID","Aadhaar / PAN / Passport"],
                ["📸","Passport Photo","1 recent photograph"],
                ["📱","Mobile Number","Linked to bank account"],
              ].map(([icon, doc, detail]) => (
                <div key={doc} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", alignItems: "center" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: BRAND.navyMid }}>{doc}</div>
                    <div style={{ fontSize: 11, color: BRAND.muted }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: BRAND.navyMid, padding: "28px 32px" }}>
              <h3 style={{ fontSize: 16, color: BRAND.gold, marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pricing Breakdown</h3>
              {[
                ["FASTag Tag Fee",  "Rs. 100", false],
                ["Security Deposit","Rs. 200", false],
                ["Minimum Load",   "Rs. 100", false],
                ["Total to Pay",   "Rs. 400", true ],
              ].map(([item, amt, bold]) => (
                <div key={item} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: bold ? "none" : "1px solid rgba(255,255,255,0.06)", borderTop: bold ? "1px solid " + BRAND.borderLight : "none", marginTop: bold ? 4 : 0 }}>
                  <span style={{ fontSize: 13, color: bold ? BRAND.white : "rgba(255,255,255,0.5)", fontWeight: bold ? 600 : 400 }}>{item}</span>
                  <span className="cormorant" style={{ fontSize: bold ? 22 : 16, color: bold ? BRAND.gold : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{amt}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                * Security deposit refundable on account closure. Tag fee non-refundable.
              </div>
            </div>
          </div>
        </div>

        {/* Bank Partners */}
        <div style={{ background: BRAND.offWhite, padding: "40px" }}>
          <h3 className="cormorant" style={{ fontSize: 28, color: BRAND.navyMid, marginBottom: 24, textAlign: "center" }}>Supported Bank FASTag Accounts</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
            {banks.map((b) => (
              <div key={b.name}
                style={{ padding: "16px 12px", border: "1px solid rgba(0,0,0,0.06)", textAlign: "center", background: BRAND.white, transition: "all 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = BRAND.gold; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 11, fontWeight: 500, color: BRAND.navyMid, lineHeight: 1.4 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQs ── */}
      <div style={{ background: BRAND.navyMid, padding: "60px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="cormorant" style={{ fontSize: 36, color: BRAND.white, textAlign: "center", marginBottom: 40 }}>FASTag FAQ</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(184,150,62,0.15)", overflow: "hidden" }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", cursor: "pointer" }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: BRAND.white, paddingRight: 24 }}>{faq.q}</span>
                <span style={{ color: BRAND.gold, fontSize: 18, flexShrink: 0, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </div>
              <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, paddingBottom: 20 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
