import { loadF1Data, getF1Data } from "./api.js";

const counterElement = document.querySelectorAll(".time");
const grandPrixName = document.getElementById("grand-prix-name");
const circuitName = document.getElementById("circuit-name");

let raceDate = null;
export async function fetchNextRace() {
    await loadF1Data();
    const { meetings } = getF1Data();
    
    const now = new Date();
    const nextRace = meetings.find(el => new Date(el.date_start) > now);

    if (!nextRace) {
        counterElement.forEach(el => (el.textContent = "0"));
        return;
    }

    raceDate = new Date(nextRace.date_start);
    grandPrixName.textContent = `Grand Prix of ${nextRace.country_name}`;
    circuitName.textContent = `${nextRace.circuit_short_name}, ${nextRace.country_name}`;

    console.log(nextRace);
    return nextRace;
}

function startCountdown() {
    setInterval(() => {
        if (!raceDate) return;

        const now = new Date();
        const diff = raceDate - now;

        if (diff <= 0) return;

        counterElement[0].textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        counterElement[1].textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
        counterElement[2].textContent = Math.floor((diff / (1000 * 60)) % 60);
        counterElement[3].textContent = Math.floor((diff / 1000) % 60);
    }, 1000);
}

export function initCountdown() {
    startCountdown();
}