import { cars } from "../data/cars.js";
import { driversInfo } from "../data/driversInfo.js";
import { getF1Data } from "./api.js";
import { getStandings } from "./getLastRacePositions.js";
import { getDriverPoints } from "./driverPoints.js";

const tbody = document.getElementById("drivers-body");
const loadMore = document.getElementById("load-more");
const searchField = document.getElementById("search-field");

let driversMap = new Map();
let pointsMap = new Map();
let sliceNumber = 5;
let opened = false;
let selecteddriverNumber = null;
let driverPointsCache = null;
let standings = [];

function renderDrivers(standings, data) {
    tbody.innerHTML = "";

    standings.slice(0, sliceNumber).forEach(s => {
        const driverData = driversMap.get(Number(s.driver_number));
        const points = pointsMap.get(String(s.driver_number)) ?? 0;

        const row = document.createElement("tr");

        const color = driverData?.team_colour;

        row.style.boxShadow = `inset 6px 0 0 #${color}`;
        row.style.background = `linear-gradient(-90deg, #${color}60 20%, rgba(255,255,255,0.03) 70%)`;

        row.innerHTML = `
            <td>P${s.position}</td>

            <td style="display:flex; align-items:center; gap:10px;">
                <img src="${driversInfo[String(s.driver_number)]?.compresseImages}" alt="Driver ${s.driver_number}" 
                    style="
                        width:45px;
                        height:45px;
                        border-radius:50%;
                        background:#${color ?? '333'};
                        object-fit:cover;
                        object-position:center top;
                    ">

                ${driverData?.full_name
                    ?? driversInfo[String(s.driver_number)]?.name
                    ?? `Driver ${s.driver_number}`}
            </td>

            <td>${driverData?.team_name ?? "Unknown team"}</td>

            <td>--:--:-- LAP</td>

            <td>
                <img src="${cars[String(s.driver_number)] ?? './images/cars_images/default.png'}" width="150">
            </td>
        `;

        row.style.cursor = "pointer";

        row.onclick = () => {
            selecteddriverNumber = s.driver_number;
            driverModal();
        };

        tbody.appendChild(row);
    });
}

async function getPointsMap() {
    if (driverPointsCache) return driverPointsCache;

    const data = await getDriverPoints();

    driverPointsCache = new Map(
        data.map(d => [String(d.driver_number), d.points_current ?? 0])
    );

    return driverPointsCache;
}

async function driverModal() {
    const modal = document.getElementById("driver-modal");
    modal.classList.replace("d-none", "d-flex");

    const apiDriver = driversMap.get(Number(selecteddriverNumber));
    const jsonDriver = driversInfo[String(selecteddriverNumber)];
    const driverData = { ...jsonDriver, ...apiDriver};
    
    const points = (await getPointsMap())
        .get(String(selecteddriverNumber)) ?? 0;

    const nameParts = (driverData?.name || `Driver ${selecteddriverNumber}`).split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const modalContent = document.getElementById("modal-content");
    const age = driverData?.birthDate ? new Date().getFullYear() - new Date(driverData.birthDate).getFullYear() : 'N/A';

    modalContent.innerHTML = `
        <div class="f1-driver-card" style="background: linear-gradient(135deg, #${driverData?.team_colour || '223'} 0%, #111 140%);">
            <button class="close-btn" onclick="closeModal()">&#10005;</button>
            
            <div class="card-content">
                <div class="driver-info-panel">
                    <div class="decorative-line"></div>

                    <div class="driver-name-group">
                        <h2 class="driver-name text-center">${firstName}</h2>
                        <h2 class="driver-name text-center">${lastName}</h2>
                    </div>

                    <div class="driver-meta">
                        <span class="meta-item">${age} years</span>
                        <span class="divider">|</span>
                        <img src="${driverData?.countryFlag}" alt="Driver Country Flag" class="country-flag">
                        <span class="meta-item">${driverData?.country || 'Unknown'}</span>
                        <span class="divider">|</span>
                        <img src="${driverData?.teamLogo}" alt="Driver Team Logo" class="team-logo" width="30">
                        <span class="meta-item">${driverData?.team_name || 'Unknown team'}</span>
                    </div>

                    <div class="driver-bio-section">
                        <p class="bio-text">${driverData?.bio || 'No biography available.'}</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stats-column">
                            <h3>Achievements</h3>
                            <ul>
                                ${driverData?.achievements?.map(acc => `<li>${acc}</li>`).join('') || '<li>TBA</li>'}
                            </ul>
                        </div>
                        <div class="stats-column">
                            <h3>Career History</h3>
                            <ul>
                                ${driverData?.career?.map(year => `<li>${year}</li>`).join('') || '<li>TBA</li>'}
                            </ul>
                        </div>
                    </div>

                    <div class="decorative-line bottom"></div>
                </div>

                <div class="driver-image-panel">
                    <div class="giant-bg-number">
                        ${driverData?.number || selecteddriverNumber}
                    </div>
                    <img class="driver-car" src="${driverData?.teamCar}" alt="Driver Car">
                    <img src="${driverData?.image}" alt="${driverData?.full_name}">
                
                    <div class="driver-points">${points || ''}PTS</div>
                </div>
            </div>
        </div>
        `;
        document.body.style.overflow = "hidden";
}

const modal = document.getElementById("driver-modal");
window.closeModal = function () {
    modal.classList.replace("d-flex", "d-none");
    document.body.style.overflow = "auto";
};

loadMore.onclick = () => {
    opened = !opened;
    sliceNumber = opened ? Infinity : 5;

    loadMore.innerHTML = opened ? "Close" : "Load more";

    renderDrivers(standings);
};

searchField.addEventListener("input", () => {
    const query = searchField.value.toLowerCase().trim();

    if (!query) {
        renderDrivers(standings);
        return;
    }

    const filtered = standings.filter(s => {
        const driver = driversMap.get(Number(s.driver_number));

        const name =
            driver?.full_name ||
            driversInfo[String(s.driver_number)]?.name ||
            "";

        const team = driver?.team_name || "";

        const number = String(s.driver_number);

        return (
            name.toLowerCase().includes(query) ||
            team.toLowerCase().includes(query) ||
            number.includes(query)
        );
    });

    renderDrivers(filtered);
});

async function init() {
    try {
        const data = await getF1Data();

        driversMap = new Map(
            (data?.drivers ?? []).map(d => [d.driver_number, d])
        );

        standings = await getStandings();

        renderDrivers(standings, data);
    } catch (err) {
        console.error(err);
    }
}

init();