// ============================================================
//  MANICKBAG AUTOMOBILES — QuotePopup.jsx  (v2)
//  Redesigned to match Proforma Invoice format
//
//  ADD TO public/index.html <head>:
//  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//
//  PRICING DATA: loaded from /public/pricing.xlsx at runtime
//  (or falls back to embedded data if file not found)
//
//  USAGE IN Home.jsx:
//    1. import QuotePopup from "./QuotePopup";
//    2. const [quoteVehicle, setQuoteVehicle] = useState(null);
//    3. Quote button: onClick={() => setQuoteVehicle(v.name)}
//    4. {quoteVehicle && <QuotePopup vehicleName={quoteVehicle} onClose={() => setQuoteVehicle(null)} />}
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

// ── BRAND TOKENS ─────────────────────────────────────────────
const B = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
};

// ── CONTACT INFO (customise here) ───────────────────────────
const CONTACTS = {
  manager: { name: "Sales Manager", mobile: "+91 96206 24365" },
  finance: { name: "Finance Officer", mobile: "+91 78929 85770" },
  sales:   { name: "Sales AGM", mobile: "+91 95383 24365" },
  salesGM: { name: "Sales GM", mobile: "+91 96208 24365" },
};

const BANK = {
  holder: "MANICKBAG AUTOMOBILES",
  bank:   "FEDERAL BANK",
  account:"16040200004057",
  ifsc:   "FDRL0001604",
  gstin:  "29AADCM6259K1ZX",
};

