const API_BASE = "https://kairodex.vercel.app/api/mangas";

const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const chaptersDiv = document.getElementById("chapters");

async function loadChapters() {

  try {

    const response = await fetch(
      `${API_BASE}/api/chapters?id=${mangaId}`
    );

    const result = await response.json();

    chaptersDiv.innerHTML = "<p>Carregando capítulos...</p>";

    const validChapters = [];

    for (const chapter of result.data) {

      try {

        const chapterResponse = await fetch(
          `${API_BASE}/api/chapter/${chapter.id}`
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

    if (validChapters.length === 0) {

      chaptersDiv.innerHTML =
        "<p>Nenhum capítulo disponível.</p>";

      return;

    }

    validChapters.forEach((chapter) => {

      chaptersDiv.innerHTML += `

        <a
          href="./chapter.html?id=${chapter.id}"
          class="chapter-item"
        >

          Capítulo ${chapter.attributes.chapter || "?"}

        </a>

      `;

    });

  } catch (error) {

    console.log(error);

    chaptersDiv.innerHTML =
      "<p>Erro ao carregar capítulos.</p>";

  }

}

loadChapters();