import { getF1Data } from "./api.js";
 
export async function getLastSession() {
    const data = await getF1Data();
    if (!data?.sessions) return null;

    const now = new Date();
    
    const lastSession = data.sessions
        .filter(el => el.date_end && new Date(el.date_end) < now && el.is_cancelled === false &&  (el.session_type ?? "").toLowerCase() === "race")
        .sort((a, b) => new Date(b.date_end) - new Date(a.date_end))[0];

    if (!lastSession) return null;
    return lastSession.session_key;
}

function getFinalResults(positionData) {
    const last = {};

    for(const p of positionData) {
        last[p.driver_number] = p;
    }
    return Object.values(last).sort((a, b) => a.position - b.position);
}

let lastStandings = null;
export async function getStandings() {
    try {
        const cached = sessionStorage.getItem("final");
        if (cached) {
            return JSON.parse(cached);
        }
    } catch(err) {
        console.error(err);
    }
    
    const sessionKey = await getLastSession();
    if (!sessionKey) return [];

    try{
        const url = `https://api.openf1.org/v1/position?session_key=${sessionKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn("API error:", response.status);
            return []; 
        }
        
        const result = await response.json();
        const final = getFinalResults(result);
        
        sessionStorage.setItem("final", JSON.stringify(final));
        
        return final;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}