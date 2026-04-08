const input = document.getElementById("animeInput");
const result = document.getElementById("result");
const trending = document.getElementById("trending");
const favoritesDiv = document.getElementById("favorites");
const genreFilter = document.getElementById("genreFilter");
const ratingFilter = document.getElementById("ratingFilter");
const themeToggle = document.getElementById("themeToggle");

const trailerFrame = document.getElementById("trailerFrame");

// 🌙 THEME
if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme",
        document.body.classList.contains("light-mode") ? "light":"dark");
});

// 🔥 LOADING SPINNER
function showLoading(container){
    container.innerHTML = `
    <div class="text-center w-100">
        <div class="spinner-border text-primary"></div>
    </div>`;
}

// 🔥 LOAD TRENDING
async function loadTrending(){
    showLoading(trending);

    try{
        const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
        const data = await res.json();

        displayCards(data.data.slice(0,8), trending);
        displayCards(data.data, result);

    }catch{
        trending.innerHTML = "Trending not available 😢";
    }
}
loadTrending();

// 🔎 SEARCH (WITH DEBOUNCE)
let debounceTimer;

input.addEventListener("input", ()=>{
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchAnime, 500);
});

async function searchAnime(){
    const query = input.value.trim();
    if(!query) return;

    showLoading(result);

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

// 🖼 DISPLAY CARDS (BOOTSTRAP STYLE)
function displayCards(list, container){
    container.innerHTML = "";

    const favList = JSON.parse(localStorage.getItem("favorites")) || [];

    list.forEach(anime => {

        const isFav = favList.some(item => item.mal_id === anime.mal_id);

        const col = document.createElement("div");
        col.className = "col-md-3";

        col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${anime.images?.jpg?.image_url || ""}" class="card-img-top">
            <div class="card-body">
                <h6 class="card-title">${anime.title}</h6>
                <p>⭐ ${anime.score || "N/A"}</p>

                <button class="btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'} fav-btn">
                    ${isFav ? "❌ Remove" : "❤️ Favorite"}
                </button>

                <button class="btn btn-sm btn-primary trailer-btn">
                    🎥 Trailer
                </button>
            </div>
        </div>`;

        // Favorite toggle
        col.querySelector(".fav-btn")
            .addEventListener("click", () => toggleFavorite(anime));

        // Trailer
        col.querySelector(".trailer-btn")
            .addEventListener("click", () => watchTrailer(anime.trailer?.embed_url));

        container.appendChild(col);
    });
}

// ❤️ FAVORITES
function toggleFavorite(anime){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];

    const index = fav.findIndex(item => item.mal_id === anime.mal_id);

    if(index === -1){
        fav.push(anime);
        showToast("Added to Favorites ❤️");
    }else{
        fav.splice(index,1);
        showToast("Removed from Favorites ❌");
    }

    localStorage.setItem("favorites", JSON.stringify(fav));

    loadFavorites();
    loadTrending();
}

function loadFavorites(){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];
    displayCards(fav, favoritesDiv);
}
loadFavorites();

// 🎥 TRAILER (BOOTSTRAP MODAL)
function watchTrailer(url){
    if(!url){
        showToast("No Trailer Available 🎬");
        return;
    }

    trailerFrame.src = url;

    let modal = new bootstrap.Modal(document.getElementById('trailerModal'));
    modal.show();
}

// 🔔 TOAST (BETTER THAN ALERT)
function showToast(msg){
    const toast = document.createElement("div");
    toast.className = "toast position-fixed bottom-0 end-0 m-3 show";
    toast.innerHTML = `
        <div class="toast-body bg-dark text-white">
            ${msg}
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(()=> toast.remove(), 2000);
}
