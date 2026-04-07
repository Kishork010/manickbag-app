// ══════════════════════════════════════════════════════════════════
//  MANICKBAG — TEST DRIVE BOOKING MODAL
//  File: src/components/TestDriveModal.jsx
//
//  HOW TO USE in any page/component:
//
//    import TestDriveModal from "../components/TestDriveModal";
//
//    // 1. Add state:
//    const [showBooking, setShowBooking] = useState(false);
//
//    // 2. Trigger it from "Book Test Drive" button:
//    <button onClick={() => setShowBooking(true)}>Book Test Drive</button>
//
//    // 3. Render modal:
//    <TestDriveModal
//      isOpen={showBooking}
//      onClose={() => setShowBooking(false)}
//      defaultVehicle="Nexon"   // optional: pre-select a vehicle
//    />
//
//  API:
//    Calls POST http://localhost:3001/api/bookings
//    Change API_BASE below to your production URL.
// ══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

// ── Change this to your deployed server URL in production ──
const API_BASE = "http://localhost:3001";

// ─── BRAND ───────────────────────────────────────────────────────
const B = {
  navy:        "#0a1628",
  navyMid:     "#0c1f3f",
  navyLight:   "#1a3d7c",
  gold:        "#b8963e",
  goldLight:   "#d4af5a",
  white:       "#ffffff",
  offWhite:    "#f7f5f0",
  muted:       "#6b7280",
  error:       "#e53935",
  success:     "#2e7d32",
  border:      "rgba(184,150,62,0.25)",
};

const VEHICLES = [
  "Tiago","Tiago EV","Altroz","Tigor","Tigor EV",
  "Punch","Punch EV","Nexon","Nexon EV",
  "Harrier","Harrier EV","Safari","Curvv","Curvv EV",
  "Sierra","Xpress T","Xpress T EV",
];

const SHOWROOMS = [
  "Belgaum – 3'S Showroom",
  "Hubli – 3'S Showroom",
  "Dharwad – 3'S Showroom",
  "Karwar – 3'S Showroom",
  "Bijapur – 3'S Showroom",
  "Kalaburagi – 3'S Showroom",
];

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM",
];

