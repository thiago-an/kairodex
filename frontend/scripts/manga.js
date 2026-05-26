const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const title = document.getElementById("manga-title");

const cover = document.getElementById("manga-cover");

const description = document.getElementById("manga-description");

const genresDiv = document.getElementById("manga-genres");

async function loadManga(){

const response = await fetch(`${API_BASE}/api/manga?id=${mangaId}`);

  const data = await response.json();

  const manga = data.data;

const titleObj = manga.attributes.title;

const mangaTitle =
  Object.values(titleObj)[0] || "Sem título";

  title.innerText = mangaTitle;

  description.innerText =
    manga.attributes.description.en
    || manga.attributes.description["pt-br"]
    || "Sem descrição";

  manga.attributes.tags.forEach((tag)=>{

    genresDiv.innerHTML += `

      <span class="genre">

        ${tag.attributes.name.en}

      </span>

    `;

  });

  const coverRel = manga.relationships.find(

    rel => rel.type === "cover_art"

  );

  if(coverRel){

    const coverResponse = await fetch(

      `https://kairodex.vercel.app/api/mangas/api/cover?id=${coverRel.id}`

    );

    const coverData = await coverResponse.json();

    const fileName = coverData.data.attributes.fileName;

    cover.src = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;

  }

}

loadManga();