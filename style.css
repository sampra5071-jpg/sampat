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

// 🌙 Theme persistence
if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light-mode");
}

themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme",
        document.body.classList.contains("light-mode") ? "light":"dark");
});

// 🔥 Load Trending
async function loadTrending(){
    const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=8");
    const data = await res.json();
    displayCards(data.data, trending);
}
loadTrending();

// 🔎 Search
async function searchAnime(){
    const query = input.value;
    if(!query) return;

    let url = `https://api.jikan.moe/v4/anime?q=${query}`;

    if(genreFilter.value) url += `&genres=${genreFilter.value}`;
    if(ratingFilter.value) url += `&min_score=${ratingFilter.value}`;

    const res = await fetch(url);
    const data = await res.json();
    displayCards(data.data, result);

    saveSearchHistory(query);
}

// 🖼 Display Cards
function displayCards(list, container){
    container.innerHTML="";
    list.forEach(anime=>{
        const card = document.createElement("div");
        card.className="card";
        card.innerHTML=`
            <img src="${anime.images.jpg.image_url}">
            <h4>${anime.title}</h4>
            <p>⭐ ${anime.score || "N/A"}</p>
            <button onclick='addToFavorites(${JSON.stringify(anime)})'>❤️ Favorite</button>
            <button onclick='watchTrailer("${anime.trailer.embed_url || ""}")'>🎥 Trailer</button>
        `;
        container.appendChild(card);
    });
}

// ❤️ Favorites
function addToFavorites(anime){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];
    fav.push(anime);
    localStorage.setItem("favorites",JSON.stringify(fav));
    loadFavorites();
}

function loadFavorites(){
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];
    displayCards(fav, favoritesDiv);
}
loadFavorites();

// 🎥 Trailer
function watchTrailer(url){
    if(!url) return alert("No Trailer Available");
    modal.classList.remove("hidden");
    trailerFrame.src=url;
}

closeModal.onclick=()=>{
    modal.classList.add("hidden");
    trailerFrame.src="";
}

// 🧠 Search History
function saveSearchHistory(query){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.unshift(query);
    history = [...new Set(history)].slice(0,5);
    localStorage.setItem("history",JSON.stringify(history));
}
