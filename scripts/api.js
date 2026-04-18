function getJSON(url) {
    return fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP error ${r.status}`);
        return r.json();
    });
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

export async function loadF1Data() {
    const cashed = sessionStorage.getItem("f1Data");
    if (cache !== null) return cache;

    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        try{
            const drivers = await getJSON("https://api.openf1.org/v1/drivers")
            const meetingRaw = await getJSON("https://api.openf1.org/v1/meetings?year=2026")
            const meetings = meetingRaw.filter(el => !el.is_cancelled)
            const sessions = await getJSON("https://api.openf1.org/v1/sessions")
            const news = await getJSON("https://site.api.espn.com/apis/site/v2/sports/racing/f1/news")
    
            const cache = { drivers, meetings, sessions, news };

            try {
                sessionStorage.setItem("f1Data", JSON.stringify(cache));
            } catch {}

            return cache;

        } catch (error) {
            loadingPromise = null;
            throw error;
        }
    })();
    return loadingPromise;
}

export function getF1Data() {
    const data = sessionStorage.getItem("f1Data");
    return data ? JSON.parse(data) : null;
}