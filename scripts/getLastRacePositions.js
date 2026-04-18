import { loadF1Data, getF1Data } from "./api.js";
 
export function getLastSession() {
    const data = getF1Data();
    if (!data?.sessions) return null;
    const now = new Date();
    
    const lastSession = data.sessions
    .filter(el =>
        el.date_end &&
        new Date(el.date_end) < now &&
        el.is_cancelled === false &&
        el.session_type === "Race"
    )
    .sort((a, b) =>
        new Date(b.date_end) - new Date(a.date_end)
        )[0];

    if (!lastSession) return null;

    return lastSession.session_key;
}

function getFinalResults(positionData) {
    const last = {};

    for(const p of positionData) {
        last[p.driver_number] = p;
    }
    
    return Object.values(last)
        .sort((a, b) => a.position - b.position);
}

let lastStandings = null;
export async function getStandings() {
    const cashed = sessionStorage.getItem("final");

    if (cashed){
        lastStandings = JSON.parse(cashed);
        return lastStandings;
    }
    
    const sessionKey = await getLastSession();
    if (!sessionKey) return [];

    const url = `https://api.openf1.org/v1/position?session_key=${sessionKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.warn("API error:", response.status);
        return []; 
    }

    const result = await response.json();
    const final = getFinalResults(result);
    
    try{
        sessionStorage.setItem("final", JSON.stringify(final));
    } catch {}
   
    return final;
}