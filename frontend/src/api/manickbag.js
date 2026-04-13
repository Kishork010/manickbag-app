// ============================================================
//  src/api/manickbag.js
//  Central API service — import and use anywhere in React
// ============================================================

// ── Base URL ─────────────────────────────────────────────────
// Change this to your actual domain in production
const BASE_URL = process.env.REACT_APP_API_URL || 'https://www.manickbag.in/backend/api';

// ── Generic fetch wrapper ─────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}/${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    // Throw the server error message so the form can display it
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

// ============================================================
//  1. QUOTE API
// ============================================================
export const QuoteAPI = {
  /** Submit a new quote request */
  submit: (formData) => apiCall('quote.php', 'POST', formData),

  /** Admin: fetch all quotes */
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return apiCall(`quote.php${qs ? '?' + qs : ''}`);
  },

  /** Admin: update status */
  updateStatus: (id, status) =>
    apiCall(`quote.php?id=${id}`, 'PUT', { status }),

  /** Admin: delete */
  delete: (id) => apiCall(`quote.php?id=${id}`, 'DELETE'),
};

// ============================================================
//  2. CONTACT API
// ============================================================
export const ContactAPI = {
  /** Submit a contact inquiry */
  submit: (formData) => apiCall('contact.php', 'POST', formData),

  /** Admin: fetch all */
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return apiCall(`contact.php${qs ? '?' + qs : ''}`);
  },

  /** Admin: update status */
  updateStatus: (id, status) =>
    apiCall(`contact.php?id=${id}`, 'PUT', { status }),

  /** Admin: delete */
  delete: (id) => apiCall(`contact.php?id=${id}`, 'DELETE'),
};

// ============================================================
//  3. TEST DRIVE API
// ============================================================
export const TestDriveAPI = {
  /** Submit a test drive booking */
  submit: (formData) => apiCall('test-drive.php', 'POST', formData),

  /** Admin: fetch all bookings */
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return apiCall(`test-drive.php${qs ? '?' + qs : ''}`);
  },

  /** Admin: update status */
  updateStatus: (id, status) =>
    apiCall(`test-drive.php?id=${id}`, 'PUT', { status }),

  /** Admin: delete */
  delete: (id) => apiCall(`test-drive.php?id=${id}`, 'DELETE'),
};


// ============================================================
//  EXAMPLE — QUOTE POPUP COMPONENT
//  Replace / merge into your existing QuotePopup.jsx
// ============================================================
/*
import { useState } from "react";
import { QuoteAPI } from "../api/manickbag";

export default function QuotePopup({ vehicleName, onClose }) {
  const [form, setForm] = useState({
    vehicle_name: vehicleName,
    full_name:    '',
    mobile:       '',
    email:        '',
    city:         '',
    fuel_type:    '',
    message:      '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await QuoteAPI.submit(form);
      setFeedback({ type: 'success', text: res.message });
      setTimeout(onClose, 3000); // auto-close after 3s
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:4, padding:32, width:440, maxWidth:'95vw', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer' }}>✕</button>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:'#0c1f3f', marginBottom:20 }}>
          Get a Quote — {vehicleName}
        </h2>

        {feedback.text && (
          <div style={{
            padding:'12px 16px', borderRadius:2, marginBottom:16,
            background: feedback.type === 'success' ? '#e8f5e9' : '#fdecea',
            color:      feedback.type === 'success' ? '#2e7d32' : '#c62828',
            fontSize: 13,
          }}>
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="full_name" value={form.full_name} onChange={handle}
            placeholder="Full Name *" required
            style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14 }} />

          <input name="mobile" value={form.mobile} onChange={handle}
            placeholder="Mobile Number *" maxLength={10} required
            style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14 }} />

          <input name="email" value={form.email} onChange={handle}
            placeholder="Email (optional)" type="email"
            style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14 }} />

          <input name="city" value={form.city} onChange={handle}
            placeholder="Your City"
            style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14 }} />

          <select name="fuel_type" value={form.fuel_type} onChange={handle}
            style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14 }}>
            <option value="">Select Fuel Type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>iCNG</option>
            <option>Electric</option>
          </select>

          <textarea name="message" value={form.message} onChange={handle}
            placeholder="Any specific requirements?"
            rows={3}
            style={{ width:'100%', padding:'10px 14px', marginBottom:16, border:'1px solid #ddd', fontFamily:'Jost,sans-serif', fontSize:14, resize:'vertical' }} />

          <button type="submit" disabled={loading}
            style={{
              width:'100%', padding:'13px', background: loading ? '#999' : '#b8963e',
              color:'#0a1628', border:'none', fontWeight:600, fontSize:13,
              letterSpacing:'0.1em', textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Submitting…' : 'Request Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
*/


