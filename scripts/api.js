let cache = null;
let loadingPromise = null;

export function loadF1Data() {
    if (cache) return Promise.resolve(cache);
    if (loadingPromise) return loadingPromise;

    loadingPromise = Promise.all([
        fetch("https://api.openf1.org/v1/drivers").then(r => r.json()),
        fetch("https://api.openf1.org/v1/meetings").then(r => r.json()),
        fetch("https://api.openf1.org/v1/sessions").then(r => r.json())
    ]).then(([drivers, meetings, sessions]) => {
        cache = { drivers, meetings, sessions };
        return cache;
    });

    return loadingPromise;
}

export function getF1Data() {
    return cache;
}