// ── EMBEDDED PRICING (fallback / used directly) ──────────────
const PRICING = {
  "Tiago": {
    "XE Petrol":  { ex:499000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM Petrol":  { ex:569000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XT Petrol":  { ex:649000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ Petrol":  { ex:719000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ+ Petrol": { ex:779000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM iCNG":    { ex:659000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
    "XT iCNG":    { ex:729000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
    "XZ iCNG":    { ex:799000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
  },
  "Tiago EV": {
    "Medium Range XE":     { ex:799000,  rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Medium Range XT":     { ex:849000,  rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Medium Range XZ+":    { ex:949000,  rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Long Range XZ+":      { ex:1099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Long Range XZ+ Tech": { ex:1199000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Altroz": {
    "XE Petrol":  { ex:649000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM Petrol":  { ex:729000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM+ Petrol": { ex:799000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ Petrol":  { ex:869000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ+ Petrol": { ex:949000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ+ Turbo":  { ex:1099000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ Diesel":  { ex:929000,  rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "XZ+ Diesel": { ex:1009000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "XM iCNG":    { ex:849000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
    "XZ iCNG":    { ex:949000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
  },
  "Tigor": {
    "XE":  { ex:599000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM":  { ex:679000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XT":  { ex:749000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ":  { ex:829000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XZ+": { ex:899000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
  },
  "Tigor EV": {
    "XM":     { ex:1199000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "XZ":     { ex:1299000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "XZ+":    { ex:1399000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "XZ+ LR": { ex:1499000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Punch": {
    "Pure":           { ex:599000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure":      { ex:699000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure S":    { ex:779000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Accomplished":   { ex:849000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Creative":       { ex:949000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Creative S":     { ex:999000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Pure iCNG":      { ex:699000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
    "Adventure iCNG": { ex:779000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
  },
  "Punch EV": {
    "Smart":       { ex:999000,  rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Smart+":      { ex:1099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Adventure":   { ex:1199000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Adventure S": { ex:1299000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Empowered+":  { ex:1399000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Nexon": {
    "Smart Petrol":     { ex:799000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart+ Petrol":    { ex:899000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Pure Petrol":      { ex:999000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Creative Petrol":  { ex:1149000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless Petrol":  { ex:1299000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless+ Petrol": { ex:1449000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart Diesel":     { ex:1099000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Creative Diesel":  { ex:1299000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless Diesel":  { ex:1449000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Creative iCNG":    { ex:1299000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
  },
  "Nexon EV": {
    "Smart":     { ex:1399000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Smart+":    { ex:1499000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Creative":  { ex:1699000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless":  { ex:1899000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless+": { ex:2099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Harrier": {
    "Smart Petrol":     { ex:1499000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart+ Petrol":    { ex:1649000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Pure Petrol":      { ex:1799000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure Petrol": { ex:1999000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless Petrol":  { ex:2249000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless+ Petrol": { ex:2449000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart Diesel":     { ex:1599000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Adventure Diesel": { ex:2099000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless Diesel":  { ex:2349000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
  },
  "Harrier EV": {
    "Smart":     { ex:2199000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Adventure": { ex:2499000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless":  { ex:2799000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless+": { ex:2999000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Safari": {
    "Smart Petrol":     { ex:1599000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart+ Petrol":    { ex:1749000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Pure Petrol":      { ex:1899000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure Petrol": { ex:2099000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless Petrol":  { ex:2349000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless+ Petrol": { ex:2549000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure Diesel": { ex:2199000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless Diesel":  { ex:2449000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless+ Diesel": { ex:2649000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
  },
  "Curvv": {
    "Smart Petrol":     { ex:999000,  rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart+ Petrol":    { ex:1099000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Creative Petrol":  { ex:1199000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless Petrol":  { ex:1349000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless+ Petrol": { ex:1499000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Smart Diesel":     { ex:1149000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Creative Diesel":  { ex:1349000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless Diesel":  { ex:1499000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
  },
  "Curvv EV": {
    "Creative 45":  { ex:1699000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless 45":  { ex:1899000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless+ 45": { ex:2099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Creative 55":  { ex:1899000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless 55":  { ex:2099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "Fearless+ 55": { ex:2299000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
  "Sierra": {
    "Adventure Petrol": { ex:1799000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Fearless Petrol":  { ex:2099000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "Adventure Diesel": { ex:1999000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
    "Fearless Diesel":  { ex:2299000, rto:0.13, fastag:500, handling:5000, ins:0.032, fuel:"Diesel" },
  },
  "Xpress T": {
    "XE Petrol": { ex:699000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM Petrol": { ex:779000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XT Petrol": { ex:849000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"Petrol" },
    "XM iCNG":   { ex:869000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
    "XT iCNG":   { ex:939000, rto:0.11, fastag:500, handling:5000, ins:0.032, fuel:"iCNG" },
  },
  "Xpress T EV": {
    "XM": { ex:999000,  rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "XT": { ex:1099000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
    "XZ": { ex:1199000, rto:0, fastag:500, handling:5000, ins:0.032, fuel:"Electric" },
  },
};

// ── HELPERS ───────────────────────────────────────────────────
const inr = (n) => "Rs. " + Number(Math.round(n)).toLocaleString("en-IN");
const today = () => new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
const nowTime = () => new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
const qNo = () => "GULOCT-" + (1000 + Math.floor(Math.random()*9000));

const calcAll = (vehicle, variant) => {
  const d = PRICING[vehicle]?.[variant];
  if (!d) return null;
  const ex       = d.ex;
  const rtoAmt   = Math.round(ex * d.rto);
  const insAmt   = Math.max(Math.round(ex * d.ins), 12000);
  const fastag   = d.fastag;
  const handling = d.handling;
  const total    = ex + rtoAmt + insAmt + fastag + handling;
  return { ex, rtoAmt, rtoP: d.rto*100, insAmt, insP: d.ins*100, fastag, handling, total, isEV: d.fuel === "Electric", fuel: d.fuel };
};

// ── SCOPED CSS ────────────────────────────────────────────────
const CSS = `
@keyframes qpIn  { from{opacity:0} to{opacity:1} }
@keyframes qpUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
@keyframes qpSpin{ to{transform:rotate(360deg)} }
.qp-ov{position:fixed;inset:0;background:rgba(5,10,20,.9);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;animation:qpIn .2s ease;backdrop-filter:blur(10px)}
.qp-md{background:#fff;width:100%;max-width:640px;max-height:96vh;overflow-y:auto;border-radius:3px;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(184,150,62,.4);animation:qpUp .3s cubic-bezier(.34,1.2,.64,1)}
.qp-md::-webkit-scrollbar{width:3px}.qp-md::-webkit-scrollbar-thumb{background:#b8963e}
.qp-hdr{background:linear-gradient(135deg,#0a1628,#0c1f3f 60%,#1a3d7c);padding:20px 28px 16px;border-bottom:2px solid #b8963e;position:sticky;top:0;z-index:10}
.qp-x{background:none;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.6);width:32px;height:32px;border-radius:2px;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.qp-x:hover{background:rgba(255,255,255,.12);color:#fff}
.qp-bd{padding:22px 28px 28px}
.qp-lb{display:block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280;margin-bottom:4px;font-weight:600}
.qp-in,.qp-sl{width:100%;padding:9px 12px;border:1px solid rgba(0,0,0,.14);border-radius:2px;font-family:'Jost',sans-serif;font-size:13.5px;background:#f9f7f3;color:#0c1f3f;outline:none;transition:border-color .2s;box-sizing:border-box;-webkit-appearance:none;appearance:none}
.qp-in:focus,.qp-sl:focus{border-color:#b8963e;background:#fff}
.qp-in.err,.qp-sl.err{border-color:#e53935;background:#fff5f5}
.qp-er{color:#e53935;font-size:10.5px;margin-top:2px}
.qp-sl{cursor:pointer}.qp-sl:disabled{opacity:.4;cursor:not-allowed}
.qp-g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.qp-bg{width:100%;padding:13px;background:linear-gradient(135deg,#b8963e,#d4af5a);color:#0a1628;border:none;font-family:'Jost',sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:opacity .2s;margin-top:4px}
.qp-bg:hover{opacity:.88}
.qp-sec{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#b8963e;font-weight:700;padding:10px 0 8px;border-bottom:1px solid rgba(184,150,62,.2);margin-bottom:12px;margin-top:18px}
.qp-hint{font-size:11px;color:#9ca3af;margin-top:3px}
/* Preview */
.qp-prev{background:#0c1f3f;border-radius:2px;padding:14px 18px;margin-top:14px}
.qp-prow{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12.5px}
.qp-ptot{display:flex;justify-content:space-between;align-items:center;padding:10px 0 0;font-size:14px;font-weight:700}
/* Action row */
.qp-ar{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}
.qp-btn-back{flex:1;min-width:90px;padding:12px;background:transparent;border:1px solid #0c1f3f;color:#0c1f3f;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .2s}
.qp-btn-back:hover{background:#0c1f3f;color:#fff}
.qp-btn-pdf{flex:2;min-width:140px;padding:12px;background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;border:none;font-family:'Jost',sans-serif;font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:7px}
.qp-btn-pdf:hover{opacity:.88}.qp-btn-pdf:disabled{opacity:.55;cursor:not-allowed}
.qp-sp{width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:qpSpin .7s linear infinite;flex-shrink:0}
/* Preview modal overlay */
.qp-prev-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:12px;animation:qpIn .2s ease}
.qp-prev-md{background:#fff;width:100%;max-width:860px;max-height:96vh;overflow:auto;border-radius:3px;box-shadow:0 32px 80px rgba(0,0,0,.6)}
@media(max-width:540px){.qp-g2{grid-template-columns:1fr}.qp-ar{flex-direction:column}.qp-hdr{padding:16px 18px 13px}.qp-bd{padding:16px 18px 22px}}
`;

// ── PREVIEW HTML TEMPLATE (renders as printable A4 invoice) ──
const buildInvoiceHTML = (form, pricing, quoteNum) => {
  const p = pricing;
  const dt = today();
  const tm = nowTime();
  const isEV = p.isEV;

  const rows = [
    { label:"Ex-Showroom Price (Incl. GST & Cess)", amount: p.ex },
    { label: isEV ? "Road Tax / RTO (Karnataka EV Exempt — 0%)" : `Road Tax / RTO (Karnataka — ${p.rtoP.toFixed(0)}%)`, amount: p.rtoAmt },
    { label:`Insurance (Comprehensive — ${p.insP.toFixed(1)}%)`, amount: p.insAmt },
    { label:"FASTag (NHAI Mandated)", amount: p.fastag },
    { label:"Handling & Logistics Charges", amount: p.handling },
  ];

  const tnc = [
    "Prices ruling at the time of actual delivery shall only be applicable.",
    "Price inclusive of Taxes. Ex – Kalaburagi R. S. O.",
    "Transportation at other Location will be extra.",
    "Delivery will depend upon availability of stock and Receive Transit with full payment.",
    "On acceptance of order & Availability, Payment should be made by RTGS / Demand Draft drawn in favour of \"MANICKBAG AUTOMOBILES PVT LTD\".",
    "AADHAR and PAN Should be linked as per Govt Norms for Invoicing of Vehicle.",
    "Vehicle Ex-showroom Price 10 lakhs or More will attract with 1% TCS with ITR, & 5% TCS.",
    "The management shall not be liable for any transaction made out side the official company bank account.",
    "All payment must be made exclusively to the authorized company bank account.",
    "Once invoice generated cannot be cancelled for any reason.",
    "Booking cancellation will attract penality of Rs. 2500/- and will take 15 working days.",
    "Delivery will be after Full payment and RTO Permanent Reg effected ex-Kalaburagi.",
    "Kalaburagi Jurisdication in any proceeding relating to his contract.",
  ];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:10px;color:#000;background:#fff;width:297mm;min-height:210mm;padding:6mm 8mm}
  .page{width:100%;min-height:198mm;display:flex;flex-direction:column}
  /* HEADER */
  .hdr{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:6px;border:1.5px solid #000;border-bottom:none}
  .logo-box{padding:4px 8px;border-right:1px solid #000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:90px}
  .logo-txt{font-size:16px;font-weight:900;color:#0a1628;letter-spacing:1px;line-height:1}
  .logo-sub{font-size:6px;letter-spacing:2px;color:#b8963e;margin-top:1px}
  .logo-since{font-size:6px;color:#666;margin-top:2px}
  .hdr-mid{padding:4px 10px;text-align:center;border-right:1px solid #000}
  .hdr-mid h1{font-size:13px;font-weight:900;letter-spacing:1.5px;color:#0a1628;text-transform:uppercase}
  .hdr-mid .addr{font-size:8.5px;color:#333;margin-top:2px}
  .hdr-mid .contact{font-size:8.5px;color:#333;margin-top:1px}
  .tata-box{padding:4px 8px;text-align:center;min-width:90px}
  .tata-logo{font-size:10px;font-weight:900;color:#0066b2;letter-spacing:1px;border:2px solid #0066b2;padding:3px 6px;display:inline-block}
  .tata-sub{font-size:6.5px;color:#0066b2;margin-top:2px;font-style:italic}
  .tata-dealer{font-size:7px;color:#333;margin-top:3px;font-weight:600}
  /* GSTIN row */
  .gstin-row{border:1.5px solid #000;border-top:none;border-bottom:none;display:flex;justify-content:space-between;padding:2px 6px;background:#f0f0f0}
  /* Quote header */
  .qhdr{border:1.5px solid #000;border-top:none;border-bottom:none;display:grid;grid-template-columns:1fr auto;align-items:center;padding:3px 6px}
  .qno{font-size:9px;font-weight:700}
  .qtitle{font-size:10px;font-weight:900;letter-spacing:2px;text-align:center;background:#0a1628;color:#fff;padding:3px 12px}
  /* Customer details */
  .cust-grid{border:1.5px solid #000;border-top:none;border-bottom:none}
  .cust-row{display:grid;padding:0}
  .cust-row-2{grid-template-columns:1fr 1fr}
  .cust-row-3{grid-template-columns:1fr 1fr 1fr}
  .cust-cell{padding:3px 6px;border-right:1px solid #000;border-bottom:1px solid #000}
  .cust-cell:last-child{border-right:none}
  .cust-label{font-size:7.5px;color:#666;font-weight:600}
  .cust-val{font-size:9px;font-weight:700;color:#0a1628;margin-top:1px;min-height:12px}
  /* Vehicle section title */
  .sec-title{border:1.5px solid #000;border-top:none;border-bottom:none;background:#0c1f3f;color:#fff;font-size:9px;font-weight:700;letter-spacing:2px;text-align:center;padding:3px}
  /* Vehicle details */
  .veh-area{border:1.5px solid #000;border-top:none;border-bottom:none;display:grid;grid-template-columns:1fr 1fr}
  .veh-col{padding:4px 6px}
  .veh-col:first-child{border-right:1px solid #000}
  .veh-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px dashed #ddd;font-size:8.5px}
  .veh-row:last-child{border-bottom:none}
  .veh-lbl{color:#555}
  .veh-val{font-weight:700;color:#0a1628;text-align:right;max-width:55%}
  /* Price table */
  .price-area{border:1.5px solid #000;border-top:none;border-bottom:none;display:grid;grid-template-columns:1fr 220px}
  .price-left{border-right:1px solid #000}
  .price-hdr{background:#1a3d7c;color:#fff;font-size:8px;font-weight:700;letter-spacing:1px;padding:3px 6px;display:grid;grid-template-columns:1fr auto;text-transform:uppercase}
  .price-row{display:grid;grid-template-columns:1fr auto;padding:3px 6px;border-bottom:1px solid #eee;font-size:8.5px}
  .price-row:last-child{border-bottom:none}
  .price-row.alt{background:#f8f8f8}
  .price-row .amt{font-weight:700;white-space:nowrap}
  .price-total{background:#0a1628;color:#fff;display:grid;grid-template-columns:1fr auto;padding:5px 6px;font-size:9px;font-weight:900;border-top:1.5px solid #b8963e}
  .price-total .amt{color:#f0c040;font-size:11px}
  /* TnC */
  .tnc-hdr{background:#b8963e;color:#fff;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:3px 6px;text-align:center;text-transform:uppercase}
  .tnc-body{padding:3px 6px;background:#fffef8}
  .tnc-item{font-size:7.5px;color:#333;padding:1px 0;display:flex;gap:4px}
  .tnc-num{font-weight:700;flex-shrink:0;min-width:12px}
  /* Right panel */
  .right-col{display:flex;flex-direction:column}
  .bank-sec{padding:6px;border-bottom:1px solid #ddd;flex-shrink:0}
  .bank-title{font-size:8px;font-weight:900;letter-spacing:1.5px;text-align:center;color:#0a1628;background:#f0e8d0;padding:3px;margin-bottom:4px;text-transform:uppercase}
  .bank-row{display:flex;justify-content:space-between;font-size:8px;padding:1.5px 0;border-bottom:1px dashed #eee}
  .bank-row:last-child{border:none}
  .bank-lbl{color:#666}
  .bank-val{font-weight:700;color:#0a1628}
  .qr-box{padding:6px;border-bottom:1px solid #ddd;text-align:center;flex-shrink:0}
  .qr-title{font-size:7.5px;font-weight:700;color:#0a1628;background:#f0e8d0;padding:2px;letter-spacing:1px;margin-bottom:4px;text-transform:uppercase}
  .qr-img{width:70px;height:70px;background:#eee;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:7px;color:#666;border:1px solid #ccc}
  .team-box{padding:6px;flex:1}
  .team-title{font-size:7.5px;font-weight:700;letter-spacing:1px;color:#0a1628;text-transform:uppercase;margin-bottom:5px;text-align:center;border-bottom:1px solid #ddd;padding-bottom:3px}
  .team-row{display:grid;grid-template-columns:auto 1fr;gap:4px;align-items:center;padding:3px 0;border-bottom:1px dashed #eee;font-size:8px}
  .team-row:last-child{border:none}
  .team-role{color:#666;font-size:7.5px}
  .team-num{font-weight:700;color:#0a1628}
  /* Signature row */
  .sig-row{border:1.5px solid #000;border-top:1.5px solid #b8963e;display:grid;grid-template-columns:1fr 1fr 1fr;min-height:30px}
  .sig-cell{padding:4px 8px;border-right:1px solid #000;font-size:7.5px;color:#555}
  .sig-cell:last-child{border-right:none}
  .sig-cell strong{font-size:8.5px;color:#0a1628;display:block;margin-bottom:2px}
  /* Footer */
  .foot{border:1.5px solid #000;border-top:none;background:#0a1628;color:rgba(255,255,255,.7);text-align:center;padding:3px;font-size:7px;display:flex;justify-content:space-between;padding:3px 8px}
  .foot span{color:#b8963e}
</style>
</head><body>
<div class="page">
  <!-- HEADER -->
  <div class="hdr">
    <div class="logo-box">
      <div class="logo-txt">MANICKBAG</div>
      <div class="logo-sub">AUTOMOBILES PVT LTD</div>
      <div class="logo-since">Est. Since 1962 · Kalaburagi</div>
    </div>
    <div class="hdr-mid">
      <h1>MANICKBAG AUTOMOBILES Pvt Ltd</h1>
      <div class="addr">1st Phase, Kapnoor Industrial Area, Kalaburagi - 585 104</div>
      <div class="contact">Contact No: +91 90193 24365 &nbsp;|&nbsp; E-Mail: manickbagsaleshead@gmail.com</div>
    </div>
    <div class="tata-box">
      <div class="tata-logo">TATA<br/>MOTORS</div>
      <div class="tata-sub">Connecting Aspirations</div>
      <div class="tata-dealer">Passenger Car Dealer</div>
    </div>
  </div>

  <!-- GSTIN -->
  <div class="gstin-row">
    <span style="font-weight:700;font-size:8px">GSTIN: ${BANK.gstin}</span>
    <span style="font-size:8px">Quotation No: <strong>${quoteNum}</strong></span>
    <span style="font-size:8px">Date: <strong>${dt}</strong></span>
  </div>

  <!-- QUOTE TITLE -->
  <div class="qhdr">
    <div class="qno">Valid for 15 Days &nbsp;|&nbsp; Generated: ${dt} ${tm}</div>
    <div class="qtitle">⬛ &nbsp;Proforma Invoice&nbsp; ⬛</div>
  </div>

  <!-- CUSTOMER DETAILS -->
  <div class="cust-grid">
    <div class="cust-row cust-row-2">
      <div class="cust-cell">
        <div class="cust-label">Customer Name</div>
        <div class="cust-val">${form.name}</div>
      </div>
      <div class="cust-cell">
        <div class="cust-label">Address</div>
        <div class="cust-val">${form.address || "—"}</div>
      </div>
    </div>
    <div class="cust-row cust-row-3">
      <div class="cust-cell">
        <div class="cust-label">Pan Card No.</div>
        <div class="cust-val">${form.pan || "—"}</div>
      </div>
      <div class="cust-cell">
        <div class="cust-label">Aadhar Card No.</div>
        <div class="cust-val">${form.aadhar || "—"}</div>
      </div>
      <div class="cust-cell" style="border-right:none">
        <div class="cust-label">E-Mail ID</div>
        <div class="cust-val">${form.email || "—"}</div>
      </div>
    </div>
    <div class="cust-row cust-row-2">
      <div class="cust-cell">
        <div class="cust-label">Mobile Number *</div>
        <div class="cust-val">${form.phone}</div>
      </div>
      <div class="cust-cell">
        <div class="cust-label">City</div>
        <div class="cust-val">${form.city || "—"}</div>
      </div>
    </div>
  </div>

  <!-- VEHICLE DETAILS TITLE -->
  <div class="sec-title">Vehicle Details</div>

  <!-- VEHICLE DETAILS -->
  <div class="veh-area">
    <div class="veh-col">
      <div class="veh-row"><span class="veh-lbl">Model</span><span class="veh-val">${form.vehicle}</span></div>
      <div class="veh-row"><span class="veh-lbl">Colour</span><span class="veh-val">${form.colour || "—"}</span></div>
      <div class="veh-row"><span class="veh-lbl">Ex-Showroom Price</span><span class="veh-val">${inr(p.ex)}</span></div>
    </div>
    <div class="veh-col">
      <div class="veh-row"><span class="veh-lbl">Variant</span><span class="veh-val">${form.variant}</span></div>
      <div class="veh-row"><span class="veh-lbl">Fuel Type</span><span class="veh-val">${p.fuel}</span></div>
      <div class="veh-row"><span class="veh-lbl">Transmission</span><span class="veh-val">—</span></div>
    </div>
  </div>

  <!-- PRICE TABLE + RIGHT PANEL -->
  <div class="price-area">
    <!-- LEFT: Price breakdown + TnC -->
    <div class="price-left">
      <div class="price-hdr">
        <span>Price Breakdown — Karnataka 2025-26</span>
        <span>Amount</span>
      </div>
      ${rows.map((r,i)=>`
      <div class="price-row${i%2?" alt":""}">
        <span>${r.label}</span>
        <span class="amt">${r.amount===0?'NIL':inr(r.amount)}</span>
      </div>`).join("")}
      <div class="price-total">
        <span>GRAND TOTAL (On-Road Price)</span>
        <span class="amt">${inr(p.total)}</span>
      </div>

      <!-- Terms & Conditions -->
      <div class="tnc-hdr">Terms &amp; Conditions Apply</div>
      <div class="tnc-body">
        ${tnc.map((t,i)=>`<div class="tnc-item"><span class="tnc-num">${i+1}.</span><span>${t}</span></div>`).join("")}
      </div>
    </div>

    <!-- RIGHT: Bank + QR + Team -->
    <div class="right-col">
      <div class="bank-sec">
        <div class="bank-title">Bank Details</div>
        <div class="bank-row"><span class="bank-lbl">Account Holder</span><span class="bank-val">${BANK.holder}</span></div>
        <div class="bank-row"><span class="bank-lbl">Bank Name</span><span class="bank-val">${BANK.bank}</span></div>
        <div class="bank-row"><span class="bank-lbl">Account No.</span><span class="bank-val">${BANK.account}</span></div>
        <div class="bank-row"><span class="bank-lbl">IFSC Code</span><span class="bank-val">${BANK.ifsc}</span></div>
      </div>

      <div class="qr-box">
        <div class="qr-title">QR Code Scan</div>
        <div class="qr-img">
          <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="70" fill="#fff"/>
            <!-- Simple QR pattern placeholder -->
            <rect x="5" y="5" width="22" height="22" fill="none" stroke="#000" stroke-width="2"/>
            <rect x="8" y="8" width="16" height="16" fill="#000"/>
            <rect x="43" y="5" width="22" height="22" fill="none" stroke="#000" stroke-width="2"/>
            <rect x="46" y="8" width="16" height="16" fill="#000"/>
            <rect x="5" y="43" width="22" height="22" fill="none" stroke="#000" stroke-width="2"/>
            <rect x="8" y="46" width="16" height="16" fill="#000"/>
            <rect x="32" y="32" width="6" height="6" fill="#000"/>
            <rect x="42" y="32" width="4" height="4" fill="#000"/>
            <rect x="50" y="32" width="4" height="4" fill="#000"/>
            <rect x="58" y="32" width="4" height="4" fill="#000"/>
            <rect x="32" y="42" width="4" height="4" fill="#000"/>
            <rect x="40" y="50" width="4" height="4" fill="#000"/>
            <rect x="50" y="42" width="8" height="4" fill="#000"/>
            <rect x="58" y="50" width="4" height="12" fill="#000"/>
            <text x="35" y="67" text-anchor="middle" font-size="5" fill="#666">Scan to Pay</text>
          </svg>
        </div>
        <div style="font-size:7px;color:#666;margin-top:2px">Manickbag Automobiles</div>
      </div>

      <div class="team-box">
        <div class="team-title">Our Team Contact</div>
        <div class="team-row">
          <div><div class="team-role">Customer Advisor</div><div class="team-num">—</div></div>
        </div>
        <div class="team-row">
          <div><div class="team-role">Finance Officer</div><div class="team-num">${CONTACTS.finance.mobile}</div></div>
        </div>
        <div class="team-row">
          <div><div class="team-role">Sales AGM</div><div class="team-num">${CONTACTS.sales.mobile}</div></div>
        </div>
        <div class="team-row">
          <div><div class="team-role">Sales GM</div><div class="team-num">${CONTACTS.salesGM.mobile}</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- SIGNATURES -->
  <div class="sig-row">
    <div class="sig-cell"><strong>US Manickbag Autobolies Pvt Ltd</strong>Authorised Signatory</div>
    <div class="sig-cell"><strong>Customer Advisor Name</strong>&nbsp;</div>
    <div class="sig-cell"><strong>Customer Signature</strong>&nbsp;</div>
  </div>

  <!-- FOOTER -->
  <div class="foot">
    <span>www.manickbag.in</span>
    <span>+91 96860 24365 &nbsp;|&nbsp; info@manickbag.in</span>
    <span>Quote: ${quoteNum} &nbsp;|&nbsp; ${dt}</span>
  </div>
</div>
</body></html>`;
};

// ══════════════════════════════════════════════════════════════
//  PREVIEW MODAL
// ══════════════════════════════════════════════════════════════
function PreviewModal({ html, onClose, onDownload, busy }) {
  return (
    <div className="qp-prev-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="qp-prev-md">
        <div style={{ background: B.navyMid, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${B.gold}` }}>
          <div style={{ color: B.white, fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600 }}>Invoice Preview</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onDownload}
              disabled={busy}
              style={{ padding: "8px 22px", background: `linear-gradient(135deg,${B.gold},${B.goldLight})`, color: B.navy, border: "none", fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", cursor: busy ? "not-allowed" : "pointer", borderRadius: 2, display: "flex", alignItems: "center", gap: 6, opacity: busy ? 0.6 : 1 }}
            >
              {busy ? <><div className="qp-sp" style={{ borderTopColor: B.navy, borderColor: "rgba(0,0,0,.2)" }} /><span>Generating...</span></> : "⬇ Download PDF"}
            </button>
            <button className="qp-x" onClick={onClose} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 16, background: "#e5e5e5", minHeight: 400 }}>
          <iframe
            srcDoc={html}
            style={{ width: "100%", minHeight: "560px", border: "none", background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,.25)" }}
            title="Invoice Preview"
          />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function QuotePopup({ vehicleName, onClose }) {
  const [step, setStep]         = useState(1);
  const [quoteNum]              = useState(() => qNo());
  const [errors, setErrors]     = useState({});
  const [pdfBusy, setPdfBusy]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [pricing, setPricing]   = useState(null);

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    vehicle: vehicleName || "", variant: "", colour: "",
    pan: "", aadhar: "", city: "", address: "",
  });

  const variants = form.vehicle ? Object.keys(PRICING[form.vehicle] || {}) : [];
  const preview  = form.vehicle && form.variant ? calcAll(form.vehicle, form.variant) : null;

  // Inject CSS + lock scroll
  useEffect(() => {
    if (!document.getElementById("qp2-css")) {
      const el = document.createElement("style");
      el.id = "qp2-css"; el.textContent = CSS;
      document.head.appendChild(el);
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") showPreview ? setShowPreview(false) : onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, showPreview]);

  const set = useCallback((field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === "vehicle") { next.variant = ""; next.colour = ""; }
      return next;
    });
    setErrors(prev => ({ ...prev, [field]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name    = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid 10-digit mobile required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.variant)             e.variant = "Please select a variant";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePreview = () => {
    if (!validate()) return;
    const p = calcAll(form.vehicle, form.variant);
    setPricing(p);
    const html = buildInvoiceHTML(form, p, quoteNum);
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const downloadPDF = async () => {
    if (!window.jspdf) {
      // Fallback: open print dialog for the preview iframe
      const printWin = window.open("", "_blank");
      printWin.document.write(previewHtml);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => printWin.print(), 600);
      return;
    }
    setPdfBusy(true);
    await new Promise(r => setTimeout(r, 40));
    try {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:297mm;height:210mm;border:none";
      iframe.srcdoc = previewHtml;
      document.body.appendChild(iframe);
      await new Promise(r => setTimeout(r, 800));
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    } catch(err) {
      console.error(err);
    }
    setPdfBusy(false);
  };

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <>
      <div className="qp-ov" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="qp-md" role="dialog" aria-modal="true" aria-label="Vehicle Quotation" onClick={e => e.stopPropagation()}>

          {/* HEADER */}
          <div className="qp-hdr">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 22, height: 1, background: B.gold }} />
                  <span style={{ fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: B.gold }}>Proforma Invoice</span>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: "#fff", lineHeight: 1.15 }}>
                  {step === 1 ? `Quote — ${form.vehicle || vehicleName}` : "Price Summary"}
                </div>
                {step === 2 && form.name && (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 3 }}>
                    {form.variant} · Prepared for {form.name}
                  </div>
                )}
              </div>
              <button className="qp-x" onClick={onClose}>✕</button>
            </div>
            {/* Steps */}
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {["Customer & Vehicle", "Preview & Download"].map((lbl, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ height: 2.5, borderRadius: 2, marginBottom: 3, background: step > i ? B.gold : "rgba(255,255,255,.12)", transition: "background .4s" }} />
                  <div style={{ fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", color: step > i ? B.gold : "rgba(255,255,255,.3)" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="qp-bd">
              <div className="qp-sec" style={{ marginTop: 0 }}>Customer Information</div>

              <div className="qp-g2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="qp-lb">Full Name *</label>
                  <input className={`qp-in${errors.name ? " err" : ""}`} type="text" placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} autoComplete="name" />
                  {errors.name && <div className="qp-er">{errors.name}</div>}
                </div>
                <div>
                  <label className="qp-lb">Mobile Number *</label>
                  <input className={`qp-in${errors.phone ? " err" : ""}`} type="tel" placeholder="10-digit mobile" maxLength={10} inputMode="numeric" value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} />
                  {errors.phone && <div className="qp-er">{errors.phone}</div>}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="qp-lb">Email Address *</label>
                <input className={`qp-in${errors.email ? " err" : ""}`} type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
                {errors.email && <div className="qp-er">{errors.email}</div>}
              </div>

              <div className="qp-g2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="qp-lb">City <span style={{ color: "#9ca3af", fontSize: 9, textTransform: "none" }}>(optional)</span></label>
                  <input className="qp-in" type="text" placeholder="e.g. Kalaburagi" value={form.city} onChange={e => set("city", e.target.value)} />
                </div>
                <div>
                  <label className="qp-lb">Address <span style={{ color: "#9ca3af", fontSize: 9, textTransform: "none" }}>(optional)</span></label>
                  <input className="qp-in" type="text" placeholder="Your address" value={form.address} onChange={e => set("address", e.target.value)} />
                </div>
              </div>

              <div className="qp-g2" style={{ marginBottom: 18 }}>
                <div>
                  <label className="qp-lb">Aadhar No. <span style={{ color: "#9ca3af", fontSize: 9, textTransform: "none" }}>(optional)</span></label>
                  <input className="qp-in" type="text" placeholder="12 digits" maxLength={12} inputMode="numeric" value={form.aadhar} onChange={e => set("aadhar", e.target.value.replace(/\D/g, ""))} />
                </div>
                <div>
                  <label className="qp-lb">PAN No. <span style={{ color: "#9ca3af", fontSize: 9, textTransform: "none" }}>(optional)</span></label>
                  <input className="qp-in" type="text" placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: "uppercase" }} value={form.pan} onChange={e => set("pan", e.target.value.toUpperCase())} />
                </div>
              </div>

              <div className="qp-sec" style={{ marginTop: 0 }}>Vehicle Selection</div>

              <div style={{ marginBottom: 12 }}>
                <label className="qp-lb">Variant *</label>
                <select className={`qp-sl${errors.variant ? " err" : ""}`} value={form.variant} onChange={e => set("variant", e.target.value)}>
                  <option value="">— Select Variant —</option>
                  {variants.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                {errors.variant && <div className="qp-er">{errors.variant}</div>}
                {preview && !errors.variant && (
                  <div className="qp-hint">Ex-Showroom: {inr(preview.ex)} &nbsp;|&nbsp; Fuel: {preview.fuel}</div>
                )}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="qp-lb">Colour <span style={{ color: "#9ca3af", fontSize: 9, textTransform: "none" }}>(optional)</span></label>
                <input className="qp-in" type="text" placeholder="e.g. Pristine White" value={form.colour} onChange={e => set("colour", e.target.value)} />
              </div>

              {/* Mini price preview */}
              {preview && (
                <div className="qp-prev">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>Quick Estimate</span>
                    {preview.isEV && <span style={{ fontSize: 9, background: "rgba(79,195,247,.2)", color: "#4fc3f7", padding: "1px 7px", borderRadius: 1 }}>EV — 0% RTO</span>}
                  </div>
                  {[
                    { l: "Ex-Showroom", v: inr(preview.ex) },
                    { l: `RTO (${preview.isEV ? "Exempt" : preview.rtoP + "%"})`, v: preview.isEV ? "NIL" : inr(preview.rtoAmt) },
                    { l: "Insurance", v: inr(preview.insAmt) },
                    { l: "FASTag + Handling", v: inr(preview.fastag + preview.handling) },
                  ].map(r => (
                    <div className="qp-prow" key={r.l}>
                      <span style={{ color: "rgba(255,255,255,.5)" }}>{r.l}</span>
                      <span style={{ color: "#fff", fontWeight: 500 }}>{r.v}</span>
                    </div>
                  ))}
                  <div className="qp-ptot">
                    <span style={{ color: B.gold }}>Est. On-Road Price</span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: B.gold }}>{inr(preview.total)}</span>
                  </div>
                </div>
              )}

              <button className="qp-bg" onClick={handlePreview} style={{ marginTop: 18 }}>
                Preview &amp; Download Invoice →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && pricing && (
        <PreviewModal
          html={previewHtml}
          onClose={() => setShowPreview(false)}
          onDownload={downloadPDF}
          busy={pdfBusy}
        />
      )}
    </>
  );
}