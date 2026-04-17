function getJSON(url) {
    return fetch(url).then(r => r.json());
}

let loadingPromise = null;
let cache = (() => {
    try {
        const data = sessionStorage.getItem("f1Data");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
})();

export function loadF1Data() {
    if (cache !== null) return Promise.resolve(cache);
    if (loadingPromise) return loadingPromise;

    const fetchDrivers = getJSON("https://api.openf1.org/v1/drivers");
    const fetchMeetings = getJSON("https://api.openf1.org/v1/meetings?year=2026").then(data => data.filter(el => el.is_cancelled === false));
    const fetchSessions = getJSON("https://api.openf1.org/v1/sessions");
    const fetchNews = getJSON("https://site.api.espn.com/apis/site/v2/sports/racing/f1/news");

    loadingPromise = Promise.all([
        fetchDrivers,
        fetchMeetings,
        fetchSessions,
        fetchNews
    ]).then(([drivers, meetings, sessions, news]) => {

        cache = { drivers, meetings, sessions, news };
        sessionStorage.setItem("f1Data", JSON.stringify(cache));

        return cache;
    });

    return loadingPromise;
}

export function getF1Data() {
    return cache;
}