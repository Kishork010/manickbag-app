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
    @keyframes sp-fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes sp-pulse  { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

    .sp-fadeUp { animation: sp-fadeUp 0.6s ease forwards; }

    .sp-btn-gold { background:linear-gradient(135deg,#b8963e,#d4af5a); color:#0a1628; border:none; cursor:pointer; font-family:'Jost',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s; }
    .sp-btn-gold:hover { opacity:0.9; transform:translateY(-1px); }

    .sp-btn-outline { background:transparent; border:1px solid #b8963e; color:#b8963e; cursor:pointer; font-family:'Jost',sans-serif; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s; }
    .sp-btn-outline:hover { background:#b8963e; color:#0a1628; }

    .sp-service-card { transition:all 0.3s ease; cursor:pointer; }
    .sp-service-card:hover { transform:translateY(-3px); }

    .sp-input { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; transition:border-color 0.2s; }
    .sp-input:focus { border-color:#b8963e; }
    .sp-input::placeholder { color:rgba(255,255,255,0.3); }

    .sp-select { width:100%; padding:12px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(184,150,62,0.2); color:#ffffff; font-family:'Jost',sans-serif; font-size:13px; outline:none; border-radius:2px; cursor:pointer; appearance:none; }
    .sp-select option { background:#0c1f3f; color:#ffffff; }

    .sp-step-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; transition:all 0.3s; }
    .sp-step-dot.active  { background:#b8963e; color:#0a1628; }
    .sp-step-dot.done    { background:#4caf50; color:#fff; }
    .sp-step-dot.pending { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.4); }
  `}</style>
);

const serviceTypes = [
  { id:"periodic",   icon:"🔄", title:"Periodic Service",      desc:"Scheduled maintenance at 5K, 10K, 20K km intervals",      duration:"4-6 hrs",    price:"From ₹1,800" },
  { id:"repair",     icon:"🔧", title:"Repair Service",         desc:"Diagnosis and repair of specific faults or issues",        duration:"As required", price:"On estimate" },
  { id:"bodyshop",   icon:"🎨", title:"Body Shop & Denting",    desc:"Paint, denting, panel repair and finish restoration",      duration:"1-5 days",   price:"On estimate" },
  { id:"wheel",      icon:"⚙️", title:"Wheel & Tyre",           desc:"Alignment, balancing, rotation and tyre replacement",     duration:"2-3 hrs",    price:"From ₹800" },
  { id:"electrical", icon:"⚡", title:"Electrical & AC",        desc:"Electrical diagnostics, AC servicing, battery check",     duration:"2-4 hrs",    price:"From ₹1,200" },
  { id:"doorstep",   icon:"🏠", title:"Doorstep Service",       desc:"Home pickup and drop service across North Karnataka",     duration:"Same day",   price:"From ₹2,500" },
];

const showrooms = [
  "Belgaum – Main Showroom","Hubbli – Main Showroom","Dharwad","Karwar","Bijapur","Gulbarga","Bidar","Yadgiri"
];
const tataModels = [
  "Tiago","Tiago EV","Altroz","Tigor","Tigor EV","Punch","Punch EV","Nexon","Nexon EV","Harrier","Harrier EV","Safari","Curvv","Curvv EV"
];
const timeslots = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"];
const processSteps = [
  { icon:"📋", title:"Book Appointment",   desc:"Online form or walk-in — your choice." },
  { icon:"🔍", title:"Vehicle Inspection", desc:"Multi-point check by trained technician." },
  { icon:"📊", title:"Estimate Approval",  desc:"Transparent cost estimate before any work begins." },
  { icon:"🔧", title:"Service & Repair",   desc:"Genuine Tata parts. Certified tools." },
  { icon:"✅", title:"Quality Check",      desc:"Pre-delivery inspection and road test." },
  { icon:"🚗", title:"Vehicle Delivery",   desc:"Detailed service report and digital invoice." },
];

export default function ServicePage() {
  const [selectedType, setSelectedType] = useState(null);
  const [step,         setStep]         = useState(1);
  const [form,         setForm]         = useState({ name:"", phone:"", regNo:"", model:"", showroom:"", date:"", time:"", issues:"" });
  const [submitted,    setSubmitted]    = useState(false);

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canProceed1 = selectedType && form.name && form.phone && form.regNo && form.model;
  const canProceed2 = form.showroom && form.date && form.time;

  const handleSubmit = async () => {
    if (!canProceed2) return;
    try {
      const res = await fetch("http://localhost:5000/api/book-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: selectedType, ...form }),
      });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else alert(data.message || "Booking failed");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Layout>
      <PageStyles />

      {/* ── Hero ── */}
      <div style={{ background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyMid} 60%,#0b2342 100%)`, padding:"72px 48px", position:"relative", overflow:"hidden" }}>
        {[...Array(4)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:BRAND.gold, opacity:0.25, left:`${60+i*10}%`, top:`${20+(i%3)*25}%`, animation:`sp-pulse ${2+i*0.4}s ease-in-out infinite` }} />
        ))}
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Authorised Service Centre</span>
          </div>
          <h1 className="cormorant" style={{ fontSize:"clamp(40px,5vw,72px)", fontWeight:300, color:BRAND.white, lineHeight:1.1, marginBottom:16 }}>
            Expert Care for <span className="gold-shimmer">Your Tata</span>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", maxWidth:520, lineHeight:1.8, marginBottom:40 }}>
            Factory-trained technicians. Genuine Tata parts. Transparent pricing. Book your service slot in 2 minutes.
          </p>
          <div style={{ display:"flex", gap:40 }}>
            {[["200+","Certified Technicians"],["100%","Genuine Parts"],["6 hrs","Avg. Turnaround"]].map(([val,lbl]) => (
              <div key={lbl}>
                <div className="cormorant" style={{ fontSize:36, fontWeight:600, color:BRAND.gold }}>{val}</div>
                <div style={{ fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service Types ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 48px 0" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
            <span style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:BRAND.gold }}>Service Types</span>
            <div style={{ width:40, height:1, background:BRAND.gold }} />
          </div>
          <h2 className="cormorant" style={{ fontSize:"clamp(28px,3vw,40px)", color:BRAND.navyMid }}>What service do you need?</h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:60 }}>
          {serviceTypes.map((s,i) => (
            <div key={s.id} className="sp-service-card"
              onClick={() => setSelectedType(s.id)}
              style={{ background:selectedType===s.id?BRAND.navyMid:BRAND.offWhite, border:`2px solid ${selectedType===s.id?BRAND.gold:"rgba(0,0,0,0.06)"}`, padding:"24px", animation:`sp-fadeUp 0.5s ease ${i*0.08}s both` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:36 }}>{s.icon}</span>
                {selectedType===s.id && <span style={{ fontSize:16, color:BRAND.gold }}>✓</span>}
              </div>
              <h3 style={{ fontSize:16, fontWeight:600, color:selectedType===s.id?BRAND.white:BRAND.navyMid, marginBottom:8 }}>{s.title}</h3>
              <p style={{ fontSize:12, color:selectedType===s.id?"rgba(255,255,255,0.55)":BRAND.muted, lineHeight:1.6, marginBottom:14 }}>{s.desc}</p>
              <div style={{ display:"flex", gap:16 }}>
                <div style={{ fontSize:11, color:selectedType===s.id?BRAND.gold:BRAND.muted }}>⏱ {s.duration}</div>
                <div style={{ fontSize:11, color:selectedType===s.id?BRAND.goldLight:BRAND.navyMid, fontWeight:500 }}>{s.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Booking Form ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, marginBottom:64 }}>
          <div style={{ background:BRAND.navyMid, padding:"40px 36px" }}>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
                <div className="cormorant" style={{ fontSize:36, color:BRAND.white, marginBottom:12 }}>Booking Confirmed!</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:24 }}>
                  We've received your request. A confirmation will be sent to <strong style={{ color:BRAND.gold }}>{form.phone}</strong>.
                </div>
                <div style={{ background:"rgba(184,150,62,0.1)", border:`1px solid ${BRAND.borderLight}`, padding:"20px 24px", textAlign:"left", marginBottom:24 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:12 }}>Booking Summary</div>
                  {[["Service",serviceTypes.find(s=>s.id===selectedType)?.title||"—"],["Vehicle",form.model],["Showroom",form.showroom],["Date & Time",`${form.date} · ${form.time}`]].map(([label,val]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{label}</span>
                      <span style={{ fontSize:12, color:BRAND.white, fontWeight:500 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button className="sp-btn-gold" onClick={() => { setSubmitted(false); setStep(1); setForm({ name:"",phone:"",regNo:"",model:"",showroom:"",date:"",time:"",issues:"" }); setSelectedType(null); }}
                  style={{ padding:"12px 28px", fontSize:12, borderRadius:2 }}>Book Another Service</button>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
                  {[1,2].map((s,i) => (
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div className={`sp-step-dot ${step>s?"done":step===s?"active":"pending"}`}>
                        {step>s?"✓":s}
                      </div>
                      <div>
                        <div style={{ fontSize:11, color:step>=s?BRAND.gold:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Step {s}</div>
                        <div style={{ fontSize:12, color:step>=s?BRAND.white:"rgba(255,255,255,0.3)" }}>{s===1?"Vehicle Details":"Appointment"}</div>
                      </div>
                      {i===0 && <div style={{ flex:1, height:1, background:step>1?BRAND.gold:"rgba(255,255,255,0.1)", width:40 }} />}
                    </div>
                  ))}
                </div>

                {step===1 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Your Details</div>
                    {[["name","Full Name","text","John Doe"],["phone","Mobile Number","tel","+91 98765 43210"],["regNo","Registration Number","text","KA-XX-XXXX"]].map(([k,l,t,p]) => (
                      <div key={k}>
                        <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>{l}</label>
                        <input type={t} placeholder={p} className="sp-input" value={form[k]} onChange={e=>updateForm(k,e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Vehicle Model</label>
                      <select className="sp-select" value={form.model} onChange={e=>updateForm("model",e.target.value)}>
                        <option value="">Select your Tata model</option>
                        {tataModels.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Describe the Issue (optional)</label>
                      <textarea className="sp-input" rows={3} placeholder="e.g. Engine noise, AC not cooling..." value={form.issues} onChange={e=>updateForm("issues",e.target.value)} style={{ resize:"vertical" }} />
                    </div>
                    <button className="sp-btn-gold" onClick={() => canProceed1&&setStep(2)} style={{ padding:"13px", fontSize:12, borderRadius:2, opacity:canProceed1?1:0.5 }}>
                      Next: Choose Slot →
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Schedule Appointment</div>
                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Select Showroom</label>
                      <select className="sp-select" value={form.showroom} onChange={e=>updateForm("showroom",e.target.value)}>
                        <option value="">Choose nearest location</option>
                        {showrooms.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:5 }}>Preferred Date</label>
                      <input type="date" className="sp-input" value={form.date} onChange={e=>updateForm("date",e.target.value)} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:10, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:8 }}>Preferred Time</label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                        {timeslots.map(t=>(
                          <button key={t} onClick={()=>updateForm("time",t)}
                            style={{ padding:"8px 4px", fontSize:11, cursor:"pointer", border:`1px solid ${form.time===t?BRAND.gold:"rgba(255,255,255,0.1)"}`, background:form.time===t?BRAND.gold:"rgba(255,255,255,0.05)", color:form.time===t?BRAND.navy:"rgba(255,255,255,0.6)", borderRadius:2, fontFamily:"'Jost',sans-serif", fontWeight:form.time===t?600:400 }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <button className="sp-btn-outline" onClick={()=>setStep(1)} style={{ flex:1, padding:"12px", fontSize:12, borderRadius:2 }}>← Back</button>
                      <button className="sp-btn-gold" onClick={handleSubmit} disabled={!canProceed2}
                        style={{ flex:2, padding:"12px", fontSize:12, borderRadius:2, opacity:canProceed2?1:0.5, cursor:canProceed2?"pointer":"not-allowed" }}>
                        Confirm Booking ✓
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Service Process */}
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:BRAND.gold, marginBottom:16 }}>Our Service Process</div>
            <h3 className="cormorant" style={{ fontSize:32, color:BRAND.navyMid, marginBottom:28 }}>What to Expect</h3>
            {processSteps.map((s,i) => (
              <div key={s.title} style={{ display:"flex", gap:16, marginBottom:20, padding:"16px 20px", background:BRAND.offWhite, border:"1px solid rgba(0,0,0,0.05)", animation:`sp-fadeUp 0.5s ease ${i*0.08}s both` }}>
                <div style={{ width:36, height:36, background:BRAND.navyMid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:BRAND.gold, marginBottom:4 }}>Step {i+1}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:BRAND.navyMid, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:BRAND.muted }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ background:BRAND.navyMid, padding:"20px 24px", display:"flex", gap:16, alignItems:"center" }}>
              <span style={{ fontSize:28 }}>📱</span>
              <div>
                <div style={{ fontSize:13, color:BRAND.white, fontWeight:600, marginBottom:4 }}>Track your service live</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Get real-time WhatsApp updates at every stage of your vehicle's service.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Service Packages ── */}
      <div style={{ background:BRAND.offWhite, padding:"60px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <h2 className="cormorant" style={{ fontSize:36, color:BRAND.navyMid, textAlign:"center", marginBottom:40 }}>Standard Service Packages</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { km:"5,000 km",  label:"1st Free Service", items:["Engine oil check","Fluid top-up","Multi-point inspection","Tyre pressure check"],     price:"Free",         highlight:true  },
              { km:"10,000 km", label:"2nd Service",       items:["Engine oil change","Oil filter","Air filter check","Brake inspection"],               price:"From ₹1,800",  highlight:false },
              { km:"20,000 km", label:"Annual Service",    items:["Full fluid change","Filters replaced","Spark plug check","Cabin filter change"],      price:"From ₹3,200",  highlight:false },
              { km:"40,000 km", label:"Major Service",     items:["Complete fluid flush","Belt inspection","Brake overhaul","Full diagnostics"],         price:"From ₹6,500",  highlight:false },
            ].map(pkg => (
              <div key={pkg.km} style={{ background:pkg.highlight?BRAND.navyMid:BRAND.white, border:`1px solid ${pkg.highlight?BRAND.gold:"rgba(0,0,0,0.06)"}`, padding:"24px 20px", position:"relative" }}>
                {pkg.highlight && <div style={{ position:"absolute", top:-1, left:-1, right:-1, height:3, background:`linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight})` }} />}
                <div className="cormorant" style={{ fontSize:28, fontWeight:600, color:pkg.highlight?BRAND.gold:BRAND.navyMid, marginBottom:4 }}>{pkg.km}</div>
                <div style={{ fontSize:12, color:pkg.highlight?"rgba(255,255,255,0.5)":BRAND.muted, marginBottom:16, letterSpacing:"0.05em" }}>{pkg.label}</div>
                {pkg.items.map(item => (
                  <div key={item} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid rgba(${pkg.highlight?"255,255,255":"0,0,0"},0.06)`, alignItems:"center" }}>
                    <span style={{ color:BRAND.gold, fontSize:12 }}>›</span>
                    <span style={{ fontSize:12, color:pkg.highlight?"rgba(255,255,255,0.7)":BRAND.muted }}>{item}</span>
                  </div>
                ))}
                <div className="cormorant" style={{ fontSize:22, color:pkg.highlight?BRAND.gold:BRAND.navyMid, fontWeight:600, marginTop:16, marginBottom:12 }}>{pkg.price}</div>
                <button className={pkg.highlight?"sp-btn-gold":"sp-btn-outline"} style={{ width:"100%", padding:"10px", fontSize:11, borderRadius:2 }}>Book This</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}