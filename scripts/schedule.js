import { fetchAllRaces } from "./nextRaceCounter.js";
 
const loadSchedule = document.getElementById("load-schedule");
let sliceNumber = 5;
let opened = false;
async function displaySchedule() {
    const races = await fetchAllRaces();
   
    const container = document.getElementById("schedule");
    const now = new Date();

    container.innerHTML = ""; 
    const slicedRaces = races.slice(0, sliceNumber);
    slicedRaces.forEach((el) => {
        const raceDate = new Date(el.date_start);

        const scheduleCard = document.createElement("div");
        scheduleCard.classList.add("schedule-card");

        if (raceDate > now) {
            scheduleCard.classList.add("upcoming");
        }
    
        const formatDate = raceDate.toLocaleDateString("en-US", {month: "short", day: "numeric"});
        scheduleCard.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="left d-flex align-items-center gap-3">
                    <img src="${el.circuit_image}" onerror="this.src='./images/unknown.png'" alt="Circuit Country Flag" class="country-flag rounded-4" width="40">
                    <div class="d-flex flex-column">
                        <div class="d-flex align-items-baseline gap-2">
                            <img src="${el.country_flag}" alt="Circuit Country Flag" width="20">
                            <h5 class="card-title mb-1">${el.meeting_name}</h5>
                        </div>
                        <p class="card-text mb-0 text-muted">${el.location}, ${el.country_name}</p>
                    </div>
                </div>

                <div class="right text-end">
                    <p class="mb-1 fw-bold">${formatDate}</p>
                    <span class="badge ${raceDate > now ? "bg-danger" : "bg-secondary"}">
                        ${raceDate > now ? "UPCOMING" : "FINISHED"}
                        </span>
                </div>

            </div>
        `;

        container.appendChild(scheduleCard);
    });
}

loadSchedule.addEventListener("click", () => {
    opened = !opened;
    sliceNumber = opened ? Infinity : 5;
    loadSchedule.style.animation = "fadeIn 0.5s ease-in-out";

    loadSchedule.style.transform = opened
        ? "rotate(180deg)"
        : "rotate(0deg)";
    displaySchedule();
});

displaySchedule()
