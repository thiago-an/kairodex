const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const chaptersDiv = document.getElementById("chapters");

console.log("MANGA ID:", mangaId);

async function loadChapters(){

  try{

    const response = await fetch(

      `http://localhost:3000/api/chapters/${mangaId}`

    );

    const result = await response.json();

    console.log(result);

    chaptersDiv.innerHTML = "";

    result.data.forEach((chapter)=>{

      chaptersDiv.innerHTML += `

        <a
          href="./chapter.html?id=${chapter.id}"
          class="chapter-item"
        >

          Capítulo ${chapter.attributes.chapter || "?"}

        </a>

      `;

    });

  }catch(error){

    console.log(error);

  }

}

loadChapters();