const API_BASE = "https://kairodex.vercel.app";

const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const title = document.getElementById("manga-title");

const cover = document.getElementById("manga-cover");

const description = document.getElementById("manga-description");

const genresDiv = document.getElementById("manga-genres");

async function loadManga() {

  try {

    const response = await fetch(
      `${API_BASE}/api/manga?id=${mangaId}`
    );

    const data = await response.json();

    const manga = data.data;

    const titleObj = manga.attributes.title;

    const mangaTitle =
      Object.values(titleObj)[0] || "Sem título";

    title.innerText = mangaTitle;

    description.innerText =
      manga.attributes.description["pt-br"]
      || manga.attributes.description.en
      || "Sem descrição";

    manga.attributes.tags.forEach((tag) => {

      genresDiv.innerHTML += `
        <span class="genre">
          ${tag.attributes.name.en}
        </span>
      `;

    });

    const coverRel = manga.relationships?.find(
      rel => rel.type === "cover_art"
    );

    if (coverRel?.attributes?.fileName) {

      const fileName =
        coverRel.attributes.fileName;

      cover.src =
        `${API_BASE}/api/image?mangaId=${mangaId}&fileName=${encodeURIComponent(fileName)}`;

    }

  } catch (error) {

    console.log(error);

  }

}

loadManga();