const API_BASE = "https://kairodex.vercel.app";

const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const chaptersDiv = document.getElementById("chapters");

async function loadChapters() {
  try {
    chaptersDiv.innerHTML = "<p>Carregando capítulos...</p>";

    const validChapters = [];

    const manualResponse = await fetch(
      `${API_BASE}/api/manual-chapters?mangaId=${mangaId}`
    );

    const manualResult = await manualResponse.json();

    const manualChapters = manualResult.data || [];

    const response = await fetch(
      `${API_BASE}/api/chapters?id=${mangaId}`
    );

    const result = await response.json();

    const apiChapters = Array.isArray(result.data) ? result.data : [];

    for (const chapter of apiChapters) {
      try {
        const chapterResponse = await fetch(
          `${API_BASE}/api/chapter?id=${chapter.id}`
        );

        const chapterData = await chapterResponse.json();

        if (
          chapterData.chapter &&
          chapterData.chapter.hash &&
          chapterData.chapter.data &&
          chapterData.chapter.data.length > 0
        ) {
          validChapters.push(chapter);
        }
      } catch (error) {
        console.log("Capítulo inválido:", chapter.id);
      }
    }

    chaptersDiv.innerHTML = "";

    manualChapters.forEach((chapter) => {
      chaptersDiv.innerHTML += `
        <a
          href="./chapter.html?id=${chapter.id}&source=manual&manga=${mangaId}"
          class="chapter-item"
        >
          ${chapter.title}
        </a>
      `;
    });

    validChapters.forEach((chapter) => {
      chaptersDiv.innerHTML += `
        <a
          href="./chapter.html?id=${chapter.id}&manga=${mangaId}"
          class="chapter-item"
        >
          Capítulo ${chapter.attributes.chapter || "?"}
        </a>
      `;
    });

    if (manualChapters.length === 0 && validChapters.length === 0) {
      chaptersDiv.innerHTML = `
        <div class="empty-message">
          <h3>Nenhum capítulo em PT-BR disponível</h3>
          <p>Este mangá ainda não possui capítulos em português brasileiro.</p>
        </div>
      `;
    }
  } catch (error) {
    console.log(error);
    chaptersDiv.innerHTML = "<p>Erro ao carregar capítulos.</p>";
  }
}

loadChapters();