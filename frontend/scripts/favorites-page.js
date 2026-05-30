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

const PLACEHOLDER_COVER =
  "https://placehold.co/300x450?text=Sem+Capa";

const favoritesGrid =
  document.getElementById("favorites-grid");

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

function showMessage(title, text) {
  if (!favoritesGrid) return;

  favoritesGrid.innerHTML = `
    <div class="empty-message">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function normalizeFavorite(manga) {
  return {
    id: manga.id || manga.mangaId,
    mangaId: manga.mangaId || manga.id,
    title: manga.title || "Sem título",
    cover: manga.cover || PLACEHOLDER_COVER
  };
}

function syncLocalFavorites(favorites) {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function createFavoriteCard(rawManga) {
  const manga =
    normalizeFavorite(rawManga);

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
          onerror="this.src='${PLACEHOLDER_COVER}'"
        >
      </div>

      <div class="manga-card-info">
        <h3>${manga.title}</h3>
        <p>Favoritado</p>
      </div>
    </a>
  `;
}

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
      const localFavorites =
        safeParse(localStorage.getItem("favorites"), []);

      if (localFavorites.length) {
        favoritesGrid.innerHTML =
          localFavorites.map(createFavoriteCard).join("");

        return;
      }

      showMessage(
        "Nenhum favorito",
        "Adicione mangás aos favoritos para vê-los aqui."
      );

      return;
    }

    const favorites =
      [];

    snapshot.forEach((doc) => {
      favorites.push(
        normalizeFavorite(doc.data())
      );
    });

    syncLocalFavorites(favorites);

    favoritesGrid.innerHTML =
      favorites.map(createFavoriteCard).join("");

  } catch (error) {
    console.log(error);

    const localFavorites =
      safeParse(localStorage.getItem("favorites"), []);

    if (localFavorites.length) {
      favoritesGrid.innerHTML =
        localFavorites.map(createFavoriteCard).join("");

      return;
    }

    showMessage(
      "Erro",
      "Não foi possível carregar seus favoritos."
    );
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href =
      "/pages/login.html";

    return;
  }

  await loadFavorites(user);
});