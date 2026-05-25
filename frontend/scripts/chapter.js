const API_BASE = "https://kairodex-api.onrender.com";

const params = new URLSearchParams(window.location.search);
const chapterId = params.get("id");

const reader = document.getElementById("reader");

async function loadChapter() {
  try {
    reader.innerHTML = "<p>Carregando capítulo...</p>";

    if (!chapterId) {
      reader.innerHTML = "<p>Capítulo não encontrado.</p>";
      return;
    }

    const response = await fetch(`${API_BASE}/api/chapter/${chapterId}`);
    const data = await response.json();

    console.log("Dados do capítulo:", data);

    if (!data.chapter || !data.chapter.data || data.chapter.data.length === 0) {
      reader.innerHTML = "<p>Nenhuma página encontrada neste capítulo.</p>";
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
          loading="lazy"
          alt="Página do capítulo"
        >
      `;
    });

  } catch (error) {
    console.error("Erro ao carregar capítulo:", error);
    reader.innerHTML = "<p>Erro ao carregar o capítulo.</p>";
  }
}

loadChapter();