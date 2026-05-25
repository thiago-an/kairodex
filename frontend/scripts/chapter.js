const params = new URLSearchParams(window.location.search);

const chapterId = params.get("id");

const reader = document.getElementById("reader");

async function loadChapter(){

  const response = await fetch(

    `https://api.mangadex.org/at-home/server/${chapterId}`

  );

  const data = await response.json();

  const baseUrl = data.baseUrl;

  const chapter = data.chapter;

  chapter.data.forEach((page)=>{

    const imageUrl = `

      ${baseUrl}/data/${chapter.hash}/${page}

    `;

    reader.innerHTML += `

      <img src="${imageUrl}" class="manga-page-img">

    `;

  });

}

loadChapter();