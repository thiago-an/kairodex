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

const params =
  new URLSearchParams(window.location.search);

const mangaId =
  params.get("id");

const statusButtons =
  document.querySelectorAll(".library-status-btn");

const statusLabels = {
  reading: "Lendo",
  completed: "Concluído",
  planned: "Planejo ler",
  dropped: "Abandonado"
};

function getCurrentManga() {
  return JSON.parse(
    localStorage.getItem("currentManga")
  );
}

function getLocalLibrary() {
  return JSON.parse(
    localStorage.getItem("library")
  ) || [];
}

function saveLocalLibrary(item) {
  const library =
    getLocalLibrary();

  const existingIndex =
    library.findIndex((manga) => {
      return manga.mangaId === item.mangaId || manga.id === item.id;
    });

  if (existingIndex !== -1) {
    library[existingIndex] =
      item;
  } else {
    library.unshift(item);
  }

  localStorage.setItem(
    "library",
    JSON.stringify(library)
  );
}

function updateButtons(activeStatus) {
  statusButtons.forEach((button) => {
    const isActive =
      button.dataset.status === activeStatus;

    button.classList.toggle("active", isActive);
  });
}

async function saveLibraryItem(user, status) {
  const currentManga =
    getCurrentManga();

  if (!currentManga) {
    alert("Aguarde o mangá carregar antes de adicionar à biblioteca.");
    return;
  }

  const item = {
    ...currentManga,
    id: mangaId,
    mangaId,
    status,
    statusLabel: statusLabels[status],
    updatedAt: Date.now()
  };

  await setDoc(
    doc(db, "users", user.uid, "library", mangaId),
    item
  );

  saveLocalLibrary(item);

  updateButtons(status);

  alert(`Mangá marcado como: ${statusLabels[status]}`);
}

onAuthStateChanged(auth, (user) => {
  if (!user || !mangaId) return;

  statusButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const status =
        button.dataset.status;

      try {
        await saveLibraryItem(user, status);
      } catch (error) {
        console.log("Erro biblioteca:", error);
        alert("Erro ao salvar na biblioteca.");
      }
    });
  });
});