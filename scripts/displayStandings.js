import { cars } from "../data/cars.js";
import { driversInfo } from "../data/driversInfo.js";
import { loadF1Data, getF1Data } from "./api.js";
import { getStandings } from "./getLastRacePositions.js";
import { getDriverPoints } from "./driverPoints.js";

const driversContainer = document.getElementById("drivers-container");
let pointsMap = new Map();


function renderDrivers(standings) {
    const drivers = getF1Data().drivers;
    const sessionKey = standings?.[0]?.session_key;
    const driversMap = new Map(drivers.map(d => [d.driver_number, d]));
    const tbody = document.getElementById("drivers-body");
    
    standings.forEach(s => {
        const driverData = driversMap.get(Number(s.driver_number));
        console.log(driverData);
        const points = pointsMap.get(String(s.driver_number)) ?? 0;

        const row = document.createElement("tr");

        row.style.boxShadow = `inset 6px 0 0 #${driverData?.team_colour}`;
        row.style.background = `linear-gradient(-90deg, #${driverData?.team_colour}60 20%, rgba(255,255,255,0.03) 70%)`;
        row.innerHTML = `
            <td>P${s.position}</td>

            <td style="display:flex; align-items:center; gap:10px;">
                <img src="${driversInfo[String(s.driver_number)]?.image}" 
                    alt="Driver ${s.driver_number}" 
                    style="width:45px; height:45px; border-radius: 50%; background:#${driverData?.team_colour ?? '333'}; display:block; object-fit:cover; object-position:center top;" id="driver-image">

                ${driverData?.full_name ?? driversInfo[String(s.driver_number)]?.name ?? `Driver ${s.driver_number}`}
            </td>

            <td>${driverData?.team_name ?? "Unknown team"}</td>

            <td>01:24:32 LAP</td>

            <td>
                <img src="${cars[String(s.driver_number)] ?? './images/cars_images/default.png'}" width="150" alt="car">
            </td>

            <td><strong>${points}</strong> PTS</td>
        `;

        tbody.appendChild(row);
    });
}

async function init() {
    try {
        await loadF1Data();
        const standings = await getStandings();
        const pointsData = await getDriverPoints();

        pointsMap = new Map(
            pointsData.map(d => [
                String(d.driver_number),
                d.points_current ?? 0
            ])
        );

        renderDrivers(standings);
    } catch (err) {
        console.error(err);
    }
}

init();