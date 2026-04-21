const track = document.getElementById("track");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const allComp = [track, leftBtn, rightBtn];

if (allComp.every((comp) => comp)) {
    const brands = [
        { img: "./images/sponsors/nestle.png", alt: "Nestle" },
        { img: "./images/sponsors/aws.png", alt: "AWS" },
        { img: "./images/sponsors/paramount.png", alt: "Paramount" },
        { img: "./images/sponsors/dhl.png", alt: "DHL" },
        { img: "./images/sponsors/fanatec.png", alt: "Fanatec" },
        { img: "./images/sponsors/LVMH.png", alt: "LVMH" },
        { img: "./images/sponsors/moly.png", alt: "Moly" },
        { img: "./images/sponsors/aramco.png", alt: "Aramco" },
        { img: "./images/sponsors/pirelli.png", alt: "Pirelli" },
        { img: "./images/sponsors/qatar.png", alt: "Qatar" },
        { img: "./images/sponsors/standard.png", alt: "Standard" },
    ];

    const allBrands = [...brands, ...brands];

    allBrands.forEach((brand) => {
        track.innerHTML += `
        <div class="branding-img">
            <img src="${brand.img}" alt="${brand.alt}"/>
        </div>`;
    });

    let baseSpeed = 0.8;
    let speed = baseSpeed;
    let position = 0;

    const totalWidth = track.scrollWidth;
    const containerWidth = track.parentElement.offsetWidth;

    function animateSlider() {
        position -= speed;

        if (position <= -totalWidth + containerWidth) {
            speed = -baseSpeed;
        } else if (position >= 0) {
            speed = baseSpeed;
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animateSlider);
    }

    animateSlider();

    rightBtn.addEventListener("click", () => {
        if (speed > 0) {
            speed = speed * 20;
        } else {
            speed = -speed * 20;
        }

        setTimeout(() => {
            speed = speed > 0 ? 0.8 : -0.8;
        }, 150);
    });

    leftBtn.addEventListener("click", () => {
        if (speed < 0) {
            speed = speed * 20;
        } else {
            speed = -speed * 20;
        }

        setTimeout(() => {
            speed = speed > 0 ? 0.8 : -0.8;
        }, 150);
    });
}