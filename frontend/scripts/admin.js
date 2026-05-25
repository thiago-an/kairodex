import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const mangaForm = document.getElementById("manga-form");

mangaForm.addEventListener("submit", async(e)=>{

  e.preventDefault();

  const title = document.getElementById("title").value;

  const cover = document.getElementById("cover").value;

  const description = document.getElementById("description").value;

  const genres = document
    .getElementById("genres")
    .value
    .split(",");

  await addDoc(

    collection(db,"mangas"),

    {
      title,
      cover,
      description,
      genres,
      views:0
    }

  );

  alert("Mangá criado!");

  mangaForm.reset();

});