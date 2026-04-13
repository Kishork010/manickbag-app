import { useState, useEffect, useCallback } from "react";

const API_KEY = "60f9da30-fcf7-41a2-be9d-257b281cc8cc";
const BASE    = "https://api.cricapi.com/v1";

const TEAM_MAP = {
  "Chennai Super Kings":"CSK","Mumbai Indians":"MI",
  "Royal Challengers Bengaluru":"RCB","Royal Challengers Bangalore":"RCB","Royal Challengers":"RCB",
  "Kolkata Knight Riders":"KKR","Delhi Capitals":"DC","Delhi Daredevils":"DC",
  "Rajasthan Royals":"RR","Sunrisers Hyderabad":"SRH","Gujarat Titans":"GT",
  "Lucknow Super Giants":"LSG","Punjab Kings":"PBKS","Kings XI Punjab":"PBKS",
};

const toShort = (name="") => {
  const t = name.trim();
  if (TEAM_MAP[t]) return TEAM_MAP[t];
  for (const [f,s] of Object.entries(TEAM_MAP))
    if (t.toLowerCase().includes(f.toLowerCase().split(" ")[0])) return s;
  return t.split(" ").map(w=>w[0]).join("").toUpperCase();
};

const fmtScore = (o) => {
  if (!o) return null;
  if (typeof o === "string") return o;
  return `${o.r??0}/${o.w??0} (${parseFloat(o.o??0).toFixed(1).replace(".0","")})`;
};

const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-IN",{month:"short",day:"numeric",timeZone:"Asia/Kolkata"}); } catch { return ""; } };
const fmtTime = (d) => { try { return new Date(d).toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"}); } catch { return ""; } };

const isIPL = (m) => {
  const n = (m.series_id||m.seriesName||m.name||"").toLowerCase();
  return n.includes("ipl") || n.includes("indian premier league") ||
    (m.matchType==="t20" && m.teams?.some(t=>Object.keys(TEAM_MAP).includes(t)));
};

const parseWinner = (status="", t1, t2) => {
  const s = status.toLowerCase();
  for (const x of [t1,t2]) if (s.includes(x.toLowerCase())) return x;
  for (const [f,sh] of Object.entries(TEAM_MAP)) if (s.includes(f.toLowerCase())) return sh;
  return null;
};

const toShape = (m, i) => {
  const t1 = toShort(m.teams?.[0]||""), t2 = toShort(m.teams?.[1]||"");
  const live = m.matchStarted===true && m.matchEnded!==true;
  const done = m.matchEnded===true;
  const sc = Array.isArray(m.score) ? m.score : [];
  const s1 = sc.find(s=>s.inning?.toLowerCase().includes(t1.toLowerCase())||s.inning?.toLowerCase().includes("1st")||s.inning?.endsWith("1")) || sc[0] || null;
  const s2 = sc.find(s=>s.inning?.toLowerCase().includes(t2.toLowerCase())||s.inning?.toLowerCase().includes("2nd")||s.inning?.endsWith("2")) || sc[1] || null;
  return {
    id: m.id||`m${i}`, team1:t1, team2:t2,
    date: fmtDate(m.dateTimeGMT), time: fmtTime(m.dateTimeGMT),
    venue: m.venue||"TBD",
    status: done?"result":live?"live":"upcoming",
    t1Score: (live||done)?fmtScore(s1):null,
    t2Score: (live||done)?fmtScore(s2):null,
    winner: done?parseWinner(m.status||"",t1,t2):null,
    liveStatus: live?(m.status||"Live"):null,
  };
};

export default function useCricAPI(fallback=[]) {
  const [matches,setMatches]         = useState(fallback);
  const [loading,setLoading]         = useState(true);
  const [error,setError]             = useState(null);
  const [lastUpdated,setLastUpdated] = useState(null);
  const [apiConnected,setApiConnected] = useState(false); // NEW: tracks live API status

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BASE}/currentMatches?apikey=${API_KEY}&offset=0`);
      const d = await r.json();
      console.log("[CricAPI] raw:", d);
      if (d.status !== "success") throw new Error(d.status||"API error");
      let ipl = d.data.filter(isIPL);
      if (!ipl.length) {
        console.warn("[CricAPI] No IPL found. Series names:", d.data.map(m=>m.name));
        ipl = d.data.filter(m=>m.matchType==="t20");
      }
      if (ipl.length) {
        setMatches(ipl.map(toShape));
        setApiConnected(true);
        setError(null);
      } else {
        setApiConnected(false);
        setError("No IPL matches right now — showing static schedule");
      }
      setLastUpdated(new Date());
    } catch(e) {
      console.error("[CricAPI]", e.message);
      setApiConnected(false);
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 60_000);
    return () => clearInterval(t);
  }, [fetchAll]);

  return { matches, loading, error, lastUpdated, apiConnected, refetch: fetchAll };
}