// ─── MODAL STYLES INJECTED ONCE ──────────────────────────────────
const ModalStyles = () => (
  <style>{`
    @keyframes mb-fadeIn  { from { opacity:0 }              to { opacity:1 } }
    @keyframes mb-slideUp { from { opacity:0; transform:translateY(40px) scale(0.97) }
                            to   { opacity:1; transform:translateY(0)    scale(1)    } }
    @keyframes mb-spin    { to   { transform:rotate(360deg) } }
    @keyframes mb-bounce  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
    @keyframes mb-shimmer {
      0%   { background-position:-200% center }
      100% { background-position: 200% center }
    }

    .mb-overlay {
      position:fixed; inset:0; z-index:9999;
      background:rgba(5,10,20,0.82);
      backdrop-filter:blur(6px);
      display:flex; align-items:center; justify-content:center;
      padding:16px;
      animation:mb-fadeIn 0.25s ease;
    }

    .mb-modal {
      position:relative;
      width:100%; max-width:660px;
      max-height:92vh;
      overflow-y:auto;
      background:${B.navyMid};
      border:1px solid ${B.border};
      border-top:3px solid ${B.gold};
      box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,150,62,0.1);
      animation:mb-slideUp 0.35s cubic-bezier(0.22,1,0.36,1);
    }

    .mb-modal::-webkit-scrollbar { width:4px }
    .mb-modal::-webkit-scrollbar-track { background:transparent }
    .mb-modal::-webkit-scrollbar-thumb { background:${B.gold}; border-radius:2px }

    .mb-field {
      display:flex; flex-direction:column; gap:6px;
    }

    .mb-label {
      font-size:11px; font-weight:600;
      letter-spacing:0.12em; text-transform:uppercase;
      color:rgba(255,255,255,0.55);
    }

    .mb-input {
      width:100%;
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(184,150,62,0.2);
      color:${B.white};
      font-family:'Jost',sans-serif;
      font-size:14px;
      padding:11px 14px;
      outline:none;
      transition:border-color 0.2s, background 0.2s;
      appearance:none; -webkit-appearance:none;
      border-radius:0;
    }
    .mb-input::placeholder { color:rgba(255,255,255,0.25) }
    .mb-input:focus { border-color:${B.gold}; background:rgba(184,150,62,0.06) }
    .mb-input.mb-error { border-color:${B.error} }

    .mb-select {
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8963e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat;
      background-position:right 14px center;
      padding-right:36px;
      cursor:pointer;
    }
    .mb-select option { background:${B.navy}; color:${B.white} }

    .mb-radio-group { display:flex; gap:8px }
    .mb-radio-label {
      flex:1; display:flex; align-items:center; justify-content:center;
      gap:8px; padding:11px 16px;
      border:1px solid rgba(184,150,62,0.2);
      cursor:pointer; transition:all 0.2s;
      font-size:13px; font-weight:500;
      color:rgba(255,255,255,0.6);
      user-select:none;
    }
    .mb-radio-label:hover { border-color:${B.gold}; color:${B.white} }
    .mb-radio-label.active {
      border-color:${B.gold};
      background:rgba(184,150,62,0.1);
      color:${B.white};
    }
    .mb-radio-label input { display:none }

    .mb-time-grid {
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:6px;
    }
    .mb-time-btn {
      padding:8px 4px;
      border:1px solid rgba(184,150,62,0.2);
      background:transparent;
      color:rgba(255,255,255,0.55);
      font-family:'Jost',sans-serif;
      font-size:11px; letter-spacing:0.04em;
      cursor:pointer; transition:all 0.18s;
    }
    .mb-time-btn:hover  { border-color:${B.gold}; color:${B.white} }
    .mb-time-btn.active {
      background:${B.gold}; border-color:${B.gold};
      color:${B.navy}; font-weight:700;
    }

    .mb-err-text {
      font-size:11px; color:${B.error};
      margin-top:2px; letter-spacing:0.03em;
    }

    .mb-submit {
      width:100%;
      padding:15px;
      background:linear-gradient(135deg,${B.gold},${B.goldLight});
      color:${B.navy};
      font-family:'Jost',sans-serif;
      font-size:13px; font-weight:700;
      letter-spacing:0.15em; text-transform:uppercase;
      border:none; cursor:pointer;
      position:relative; overflow:hidden;
      transition:opacity 0.2s, transform 0.1s;
    }
    .mb-submit:hover  { opacity:0.92 }
    .mb-submit:active { transform:scale(0.99) }
    .mb-submit:disabled { opacity:0.5; cursor:not-allowed }

    .mb-submit::before {
      content:'';
      position:absolute; inset:0;
      background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%);
      background-size:200% auto;
      animation:mb-shimmer 2s linear infinite;
      pointer-events:none;
    }

    .mb-spinner {
      width:18px; height:18px;
      border:2px solid rgba(10,22,40,0.3);
      border-top-color:${B.navy};
      border-radius:50%;
      animation:mb-spin 0.7s linear infinite;
      display:inline-block;
    }

    .mb-success-icon { animation:mb-bounce 0.5s ease }

    .mb-close {
      position:absolute; top:16px; right:16px;
      width:36px; height:36px;
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);
      color:rgba(255,255,255,0.5);
      font-size:18px; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:all 0.2s;
    }
    .mb-close:hover { background:rgba(255,255,255,0.1); color:${B.white} }
  `}</style>
);

