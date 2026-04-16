import { loadF1Data, getF1Data } from "./api.js";

const newsContainer = document.getElementById("news-container");

export async function loadNews(){
    await loadF1Data();
    const { news } = getF1Data();
    let articles = news?.articles || [];
  
    articles.sort((a, b) => new Date(b.published) - new Date(a.published)).forEach(el => {
        const newsCard = document.createElement("div");
        
        const days = Math.floor((new Date() - new Date(el.published)) / 864e5);
        const timeAgo = days === 0 ? "Today" : `${days} days ago`;

        newsCard.classList.add("col");
        newsCard.innerHTML = `
        <div class="card h-100 news-card">
            <img src="./images/f1-logo-white.png" width="80" id="card-image">
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
            
            <small class="p-2 text-end" id="news-date">${timeAgo}</small>
        </div>
        `;

        newsContainer.appendChild(newsCard);

        const imageOverlay = newsCard.querySelector(".image-overlay");
        const cardTitle = newsCard.querySelector(".card-title");

        newsCard.addEventListener("mouseover", () => {
            cardTitle.classList.add("d-none");
            imageOverlay.style.animation = "fadeIn 0.5s ease-in-out";
            imageOverlay.style.height = "100%";
            imageOverlay.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
            newsCard.querySelector(".description-container").classList.replace("d-none", "d-block");
        });

        newsCard.addEventListener("mouseleave", () => {
            cardTitle.classList.remove("d-none");
            imageOverlay.style.animation = "fadeOut 0.5s ease-in-out";
            imageOverlay.style.height = "";
            imageOverlay.style.backgroundColor = "rgba(255, 0, 0, 0)";
            newsCard.querySelector(".description-container").classList.replace("d-block", "d-none");
        });
    });
}   

loadNews();