import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  orderBy,
  query,
  limit
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* =========================
   ELEMENTOS
========================= */

const latestDiv =
  document.getElementById("latest-chapters");

const latestLeft =
  document.getElementById("latest-left");

const latestRight =
  document.getElementById("latest-right");

/* =========================
   UI STATES
========================= */

function showLatestLoading() {
  if (!latestDiv) return;

  latestDiv.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const skeleton =
      document.createElement("div");

    skeleton.className =
      "skeleton-latest";

    skeleton.innerHTML = `
      <div class="skeleton-line small"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line tiny"></div>
    `;

    latestDiv.appendChild(skeleton);
  }
}

function showLatestMessage(title, text) {
  if (!latestDiv) return;

  latestDiv.innerHTML = `
    <div class="empty-message">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

/* =========================
   CARD
========================= */

function createLatestCard(docId, chapter) {
  const chapterNumber =
    chapter.chapterNumber || "?";

  const chapterTitle =
    chapter.chapterTitle || "Sem título";

  const mangaId =
    chapter.mangaId || "";

  const card =
    document.createElement("a");

  card.href =
    `/pages/chapter.html?id=${docId}&source=firebase&manga=${mangaId}`;

  card.className =
    "latest-card";

  card.innerHTML = `
    <div class="latest-top">
      <span class="latest-badge">NOVO</span>
    </div>

    <div class="latest-content">
      <h3>
        Capítulo ${chapterNumber}
      </h3>

      <p>
        ${chapterTitle}
      </p>

      <span class="latest-read">
        Ler agora →
      </span>
    </div>
  `;

  return card;
}

/* =========================
   FIRESTORE
========================= */

async function fetchLatestChapters() {
  const q = query(
    collection(db, "manualChapters"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  return await getDocs(q);
}

/* =========================
   RENDER
========================= */

async function loadLatestChapters() {
  if (!latestDiv) return;

  try {
    showLatestLoading();

    const snapshot =
      await fetchLatestChapters();

    if (snapshot.empty) {
      showLatestMessage(
        "Nenhum capítulo ainda",
        "Os uploads do admin aparecerão aqui."
      );

      return;
    }

    latestDiv.innerHTML = "";

    snapshot.forEach((doc) => {
      const chapter =
        doc.data();

      latestDiv.appendChild(
        createLatestCard(doc.id, chapter)
      );
    });

  } catch (error) {
    console.log("Erro latest:", error);

    showLatestMessage(
      "Erro ao carregar capítulos",
      "Não foi possível buscar os últimos capítulos."
    );
  }
}

/* =========================
   CARROSSEL
========================= */

function setupLatestCarousel() {
  if (!latestLeft || !latestRight || !latestDiv) return;

  latestLeft.addEventListener("click", () => {
    latestDiv.scrollBy({
      left: -500,
      behavior: "smooth"
    });
  });

  latestRight.addEventListener("click", () => {
    latestDiv.scrollBy({
      left: 500,
      behavior: "smooth"
    });
  });
}

/* =========================
   INIT
========================= */

setupLatestCarousel();

loadLatestChapters();