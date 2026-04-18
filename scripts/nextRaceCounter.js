import { loadF1Data, getF1Data } from "./api.js";

const counterElement = document.querySelectorAll(".time");
const grandPrixName = document.getElementById("grand-prix-name");
const circuitName = document.getElementById("circuit-name");

let raceDate = null;
export async function fetchNextRace() {
 
    const { meetings } = getF1Data();
    const now = new Date();
    const meetingsData = meetings || [];
    const nextRace = meetingsData.find(el => new Date(el.date_start) > now);

    if (!nextRace) {
        counterElement.forEach(el => (el.textContent = "0"));
        return;
    }

    raceDate = new Date(nextRace.date_start);
    grandPrixName.textContent = `Grand Prix of ${nextRace.country_name}`;
    circuitName.textContent = `${nextRace.circuit_short_name}, ${nextRace.country_name}`;
    
    return nextRace;
}

let intervalStarted = false;
function startCountdown() {
    if (intervalStarted) return;
    intervalStarted = true;
    setInterval(() => {
        if (!raceDate) return;

        const now = new Date();
        const diff = raceDate - now;

        if (diff <= 0) {
            counterElement.forEach(el => (el.textContent = "0"));
            return;
        }

        const time = {
            days: Math.floor(diff / 86400000),
            hours: Math.floor(diff / 3600000) % 24,
            minutes: Math.floor(diff / 60000) % 60,
            seconds: Math.floor(diff / 1000) % 60
        };

        counterElement[0].textContent = time.days;
        counterElement[1].textContent = time.hours;
        counterElement[2].textContent = time.minutes;
        counterElement[3].textContent = time.seconds;
    }, 1000);
}

export function initCountdown() {
    startCountdown();
}