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

    loadingPromise = Promise.allSettled([
        getJSON("https://api.openf1.org/v1/drivers"),
        getJSON("https://api.openf1.org/v1/meetings?year=2026")
            .then(r => r.filter(el => el.is_cancelled === false)),
        getJSON("https://api.openf1.org/v1/sessions"),
        getJSON("https://site.api.espn.com/apis/site/v2/sports/racing/f1/news"),
    ]).then((results) => {

        const [drivers, meetings, sessions, news] = results.map(r =>
            r.status === "fulfilled" ? r.value : null
        );

        cache = { drivers, meetings, sessions, news };
        sessionStorage.setItem("f1Data", JSON.stringify(cache));

        return cache;
    });

    return loadingPromise;
}

export function getF1Data() {
    return cache;
}