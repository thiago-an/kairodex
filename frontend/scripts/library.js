import app, { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth = getAuth(app);

const favoritesGrid =
  document.getElementById("favorites-grid");

onAuthStateChanged(auth, async(user)=>{

  if(!user){

    window.location.href = "/pages/login.html";

    return;

  }

  const snapshot = await getDocs(

    collection(
      db,
      "users",
      user.uid,
      "favorites"
    )

  );

  favoritesGrid.innerHTML = "";

  snapshot.forEach((doc)=>{

    const manga = doc.data();

    favoritesGrid.innerHTML += `

      <a
        href="/pages/manga.html?id=${manga.mangaId}"
        class="manga-card"
      >

        <img src="${manga.cover}">

        <h3>${manga.title}</h3>

      </a>

    `;

  });

});