import { getLastSession } from "./getLastRacePositions.js";


let loadingProgress = false;
export async function getDriverPoints() {
    const cached = sessionStorage.getItem("driverPoints");

    if (cached) {
        return JSON.parse(cached);
    }

    if (loadingProgress) return [];
    loadingProgress = true;
    
    try {
        const sessionKey = await getLastSession();
        if (!sessionKey) return [];

        const response = await fetch("https://api.openf1.org/v1/championship_drivers");

        if (!response.ok) {
            console.warn("API error:", response.status);
            return [];
        }

        const data = await response.json();
        const safeData = Array.isArray(data) ? data : [];

        sessionStorage.setItem("driverPoints", JSON.stringify(safeData));
        return safeData;
    } finally {
        loadingProgress = false;
    }
}


