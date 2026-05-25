const API_BASE = "https://kairodex-api.onrender.com";

const params = new URLSearchParams(window.location.search);
const chapterId = params.get("id");

const reader = document.getElementById("reader");

async function loadChapter() {
  try {
    reader.innerHTML = "<p>Carregando capítulo...</p>";

    const response = await fetch(`${API_BASE}/api/chapter/${chapterId}`);
    const data = await response.json();

    console.log("Dados completos:", data);

    if (
      !data.baseUrl ||
      !data.chapter ||
      !data.chapter.hash ||
      !data.chapter.data ||
      data.chapter.data.length === 0
    ) {
      reader.innerHTML = "<p>Este capítulo não possui páginas disponíveis.</p>";
      return;
    }

    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const pages = data.chapter.data;

    reader.innerHTML = "";

    pages.forEach((page) => {
      const imageUrl = `${baseUrl}/data/${hash}/${page}`;

      reader.innerHTML += `
        <img
          src="${imageUrl}"
          class="manga-page-img"
          alt="Página"
        >
      `;
    });

  } catch (error) {
    console.log(error);
    reader.innerHTML = "<p>Erro ao carregar capítulo.</p>";
  }
}

loadChapter();