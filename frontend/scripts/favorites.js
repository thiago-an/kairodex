import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* =========================
   FIREBASE
========================= */

const auth =
  getAuth(app);

/* =========================
   PARAMS / ELEMENTOS
========================= */

const params =
  new URLSearchParams(window.location.search);

const mangaId =
  params.get("id");

const favoriteBtn =
  document.getElementById("favorite-btn");

/* =========================
   STORAGE
========================= */

function getLocalFavorites() {
  return JSON.parse(
    localStorage.getItem("favorites")
  ) || [];
}

function setLocalFavorites(favorites) {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function getCurrentManga() {
  return JSON.parse(
    localStorage.getItem("currentManga")
  );
}

function isFavorite(mangaId) {
  const favorites =
    getLocalFavorites();

  return favorites.some((item) => {
    return item.id === mangaId || item.mangaId === mangaId;
  });
}

function saveFavoriteLocal(manga) {
  const favorites =
    getLocalFavorites();

  const exists =
    favorites.some((item) => {
      return item.id === manga.id || item.mangaId === manga.mangaId;
    });

  if (!exists) {
    favorites.unshift(manga);

    setLocalFavorites(favorites);
  }
}

/* =========================
   UI
========================= */

function markAsFavorite() {
  if (!favoriteBtn) return;

  favoriteBtn.innerText =
    "❤️ Favoritado";

  favoriteBtn.disabled =
    true;
}

/* =========================
   FIRESTORE
========================= */

async function saveFavoriteFirestore(user, manga) {
  await setDoc(
    doc(db, "users", user.uid, "favorites", mangaId),
    manga
  );
}

/* =========================
   INIT
========================= */

onAuthStateChanged(auth, (user) => {
  if (!user || !favoriteBtn || !mangaId) return;

  if (isFavorite(mangaId)) {
    markAsFavorite();
  }

  favoriteBtn.addEventListener("click", async () => {
    const currentManga =
      getCurrentManga();

    if (!currentManga) {
      alert("Aguarde o mangá carregar antes de favoritar.");
      return;
    }

    const favoriteData = {
      ...currentManga,
      id: mangaId,
      mangaId,
      createdAt: Date.now()
    };

    try {
      await saveFavoriteFirestore(user, favoriteData);

      saveFavoriteLocal(favoriteData);

      markAsFavorite();

      alert("Mangá adicionado aos favoritos!");

    } catch (error) {
      console.log("Erro favorito:", error);

      alert("Erro ao favoritar mangá.");
    }
  });
});