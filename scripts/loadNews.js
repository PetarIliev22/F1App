import { getF1Data } from "./api.js";

const newsContainer = document.getElementById("news-container");

export async function loadNews(){
    const data = await getF1Data();
    const news = data?.news;
    let articles = news?.articles || [];
  
    articles.sort((a, b) => new Date(b.published) - new Date(a.published)).forEach(el => {
        const newsCard = document.createElement("div");
        
        const days = Math.floor((new Date() - new Date(el.published)) / 864e5);
        const timeAgo = days === 0 ? "Today" : `${days} days ago`;

        newsCard.classList.add("col");
        newsCard.innerHTML = `
        <div class="card news-card">
            <img src="/images/f1-logo-white.png" width="80" id="card-image">
            <div class="image-wrapper">
                <img src="${el.images[0].url}" class="card-img-top dynamic-img" alt="${el.headline}">

                <div class="image-overlay">
                    <h5 class="card-title">${el.headline}</h5>
                    <div class="description-container d-none pt-4">
                        <p class="card-text">${el.description}</p>
                        <a href="${el.links.web.href}" class="btn text-white">Read More</a>
                    </div>
                </div>
            </div>
            
            <small class="p-1 text-end" id="news-date">${timeAgo}</small>
        </div>
        `;

        newsContainer.appendChild(newsCard);

        const imageOverlay = newsCard.querySelector(".image-overlay");
        const cardTitle = newsCard.querySelector(".card-title");

        newsCard.addEventListener("click", () => {
            const title = newsCard.querySelector(".card-title");
            const overlay = newsCard.querySelector(".image-overlay");
            const desc = newsCard.querySelector(".description-container");

            const isOpen = desc.classList.contains("d-block");

            if (!isOpen) {
                title.classList.add("d-none");
                overlay.style.height = "100%";
                overlay.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
                desc.classList.replace("d-none", "d-block");
            } else {
                title.classList.remove("d-none");
                overlay.style.height = "";
                overlay.style.backgroundColor = "rgba(255, 0, 0, 0)";
                desc.classList.replace("d-block", "d-none");
            }
        });
    });
}   

loadNews();