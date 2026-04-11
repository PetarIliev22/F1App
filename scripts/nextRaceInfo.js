import { fetchNextRace, initCountdown } from "./nextRaceCounter.js";
const cardBody = document.getElementById("cardBody");
const circuitImage = document.getElementById("circuit-image");
const cardText = cardBody.querySelectorAll(".card-text h3");
const featureRaceInfo = document.getElementById("feature-race");

async function displayInfoAboutNextRace() {
    const nextRace = await fetchNextRace();

    featureRaceInfo.innerHTML = "FEATURED RACE:" + "<br>" + nextRace.meeting_name.toUpperCase();
    const img = cardBody.querySelector("img");
    img.src = nextRace.circuit_image;

    cardText[0].innerHTML = `${new Date(nextRace.date_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(nextRace.date_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    circuitImage.src = nextRace.country_flag;
}


async function init() {
    try {
        initCountdown();
        displayInfoAboutNextRace();
    } catch (error) {
        console.error(error);
    }
}
init();