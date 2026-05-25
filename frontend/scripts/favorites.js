import app from "./firebase.js";
import { db } from "./firebase.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth = getAuth(app);

const params = new URLSearchParams(window.location.search);

const mangaId = params.get("id");

const favoriteBtn = document.getElementById("favorite-btn");

favoriteBtn.addEventListener("click", async()=>{

  const user = auth.currentUser;

  if(!user){

    alert("Faça login");

    return;

  }

  const favoriteRef = doc(
    db,
    "users",
    user.uid,
    "favorites",
    mangaId
  );

  await setDoc(favoriteRef,{

    mangaId:mangaId,
    createdAt:Date.now()

  });

  alert("Mangá favoritado!");

});