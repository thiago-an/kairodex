import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth =
  getAuth(app);

const containers = {
  reading: document.getElementById("library-reading"),
  completed: document.getElementById("library-completed"),
  planned: document.getElementById("library-planned"),
  dropped: document.getElementById("library-dropped")
};

function createLibraryCard(manga) {
  return `
    <a
      href="/pages/manga.html?id=${manga.mangaId || manga.id}"
      class="manga-card"
    >
      <div class="manga-cover-wrap">
        <img
          src="${manga.cover}"
          alt="${manga.title}"
          loading="lazy"
        >
      </div>

      <div class="manga-card-info">
        <h3>${manga.title}</h3>
        <p>${manga.statusLabel || "Na biblioteca"}</p>
      </div>
    </a>
  `;
}

function showEmpty(container, text) {
  if (!container) return;

  container.innerHTML = `
    <div class="empty-message">
      <h3>Nenhum mangá</h3>
      <p>${text}</p>
    </div>
  `;
}

function getLocalLibrary() {
  return JSON.parse(localStorage.getItem("library")) || [];
}

async function fetchLibrary(user) {
  const snapshot =
    await getDocs(
      collection(db, "users", user.uid, "library")
    );

  const items = [];

  snapshot.forEach((doc) => {
    items.push(doc.data());
  });

  return items;
}

function renderSection(status, items, emptyText) {
  const container =
    containers[status];

  if (!container) return;

  const filtered =
    items.filter((item) => item.status === status);

  if (!filtered.length) {
    showEmpty(container, emptyText);
    return;
  }

  container.innerHTML =
    filtered.map(createLibraryCard).join("");
}

function renderLibrary(items) {
  renderSection(
    "reading",
    items,
    "Mangás que você está lendo aparecerão aqui."
  );

  renderSection(
    "completed",
    items,
    "Mangás concluídos aparecerão aqui."
  );

  renderSection(
    "planned",
    items,
    "Mangás planejados para leitura aparecerão aqui."
  );

  renderSection(
    "dropped",
    items,
    "Mangás abandonados aparecerão aqui."
  );
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href =
      "/pages/login.html";

    return;
  }

  try {
    let items =
      await fetchLibrary(user);

    if (!items.length) {
      items =
        getLocalLibrary();
    }

    renderLibrary(items);

  } catch (error) {
    console.log("Erro library:", error);

    renderLibrary(
      getLocalLibrary()
    );
  }
});