// ============================================================
//  EXAMPLE — CONTACT FORM (add to your ContactPage or Modal)
// ============================================================
/*
import { useState } from "react";
import { ContactAPI } from "../api/manickbag";

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name:   '',
    mobile:      '',
    email:       '',
    subject:     '',
    message:     '',
    source_page: 'home',
  });
  const [loading,  setLoading]  = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await ContactAPI.submit(form);
      setFeedback({ type: 'success', text: res.message });
      setForm({ full_name:'', mobile:'', email:'', subject:'', message:'', source_page:'home' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
      {feedback.text && (
        <div style={{
          padding:'12px 16px', marginBottom:16, borderRadius:2,
          background: feedback.type === 'success' ? '#e8f5e9' : '#fdecea',
          color:      feedback.type === 'success' ? '#2e7d32' : '#c62828',
        }}>
          {feedback.text}
        </div>
      )}

      <input name="full_name" value={form.full_name} onChange={handle}
        placeholder="Your Full Name *" required
        style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd' }} />

      <input name="mobile" value={form.mobile} onChange={handle}
        placeholder="Mobile Number *" maxLength={10} required
        style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd' }} />

      <input name="email" value={form.email} onChange={handle}
        placeholder="Email Address" type="email"
        style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd' }} />

      <input name="subject" value={form.subject} onChange={handle}
        placeholder="Subject"
        style={{ width:'100%', padding:'10px 14px', marginBottom:12, border:'1px solid #ddd' }} />

      <textarea name="message" value={form.message} onChange={handle}
        placeholder="Your message *" rows={4} required
        style={{ width:'100%', padding:'10px 14px', marginBottom:16, border:'1px solid #ddd', resize:'vertical' }} />

      <button type="submit" disabled={loading}
        style={{ width:'100%', padding:'13px', background:'#0c1f3f', color:'#fff', border:'none', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
*/


// ============================================================
//  EXAMPLE — TEST DRIVE BOOKING FORM
// ============================================================
/*
import { useState } from "react";
import { TestDriveAPI } from "../api/manickbag";

const VEHICLES = [
  'Tiago','Tiago EV','Altroz','Tigor','Tigor EV',
  'Punch','Punch EV','Nexon','Nexon EV',
  'Harrier','Harrier EV','Safari','Curvv','Curvv EV',
  'Sierra','Xpress T','Xpress T EV',
];

const CITIES = ['Belgaum','Hubli','Dharwad','Karwar','Bijapur','Gulbarga'];

const TIME_SLOTS = [
  '09:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM',
];

export default function TestDriveForm({ preselectedVehicle = '' }) {
  const [form, setForm] = useState({
    full_name:       '',
    mobile:          '',
    email:           '',
    vehicle_name:    preselectedVehicle,
    fuel_type:       '',
    preferred_date:  '',
    preferred_time:  '',
    showroom_city:   '',
    showroom_branch: '',
    message:         '',
  });
  const [loading,  setLoading]  = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [bookingRef, setBookingRef] = useState('');

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Min date = today; Max = 60 days
  const today  = new Date().toISOString().split('T')[0];
  const maxDay = new Date(Date.now() + 60 * 864e5).toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', text: '' });
    setBookingRef('');
    try {
      const res = await TestDriveAPI.submit(form);
      setFeedback({ type: 'success', text: res.message });
      setBookingRef(res.data?.booking_ref || '');
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {feedback.text && (
        <div style={{
          padding:'14px 18px', marginBottom:20, borderRadius:2,
          background: feedback.type === 'success' ? '#e8f5e9' : '#fdecea',
          color:      feedback.type === 'success' ? '#2e7d32' : '#c62828',
          fontSize: 14,
        }}>
          {feedback.text}
          {bookingRef && (
            <div style={{ fontWeight:700, marginTop:6 }}>
              Your Booking Reference: <span style={{ color:'#0c1f3f' }}>{bookingRef}</span>
            </div>
          )}
        </div>
      )}

      {/* Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <input name="full_name" value={form.full_name} onChange={handle}
          placeholder="Full Name *" required
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }} />
        <input name="mobile" value={form.mobile} onChange={handle}
          placeholder="Mobile *" maxLength={10} required
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }} />
      </div>

      {/* Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <input name="email" value={form.email} onChange={handle}
          placeholder="Email (optional)" type="email"
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }} />
        <select name="vehicle_name" value={form.vehicle_name} onChange={handle} required
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }}>
          <option value="">Select Vehicle *</option>
          {VEHICLES.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Row 3 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <select name="fuel_type" value={form.fuel_type} onChange={handle}
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }}>
          <option value="">Fuel Type</option>
          <option>Petrol</option><option>Diesel</option>
          <option>iCNG</option><option>Electric</option>
        </select>
        <select name="showroom_city" value={form.showroom_city} onChange={handle} required
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }}>
          <option value="">Select Showroom City *</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Row 4 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <input name="preferred_date" value={form.preferred_date} onChange={handle}
          type="date" min={today} max={maxDay} required
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }} />
        <select name="preferred_time" value={form.preferred_time} onChange={handle}
          style={{ padding:'10px 14px', border:'1px solid #ddd', fontSize:14 }}>
          <option value="">Preferred Time</option>
          {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <textarea name="message" value={form.message} onChange={handle}
        placeholder="Any special requirements?"
        rows={3}
        style={{ width:'100%', padding:'10px 14px', marginBottom:16, border:'1px solid #ddd', fontSize:14, resize:'vertical' }} />

      <button type="submit" disabled={loading}
        style={{
          width:'100%', padding:'14px', fontWeight:700, fontSize:14,
          letterSpacing:'0.1em', textTransform:'uppercase',
          background: loading ? '#999' : 'linear-gradient(135deg,#b8963e,#d4af5a)',
          color:'#0a1628', border:'none', cursor: loading ? 'not-allowed' : 'pointer',
        }}>
        {loading ? 'Booking…' : '📅 Book Test Drive'}
      </button>
    </form>
  );
}

// Change this line in QuoteModal submit():
const res = await fetch("/api/amc_enquiry", {   // ← matches your file name
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        ...form,
        plan_name: planName,                    // ← make sure this is included
        plan_type: planName.toLowerCase().includes("gold")    ? "gold"
               : planName.toLowerCase().includes("silver")   ? "silver"
               : planName.toLowerCase().includes("protect")  ? "protect_plus"
               : "p2p",
        message: `Quote request for plan: ${planName}`,
    }),
});