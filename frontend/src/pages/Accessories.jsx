import { useState, useEffect } from "react";
import Layout from "./Layout";

// ─── BRAND TOKENS ─────────────────────────────────────────────────
const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.25)",
  successGreen: "#16a34a",
  evGreen: "#16a34a", evTeal: "#0d9488",
};

// ─── API URL ───────────────────────────────────────────────────────
const API_URL = "https://yourdomain.com/backend/api/accessories_enquiry.php";

// ─── PAGE STYLES ─────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .cormorant { font-family: 'Cormorant Garamond', serif; }
    .jost { font-family: 'Jost', sans-serif; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    @keyframes evPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(13,148,136,0.3); } 50% { box-shadow: 0 0 0 6px rgba(13,148,136,0); } }
    @keyframes modalIn { from { opacity:0; transform: translateY(30px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
    @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }

    .acc-shimmer {
      background: linear-gradient(90deg,#b8963e 0%,#f0e4c2 40%,#b8963e 60%,#d4af5a 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }
    .acc-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: default;
    }
    .acc-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    }
    .model-pill {
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      outline: none;
    }
    .model-pill:hover { opacity: 0.85; }
    .cat-btn { transition: all 0.2s; cursor: pointer; outline: none; border: none; }
    .cat-btn:hover { opacity: 0.85; }
    .enquire-btn {
      transition: all 0.2s; cursor: pointer; outline: none;
      border: none; font-family: 'Jost', sans-serif;
    }
    .enquire-btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .clear-btn { cursor: pointer; background: none; border: none; transition: opacity 0.2s; }
    .clear-btn:hover { opacity: 0.7; }
    .cta-gold {
      background: linear-gradient(135deg,#b8963e,#d4af5a);
      color: #0a1628; border: none; cursor: pointer;
      font-family: 'Jost', sans-serif; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      transition: all 0.3s; outline: none;
    }
    .cta-gold:hover { opacity: 0.9; transform: translateY(-1px); }
    .cta-outline {
      background: transparent; border: 1px solid #b8963e; color: #b8963e;
      cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s; outline: none;
    }
    .cta-outline:hover { background: #b8963e; color: #0a1628; }

    .model-scroll::-webkit-scrollbar { height: 4px; }
    .model-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
    .model-scroll::-webkit-scrollbar-thumb { background: #b8963e55; border-radius: 2px; }

    .acc-fade { animation: fadeUp 0.45s ease both; }
    .ev-badge { animation: evPulse 2s infinite; }

    .segment-toggle { display: inline-flex; background: rgba(255,255,255,0.08); border-radius: 4px; padding: 4px; gap: 4px; }
    .segment-btn { padding: 10px 28px; font-size: 12px; cursor: pointer; border-radius: 2px; border: none; font-family: 'Jost', sans-serif; font-weight: 600; letter-spacing: 0.08em; transition: all 0.2s; }

    .acc-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform 0.35s ease; }
    .acc-card:hover .acc-img { transform: scale(1.07); }

    /* ── Quote Modal ── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(10,22,40,0.82); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: overlayIn 0.25s ease;
    }
    .modal-box {
      background: #fff; width: 100%; max-width: 580px;
      max-height: 90vh; overflow-y: auto;
      border-radius: 4px;
      animation: modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
      position: relative;
    }
    .modal-box::-webkit-scrollbar { width: 4px; }
    .modal-box::-webkit-scrollbar-thumb { background: #b8963e55; border-radius: 2px; }

    .form-input {
      width: 100%; height: 44px;
      border: 1.5px solid rgba(10,31,63,0.18);
      border-radius: 3px; padding: 0 14px;
      font-family: 'Jost', sans-serif; font-size: 13px;
      color: #0c1f3f; outline: none; transition: border-color 0.2s;
      background: #fafaf9;
    }
    .form-input:focus { border-color: #b8963e; background: #fff; }
    .form-input.error { border-color: #dc2626; }
    .form-label {
      display: block; font-family: 'Jost', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; color: #6b7280; margin-bottom: 6px;
    }
    .form-error {
      font-family: 'Jost', sans-serif; font-size: 11px;
      color: #dc2626; margin-top: 4px;
    }
    .item-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: #f7f5f0; border: 1px solid rgba(10,31,63,0.1);
      border-radius: 2px; padding: 5px 10px;
      font-family: 'Jost', sans-serif; font-size: 11px;
      color: #0c1f3f; font-weight: 500;
    }
    .item-chip.ev { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .submit-btn {
      width: 100%; height: 48px; border: none; border-radius: 3px;
      background: linear-gradient(135deg,#b8963e,#d4af5a);
      color: #0a1628; font-family: 'Jost', sans-serif;
      font-size: 12px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; cursor: pointer;
      transition: all 0.3s; outline: none;
    }
    .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
    .submit-btn.loading { position: relative; color: transparent; }
    .submit-btn.loading::after {
      content: ''; position: absolute; top: 50%; left: 50%;
      width: 20px; height: 20px; margin: -10px 0 0 -10px;
      border: 2px solid rgba(10,22,40,0.3); border-top-color: #0a1628;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    .success-box {
      text-align: center; padding: 48px 32px;
      animation: fadeUp 0.4s ease;
    }
    .close-btn {
      position: absolute; top: 16px; right: 16px;
      width: 32px; height: 32px; border: none; background: rgba(0,0,0,0.06);
      border-radius: 50%; cursor: pointer; font-size: 14px; color: #6b7280;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; outline: none;
    }
    .close-btn:hover { background: rgba(0,0,0,0.12); color: #0c1f3f; }
  `}</style>
);

// ─── MODEL DATA ─── ICE ────────────────────────────────────────────
const ICE_MODELS = [
  { id: "nexon",   name: "Nexon",   type: "Compact SUV",       icon: "🚙", tagline: "India's favourite compact SUV",   priceRange: "₹7.37L – ₹14.15L", accent: "#2563eb" },
  { id: "harrier", name: "Harrier", type: "Mid-Size SUV",       icon: "🦅", tagline: "Command every road",               priceRange: "₹12.89L – ₹25.96L", accent: "#dc2626" },
  { id: "safari",  name: "Safari",  type: "Flagship SUV",       icon: "🏔️", tagline: "Tata's flagship 7-seater",         priceRange: "₹13.29L – ₹25.02L", accent: "#7c3aed" },
  { id: "punch",   name: "Punch",   type: "Micro SUV",          icon: "👊", tagline: "India's #1 selling micro SUV",    priceRange: "₹5.65L – ₹10.55L",  accent: "#ea580c" },
  { id: "altroz",  name: "Altroz",  type: "Premium Hatchback",  icon: "🎯", tagline: "5-star safety premium hatch",     priceRange: "₹6.65L – ₹10.55L",  accent: "#0891b2" },
  { id: "tiago",   name: "Tiago",   type: "Compact Hatchback",  icon: "🌟", tagline: "Smart city companion",             priceRange: "₹4.57L – ₹7.82L",   accent: "#16a34a" },
  { id: "curvv",   name: "Curvv",   type: "Coupe SUV",          icon: "⚡", tagline: "Bold coupe SUV crossover",         priceRange: "₹9.99L – ₹19.19L",  accent: "#9333ea" },
  { id: "tigor",   name: "Tigor",   type: "Compact Sedan",      icon: "🏎️", tagline: "Stylish subcompact sedan",         priceRange: "₹6.20L – ₹8.90L",   accent: "#0d9488" },
  { id: "sierra",  name: "Sierra",  type: "Lifestyle SUV",      icon: "🏕️", tagline: "Revived icon, adventure-ready",   priceRange: "₹11.49L – ₹21.29L", accent: "#b45309" },
];

// ─── MODEL DATA ─── EV ────────────────────────────────────────────
const EV_MODELS = [
  { id: "nexon_ev",    name: "Nexon EV",    type: "Electric SUV",        icon: "⚡", tagline: "India's best-selling electric SUV",  priceRange: "₹14.49L – ₹19.99L", accent: "#0d9488", ev: true },
  { id: "punch_ev",    name: "Punch EV",    type: "Electric Micro SUV",  icon: "🔋", tagline: "India's most affordable electric SUV", priceRange: "₹10.99L – ₹15.49L", accent: "#16a34a", ev: true },
  { id: "tiago_ev",    name: "Tiago EV",    type: "Electric Hatchback",  icon: "🌿", tagline: "Most affordable EV for India",          priceRange: "₹8.69L – ₹11.99L",  accent: "#0891b2", ev: true },
  { id: "tigor_ev",    name: "Tigor EV",    type: "Electric Sedan",      icon: "🚗", tagline: "First electric sedan by Tata",          priceRange: "₹11.99L – ₹13.14L", accent: "#6366f1", ev: true },
  { id: "curvv_ev",    name: "Curvv EV",    type: "Electric Coupe SUV",  icon: "💡", tagline: "Style meets zero emissions",            priceRange: "₹17.49L – ₹21.99L", accent: "#7c3aed", ev: true },
  { id: "harrier_ev",  name: "Harrier EV",  type: "Electric Mid-SUV",    icon: "🦾", tagline: "Electrified commanding SUV",            priceRange: "₹21.49L – ₹27.99L", accent: "#dc2626", ev: true },
];

// ─── CATEGORIES ───────────────────────────────────────────────────
const CATS = [
  { id: "all",      label: "All"              },
  { id: "exterior", label: "Exterior"         },
  { id: "interior", label: "Interior"         },
  { id: "safety",   label: "Safety & Security"},
  { id: "comfort",  label: "Comfort"          },
  { id: "lifestyle",label: "Lifestyle"        },
  { id: "care",     label: "Car Care"         },
  { id: "ev",       label: "EV Specific"      },
];

// ─── IMAGE MAP ────────────────────────────────────────────────────
const ACC_IMAGES = {
  "3d_floor_mats":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "mud_flaps":           "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
  "body_cover":          "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
  "led_fog_lamps":       "https://images.unsplash.com/photo-1566033976576-4c5a5b1e2e8d?w=400&q=80",
  "alloy_wheels":        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  "seat_covers":         "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
  "door_visor":          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
  "sunroof":             "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
  "tpms":                "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80",
  "reverse_camera":      "https://images.unsplash.com/photo-1615869442320-fd02a129c77c?w=400&q=80",
  "dvr":                 "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&q=80",
  "mood_lighting":       "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  "sunshades":           "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
  "trunk_mat":           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "gps_tracker":         "https://images.unsplash.com/photo-1546984575-757f4f7c13cf?w=400&q=80",
  "neck_rest":           "https://images.unsplash.com/photo-1555652736-e92021d28a10?w=400&q=80",
  "parking_sensors":     "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
  "roof_rails":          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  "air_purifier":        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
  "bumper_guard":        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80",
  "wireless_charger":    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
  "scuff_plates":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "skid_plate":          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
  "spoiler":             "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80",
  "cycle_carrier":       "https://images.unsplash.com/photo-1501147830916-ce44a6359892?w=400&q=80",
  "ceramic_coating":     "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&q=80",
  "sidestep":            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  "puddle_lamps":        "https://images.unsplash.com/photo-1484565072684-13e8c8c8c8b1?w=400&q=80",
  "auto_dimming_irvm":   "https://images.unsplash.com/photo-1555652736-e92021d28a10?w=400&q=80",
  "chrome_garnish":      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80",
  "roof_rack":           "https://images.unsplash.com/photo-1501147830916-ce44a6359892?w=400&q=80",
  "ladder":              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  "tyre_inflator":       "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80",
  "puncture_kit":        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80",
  "music_system":        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80",
  "steering_cover":      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
  "armrest":             "https://images.unsplash.com/photo-1555652736-e92021d28a10?w=400&q=80",
  "portable_charger_ev": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
  "charging_cable_ev":   "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
  "home_charger_ev":     "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
  "battery_guard_ev":    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
  "ev_floor_mats":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "ev_body_cover":       "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
  "ev_alloy_wheels":     "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  "ev_tpms":             "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80",
  "default":             "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
};

const getImg = (imgKey) => ACC_IMAGES[imgKey] || ACC_IMAGES["default"];

// ─── ACCESSORIES DATABASE (same as before, truncated for brevity — keep your full ACC_DB) ──
const ACC_DB = {
  nexon: [
    { id: 1,  name: "3D Floor Mats",        cat: "interior",  tag: "Essential",   imgKey: "3d_floor_mats",     desc: "Custom-fit 3D moulded floor mats for complete cabin protection from dust and spills." },
    { id: 2,  name: "Mud Flaps",             cat: "exterior",  tag: "Must Have",   imgKey: "mud_flaps",          desc: "Heavy-duty mud flaps protecting underbody and bodywork from road debris and splashes." },
    { id: 3,  name: "Body Cover",            cat: "care",      tag: "Essential",   imgKey: "body_cover",         desc: "All-weather body cover with UV protection, dust resistance and soft inner lining." },
    { id: 4,  name: "LED Fog Lamps",         cat: "exterior",  tag: "Recommended", imgKey: "led_fog_lamps",      desc: "Bright LED fog lamps for improved visibility in rain, fog and low-light conditions." },
    { id: 5,  name: "Alloy Wheels (16\")",   cat: "exterior",  tag: "Upgrade",     imgKey: "alloy_wheels",       desc: "16-inch premium alloy wheels with diamond-cut finish for an enhanced sporty look." },
    { id: 6,  name: "Seat Covers",           cat: "interior",  tag: "Comfort",     imgKey: "seat_covers",        desc: "Premium leatherette seat covers with custom fit and reinforced airbag-compatible stitching." },
    { id: 7,  name: "Door Visor (Chrome)",   cat: "exterior",  tag: "Popular",     imgKey: "door_visor",         desc: "Chrome-inset door visors allowing ventilation while blocking rain and dust entry." },
    { id: 8,  name: "Pop-Up Sunroof",        cat: "interior",  tag: "Premium",     imgKey: "sunroof",            desc: "Tiltable pop-up sunroof adding openness to the cabin — ideal for lower variants." },
    { id: 9,  name: "App-Based TPMS",        cat: "safety",    tag: "Safety",      imgKey: "tpms",               desc: "Tyre pressure monitoring system with real-time alerts via a dedicated smartphone app." },
    { id: 10, name: "Reverse Camera",        cat: "safety",    tag: "Safety",      imgKey: "reverse_camera",     desc: "HD reverse camera with TFT display for confident and safe reversing manoeuvres." },
    { id: 11, name: "Digital Video Recorder",cat: "safety",    tag: "Security",    imgKey: "dvr",                desc: "Loop-recording dash cam with G-sensor incident detection and night vision capability." },
    { id: 12, name: "Mood Lighting",         cat: "comfort",   tag: "Ambience",    imgKey: "mood_lighting",      desc: "Multicolour LED ambient mood lighting for a premium cabin feel at night." },
    { id: 13, name: "Window Sunshades",      cat: "comfort",   tag: "Cool Cabin",  imgKey: "sunshades",          desc: "Magnetic sunshades for rear windows, blocking UV rays and keeping the cabin cool." },
    { id: 14, name: "Trunk Mat (3D)",        cat: "interior",  tag: "Useful",      imgKey: "trunk_mat",          desc: "Precisely moulded 3D boot mat protecting the luggage area from scratches and spills." },
    { id: 15, name: "Vehicle Tracker",       cat: "safety",    tag: "Security",    imgKey: "gps_tracker",        desc: "GPS-based vehicle tracking device for real-time location monitoring and security." },
    { id: 16, name: "Neck Rest Cushions",    cat: "comfort",   tag: "Comfort",     imgKey: "neck_rest",          desc: "Ergonomic neck rest pillows for long drives, reducing fatigue and neck strain." },
    { id: 17, name: "Front Parking Sensors", cat: "safety",    tag: "Safety",      imgKey: "parking_sensors",    desc: "Ultrasonic front parking sensors with audio-visual alerts for tight parking spots." },
    { id: 18, name: "Roof Rail",             cat: "lifestyle", tag: "Adventure",   imgKey: "roof_rails",         desc: "Sturdy roof rails for mounting a carrier or cycle rack for outdoor adventures." },
    { id: 19, name: "Air Purifier",          cat: "comfort",   tag: "Health",      imgKey: "air_purifier",       desc: "In-cabin HEPA air purifier eliminating pollutants, allergens and bad odour." },
    { id: 20, name: "Bumper Corner Guards",  cat: "exterior",  tag: "Protection",  imgKey: "bumper_guard",       desc: "Flexible corner protectors absorbing minor bumps and preventing paint chips." },
  ],
  harrier: [
    { id: 1,  name: "3D Floor Mats",          cat: "interior",  tag: "Essential",  imgKey: "3d_floor_mats"     },
    { id: 2,  name: "Body Cover",             cat: "care",      tag: "Essential",  imgKey: "body_cover"        },
    { id: 3,  name: "Mud Flaps",              cat: "exterior",  tag: "Must Have",  imgKey: "mud_flaps"         },
    { id: 4,  name: "Seat Covers",            cat: "interior",  tag: "Premium",    imgKey: "seat_covers"       },
    { id: 5,  name: "17\" Alloy Wheel",       cat: "exterior",  tag: "Upgrade",    imgKey: "alloy_wheels"      },
    { id: 6,  name: "Auto-Dimming IRVM",      cat: "interior",  tag: "Smart",      imgKey: "auto_dimming_irvm" },
    { id: 7,  name: "App-Based TPMS",         cat: "safety",    tag: "Safety",     imgKey: "tpms"              },
    { id: 8,  name: "Front Parking Sensors",  cat: "safety",    tag: "Safety",     imgKey: "parking_sensors"   },
    { id: 9,  name: "Sidestep",               cat: "exterior",  tag: "Utility",    imgKey: "sidestep"          },
    { id: 10, name: "7D Floor Mats",          cat: "interior",  tag: "Premium",    imgKey: "3d_floor_mats"     },
    { id: 11, name: "3D Trunk Mat",           cat: "interior",  tag: "Useful",     imgKey: "trunk_mat"         },
    { id: 12, name: "Puddle Lamps",           cat: "exterior",  tag: "Style",      imgKey: "puddle_lamps"      },
    { id: 13, name: "Roof Rail",              cat: "lifestyle", tag: "Adventure",  imgKey: "roof_rails"        },
    { id: 14, name: "Chrome Door Handle",     cat: "exterior",  tag: "Style",      imgKey: "chrome_garnish"    },
    { id: 15, name: "ORVM Chrome Garnish",    cat: "exterior",  tag: "Style",      imgKey: "chrome_garnish"    },
    { id: 16, name: "Window Chrome Kit",      cat: "exterior",  tag: "Style",      imgKey: "chrome_garnish"    },
    { id: 17, name: "Rear Bumper Chrome",     cat: "exterior",  tag: "Style",      imgKey: "bumper_guard"      },
    { id: 18, name: "Roof Graphics",          cat: "exterior",  tag: "Bold",       imgKey: "spoiler"           },
  ],
  safari: [
    { id: 1,  name: "Door Edge Guard",        cat: "exterior",  tag: "Must Have",  imgKey: "bumper_guard"    },
    { id: 2,  name: "3D Carpets",             cat: "interior",  tag: "Essential",  imgKey: "3d_floor_mats"   },
    { id: 3,  name: "Car Cover",              cat: "care",      tag: "Essential",  imgKey: "body_cover"      },
    { id: 4,  name: "Mud Flaps",              cat: "exterior",  tag: "Must Have",  imgKey: "mud_flaps"       },
    { id: 5,  name: "Front Parking Sensors",  cat: "safety",    tag: "Safety",     imgKey: "parking_sensors" },
    { id: 6,  name: "TPMS",                   cat: "safety",    tag: "Safety",     imgKey: "tpms"            },
    { id: 7,  name: "Tyre Inflator",          cat: "care",      tag: "Utility",    imgKey: "tyre_inflator"   },
    { id: 8,  name: "Puncture Repair Kit",    cat: "care",      tag: "Safety",     imgKey: "puncture_kit"    },
    { id: 9,  name: "17\" Alloy Wheel",       cat: "exterior",  tag: "Upgrade",    imgKey: "alloy_wheels"    },
    { id: 10, name: "Sunshades",              cat: "comfort",   tag: "Comfort",    imgKey: "sunshades"       },
    { id: 11, name: "Cycle Carrier",          cat: "lifestyle", tag: "Adventure",  imgKey: "cycle_carrier"   },
    { id: 12, name: "Front Bumper Chrome",    cat: "exterior",  tag: "Style",      imgKey: "chrome_garnish"  },
    { id: 13, name: "Door Handle Garnish",    cat: "exterior",  tag: "Style",      imgKey: "chrome_garnish"  },
    { id: 14, name: "Bonnet Mascot",          cat: "exterior",  tag: "Style",      imgKey: "bumper_guard"    },
    { id: 15, name: "Seat Covers",            cat: "interior",  tag: "Premium",    imgKey: "seat_covers"     },
    { id: 16, name: "Roof Rails",             cat: "lifestyle", tag: "Adventure",  imgKey: "roof_rails"      },
  ],
  punch: [
    { id: 1,  name: "3D Floor Mats",         cat: "interior",  tag: "Essential",  imgKey: "3d_floor_mats"    },
    { id: 2,  name: "Car Cover",             cat: "care",      tag: "Essential",  imgKey: "body_cover"       },
    { id: 3,  name: "Mud Flaps",             cat: "exterior",  tag: "Must Have",  imgKey: "mud_flaps"        },
    { id: 4,  name: "Door Edge Guard",       cat: "exterior",  tag: "Must Have",  imgKey: "bumper_guard"     },
    { id: 5,  name: "Seat Covers",           cat: "interior",  tag: "Comfort",    imgKey: "seat_covers"      },
    { id: 6,  name: "Door Visor",            cat: "exterior",  tag: "Popular",    imgKey: "door_visor"       },
    { id: 7,  name: "16\" Alloy Wheels",     cat: "exterior",  tag: "Upgrade",    imgKey: "alloy_wheels"     },
    { id: 8,  name: "Auto-Dimming IRVM",     cat: "interior",  tag: "Smart",      imgKey: "auto_dimming_irvm"},
    { id: 9,  name: "App-Based TPMS",        cat: "safety",    tag: "Safety",     imgKey: "tpms"             },
    { id: 10, name: "Front Parking Sensors", cat: "safety",    tag: "Safety",     imgKey: "parking_sensors"  },
    { id: 11, name: "Wireless Charger",      cat: "comfort",   tag: "Tech",       imgKey: "wireless_charger" },
    { id: 12, name: "Air Purifier",          cat: "comfort",   tag: "Health",     imgKey: "air_purifier"     },
    { id: 13, name: "Magnetic Sunshades",    cat: "comfort",   tag: "Cool Cabin", imgKey: "sunshades"        },
    { id: 14, name: "Scuff Plates (4pc)",    cat: "interior",  tag: "Style",      imgKey: "scuff_plates"     },
    { id: 15, name: "Roof Rails (Black)",    cat: "lifestyle", tag: "Adventure",  imgKey: "roof_rails"       },
    { id: 16, name: "Front Skid Plate",      cat: "exterior",  tag: "Off-Road",   imgKey: "skid_plate"       },
    { id: 17, name: "Rear Skid Plate",       cat: "exterior",  tag: "Off-Road",   imgKey: "skid_plate"       },
    { id: 18, name: "Spoiler (Black)",       cat: "exterior",  tag: "Sporty",     imgKey: "spoiler"          },
  ],
  altroz: [
    { id: 1,  name: "Floor Mats",              cat: "interior", tag: "Essential",  imgKey: "3d_floor_mats"    },
    { id: 2,  name: "Mud Flaps",               cat: "exterior", tag: "Must Have",  imgKey: "mud_flaps"        },
    { id: 3,  name: "Tyre Repair Kit",         cat: "care",     tag: "Safety",     imgKey: "puncture_kit"     },
    { id: 4,  name: "Seat Covers",             cat: "interior", tag: "Comfort",    imgKey: "seat_covers"      },
    { id: 5,  name: "Alloy Wheels",            cat: "exterior", tag: "Upgrade",    imgKey: "alloy_wheels"     },
    { id: 6,  name: "Reverse Camera + Display",cat: "safety",   tag: "Safety",     imgKey: "reverse_camera"   },
    { id: 7,  name: "TPMS",                    cat: "safety",   tag: "Safety",     imgKey: "tpms"             },
    { id: 8,  name: "Dash Cam",                cat: "safety",   tag: "Security",   imgKey: "dvr"              },
    { id: 9,  name: "Vehicle Tracker",         cat: "safety",   tag: "Security",   imgKey: "gps_tracker"      },
    { id: 10, name: "Air Purifier",            cat: "comfort",  tag: "Health",     imgKey: "air_purifier"     },
    { id: 11, name: "Parcel Tray",             cat: "interior", tag: "Useful",     imgKey: "trunk_mat"        },
    { id: 12, name: "Music System",            cat: "comfort",  tag: "Tech",       imgKey: "music_system"     },
    { id: 13, name: "Wireless Charger",        cat: "comfort",  tag: "Tech",       imgKey: "wireless_charger" },
    { id: 14, name: "Illuminated Scuff Plates",cat: "interior", tag: "Style",      imgKey: "scuff_plates"     },
    { id: 15, name: "Chrome Accessories",      cat: "exterior", tag: "Style",      imgKey: "chrome_garnish"   },
    { id: 16, name: "Sunshades",               cat: "comfort",  tag: "Cool Cabin", imgKey: "sunshades"        },
  ],
  tiago: [
    { id: 1,  name: "Floor Mats",              cat: "interior", tag: "Essential",   imgKey: "3d_floor_mats"  },
    { id: 2,  name: "Mud Flaps",               cat: "exterior", tag: "Must Have",   imgKey: "mud_flaps"      },
    { id: 3,  name: "Car Cover",               cat: "care",     tag: "Essential",   imgKey: "body_cover"     },
    { id: 4,  name: "Front Armrest",           cat: "comfort",  tag: "Recommended", imgKey: "armrest"        },
    { id: 5,  name: "Seat Covers",             cat: "interior", tag: "Comfort",     imgKey: "seat_covers"    },
    { id: 6,  name: "14\" Alloy Wheels",       cat: "exterior", tag: "Upgrade",     imgKey: "alloy_wheels"   },
    { id: 7,  name: "Door Visor",              cat: "exterior", tag: "Popular",     imgKey: "door_visor"     },
    { id: 8,  name: "App-Based TPMS",          cat: "safety",   tag: "Safety",      imgKey: "tpms"           },
    { id: 9,  name: "Magnetic Sunshades",      cat: "comfort",  tag: "Comfort",     imgKey: "sunshades"      },
    { id: 10, name: "Air Purifier",            cat: "comfort",  tag: "Health",      imgKey: "air_purifier"   },
    { id: 11, name: "Parcel Tray",             cat: "interior", tag: "Useful",      imgKey: "trunk_mat"      },
    { id: 12, name: "Bumper Corner Guards",    cat: "exterior", tag: "Protection",  imgKey: "bumper_guard"   },
    { id: 13, name: "Illuminated Scuff Plates",cat: "interior", tag: "Style",       imgKey: "scuff_plates"   },
    { id: 14, name: "Roof Rails",              cat: "lifestyle",tag: "Utility",     imgKey: "roof_rails"     },
    { id: 15, name: "ORVM Garnish",            cat: "exterior", tag: "Style",       imgKey: "chrome_garnish" },
    { id: 16, name: "Body Side Moulding",      cat: "exterior", tag: "Style",       imgKey: "bumper_guard"   },
  ],
  curvv: [
    { id: 1,  name: "3D Floor Mats",          cat: "interior", tag: "Essential", imgKey: "3d_floor_mats"   },
    { id: 2,  name: "7D Floor Mats",          cat: "interior", tag: "Premium",   imgKey: "3d_floor_mats"   },
    { id: 3,  name: "Mud Flaps",              cat: "exterior", tag: "Must Have", imgKey: "mud_flaps"       },
    { id: 4,  name: "17\" Alloy Wheels",      cat: "exterior", tag: "Upgrade",   imgKey: "alloy_wheels"    },
    { id: 5,  name: "Body Cover",             cat: "care",     tag: "Essential", imgKey: "body_cover"      },
    { id: 6,  name: "Door Visor (Chrome)",    cat: "exterior", tag: "Popular",   imgKey: "door_visor"      },
    { id: 7,  name: "DVR Advanced",           cat: "safety",   tag: "Premium",   imgKey: "dvr"             },
    { id: 8,  name: "Dash Cam (F+R)",         cat: "safety",   tag: "Security",  imgKey: "dvr"             },
    { id: 9,  name: "Vehicle Tracker",        cat: "safety",   tag: "Security",  imgKey: "gps_tracker"     },
    { id: 10, name: "Ambient Mood Lighting",  cat: "comfort",  tag: "Ambience",  imgKey: "mood_lighting"   },
    { id: 11, name: "Wireless Charger",       cat: "comfort",  tag: "Tech",      imgKey: "wireless_charger"},
    { id: 12, name: "JBL Speakers",           cat: "comfort",  tag: "Audio",     imgKey: "music_system"    },
    { id: 13, name: "Roof Rails",             cat: "lifestyle",tag: "Utility",   imgKey: "roof_rails"      },
    { id: 14, name: "Cycle Carrier",          cat: "lifestyle",tag: "Adventure", imgKey: "cycle_carrier"   },
    { id: 15, name: "Ceramic Coating Kit",    cat: "care",     tag: "Premium",   imgKey: "ceramic_coating" },
    { id: 16, name: "Puncture Repair Kit",    cat: "care",     tag: "Safety",    imgKey: "puncture_kit"    },
    { id: 17, name: "Parcel Tray",            cat: "interior", tag: "Useful",    imgKey: "trunk_mat"       },
    { id: 18, name: "Neck Rest Pillows",      cat: "comfort",  tag: "Comfort",   imgKey: "neck_rest"       },
  ],
  tigor: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", tag: "Essential", imgKey: "3d_floor_mats"  },
    { id: 2,  name: "Car Cover",               cat: "care",     tag: "Essential", imgKey: "body_cover"     },
    { id: 3,  name: "Mud Flaps",               cat: "exterior", tag: "Must Have", imgKey: "mud_flaps"      },
    { id: 4,  name: "Seat Covers",             cat: "interior", tag: "Comfort",   imgKey: "seat_covers"    },
    { id: 5,  name: "Door Visor",              cat: "exterior", tag: "Popular",   imgKey: "door_visor"     },
    { id: 6,  name: "Body Side Moulding",      cat: "exterior", tag: "Protection",imgKey: "bumper_guard"   },
    { id: 7,  name: "Alloy Wheels",            cat: "exterior", tag: "Upgrade",   imgKey: "alloy_wheels"   },
    { id: 8,  name: "Reverse Camera",          cat: "safety",   tag: "Safety",    imgKey: "reverse_camera" },
    { id: 9,  name: "TPMS",                    cat: "safety",   tag: "Safety",    imgKey: "tpms"           },
    { id: 10, name: "Vehicle Tracker",         cat: "safety",   tag: "Security",  imgKey: "gps_tracker"    },
    { id: 11, name: "Window Sunshades",        cat: "comfort",  tag: "Comfort",   imgKey: "sunshades"      },
    { id: 12, name: "Illuminated Scuff Plates",cat: "interior", tag: "Style",     imgKey: "scuff_plates"   },
    { id: 13, name: "Steering Cover",          cat: "interior", tag: "Comfort",   imgKey: "steering_cover" },
    { id: 14, name: "Parcel Tray",             cat: "interior", tag: "Useful",    imgKey: "trunk_mat"      },
    { id: 15, name: "Air Purifier",            cat: "comfort",  tag: "Health",    imgKey: "air_purifier"   },
    { id: 16, name: "Front Armrest",           cat: "comfort",  tag: "Comfort",   imgKey: "armrest"        },
  ],
  sierra: [
    { id: 1,  name: "Roof Rack",              cat: "lifestyle",tag: "Adventure",  imgKey: "roof_rack"      },
    { id: 2,  name: "Ladder",                 cat: "lifestyle",tag: "Adventure",  imgKey: "ladder"         },
    { id: 3,  name: "Front Skid Plate",       cat: "exterior", tag: "Off-Road",   imgKey: "skid_plate"     },
    { id: 4,  name: "Rear Skid Plate",        cat: "exterior", tag: "Off-Road",   imgKey: "skid_plate"     },
    { id: 5,  name: "Side Step",              cat: "exterior", tag: "Utility",    imgKey: "sidestep"       },
    { id: 6,  name: "Mud Flaps",              cat: "exterior", tag: "Must Have",  imgKey: "mud_flaps"      },
    { id: 7,  name: "3D Floor Mats + Trunk",  cat: "interior", tag: "Essential",  imgKey: "3d_floor_mats"  },
    { id: 8,  name: "7D Floor Mats + Trunk",  cat: "interior", tag: "Premium",    imgKey: "3d_floor_mats"  },
    { id: 9,  name: "Body Cover",             cat: "care",     tag: "Essential",  imgKey: "body_cover"     },
    { id: 10, name: "Wheel Arch Cladding",    cat: "exterior", tag: "Style",      imgKey: "skid_plate"     },
    { id: 11, name: "Front Grille Add-On",    cat: "exterior", tag: "Style",      imgKey: "bumper_guard"   },
    { id: 12, name: "Door Visor (Chrome)",    cat: "exterior", tag: "Popular",    imgKey: "door_visor"     },
    { id: 13, name: "Roof Rail",              cat: "lifestyle",tag: "Adventure",  imgKey: "roof_rails"     },
    { id: 14, name: "Window Chrome Garnish",  cat: "exterior", tag: "Style",      imgKey: "chrome_garnish" },
    { id: 15, name: "Front Bug Deflector",    cat: "exterior", tag: "Protection", imgKey: "bumper_guard"   },
    { id: 16, name: "Tailgate Cladding",      cat: "exterior", tag: "Style",      imgKey: "bumper_guard"   },
    { id: 17, name: "Body Side Chrome",       cat: "exterior", tag: "Style",      imgKey: "chrome_garnish" },
    { id: 18, name: "Tail Light Chrome",      cat: "exterior", tag: "Style",      imgKey: "chrome_garnish" },
  ],
  nexon_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior", tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",               cat: "care",     tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charging Unit (7.2kW)",cat:"ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable Charger (3.3kW)", cat: "ev",       tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "Type-2 Charging Cable",    cat: "ev",       tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Battery Guard Cover",      cat: "ev",       tag: "EV Protection",imgKey: "battery_guard_ev",   ev: true },
    { id: 7,  name: "Alloy Wheels (16\")",      cat: "exterior", tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 8,  name: "App-Based TPMS",           cat: "safety",   tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 9,  name: "Seat Covers",              cat: "interior", tag: "Comfort",      imgKey: "seat_covers",        ev: true },
    { id: 10, name: "Vehicle Tracker",          cat: "safety",   tag: "Security",     imgKey: "gps_tracker",        ev: true },
    { id: 11, name: "Door Visor (Chrome)",      cat: "exterior", tag: "Popular",      imgKey: "door_visor",         ev: true },
    { id: 12, name: "Mud Flaps",                cat: "exterior", tag: "Must Have",    imgKey: "mud_flaps",          ev: true },
    { id: 13, name: "Mood Lighting",            cat: "comfort",  tag: "Ambience",     imgKey: "mood_lighting",      ev: true },
    { id: 14, name: "Wireless Charger",         cat: "comfort",  tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 15, name: "Air Purifier",             cat: "comfort",  tag: "Health",       imgKey: "air_purifier",       ev: true },
    { id: 16, name: "Roof Rails",               cat: "lifestyle",tag: "Adventure",    imgKey: "roof_rails",         ev: true },
  ],
  punch_ev: [
    { id: 1,  name: "3D Floor Mats",             cat: "interior",tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",                cat: "care",    tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charging Unit (3.3kW)",cat:"ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable Charger",          cat: "ev",      tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "Type-2 Charging Cable",     cat: "ev",      tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Battery Guard",             cat: "ev",      tag: "EV Protection",imgKey: "battery_guard_ev",   ev: true },
    { id: 7,  name: "Alloy Wheels (15\")",       cat: "exterior",tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 8,  name: "TPMS",                      cat: "safety",  tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 9,  name: "Seat Covers",               cat: "interior",tag: "Comfort",      imgKey: "seat_covers",        ev: true },
    { id: 10, name: "Wireless Charger",          cat: "comfort", tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 11, name: "Air Purifier",              cat: "comfort", tag: "Health",       imgKey: "air_purifier",       ev: true },
    { id: 12, name: "Mud Flaps",                 cat: "exterior",tag: "Must Have",    imgKey: "mud_flaps",          ev: true },
    { id: 13, name: "Roof Rails (Black)",        cat: "lifestyle",tag:"Adventure",    imgKey: "roof_rails",         ev: true },
    { id: 14, name: "Scuff Plates",              cat: "interior",tag: "Style",        imgKey: "scuff_plates",       ev: true },
  ],
  tiago_ev: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",              cat: "care",     tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charger (3.3kW)",    cat: "ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable EV Charger",     cat: "ev",       tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "Type-2 Cable (16A)",      cat: "ev",       tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Seat Covers",             cat: "interior", tag: "Comfort",      imgKey: "seat_covers",        ev: true },
    { id: 7,  name: "TPMS",                    cat: "safety",   tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 8,  name: "Wireless Charger",        cat: "comfort",  tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 9,  name: "Air Purifier",            cat: "comfort",  tag: "Health",       imgKey: "air_purifier",       ev: true },
    { id: 10, name: "Mud Flaps",               cat: "exterior", tag: "Must Have",    imgKey: "mud_flaps",          ev: true },
    { id: 11, name: "Alloy Wheels (14\")",     cat: "exterior", tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 12, name: "Sunshades",               cat: "comfort",  tag: "Cool Cabin",   imgKey: "sunshades",          ev: true },
  ],
  tigor_ev: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",              cat: "care",     tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charger (7.2kW)",    cat: "ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable Charger",        cat: "ev",       tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "Type-2 Cable",            cat: "ev",       tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Battery Protection Guard",cat: "ev",       tag: "EV Protection",imgKey: "battery_guard_ev",   ev: true },
    { id: 7,  name: "TPMS",                    cat: "safety",   tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 8,  name: "Seat Covers",             cat: "interior", tag: "Comfort",      imgKey: "seat_covers",        ev: true },
    { id: 9,  name: "Vehicle Tracker",         cat: "safety",   tag: "Security",     imgKey: "gps_tracker",        ev: true },
    { id: 10, name: "Wireless Charger",        cat: "comfort",  tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 11, name: "Alloy Wheels",            cat: "exterior", tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 12, name: "Air Purifier",            cat: "comfort",  tag: "Health",       imgKey: "air_purifier",       ev: true },
  ],
  curvv_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior", tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",               cat: "care",     tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charger (7.2kW)",     cat: "ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable 3.3kW Charger",   cat: "ev",       tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "CCS2 Fast Charge Cable",   cat: "ev",       tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Battery Guard Cover",      cat: "ev",       tag: "EV Protection",imgKey: "battery_guard_ev",   ev: true },
    { id: 7,  name: "18\" Aero Alloy Wheels",   cat: "exterior", tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 8,  name: "Ambient Mood Lighting",    cat: "comfort",  tag: "Ambience",     imgKey: "mood_lighting",      ev: true },
    { id: 9,  name: "TPMS",                     cat: "safety",   tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 10, name: "DVR Advanced",             cat: "safety",   tag: "Premium",      imgKey: "dvr",                ev: true },
    { id: 11, name: "Wireless Charger",         cat: "comfort",  tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 12, name: "Ceramic Coating Kit",      cat: "care",     tag: "Premium",      imgKey: "ceramic_coating",    ev: true },
    { id: 13, name: "Vehicle Tracker",          cat: "safety",   tag: "Security",     imgKey: "gps_tracker",        ev: true },
    { id: 14, name: "JBL Speakers",             cat: "comfort",  tag: "Audio",        imgKey: "music_system",       ev: true },
    { id: 15, name: "Mud Flaps",                cat: "exterior", tag: "Must Have",    imgKey: "mud_flaps",          ev: true },
    { id: 16, name: "Seat Covers",              cat: "interior", tag: "Comfort",      imgKey: "seat_covers",        ev: true },
  ],
  harrier_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior", tag: "Essential",    imgKey: "ev_floor_mats",      ev: true },
    { id: 2,  name: "Body Cover",               cat: "care",     tag: "Essential",    imgKey: "ev_body_cover",      ev: true },
    { id: 3,  name: "Home Charger (11kW)",       cat: "ev",       tag: "EV Essential", imgKey: "home_charger_ev",    ev: true },
    { id: 4,  name: "Portable 7.2kW Charger",   cat: "ev",       tag: "EV Essential", imgKey: "portable_charger_ev",ev: true },
    { id: 5,  name: "CCS2 Charge Cable (32A)",  cat: "ev",       tag: "EV Accessory", imgKey: "charging_cable_ev",  ev: true },
    { id: 6,  name: "Battery Armour Guard",     cat: "ev",       tag: "EV Protection",imgKey: "battery_guard_ev",   ev: true },
    { id: 7,  name: "19\" Aero Alloy Wheels",   cat: "exterior", tag: "Upgrade",      imgKey: "ev_alloy_wheels",    ev: true },
    { id: 8,  name: "Sidestep (Illuminated)",   cat: "exterior", tag: "Utility",      imgKey: "sidestep",           ev: true },
    { id: 9,  name: "TPMS",                     cat: "safety",   tag: "Safety",       imgKey: "ev_tpms",            ev: true },
    { id: 10, name: "DVR Advanced (4K)",        cat: "safety",   tag: "Premium",      imgKey: "dvr",                ev: true },
    { id: 11, name: "Vehicle Tracker",          cat: "safety",   tag: "Security",     imgKey: "gps_tracker",        ev: true },
    { id: 12, name: "Ambient Mood Lighting",    cat: "comfort",  tag: "Ambience",     imgKey: "mood_lighting",      ev: true },
    { id: 13, name: "Wireless Charger",         cat: "comfort",  tag: "Tech",         imgKey: "wireless_charger",   ev: true },
    { id: 14, name: "Seat Covers",              cat: "interior", tag: "Premium",      imgKey: "seat_covers",        ev: true },
    { id: 15, name: "Roof Rails",               cat: "lifestyle",tag: "Adventure",    imgKey: "roof_rails",         ev: true },
    { id: 16, name: "Ceramic Coating Kit",      cat: "care",     tag: "Premium",      imgKey: "ceramic_coating",    ev: true },
  ],
};

// ─── QUOTE MODAL COMPONENT ────────────────────────────────────────
function QuoteModal({ cart, allModels, onClose }) {
  const [form, setForm]   = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit mobile number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setApiError("");

    // Build items payload
    const items = cart.map(c => ({
      model_id:     c.model,
      model_name:   allModels.find(m => m.id === c.model)?.name || c.model,
      acc_name:     c.name,
      acc_category: c.cat || "",
      acc_tag:      c.tag || "",
      is_ev:        c.ev ? true : false,
    }));

    try {
      const res = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:  form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          items,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSubmitted(true);
      } else {
        setApiError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Group cart by model for display
  const grouped = cart.reduce((acc, item) => {
    const key = item.model;
    if (!acc[key]) acc[key] = { modelName: allModels.find(m => m.id === key)?.name || key, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>✕</button>

        {submitted ? (
          <div className="success-box">
            <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
            <div className="cormorant" style={{ fontSize: 30, fontWeight: 600, color: BRAND.navyMid, marginBottom: 10 }}>
              Enquiry Submitted!
            </div>
            <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.8, maxWidth: 360, margin: "0 auto 28px" }}>
              Thank you, <strong>{form.name}</strong>! Our accessories team will call you on <strong>{form.phone}</strong> within 24 hours to discuss your selection.
            </p>
            <div style={{ background: "#f7f5f0", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 3, padding: "16px 24px", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: BRAND.muted, textTransform: "uppercase", marginBottom: 8 }}>
                {cart.length} item{cart.length > 1 ? "s" : ""} in your enquiry
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cart.map((c, i) => (
                  <span key={i} className={`item-chip ${c.ev ? "ev" : ""}`}>
                    {c.ev ? "⚡ " : ""}{c.name}
                  </span>
                ))}
              </div>
            </div>
            <button className="cta-gold" onClick={onClose} style={{ padding: "12px 36px", borderRadius: 3, fontSize: 11 }}>
              Back to Accessories
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ background: `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`, padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 1, background: BRAND.gold }} />
                <span style={{ fontSize: 9, letterSpacing: "0.3em", color: BRAND.gold, textTransform: "uppercase" }}>
                  Request a Quote
                </span>
              </div>
              <h2 className="cormorant" style={{ fontSize: 26, fontWeight: 600, color: BRAND.white, lineHeight: 1.2 }}>
                Get Best Price on Your Selection
              </h2>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 6, lineHeight: 1.6 }}>
                Fill in your details — our team will contact you within 24 hours with the best pricing.
              </p>
            </div>

            <div style={{ padding: "28px 32px" }}>
              {/* Selected Items Summary */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: BRAND.muted, textTransform: "uppercase", fontFamily: "'Jost',sans-serif", marginBottom: 12 }}>
                  Your Selected Accessories ({cart.length} item{cart.length > 1 ? "s" : ""})
                </div>
                {Object.values(grouped).map(g => (
                  <div key={g.modelName} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: BRAND.navyMid, fontFamily: "'Jost',sans-serif", marginBottom: 6 }}>
                      Tata {g.modelName}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {g.items.map((item, i) => (
                        <span key={i} className={`item-chip ${item.ev ? "ev" : ""}`}>
                          {item.ev ? "⚡ " : ""}{item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed rgba(0,0,0,0.1)", fontSize: 11, color: BRAND.muted, fontFamily: "'Jost',sans-serif" }}>
                  💬 Prices will be shared by our team personally. All accessories are 100% genuine with 2-year warranty.
                </div>
              </div>

              {/* Form Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    className={`form-input ${errors.name ? "error" : ""}`}
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input
                    className={`form-input ${errors.phone ? "error" : ""}`}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    maxLength={10}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="e.g. rajesh@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>

              {apiError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#dc2626", fontFamily: "'Jost',sans-serif" }}>
                  ⚠️ {apiError}
                </div>
              )}

              <button
                className={`submit-btn ${loading ? "loading" : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "" : "Submit Enquiry →"}
              </button>

              <p style={{ fontSize: 10, color: BRAND.muted, textAlign: "center", marginTop: 12, fontFamily: "'Jost',sans-serif", lineHeight: 1.6 }}>
                By submitting, you agree to be contacted by Manickbag Tata Motors team via call or WhatsApp.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function Accessories() {
  const [segment, setSegment]         = useState("ice");
  const [selectedModel, setSelectedModel] = useState("nexon");
  const [activeCat, setActiveCat]     = useState("all");
  const [cart, setCart]               = useState([]);
  const [search, setSearch]           = useState("");
  const [animKey, setAnimKey]         = useState(0);
  const [imgErrors, setImgErrors]     = useState({});
  const [showModal, setShowModal]     = useState(false);

  const MODELS   = segment === "ice" ? ICE_MODELS : EV_MODELS;
  const ALL_MODELS = [...ICE_MODELS, ...EV_MODELS];
  const model    = MODELS.find(m => m.id === selectedModel);
  const allAcc   = ACC_DB[selectedModel] || [];

  const visibleCats = segment === "ev" ? CATS : CATS.filter(c => c.id !== "ev");

  const filtered = allAcc.filter(a => {
    const catMatch    = activeCat === "all" || a.cat === activeCat;
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.desc || "").toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const totalItems = cart.length;

  const toggleCart = (acc) => {
    const key = `${selectedModel}-${acc.id}`;
    setCart(prev => {
      const exists = prev.find(c => c.key === key);
      return exists ? prev.filter(c => c.key !== key) : [...prev, { key, model: selectedModel, ...acc }];
    });
  };

  const isInCart = (acc) => cart.some(c => c.key === `${selectedModel}-${acc.id}`);

  const handleSegmentChange = (seg) => {
    setSegment(seg);
    const firstModel = seg === "ice" ? "nexon" : "nexon_ev";
    setSelectedModel(firstModel);
    setActiveCat("all");
    setSearch("");
    setAnimKey(k => k + 1);
  };

  const handleModelChange = (id) => {
    setSelectedModel(id);
    setActiveCat("all");
    setSearch("");
    setAnimKey(k => k + 1);
  };

  const handleImgError = (key) => {
    setImgErrors(prev => ({ ...prev, [key]: true }));
  };

  const tagColor = (tag) => {
    const map = {
      "Essential": "#16a34a", "Must Have": "#16a34a", "Recommended": "#2563eb",
      "Safety": "#dc2626", "Security": "#dc2626", "Premium": "#7c3aed",
      "Upgrade": "#ea580c", "Popular": "#0891b2", "Adventure": "#b45309",
      "Off-Road": "#78350f", "Tech": "#9333ea", "Health": "#16a34a",
      "Comfort": "#0d9488", "Style": "#6b7280", "Useful": "#4b5563",
      "Audio": "#db2777", "Ambience": "#7c3aed", "Protection": "#1d4ed8",
      "Utility": "#047857", "Bold": "#be123c", "Smart": "#0369a1",
      "EV Essential": "#0d9488", "EV Accessory": "#0891b2", "EV Protection": "#16a34a",
      "Cool Cabin": "#06b6d4", "Sporty": "#f59e0b",
    };
    return map[tag] || "#6b7280";
  };

  return (
    <Layout>
      <PageStyles />

      {/* ── Quote Modal ── */}
      {showModal && (
        <QuoteModal
          cart={cart}
          allModels={ALL_MODELS}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ── Hero ── */}
      <div style={{
        background: segment === "ev"
          ? "linear-gradient(135deg,#041a10 0%,#0a2e1f 45%,#0c1f3f 100%)"
          : `linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyLight} 50%,${BRAND.navy} 100%)`,
        padding: "64px 48px 0", position: "relative", overflow: "hidden",
        transition: "background 0.6s ease",
      }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(184,150,62,0.08)" }} />
        <div style={{ position: "absolute", right: 60, top: 40, width: 280, height: 280, borderRadius: "50%", border: `1px solid ${segment === "ev" ? "rgba(13,148,136,0.15)" : "rgba(184,150,62,0.12)"}` }} />
        {segment === "ev" && (
          <div style={{ position: "absolute", left: "30%", top: 20, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        )}

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 36, height: 1, background: segment === "ev" ? BRAND.evTeal : BRAND.gold }} />
            <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: segment === "ev" ? BRAND.evTeal : BRAND.gold }}>
              {segment === "ev" ? "Tata EV Accessories" : "Genuine Tata Accessories"}
            </span>
          </div>
          <h1 className="cormorant" style={{ fontSize: "clamp(36px,5vw,66px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.1, marginBottom: 12 }}>
            {segment === "ev"
              ? <>Electrify Your <span style={{ background: "linear-gradient(90deg,#0d9488,#5eead4,#0d9488)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }}>Drive</span></>
              : <>Choose Your <span className="acc-shimmer">Model</span></>}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 480, lineHeight: 1.8, marginBottom: 28 }}>
            {segment === "ev"
              ? "EV-specific accessories, charging solutions and protection gear — purpose-built for your Tata electric vehicle."
              : "Browse 100% genuine Tata Motors accessories — tested, warranted, and perfectly tailored to each model."}
          </p>

          {/* ICE / EV Toggle */}
          <div className="segment-toggle" style={{ marginBottom: 28 }}>
            <button className="segment-btn" onClick={() => handleSegmentChange("ice")} style={{ background: segment === "ice" ? BRAND.gold : "transparent", color: segment === "ice" ? BRAND.navy : "rgba(255,255,255,0.6)" }}>
              🚗 Petrol / Diesel
            </button>
            <button className="segment-btn" onClick={() => handleSegmentChange("ev")} style={{ background: segment === "ev" ? "#0d9488" : "transparent", color: segment === "ev" ? "#fff" : "rgba(255,255,255,0.6)" }}>
              ⚡ Electric Vehicles
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 36, marginBottom: 36 }}>
            {(segment === "ev"
              ? [["6 Models","EV Range"],["EV-Grade","Quality"],["2 Year","Warranty"],["Free","Fitment*"]]
              : [["100%","Genuine"],["2 Year","Warranty"],["9 Models","Available"],["Free","Installation*"]]
            ).map(([v, l]) => (
              <div key={l}>
                <div className="cormorant" style={{ fontSize: 28, fontWeight: 600, color: segment === "ev" ? "#0d9488" : BRAND.gold }}>{v}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Model selector pills */}
          <div className="model-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 0, paddingTop: 2 }}>
            {MODELS.map(m => {
              const active = selectedModel === m.id;
              const accentColor = segment === "ev" ? "#0d9488" : BRAND.gold;
              return (
                <button key={m.id} className="model-pill"
                  onClick={() => handleModelChange(m.id)}
                  style={{
                    padding: "14px 22px", borderRadius: "8px 8px 0 0", flexShrink: 0,
                    background: active ? BRAND.offWhite : "rgba(255,255,255,0.06)",
                    color: active ? BRAND.navyMid : "rgba(255,255,255,0.65)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    minWidth: 100, position: "relative",
                  }}>
                  {m.ev && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 8, background: "#0d9488", color: "#fff", padding: "1px 5px", borderRadius: 2, letterSpacing: "0.1em", fontWeight: 700 }}>EV</span>}
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? BRAND.muted : "rgba(255,255,255,0.4)" }}>{m.type}</div>
                  </div>
                  {active && <div style={{ width: 24, height: 2, background: accentColor, borderRadius: 1 }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Model Header Bar ── */}
      <div style={{ background: BRAND.offWhite, borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "20px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 36 }}>{model?.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 className="cormorant" style={{ fontSize: 28, fontWeight: 600, color: BRAND.navyMid }}>Tata {model?.name}</h2>
                <span style={{ fontSize: 10, background: model?.ev ? "#0d9488" : model?.accent, color: "#fff", padding: "3px 10px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                  {model?.type}
                </span>
                {model?.ev && (
                  <span className="ev-badge" style={{ fontSize: 9, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "3px 8px", borderRadius: 2, fontWeight: 700, letterSpacing: "0.1em" }}>
                    ⚡ Zero Emission
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 3 }}>{model?.tagline} · Starting from: {model?.priceRange}</div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: BRAND.muted }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search accessories..."
              style={{ paddingLeft: 36, paddingRight: 12, height: 38, border: "1px solid rgba(0,0,0,0.15)", borderRadius: 4, fontSize: 13, color: BRAND.navyMid, background: "#fff", outline: "none", width: 240, fontFamily: "'Jost', sans-serif" }}
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 48px 60px" }}>

        {/* Category Filter + Cart Count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {visibleCats.map(c => {
              const isActive = activeCat === c.id;
              return (
                <button key={c.id} className="cat-btn" onClick={() => setActiveCat(c.id)} style={{
                  padding: "8px 18px", fontSize: 12, borderRadius: 2,
                  background: isActive ? (c.id === "ev" ? "#0d9488" : BRAND.navyMid) : "#fff",
                  color: isActive ? BRAND.white : BRAND.navyMid,
                  border: `1px solid ${isActive ? (c.id === "ev" ? "#0d9488" : BRAND.navyMid) : "rgba(10,31,63,0.18)"}`,
                  letterSpacing: "0.05em", fontFamily: "'Jost', sans-serif",
                }}>
                  {c.id === "ev" ? "⚡ " : ""}{c.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: BRAND.muted }}>{filtered.length} accessories</span>
            {totalItems > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: BRAND.gold, color: BRAND.navy, padding: "8px 16px", borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                🛒 {totalItems} selected
                <button className="clear-btn" onClick={() => setCart([])} style={{ fontSize: 10, color: BRAND.navy, opacity: 0.6 }}>✕</button>
              </div>
            )}
          </div>
        </div>

        {/* Accessories Grid — NO PRICES SHOWN */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: BRAND.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="cormorant" style={{ fontSize: 24, color: BRAND.navyMid, marginBottom: 8 }}>No accessories found</div>
            <div style={{ fontSize: 13 }}>Try a different category or search term</div>
          </div>
        ) : (
          <div key={animKey} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 18 }}>
            {filtered.map((acc, i) => {
              const inCart      = isInCart(acc);
              const imgKey      = `${selectedModel}-${acc.id}`;
              const hasImgError = imgErrors[imgKey];
              const isEV        = acc.ev || acc.cat === "ev";
              return (
                <div key={acc.id} className="acc-card acc-fade"
                  style={{
                    background: "#fff",
                    border: `1px solid ${inCart ? BRAND.borderLight : isEV ? "rgba(13,148,136,0.2)" : "rgba(0,0,0,0.06)"}`,
                    overflow: "hidden",
                    animationDelay: `${i * 0.05}s`,
                    boxShadow: inCart ? `0 0 0 2px ${BRAND.gold}33` : isEV ? "0 2px 12px rgba(13,148,136,0.08)" : "none",
                  }}>
                  {/* Image area */}
                  <div style={{
                    height: 150,
                    background: isEV ? "linear-gradient(135deg,#041a10,#0a2e1f)" : `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {!hasImgError ? (
                      <img src={getImg(acc.imgKey)} alt={acc.name} className="acc-img"
                        onError={() => handleImgError(imgKey)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
                      />
                    ) : (
                      <span style={{ fontSize: 44 }}>{isEV ? "⚡" : "🔧"}</span>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: 10, left: 10, background: tagColor(acc.tag), color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", padding: "3px 8px", textTransform: "uppercase", borderRadius: 2 }}>
                      {acc.tag}
                    </div>
                    {inCart && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: BRAND.gold, color: BRAND.navy, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                        ✓
                      </div>
                    )}
                    {isEV && !inCart && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: "#0d9488", color: "#fff", borderRadius: 2, fontSize: 8, padding: "3px 7px", fontWeight: 700, letterSpacing: "0.1em" }}>
                        ⚡ EV
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 0, right: 0, background: "rgba(0,0,0,0.4)", fontSize: 9, color: "rgba(255,255,255,0.7)", padding: "3px 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {CATS.find(c => c.id === acc.cat)?.label}
                    </div>
                  </div>

                  {/* Body — NO PRICE */}
                  <div style={{ padding: "18px 20px" }}>
                    <h3 className="cormorant" style={{ fontSize: 19, fontWeight: 600, color: BRAND.navyMid, marginBottom: 6, lineHeight: 1.2 }}>
                      {acc.name}
                    </h3>
                    {acc.desc && (
                      <p style={{ fontSize: 11.5, color: BRAND.muted, lineHeight: 1.65, marginBottom: 16, minHeight: 52 }}>
                        {acc.desc}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Price hidden — replaced with "Get Quote" hint */}
                      <span style={{ fontSize: 11, color: BRAND.muted, fontFamily: "'Jost',sans-serif", letterSpacing: "0.04em" }}>
                        Price on request
                      </span>
                      <button className="enquire-btn"
                        onClick={() => toggleCart(acc)}
                        style={{
                          padding: "7px 14px", fontSize: 10, borderRadius: 2,
                          letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
                          background: inCart ? BRAND.gold : isEV ? "#0d9488" : BRAND.navyMid,
                          color: inCart ? BRAND.navy : BRAND.white,
                        }}>
                        {inCart ? "✓ Added" : "+ Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart CTA with GET QUOTE button */}
        {cart.length > 0 && (
          <div style={{
            marginTop: 48, background: BRAND.navyMid, padding: "28px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 6 }}>
                Your Selection — {cart.length} item{cart.length > 1 ? "s" : ""}
              </div>
              <div className="cormorant" style={{ fontSize: 22, color: BRAND.white, lineHeight: 1.3 }}>
                {cart.map(c => c.name).join(" · ")}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                Across: {[...new Set(cart.map(c => c.model))].map(id => ALL_MODELS.find(m => m.id === id)?.name).filter(Boolean).join(", ")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="cta-outline" onClick={() => setCart([])} style={{ padding: "10px 22px", fontSize: 11, borderRadius: 2 }}>
                Clear All
              </button>
              <button className="cta-gold" onClick={() => setShowModal(true)} style={{ padding: "10px 28px", fontSize: 11, borderRadius: 2 }}>
                🏷️ Get Quote →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Info Strip ── */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "36px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {[
            ["🔧", "Expert Fitment",    "Installed by trained Tata technicians at our service bays"],
            ["📦", "100% Genuine",      "Only authentic Tata Motors approved accessories supplied"],
            ["🛡️", "2-Year Warranty",   "All accessories backed by manufacturer warranty"],
            ["🚚", "Karnataka-Wide",    "Available across all 12 Manickbag Tata showrooms"],
            ["⚡", "EV Charging Setup", "Home charger installation by certified EV technicians"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26, marginTop: 2 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.navyMid, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: BRAND.muted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}