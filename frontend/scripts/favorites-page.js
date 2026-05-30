import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* =========================
   FIREBASE
========================= */

const auth =
  getAuth(app);

/* =========================
   ELEMENTOS
========================= */

const favoritesGrid =
  document.getElementById("favorites-grid");

/* =========================
   HELPERS
========================= */

function showMessage(title, text) {
  favoritesGrid.innerHTML = `
    <div class="empty-message">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function createFavoriteCard(manga) {
  return `
    <a
      href="/pages/manga.html?id=${manga.mangaId}"
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
        <p>Favoritado</p>
      </div>

    </a>
  `;
}

/* =========================
   LOAD FAVORITES
========================= */

async function loadFavorites(user) {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "users",
          user.uid,
          "favorites"
        )
      );

    favoritesGrid.innerHTML = "";

    if (snapshot.empty) {

      showMessage(
        "Nenhum favorito",
        "Adicione mangás aos favoritos para vê-los aqui."
      );

      return;
    }

    snapshot.forEach((doc) => {

      const manga =
        doc.data();

      favoritesGrid.innerHTML +=
        createFavoriteCard(manga);

    });

  } catch (error) {

    console.log(error);

    showMessage(
      "Erro",
      "Não foi possível carregar seus favoritos."
    );

  }

}

/* =========================
   INIT
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href =
      "/pages/login.html";

    return;

  }

  await loadFavorites(user);

});