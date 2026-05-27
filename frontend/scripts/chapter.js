const API_BASE = "https://kairodex.vercel.app";

const params = new URLSearchParams(window.location.search);

const chapterId = params.get("id");

const source = params.get("source") || "mangadex";

const reader = document.getElementById("reader");

async function loadChapter() {
  try {
    reader.innerHTML = "<p>Carregando capítulo...</p>";

    localStorage.setItem(
      "lastChapter",
      JSON.stringify({
        chapterId,
        mangaId: params.get("manga"),
        source,
        updatedAt: Date.now()
      })
    );

    if (source === "manual") {
      const response = await fetch(
        `${API_BASE}/api/manual-reader?id=${chapterId}`
      );

      const data = await response.json();

      if (!data.pages || data.pages.length === 0) {
        reader.innerHTML = "<p>Capítulo manual sem páginas.</p>";
        return;
      }

      reader.innerHTML = "";

      data.pages.forEach((page, index) => {
        reader.innerHTML += `
          <img
            src="${page}"
            class="reader-image"
            alt="Página ${index + 1}"
            loading="lazy"
          >
        `;
      });

      return;
    }

    const response = await fetch(
      `${API_BASE}/api/chapter?id=${chapterId}`
    );

    const data = await response.json();

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

    pages.forEach((page, index) => {
      const imageUrl = `${baseUrl}/data/${hash}/${page}`;

      reader.innerHTML += `
        <img
          src="${imageUrl}"
          class="reader-image"
          alt="Página ${index + 1}"
          loading="lazy"
        >
      `;
    });

  } catch (error) {
    console.log(error);
    reader.innerHTML = "<p>Erro ao carregar capítulo.</p>";
  }
}

loadChapter();