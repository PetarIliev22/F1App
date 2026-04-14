let lastScroll = 0;
const bar = document.getElementById("bottom-bar");

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        bar.classList.remove("d-none");
    } else {
        bar.classList.add("d-none");
    }
    lastScroll = currentScroll;
});
