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

const continueDiv = document.getElementById("continue-reading");

onAuthStateChanged(auth, async(user)=>{

  if(!user) return;

  const progressRef = collection(
    db,
    "users",
    user.uid,
    "progress"
  );

  const progressSnap = await getDocs(progressRef);

  progressSnap.forEach(async(progressDoc)=>{

    const progress = progressDoc.data();

    const mangaRef = doc(
      db,
      "mangas",
      progress.mangaId
    );

    const mangaSnap = await getDoc(mangaRef);

    if(mangaSnap.exists()){

      const manga = mangaSnap.data();

      continueDiv.innerHTML += `

        <a href="../pages/chapter.html?id=${progress.chapterId}" class="continue-card">

          <img src="${manga.cover}">

          <div>

            <h2>Continue lendo</h2>

            <h3>${manga.title}</h3>

          </div>

        </a>

      `;

    }

  });

});