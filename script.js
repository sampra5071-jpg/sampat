const input = document.getElementById("animeInput");
const result = document.getElementById("result");
const trending = document.getElementById("trending");
const favoritesDiv = document.getElementById("favorites");
const genreFilter = document.getElementById("genreFilter");
const ratingFilter = document.getElementById("ratingFilter");
const themeToggle = document.getElementById("themeToggle");

const modal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailerFrame");
const closeModal = document.getElementById("closeModal");

// 🌙 THEME PERSISTENCE
if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme",
        document.body.classList.contains("light-mode") ? "light":"dark");
});

// 🔥 LOAD TRENDING + ALL ANIME
async function loadTrending(){
    try{
        const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
        const data = await res.json();

        // Trending top 8
        displayCards(data.data.slice(0,8), trending);

        // All in results
        displayCards(data.data, result);

    }catch{
        trending.innerHTML = "Trending not available 😢";
    }
}
loadTrending();

// 🔎 SEARCH
async function searchAnime(){
    const query = input.value.trim();
    if(!query) return;

    result.innerHTML = "Loading...";

    try{
        let url = `https://api.jikan.moe/v4/anime?q=${query}&limit=20`;

        if(genreFilter.value) url += `&genres=${genreFilter.value}`;
        if(ratingFilter.value) url += `&min_score=${ratingFilter.value}`;

        const res = await fetch(url);
        const data = await res.json();

        if(!data.data.length){
            result.innerHTML = "No anime found 😢";
            return;
        }

        displayCards(data.data, result);

    }catch{
        result.innerHTML = "Error fetching data 🚨";
    }
}

// 🖼 DISPLAY CARDS WITH FAVORITE TOGGLE
function displayCards(list, container){
    container.innerHTML = "";

    const favList = JSON.parse(localStorage.getItem("favorites")) || [];

    list.forEach(anime => {

        const isFav = favList.some(item => item.mal_id === anime.mal_id);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${anime.images?.jpg?.image_url || ""}">
            <h4>${anime.title}</h4>
            <p>⭐ ${anime.score || "N/A"}</p>
            <button class="fav-btn ${isFav ? 'remove' : ''}">
                ${isFav ? "❌ Unfavorite" : "❤️ Favorite"}
            </button>
            <button class="trailer-btn">🎥 Trailer</button>
        `;

        // Toggle Favorite
        card.querySelector(".fav-btn")
            .addEventListener("click", () => toggleFavorite(anime));

        // Trailer
        card.querySelector(".trailer-btn")
            .addEventListener("click", () => watchTrailer(anime.trailer?.embed_url));

        container.appendChild(card);
    });
}

// ❤️ FAVORITES TOGGLE
function toggleFavorite(anime){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];

    const index = fav.findIndex(item => item.mal_id === anime.mal_id);

    if(index === -1){
        fav.push(anime);
    }else{
        fav.splice(index,1);
    }

    localStorage.setItem("favorites", JSON.stringify(fav));

    loadFavorites();
    loadTrending(); // refresh displayed cards for button state
}

function loadFavorites(){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];
    displayCards(fav, favoritesDiv);
}
loadFavorites();

// 🎥 TRAILER MODAL
function watchTrailer(url){
    if(!url){
        alert("No Trailer Available 🎬");
        return;
    }
    modal.classList.remove("hidden");
    trailerFrame.src = url;
}

// Close trailer
closeModal.addEventListener("click", closeTrailer);
modal.addEventListener("click", (e)=>{
    if(e.target === modal){
        closeTrailer();
    }
});
function closeTrailer(){
    modal.classList.add("hidden");
    trailerFrame.src = "";
}
