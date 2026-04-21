import { getF1Data } from "./api.js";
import { fetchNextRace, initCountdown } from "./nextRaceCounter.js";

const cardBody = document.getElementById("card-body");
const raceInfoBody = document.getElementById("race-info-body");
const countryFlag = document.getElementById("contry-flag");
const cardText = document.querySelector("#card-body .card-text h3");
const featureRaceInfo = document.getElementById("feature-race");

const raceDate = document.getElementById("race-date");
const raceLocation = document.getElementById("race-location");
const circuitShortName = document.getElementById("circuit-short-name");

async function displayInfoAboutNextRace() {
    const nextRace = await fetchNextRace();
    
    if (!nextRace) return;
    featureRaceInfo.innerHTML = "LAST RACE HIGHLIGHTS" + "<br>" + "Circuit Name - " + " " + nextRace.meeting_name.toUpperCase();
    const img = cardBody.querySelector("img");
    img.src = nextRace.circuit_image;

    cardText.innerHTML = `${nextRace.circuit_short_name}, ${nextRace.country_name}`;
    countryFlag.src = nextRace.country_flag;

    const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });

    raceDate.textContent = `${formatDate(nextRace.date_start)} - ${formatDate(nextRace.date_end)}`;
    raceLocation.textContent = `${nextRace.location}, ${nextRace.country_name}`;
    circuitShortName.textContent = `${nextRace.circuit_short_name}`;
}

async function init() {
    try {
        await getF1Data();
        initCountdown();
        await displayInfoAboutNextRace();
    } catch (error) {
        console.error(error);
    }
}

init();