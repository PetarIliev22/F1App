import { cars } from "../data/cars.js";
import { driversInfo } from "../data/driversInfo.js";
import { loadF1Data, getF1Data } from "./api.js";
import { getStandings } from "./getLastRacePositions.js";
import { getDriverPoints } from "./driverPoints.js";

const driversContainer = document.getElementById("drivers-container");
const loadMore = document.getElementById("load-more");

let pointsMap = new Map();
let sliceNumber = 5;
let opened = false;
let selecteddriverNumber = null
let standings = [];

const tbody = document.getElementById("drivers-body");
function renderDrivers(standings) {
    const drivers = getF1Data().drivers;
    const driversMap = new Map(drivers.map(d => [d.driver_number, d]));

    const sessionKey = standings?.[0]?.session_key;

    tbody.innerHTML = "";

    let topFive = standings.slice(0, sliceNumber);
    topFive.forEach(s => {
        const driverData = driversMap.get(Number(s.driver_number));
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
        `;
        
        row.style.cursor = "pointer";
        row.addEventListener("click", () => {
            selecteddriverNumber = s.driver_number;
            console.log(selecteddriverNumber);
            driverModal();
        });

        tbody.appendChild(row);
    });
}

function driverModal() {
    const modal = document.getElementById("driver-modal");
    modal.classList.replace("d-none", "d-flex");

    const driverData = driversInfo[selecteddriverNumber];
    const points = pointsMap.get(String(selecteddriverNumber)) ?? 0;

    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <div class="driver-modal">
            <div class="modal-image">
                <img src="${driverData?.image}" alt="Driver ${selecteddriverNumber}" id="driver-modal-image" width="100">
            </div>
            <div class="modal-info">
                <h2>${driverData?.full_name ?? `Driver ${selecteddriverNumber}`}</h2>
                <p>Team: ${driverData?.team_name ?? "Unknown team"}</p>
                <p>Points: ${points}</p>
            </div>
        </div>
    `;
}

function loadMoreDrivers() {
    loadMore.addEventListener("click", async () => {
        if(!opened){
            sliceNumber = Infinity
            loadMore.innerHTML = "Close";
            tbody.style.animation = "scrollDown 0.3s ease-in-out"; 
        }else{
            sliceNumber = 5;
            loadMore.innerHTML = "Load more";
            tbody.style.animation = "scrollUp 0.3s ease-in-out";
        }
        opened = !opened;
        renderDrivers(standings);
    });
}
loadMoreDrivers();


async function init() {
    try {
        await loadF1Data(); 
        standings = await getStandings();
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