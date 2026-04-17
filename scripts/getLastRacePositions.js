import { loadF1Data, getF1Data } from "./api.js";
 
export async function getLastSession() {
    await loadF1Data();

    const { sessions } = getF1Data();
    const now = new Date();

    const lastSession = sessions
        .filter(el => el.date_end && new Date(el.date_end) < now && el.is_cancelled === false && el.session_type === "Race")
        .sort((a, b) => new Date(b.date_end) - new Date(a.date_end))[0];
    
    const sessionKey = lastSession.session_key;
    return sessionKey;
}

function getFinalResults(positionData) {
    const last = {};
    positionData.forEach(p => {last[p.driver_number] = p;});
    
    return Object.values(last)
    .sort((a, b) => a.position - b.position);
}

export async function getStandings() {
    const cashed = sessionStorage.getItem("final");
    if (cashed) return JSON.parse(cashed);
    const sessionKey = await getLastSession();
    const url = `https://api.openf1.org/v1/position?session_key=${sessionKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        console.warn("API error:", response.status);
        return []; 
    }

    const data = await response.json();
    const final = getFinalResults(data);
    sessionStorage.setItem("final", JSON.stringify(final));
    return final;
}
