import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth =
  getAuth(app);

const PLACEHOLDER_COVER =
  "https://placehold.co/300x450?text=Sem+Capa";

const params =
  new URLSearchParams(window.location.search);

const mangaId =
  params.get("id");

const favoriteBtn =
  document.getElementById("favorite-btn");

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

function getLocalFavorites() {
  return safeParse(
    localStorage.getItem("favorites"),
    []
  );
}

function setLocalFavorites(favorites) {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function getCurrentManga() {
  return safeParse(
    localStorage.getItem("currentManga"),
    null
  );
}

function isFavorite(id) {
  const favorites =
    getLocalFavorites();

  return favorites.some((item) => {
    return item.id === id || item.mangaId === id;
  });
}

function normalizeManga(manga) {
  return {
    id: mangaId,
    mangaId,
    title: manga?.title || "Sem título",
    cover: manga?.cover || PLACEHOLDER_COVER,
    description: manga?.description || "",
    createdAt: Date.now()
  };
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
  } else {
    const index =
      favorites.findIndex((item) => {
        return item.id === manga.id || item.mangaId === manga.mangaId;
      });

    favorites[index] =
      {
        ...favorites[index],
        ...manga
      };
  }

  setLocalFavorites(favorites);
}

function markAsFavorite() {
  if (!favoriteBtn) return;

  favoriteBtn.innerText =
    "❤️ Favoritado";

  favoriteBtn.disabled =
    true;
}

async function saveFavoriteFirestore(user, manga) {
  await setDoc(
    doc(db, "users", user.uid, "favorites", mangaId),
    manga
  );
}

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

    const favoriteData =
      normalizeManga(currentManga);

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