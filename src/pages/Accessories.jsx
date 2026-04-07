import { useState, useEffect } from "react";
import Layout from "./Layout"; // ← shared header/navbar/footer

// ─── BRAND TOKENS ─────────────────────────────────────────────────
const BRAND = {
  navy: "#0a1628", navyMid: "#0c1f3f", navyLight: "#1a3d7c",
  gold: "#b8963e", goldLight: "#d4af5a", goldPale: "#f0e4c2",
  white: "#ffffff", offWhite: "#f7f5f0", muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.25)",
  successGreen: "#16a34a",
  evGreen: "#16a34a", evTeal: "#0d9488",
};

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

    .acc-shimmer {
      background: linear-gradient(90deg,#b8963e 0%,#f0e4c2 40%,#b8963e 60%,#d4af5a 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }
    .gold-shimmer {
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

// ─── IMAGE MAP ─── Real product image URLs (Unsplash/CDN fallbacks) ──
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

// ─── ACCESSORIES DATABASE ─────────────────────────────────────────

const ACC_DB = {
  nexon: [
    { id: 1,  name: "3D Floor Mats",        cat: "interior",  price: "₹3,736",       tag: "Essential",   imgKey: "3d_floor_mats",     desc: "Custom-fit 3D moulded floor mats for complete cabin protection from dust and spills." },
    { id: 2,  name: "Mud Flaps",             cat: "exterior",  price: "₹759",         tag: "Must Have",   imgKey: "mud_flaps",          desc: "Heavy-duty mud flaps protecting underbody and bodywork from road debris and splashes." },
    { id: 3,  name: "Body Cover",            cat: "care",      price: "₹2,441",       tag: "Essential",   imgKey: "body_cover",         desc: "All-weather body cover with UV protection, dust resistance and soft inner lining." },
    { id: 4,  name: "LED Fog Lamps",         cat: "exterior",  price: "₹8,225",       tag: "Recommended", imgKey: "led_fog_lamps",      desc: "Bright LED fog lamps for improved visibility in rain, fog and low-light conditions." },
    { id: 5,  name: "Alloy Wheels (16\")",   cat: "exterior",  price: "₹9,035/pc",    tag: "Upgrade",     imgKey: "alloy_wheels",       desc: "16-inch premium alloy wheels with diamond-cut finish for an enhanced sporty look." },
    { id: 6,  name: "Seat Covers",           cat: "interior",  price: "₹7,811",       tag: "Comfort",     imgKey: "seat_covers",        desc: "Premium leatherette seat covers with custom fit and reinforced airbag-compatible stitching." },
    { id: 7,  name: "Door Visor (Chrome)",   cat: "exterior",  price: "₹3,027",       tag: "Popular",     imgKey: "door_visor",         desc: "Chrome-inset door visors allowing ventilation while blocking rain and dust entry." },
    { id: 8,  name: "Pop-Up Sunroof",        cat: "interior",  price: "₹17,025",      tag: "Premium",     imgKey: "sunroof",            desc: "Tiltable pop-up sunroof adding openness to the cabin — ideal for lower variants." },
    { id: 9,  name: "App-Based TPMS",        cat: "safety",    price: "₹8,079",       tag: "Safety",      imgKey: "tpms",               desc: "Tyre pressure monitoring system with real-time alerts via a dedicated smartphone app." },
    { id: 10, name: "Reverse Camera",        cat: "safety",    price: "₹5,858",       tag: "Safety",      imgKey: "reverse_camera",     desc: "HD reverse camera with TFT display for confident and safe reversing manoeuvres." },
    { id: 11, name: "Digital Video Recorder",cat: "safety",    price: "₹9,099",       tag: "Security",    imgKey: "dvr",                desc: "Loop-recording dash cam with G-sensor incident detection and night vision capability." },
    { id: 12, name: "Mood Lighting",         cat: "comfort",   price: "₹5,836",       tag: "Ambience",    imgKey: "mood_lighting",      desc: "Multicolour LED ambient mood lighting for a premium cabin feel at night." },
    { id: 13, name: "Window Sunshades",      cat: "comfort",   price: "₹2,945",       tag: "Cool Cabin",  imgKey: "sunshades",          desc: "Magnetic sunshades for rear windows, blocking UV rays and keeping the cabin cool." },
    { id: 14, name: "Trunk Mat (3D)",        cat: "interior",  price: "₹3,433",       tag: "Useful",      imgKey: "trunk_mat",          desc: "Precisely moulded 3D boot mat protecting the luggage area from scratches and spills." },
    { id: 15, name: "Vehicle Tracker",       cat: "safety",    price: "₹6,564",       tag: "Security",    imgKey: "gps_tracker",        desc: "GPS-based vehicle tracking device for real-time location monitoring and security." },
    { id: 16, name: "Neck Rest Cushions",    cat: "comfort",   price: "₹846–₹1,593",  tag: "Comfort",     imgKey: "neck_rest",          desc: "Ergonomic neck rest pillows for long drives, reducing fatigue and neck strain." },
    { id: 17, name: "Front Parking Sensors", cat: "safety",    price: "₹3,636",       tag: "Safety",      imgKey: "parking_sensors",    desc: "Ultrasonic front parking sensors with audio-visual alerts for tight parking spots." },
    { id: 18, name: "Roof Rail",             cat: "lifestyle", price: "₹6,999",       tag: "Adventure",   imgKey: "roof_rails",         desc: "Sturdy roof rails for mounting a carrier or cycle rack for outdoor adventures." },
    { id: 19, name: "Air Purifier",          cat: "comfort",   price: "₹5,857",       tag: "Health",      imgKey: "air_purifier",       desc: "In-cabin HEPA air purifier eliminating pollutants, allergens and bad odour." },
    { id: 20, name: "Bumper Corner Guards",  cat: "exterior",  price: "₹950/pc",      tag: "Protection",  imgKey: "bumper_guard",       desc: "Flexible corner protectors absorbing minor bumps and preventing paint chips." },
  ],

  harrier: [
    { id: 1,  name: "3D Floor Mats",          cat: "interior",  price: "₹4,199",          tag: "Essential",  imgKey: "3d_floor_mats",    desc: "Deep-dish 3D floor mats offering maximum protection for the Harrier's premium cabin." },
    { id: 2,  name: "Body Cover",             cat: "care",      price: "₹3,799",          tag: "Essential",  imgKey: "body_cover",        desc: "Custom-fit all-weather body cover with breathable fabric and UV-resistant coating." },
    { id: 3,  name: "Mud Flaps",              cat: "exterior",  price: "₹1,018",          tag: "Must Have",  imgKey: "mud_flaps",         desc: "Robust rear mud flaps preventing stone chips and road splashes on bodywork." },
    { id: 4,  name: "Seat Covers",            cat: "interior",  price: "₹10,101–₹11,445", tag: "Premium",    imgKey: "seat_covers",       desc: "Premium leatherette seat covers with custom stitching and side-airbag compatibility." },
    { id: 5,  name: "17\" Alloy Wheel",       cat: "exterior",  price: "₹14,999/pc",      tag: "Upgrade",    imgKey: "alloy_wheels",      desc: "17-inch premium alloy wheels with a sophisticated finish for the Harrier's bold stance." },
    { id: 6,  name: "Auto-Dimming IRVM",      cat: "interior",  price: "₹8,299",          tag: "Smart",      imgKey: "auto_dimming_irvm", desc: "Auto-dimming interior rear-view mirror that reduces glare from following headlights." },
    { id: 7,  name: "App-Based TPMS",         cat: "safety",    price: "₹8,099",          tag: "Safety",     imgKey: "tpms",              desc: "Smartphone-connected tyre pressure monitor with real-time alerts for all four tyres." },
    { id: 8,  name: "Front Parking Sensors",  cat: "safety",    price: "₹3,699",          tag: "Safety",     imgKey: "parking_sensors",   desc: "Front ultrasonic sensors with audible beep proximity alert for urban parking." },
    { id: 9,  name: "Sidestep",               cat: "exterior",  price: "₹18,597",         tag: "Utility",    imgKey: "sidestep",          desc: "Stainless steel side steps making it easier to board the tall Harrier SUV." },
    { id: 10, name: "7D Floor Mats",          cat: "interior",  price: "₹7,999",          tag: "Premium",    imgKey: "3d_floor_mats",     desc: "7-layer premium floor mats with raised edges and anti-slip backing for superior coverage." },
    { id: 11, name: "3D Trunk Mat",           cat: "interior",  price: "₹3,889",          tag: "Useful",     imgKey: "trunk_mat",         desc: "Precisely moulded boot liner protecting the Harrier's large luggage bay." },
    { id: 12, name: "Puddle Lamps",           cat: "exterior",  price: "₹4,480",          tag: "Style",      imgKey: "puddle_lamps",      desc: "ORVM-mounted puddle lamps projecting the Tata logo on the ground when opening doors." },
    { id: 13, name: "Roof Rail",              cat: "lifestyle", price: "₹9,364",          tag: "Adventure",  imgKey: "roof_rails",        desc: "Integrated roof rails for mounting cycle carriers, roof boxes or extra luggage." },
    { id: 14, name: "Chrome Door Handle",     cat: "exterior",  price: "₹1,999",          tag: "Style",      imgKey: "chrome_garnish",    desc: "Chrome door handle garnishes adding elegance to the Harrier's exterior profile." },
    { id: 15, name: "ORVM Chrome Garnish",    cat: "exterior",  price: "₹1,999",          tag: "Style",      imgKey: "chrome_garnish",    desc: "Chrome wing mirror garnishes for a premium, finished exterior look." },
    { id: 16, name: "Window Chrome Kit",      cat: "exterior",  price: "₹4,499",          tag: "Style",      imgKey: "chrome_garnish",    desc: "Full window chrome garnish kit accenting all windows for a premium appearance." },
    { id: 17, name: "Rear Bumper Chrome",     cat: "exterior",  price: "₹2,499",          tag: "Style",      imgKey: "bumper_guard",      desc: "Chrome lower rear bumper garnish complementing the Harrier's muscular rear design." },
    { id: 18, name: "Roof Graphics",          cat: "exterior",  price: "₹8,679",          tag: "Bold",       imgKey: "spoiler",           desc: "Tri-arrow graphic decal on the roof for a distinctive, sporty premium look." },
  ],

  safari: [
    { id: 1,  name: "Door Edge Guard",        cat: "exterior",  price: "₹469",         tag: "Must Have",  imgKey: "bumper_guard",    desc: "Flexible rubber door edge protectors preventing dings and scratches in car parks." },
    { id: 2,  name: "3D Carpets",             cat: "interior",  price: "₹2,999",       tag: "Essential",  imgKey: "3d_floor_mats",   desc: "Premium 3D moulded carpets for a complete floor coverage in the Safari's large cabin." },
    { id: 3,  name: "Car Cover",              cat: "care",      price: "₹3,555",       tag: "Essential",  imgKey: "body_cover",      desc: "Full-body custom car cover with UV protection and water-resistant outer layer." },
    { id: 4,  name: "Mud Flaps",              cat: "exterior",  price: "₹1,050",       tag: "Must Have",  imgKey: "mud_flaps",       desc: "Heavy-duty mud flaps for the Safari's large wheel arches, protecting bodywork." },
    { id: 5,  name: "Front Parking Sensors",  cat: "safety",    price: "₹3,636",       tag: "Safety",     imgKey: "parking_sensors", desc: "Front ultrasonic parking sensors essential for the Safari's long bonnet." },
    { id: 6,  name: "TPMS",                   cat: "safety",    price: "₹8,079",       tag: "Safety",     imgKey: "tpms",            desc: "Tyre pressure monitoring system providing real-time pressure data for all 4 tyres." },
    { id: 7,  name: "Tyre Inflator",          cat: "care",      price: "₹2,566",       tag: "Utility",    imgKey: "tyre_inflator",   desc: "12V compact tyre inflator for roadside emergencies and pressure top-ups." },
    { id: 8,  name: "Puncture Repair Kit",    cat: "care",      price: "₹799",         tag: "Safety",     imgKey: "puncture_kit",    desc: "Compact puncture repair kit for on-the-road tyre emergencies without a spare." },
    { id: 9,  name: "17\" Alloy Wheel",       cat: "exterior",  price: "₹13,699/pc",   tag: "Upgrade",    imgKey: "alloy_wheels",    desc: "17-inch premium alloy wheels enhancing the flagship Safari's commanding road presence." },
    { id: 10, name: "Sunshades",              cat: "comfort",   price: "₹4,480",       tag: "Comfort",    imgKey: "sunshades",       desc: "Magnetic window sunshades for all rear windows, reducing cabin heat and UV exposure." },
    { id: 11, name: "Cycle Carrier",          cat: "lifestyle", price: "₹13,969",      tag: "Adventure",  imgKey: "cycle_carrier",   desc: "Roof-mounted cycle carrier supporting adventure rides — fits up to 2 bicycles." },
    { id: 12, name: "Front Bumper Chrome",    cat: "exterior",  price: "₹1,994",       tag: "Style",      imgKey: "chrome_garnish",  desc: "Front bumper chrome garnish adding a premium, polished look to the Safari's face." },
    { id: 13, name: "Door Handle Garnish",    cat: "exterior",  price: "₹1,819",       tag: "Style",      imgKey: "chrome_garnish",  desc: "Refined chrome door handle garnishes elevating the Safari's upscale aesthetic." },
    { id: 14, name: "Bonnet Mascot",          cat: "exterior",  price: "₹481",         tag: "Style",      imgKey: "bumper_guard",    desc: "Classic bonnet mascot adding a signature touch of distinction to the Safari's hood." },
    { id: 15, name: "Seat Covers",            cat: "interior",  price: "₹10,500+",     tag: "Premium",    imgKey: "seat_covers",     desc: "7-seater premium seat covers with airbag-safe stitching and leatherette finish." },
    { id: 16, name: "Roof Rails",             cat: "lifestyle", price: "₹9,500+",      tag: "Adventure",  imgKey: "roof_rails",      desc: "Factory-style roof rails for mounting luggage carriers, roof tents, or kayak holders." },
  ],

  punch: [
    { id: 1,  name: "3D Floor Mats",         cat: "interior",  price: "₹3,199",       tag: "Essential",  imgKey: "3d_floor_mats",   desc: "Custom-fit 3D rubber mats protecting Punch's cabin from mud, water and dust." },
    { id: 2,  name: "Car Cover",             cat: "care",      price: "₹2,100",       tag: "Essential",  imgKey: "body_cover",      desc: "All-weather car cover protecting the Punch from dust, sun and light rain." },
    { id: 3,  name: "Mud Flaps",             cat: "exterior",  price: "₹625",         tag: "Must Have",  imgKey: "mud_flaps",       desc: "Lightweight ABS mud flaps preventing road splash on the Punch's lower body." },
    { id: 4,  name: "Door Edge Guard",       cat: "exterior",  price: "₹295",         tag: "Must Have",  imgKey: "bumper_guard",    desc: "Chrome-finish flexible door edge guards protecting against parking lot dings." },
    { id: 5,  name: "Seat Covers",          cat: "interior",  price: "₹7,699–₹7,824",tag: "Comfort",    imgKey: "seat_covers",     desc: "Tailored leatherette seat covers with sporty stitching to complement the Punch's character." },
    { id: 6,  name: "Door Visor",            cat: "exterior",  price: "₹1,999",       tag: "Popular",    imgKey: "door_visor",      desc: "Slim door visors allowing fresh air in while keeping rain out." },
    { id: 7,  name: "16\" Alloy Wheels",     cat: "exterior",  price: "₹9,977/pc",    tag: "Upgrade",    imgKey: "alloy_wheels",    desc: "16-inch alloy wheels giving the Punch a more premium, sporty road stance." },
    { id: 8,  name: "Auto-Dimming IRVM",     cat: "interior",  price: "₹7,999",       tag: "Smart",      imgKey: "auto_dimming_irvm",desc: "Glare-reducing auto-dimming rear-view mirror for night driving comfort." },
    { id: 9,  name: "App-Based TPMS",        cat: "safety",    price: "₹8,079",       tag: "Safety",     imgKey: "tpms",            desc: "Wireless tyre pressure monitor with smartphone alerts before a tyre fails." },
    { id: 10, name: "Front Parking Sensors", cat: "safety",    price: "₹3,636",       tag: "Safety",     imgKey: "parking_sensors", desc: "Ultrasonic front sensors helping navigate tight city parking in the compact Punch." },
    { id: 11, name: "Wireless Charger",      cat: "comfort",   price: "₹3,532",       tag: "Tech",       imgKey: "wireless_charger",desc: "Wireless phone charger with mobile holder — adds modern tech to base variants." },
    { id: 12, name: "Air Purifier",          cat: "comfort",   price: "₹6,606",       tag: "Health",     imgKey: "air_purifier",    desc: "HEPA-grade cabin air purifier removing PM2.5 particles, allergens and odours." },
    { id: 13, name: "Magnetic Sunshades",    cat: "comfort",   price: "₹2,727",       tag: "Cool Cabin", imgKey: "sunshades",       desc: "Easy-attach magnetic rear window sunshades reducing cabin heat and UV radiation." },
    { id: 14, name: "Scuff Plates (4pc)",    cat: "interior",  price: "₹1,212",       tag: "Style",      imgKey: "scuff_plates",    desc: "Brushed steel scuff plates on all 4 door sills protecting from entry scratches." },
    { id: 15, name: "Roof Rails (Black)",    cat: "lifestyle", price: "₹5,578",       tag: "Adventure",  imgKey: "roof_rails",      desc: "Sleek matte black roof rails for adventure-ready Punch owners with luggage needs." },
    { id: 16, name: "Front Skid Plate",      cat: "exterior",  price: "₹3,262",       tag: "Off-Road",   imgKey: "skid_plate",      desc: "Front underbody skid plate giving the Punch a rugged, adventure-ready look." },
    { id: 17, name: "Rear Skid Plate",       cat: "exterior",  price: "₹3,120",       tag: "Off-Road",   imgKey: "skid_plate",      desc: "Rear underbody guard completing the Punch's adventure-SUV styling." },
    { id: 18, name: "Spoiler (Black)",       cat: "exterior",  price: "₹5,346",       tag: "Sporty",     imgKey: "spoiler",         desc: "Matte black roof spoiler adding aerodynamic styling to the Punch's silhouette." },
  ],

  altroz: [
    { id: 1,  name: "Floor Mats",             cat: "interior", price: "₹988–₹6,820",  tag: "Essential",  imgKey: "3d_floor_mats",   desc: "Range from standard to 3D precision mats, protecting Altroz's premium cabin floor." },
    { id: 2,  name: "Mud Flaps",              cat: "exterior", price: "₹729",          tag: "Must Have",  imgKey: "mud_flaps",       desc: "Custom-fit ABS mud flaps protecting doors and arches from road splash." },
    { id: 3,  name: "Tyre Repair Kit",        cat: "care",     price: "₹3,199",        tag: "Safety",     imgKey: "puncture_kit",    desc: "Quick sealant-based tyre repair kit — essential since Altroz has no spare tyre." },
    { id: 4,  name: "Seat Covers",            cat: "interior", price: "₹6,955–₹7,759", tag: "Comfort",    imgKey: "seat_covers",     desc: "Tailored leatherette seat covers complementing the Altroz's premium interior design." },
    { id: 5,  name: "Alloy Wheels",           cat: "exterior", price: "₹10,999/pc",    tag: "Upgrade",    imgKey: "alloy_wheels",    desc: "Premium alloy wheels upgrading base Altroz variants to a sportier, premium look." },
    { id: 6,  name: "Reverse Camera + Display",cat:"safety",   price: "₹5,858",        tag: "Safety",     imgKey: "reverse_camera",  desc: "Rear HD camera with dedicated TFT monitor for confident reversing." },
    { id: 7,  name: "TPMS",                   cat: "safety",   price: "₹8,079",        tag: "Safety",     imgKey: "tpms",            desc: "Tyre pressure monitoring with app alerts — important for safe highway driving." },
    { id: 8,  name: "Dash Cam",               cat: "safety",   price: "₹8,299",        tag: "Security",   imgKey: "dvr",             desc: "Full HD front dash camera with loop recording and collision detection G-sensor." },
    { id: 9,  name: "Vehicle Tracker",        cat: "safety",   price: "₹6,564",        tag: "Security",   imgKey: "gps_tracker",     desc: "GPS tracking device providing real-time Altroz location via mobile app." },
    { id: 10, name: "Air Purifier",           cat: "comfort",  price: "₹6,606",        tag: "Health",     imgKey: "air_purifier",    desc: "Portable cabin air purifier effective against pollutants, dust and allergens." },
    { id: 11, name: "Parcel Tray",            cat: "interior", price: "₹1,747",        tag: "Useful",     imgKey: "trunk_mat",       desc: "Rear parcel tray providing concealed storage above the boot space." },
    { id: 12, name: "Music System",           cat: "comfort",  price: "₹26,479–₹27,930",tag:"Tech",       imgKey: "music_system",    desc: "Upgraded infotainment head unit with CarPlay, Android Auto and improved audio." },
    { id: 13, name: "Wireless Charger",       cat: "comfort",  price: "₹3,532",        tag: "Tech",       imgKey: "wireless_charger",desc: "Wireless charging pad with mobile holder for cable-free smartphone charging." },
    { id: 14, name: "Illuminated Scuff Plates",cat:"interior", price: "₹2,988",        tag: "Style",      imgKey: "scuff_plates",    desc: "LED-illuminated door sill plates adding ambience and protecting door entries." },
    { id: 15, name: "Chrome Accessories",     cat: "exterior", price: "₹532–₹3,029",   tag: "Style",      imgKey: "chrome_garnish",  desc: "Range of chrome garnishes for bumpers, window frames, and door handles." },
    { id: 16, name: "Sunshades",              cat: "comfort",  price: "₹2,500+",       tag: "Cool Cabin", imgKey: "sunshades",       desc: "Magnetic rear sunshades keeping Altroz's cabin cool and reducing UV exposure." },
  ],

  tiago: [
    { id: 1,  name: "Floor Mats",            cat: "interior", price: "₹1,829",   tag: "Essential",  imgKey: "3d_floor_mats",    desc: "Custom-fit floor mats protecting the Tiago's cabin from daily wear and spills." },
    { id: 2,  name: "Mud Flaps",             cat: "exterior", price: "₹699",     tag: "Must Have",  imgKey: "mud_flaps",        desc: "ABS mud flaps for Tiago shielding doors and body from road splash and grit." },
    { id: 3,  name: "Car Cover",             cat: "care",     price: "₹2,099",   tag: "Essential",  imgKey: "body_cover",       desc: "Lightweight all-weather cover protecting the Tiago outdoors overnight." },
    { id: 4,  name: "Front Armrest",         cat: "comfort",  price: "₹5,641",   tag: "Recommended",imgKey: "armrest",           desc: "Central front armrest with storage — adds a comfort feature missing in base variants." },
    { id: 5,  name: "Seat Covers",           cat: "interior", price: "₹7,750",   tag: "Comfort",    imgKey: "seat_covers",      desc: "Leatherette seat covers with cushioned stitching, upgrading Tiago's interior feel." },
    { id: 6,  name: "14\" Alloy Wheels",     cat: "exterior", price: "₹6,999–₹7,999/pc",tag:"Upgrade",imgKey:"alloy_wheels",   desc: "14/15-inch alloy wheels transforming the base Tiago's look with premium styling." },
    { id: 7,  name: "Door Visor",            cat: "exterior", price: "₹2,799",   tag: "Popular",    imgKey: "door_visor",       desc: "Chrome door visors allowing ventilation and keeping rain out of the cabin." },
    { id: 8,  name: "App-Based TPMS",        cat: "safety",   price: "₹8,079",   tag: "Safety",     imgKey: "tpms",             desc: "Tyre pressure monitoring with real-time smartphone alerts for safe driving." },
    { id: 9,  name: "Magnetic Sunshades",    cat: "comfort",  price: "₹3,635",   tag: "Comfort",    imgKey: "sunshades",        desc: "Easy-fit magnetic window sunshades reducing rear cabin heat and UV glare." },
    { id: 10, name: "Air Purifier",          cat: "comfort",  price: "₹6,606",   tag: "Health",     imgKey: "air_purifier",     desc: "HEPA cabin air purifier removing pollutants and allergens from city air." },
    { id: 11, name: "Parcel Tray",           cat: "interior", price: "₹1,399",   tag: "Useful",     imgKey: "trunk_mat",        desc: "Rear parcel shelf providing hidden boot storage and a clean interior look." },
    { id: 12, name: "Bumper Corner Guards",  cat: "exterior", price: "₹1,615",   tag: "Protection", imgKey: "bumper_guard",     desc: "Chrome-tipped corner protectors absorbing minor bumps in city parking." },
    { id: 13, name: "Illuminated Scuff Plates",cat:"interior",price: "₹2,999",   tag: "Style",      imgKey: "scuff_plates",     desc: "LED-lit door sill scuff plates adding a premium ambience when entering the car." },
    { id: 14, name: "Roof Rails",            cat: "lifestyle",price: "₹5,999",   tag: "Utility",    imgKey: "roof_rails",       desc: "Roof rails expanding Tiago's utility for weekend luggage carriers or cycle racks." },
    { id: 15, name: "ORVM Garnish",          cat: "exterior", price: "₹1,799–₹1,899",tag:"Style",   imgKey: "chrome_garnish",   desc: "Wing mirror chrome garnish giving the Tiago's exterior a more polished look." },
    { id: 16, name: "Body Side Moulding",    cat: "exterior", price: "₹2,799",   tag: "Style",      imgKey: "bumper_guard",     desc: "Side body moulding strips protecting door edges from parking dings." },
  ],

  curvv: [
    { id: 1,  name: "3D Floor Mats",          cat: "interior", price: "₹6,999",  tag: "Essential",  imgKey: "3d_floor_mats",   desc: "Precisely fitted 3D floor mats for the Curvv's sporty, coupe-style cabin." },
    { id: 2,  name: "7D Floor Mats",          cat: "interior", price: "₹7,499",  tag: "Premium",    imgKey: "3d_floor_mats",   desc: "7-layer premium floor mats with maximum cabin coverage and raised edge design." },
    { id: 3,  name: "Mud Flaps",              cat: "exterior", price: "₹899+",   tag: "Must Have",  imgKey: "mud_flaps",       desc: "Custom ABS mud flaps for Curvv's wide wheel arches — essential protection." },
    { id: 4,  name: "17\" Alloy Wheels",      cat: "exterior", price: "₹13,999/pc",tag:"Upgrade",   imgKey: "alloy_wheels",    desc: "17-inch piano black alloy wheels amplifying the Curvv's coupe-SUV character." },
    { id: 5,  name: "Body Cover",             cat: "care",     price: "₹2,500+", tag: "Essential",  imgKey: "body_cover",      desc: "Custom contoured body cover following the Curvv's sloping coupe roofline." },
    { id: 6,  name: "Door Visor (Chrome)",    cat: "exterior", price: "₹1,400+", tag: "Popular",    imgKey: "door_visor",      desc: "Chrome-line door visors allowing rain-free ventilation for the Curvv." },
    { id: 7,  name: "DVR Advanced",           cat: "safety",   price: "₹27,999", tag: "Premium",    imgKey: "dvr",             desc: "Advanced front & rear dual-channel 4K dash cam with cloud connectivity." },
    { id: 8,  name: "Dash Cam (F+R)",         cat: "safety",   price: "₹14,399", tag: "Security",   imgKey: "dvr",             desc: "Full HD front and rear dual-channel dash camera with night vision and G-sensor." },
    { id: 9,  name: "Vehicle Tracker",        cat: "safety",   price: "₹6,599",  tag: "Security",   imgKey: "gps_tracker",     desc: "GPS vehicle tracking device with real-time alerts and geofencing capability." },
    { id: 10, name: "Ambient Mood Lighting",  cat: "comfort",  price: "₹5,836",  tag: "Ambience",   imgKey: "mood_lighting",   desc: "Multicolour LED ambient lighting enhancing the Curvv's already premium night cabin." },
    { id: 11, name: "Wireless Charger",       cat: "comfort",  price: "₹3,532",  tag: "Tech",       imgKey: "wireless_charger",desc: "Qi wireless charger with phone cradle for cable-free charging on the move." },
    { id: 12, name: "JBL Speakers",           cat: "comfort",  price: "Market Price",tag:"Audio",   imgKey: "music_system",    desc: "Genuine JBL speaker upgrade delivering superior audio quality to the Curvv's cabin." },
    { id: 13, name: "Roof Rails",             cat: "lifestyle",price: "₹6,000+", tag: "Utility",    imgKey: "roof_rails",      desc: "Roof rails for the Curvv enabling luggage or cycle carriers for weekend trips." },
    { id: 14, name: "Cycle Carrier",          cat: "lifestyle",price: "₹13,969+",tag: "Adventure",  imgKey: "cycle_carrier",   desc: "Roof-mounted cycle carrier — compatible with the Curvv's roof rail system." },
    { id: 15, name: "Ceramic Coating Kit",    cat: "care",     price: "₹17,999", tag: "Premium",    imgKey: "ceramic_coating", desc: "Essential 3D ceramic coating kit providing long-lasting gloss and paint protection." },
    { id: 16, name: "Puncture Repair Kit",    cat: "care",     price: "₹2,727",  tag: "Safety",     imgKey: "puncture_kit",    desc: "Compact puncture sealant kit for on-the-go tyre emergencies." },
    { id: 17, name: "Parcel Tray",            cat: "interior", price: "₹3,399",  tag: "Useful",     imgKey: "trunk_mat",       desc: "Boot parcel shelf providing covered storage — essential for the Curvv's frameless boot." },
    { id: 18, name: "Neck Rest Pillows",      cat: "comfort",  price: "₹1,500+", tag: "Comfort",    imgKey: "neck_rest",       desc: "Ergonomic leather neck rests for the Curvv's sports seats during long drives." },
  ],

  tigor: [
    { id: 1,  name: "3D Floor Mats",          cat: "interior", price: "₹3,500+", tag: "Essential",  imgKey: "3d_floor_mats",  desc: "Custom 3D moulded mats protecting the Tigor's sedan cabin from daily grime." },
    { id: 2,  name: "Car Cover",              cat: "care",     price: "₹2,000+", tag: "Essential",  imgKey: "body_cover",     desc: "Sedan-fit body cover protecting the Tigor's smart silhouette from elements." },
    { id: 3,  name: "Mud Flaps",              cat: "exterior", price: "₹700+",   tag: "Must Have",  imgKey: "mud_flaps",      desc: "ABS mud flaps protecting the Tigor's body from road splash and stone chips." },
    { id: 4,  name: "Seat Covers",            cat: "interior", price: "₹7,000+", tag: "Comfort",    imgKey: "seat_covers",    desc: "Premium leatherette seat covers with airbag-compatible design for the Tigor." },
    { id: 5,  name: "Door Visor",             cat: "exterior", price: "₹2,500+", tag: "Popular",    imgKey: "door_visor",     desc: "Chrome door visors enabling fresh air ventilation while keeping out rain." },
    { id: 6,  name: "Body Side Moulding",     cat: "exterior", price: "₹2,800+", tag: "Protection", imgKey: "bumper_guard",   desc: "Side door moulding strips protecting the Tigor's body from car park dings." },
    { id: 7,  name: "Alloy Wheels",           cat: "exterior", price: "₹7,000+/pc",tag:"Upgrade",   imgKey: "alloy_wheels",   desc: "Premium alloy wheels upgrading base Tigor variants for a more dynamic look." },
    { id: 8,  name: "Reverse Camera",         cat: "safety",   price: "₹5,858",  tag: "Safety",     imgKey: "reverse_camera", desc: "HD reverse camera with TFT display for safe parking manoeuvres." },
    { id: 9,  name: "TPMS",                   cat: "safety",   price: "₹8,079",  tag: "Safety",     imgKey: "tpms",           desc: "Tyre pressure monitoring with real-time alerts ensuring safe journeys." },
    { id: 10, name: "Vehicle Tracker",        cat: "safety",   price: "₹6,564",  tag: "Security",   imgKey: "gps_tracker",    desc: "GPS tracker providing real-time Tigor location for security and fleet monitoring." },
    { id: 11, name: "Window Sunshades",       cat: "comfort",  price: "₹2,500+", tag: "Comfort",    imgKey: "sunshades",      desc: "Rear window sunshades keeping Tigor's sedan cabin cool on sunny days." },
    { id: 12, name: "Illuminated Scuff Plates",cat:"interior", price: "₹2,500+", tag: "Style",      imgKey: "scuff_plates",   desc: "Lit door sill protectors adding a premium entry-level touch to the Tigor." },
    { id: 13, name: "Steering Cover",         cat: "interior", price: "₹649+",   tag: "Comfort",    imgKey: "steering_cover", desc: "Leather-wrap steering cover improving grip and cabin aesthetics." },
    { id: 14, name: "Parcel Tray",            cat: "interior", price: "₹1,400+", tag: "Useful",     imgKey: "trunk_mat",      desc: "Rear parcel shelf for concealed boot storage in the Tigor's boot area." },
    { id: 15, name: "Air Purifier",           cat: "comfort",  price: "₹6,606",  tag: "Health",     imgKey: "air_purifier",   desc: "Compact cabin air purifier — excellent for the Tigor's sealed sedan environment." },
    { id: 16, name: "Front Armrest",          cat: "comfort",  price: "₹5,000+", tag: "Comfort",    imgKey: "armrest",        desc: "Central armrest adding comfort missing in lower Tigor variants on long drives." },
  ],

  sierra: [
    { id: 1,  name: "Roof Rack",             cat: "lifestyle",price: "₹26,999", tag: "Adventure",  imgKey: "roof_rack",      desc: "Full roof rack system for the Sierra — designed for overlanding and adventure use." },
    { id: 2,  name: "Ladder",                cat: "lifestyle",price: "₹17,499", tag: "Adventure",  imgKey: "ladder",         desc: "Rear-mounted access ladder for the Sierra's roof rack — essential for off-roaders." },
    { id: 3,  name: "Front Skid Plate",      cat: "exterior", price: "₹7,999",  tag: "Off-Road",   imgKey: "skid_plate",     desc: "Heavy-duty front underbody skid plate protecting vital components on trails." },
    { id: 4,  name: "Rear Skid Plate",       cat: "exterior", price: "₹6,499",  tag: "Off-Road",   imgKey: "skid_plate",     desc: "Rear underbody guard completing the Sierra's adventure-ready protection." },
    { id: 5,  name: "Side Step",             cat: "exterior", price: "₹13,999", tag: "Utility",    imgKey: "sidestep",       desc: "Premium side steps making it easy to board the Sierra's tall, rugged stance." },
    { id: 6,  name: "Mud Flaps",             cat: "exterior", price: "₹899",    tag: "Must Have",  imgKey: "mud_flaps",      desc: "Large ABS mud flaps protecting the Sierra's wide body on muddy trails." },
    { id: 7,  name: "3D Floor Mats + Trunk", cat: "interior", price: "₹6,999",  tag: "Essential",  imgKey: "3d_floor_mats",  desc: "Complete 3D floor mat set including boot liner — essential for adventure use." },
    { id: 8,  name: "7D Floor Mats + Trunk", cat: "interior", price: "₹8,999+", tag: "Premium",    imgKey: "3d_floor_mats",  desc: "7-layer premium full coverage mats protecting the Sierra's entire floor area." },
    { id: 9,  name: "Body Cover",            cat: "care",     price: "₹2,699",  tag: "Essential",  imgKey: "body_cover",     desc: "Custom-fit Sierra body cover with sun and water protection for outdoor parking." },
    { id: 10, name: "Wheel Arch Cladding",   cat: "exterior", price: "₹5,499",  tag: "Style",      imgKey: "skid_plate",     desc: "Bold wheel arch cladding reinforcing the Sierra's rugged SUV visual identity." },
    { id: 11, name: "Front Grille Add-On",   cat: "exterior", price: "₹8,999",  tag: "Style",      imgKey: "bumper_guard",   desc: "Bold grille overlay giving the Sierra an even more commanding front face." },
    { id: 12, name: "Door Visor (Chrome)",   cat: "exterior", price: "₹3,999",  tag: "Popular",    imgKey: "door_visor",     desc: "Chrome-inset door visors for the Sierra — stylish and functional ventilation." },
    { id: 13, name: "Roof Rail",             cat: "lifestyle",price: "₹6,199",  tag: "Adventure",  imgKey: "roof_rails",     desc: "Integrated roof rails as a base for roof rack, cycle carrier or roof box." },
    { id: 14, name: "Window Chrome Garnish", cat: "exterior", price: "₹4,999",  tag: "Style",      imgKey: "chrome_garnish", desc: "Window belt-line chrome garnish giving the Sierra a premium exterior finish." },
    { id: 15, name: "Front Bug Deflector",   cat: "exterior", price: "₹3,999",  tag: "Protection", imgKey: "bumper_guard",   desc: "Bonnet-mounted bug deflector protecting the Sierra's paintwork on highways." },
    { id: 16, name: "Tailgate Cladding",     cat: "exterior", price: "₹6,499",  tag: "Style",      imgKey: "bumper_guard",   desc: "Rear tailgate cladding panel reinforcing the Sierra's rugged lifestyle look." },
    { id: 17, name: "Body Side Chrome",      cat: "exterior", price: "₹2,499",  tag: "Style",      imgKey: "chrome_garnish", desc: "Chrome side body moulding balancing the Sierra's rugged character with refinement." },
    { id: 18, name: "Tail Light Chrome",     cat: "exterior", price: "₹2,999",  tag: "Style",      imgKey: "chrome_garnish", desc: "Chrome tail light surround garnish adding a premium finish to the Sierra's rear." },
  ],

  // ── EV MODELS ────────────────────────────────────────────────────
  nexon_ev: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", price: "₹3,736",   tag: "Essential",   imgKey: "ev_floor_mats",     desc: "Custom-fit EV-grade 3D floor mats for complete cabin protection." },
    { id: 2,  name: "Body Cover",              cat: "care",     price: "₹2,699",   tag: "Essential",   imgKey: "ev_body_cover",     desc: "All-weather EV body cover with soft lining and UV-resistant outer fabric." },
    { id: 3,  name: "Home Charging Unit (7.2kW)",cat:"ev",      price: "₹18,999",  tag: "EV Essential",imgKey: "home_charger_ev",   desc: "7.2kW AC wall-box home charger — full charge overnight. Includes installation." },
    { id: 4,  name: "Portable Charger (3.3kW)", cat: "ev",      price: "₹8,499",   tag: "EV Essential",imgKey: "portable_charger_ev",desc: "3.3kW portable AC charger for charging at any 15A socket while travelling." },
    { id: 5,  name: "Type-2 Charging Cable",   cat: "ev",       price: "₹3,999",   tag: "EV Accessory",imgKey: "charging_cable_ev",  desc: "32A Type-2 to Type-2 charging cable for public AC charging stations." },
    { id: 6,  name: "Battery Guard Cover",     cat: "ev",       price: "₹4,499",   tag: "EV Protection",imgKey:"battery_guard_ev",  desc: "Underbody battery protection guard reducing risk of damage on rough roads." },
    { id: 7,  name: "Alloy Wheels (16\")",     cat: "exterior", price: "₹9,035/pc",tag: "Upgrade",     imgKey: "ev_alloy_wheels",   desc: "Aero-optimised 16-inch alloy wheels improving range and aesthetics." },
    { id: 8,  name: "App-Based TPMS",          cat: "safety",   price: "₹8,079",   tag: "Safety",      imgKey: "ev_tpms",           desc: "Smart TPMS for accurate tyre monitoring — maintains EV range efficiency." },
    { id: 9,  name: "Seat Covers",             cat: "interior", price: "₹7,811",   tag: "Comfort",     imgKey: "seat_covers",       desc: "EV-compatible leatherette seat covers with airbag-safe stitching." },
    { id: 10, name: "Vehicle Tracker",         cat: "safety",   price: "₹6,564",   tag: "Security",    imgKey: "gps_tracker",       desc: "GPS tracker with EV-specific charge status monitoring and geofencing." },
    { id: 11, name: "Door Visor (Chrome)",     cat: "exterior", price: "₹3,027",   tag: "Popular",     imgKey: "door_visor",        desc: "Chrome door visors for the Nexon EV — style meets functionality." },
    { id: 12, name: "Mud Flaps",               cat: "exterior", price: "₹759",     tag: "Must Have",   imgKey: "mud_flaps",         desc: "EV-spec mud flaps protecting the Nexon EV's underbody and charge port area." },
    { id: 13, name: "Mood Lighting",           cat: "comfort",  price: "₹5,836",   tag: "Ambience",    imgKey: "mood_lighting",     desc: "Multicolour LED ambient lighting for a futuristic cabin feel at night." },
    { id: 14, name: "Wireless Charger",        cat: "comfort",  price: "₹3,532",   tag: "Tech",        imgKey: "wireless_charger",  desc: "Qi wireless phone charger with cradle — charges your phone as the EV charges." },
    { id: 15, name: "Air Purifier",            cat: "comfort",  price: "₹5,857",   tag: "Health",      imgKey: "air_purifier",      desc: "HEPA cabin air purifier for zero-emission, clean-air EV experience." },
    { id: 16, name: "Roof Rails",              cat: "lifestyle",price: "₹6,999",   tag: "Adventure",   imgKey: "roof_rails",        desc: "Roof rails for Nexon EV adventure trips with aero-optimised design." },
  ],

  punch_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior",price: "₹3,199",   tag: "Essential",   imgKey: "ev_floor_mats",    desc: "Custom EV-grade 3D rubber mats for the Punch EV's cabin." },
    { id: 2,  name: "Body Cover",               cat: "care",    price: "₹2,299",   tag: "Essential",   imgKey: "ev_body_cover",    desc: "All-weather cover tailored for the Punch EV's compact dimensions." },
    { id: 3,  name: "Home Charging Unit (3.3kW)",cat:"ev",      price: "₹12,999",  tag: "EV Essential",imgKey: "home_charger_ev",  desc: "3.3kW AC home wall charger for overnight Punch EV charging." },
    { id: 4,  name: "Portable Charger",         cat: "ev",      price: "₹5,999",   tag: "EV Essential",imgKey: "portable_charger_ev",desc: "Portable 3-pin EV charger for emergency top-ups on the go." },
    { id: 5,  name: "Type-2 Charging Cable",    cat: "ev",      price: "₹3,499",   tag: "EV Accessory",imgKey: "charging_cable_ev", desc: "16A Type-2 charging cable for public AC charging stations." },
    { id: 6,  name: "Battery Guard",            cat: "ev",      price: "₹3,999",   tag: "EV Protection",imgKey:"battery_guard_ev", desc: "Underbody battery guard for the Punch EV's accessible floor-mounted battery." },
    { id: 7,  name: "Alloy Wheels (15\")",      cat: "exterior",price: "₹7,999/pc",tag: "Upgrade",     imgKey: "ev_alloy_wheels",  desc: "Aero-blade 15-inch alloys improving range efficiency and looks." },
    { id: 8,  name: "TPMS",                     cat: "safety",  price: "₹8,079",   tag: "Safety",      imgKey: "ev_tpms",          desc: "Tyre pressure monitoring — proper inflation preserves Punch EV range." },
    { id: 9,  name: "Seat Covers",              cat: "interior",price: "₹7,699",   tag: "Comfort",     imgKey: "seat_covers",      desc: "Sporty leatherette seat covers designed for the Punch EV's interior." },
    { id: 10, name: "Wireless Charger",         cat: "comfort", price: "₹3,532",   tag: "Tech",        imgKey: "wireless_charger", desc: "Wireless charging pad — keeps your phone topped up in the EV cabin." },
    { id: 11, name: "Air Purifier",             cat: "comfort", price: "₹6,606",   tag: "Health",      imgKey: "air_purifier",     desc: "HEPA air purifier for a truly clean, zero-emission cabin environment." },
    { id: 12, name: "Mud Flaps",                cat: "exterior",price: "₹625",     tag: "Must Have",   imgKey: "mud_flaps",        desc: "ABS mud flaps protecting the Punch EV's underbody and charge port." },
    { id: 13, name: "Roof Rails (Black)",       cat: "lifestyle",price:"₹5,578",   tag: "Adventure",   imgKey: "roof_rails",       desc: "Matte black roof rails — adventure-ready for the Punch EV owner." },
    { id: 14, name: "Scuff Plates",             cat: "interior",price: "₹1,212",   tag: "Style",       imgKey: "scuff_plates",     desc: "Brushed steel door sill scuff plates protecting the Punch EV's entry." },
  ],

  tiago_ev: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", price: "₹2,500+",  tag: "Essential",   imgKey: "ev_floor_mats",    desc: "Tailored EV-grade floor mats for the Tiago EV's compact cabin." },
    { id: 2,  name: "Body Cover",              cat: "care",     price: "₹2,199",   tag: "Essential",   imgKey: "ev_body_cover",    desc: "All-weather cover protecting the Tiago EV from outdoor elements." },
    { id: 3,  name: "Home Charger (3.3kW)",    cat: "ev",       price: "₹11,999",  tag: "EV Essential",imgKey: "home_charger_ev",  desc: "3.3kW home wall charger — fully charges Tiago EV's 24kWh battery overnight." },
    { id: 4,  name: "Portable EV Charger",     cat: "ev",       price: "₹5,499",   tag: "EV Essential",imgKey: "portable_charger_ev",desc: "Portable 3-pin to EV plug charger for emergency top-ups anywhere." },
    { id: 5,  name: "Type-2 Cable (16A)",      cat: "ev",       price: "₹2,999",   tag: "EV Accessory",imgKey: "charging_cable_ev", desc: "Standard Type-2 charging cable for use at public AC charging stations." },
    { id: 6,  name: "Seat Covers",             cat: "interior", price: "₹7,500+",  tag: "Comfort",     imgKey: "seat_covers",      desc: "Leatherette seat covers giving the Tiago EV a premium interior upgrade." },
    { id: 7,  name: "TPMS",                    cat: "safety",   price: "₹8,079",   tag: "Safety",      imgKey: "ev_tpms",          desc: "Tyre pressure monitoring — critical for maximising Tiago EV's range." },
    { id: 8,  name: "Wireless Charger",        cat: "comfort",  price: "₹3,532",   tag: "Tech",        imgKey: "wireless_charger", desc: "Wireless phone charger for the Tiago EV's dashboard." },
    { id: 9,  name: "Air Purifier",            cat: "comfort",  price: "₹6,606",   tag: "Health",      imgKey: "air_purifier",     desc: "HEPA purifier for a genuinely clean EV driving experience." },
    { id: 10, name: "Mud Flaps",               cat: "exterior", price: "₹699",     tag: "Must Have",   imgKey: "mud_flaps",        desc: "EV-spec mud flaps for the Tiago EV's lower body and charge area." },
    { id: 11, name: "Alloy Wheels (14\")",     cat: "exterior", price: "₹6,999/pc",tag: "Upgrade",     imgKey: "ev_alloy_wheels",  desc: "Aero-optimised 14-inch alloys improving Tiago EV range and kerb appeal." },
    { id: 12, name: "Sunshades",               cat: "comfort",  price: "₹2,500+",  tag: "Cool Cabin",  imgKey: "sunshades",        desc: "Magnetic sunshades reducing cabin heat and preserving battery range." },
  ],

  tigor_ev: [
    { id: 1,  name: "3D Floor Mats",           cat: "interior", price: "₹3,000+",  tag: "Essential",   imgKey: "ev_floor_mats",    desc: "Custom EV-grade floor mats for the Tigor EV's sedan cabin." },
    { id: 2,  name: "Body Cover",              cat: "care",     price: "₹2,200+",  tag: "Essential",   imgKey: "ev_body_cover",    desc: "Sedan-fit all-weather cover protecting the Tigor EV from the elements." },
    { id: 3,  name: "Home Charger (7.2kW)",    cat: "ev",       price: "₹17,499",  tag: "EV Essential",imgKey: "home_charger_ev",  desc: "7.2kW AC wall-box home charger — charges Tigor EV battery in ~4 hours." },
    { id: 4,  name: "Portable Charger",        cat: "ev",       price: "₹7,499",   tag: "EV Essential",imgKey: "portable_charger_ev",desc: "3.3kW portable charger for the Tigor EV — essential for fleet operators." },
    { id: 5,  name: "Type-2 Cable",            cat: "ev",       price: "₹3,499",   tag: "EV Accessory",imgKey: "charging_cable_ev", desc: "32A Type-2 charging cable for AC public charging stations." },
    { id: 6,  name: "Battery Protection Guard",cat: "ev",       price: "₹4,200+",  tag: "EV Protection",imgKey:"battery_guard_ev", desc: "Underbody guard protecting the Tigor EV's battery on rough city roads." },
    { id: 7,  name: "TPMS",                    cat: "safety",   price: "₹8,079",   tag: "Safety",      imgKey: "ev_tpms",          desc: "Tyre pressure monitoring system preserving Tigor EV's optimal range." },
    { id: 8,  name: "Seat Covers",             cat: "interior", price: "₹7,000+",  tag: "Comfort",     imgKey: "seat_covers",      desc: "Premium leatherette seat covers for the Tigor EV's sedan interior." },
    { id: 9,  name: "Vehicle Tracker",         cat: "safety",   price: "₹6,564",   tag: "Security",    imgKey: "gps_tracker",      desc: "GPS tracker with charge-status integration — ideal for fleet Tigor EVs." },
    { id: 10, name: "Wireless Charger",        cat: "comfort",  price: "₹3,532",   tag: "Tech",        imgKey: "wireless_charger", desc: "Dashboard wireless charger keeping driver's phone powered up." },
    { id: 11, name: "Alloy Wheels",            cat: "exterior", price: "₹7,000+/pc",tag:"Upgrade",     imgKey: "ev_alloy_wheels",  desc: "Aero alloys improving Tigor EV's range and giving it a sportier stance." },
    { id: 12, name: "Air Purifier",            cat: "comfort",  price: "₹6,606",   tag: "Health",      imgKey: "air_purifier",     desc: "HEPA air purifier — perfect complement to the Tigor EV's zero-emission credentials." },
  ],

  curvv_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior", price: "₹6,999",  tag: "Essential",   imgKey: "ev_floor_mats",    desc: "Precision-fit EV floor mats for the Curvv EV's striking coupe-SUV cabin." },
    { id: 2,  name: "Body Cover",               cat: "care",     price: "₹3,000+", tag: "Essential",   imgKey: "ev_body_cover",    desc: "Contoured cover following the Curvv EV's sloping roofline." },
    { id: 3,  name: "Home Charger (7.2kW)",     cat: "ev",       price: "₹18,999", tag: "EV Essential",imgKey: "home_charger_ev",  desc: "7.2kW wall-box home charger — fully charges Curvv EV's 55kWh battery in ~8h." },
    { id: 4,  name: "Portable 3.3kW Charger",   cat: "ev",       price: "₹8,999",  tag: "EV Essential",imgKey: "portable_charger_ev",desc: "Portable 3.3kW AC charger for Curvv EV — ideal for travel emergencies." },
    { id: 5,  name: "CCS2 Fast Charge Cable",   cat: "ev",       price: "₹5,999",  tag: "EV Accessory",imgKey: "charging_cable_ev", desc: "CCS2 to Mode-3 cable for use at public DC fast-charging stations." },
    { id: 6,  name: "Battery Guard Cover",      cat: "ev",       price: "₹5,499",  tag: "EV Protection",imgKey:"battery_guard_ev", desc: "Reinforced underbody guard protecting Curvv EV's large floor-mounted battery." },
    { id: 7,  name: "18\" Aero Alloy Wheels",   cat: "exterior", price: "₹16,999/pc",tag:"Upgrade",    imgKey: "ev_alloy_wheels",  desc: "18-inch aerodynamic alloys reducing drag and maximising Curvv EV range." },
    { id: 8,  name: "Ambient Mood Lighting",    cat: "comfort",  price: "₹5,836",  tag: "Ambience",    imgKey: "mood_lighting",    desc: "Multi-zone LED ambient lighting enhancing the Curvv EV's premium cabin." },
    { id: 9,  name: "TPMS",                     cat: "safety",   price: "₹8,079",  tag: "Safety",      imgKey: "ev_tpms",          desc: "Smart TPMS for precise inflation monitoring — extends Curvv EV range." },
    { id: 10, name: "DVR Advanced",             cat: "safety",   price: "₹27,999", tag: "Premium",     imgKey: "dvr",              desc: "4K dual-channel dash cam with cloud connectivity for the Curvv EV." },
    { id: 11, name: "Wireless Charger",         cat: "comfort",  price: "₹3,532",  tag: "Tech",        imgKey: "wireless_charger", desc: "Qi wireless charger pod for the Curvv EV's centre console." },
    { id: 12, name: "Ceramic Coating Kit",      cat: "care",     price: "₹17,999", tag: "Premium",     imgKey: "ceramic_coating",  desc: "Nano ceramic coating providing gloss and paint protection for the Curvv EV." },
    { id: 13, name: "Vehicle Tracker",          cat: "safety",   price: "₹6,599",  tag: "Security",    imgKey: "gps_tracker",      desc: "GPS tracker with real-time geofencing and charge-status alerts." },
    { id: 14, name: "JBL Speakers",             cat: "comfort",  price: "Market Price",tag:"Audio",    imgKey: "music_system",     desc: "Premium JBL speaker upgrade for the Curvv EV's connected audio system." },
    { id: 15, name: "Mud Flaps",                cat: "exterior", price: "₹899+",   tag: "Must Have",   imgKey: "mud_flaps",        desc: "EV-spec ABS mud flaps for the Curvv EV's wide arches." },
    { id: 16, name: "Seat Covers",              cat: "interior", price: "₹9,500+", tag: "Comfort",     imgKey: "seat_covers",      desc: "Premium leatherette seat covers for the Curvv EV's sporty bucket seats." },
  ],

  harrier_ev: [
    { id: 1,  name: "3D Floor Mats",            cat: "interior", price: "₹4,499",  tag: "Essential",   imgKey: "ev_floor_mats",    desc: "Deep-dish EV-grade 3D floor mats for the Harrier EV's premium cabin." },
    { id: 2,  name: "Body Cover",               cat: "care",     price: "₹4,199",  tag: "Essential",   imgKey: "ev_body_cover",    desc: "Premium all-weather body cover custom-fitted for the Harrier EV." },
    { id: 3,  name: "Home Charger (11kW)",      cat: "ev",       price: "₹24,999", tag: "EV Essential",imgKey: "home_charger_ev",  desc: "11kW 3-phase AC wall-box charger — full charge for Harrier EV in ~6 hours." },
    { id: 4,  name: "Portable 7.2kW Charger",   cat: "ev",       price: "₹12,999", tag: "EV Essential",imgKey: "portable_charger_ev",desc: "7.2kW portable AC charger — powerful enough for hotel and office charging." },
    { id: 5,  name: "CCS2 Charge Cable (32A)",  cat: "ev",       price: "₹6,999",  tag: "EV Accessory",imgKey: "charging_cable_ev", desc: "32A Type-2 cable for rapid AC charging at public charging stations." },
    { id: 6,  name: "Battery Armour Guard",     cat: "ev",       price: "₹7,999",  tag: "EV Protection",imgKey:"battery_guard_ev", desc: "Heavy-duty underbody armour protecting the Harrier EV's large battery pack." },
    { id: 7,  name: "19\" Aero Alloy Wheels",   cat: "exterior", price: "₹17,999/pc",tag:"Upgrade",    imgKey: "ev_alloy_wheels",  desc: "19-inch aerodynamic diamond-cut alloys for Harrier EV's commanding stance." },
    { id: 8,  name: "Sidestep (Illuminated)",   cat: "exterior", price: "₹21,999", tag: "Utility",     imgKey: "sidestep",         desc: "Premium LED-lit side steps — easy boarding and a striking night look." },
    { id: 9,  name: "TPMS",                     cat: "safety",   price: "₹8,099",  tag: "Safety",      imgKey: "ev_tpms",          desc: "Smart tyre pressure monitoring — correct inflation is critical for EV range." },
    { id: 10, name: "DVR Advanced (4K)",        cat: "safety",   price: "₹27,999", tag: "Premium",     imgKey: "dvr",              desc: "4K dual-channel cloud dash cam with parking mode for the Harrier EV." },
    { id: 11, name: "Vehicle Tracker",          cat: "safety",   price: "₹6,564",  tag: "Security",    imgKey: "gps_tracker",      desc: "GPS tracker with Harrier EV-specific charge and range monitoring." },
    { id: 12, name: "Ambient Mood Lighting",    cat: "comfort",  price: "₹6,500+", tag: "Ambience",    imgKey: "mood_lighting",    desc: "Multi-zone LED ambient lighting matching the Harrier EV's premium character." },
    { id: 13, name: "Wireless Charger",         cat: "comfort",  price: "₹3,532",  tag: "Tech",        imgKey: "wireless_charger", desc: "Dual-coil wireless charger for the Harrier EV's front and rear console areas." },
    { id: 14, name: "Seat Covers",              cat: "interior", price: "₹12,000+",tag: "Premium",     imgKey: "seat_covers",      desc: "7-seater premium EV-compatible seat covers with ventilated leatherette." },
    { id: 15, name: "Roof Rails",               cat: "lifestyle",price: "₹9,500+", tag: "Adventure",   imgKey: "roof_rails",       desc: "Aero roof rails for the Harrier EV — adventure-ready and range-conscious." },
    { id: 16, name: "Ceramic Coating Kit",      cat: "care",     price: "₹19,999", tag: "Premium",     imgKey: "ceramic_coating",  desc: "Premium nano ceramic coat protecting the Harrier EV's paint investment." },
  ],
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function Accessories() {
  const [segment, setSegment] = useState("ice"); // "ice" | "ev"
  const [selectedModel, setSelectedModel] = useState("nexon");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const MODELS = segment === "ice" ? ICE_MODELS : EV_MODELS;
  const model = MODELS.find(m => m.id === selectedModel);
  const allAcc = ACC_DB[selectedModel] || [];

  const visibleCats = segment === "ev"
    ? CATS
    : CATS.filter(c => c.id !== "ev");

  const filtered = allAcc.filter(a => {
    const catMatch = activeCat === "all" || a.cat === activeCat;
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
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

  const isEVCat = (cat) => cat === "ev";

  return (
    <Layout>
      <PageStyles />

      {/* ── Hero ── */}
      <div style={{
        background: segment === "ev"
          ? `linear-gradient(135deg,#041a10 0%,#0a2e1f 45%,#0c1f3f 100%)`
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
            {segment === "ev" ? <>Electrify Your <span style={{ background: "linear-gradient(90deg,#0d9488,#5eead4,#0d9488)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }}>Drive</span></> : <>Choose Your <span className="acc-shimmer">Model</span></>}
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
            {segment === "ev"
              ? [["6 Models", "EV Range"], ["EV-Grade", "Quality"], ["2 Year", "Warranty"], ["Free", "Fitment*"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="cormorant" style={{ fontSize: 28, fontWeight: 600, color: "#0d9488" }}>{v}</div>
                    <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                  </div>
                ))
              : [["100%", "Genuine"], ["2 Year", "Warranty"], ["9 Models", "Available"], ["Free", "Installation*"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="cormorant" style={{ fontSize: 28, fontWeight: 600, color: BRAND.gold }}>{v}</div>
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
              <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 3 }}>{model?.tagline} · Ex-showroom: {model?.priceRange}</div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: BRAND.muted }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search accessories..."
              style={{
                paddingLeft: 36, paddingRight: 12, height: 38,
                border: `1px solid rgba(0,0,0,0.15)`, borderRadius: 4,
                fontSize: 13, color: BRAND.navyMid, background: "#fff",
                outline: "none", width: 240, fontFamily: "'Jost', sans-serif",
              }}
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: BRAND.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="cormorant" style={{ fontSize: 24, color: BRAND.navyMid, marginBottom: 8 }}>No accessories found</div>
            <div style={{ fontSize: 13 }}>Try a different category or search term</div>
          </div>
        ) : (
          <div key={animKey} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 18 }}>
            {filtered.map((acc, i) => {
              const inCart = isInCart(acc);
              const imgKey = `${selectedModel}-${acc.id}`;
              const hasImgError = imgErrors[imgKey];
              const isEV = isEVCat(acc.cat);
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
                    background: isEV
                      ? `linear-gradient(135deg,#041a10,#0a2e1f)`
                      : `linear-gradient(135deg,${BRAND.navyMid},${BRAND.navyLight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {!hasImgError ? (
                      <img
                        src={getImg(acc.imgKey)}
                        alt={acc.name}
                        className="acc-img"
                        onError={() => handleImgError(imgKey)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
                      />
                    ) : (
                      <span style={{ fontSize: 44 }}>
                        {isEV ? "⚡" : "🔧"}
                      </span>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)", pointerEvents: "none" }} />
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                      background: tagColor(acc.tag), color: "#fff",
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.15em",
                      padding: "3px 8px", textTransform: "uppercase", borderRadius: 2,
                    }}>
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
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      background: "rgba(0,0,0,0.4)", fontSize: 9, color: "rgba(255,255,255,0.7)",
                      padding: "3px 8px", letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>
                      {CATS.find(c => c.id === acc.cat)?.label}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "18px 20px" }}>
                    <h3 className="cormorant" style={{ fontSize: 19, fontWeight: 600, color: BRAND.navyMid, marginBottom: 6, lineHeight: 1.2 }}>
                      {acc.name}
                    </h3>
                    <p style={{ fontSize: 11.5, color: BRAND.muted, lineHeight: 1.65, marginBottom: 16, minHeight: 52 }}>
                      {acc.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="cormorant" style={{ fontSize: 21, fontWeight: 600, color: BRAND.navyMid }}>
                        {acc.price}
                      </span>
                      <button className="enquire-btn"
                        onClick={() => toggleCart(acc)}
                        style={{
                          padding: "7px 14px", fontSize: 10, borderRadius: 2,
                          letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
                          background: inCart ? BRAND.gold : isEV ? "#0d9488" : BRAND.navyMid,
                          color: inCart ? BRAND.navy : BRAND.white,
                        }}>
                        {inCart ? "✓ Added" : "+ Enquire"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart CTA */}
        {cart.length > 0 && (
          <div style={{
            marginTop: 48, background: BRAND.navyMid, padding: "28px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 6 }}>
                Your Enquiry Selection — {cart.length} item{cart.length > 1 ? "s" : ""}
              </div>
              <div className="cormorant" style={{ fontSize: 22, color: BRAND.white, lineHeight: 1.3 }}>
                {cart.map(c => c.name).join(" · ")}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                Across: {[...new Set(cart.map(c => c.model))].map(id => [...ICE_MODELS, ...EV_MODELS].find(m => m.id === id)?.name).filter(Boolean).join(", ")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="cta-outline" onClick={() => setCart([])} style={{ padding: "10px 22px", fontSize: 11, borderRadius: 2 }}>
                Clear All
              </button>
              <button className="cta-gold" style={{ padding: "10px 24px", fontSize: 11, borderRadius: 2 }}>
                Request Quote →
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
            ["⚡", "EV Charging Setup", "Home charger installation handled by certified EV technicians"],
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