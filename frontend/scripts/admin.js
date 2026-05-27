import {
  storage,
  db
} from "./firebase.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const mangaIdInput =
  document.getElementById("manga-id");

const chapterNumberInput =
  document.getElementById("chapter-number");

const chapterTitleInput =
  document.getElementById("chapter-title");

const chapterPagesInput =
  document.getElementById("chapter-pages");

const uploadBtn =
  document.getElementById("upload-btn");

const uploadStatus =
  document.getElementById("upload-status");

uploadBtn.addEventListener("click", async () => {

  try {

    uploadStatus.innerHTML =
      "<p>Enviando capítulo...</p>";

    const mangaId =
      mangaIdInput.value.trim();

    const chapterNumber =
      chapterNumberInput.value.trim();

    const chapterTitle =
      chapterTitleInput.value.trim();

    const files =
      Array.from(chapterPagesInput.files);

    if (
      !mangaId ||
      !chapterNumber ||
      files.length === 0
    ) {

      uploadStatus.innerHTML =
        "<p>Preencha todos os campos.</p>";

      return;

    }

    const imageUrls = [];

    for (const file of files) {

      const storageRef = ref(
        storage,
        `chapters/${mangaId}/${chapterNumber}/${file.name}`
      );

      await uploadBytes(storageRef, file);

      const url =
        await getDownloadURL(storageRef);

      imageUrls.push(url);

    }

    await addDoc(
      collection(db, "manualChapters"),
      {
        mangaId,
        chapterNumber,
        chapterTitle,
        pages: imageUrls,
        createdAt: Date.now()
      }
    );

    uploadStatus.innerHTML =
      "<p>Capítulo publicado com sucesso.</p>";

  } catch (error) {

    console.log(error);

    uploadStatus.innerHTML =
      "<p>Erro ao publicar capítulo.</p>";

  }

});