console.log("MANGAS API CARREGOU");

const mangaGrid = document.getElementById("manga-grid");

async function loadMangas(){

  try{

    const response = await fetch(
      "http://localhost:3000/api/mangas"
    );

    const result = await response.json();

    const mangas = result.data;

    mangaGrid.innerHTML = "";

    for(const manga of mangas){

      try{

        const mangaId = manga.id;

        const titleObj = manga.attributes.title;

        const title =
          Object.values(titleObj)[0] || "Sem título";

        let coverUrl =
          "https://placehold.co/300x450?text=Sem+Capa";

        const coverRel = manga.relationships.find(
          rel => rel.type === "cover_art"
        );

        if(coverRel){

          const coverResponse = await fetch(
            `http://localhost:3000/api/cover/${coverRel.id}`
          );

          const coverData = await coverResponse.json();

          if(
            coverData.data &&
            coverData.data.attributes
          ){

            const fileName =
              coverData.data.attributes.fileName;

            coverUrl =
              `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;

          }

        }

        mangaGrid.innerHTML += `

          <a href="./manga.html?id=${mangaId}" class="manga-card">

            <img src="${coverUrl}">

            <h3>${title}</h3>

          </a>

        `;

      }catch(error){

        console.log("Erro no mangá:", error);

      }

    }

  }catch(error){

    console.log("Erro API:", error);

  }

}

loadMangas();