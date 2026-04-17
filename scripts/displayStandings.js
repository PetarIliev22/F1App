import { loadF1Data, getF1Data } from "./api.js";
import { getStandings } from "./getLastRacePositions.js";
import { getDriverPoints } from "./driverPoints.js";

const driversContainer = document.getElementById("drivers-container");
let pointsMap = new Map();
let cars = {};

// async function loadCars() {
//     const res = await fetch("./data/cars.json");
//     cars = await res.json();
// }

function renderDrivers(standings) {
    const driver = getF1Data().drivers;
    driversContainer.innerHTML = "";

    const sessionKey = standings?.[0]?.session_key;
    const driversMap = new Map(driver.map(d => [d.driver_number, d]));
    
    standings.forEach(s => {
        const points = pointsMap.get(String(s.driver_number)) ?? 0;
        const driver = driversMap.get(Number(s.driver_number));
        const driverElement = document.createElement("div");

        driverElement.classList.add("driver");
        driverElement.style.boxShadow = `inset -20px 0 30px #${driver?.team_colour ?? "333"}`;
        
        driverElement.innerHTML = `
                <div class="driver-pos d-flex align-items-center flex-row gap-3 gap-md-4">
                    P${s.position}
                    <img src="${driver?.headshot_url}" alt="Driver ${s.driver_number}" class="driver-image" style="background-color: #${driver?.team_colour ?? "333"}"/>
                    <div class="driver-info ">
                        <h3>${driver?.full_name ?? `Driver ${s.driver_number}`}</h3>
                        <p>${driver?.team_name ?? "Unknown team"}</p>
                    </div>
                </div>

                <div class="driver-time">
                    <h3>01:24:32 LAP</h3>
                </div>

                
                <div class="driver-points d-flex flex-row align-items-center gap-4">
                    <img src="./images/cars_images/mercedes.png" alt="Driver ${s.driver_number} car" class="driver-car-image" width="150">
                    <h3>${points}</h3>
                    <p class="mb-0">PTS</p>
                </div>

            `;

        driversContainer.appendChild(driverElement);
    });
}

async function init() {
    try {
        // await loadCars();
        await loadF1Data();
        const standings = await getStandings();
        const pointsData = await getDriverPoints();

        pointsMap = new Map(
            pointsData.map(d => [
                String(d.driver_number),
                d.points_current ?? 0
            ])
        );

        console.log(pointsData[0]);
        renderDrivers(standings);
    } catch (err) {
        console.error(err);
    }
}

init();