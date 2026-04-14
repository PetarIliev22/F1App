let loadingPromise = null;

export function loadF1Data() {
    if (cache) return Promise.resolve(cache);
    if (loadingPromise) return loadingPromise;

    loadingPromise = Promise.all([
        fetch("https://api.openf1.org/v1/drivers").then(r => r.json()),
        fetch("https://api.openf1.org/v1/meetings?year=2026").then(r => r.json()).then(r => r.filter(el => el.circuit_key !== 149 && el.circuit_key !== 150)),
        fetch("https://api.openf1.org/v1/sessions").then(r => r.json()),
        fetch("https://site.api.espn.com/apis/site/v2/sports/racing/f1/news").then(r => r.json()),
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

let cache = (() => {
    try {
        return JSON.parse(sessionStorage.getItem("f1Data"));
    } catch {
        return null;
    }
})();