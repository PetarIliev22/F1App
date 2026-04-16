let lastScroll = 0;
const bar = document.getElementById("bottom-bar");

window.addEventListener("scroll", () => {
    bar.classList.toggle("d-none", window.scrollY < 100);
});