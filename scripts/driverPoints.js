import { getLastSession } from "./getLastRacePositions.js";

export async function getDriverPoints() {
    const cashed = sessionStorage.getItem("driverPoints");
    if (cashed) return JSON.parse(cashed);
    
    const sessionKey = await getLastSession();
    const url = `https://api.openf1.org/v1/championship_drivers`;

    const response = await fetch(url);
    const data = await response.json();

    sessionStorage.setItem("driverPoints", JSON.stringify(data));
    return data;
}

