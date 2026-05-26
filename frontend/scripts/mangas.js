const API_BASE = "https://kairodex.vercel.app";

const mangaGrid = document.getElementById("manga-grid");
const searchInput = document.getElementById("search-input");

async function loadMangas(search = "") {
  try {
    mangaGrid.innerHTML = "<p>Carregando mangás...</p>";

    const url = search
      ? `${API_BASE}/api/mangas?search=${encodeURIComponent(search)}`
      : `${API_BASE}/api/mangas`;

    const response = await fetch(`${API_BASE}/api/mangas`);
    const result = await response.json();

    if (result.error) {
      mangaGrid.innerHTML = `<p>Erro da API: ${result.error}</p>`;
      return;
    }

    const mangas = Array.isArray(result.data) ? result.data : [];

    mangaGrid.innerHTML = "";

    if (mangas.length === 0) {
      mangaGrid.innerHTML = "<p>Nenhum mangá encontrado.</p>";
      return;
    }

    for (const manga of mangas) {
      const mangaId = manga.id;
      const title = Object.values(manga.attributes.title || {})[0] || "Sem título";

      let coverUrl = "https://placehold.co/300x450?text=Sem+Capa";

      const coverRel = manga.relationships?.find(
        rel => rel.type === "cover_art"
      );

      if (coverRel) {
        const coverResponse = await fetch(`${API_BASE}/api/cover?id=${coverRel.id}`);
        const coverData = await coverResponse.json();

        if (coverData.data?.attributes?.fileName) {
          const fileName = coverData.data.attributes.fileName;
          coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
        }
      }

      mangaGrid.innerHTML += `
        <a href="./manga.html?id=${mangaId}" class="manga-card">
          <img src="${coverUrl}" alt="${title}">
          <h3>${title}</h3>
        </a>
      `;
    }

  } catch (error) {
    console.log("Erro API:", error);
    mangaGrid.innerHTML = "<p>Erro ao carregar mangás.</p>";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();
    loadMangas(value);
  });
}

loadMangas();