import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
  SOURCES,
  getSourceLabel
} from "./sources.js";

/* =========================
   CONFIG
========================= */

const API_BASE =
  "https://kairodex.vercel.app";

/* =========================
   PARAMS / ELEMENTOS
========================= */

const params =
  new URLSearchParams(window.location.search);

const mangaId =
  params.get("id");

const chaptersDiv =
  document.getElementById("chapters");

/* =========================
   HELPERS
========================= */

function getChapterNumber(value) {
  const number =
    Number(value);

  return Number.isNaN(number)
    ? 999999
    : number;
}

function sortByChapterNumber(a, b) {
  return getChapterNumber(a.number) - getChapterNumber(b.number);
}

function showChaptersMessage(title, text = "") {
  if (!chaptersDiv) return;

  chaptersDiv.innerHTML = `
    <div class="empty-message">
      <h3>${title}</h3>
      ${text ? `<p>${text}</p>` : ""}
    </div>
  `;
}

function saveChaptersToStorage(chapters) {
  if (!mangaId) return;

  localStorage.setItem(
    `chapters-${mangaId}`,
    JSON.stringify(chapters)
  );
}

/* =========================
   FIREBASE CHAPTERS
========================= */

async function fetchFirebaseChapters() {
  const manualQuery =
    query(
      collection(db, "manualChapters"),
      where("mangaId", "==", mangaId)
    );

  const manualSnapshot =
    await getDocs(manualQuery);

  const chapters =
    [];

  manualSnapshot.forEach((doc) => {
    const chapter =
      doc.data();

    chapters.push({
      id: doc.id,
      source: SOURCES.FIREBASE,
      number: chapter.chapterNumber || "?",
      title:
        chapter.chapterTitle ||
        `Capítulo ${chapter.chapterNumber || "?"}`
    });
  });

  return chapters;
}

/* =========================
   MANGADEX CHAPTERS
========================= */

async function fetchMangaDexChapters() {
  const response =
    await fetch(`${API_BASE}/api/chapters?id=${mangaId}`);

  const result =
    await response.json();

  if (!response.ok || result.error) {
    throw new Error(
      result.error || "Erro ao carregar capítulos MangaDex."
    );
  }

  const apiChapters =
    Array.isArray(result.data)
      ? result.data
      : [];

  return apiChapters.map((chapter) => {
    const number =
      chapter.attributes?.chapter || "?";

    const title =
      chapter.attributes?.title ||
      `Capítulo ${number}`;

    return {
      id: chapter.id,
      source: SOURCES.MANGADEX,
      number,
      title
    };
  });
}

/* =========================
   FUTURO: COMICK
========================= */

async function fetchComickChapters() {
  return [];
}

/* =========================
   RENDER
========================= */

function createChapterItem(chapter) {
  const link =
    document.createElement("a");

  link.href =
    `/pages/chapter.html?id=${chapter.id}&source=${chapter.source}&manga=${mangaId}`;

  link.className =
    "chapter-item";

  link.innerHTML = `
    <strong>
      ${chapter.title}
    </strong>

    <span>
      ${getSourceLabel(chapter.source)}
    </span>
  `;

  return link;
}

function renderChapters(chapters) {
  if (!chaptersDiv) return;

  if (!chapters.length) {
    showChaptersMessage(
      "Nenhum capítulo disponível",
      "Este mangá ainda não possui capítulos cadastrados."
    );

    return;
  }

  chaptersDiv.innerHTML = "";

  chapters.forEach((chapter) => {
    chaptersDiv.appendChild(
      createChapterItem(chapter)
    );
  });
}

/* =========================
   INIT
========================= */

async function loadChapters() {
  if (!mangaId || !chaptersDiv) return;

  try {
    showChaptersMessage(
      "Carregando capítulos...",
      "Buscando capítulos disponíveis."
    );

    const firebaseChapters =
      await fetchFirebaseChapters();

    const mangadexChapters =
      await fetchMangaDexChapters();

    const comickChapters =
      await fetchComickChapters();

    const allChapters =
      [
        ...firebaseChapters,
        ...mangadexChapters,
        ...comickChapters
      ].sort(sortByChapterNumber);

    saveChaptersToStorage(allChapters);

    renderChapters(allChapters);

  } catch (error) {
    console.log("Erro chapters:", error);

    showChaptersMessage(
      "Erro ao carregar capítulos",
      "Não foi possível buscar os capítulos deste mangá."
    );
  }
}

loadChapters();