// ─── FIELD COMPONENT ─────────────────────────────────────────────
const Field = ({ label, error, required, children }) => (
  <div className="mb-field">
    <label className="mb-label">
      {label}{required && <span style={{ color: B.gold, marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {error && <span className="mb-err-text">⚠ {error}</span>}
  </div>
);

// ─── INITIAL STATE ───────────────────────────────────────────────
const INIT = {
  name: "", phone: "", email: "", address: "",
  vehicle: "", booking_date: "", booking_time: "",
  visit_type: "showroom", showroom: "", notes: "",
};

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function TestDriveModal({ isOpen, onClose, defaultVehicle = "" }) {
  const [form,      setForm]      = useState({ ...INIT, vehicle: defaultVehicle });
  const [errors,    setErrors]    = useState({});
  const [submitting,setSubmitting]= useState(false);
  const [success,   setSuccess]   = useState(null); // booking object on success
  const overlayRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm({ ...INIT, vehicle: defaultVehicle });
      setErrors({});
      setSuccess(null);
    }
  }, [isOpen, defaultVehicle]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else        document.body.style.overflow = "";
    return ()  => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  // ── helpers ──
  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const today = new Date().toISOString().split("T")[0];

  // ── client-side validation ──
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,"")))
      e.phone = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.vehicle)
      e.vehicle = "Please choose a vehicle.";
    if (!form.booking_date)
      e.booking_date = "Please pick a date.";
    if (!form.booking_time)
      e.booking_time = "Please select a time slot.";
    if (form.visit_type === "showroom" && !form.showroom)
      e.showroom = "Please choose a showroom.";
    if (form.visit_type === "home" && !form.address.trim())
      e.address = "Please enter your address for home visit.";
    return e;
  };

  // ── submit ──
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/api/bookings`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          phone: form.phone.replace(/\s/g,""),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(data);
      } else {
        // Map server errors back to fields or show generic
        const serverErrors = {};
        (data.errors || []).forEach(msg => {
          if (/name/i.test(msg))    serverErrors.name    = msg;
          else if (/phone/i.test(msg))  serverErrors.phone   = msg;
          else if (/email/i.test(msg))  serverErrors.email   = msg;
          else if (/vehicle/i.test(msg))serverErrors.vehicle = msg;
          else if (/date/i.test(msg))   serverErrors.booking_date = msg;
          else if (/time/i.test(msg))   serverErrors.booking_time = msg;
          else serverErrors._general = msg;
        });
        setErrors(serverErrors);
      }
    } catch {
      setErrors({ _general: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── success screen ──
  if (success) return (
    <>
      <ModalStyles />
      <div className="mb-overlay" ref={overlayRef} onClick={e => e.target===overlayRef.current && onClose()}>
        <div className="mb-modal" style={{ padding: "56px 48px", textAlign: "center" }}>
          <button className="mb-close" onClick={onClose}>✕</button>

          <div className="mb-success-icon" style={{ fontSize: 56, marginBottom: 20 }}>✅</div>

          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: B.gold, marginBottom: 12 }}>
            Booking Confirmed
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: B.white, lineHeight: 1.2, marginBottom: 16 }}>
            Your Test Drive<br />is Scheduled!
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
            {success.message}
          </p>

          {/* Booking summary card */}
          <div style={{ background: "rgba(184,150,62,0.07)", border: `1px solid ${B.border}`, padding: "24px 28px", textAlign: "left", marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: B.gold, marginBottom: 16, fontWeight: 600 }}>
              Booking Summary — #{success.booking?.id}
            </div>
            {[
              ["Customer",  success.booking?.name],
              ["Vehicle",   success.booking?.vehicle],
              ["Date",      success.booking?.booking_date],
              ["Time",      success.booking?.booking_time],
              ["Type",      success.booking?.visit_type === "home" ? "🏠 Home Test Drive" : "🏢 Showroom Visit"],
              success.booking?.showroom ? ["Showroom", success.booking.showroom] : null,
            ].filter(Boolean).map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{k}</span>
                <span style={{ color: B.white, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
            Our team will call you on <strong style={{ color: B.white }}>{success.booking?.phone}</strong> within 2 hours to confirm.
          </p>

          <button className="mb-submit" onClick={onClose} style={{ maxWidth: 300, margin: "0 auto", display: "block" }}>
            Done
          </button>
        </div>
      </div>
    </>
  );

  // ── form screen ──
  return (
    <>
      <ModalStyles />
      <div
        className="mb-overlay"
        ref={overlayRef}
        onClick={e => e.target === overlayRef.current && onClose()}
      >
        <div className="mb-modal">
          {/* ── HEADER ── */}
          <div style={{ padding: "28px 32px 24px", borderBottom: `1px solid rgba(184,150,62,0.12)`, position: "relative" }}>
            <button className="mb-close" onClick={onClose}>✕</button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 32, height: 1, background: B.gold }} />
              <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: B.gold, fontWeight: 600 }}>
                Manickbag Automobiles
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, color: B.white, lineHeight: 1.1 }}>
              Book a Test Drive
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8, lineHeight: 1.6 }}>
              Experience your dream Tata at your nearest showroom — or let us come to you.
            </p>
          </div>

          {/* ── FORM BODY ── */}
          <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* General error */}
            {errors._general && (
              <div style={{ background: "rgba(229,57,53,0.12)", border: "1px solid rgba(229,57,53,0.3)", padding: "12px 16px", fontSize: 13, color: "#ff8a80" }}>
                ⚠ {errors._general}
              </div>
            )}

            {/* Row 1: Name + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Full Name" error={errors.name} required>
                <input className={`mb-input${errors.name ? " mb-error" : ""}`}
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                />
              </Field>
              <Field label="Mobile Number" error={errors.phone} required>
                <input className={`mb-input${errors.phone ? " mb-error" : ""}`}
                  placeholder="10-digit number"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => set("phone", e.target.value.replace(/\D/g,""))}
                />
              </Field>
            </div>

            {/* Row 2: Email */}
            <Field label="Email Address" error={errors.email}>
              <input className={`mb-input${errors.email ? " mb-error" : ""}`}
                type="email"
                placeholder="Optional — for booking confirmation"
                value={form.email}
                onChange={e => set("email", e.target.value)}
              />
            </Field>

            {/* Row 3: Vehicle */}
            <Field label="Vehicle of Interest" error={errors.vehicle} required>
              <select className={`mb-input mb-select${errors.vehicle ? " mb-error" : ""}`}
                value={form.vehicle}
                onChange={e => set("vehicle", e.target.value)}
              >
                <option value="">— Select a vehicle —</option>
                {VEHICLES.map(v => (
                  <option key={v} value={v}>{v}{v.includes("EV") ? " ⚡" : ""}</option>
                ))}
              </select>
            </Field>

            {/* Row 4: Date + Time label row */}
            <Field label="Preferred Date" error={errors.booking_date} required>
              <input className={`mb-input${errors.booking_date ? " mb-error" : ""}`}
                type="date"
                min={today}
                value={form.booking_date}
                onChange={e => set("booking_date", e.target.value)}
                style={{ colorScheme: "dark" }}
              />
            </Field>

            {/* Time slots */}
            <Field label="Preferred Time" error={errors.booking_time} required>
              <div className="mb-time-grid">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`mb-time-btn${form.booking_time === t ? " active" : ""}`}
                    onClick={() => set("booking_time", t)}
                  >{t}</button>
                ))}
              </div>
            </Field>

            {/* Visit type */}
            <Field label="Visit Preference" required>
              <div className="mb-radio-group">
                <label className={`mb-radio-label${form.visit_type === "showroom" ? " active" : ""}`}>
                  <input type="radio" name="visit_type" value="showroom"
                    checked={form.visit_type === "showroom"}
                    onChange={() => set("visit_type", "showroom")}
                  />
                  🏢 Showroom Visit
                </label>
                <label className={`mb-radio-label${form.visit_type === "home" ? " active" : ""}`}>
                  <input type="radio" name="visit_type" value="home"
                    checked={form.visit_type === "home"}
                    onChange={() => set("visit_type", "home")}
                  />
                  🏠 Home Test Drive
                </label>
              </div>
            </Field>

            {/* Conditional: showroom selector OR home address */}
            {form.visit_type === "showroom" ? (
              <Field label="Select Showroom" error={errors.showroom} required>
                <select className={`mb-input mb-select${errors.showroom ? " mb-error" : ""}`}
                  value={form.showroom}
                  onChange={e => set("showroom", e.target.value)}
                >
                  <option value="">— Choose nearest showroom —</option>
                  {SHOWROOMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            ) : (
              <Field label="Your Address" error={errors.address} required>
                <textarea
                  className={`mb-input${errors.address ? " mb-error" : ""}`}
                  placeholder="Full address for our team to visit…"
                  rows={3}
                  value={form.address}
                  onChange={e => set("address", e.target.value)}
                  style={{ resize: "vertical", fontFamily: "'Jost',sans-serif" }}
                />
              </Field>
            )}

            {/* Notes */}
            <Field label="Additional Notes">
              <textarea
                className="mb-input"
                placeholder="Any specific requirements, preferred language, etc."
                rows={2}
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                style={{ resize: "none", fontFamily: "'Jost',sans-serif" }}
              />
            </Field>

            {/* Submit */}
            <button
              className="mb-submit"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ marginTop: 4 }}
            >
              {submitting
                ? <><span className="mb-spinner" /> &nbsp;Booking…</>
                : <span>📅 &nbsp;Confirm Test Drive Booking</span>
              }
            </button>

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.7 }}>
              By submitting, you agree to be contacted by Manickbag Automobiles.<br />
              Your data is safe and will not be shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}