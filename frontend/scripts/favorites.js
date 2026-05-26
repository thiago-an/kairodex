import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth = getAuth(app);

const params = new URLSearchParams(window.location.search);
const mangaId = params.get("id");

const favoriteBtn = document.getElementById("favorite-btn");

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  favoriteBtn.addEventListener("click", async () => {
    const title = document.getElementById("manga-title").innerText;
    const cover = document.getElementById("manga-cover").src;

    await setDoc(doc(db, "users", user.uid, "favorites", mangaId), {
      mangaId,
      title,
      cover,
      createdAt: Date.now()
    });

    alert("Mangá adicionado aos favoritos!");
  });
});