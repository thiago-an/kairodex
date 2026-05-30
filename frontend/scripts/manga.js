/* =========================
   CONFIG
========================= */

const API_BASE =
  "https://kairodex.vercel.app";

/* =========================
   PARAMS
========================= */

const params =
  new URLSearchParams(window.location.search);

const mangaId =
  params.get("id");

/* =========================
   ELEMENTOS
========================= */

const titleEl =
  document.getElementById("manga-title");

const coverEl =
  document.getElementById("manga-cover");

const descriptionEl =
  document.getElementById("manga-description");

const genresDiv =
  document.getElementById("manga-genres");

/* =========================
   HELPERS
========================= */

function getMangaTitle(manga) {
  return (
    Object.values(manga.attributes?.title || {})[0] ||
    "Sem título"
  );
}

function getDescription(manga) {
  return (
    manga.attributes?.description?.["pt-br"] ||
    manga.attributes?.description?.en ||
    "Sem descrição disponível."
  );
}

function getCoverUrl(manga) {
  const coverRel =
    manga.relationships?.find((rel) => rel.type === "cover_art");

  if (!coverRel?.attributes?.fileName) {
    return "https://placehold.co/300x450?text=Sem+Capa";
  }

  return `${API_BASE}/api/image?mangaId=${mangaId}&fileName=${encodeURIComponent(
    coverRel.attributes.fileName
  )}`;
}

function saveCurrentManga(mangaData) {
  localStorage.setItem(
    "currentManga",
    JSON.stringify(mangaData)
  );
}

/* =========================
   UI
========================= */

function showError() {
  if (titleEl) {
    titleEl.innerText =
      "Erro ao carregar mangá";
  }

  if (descriptionEl) {
    descriptionEl.innerText =
      "Não foi possível buscar as informações deste mangá.";
  }
}

function renderGenres(manga) {
  if (!genresDiv) return;

  genresDiv.innerHTML = "";

  const tags =
    manga.attributes?.tags || [];

  tags.slice(0, 12).forEach((tag) => {
    const genre =
      tag.attributes?.name?.pt_br ||
      tag.attributes?.name?.en ||
      "Gênero";

    genresDiv.innerHTML += `
      <span class="genre">
        ${genre}
      </span>
    `;
  });
}

function renderManga(manga) {
  const mangaTitle =
    getMangaTitle(manga);

  const description =
    getDescription(manga);

  const coverUrl =
    getCoverUrl(manga);

  if (titleEl) {
    titleEl.innerText =
      mangaTitle;
  }

  if (descriptionEl) {
    descriptionEl.innerText =
      description;
  }

  if (coverEl) {
    coverEl.src =
      coverUrl;
  }

  renderGenres(manga);

  saveCurrentManga({
    id: mangaId,
    mangaId,
    title: mangaTitle,
    cover: coverUrl,
    description
  });
}

/* =========================
   API
========================= */

async function fetchManga() {
  const response =
    await fetch(`${API_BASE}/api/manga?id=${mangaId}`);

  const data =
    await response.json();

  if (!response.ok || !data.data) {
    throw new Error("Erro ao carregar mangá.");
  }

  return data.data;
}

/* =========================
   INIT
========================= */

async function loadManga() {
  if (!mangaId) {
    showError();
    return;
  }

  try {
    const manga =
      await fetchManga();

    renderManga(manga);

  } catch (error) {
    console.log("Erro manga:", error);
    showError();
  }
}

loadManga();