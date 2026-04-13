import { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import useCricAPI from "./useCricAPI";

const B = {
  navy:"#031d44",navyMid:"#0c1f3f",navyLight:"#1a3d7c",
  red:"#C4302B",redDark:"#9b2422",
  gold:"#b8963e",goldLight:"#d4af5a",
  white:"#ffffff",offWhite:"#f7f5f0",offWhite2:"#f0ede8",
  muted:"#6b7280",mutedDark:"#4b5563",
  border:"rgba(10,31,63,0.1)",green:"#16a34a",
};
const W = { width:"100%", padding:"0 clamp(16px,4vw,48px)", maxWidth:1280, margin:"0 auto" };

const TEAMS = [
  {short:"CSK",name:"Chennai Super Kings",color:"#D4A800"},
  {short:"MI", name:"Mumbai Indians",color:"#004BA0"},
  {short:"RCB",name:"Royal Challengers Bengaluru",color:"#C4302B"},
  {short:"KKR",name:"Kolkata Knight Riders",color:"#3B215B"},
  {short:"DC", name:"Delhi Capitals",color:"#0078BC"},
  {short:"RR", name:"Rajasthan Royals",color:"#C4306B"},
  {short:"SRH",name:"Sunrisers Hyderabad",color:"#E05A00"},
  {short:"GT", name:"Gujarat Titans",color:"#6B8FB0"},
  {short:"LSG",name:"Lucknow Super Giants",color:"#A72058"},
  {short:"PBKS",name:"Punjab Kings",color:"#C4302B"},
];

const STATIC_MATCHES = [
  {id:1,team1:"RCB",team2:"CSK",date:"Apr 12",time:"7:30 PM",venue:"M. Chinnaswamy, Bengaluru",status:"live",t1Score:"186/4 (20)",t2Score:"142/6 (16.2)",liveStatus:"RCB bowling, 45 needed off 22",winner:null},
  {id:2,team1:"MI", team2:"KKR",date:"Apr 13",time:"3:30 PM",venue:"Wankhede, Mumbai",status:"upcoming",t1Score:null,t2Score:null,winner:null},
  {id:3,team1:"SRH",team2:"DC", date:"Apr 14",time:"7:30 PM",venue:"Rajiv Gandhi, Hyderabad",status:"upcoming",t1Score:null,t2Score:null,winner:null},
  {id:4,team1:"RR", team2:"GT", date:"Apr 15",time:"7:30 PM",venue:"Sawai Mansingh, Jaipur",status:"upcoming",t1Score:null,t2Score:null,winner:null},
  {id:5,team1:"LSG",team2:"PBKS",date:"Apr 16",time:"7:30 PM",venue:"BRSABV, Lucknow",status:"upcoming",t1Score:null,t2Score:null,winner:null},
  {id:6,team1:"RR", team2:"LSG",date:"Apr 10",time:"7:30 PM",venue:"Sawai Mansingh, Jaipur",status:"result",t1Score:"182/6 (20)",t2Score:"183/4 (19.3)",winner:"LSG"},
  {id:7,team1:"PBKS",team2:"GT",date:"Apr 11",time:"3:30 PM",venue:"Punjab Cricket, Mullanpur",status:"result",t1Score:"197/4 (20)",t2Score:"189/8 (20)",winner:"PBKS"},
  {id:8,team1:"KKR",team2:"MI",date:"Apr 9",time:"7:30 PM",venue:"Eden Gardens, Kolkata",status:"result",t1Score:"161/8 (20)",t2Score:"162/5 (18.4)",winner:"MI"},
  {id:9,team1:"DC",team2:"SRH",date:"Apr 8",time:"3:30 PM",venue:"Arun Jaitley, Delhi",status:"result",t1Score:"201/4 (20)",t2Score:"198/7 (20)",winner:"DC"},
  {id:10,team1:"CSK",team2:"RCB",date:"Apr 7",time:"7:30 PM",venue:"Chepauk, Chennai",status:"result",t1Score:"155/9 (20)",t2Score:"156/3 (17.2)",winner:"RCB"},
];

const STATIC_POINTS = [
  {pos:1,team:"RCB",p:9,w:7,l:2,nrr:"+1.245",pts:14},
  {pos:2,team:"MI", p:9,w:6,l:3,nrr:"+0.988",pts:12},
  {pos:3,team:"CSK",p:8,w:5,l:3,nrr:"+0.612",pts:10},
  {pos:4,team:"KKR",p:8,w:5,l:3,nrr:"+0.544",pts:10},
  {pos:5,team:"SRH",p:8,w:4,l:4,nrr:"+0.231",pts:8},
  {pos:6,team:"DC", p:9,w:4,l:5,nrr:"-0.120",pts:8},
  {pos:7,team:"RR", p:8,w:3,l:5,nrr:"-0.310",pts:6},
  {pos:8,team:"LSG",p:9,w:4,l:5,nrr:"-0.445",pts:8},
  {pos:9,team:"GT", p:8,w:2,l:6,nrr:"-0.782",pts:4},
  {pos:10,team:"PBKS",p:9,w:3,l:6,nrr:"-0.963",pts:6},
];

// ── NEW: All IPL seasons history ───────────────────────────────────────
const IPL_SEASONS = [
  {year:2026,winner:"TBD",  runnerUp:"TBD",  matches:74,topBat:"V.Kohli (RCB)",       topBowl:"J.Bumrah (MI)"},
  {year:2025,winner:"MI",   runnerUp:"SRH",  matches:74,topBat:"R.Garg (SRH)",         topBowl:"H.Tyagi (GT)"},
  {year:2024,winner:"KKR",  runnerUp:"SRH",  matches:74,topBat:"V.Kohli (RCB)",        topBowl:"H.Tyagi (GT)"},
  {year:2023,winner:"CSK",  runnerUp:"GT",   matches:74,topBat:"F.du Plessis (RCB)",   topBowl:"M.Shami (GT)"},
  {year:2022,winner:"GT",   runnerUp:"RR",   matches:74,topBat:"J.Butler (RR)",         topBowl:"Y.Chahal (RR)"},
  {year:2021,winner:"CSK",  runnerUp:"KKR",  matches:60,topBat:"R.Gaikwad (CSK)",      topBowl:"H.Patel (RCB)"},
  {year:2020,winner:"MI",   runnerUp:"DC",   matches:60,topBat:"K.Rahul (PBKS)",       topBowl:"K.Rabada (DC)"},
  {year:2019,winner:"MI",   runnerUp:"CSK",  matches:60,topBat:"D.Warner (SRH)",       topBowl:"I.Sharma (MI)"},
  {year:2018,winner:"CSK",  runnerUp:"SRH",  matches:60,topBat:"K.S.Williamson (SRH)", topBowl:"A.Mishra (DC)"},
  {year:2017,winner:"MI",   runnerUp:"RPS",  matches:59,topBat:"D.Warner (SRH)",       topBowl:"B.Kumar (SRH)"},
  {year:2016,winner:"SRH",  runnerUp:"RCB",  matches:60,topBat:"V.Kohli (RCB)",        topBowl:"B.Kumar (SRH)"},
  {year:2015,winner:"MI",   runnerUp:"CSK",  matches:59,topBat:"D.Warner (SRH)",       topBowl:"D.Steyn (SRH)"},
  {year:2014,winner:"KKR",  runnerUp:"PBKS", matches:60,topBat:"R.Sharma (MI)",        topBowl:"M.Morkel (KKR)"},
  {year:2013,winner:"MI",   runnerUp:"CSK",  matches:76,topBat:"M.Hussey (CSK)",       topBowl:"D.Bravo (CSK)"},
  {year:2012,winner:"KKR",  runnerUp:"CSK",  matches:76,topBat:"C.Gayle (RCB)",        topBowl:"M.Morkel (DD)"},
  {year:2011,winner:"CSK",  runnerUp:"RCB",  matches:73,topBat:"C.Gayle (RCB)",        topBowl:"L.Malinga (MI)"},
  {year:2010,winner:"CSK",  runnerUp:"MI",   matches:60,topBat:"S.Raina (CSK)",        topBowl:"P.Kumar (RCB)"},
  {year:2009,winner:"DC",   runnerUp:"RCB",  matches:57,topBat:"M.Hayden (CSK)",       topBowl:"R.Sharma (DC)"},
  {year:2008,winner:"RR",   runnerUp:"CSK",  matches:58,topBat:"S.Dhawan (DC)",        topBowl:"S.Bond (KKR)"},
];

// ── NEW: Team all-time records ─────────────────────────────────────────
const TEAMS_ALL_TIME = [
  {short:"CSK", titles:5, p:176,w:113,l:59},
  {short:"MI",  titles:5, p:246,w:143,l:99},
  {short:"RCB", titles:0, p:247,w:115,l:130},
  {short:"KKR", titles:3, p:241,w:121,l:116},
  {short:"SRH", titles:1, p:149,w:78, l:69},
  {short:"DC",  titles:0, p:240,w:112,l:124},
  {short:"RR",  titles:1, p:199,w:95, l:99},
  {short:"GT",  titles:1, p:62, w:35, l:26},
  {short:"LSG", titles:0, p:58, w:28, l:29},
  {short:"PBKS",titles:0, p:235,w:106,l:127},
];

const NEWS = [
  {id:1,tag:"Match Report",headline:"RCB stun CSK in a last-over thriller at Chinnaswamy",summary:"Virat Kohli's unbeaten 82 off 48 balls guided Royal Challengers to a stunning 4-wicket victory in the final over.",time:"12 Apr · 4 min read",accent:B.red,img:"https://images.unsplash.com/photo-1540747913346-19212a4b26d7?w=700&q=80"},
  {id:2,tag:"Interview",headline:"Rohit: 'We have the firepower to win the title this year'",summary:"Mumbai Indians skipper opens up about the team's preparations and campaign so far.",time:"11 Apr · 3 min read",accent:B.gold,img:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=80"},
  {id:3,tag:"Stats",headline:"Kohli reaches 1000 fours in T20 cricket — a first",summary:"Virat Kohli became the first batter to hit 1000 fours across all T20 cricket.",time:"10 Apr · 2 min read",accent:B.navyLight,img:"https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=700&q=80"},
  {id:4,tag:"Preview",headline:"MI vs KKR — who has the edge at Wankhede?",summary:"Deep dive into form, head-to-head records and key player battles ahead of Sunday's blockbuster.",time:"9 Apr · 5 min read",accent:B.red,img:"https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=700&q=80"},
];

// ── NEW: 6 highlight videos ────────────────────────────────────────────
const VIDEOS = [
  {id:"v1",title:"RCB vs CSK — Full Match Highlights",duration:"18:42",thumb:"https://images.unsplash.com/photo-1540747913346-19212a4b26d7?w=600&q=80",ytId:"tV4RbUnBFxE"},
  {id:"v2",title:"Bumrah 5-Wicket Masterclass vs GT",duration:"9:31",thumb:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80",ytId:"tV4RbUnBFxE"},
  {id:"v3",title:"Top 10 Catches of IPL 2026",duration:"6:14",thumb:"https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80",ytId:"tV4RbUnBFxE"},
  {id:"v4",title:"KKR vs MI — Super Over Thriller",duration:"22:10",thumb:"https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&q=80",ytId:"tV4RbUnBFxE"},
  {id:"v5",title:"Kohli Reaches 1000 T20 Fours — Milestone",duration:"4:22",thumb:"https://images.unsplash.com/photo-1540747913346-19212a4b26d7?w=600&q=80",ytId:"tV4RbUnBFxE"},
  {id:"v6",title:"SRH vs RR — Battle of the Bowlers",duration:"17:55",thumb:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80",ytId:"tV4RbUnBFxE"},
];

const SLIDES = [
  {eyebrow:"IPL 2026 · Season Live",title1:"The Greatest",title2:"T20 Show\nOn Earth",sub:"10 teams. 74 matches. One trophy.",cta:"Watch Highlights",bg:`linear-gradient(135deg,${B.navy} 0%,#0e0e24 60%,${B.navyMid} 100%)`,img:"https://images.unsplash.com/photo-1540747913346-19212a4b26d7?w=1400&q=80"},
  {eyebrow:"RCB vs CSK · April 12 · 7:30 PM",title1:"Epic Rivalry",title2:"Returns",sub:"The most passionate derby in Indian cricket.",cta:"Get Tickets",bg:`linear-gradient(135deg,#1a0505 0%,#2a0a08 60%,${B.navyMid} 100%)`,img:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&q=80"},
  {eyebrow:"Orange Cap Leader",title1:"King Kohli",title2:"Leads the\nPack",sub:"412 runs this season — and counting.",cta:"View Stats",bg:`linear-gradient(135deg,${B.navy} 0%,#1a2040 60%,#0e1535 100%)`,img:"https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1400&q=80"},
];

const teamColor = s => TEAMS.find(t=>t.short===s)?.color||B.gold;
const teamName  = s => TEAMS.find(t=>t.short===s)?.name||s;

const SL = ({label}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
    <div style={{width:3,height:18,background:B.red}}/>
    <span style={{fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:B.gold,fontWeight:600}}>{label}</span>
  </div>
);
const H2s = {fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:B.navyMid,marginBottom:0};

const IPLStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600&display=swap');
    *{box-sizing:border-box}
    @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes heroZoom{from{transform:scale(1.06)}to{transform:scale(1)}}

    .gold-text{background:linear-gradient(90deg,${B.gold},${B.goldLight},${B.gold},${B.goldLight});background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
    .live-dot{width:8px;height:8px;border-radius:50%;background:${B.green};animation:liveDot 1.2s ease-in-out infinite;display:inline-block;flex-shrink:0}
    .spinner{width:16px;height:16px;border:2px solid ${B.border};border-top-color:${B.gold};border-radius:50%;animation:spin .8s linear infinite;display:inline-block}

    .match-card{background:${B.white};border:1px solid ${B.border};border-radius:4px;overflow:hidden;cursor:pointer;transition:all .3s}
    .match-card:hover{border-color:${B.gold};transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.1)}
    .match-card.live{border-color:${B.green};box-shadow:0 0 0 2px ${B.green}22}

    .tab-btn{padding:9px 22px;font-family:'Jost',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:none;transition:all .25s;border-radius:2px}
    .tab-btn.active{background:${B.red};color:#fff}
    .tab-btn.live-active{background:${B.green};color:#fff}
    .tab-btn.inactive{background:${B.offWhite};color:${B.muted};border:1px solid ${B.border}}
    .tab-btn:hover{background:${B.red};color:#fff}

    .pts-row{transition:background .2s;cursor:pointer}
    .pts-row:hover{background:rgba(184,150,62,.08)!important}

    .btn-red{background:${B.red};color:#fff;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:background .3s;border-radius:2px}
    .btn-red:hover{background:${B.redDark}}
    .btn-outline{background:transparent;border:1px solid ${B.gold};color:${B.gold};cursor:pointer;font-family:'Jost',sans-serif;font-weight:500;letter-spacing:.08em;text-transform:uppercase;transition:all .25s;border-radius:2px}
    .btn-outline:hover{background:${B.gold};color:${B.navy}}
    .btn-outline-navy{background:transparent;border:1px solid ${B.navyMid};color:${B.navyMid};cursor:pointer;font-family:'Jost',sans-serif;font-weight:500;letter-spacing:.08em;text-transform:uppercase;transition:all .25s;border-radius:2px}
    .btn-outline-navy:hover{background:${B.navyMid};color:#fff}
    .team-pill{display:inline-flex;align-items:center;gap:10px;background:${B.white};border:1px solid ${B.border};padding:10px 18px;border-radius:2px;cursor:pointer;transition:all .25s;font-size:13px;font-weight:500;text-decoration:none;color:${B.navyMid}}
    .team-pill:hover{background:${B.offWhite};border-color:${B.gold}}

    .news-card{cursor:pointer;overflow:hidden;border-radius:4px;transition:all .3s;background:${B.white};border:1px solid ${B.border};height:100%}
    .news-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.1)}
    .news-card:hover .nimg{transform:scale(1.06)}
    .nimg{transition:transform .5s ease;width:100%;height:100%;object-fit:cover;display:block}

    .vid-card{cursor:pointer;overflow:hidden;border-radius:4px;transition:all .3s;background:${B.navyMid};border:1px solid rgba(255,255,255,.06)}
    .vid-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3)}
    .vid-card:hover .vimg{transform:scale(1.06)}
    .vimg{transition:transform .5s ease;width:100%;height:100%;object-fit:cover;display:block}

    .hero-content{animation:fadeUp .7s ease forwards}
    .hero-bg{animation:heroZoom 8s ease forwards}

    .season-row:hover{background:rgba(184,150,62,.06)!important}
    .vid-scroll-wrap{overflow:hidden;position:relative}
    .vid-scroll-inner{display:flex;gap:16px;transition:transform .45s ease}
    .vid-scroll-inner .vid-card{min-width:280px;flex-shrink:0}
    .team-stat-card{background:${B.white};border:1px solid ${B.border};border-radius:4px;padding:16px;transition:all .25s;cursor:pointer}
    .team-stat-card:hover{border-color:${B.gold};transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.07)}
  `}</style>
);

// ── Live Status Bar ────────────────────────────────────────────────────
const LiveStatusBar = ({loading,error,lastUpdated,liveCount,apiConnected,refetch}) => {
  const fmt = d => d?.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  return (
    <div style={{background:B.navyMid,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
      <div style={{...W,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {liveCount>0&&<div style={{display:"flex",alignItems:"center",gap:6}}><span className="live-dot"/><span style={{fontSize:11,color:B.green,fontWeight:700,letterSpacing:".12em"}}>{liveCount} LIVE</span></div>}
          {loading&&<div style={{display:"flex",alignItems:"center",gap:6}}><span className="spinner"/><span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Fetching scores…</span></div>}
          {error&&!loading&&<span style={{fontSize:11,color:"#fbbf24"}}>⚠ Static data (API unavailable)</span>}
          {!loading&&!error&&lastUpdated&&<span style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>Updated {fmt(lastUpdated)}</span>}
          {/* NEW: API status indicator */}
          {!loading&&<span style={{fontSize:10,color:apiConnected?"#4ade80":"rgba(255,255,255,.2)",marginLeft:4}}>
            {apiConnected?"● Live API":"● Static"}
          </span>}
        </div>
        <button onClick={refetch} style={{background:"transparent",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.4)",fontSize:10,padding:"4px 12px",cursor:"pointer",borderRadius:2,fontFamily:"'Jost',sans-serif",letterSpacing:".08em"}}>↻ Refresh</button>
      </div>
    </div>
  );
};

// ── Hero (unchanged) ───────────────────────────────────────────────────
const Hero = ({liveMatches}) => {
  const [slide,setSlide] = useState(0);
  const goTo = i => setSlide(i);
  useEffect(()=>{
    const t=setInterval(()=>setSlide(s=>(s+1)%SLIDES.length),6000);
    return()=>clearInterval(t);
  },[]);
  const s = SLIDES[slide];
  return (
    <section style={{minHeight:"72vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
      <div key={`bg${slide}`} className="hero-bg" style={{position:"absolute",inset:0,backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center",zIndex:0}}/>
      <div style={{position:"absolute",inset:0,background:s.bg,opacity:.88,zIndex:1}}/>
      <div style={{position:"absolute",right:"-1%",bottom:"4%",opacity:.03,zIndex:1,userSelect:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:220,fontWeight:700,color:B.gold,lineHeight:1}}>IPL</div>
      {[...Array(5)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",background:B.gold,opacity:.3,left:`${8+i*16}%`,top:`${20+(i%3)*22}%`,animation:`pulse ${2+i*.3}s ease-in-out infinite`,animationDelay:`${i*.4}s`,zIndex:2}}/>
      ))}
      {liveMatches.length>0&&(
        <div style={{position:"absolute",top:0,left:0,right:0,background:`${B.green}20`,borderBottom:`1px solid ${B.green}50`,padding:"7px 0",zIndex:4}}>
          <div style={{...W,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}><span className="live-dot"/><span style={{fontSize:10,fontWeight:700,letterSpacing:".18em",color:B.green}}>LIVE NOW</span></div>
            {liveMatches.map(m=>(
              <span key={m.id} style={{fontSize:12,color:"rgba(255,255,255,.85)",fontFamily:"'Jost',sans-serif"}}>
                <strong style={{color:B.gold}}>{m.team1}</strong> {m.t1Score||"—"} <span style={{opacity:.5}}>vs</span> <strong style={{color:B.gold}}>{m.team2}</strong> {m.t2Score||"—"}
                {m.liveStatus&&<span style={{color:"rgba(255,255,255,.45)",marginLeft:8,fontSize:11}}>· {m.liveStatus}</span>}
              </span>
            ))}
          </div>
        </div>
      )}
      <div key={`c${slide}`} className="hero-content" style={{...W,paddingTop:liveMatches.length>0?96:64,paddingBottom:80,position:"relative",zIndex:3}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:3,height:16,background:B.red}}/>
          <span style={{fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:B.gold,fontWeight:600}}>{s.eyebrow}</span>
        </div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(52px,9vw,110px)",fontWeight:700,lineHeight:.93,color:B.white,marginBottom:22,whiteSpace:"pre-line"}}>
          <span className="gold-text">{s.title1}</span>{"\n"}
          <span>{s.title2}</span>
        </h1>
        <div style={{width:52,height:3,background:B.red,marginBottom:18}}/>
        <p style={{fontSize:17,lineHeight:1.65,color:"rgba(255,255,255,.6)",maxWidth:460,marginBottom:32,fontFamily:"'Jost',sans-serif"}}>{s.sub}</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button className="btn-red" style={{padding:"13px 32px",fontSize:12}}>{s.cta}</button>
          <button className="btn-outline" style={{padding:"13px 32px",fontSize:12}}>Points Table</button>
        </div>
        <div style={{display:"flex",gap:40,marginTop:52,paddingTop:22,borderTop:"1px solid rgba(255,255,255,.07)",flexWrap:"wrap"}}>
          {[{v:"18",l:"Seasons"},{v:"74",l:"Matches 2026"},{v:"10",l:"Teams"},{v:"₹1200Cr",l:"Prize Pool"}].map(st=>(
            <div key={st.l}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:B.gold,lineHeight:1}}>{st.v}</div>
              <div style={{fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginTop:4}}>{st.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:5}}>
        {SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>goTo(i)} style={{width:i===slide?28:8,height:8,border:"none",cursor:"pointer",background:i===slide?B.red:"rgba(255,255,255,.2)",borderRadius:4,transition:"all .35s",padding:0}}/>
        ))}
      </div>
      {[[-1,"‹"],[1,"›"]].map(([d,ch])=>(
        <button key={d} onClick={()=>goTo((slide+d+SLIDES.length)%SLIDES.length)}
          style={{position:"absolute",top:"50%",transform:"translateY(-50%)",zIndex:5,[d===-1?"left":"right"]:20,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.7)",width:44,height:44,borderRadius:2,cursor:"pointer",fontSize:22,lineHeight:"44px",textAlign:"center",padding:0}}>
          {ch}
        </button>
      ))}
    </section>
  );
};

// ── Matches (unchanged) ────────────────────────────────────────────────
const MatchCard = ({m}) => {
  const isR=m.status==="result",isL=m.status==="live";
  const hBg=isL?B.green:isR?B.navyMid:B.red;
  return (
    <div className={`match-card${isL?" live":""}`}>
      <div style={{background:hBg,padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {isL&&<span className="live-dot"/>}
          <span style={{fontSize:10,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.9)"}}>{isL?"Live":isR?"Result":"Upcoming"}</span>
        </div>
        <span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>{m.date} · {m.time}</span>
      </div>
      <div style={{padding:"18px 16px"}}>
        {[m.team1,m.team2].map((t,idx)=>(
          <div key={`${t}${idx}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:idx===0?14:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:`${teamColor(t)}15`,border:`2px solid ${teamColor(t)}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,fontWeight:800,color:teamColor(t)}}>{t}</span>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:(isR||isL)&&m.winner===t?B.gold:B.navyMid}}>{t}</div>
                <div style={{fontSize:10,color:B.muted}}>{teamName(t).split(" ").slice(-1)[0]}</div>
              </div>
            </div>
            {(isR||isL)&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:m.winner===t?B.gold:B.muted}}>{idx===0?(m.t1Score||"—"):(m.t2Score||"—")}</div>}
          </div>
        ))}
        {isR&&<div style={{marginTop:14,padding:"8px 12px",background:`${B.gold}12`,borderLeft:`3px solid ${B.gold}`}}><span style={{fontSize:11,color:B.gold,fontWeight:600}}>{m.winner?`${m.winner} won`:"Match complete"}</span></div>}
        {isL&&m.liveStatus&&<div style={{marginTop:14,padding:"8px 12px",background:`${B.green}10`,borderLeft:`3px solid ${B.green}`}}><span style={{fontSize:11,color:B.green,fontWeight:600}}>{m.liveStatus}</span></div>}
        {!isR&&!isL&&<div style={{marginTop:14,fontSize:11,color:B.muted}}>📍 {m.venue}</div>}
      </div>
    </div>
  );
};

const Matches = ({matches,loading}) => {
  const [tab,setTab] = useState("upcoming");
  const lN = matches.filter(m=>m.status==="live").length;
  const tabs = [...(lN>0?[{key:"live",label:`Live (${lN})`}]:[]),{key:"upcoming",label:"Upcoming"},{key:"result",label:"Results"}];
  const filtered = matches.filter(m=>m.status===tab);
  useEffect(()=>{ if(lN>0) setTab("live"); },[lN]);
  return (
    <section style={{background:B.offWhite,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
      <div style={W}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div><SL label="Schedule & Results"/><h2 style={H2s}>Matches</h2></div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {tabs.map(t=><button key={t.key} className={`tab-btn ${tab===t.key?(t.key==="live"?"live-active":"active"):"inactive"}`} onClick={()=>setTab(t.key)}>{t.label}</button>)}
          </div>
        </div>
        {loading&&matches.length===0
          ?<div style={{textAlign:"center",padding:"48px 0"}}><span className="spinner" style={{width:24,height:24}}/><p style={{marginTop:12,fontSize:13,color:B.muted}}>Loading scores…</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
            {(filtered.length?filtered:matches.slice(0,4)).map(m=><MatchCard key={m.id} m={m}/>)}
          </div>}
        <div style={{textAlign:"center",marginTop:28}}>
          <button className="btn-outline-navy" style={{padding:"10px 28px",fontSize:11}}>View Full Schedule →</button>
        </div>
      </div>
    </section>
  );
};

// ── Points Table (unchanged logic, shows all IPL seasons summary) ──────
const PointsTable = () => {
  const [points,setPoints]     = useState(STATIC_POINTS);
  const [loading,setLoading]   = useState(false);
  const [expanded,setExpanded] = useState(false);
  const [lastFetch,setLastFetch] = useState(null);
  const [apiOk,setApiOk]       = useState(false);

  const loadPoints = async () => {
    setLoading(true);
    try {
      const r1 = await fetch(`https://api.cricapi.com/v1/series?apikey=60f9da30-fcf7-41a2-be9d-257b281cc8cc&offset=0&search=IPL`);
      const d1 = await r1.json();
      const series = d1?.data?.filter(s=>/ipl|indian premier league/i.test(s.name)).sort((a,b)=>new Date(b.startDate)-new Date(a.startDate))[0];
      if (!series) throw new Error("IPL series not found");
      const r2 = await fetch(`https://api.cricapi.com/v1/series_points?apikey=60f9da30-fcf7-41a2-be9d-257b281cc8cc&id=${series.id}`);
      const d2 = await r2.json();
      const TM={"Chennai Super Kings":"CSK","Mumbai Indians":"MI","Royal Challengers Bengaluru":"RCB","Royal Challengers Bangalore":"RCB","Kolkata Knight Riders":"KKR","Delhi Capitals":"DC","Rajasthan Royals":"RR","Sunrisers Hyderabad":"SRH","Gujarat Titans":"GT","Lucknow Super Giants":"LSG","Punjab Kings":"PBKS"};
      if (d2?.status==="success" && Array.isArray(d2.data) && d2.data.length>0) {
        const mapped = d2.data
          .sort((a,b)=>(b.points||b.pts||0)-(a.points||a.pts||0))
          .map((row,i)=>{
            const n=row.teamName||row.team||"";
            const team=TM[n]||n.split(" ").map(w=>w[0]).join("").toUpperCase();
            const nrr=row.nrr!=null?(parseFloat(row.nrr)>=0?"+":"")+parseFloat(row.nrr).toFixed(3):"0.000";
            return {pos:i+1,team,p:row.played||row.matchesPlayed||row.p||0,w:row.won||row.w||0,l:row.lost||row.l||0,nrr,pts:row.points||row.pts||0};
          });
        setPoints(mapped);
        setLastFetch(new Date());
        setApiOk(true);
      }
    } catch(e) { console.warn("[PointsTable] fallback:", e.message); setApiOk(false); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ loadPoints(); },[]);

  const shown = expanded ? points : points.slice(0,6);
  const fmt = d => d?.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

  return (
    <section style={{background:B.white,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
      <div style={W}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <SL label="IPL 2026"/>
            <h2 style={H2s}>Points Table</h2>
            {lastFetch&&<div style={{fontSize:11,color:B.muted,marginTop:4}}>
              {apiOk?"✓ Live — ":"⚠ Static — "}Updated {fmt(lastFetch)}
            </div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {loading&&<span className="spinner"/>}
            <button className="btn-outline" style={{padding:"9px 22px",fontSize:11}} onClick={loadPoints}>↻ Refresh</button>
            <button className="btn-outline" style={{padding:"9px 22px",fontSize:11}} onClick={()=>setExpanded(e=>!e)}>
              {expanded?"Collapse ↑":"Full Table →"}
            </button>
          </div>
        </div>
        <div style={{border:`1px solid ${B.border}`,borderRadius:4,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"40px 1fr 40px 40px 40px 80px 60px",padding:"10px 20px",background:B.navyMid}}>
            {["#","Team","P","W","L","NRR","Pts"].map(h=>(
              <div key={h} style={{fontSize:10,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",textAlign:h==="Team"?"left":"center"}}>{h}</div>
            ))}
          </div>
          {shown.map((row,i)=>(
            <div key={`${row.team}${i}`} className="pts-row"
              style={{display:"grid",gridTemplateColumns:"40px 1fr 40px 40px 40px 80px 60px",padding:"11px 20px",borderBottom:i<shown.length-1?`1px solid ${B.border}`:"none",background:i<4?`${B.gold}07`:B.white}}>
              <div style={{fontSize:13,color:i<4?B.gold:B.muted,fontWeight:700,textAlign:"center"}}>{row.pos}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:`${teamColor(row.team)}15`,border:`1.5px solid ${teamColor(row.team)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:7,fontWeight:800,color:teamColor(row.team)}}>{row.team}</span>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:B.navyMid}}>{row.team}</div>
                  <div style={{fontSize:9,color:B.muted}}>{teamName(row.team)}</div>
                </div>
              </div>
              {[row.p,row.w,row.l].map((v,j)=>(
                <div key={j} style={{fontSize:13,color:B.mutedDark,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>{v}</div>
              ))}
              <div style={{fontSize:12,color:String(row.nrr).startsWith("+")?B.gold:B.red,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{row.nrr}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:i<4?B.gold:B.navyMid,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>{row.pts}</div>
            </div>
          ))}
        </div>
        {!expanded&&<div style={{textAlign:"center",marginTop:10,fontSize:11,color:B.muted,cursor:"pointer"}} onClick={()=>setExpanded(true)}>Show all {points.length} teams ↓</div>}
        <p style={{fontSize:11,color:B.muted,marginTop:10}}>★ Top 4 qualify for playoffs · NRR = Net Run Rate</p>
      </div>
    </section>
  );
};

// ── NEW: All IPL Seasons History ───────────────────────────────────────
const SeasonsHistory = () => {
  // Compute title counts per team for summary bar
  const titleCount = {};
  IPL_SEASONS.filter(s=>s.winner!=="TBD").forEach(s=>{
    titleCount[s.winner]=(titleCount[s.winner]||0)+1;
  });
  const sorted = Object.entries(titleCount).sort((a,b)=>b[1]-a[1]);

  return (
    <section style={{background:B.offWhite,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
      <div style={W}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div><SL label="2008 – 2026"/><h2 style={H2s}>All IPL Seasons</h2></div>
        </div>

        {/* Title tally */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:32}}>
          {sorted.map(([t,c])=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:8,background:B.white,border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 14px"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:`${teamColor(t)}15`,border:`1.5px solid ${teamColor(t)}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:7,fontWeight:800,color:teamColor(t)}}>{t}</span>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:B.navyMid}}>{t}</span>
              <span style={{fontSize:11,color:B.gold,fontWeight:700}}>🏆 {c}</span>
            </div>
          ))}
        </div>

        {/* Seasons table */}
        <div style={{border:`1px solid ${B.border}`,borderRadius:4,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr 60px 1fr 1fr",padding:"10px 20px",background:B.navyMid}}>
            {["Year","Winner","Runner-Up","Matches","Top Bat","Top Bowl"].map(h=>(
              <div key={h} style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.5)"}}>{h}</div>
            ))}
          </div>
          {IPL_SEASONS.map((s,i)=>(
            <div key={s.year} className="season-row"
              style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr 60px 1fr 1fr",padding:"11px 20px",borderBottom:i<IPL_SEASONS.length-1?`1px solid ${B.border}`:"none",background:i%2===0?B.white:B.offWhite,alignItems:"center"}}>
              <div style={{fontSize:12,fontWeight:700,color:B.gold}}>{s.year}</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {s.winner==="TBD"
                  ?<span style={{fontSize:11,color:B.muted,fontStyle:"italic"}}>In Progress</span>
                  :<><div style={{width:20,height:20,borderRadius:"50%",background:`${teamColor(s.winner)}15`,border:`1.5px solid ${teamColor(s.winner)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:6,fontWeight:800,color:teamColor(s.winner)}}>{s.winner}</span></div><span style={{fontSize:12,fontWeight:600,color:B.navyMid}}>{s.winner}</span></>
                }
              </div>
              <div style={{fontSize:12,color:B.mutedDark}}>{s.runnerUp==="TBD"?"TBD":s.runnerUp}</div>
              <div style={{fontSize:12,color:B.muted,textAlign:"center"}}>{s.matches}</div>
              <div style={{fontSize:11,color:B.mutedDark}}>{s.topBat}</div>
              <div style={{fontSize:11,color:B.mutedDark}}>{s.topBowl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── NEW: Team total match stats ────────────────────────────────────────
const TeamStats = () => (
  <section style={{background:B.white,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
    <div style={W}>
      <div style={{marginBottom:32}}><SL label="All Time"/><h2 style={H2s}>Team Records</h2></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {TEAMS_ALL_TIME.map(t=>{
          const winPct = Math.round(t.w/t.p*100);
          return (
            <div key={t.short} className="team-stat-card" style={{borderTop:`3px solid ${teamColor(t.short)}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:`${teamColor(t.short)}15`,border:`2px solid ${teamColor(t.short)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:8,fontWeight:800,color:teamColor(t.short)}}>{t.short}</span>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:B.navyMid}}>{teamName(t.short).split(" ").slice(0,2).join(" ")}</div>
                  {t.titles>0&&<div style={{fontSize:10,color:B.gold}}>🏆 {t.titles} title{t.titles>1?"s":""}</div>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:10}}>
                {[["P",t.p],["W",t.w],["L",t.l]].map(([l,v])=>(
                  <div key={l} style={{textAlign:"center",background:B.offWhite,borderRadius:2,padding:"6px 0"}}>
                    <div style={{fontSize:16,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:l==="W"?B.green:l==="L"?B.red:B.navyMid}}>{v}</div>
                    <div style={{fontSize:9,color:B.muted,letterSpacing:".1em"}}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Win rate bar */}
              <div style={{height:4,background:B.offWhite,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${winPct}%`,background:teamColor(t.short),borderRadius:2}}/>
              </div>
              <div style={{fontSize:10,color:B.muted,marginTop:4}}>Win rate {winPct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ── Cap Section (unchanged) ────────────────────────────────────────────
const CapSection = () => (
  <section style={{background:B.offWhite,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
    <div style={W}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
        {[
          {cap:"Orange Cap",color:"#E05A00",leader:"Virat Kohli",team:"RCB",val:"412",unit:"runs",others:[{n:"KL Rahul",v:"388"},{n:"Rohit Sharma",v:"361"},{n:"Shubman Gill",v:"344"}]},
          {cap:"Purple Cap",color:"#6B3FA0",leader:"Jasprit Bumrah",team:"MI",val:"14",unit:"wkts",others:[{n:"Mohammed Siraj",v:"12"},{n:"Rashid Khan",v:"11"},{n:"Y. Chahal",v:"10"}]},
        ].map(cap=>(
          <div key={cap.cap} style={{background:B.white,border:`1px solid ${B.border}`,borderRadius:4,overflow:"hidden"}}>
            <div style={{background:`${cap.color}10`,borderBottom:`3px solid ${cap.color}`,padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:cap.color,marginBottom:6,fontWeight:700}}>{cap.cap}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:B.navyMid,margin:0}}>{cap.leader}</h3>
                <div style={{fontSize:11,color:B.muted,marginTop:2}}>{cap.team}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,color:cap.color,lineHeight:1}}>{cap.val}</div>
                <div style={{fontSize:10,color:cap.color,opacity:.7,letterSpacing:".1em",textTransform:"uppercase"}}>{cap.unit}</div>
              </div>
            </div>
            <div style={{padding:"14px 24px"}}>
              {cap.others.map((o,i)=>(
                <div key={o.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<cap.others.length-1?`1px solid ${B.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:11,color:B.muted,minWidth:18}}>{i+2}.</span>
                    <span style={{fontSize:13,color:B.navyMid,fontWeight:500}}>{o.n}</span>
                  </div>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:cap.color}}>{o.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── News (unchanged) ───────────────────────────────────────────────────
const NewsCard = ({item,big}) => (
  <div className="news-card">
    <div style={{height:big?240:165,overflow:"hidden",position:"relative"}}>
      <img src={item.img} alt={item.tag} className="nimg" onError={e=>{e.target.style.display="none"}}/>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${B.navyMid}80,transparent)`}}/>
      <div style={{position:"absolute",bottom:12,left:14}}>
        <span style={{background:item.accent,padding:"3px 10px",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#fff",borderRadius:2}}>{item.tag}</span>
      </div>
    </div>
    <div style={{padding:big?"18px 20px":"14px 16px"}}>
      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:big?"clamp(17px,2vw,22px)":"15px",fontWeight:600,color:B.navyMid,lineHeight:1.35,marginBottom:8}}>{item.headline}</h3>
      {big&&<p style={{fontSize:13,color:B.muted,lineHeight:1.6,marginBottom:10}}>{item.summary}</p>}
      <div style={{fontSize:11,color:B.muted}}>{item.time}</div>
    </div>
  </div>
);

const News = () => (
  <section style={{background:B.offWhite,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
    <div style={W}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
        <div><SL label="Latest"/><h2 style={H2s}>News & Analysis</h2></div>
        <button className="btn-outline" style={{padding:"9px 22px",fontSize:11}}>All News →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",gridTemplateRows:"auto auto",gap:16}}>
        <div style={{gridRow:"1/3"}}><NewsCard item={NEWS[0]} big/></div>
        <NewsCard item={NEWS[1]}/>
        <NewsCard item={NEWS[2]}/>
        <div style={{gridColumn:"2/4"}}><NewsCard item={NEWS[3]}/></div>
      </div>
    </div>
  </section>
);

// ── NEW: Videos — 6 cards, auto-scroll carousel, image thumbnails ──────
const VideoCard = ({v,onPlay}) => (
  <div className="vid-card" onClick={()=>onPlay(v)}>
    <div style={{position:"relative",cursor:"pointer"}}>
      <div style={{height:190,overflow:"hidden"}}>
        <img src={v.thumb} alt={v.title} className="vimg" onError={e=>{e.target.style.background=B.navyMid}}/>
      </div>
      <div style={{position:"absolute",inset:0,background:"rgba(3,29,68,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:B.red,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${B.red}80`}}>
          <span style={{color:"#fff",fontSize:20,marginLeft:4}}>▶</span>
        </div>
      </div>
      <div style={{position:"absolute",bottom:10,right:12,background:"rgba(0,0,0,.7)",padding:"3px 8px",borderRadius:2,fontSize:11,color:"#fff"}}>{v.duration}</div>
    </div>
    <div style={{padding:"14px 16px"}}>
      <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.9)",lineHeight:1.4,fontFamily:"'Jost',sans-serif"}}>{v.title}</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:6}}>IPL 2026 · Official Highlights</div>
    </div>
  </div>
);

const Videos = () => {
  const [offset,setOffset]   = useState(0);
  const [playing,setPlaying] = useState(null); // {ytId, title}
  const autoRef              = useRef(null);
  const CARD_W               = 296; // card width + gap

  const startAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(()=>{
      setOffset(o=>(o+1)%VIDEOS.length);
    },3500);
  };

  useEffect(()=>{ startAuto(); return()=>clearInterval(autoRef.current); },[]);

  const scroll = dir => {
    setOffset(o=>(o+dir+VIDEOS.length)%VIDEOS.length);
    startAuto(); // reset timer on manual scroll
  };

  const handlePlay = v => {
    clearInterval(autoRef.current);
    setPlaying(v);
  };

  const handleClose = () => {
    setPlaying(null);
    startAuto();
  };

  return (
    <section style={{background:B.navyMid,padding:"72px 0",borderTop:"1px solid rgba(255,255,255,.06)"}}>
      <div style={W}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:3,height:18,background:B.red}}/><span style={{fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:B.gold,fontWeight:600}}>Highlights</span></div>
            <h2 style={{...H2s,color:B.white}}>Watch & Replay</h2>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>scroll(-1)} style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:16}}>‹</button>
            <button onClick={()=>scroll(1)}  style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:16}}>›</button>
          </div>
        </div>

        {/* Scrolling carousel */}
        <div className="vid-scroll-wrap">
          <div className="vid-scroll-inner" style={{transform:`translateX(-${offset*CARD_W}px)`}}>
            {/* Duplicate videos for seamless loop feel */}
            {[...VIDEOS,...VIDEOS].map((v,i)=>(
              <VideoCard key={`${v.id}-${i}`} v={v} onPlay={handlePlay}/>
            ))}
          </div>
        </div>

        {/* Scroll dots */}
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20}}>
          {VIDEOS.map((_,i)=>(
            <button key={i} onClick={()=>{setOffset(i);startAuto();}}
              style={{width:i===offset%VIDEOS.length?24:7,height:7,border:"none",cursor:"pointer",background:i===offset%VIDEOS.length?B.red:"rgba(255,255,255,.2)",borderRadius:4,transition:"all .3s",padding:0}}/>
          ))}
        </div>
      </div>

      {/* Video modal */}
      {playing&&(
        <div onClick={handleClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"90%",maxWidth:820,position:"relative"}}>
            <button onClick={handleClose} style={{position:"absolute",top:-36,right:0,background:"transparent",border:"none",color:"rgba(255,255,255,.6)",fontSize:18,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>✕ Close</button>
            <div style={{position:"relative",paddingTop:"56.25%",borderRadius:6,overflow:"hidden"}}>
              <iframe src={`https://www.youtube.com/embed/${playing.ytId}?autoplay=1`}
                style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen title={playing.title}/>
            </div>
            <div style={{marginTop:12,fontSize:14,fontWeight:500,color:"rgba(255,255,255,.7)",fontFamily:"'Jost',sans-serif"}}>{playing.title}</div>
          </div>
        </div>
      )}
    </section>
  );
};

// ── Teams (unchanged) ──────────────────────────────────────────────────
const Teams = () => (
  <section style={{background:B.white,padding:"72px 0",borderTop:`1px solid ${B.border}`}}>
    <div style={W}>
      <SL label="All Franchises"/>
      <h2 style={{...H2s,marginBottom:32}}>Teams</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {TEAMS.map(t=>(
          <a key={t.short} href="#" className="team-pill" onClick={e=>e.preventDefault()} style={{justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`${t.color}15`,border:`2px solid ${t.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:9,fontWeight:800,color:t.color}}>{t.short}</span>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:B.navyMid}}>{t.name.split(" ").slice(0,2).join(" ")}</div>
                <div style={{fontSize:10,color:B.muted}}>{t.name.split(" ").slice(2).join(" ")}</div>
              </div>
            </div>
            <span style={{fontSize:16,color:B.muted}}>›</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

// ── Sponsors (unchanged) ───────────────────────────────────────────────
const Sponsors = () => (
  <section style={{background:B.white,padding:"56px 0",borderTop:`1px solid ${B.border}`}}>
    <div style={W}>
      <div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:B.muted}}>Official Partners</div></div>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:36,alignItems:"center"}}>
        {["Title Sponsor","Premier Partner","Official Broadcaster","Digital Partner","Umpire Partner"].map((s,i)=>(
          <div key={s} style={{textAlign:"center"}}>
            <div style={{fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:B.muted,marginBottom:6}}>{s}</div>
            <div style={{width:110,height:38,background:B.offWhite,border:`1px solid ${B.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:B.mutedDark}}>{["TATA","ANGEL ONE","STAR SPORTS","JIO HOTSTAR","WONDER"][i]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Root ───────────────────────────────────────────────────────────────
export default function IPLPage() {
  const {matches,loading,error,lastUpdated,apiConnected,refetch} = useCricAPI(STATIC_MATCHES);
  const liveMatches = matches.filter(m=>m.status==="live");
  return (
    <Layout>
      <IPLStyles/>
      <div style={{background:B.white,minHeight:"100vh"}}>
        <LiveStatusBar loading={loading} error={error} lastUpdated={lastUpdated} liveCount={liveMatches.length} apiConnected={apiConnected} refetch={refetch}/>
        <Hero liveMatches={liveMatches}/>
        <Matches matches={matches} loading={loading}/>
        <PointsTable/>
        <SeasonsHistory/>
        <TeamStats/>
        <CapSection/>
        <News/>
        <Videos/>
        <Teams/>
        <Sponsors/>
      </div>
    </Layout>
  );
}