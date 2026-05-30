const API_BASE = "https://kairodex.vercel.app";

import {
  SOURCES,
  getSourceBadge
} from "./sources.js";

const mangaGrid = document.getElementById("manga-grid");
const searchInput = document.getElementById("search-input");

const dynamicHero =
  document.getElementById("dynamic-hero");

const heroTitle =
  document.querySelector(".premium-hero h1");

const heroText =
  document.querySelector(".premium-hero p");

let searchTimeout;

function showLoading() {
  mangaGrid.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";

    skeleton.innerHTML = `
      <div class="skeleton-cover"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line small"></div>
    `;

    mangaGrid.appendChild(skeleton);
  }
}

function showMessage(title, text) {
  mangaGrid.innerHTML = `
    <div class="empty-message">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

async function loadMangas(search = "") {
  try {
    showLoading();

    const url = search
      ? `${API_BASE}/api/mangas?search=${encodeURIComponent(search)}`
      : `${API_BASE}/api/mangas`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || result.error) {
      showMessage(
        "Erro da API",
        result.error || "Não foi possível carregar os mangás."
      );
      return;
    }

    const mangas = Array.isArray(result.data) ? result.data : [];

    if (mangas.length === 0) {
      showMessage(
        "Nenhum mangá encontrado",
        "Tente pesquisar por outro nome."
      );
      return;
    }

    mangaGrid.innerHTML = "";

    /* HERO DINÂMICO */
    if (mangas.length > 0 && dynamicHero) {

  const randomIndex =
    Math.floor(Math.random() * mangas.length);

  const featured =
    mangas[randomIndex];

  const featuredTitle =
    Object.values(
      featured.attributes?.title || {}
    )[0] || "KairoDEX";

  const featuredCoverRel =
    featured.relationships?.find(
      (rel) => rel.type === "cover_art"
    );

  if (featuredCoverRel?.attributes?.fileName) {

    const heroCover =
      `${API_BASE}/api/image?mangaId=${featured.id}&fileName=${encodeURIComponent(featuredCoverRel.attributes.fileName)}`;

    dynamicHero.style.backgroundImage =
      `url("${heroCover}")`;

    if (heroTitle) {
      heroTitle.innerText = featuredTitle;
    }

    if (heroText) {
      heroText.innerText =
        "Descubra novos capítulos e continue sua jornada no KairoDEX.";
    }

  }

}

    mangas.forEach((manga) => {
      const mangaId = manga.id;

      const title =
        Object.values(manga.attributes?.title || {})[0] || "Sem título";

      let coverUrl = "https://placehold.co/300x450?text=Sem+Capa";

      const coverRel = manga.relationships?.find(
        (rel) => rel.type === "cover_art"
      );

      if (coverRel?.attributes?.fileName) {
        const fileName = coverRel.attributes.fileName;

        coverUrl =
          `${API_BASE}/api/image?mangaId=${mangaId}&fileName=${encodeURIComponent(fileName)}`;
      }

      const card = document.createElement("a");

      card.href = `/pages/manga.html?id=${mangaId}`;
      card.className = "manga-card";

      card.innerHTML = `
        <div class="manga-cover-wrap">
          <img src="${coverUrl}" alt="${title}" loading="lazy">
          <span class="manga-tag">
  ${getSourceBadge(SOURCES.MANGADEX)}
</span>
        </div>

        <div class="manga-card-info">
          <h3>${title}</h3>
          <p>Ver detalhes</p>
        </div>
      `;

      mangaGrid.appendChild(card);
    });
  } catch (error) {
    console.log("Erro API:", error);

    showMessage(
      "Erro ao carregar mangás",
      "Verifique se a API da Vercel está online."
    );
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const value = searchInput.value.trim();
      loadMangas(value);
    }, 400);
  });
}

const catalogLeft = document.getElementById("catalog-left");
const catalogRight = document.getElementById("catalog-right");

if (catalogLeft && catalogRight && mangaGrid) {
  catalogLeft.addEventListener("click", () => {
    mangaGrid.scrollBy({
      left: -500,
      behavior: "smooth"
    });
  });

  catalogRight.addEventListener("click", () => {
    mangaGrid.scrollBy({
      left: 500,
      behavior: "smooth"
    });
  });
}

/* TRENDING */

const trendingGrid =
  document.getElementById("trending-grid");

async function loadTrendingMangas() {

  if (!trendingGrid) return;

  try {

    const response =
      await fetch(`${API_BASE}/api/mangas`);

    const result =
      await response.json();

    const mangas =
      Array.isArray(result.data)
        ? result.data.slice(0, 6)
        : [];

    trendingGrid.innerHTML = "";

    mangas.forEach((manga, index) => {

      const mangaId = manga.id;

      const title =
        Object.values(
          manga.attributes?.title || {}
        )[0] || "Sem título";

      let coverUrl =
        "https://placehold.co/300x450";

      const coverRel =
        manga.relationships?.find(
          (rel) => rel.type === "cover_art"
        );

      if (coverRel?.attributes?.fileName) {

        coverUrl =
          `${API_BASE}/api/image?mangaId=${mangaId}&fileName=${encodeURIComponent(coverRel.attributes.fileName)}`;

      }

      trendingGrid.innerHTML += `

        <a
          href="/pages/manga.html?id=${mangaId}"
          class="trending-card"
        >

          <div class="trending-rank">
            #${index + 1}
          </div>

          <img
            src="${coverUrl}"
            alt="${title}"
          >

          <div class="trending-overlay">

            <h3>${title}</h3>

            <span>
              Trending no KairoDEX
            </span>

          </div>

        </a>

      `;

    });

  } catch (error) {

    console.log(error);

  }

}

loadTrendingMangas();

/* CATEGORIAS RÁPIDAS */

const categoryButtons =
  document.querySelectorAll(".category-btn");

if (categoryButtons.length > 0) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const search =
        button.dataset.search;

      if (searchInput) {
        searchInput.value = search;
      }

      loadMangas(search);

      categoryButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
    });
  });
}

loadMangas();