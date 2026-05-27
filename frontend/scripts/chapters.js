import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const API_BASE = "https://kairodex.vercel.app";

const params = new URLSearchParams(window.location.search);
const mangaId = params.get("id");

const chaptersDiv = document.getElementById("chapters");

async function loadChapters() {
  try {
    chaptersDiv.innerHTML = "<p>Carregando capítulos...</p>";

    const manualQuery = query(
      collection(db, "manualChapters"),
      where("mangaId", "==", mangaId)
    );

    const manualSnapshot = await getDocs(manualQuery);

    const manualChapters = [];

    manualSnapshot.forEach((doc) => {
      manualChapters.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const response = await fetch(`${API_BASE}/api/chapters?id=${mangaId}`);
    const result = await response.json();

    const apiChapters = Array.isArray(result.data) ? result.data : [];

    chaptersDiv.innerHTML = "";

    manualChapters.forEach((chapter) => {
      chaptersDiv.innerHTML += `
        <a
          href="./chapter.html?id=${chapter.id}&source=firebase&manga=${mangaId}"
          class="chapter-item"
        >
          Capítulo ${chapter.chapterNumber} - ${chapter.chapterTitle || ""}
        </a>
      `;
    });

    apiChapters.forEach((chapter) => {
      chaptersDiv.innerHTML += `
        <a
          href="./chapter.html?id=${chapter.id}&source=mangadex&manga=${mangaId}"
          class="chapter-item"
        >
          Capítulo ${chapter.attributes.chapter || "?"}
        </a>
      `;
    });

    if (manualChapters.length === 0 && apiChapters.length === 0) {
      chaptersDiv.innerHTML = `
        <div class="empty-message">
          <h3>Nenhum capítulo em PT-BR disponível</h3>
          <p>Este mangá ainda não possui capítulos cadastrados.</p>
        </div>
      `;
    }

  } catch (error) {
    console.log(error);
    chaptersDiv.innerHTML = "<p>Erro ao carregar capítulos.</p>";
  }
}

loadChapters();