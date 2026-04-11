let lastScroll = 0;
const bar = document.getElementById("bottom-bar");

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        bar.classList.replace("d-none", "d-flex");
    } else {
        bar.classList.replace("d-flex", "d-none");
    }
    lastScroll = currentScroll;
});
