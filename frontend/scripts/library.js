import app from "./firebase.js";
import { db } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth = getAuth(app);

const libraryGrid = document.getElementById("library-grid");

onAuthStateChanged(auth, async(user)=>{

  if(!user){

    window.location.href = "/pages/login.html";

    return;

  }

  const favoritesRef = collection(
    db,
    "users",
    user.uid,
    "favorites"
  );

  const favoritesSnap = await getDocs(favoritesRef);

  favoritesSnap.forEach(async(favoriteDoc)=>{

    const favorite = favoriteDoc.data();

    const mangaRef = doc(db,"mangas",favorite.mangaId);

    const mangaSnap = await getDoc(mangaRef);

    if(mangaSnap.exists()){

      const manga = mangaSnap.data();

      libraryGrid.innerHTML += `

        <a href="/pages/manga.html?id=${favorite.mangaId}" class="manga-card">

          <img src="${manga.cover}">

          <h3>${manga.title}</h3>

        </a>

      `;

    }

  });

});