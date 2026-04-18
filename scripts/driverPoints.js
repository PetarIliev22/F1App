import { getLastSession } from "./getLastRacePositions.js";

export async function getDriverPoints() {
    const cached = sessionStorage.getItem("driverPoints");

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            sessionStorage.removeItem("driverPoints");
        }
    }

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

        try {
            sessionStorage.setItem("driverPoints", JSON.stringify(safeData));
        } catch {}

        return safeData;

    } catch (err) {
        console.error("getDriverPoints failed:", err);
        return [];
    }
}


