import { loadF1Data } from "./api.js";
import "./api.js";
import "./nextRaceInfo.js";
import "./mobileBottomNavBar.js"
import "./loadNews.js";
import "./getLastRacePositions.js";
import "./displayStandings.js";
import "./driverPoints.js";

window.addEventListener("load", async () => {
    await loadF1Data();
    const loader = document.getElementById("loading-screen");
    loader.classList.add("loading-hidden");
});