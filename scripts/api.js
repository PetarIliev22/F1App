function getJSON(url) {
    return fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP error ${r.status}`);
        return r.json();
    });
}

let cache = readCached();
let loadingPromise = null;

export async function loadF1Data() {
    if (cache !== null) return cache;
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = (async () => {
        try {
            const drivers = await getJSON("https://api.openf1.org/v1/drivers")
            const meetingRaw = await getJSON("https://api.openf1.org/v1/meetings?year=2026")
            const sessions = await getJSON("https://api.openf1.org/v1/sessions")
            const news = await getJSON("https://site.api.espn.com/apis/site/v2/sports/racing/f1/news")
            
            cache = { drivers, meetings: meetingRaw.filter(el => !el.is_cancelled) , sessions, news };
            
            sessionStorage.setItem("f1Data", JSON.stringify(cache));
            
            return cache;
        } finally {
            loadingPromise = null;
        }
    })();
    
    return loadingPromise;
}

function readCached() {
    try {
        const data = sessionStorage.getItem("f1Data");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export async function getF1Data() {
    try {
        if (cache === null) {
            await loadF1Data(); 
        }
        return cache;
    } catch {
        return null;
    }
}