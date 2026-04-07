import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";

// ─── BRAND TOKENS ────────────────────────────────────────────────
const BRAND = {
  navy: "#0a1628",
  navyMid: "#0c1f3f",
  navyLight: "#1a3d7c",
  gold: "#b8963e",
  goldLight: "#d4af5a",
  goldPale: "#f0e4c2",
  white: "#ffffff",
  offWhite: "#f7f5f0",
  muted: "#6b7280",
  borderLight: "rgba(184,150,62,0.2)",
};

// ─── FONT INJECT ─────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }
    body { font-family: 'Jost', sans-serif; background: #ffffff; color: #0c1f3f; }
    .cormorant { font-family: 'Cormorant Garamond', serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #ffffff; }
    ::-webkit-scrollbar-thumb { background: #b8963e; border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideLeft {
      from { transform: translateX(40px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes ticker  {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .anim-fadeUp    { animation: fadeUp    0.7s ease forwards; }
    .anim-fadeIn    { animation: fadeIn    0.6s ease forwards; }
    .anim-slideLeft { animation: slideLeft 0.6s ease forwards; }

    .gold-shimmer {
      background: linear-gradient(90deg, #b8963e 0%, #f0e4c2 40%, #b8963e 60%, #d4af5a 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }

    .nav-link::after {
      content: ''; display: block; height: 1px;
      background: #b8963e; width: 0; transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }

    .card-hover { transition: transform 0.4s ease, box-shadow 0.4s ease; }
    .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.12); }

    .btn-gold {
      background: linear-gradient(135deg, #b8963e, #d4af5a);
      color: #0a1628; border: none; cursor: pointer;
      font-family: 'Jost', sans-serif; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      transition: all 0.3s ease; position: relative; overflow: hidden;
    }
    .btn-gold::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, #d4af5a, #b8963e);
      opacity: 0; transition: opacity 0.3s;
    }
    .btn-gold:hover::before { opacity: 1; }
    .btn-gold span { position: relative; z-index: 1; }

    .btn-outline {
      background: transparent; border: 1px solid #b8963e; color: #b8963e;
      cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease;
    }
    .btn-outline:hover { background: #b8963e; color: #0a1628; }

    .gold-line { width: 60px; height: 2px; background: linear-gradient(90deg, #b8963e, transparent); }

    .dropdown-menu {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }

    .vehicles-dropdown {
      opacity: 0; visibility: hidden; transform: translateY(8px); transition: all 0.25s ease;
    }
    .vehicles-nav-item:hover .vehicles-dropdown {
      opacity: 1; visibility: visible; transform: translateY(0);
    }

    .sub-menu-open   { opacity: 1; visibility: visible;  transform: translateX(0);  }
    .sub-menu-closed { opacity: 0; visibility: hidden;   transform: translateX(6px); }
    .sub-menu-panel {
      position: absolute; left: 100%; top: -2px;
      min-width: 195px;
      background: rgba(6,14,28,0.99);
      border: 1px solid rgba(184,150,62,0.25);
      border-left: 2px solid #b8963e;
      padding: 8px 0;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      z-index: 20;
    }

    .ticker-inner { display: flex; white-space: nowrap; animation: ticker 30s linear infinite; }
    .ticker-inner:hover { animation-play-state: paused; }

    .location-card { transition: all 0.35s ease; cursor: pointer; }
    .location-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }

    .info-card { transition: all 0.3s ease; }
    .info-card:hover { border-color: #b8963e !important; }

    .tab-btn { transition: all 0.25s ease; }

    .topbar-link {
      color: rgba(255,255,255,0.55); text-decoration: none; cursor: pointer; transition: color 0.2s;
    }
    .topbar-link:hover { color: #b8963e; }
  `}</style>
);

// ─── SHOWROOM DATA ────────────────────────────────────────────────
// Each entry = one city / outlet. Add as many as needed.
const SHOWROOM_DATA = {
  belgaum: {
    cityName: "Belgaum",
    fullName: "Manickbag Automobiles — Belgaum",
    tagline: "North Karnataka's Gateway Showroom",
    address: "Survey No. 14, Khanapur Road, Tilakwadi, Belagavi – 590 006",
    phone: "+91 83122 45678",
    whatsapp: "918312245678",
    email: "belgaum@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 7:00 PM  |  Sun: 10:00 AM – 5:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d74.4977!3d15.8497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf67!2sBelagavi!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#0a1628 0%,#1a3d7c 55%,#0a2240 100%)",
    accentColor: "#4fc3f7",
    stats: [{ v: "2,800+", l: "Vehicles Sold" }, { v: "15+", l: "Years Here" }, { v: "4.8★", l: "Google Rating" }, { v: "6", l: "Sub-Outlets" }],
    outlets: ["3'S Belgaum", "EMO Chikkodi", "EMO Ramdurga", "EMO Savadatti", "EMO Raibag", "EMO Bailhongal"],
    team: [
      { name: "Rajesh Patil",   role: "Showroom Manager",       ext: "101" },
      { name: "Smita Desai",    role: "Sales Executive",         ext: "102" },
      { name: "Anil Kore",      role: "Service Advisor",         ext: "201" },
      { name: "Priya Shettar",  role: "Finance & Insurance",     ext: "301" },
    ],
    offers: [
      { title: "Exchange Bonus", desc: "Up to ₹50,000 extra on your old car this month.", tag: "Limited" },
      { title: "0% Finance",     desc: "Zero interest for 12 months on select Tata models.", tag: "New" },
      { title: "Free AMC",       desc: "1-year AMC complimentary on Nexon & Harrier bookings.", tag: "Hot" },
    ],
    bgPattern: "hexagon",
  },

  hubli: {
    cityName: "Hubli",
    fullName: "Manickbag Automobiles — Hubli",
    tagline: "The Commercial Capital Showroom",
    address: "Opp. Utsav Hotel, Gokul Road, Hubballi – 580 030",
    phone: "+91 83622 11234",
    whatsapp: "918362211234",
    email: "hubli@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 7:30 PM  |  Sun: 10:00 AM – 5:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d75.1240!3d15.3647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d!2sHubballi!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#050f1f 0%,#0c2d5e 50%,#1a5276 100%)",
    accentColor: "#00e676",
    stats: [{ v: "3,500+", l: "Vehicles Sold" }, { v: "18+", l: "Years Here" }, { v: "4.9★", l: "Google Rating" }, { v: "4", l: "Sub-Outlets" }],
    outlets: ["3'S Hubbli", "EMO Haveri", "EMO Mudeshwar", "EMO Sirsi"],
    team: [
      { name: "Suresh Kulkarni", role: "Showroom Manager",   ext: "101" },
      { name: "Meena Joshi",     role: "Sales Executive",     ext: "102" },
      { name: "Vijay Naik",      role: "Service Advisor",     ext: "201" },
      { name: "Deepa Honnur",    role: "Finance & Insurance", ext: "301" },
    ],
    offers: [
      { title: "Corporate Scheme", desc: "Special pricing for IT & govt employees this quarter.", tag: "Exclusive" },
      { title: "EV Test Drive",    desc: "Book a free Nexon EV extended test drive (2 hrs).",   tag: "Free" },
      { title: "Service Camp",     desc: "Free multi-point check for Tata vehicles this weekend.", tag: "Weekend" },
    ],
    bgPattern: "circle",
  },

  dharwad: {
    cityName: "Dharwad",
    fullName: "Manickbag Automobiles — Dharwad",
    tagline: "City of Music & Motoring Excellence",
    address: "NH-4, Near Indira Glass House, Dharwad – 580 001",
    phone: "+91 83622 77891",
    whatsapp: "918362277891",
    email: "dharwad@manickbag.in",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM  |  Sun: Closed",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d75.0078!3d15.4589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d!2sDharwad!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#0a1628 0%,#2d1810 50%,#1a0a00 100%)",
    accentColor: "#ffca28",
    stats: [{ v: "1,900+", l: "Vehicles Sold" }, { v: "12+", l: "Years Here" }, { v: "4.7★", l: "Google Rating" }, { v: "1", l: "Outlet" }],
    outlets: ["3'S Dharwad"],
    team: [
      { name: "Ganesh Hublikar", role: "Showroom Manager",   ext: "101" },
      { name: "Kavya Nadaf",     role: "Sales Executive",     ext: "102" },
      { name: "Ravi Patil",      role: "Service Advisor",     ext: "201" },
      { name: "Suma Bhatt",      role: "Finance & Insurance", ext: "301" },
    ],
    offers: [
      { title: "Student Discount", desc: "Special pricing for university staff & students.", tag: "Edu" },
      { title: "Petrol + EV Bundle", desc: "Buy any petrol car, get EV charging kit free.", tag: "Bundle" },
      { title: "Long Weekend Drive", desc: "Free test drive package with fuel this month.", tag: "New" },
    ],
    bgPattern: "diamond",
  },

  karwar: {
    cityName: "Karwar",
    fullName: "Manickbag Automobiles — Karwar",
    tagline: "Coastal Karnataka's Trusted Dealer",
    address: "Near NH-66, Sadashivgad Road, Karwar – 581 301",
    phone: "+91 83822 34567",
    whatsapp: "918382234567",
    email: "karwar@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 6:30 PM  |  Sun: 10:00 AM – 4:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d74.1334!3d14.8003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf!2sKarwar!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#041520 0%,#0a3040 55%,#0d2035 100%)",
    accentColor: "#4db6ac",
    stats: [{ v: "1,200+", l: "Vehicles Sold" }, { v: "8+", l: "Years Here" }, { v: "4.6★", l: "Google Rating" }, { v: "2", l: "Sub-Outlets" }],
    outlets: ["3'S Karwar", "EMO Ankola"],
    team: [
      { name: "Santosh Naik",  role: "Showroom Manager",   ext: "101" },
      { name: "Archana Gawas", role: "Sales Executive",     ext: "102" },
      { name: "Dilip Shetty",  role: "Service Advisor",     ext: "201" },
      { name: "Rekha Naik",    role: "Finance & Insurance", ext: "301" },
    ],
    offers: [
      { title: "Monsoon Special", desc: "Waterproofing & underbody coating free on all new bookings.", tag: "Seasonal" },
      { title: "Navy Personnel",  desc: "Special ex-servicemen pricing available year-round.", tag: "Defence" },
      { title: "Free RTO",        desc: "RTO registration charges waived on Safari & Harrier.", tag: "Hot" },
    ],
    bgPattern: "circle",
  },

  bijapur: {
    cityName: "Bijapur",
    fullName: "Manickbag Automobiles — Bijapur (Vijayapura)",
    tagline: "Heritage City, Modern Mobility",
    address: "Station Road, Near Golgumbaz Chowk, Vijayapura – 586 101",
    phone: "+91 83522 98765",
    whatsapp: "918352298765",
    email: "bijapur@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 7:00 PM  |  Sun: 10:00 AM – 5:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d75.7210!3d16.8302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5!2sVijayapura!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#1a0a00 0%,#3d1f00 50%,#0a1628 100%)",
    accentColor: "#ff8a65",
    stats: [{ v: "2,100+", l: "Vehicles Sold" }, { v: "10+", l: "Years Here" }, { v: "4.7★", l: "Google Rating" }, { v: "1", l: "Outlet" }],
    outlets: ["3'S Bijapur"],
    team: [
      { name: "Ibrahim Mulla",  role: "Showroom Manager",   ext: "101" },
      { name: "Farhana Inamdar",role: "Sales Executive",     ext: "102" },
      { name: "Sunil Patil",    role: "Service Advisor",     ext: "201" },
      { name: "Nazia Shaikh",   role: "Finance & Insurance", ext: "301" },
    ],
    offers: [
      { title: "Golgumbaz Drive", desc: "Special city edition colours exclusive to Vijayapura outlet.", tag: "Local" },
      { title: "Agri Scheme",     desc: "Farmer-friendly EMI plans starting at ₹6,999/month.", tag: "Agri" },
      { title: "Fuel Voucher",    desc: "₹5,000 fuel voucher on Punch & Tiago bookings.", tag: "Value" },
    ],
    bgPattern: "diamond",
  },

  gulbarga: {
    cityName: "Gulbarga",
    fullName: "Manickbag Automobiles — Kalaburagi (Gulbarga)",
    tagline: "Our Flagship — Established 1962",
    address: "Super Market, M G Road, Kalaburagi – 585 101",
    phone: "+91 96860 24365",
    whatsapp: "919686024365",
    email: "gulbarga@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 7:30 PM  |  Sun: 10:00 AM – 5:30 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d76.8237!3d17.3297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc8!2sKalaburagi!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#0a1628 0%,#1a3d7c 60%,#0a1628 100%)",
    accentColor: "#b8963e",
    stats: [{ v: "8,000+", l: "Vehicles Sold" }, { v: "62+", l: "Years Here" }, { v: "4.9★", l: "Google Rating" }, { v: "Flagship", l: "Status" }],
    outlets: ["3'S Kalaburagi", "EMO Yadgiri", "EMO Shahabad"],
    team: [
      { name: "Vijay Shah",       role: "Director & GM",         ext: "001" },
      { name: "Ameen Mirji",      role: "Operations Manager",    ext: "002" },
      { name: "Lakshmi Patil",    role: "Senior Sales Manager",  ext: "101" },
      { name: "Mohan Reddy",      role: "Service Head",          ext: "201" },
    ],
    offers: [
      { title: "Flagship Privilege", desc: "Exclusive lifetime priority service for flagship outlet buyers.", tag: "VIP" },
      { title: "Anniversary Deal",   desc: "60+ years special — ₹62,000 off on premium variants.", tag: "62 Yrs" },
      { title: "Complete Finance",   desc: "In-house processing — approval in 2 hours guaranteed.", tag: "Fast" },
    ],
    bgPattern: "hexagon",
  },

  bidar: {
    cityName: "Bidar",
    fullName: "Manickbag Automobiles — Bidar",
    tagline: "Historic Deccan's Automotive Hub",
    address: "Udgir Road, Opp. District Court, Bidar – 585 401",
    phone: "+91 84822 55678",
    whatsapp: "918482255678",
    email: "bidar@manickbag.in",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM  |  Sun: Closed",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d77.5199!3d17.9104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc9!2sBidar!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#0d0d1a 0%,#1a1035 55%,#0a1628 100%)",
    accentColor: "#ce93d8",
    stats: [{ v: "1,600+", l: "Vehicles Sold" }, { v: "9+", l: "Years Here" }, { v: "4.6★", l: "Google Rating" }, { v: "1", l: "Outlet" }],
    outlets: ["3'S Bidar"],
    team: [
      { name: "Prasad Kulkarni", role: "Showroom Manager",   ext: "101" },
      { name: "Savita Desai",    role: "Sales Executive",     ext: "102" },
      { name: "Raju Yadav",      role: "Service Advisor",     ext: "201" },
      { name: "Neeta Jadhav",    role: "Finance & Insurance", ext: "301" },
    ],
    offers: [
      { title: "Bidar Heritage",  desc: "Exclusive matte finish package inspired by Bidriware art.", tag: "Local" },
      { title: "Defence Pricing", desc: "Special offer for Bidar Air Force Station personnel.",      tag: "Defence" },
      { title: "Rural Finance",   desc: "Easy rural finance with minimal documentation.",            tag: "Rural" },
    ],
    bgPattern: "diamond",
  },

  yadgiri: {
    cityName: "Yadgiri",
    fullName: "Manickbag Automobiles — Yadgiri",
    tagline: "Growing City, Growing With You",
    address: "Shorapur Road, Near Bus Stand, Yadgiri – 585 201",
    phone: "+91 84733 12345",
    whatsapp: "918473312345",
    email: "yadgiri@manickbag.in",
    hours: "Mon–Sat: 9:00 AM – 6:30 PM  |  Sun: By Appointment",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30866.14!2d77.1383!3d16.7713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc8!2sYadgiri!5e0!3m2!1sen!2sin!4v1",
    heroGradient: "linear-gradient(135deg,#041a10 0%,#0a3020 55%,#041510 100%)",
    accentColor: "#81c784",
    stats: [{ v: "800+", l: "Vehicles Sold" }, { v: "5+", l: "Years Here" }, { v: "4.5★", l: "Google Rating" }, { v: "EMO", l: "Status" }],
    outlets: ["EMO Yadgiri", "EMO Shahabad"],
    team: [
      { name: "Ramesh Nayak",  role: "Outlet Manager",      ext: "101" },
      { name: "Geetha Reddy",  role: "Sales Executive",      ext: "102" },
      { name: "Kiran Patil",   role: "Service Advisor",      ext: "201" },
      { name: "Anita Biradar", role: "Finance & Insurance",  ext: "301" },
    ],
    offers: [
      { title: "New District Deal", desc: "Special launch pricing as newest district HQ outlet.", tag: "New" },
      { title: "Village Connect",   desc: "Doorstep test drives for customers 30+ km away.",      tag: "Doorstep" },
      { title: "CNG Special",       desc: "CNG variant available on priority at this outlet.",    tag: "CNG" },
    ],
    bgPattern: "circle",
  },
};

// ─── vehicles (same as Home) ──────────────────────────────────────
const vehicles = [
  { name: "Tiago",      category: "Hatchback", fuel: "Petrol",   tag: "Budget Friendly", color: "#64b5f6", image: "https://www.manickbag.in/images/tiago.jpg" },
  { name: "Tiago EV",   category: "Hatchback", fuel: "Electric", tag: "City EV",         color: "#00e676", image: "https://www.manickbag.in/images/tiago_ev.avif" },
  { name: "Altroz",     category: "Hatchback", fuel: "Petrol",   tag: "Stylish",         color: "#f48fb1", image: "https://www.manickbag.in/images/altroz.jpg" },
  { name: "Nexon",      category: "SUV",       fuel: "Petrol",   tag: "Top Seller",      color: "#ff8a65", image: "https://www.manickbag.in/images/naxon.avif" },
  { name: "Nexon EV",   category: "SUV",       fuel: "Electric", tag: "Best Seller",     color: "#4fc3f7", image: "https://www.manickbag.in/images/nexon_ev.avif" },
  { name: "Punch",      category: "SUV",       fuel: "Petrol",   tag: "5-Star Safety",   color: "#ffca28", image: "https://www.manickbag.in/images/Punch.png" },
  { name: "Harrier",    category: "UV",        fuel: "Petrol",   tag: "Flagship",        color: "#ce93d8", image: "https://www.manickbag.in/images/harrier.avif" },
  { name: "Safari",     category: "UV",        fuel: "Petrol",   tag: "Premium",         color: "#b8963e", image: "https://www.manickbag.in/images/safari.avif" },
];

const W = { width: "100%", padding: "0 48px" };

// ─── NAV ITEMS ────────────────────────────────────────────────────
const navItems = [
  {
    label: "Services",
    children: [
      { label: "Book Service",      path: "/service" },
      { label: "Renewal Insurance", path: "/insurance" },
      { label: "AMC",               path: "/amc" },
      { label: "Extended Warranty", path: "/extended-warranty" },
      { label: "Accessories",       path: "/accessories" },
    ],
  },
  { label: "Heritage", children: [{ label: "Our Story", path: "#" }, { label: "Milestones", path: "#" }] },
  { label: "Offers",   children: [{ label: "Current Offers", path: "#" }, { label: "Exchange Bonus", path: "#" }] },
];

// ══════════════════════════════════════════════════════════════════
//  TOP BAR
// ══════════════════════════════════════════════════════════════════
const TopBar = ({ phone }) => (
  <div style={{ background: BRAND.navyMid, borderBottom: `1px solid ${BRAND.borderLight}`, padding: "6px 0", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 24, fontSize: 12, letterSpacing: "0.05em" }}>
          <Link to="/" className="topbar-link">← Back to All Showrooms</Link>
          <span style={{ color: BRAND.borderLight }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>☎ {phone}</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          {["Careers", "Investors", "Media"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════════════
const Navbar = ({ scrolled, cityName }) => (
  <nav style={{ position: "fixed", top: scrolled ? 0 : 33, left: 0, right: 0, zIndex: 900, background: scrolled ? "rgba(10,22,40,0.97)" : BRAND.navyMid, backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? BRAND.borderLight : "transparent"}`, transition: "all 0.4s ease", boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none", width: "100%" }}>
    <div style={{ ...W, display: "flex", alignItems: "center", height: 72 }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: BRAND.white, letterSpacing: "0.02em", lineHeight: 1.1 }}>MANICKBAG</div>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, textTransform: "uppercase", fontWeight: 500 }}>AUTOMOBILES PVT LTD</div>
        </div>
      </Link>

      <div style={{ marginLeft: 16, padding: "3px 10px", border: `1px solid ${BRAND.borderLight}`, borderRadius: 2, fontSize: 10, color: BRAND.goldLight, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {cityName} Showroom
      </div>

      <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
        {/* Showrooms dropdown */}
        <div className="nav-item" style={{ position: "relative", padding: "0 4px" }}>
          <a href="#" className="nav-link" style={{ display: "block", padding: "8px 16px", color: BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Showrooms</a>
          <div className="dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, minWidth: 180, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>
            {Object.keys(SHOWROOM_DATA).map(key => (
              <Link key={key} to={`/showrooms/${key}`} style={{ display: "block", padding: "10px 20px", color: "#ccc", textDecoration: "none", fontSize: 13, transition: "all 0.2s", borderLeft: "2px solid transparent" }}
                onMouseOver={e => { e.currentTarget.style.color = BRAND.gold; e.currentTarget.style.borderLeftColor = BRAND.gold; e.currentTarget.style.paddingLeft = "24px"; }}
                onMouseOut={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}>
                {SHOWROOM_DATA[key].cityName}
              </Link>
            ))}
          </div>
        </div>

        {navItems.map(item => (
          <div key={item.label} className="nav-item" style={{ position: "relative", padding: "0 4px" }}>
            <a href="#" className="nav-link" style={{ display: "block", padding: "8px 16px", color: BRAND.white, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}
              onMouseOver={e => e.currentTarget.style.color = BRAND.gold}
              onMouseOut={e => e.currentTarget.style.color = BRAND.white}>{item.label}</a>
            {item.children && (
              <div className="dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, minWidth: 200, background: "rgba(10,22,40,0.98)", border: `1px solid ${BRAND.borderLight}`, borderTop: `2px solid ${BRAND.gold}`, backdropFilter: "blur(12px)", padding: "8px 0" }}>
                {item.children.map(child => (
                  <Link key={child.label} to={child.path} style={{ display: "block", padding: "10px 20px", color: "#ccc", textDecoration: "none", fontSize: 13, transition: "all 0.2s", borderLeft: "2px solid transparent" }}
                    onMouseOver={e => { e.currentTarget.style.color = BRAND.gold; e.currentTarget.style.borderLeftColor = BRAND.gold; e.currentTarget.style.paddingLeft = "24px"; }}
                    onMouseOut={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}>{child.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="btn-gold" style={{ marginLeft: 16, padding: "10px 24px", fontSize: 12, borderRadius: 2 }}>
          <span>Book Test Drive</span>
        </button>
      </div>
    </div>
  </nav>
);

// ══════════════════════════════════════════════════════════════════
//  HERO — location-specific
// ══════════════════════════════════════════════════════════════════
const Hero = ({ data }) => {
  const radius = data.bgPattern === "circle" ? "50%" : data.bgPattern === "hexagon" ? "30%" : "4px";
  return (
    <section style={{ height: "85vh", minHeight: 600, position: "relative", overflow: "hidden", width: "100%", background: data.heroGradient }}>
      {/* Decorative shapes */}
      <div style={{ position: "absolute", right: "6%", top: "12%", width: 380, height: 380, border: "1px solid rgba(184,150,62,0.08)", borderRadius: radius, transform: "rotate(15deg)", transition: "all 1s ease" }} />
      <div style={{ position: "absolute", right: "11%", top: "18%", width: 260, height: 260, border: "1px solid rgba(184,150,62,0.15)", borderRadius: radius, transform: "rotate(30deg)", transition: "all 1s ease" }} />
      <div style={{ position: "absolute", left: "5%", bottom: "10%", width: 180, height: 180, border: `1px solid ${data.accentColor}22`, borderRadius: radius, transform: "rotate(-20deg)" }} />

      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: BRAND.gold, opacity: 0.3, left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%`, animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
      ))}

      {/* Location badge */}
      <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: 10, letterSpacing: "0.3em", color: "rgba(184,150,62,0.5)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        Manickbag · {data.cityName} · Karnataka
      </div>

      <div style={{ position: "relative", zIndex: 2, width: "100%", padding: "0 48px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Breadcrumb */}
        <div className="anim-fadeIn" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, opacity: 0, animationDelay: "0.1s" }}>
          <Link to="/" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>Home</Link>
          <span style={{ color: BRAND.gold, fontSize: 10 }}>›</span>
          <Link to="/showrooms" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>Showrooms</Link>
          <span style={{ color: BRAND.gold, fontSize: 10 }}>›</span>
          <span style={{ fontSize: 11, color: BRAND.gold, letterSpacing: "0.15em", textTransform: "uppercase" }}>{data.cityName}</span>
        </div>

        <div className="anim-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20, animationDelay: "0.15s", opacity: 0 }}>
          <div style={{ width: 32, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 500 }}>{data.tagline}</span>
        </div>

        <h1 className="cormorant anim-fadeUp" style={{ fontSize: "clamp(40px,6vw,78px)", fontWeight: 300, lineHeight: 1.1, color: BRAND.white, maxWidth: 700, animationDelay: "0.2s", opacity: 0 }}>
          {data.cityName}<br />
          <span className="gold-shimmer">Showroom</span>
        </h1>

        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${BRAND.gold},transparent)`, margin: "20px 0" }} />

        <p className="anim-fadeUp" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: 500, marginBottom: 36, animationDelay: "0.35s", opacity: 0 }}>
          📍 {data.address}
        </p>

        <div className="anim-fadeUp" style={{ display: "flex", gap: 16, flexWrap: "wrap", animationDelay: "0.45s", opacity: 0 }}>
          <button className="btn-gold" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}><span>📅 Book Test Drive</span></button>
          <a href={`tel:${data.phone}`} style={{ textDecoration: "none" }}>
            <button className="btn-outline" style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2 }}>📞 {data.phone}</button>
          </a>
          <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button style={{ padding: "14px 36px", fontSize: 13, borderRadius: 2, cursor: "pointer", background: "#25D366", color: "#fff", border: "none", fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>💬 WhatsApp</button>
          </a>
        </div>

        {/* Stats */}
        <div className="anim-fadeUp" style={{ display: "flex", gap: 48, marginTop: 60, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", animationDelay: "0.55s", opacity: 0 }}>
          {data.stats.map(s => (
            <div key={s.l}>
              <div className="cormorant" style={{ fontSize: 38, fontWeight: 600, color: data.accentColor, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 36, right: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</div>
        <div style={{ width: 1, height: 48, background: `linear-gradient(${BRAND.gold},transparent)`, animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  QUICK INFO STRIP
// ══════════════════════════════════════════════════════════════════
const QuickInfo = ({ data }) => {
  const items = [
    { icon: "📍", label: "Address",       value: data.address },
    { icon: "📞", label: "Phone",         value: data.phone },
    { icon: "✉️", label: "Email",         value: data.email },
    { icon: "🕐", label: "Working Hours", value: data.hours },
  ];
  return (
    <div style={{ background: BRAND.navyMid, padding: "0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {items.map((item, i) => (
            <div key={item.label} className="info-card" style={{ padding: "28px 24px", borderRight: i < 3 ? `1px solid ${BRAND.borderLight}` : "none", borderBottom: `2px solid transparent`, transition: "border-color 0.3s" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, marginBottom: 6, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  TICKER
// ══════════════════════════════════════════════════════════════════
const Ticker = () => {
  const items = ["Tiago","Tigor","Altroz","Nexon","Punch","Safari","Harrier","Tiago EV","Nexon EV","Punch EV","Harrier EV","Curvv EV"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: `linear-gradient(90deg,${BRAND.gold},${BRAND.goldLight} 50%,${BRAND.gold})`, overflow: "hidden", padding: "10px 0", width: "100%" }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding: "0 28px", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.navy, display: "inline-flex", alignItems: "center", gap: 14 }}>
            {item}<span style={{ opacity: 0.4 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  OFFERS SECTION
// ══════════════════════════════════════════════════════════════════
const OffersSection = ({ data }) => {
  const tagColors = { Limited: "#ff5252", New: "#00e676", Hot: "#ff9800", Exclusive: "#ce93d8", Free: "#4fc3f7", Weekend: "#ffca28", Seasonal: "#4db6ac", Defence: "#7986cb", Value: "#ff8a65", Local: "#b8963e", Agri: "#81c784", Bundle: "#f48fb1", Fast: "#ff5252", VIP: "#b8963e", "62 Yrs": "#d4af5a", Edu: "#64b5f6", Rural: "#81c784", New: "#00e676", Doorstep: "#4fc3f7", CNG: "#a5d6a7" };
  return (
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div className="gold-line" />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Exclusive To {data.cityName}</span>
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid, marginBottom: 40 }}>
          Current Offers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {data.offers.map((offer, i) => (
            <div key={offer.title} className="card-hover" style={{ background: BRAND.white, padding: "36px 32px", borderBottom: `3px solid ${tagColors[offer.tag] || BRAND.gold}`, animation: `fadeUp 0.5s ease ${i * 0.12}s both` }}>
              <div style={{ display: "inline-block", padding: "4px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", background: (tagColors[offer.tag] || BRAND.gold) + "22", color: tagColors[offer.tag] || BRAND.gold, marginBottom: 16, borderRadius: 2 }}>
                {offer.tag}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: BRAND.navyMid, fontFamily: "'Cormorant Garamond',serif", marginBottom: 12 }}>{offer.title}</h3>
              <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.7, marginBottom: 20 }}>{offer.desc}</p>
              <button className="btn-gold" style={{ padding: "10px 24px", fontSize: 11, borderRadius: 2 }}><span>Enquire Now</span></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  VEHICLES SECTION (mini — 8 top models)
// ══════════════════════════════════════════════════════════════════
const VehiclesSection = () => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Petrol", "Electric"];
  const filtered = filter === "All" ? vehicles : vehicles.filter(v => v.fuel === filter);
  return (
    <section style={{ background: "#ffffff", padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="gold-line" />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Available Models</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: BRAND.navyMid }}>Tata Motors Range</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", fontSize: 12, cursor: "pointer", borderRadius: 2, background: filter === f ? BRAND.navyMid : "transparent", color: filter === f ? BRAND.white : BRAND.navyMid, border: `1px solid ${filter === f ? BRAND.navyMid : "rgba(10,31,63,0.2)"}`, transition: "all 0.2s" }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {filtered.map((v, i) => (
            <div key={v.name} className="card-hover" style={{ background: BRAND.offWhite, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer", animation: `fadeUp 0.5s ease ${i * 0.07}s both` }}>
              <div style={{ height: 160, background: `linear-gradient(135deg,${BRAND.navyMid}15,${v.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.4s ease" }}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", top: 12, left: 12, background: v.fuel === "Electric" ? "#4fc3f7" : BRAND.gold, color: BRAND.navy, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", padding: "3px 8px", textTransform: "uppercase" }}>{v.tag}</div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: BRAND.muted, textTransform: "uppercase", marginBottom: 4 }}>{v.category}</div>
                <h3 className="cormorant" style={{ fontSize: 20, fontWeight: 600, color: BRAND.navyMid, marginBottom: 14 }}>{v.name}</h3>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ flex: 1, padding: "9px", fontSize: 10, cursor: "pointer", background: BRAND.navyMid, color: BRAND.white, border: "none", fontFamily: "'Jost',sans-serif", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Explore</button>
                  <button style={{ padding: "9px 12px", fontSize: 10, cursor: "pointer", background: "transparent", color: BRAND.gold, border: `1px solid ${BRAND.gold}`, fontFamily: "'Jost',sans-serif", transition: "all 0.2s" }}
                    onMouseOver={e => { e.currentTarget.style.background = BRAND.gold; e.currentTarget.style.color = BRAND.navy; }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND.gold; }}>EMI</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  TEAM SECTION
// ══════════════════════════════════════════════════════════════════
const TeamSection = ({ data }) => (
  <section style={{ background: BRAND.navyMid, padding: "80px 0", width: "100%" }}>
    <div style={W}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Your Local Team</span>
          <div style={{ width: 40, height: 1, background: BRAND.gold }} />
        </div>
        <h2 className="cormorant" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 600, color: BRAND.white }}>Meet the {data.cityName} Team</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {data.team.map((member, i) => (
          <div key={member.name} className="card-hover" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BRAND.borderLight}`, padding: "32px 24px", textAlign: "center", animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${BRAND.gold}33,${data.accentColor}33)`, border: `2px solid ${BRAND.borderLight}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              👤
            </div>
            <h3 className="cormorant" style={{ fontSize: 20, fontWeight: 600, color: BRAND.white, marginBottom: 6 }}>{member.name}</h3>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 16 }}>{member.role}</div>
            <a href={`tel:${data.phone}`} style={{ textDecoration: "none" }}>
              <button style={{ padding: "8px 20px", fontSize: 11, cursor: "pointer", background: "transparent", color: BRAND.gold, border: `1px solid ${BRAND.borderLight}`, fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s", width: "100%" }}
                onMouseOver={e => { e.currentTarget.style.background = BRAND.gold; e.currentTarget.style.color = BRAND.navy; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND.gold; }}>
                Ext. {member.ext}
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  MAP + CONTACT SECTION
// ══════════════════════════════════════════════════════════════════
const MapSection = ({ data }) => {
  const [tab, setTab] = useState("map");
  return (
    <section style={{ background: BRAND.offWhite, padding: "80px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          {/* Left — contact + form */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="gold-line" />
              <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Get In Touch</span>
            </div>
            <h2 className="cormorant" style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 600, color: BRAND.navyMid, marginBottom: 32 }}>
              Visit Our<br />{data.cityName} Showroom
            </h2>

            {[
              { icon: "📍", label: "Address",        value: data.address },
              { icon: "📞", label: "Phone",           value: data.phone },
              { icon: "✉️", label: "Email",           value: data.email },
              { icon: "🕐", label: "Hours",           value: data.hours },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 20, padding: "16px 20px", background: BRAND.white, borderLeft: `3px solid ${BRAND.gold}` }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: BRAND.navyMid, lineHeight: 1.5 }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* Sub-outlets */}
            {data.outlets.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.gold, fontWeight: 600, marginBottom: 12 }}>Sub-Outlets</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.outlets.map(o => (
                    <span key={o} style={{ padding: "6px 14px", fontSize: 12, background: BRAND.navyMid, color: BRAND.white, borderRadius: 2 }}>{o}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button className="btn-gold" style={{ flex: 1, padding: "14px", fontSize: 12, borderRadius: 2 }}><span>📅 Book Test Drive</span></button>
              <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                <button style={{ width: "100%", padding: "14px", fontSize: 12, borderRadius: 2, cursor: "pointer", background: "#25D366", color: "#fff", border: "none", fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>💬 WhatsApp Us</button>
              </a>
            </div>
          </div>

          {/* Right — map */}
          <div>
            <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
              {["map", "directions"].map(t => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{ flex: 1, padding: "12px", fontSize: 11, cursor: "pointer", background: tab === t ? BRAND.navyMid : "transparent", color: tab === t ? BRAND.white : BRAND.navyMid, border: `1px solid ${BRAND.navyMid}`, fontFamily: "'Jost',sans-serif", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t === "map" ? "🗺 View Map" : "🧭 Directions"}
                </button>
              ))}
            </div>
            {tab === "map" ? (
              <div style={{ width: "100%", height: 420, background: BRAND.navyMid, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {/* Placeholder map visual since embed needs actual API */}
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🗺</div>
                  <div style={{ fontSize: 14, letterSpacing: "0.1em" }}>{data.cityName} Showroom Location</div>
                  <div style={{ fontSize: 12, marginTop: 8, color: "rgba(255,255,255,0.25)", maxWidth: 260, lineHeight: 1.6 }}>{data.address}</div>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button className="btn-gold" style={{ marginTop: 24, padding: "12px 28px", fontSize: 12, borderRadius: 2 }}><span>Open in Google Maps</span></button>
                  </a>
                </div>
                {/* Grid overlay for visual interest */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(184,150,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,62,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
              </div>
            ) : (
              <div style={{ width: "100%", height: 420, background: BRAND.offWhite, padding: 32 }}>
                <h3 className="cormorant" style={{ fontSize: 24, color: BRAND.navyMid, marginBottom: 20 }}>How to Reach Us</h3>
                {[
                  { mode: "🚗 By Car",   desc: `Enter "${data.address}" in Google Maps for turn-by-turn directions.` },
                  { mode: "🚌 By Bus",   desc: "Nearest bus stop is within 500m. Ask for the Tata Motors showroom stop." },
                  { mode: "🚂 By Train", desc: `${data.cityName} Railway Station is the nearest major rail connection. Auto / cab available.` },
                ].map(d => (
                  <div key={d.mode} style={{ marginBottom: 20, padding: "16px", background: BRAND.white, borderLeft: `3px solid ${BRAND.gold}` }}>
                    <div style={{ fontWeight: 600, color: BRAND.navyMid, marginBottom: 6, fontSize: 14 }}>{d.mode}</div>
                    <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>{d.desc}</div>
                  </div>
                ))}
                <a href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-gold" style={{ marginTop: 8, padding: "12px 28px", fontSize: 12, borderRadius: 2 }}><span>Open Google Maps</span></button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  OTHER SHOWROOMS STRIP
// ══════════════════════════════════════════════════════════════════
const OtherShowrooms = ({ currentKey }) => {
  const others = Object.entries(SHOWROOM_DATA).filter(([k]) => k !== currentKey).slice(0, 4);
  return (
    <section style={{ background: BRAND.navy, padding: "64px 0", width: "100%" }}>
      <div style={W}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div className="gold-line" />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Also Visit</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {others.map(([key, d]) => (
            <Link key={key} to={`/showrooms/${key}`} style={{ textDecoration: "none" }}>
              <div className="location-card" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BRAND.borderLight}`, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: d.accentColor }} />
                <div className="cormorant" style={{ fontSize: 28, fontWeight: 600, color: BRAND.white, marginBottom: 8 }}>{d.cityName}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 16 }}>{d.outlets.length} outlet{d.outlets.length !== 1 ? "s" : ""} · {d.stats[2]?.v}</div>
                <div style={{ fontSize: 12, color: BRAND.gold, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}>Visit →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════
//  CTA SECTION
// ══════════════════════════════════════════════════════════════════
const CTASection = ({ data }) => (
  <section style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "72px 0", position: "relative", overflow: "hidden", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <h2 className="cormorant" style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.2, marginBottom: 16 }}>
            Ready to Drive Home<br />Your Dream Tata?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            Visit our {data.cityName} showroom. Our experts will guide you to the perfect vehicle for your lifestyle and budget.
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button className="btn-gold" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}><span>📅 Book Test Drive</span></button>
          <a href={`tel:${data.phone}`} style={{ textDecoration: "none" }}>
            <button className="btn-outline" style={{ padding: "16px 40px", fontSize: 13, borderRadius: 2 }}>📞 Call Now</button>
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════════
const Footer = () => (
  <footer style={{ background: "#0a1628", padding: "48px 0 28px", width: "100%" }}>
    <div style={W}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 28, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: BRAND.navy, fontFamily: "'Cormorant Garamond',serif" }}>M</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: BRAND.white }}>MANICKBAG AUTOMOBILES</div>
            <div style={{ fontSize: 8, letterSpacing: "0.25em", color: BRAND.gold }}>AUTHORISED TATA MOTORS DEALER · NORTH KARNATAKA</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {Object.entries(SHOWROOM_DATA).map(([key, d]) => (
            <Link key={key} to={`/showrooms/${key}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.35)"}>{d.cityName}</Link>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2025 Manickbag Automobiles Pvt Ltd. All Rights Reserved.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms", "Sitemap"].map(item => (
            <a key={item} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
              onMouseOver={e => e.target.style.color = BRAND.gold}
              onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.2)"}>{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ══════════════════════════════════════════════════════════════════
//  FLOATING WHATSAPP
// ══════════════════════════════════════════════════════════════════
const FloatingWA = ({ data }) => {
  const [hover, setHover] = useState(false);
  return (
    <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
      <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
        style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        {hover && (
          <div style={{ background: BRAND.white, color: BRAND.navyMid, padding: "10px 16px", fontSize: 13, fontWeight: 500, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "slideLeft 0.3s ease", whiteSpace: "nowrap" }}>
            Chat with {data.cityName} Showroom
          </div>
        )}
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transform: hover ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>💬</div>
      </div>
    </a>
  );
};

// ══════════════════════════════════════════════════════════════════
//  404 — unknown city
// ══════════════════════════════════════════════════════════════════
const NotFound = () => (
  <div style={{ minHeight: "100vh", background: BRAND.navyMid, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
    <FontLink />
    <div className="cormorant" style={{ fontSize: 80, color: BRAND.gold, lineHeight: 1 }}>404</div>
    <h2 style={{ fontSize: 24, color: BRAND.white, margin: "16px 0 8px", fontFamily: "'Cormorant Garamond',serif" }}>Showroom Not Found</h2>
    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>The showroom you're looking for doesn't exist in our system.</p>
    <div style={{ display: "flex", gap: 12 }}>
      <Link to="/" style={{ textDecoration: "none" }}><button className="btn-gold" style={{ padding: "12px 28px", fontSize: 12, borderRadius: 2 }}><span>← Back to Home</span></button></Link>
      <Link to="/showrooms" style={{ textDecoration: "none" }}><button className="btn-outline" style={{ padding: "12px 28px", fontSize: 12, borderRadius: 2 }}>All Showrooms</button></Link>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  SHOWROOMS LISTING PAGE  (/showrooms)
//  Shows cards for every city — clicking navigates to /showrooms/:city
// ══════════════════════════════════════════════════════════════════
export function ShowroomsListingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BRAND.navy, overflowX: "hidden" }}>
      <FontLink />
      {/* Simple top bar */}
      <div style={{ background: BRAND.navyMid, borderBottom: `1px solid ${BRAND.borderLight}`, padding: "6px 0" }}>
        <div style={W}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/" className="topbar-link" style={{ fontSize: 12 }}>← Back to Home</Link>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>☎ +91 96860 24365</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 900, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BRAND.borderLight}`, width: "100%" }}>
        <div style={{ ...W, display: "flex", alignItems: "center", height: 68 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: BRAND.white }}>MANICKBAG</div>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold }}>AUTOMOBILES PVT LTD</div>
          </Link>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn-gold" style={{ padding: "10px 24px", fontSize: 12, borderRadius: 2 }}><span>Book Test Drive</span></button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`, padding: "100px 0 72px", width: "100%" }}>
        <div style={W}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div className="gold-line" />
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.gold }}>Our Network</span>
          </div>
          <h1 className="cormorant" style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 300, color: BRAND.white, lineHeight: 1.1, marginBottom: 20 }}>
            12 Showrooms Across<br /><span className="gold-shimmer">North Karnataka</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.8 }}>
            Find your nearest Manickbag showroom. Click on any city to explore local offers, meet the team, and get directions.
          </p>
        </div>
      </section>

      <Ticker />

      {/* Cards grid */}
      <section style={{ background: BRAND.offWhite, padding: "72px 0", width: "100%" }}>
        <div style={W}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {Object.entries(SHOWROOM_DATA).map(([key, d], i) => (
              <Link key={key} to={`/showrooms/${key}`} style={{ textDecoration: "none" }}>
                <div className="location-card" style={{ background: BRAND.white, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
                  {/* Colour bar */}
                  <div style={{ height: 4, background: `linear-gradient(90deg,${BRAND.gold},${d.accentColor})` }} />
                  <div style={{ padding: "28px 28px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <h2 className="cormorant" style={{ fontSize: 32, fontWeight: 600, color: BRAND.navyMid, lineHeight: 1 }}>{d.cityName}</h2>
                        <div style={{ fontSize: 11, color: BRAND.gold, letterSpacing: "0.1em", marginTop: 4 }}>{d.tagline}</div>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${d.accentColor}22`, border: `2px solid ${d.accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📍</div>
                    </div>
                    <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, marginBottom: 16 }}>{d.address}</div>
                    <div style={{ fontSize: 13, color: BRAND.navyMid, marginBottom: 20 }}>📞 {d.phone}</div>
                    <div style={{ display: "flex", gap: 16, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      {d.stats.slice(0, 3).map(s => (
                        <div key={s.l}>
                          <div className="cormorant" style={{ fontSize: 22, fontWeight: 600, color: d.accentColor }}>{s.v}</div>
                          <div style={{ fontSize: 10, color: BRAND.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: BRAND.navyMid, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{d.outlets.length} outlet{d.outlets.length !== 1 ? "s" : ""}</span>
                    <span style={{ fontSize: 12, color: BRAND.gold, letterSpacing: "0.1em" }}>View Showroom →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  SHOWROOM PAGE (default export)  — route: /showrooms/:city
// ══════════════════════════════════════════════════════════════════
export default function ShowroomPage() {
  const { city } = useParams();
  const key = city?.toLowerCase();
  const data = SHOWROOM_DATA[key];

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll to top on city change
  useEffect(() => { window.scrollTo(0, 0); }, [key]);

  if (!data) return <NotFound />;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#ffffff", overflowX: "hidden" }}>
      <FontLink />
      <TopBar phone={data.phone} />
      <Navbar scrolled={scrolled} cityName={data.cityName} />
      {/* Offset for fixed navbar */}
      <div style={{ height: 105 }} />
      <Hero data={data} />
      <QuickInfo data={data} />
      <Ticker />
      <OffersSection data={data} />
      <VehiclesSection />
      <TeamSection data={data} />
      <MapSection data={data} />
      <OtherShowrooms currentKey={key} />
      <CTASection data={data} />
      <Footer />
      <FloatingWA data={data} />
    </div>
  );
}

/*
─────────────────────────────────────────────────────────────────
  ROUTING SETUP  (add to your App.jsx / router config)
─────────────────────────────────────────────────────────────────

  import ShowroomPage, { ShowroomsListingPage } from "./ShowroomPage";

  <Routes>
    <Route path="/"                  element={<Home />} />
    <Route path="/showrooms"         element={<ShowroomsListingPage />} />
    <Route path="/showrooms/:city"   element={<ShowroomPage />} />
    ...
  </Routes>

─────────────────────────────────────────────────────────────────
  LINK FROM HOME  (already in your showroomMenuItems)
─────────────────────────────────────────────────────────────────

  Cities without sub-outlets already use:
    <Link to={`/showrooms?city=${item.city}`} …>

  Change those to:
    <Link to={`/showrooms/${item.city.toLowerCase()}`} …>

  e.g.  "Bijapur" → /showrooms/bijapur
        "Gulbarga" → /showrooms/gulbarga

─────────────────────────────────────────────────────────────────
*/