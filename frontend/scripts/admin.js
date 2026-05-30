import { db, storage } from "./firebase.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

import {
  collection,
  addDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* ELEMENTOS */

const mangaIdInput = document.getElementById("manga-id");
const chapterNumberInput = document.getElementById("chapter-number");
const chapterTitleInput = document.getElementById("chapter-title");
const chapterPagesInput = document.getElementById("chapter-pages");

const uploadBtn = document.getElementById("upload-btn");
const uploadStatus = document.getElementById("upload-status");
const previewPages = document.getElementById("preview-pages");

const deleteChapterInput = document.getElementById("delete-chapter-id");
const deleteChapterBtn = document.getElementById("delete-chapter-btn");

/* HELPERS */

function sortFiles(files) {
  return Array.from(files).sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base"
    });
  });
}

function setStatus(message) {
  if (uploadStatus) {
    uploadStatus.innerHTML = `<p>${message}</p>`;
  }
}

/* PREVIEW */

if (chapterPagesInput) {
  chapterPagesInput.addEventListener("change", () => {
    previewPages.innerHTML = "";

    const files = sortFiles(chapterPagesInput.files);

    files.forEach((file, index) => {
      const imgUrl = URL.createObjectURL(file);

      previewPages.innerHTML += `
        <div class="preview-card">
          <span>Página ${index + 1}</span>
          <img src="${imgUrl}">
        </div>
      `;
    });
  });
}

/* UPLOAD */

if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    try {
      setStatus("Enviando capítulo...");

      const mangaId = mangaIdInput.value.trim();
      const chapterNumber = chapterNumberInput.value.trim();
      const chapterTitle = chapterTitleInput.value.trim();
      const files = sortFiles(chapterPagesInput.files);

      if (!mangaId || !chapterNumber || files.length === 0) {
        setStatus("Preencha o ID do mangá, número do capítulo e páginas.");
        return;
      }

      const imageUrls = [];

      for (const file of files) {
        const storageRef = ref(
          storage,
          `chapters/${mangaId}/${chapterNumber}/${file.name}`
        );

        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);

        imageUrls.push(url);
      }

      await addDoc(collection(db, "manualChapters"), {
        mangaId,
        chapterNumber,
        chapterTitle,
        pages: imageUrls,
        source: "firebase",
        createdAt: Date.now()
      });

      setStatus("Capítulo publicado com sucesso.");

      mangaIdInput.value = "";
      chapterNumberInput.value = "";
      chapterTitleInput.value = "";
      chapterPagesInput.value = "";
      previewPages.innerHTML = "";

    } catch (error) {
      console.log(error);
      setStatus(`Erro: ${error.message}`);
    }
  });
}

/* DELETE */

if (deleteChapterBtn) {
  deleteChapterBtn.addEventListener("click", async () => {
    const chapterId = deleteChapterInput.value.trim();

    if (!chapterId) {
      setStatus("Digite o ID do capítulo.");
      return;
    }

    try {
      await deleteDoc(doc(db, "manualChapters", chapterId));

      setStatus("Capítulo excluído com sucesso.");
      deleteChapterInput.value = "";

    } catch (error) {
      console.log(error);
      setStatus(`Erro ao excluir: ${error.message}`);
    }
  });
}