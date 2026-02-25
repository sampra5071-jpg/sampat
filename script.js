const input = document.getElementById("animeInput");
const suggestionsBox = document.getElementById("suggestions");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const themeToggle = document.getElementById("themeToggle");

// 🌙 Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

// 🔎 Auto Suggestions
input.addEventListener("input", async () => {
    const query = input.value;
    if (query.length < 3) {
        suggestionsBox.innerHTML = "";
        return;
    }

    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
    const data = await response.json();

    suggestionsBox.innerHTML = "";
    data.data.forEach(anime => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = anime.title;
        div.onclick = () => {
            input.value = anime.title;
            suggestionsBox.innerHTML = "";
        };
        suggestionsBox.appendChild(div);
    });
});

// 🎌 Search Anime
async function searchAnime() {
    const query = input.value;
    if (!query) return;

    loader.classList.remove("hidden");
    result.innerHTML = "";

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=1`);
        const data = await response.json();
        const anime = data.data[0];

        loader.classList.add("hidden");

        result.innerHTML = `
            <h2>${anime.title}</h2>
            <img src="${anime.images.jpg.image_url}" alt="poster">
            <p><strong>Rating:</strong> ${anime.score}</p>
            <p>${anime.synopsis}</p>
            <p><strong>Suggested Platforms:</strong> Netflix, Crunchyroll</p>
        `;

    } catch (error) {
        loader.classList.add("hidden");
        result.innerHTML = "Error fetching data 😢";
    }
}