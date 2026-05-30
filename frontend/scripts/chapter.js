import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
  normalizeSource,
  canReadSource
} from "./sourceManager.js";

import {
  SOURCES
} from "./sources.js";

const API_BASE =
  "https://kairodex.vercel.app";

const PLACEHOLDER_COVER =
  "https://placehold.co/300x450?text=Sem+Capa";

const params =
  new URLSearchParams(window.location.search);

const chapterId =
  params.get("id");

const source =
  normalizeSource(
    params.get("source")
  );

const mangaId =
  params.get("manga");

const reader =
  document.getElementById("reader");

const prevBtn =
  document.getElementById("prev-chapter");

const nextBtn =
  document.getElementById("next-chapter");

const progressKey =
  `progress-${source}-${mangaId}-${chapterId}`;

let currentPageIndex =
  0;

let restoreDone =
  false;

let scrollTimeout;

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

function getMangaMeta() {
  const mangaCache =
    safeParse(localStorage.getItem("mangaCache"), {});

  const currentManga =
    safeParse(localStorage.getItem("currentManga"), null);

  const favorites =
    safeParse(localStorage.getItem("favorites"), []);

  const library =
    safeParse(localStorage.getItem("library"), []);

  return (
    mangaCache[mangaId] ||
    (
      currentManga &&
      (currentManga.mangaId === mangaId || currentManga.id === mangaId)
        ? currentManga
        : null
    ) ||
    favorites.find((item) => item.mangaId === mangaId || item.id === mangaId) ||
    library.find((item) => item.mangaId === mangaId || item.id === mangaId) ||
    {}
  );
}

function getSavedProgress() {
  return safeParse(
    localStorage.getItem(progressKey),
    null
  );
}

function getScrollProgress() {
  const pageHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (pageHeight <= 0) return 0;

  return Math.min(
    100,
    Math.round((window.scrollY / pageHeight) * 100)
  );
}

function saveProgress() {
  if (!chapterId || !mangaId) return;

  const mangaMeta =
    getMangaMeta();

  const progress =
    getScrollProgress();

  const data = {
    chapterId,
    mangaId,
    source,
    progress,
    scrollY: window.scrollY,
    pageIndex: currentPageIndex,
    title: mangaMeta.title || "Mangá recente",
    cover: mangaMeta.cover || PLACEHOLDER_COVER,
    updatedAt: Date.now()
  };

  localStorage.setItem(
    progressKey,
    JSON.stringify(data)
  );

  localStorage.setItem(
    "lastChapter",
    JSON.stringify(data)
  );
}

function showReaderMessage(message) {
  if (!reader) return;

  reader.innerHTML = `
    <div class="empty-message">
      <h3>${message}</h3>
    </div>
  `;
}

function renderPages(pages) {
  if (!reader) return;

  reader.innerHTML = "";

  pages.forEach((pageUrl, index) => {
    reader.innerHTML += `
      <img
        src="${pageUrl}"
        class="reader-image"
        data-page-index="${index}"
        alt="Página ${index + 1}"
      >
    `;
  });
}

function restoreReadingPosition() {
  const saved =
    getSavedProgress();

  if (!saved || restoreDone) return;

  const pageIndex =
    saved.pageIndex || 0;

  setTimeout(() => {
    if (restoreDone) return;

    const target =
      document.querySelector(`[data-page-index="${pageIndex}"]`);

    if (target) {
      target.scrollIntoView({
        behavior: "auto",
        block: "start"
      });

      restoreDone = true;
    }
  }, 1200);
}

async function waitImagesThenRestore() {
  const images =
    document.querySelectorAll(".reader-image");

  if (!images.length) {
    restoreReadingPosition();
    return;
  }

  let loaded =
    0;

  images.forEach((img) => {
    if (img.complete) {
      loaded++;
    } else {
      img.addEventListener("load", () => {
        loaded++;

        if (loaded >= Math.min(images.length, 3)) {
          restoreReadingPosition();
        }
      });
    }
  });

  setTimeout(() => {
    restoreReadingPosition();
  }, 2500);
}

function startPageObserver() {
  const images =
    document.querySelectorAll(".reader-image");

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentPageIndex =
              Number(entry.target.dataset.pageIndex) || 0;

            saveProgress();
          }
        });
      },
      {
        threshold: 0.45
      }
    );

  images.forEach((img) => {
    observer.observe(img);
  });
}

function startScrollTracking() {
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      saveProgress();
    }, 400);
  });
}

async function loadFirebaseChapter() {
  const chapterRef =
    doc(db, "manualChapters", chapterId);

  const chapterSnap =
    await getDoc(chapterRef);

  if (!chapterSnap.exists()) {
    showReaderMessage("Capítulo não encontrado.");
    return false;
  }

  const chapter =
    chapterSnap.data();

  if (!chapter.pages || !chapter.pages.length) {
    showReaderMessage("Capítulo sem páginas.");
    return false;
  }

  renderPages(chapter.pages);

  return true;
}

async function loadMangaDexChapter() {
  const response =
    await fetch(`${API_BASE}/api/chapter?id=${chapterId}`);

  const data =
    await response.json();

  if (
    !data.baseUrl ||
    !data.chapter ||
    !data.chapter.hash ||
    !data.chapter.data ||
    !data.chapter.data.length
  ) {
    showReaderMessage("Este capítulo não possui páginas disponíveis.");
    return false;
  }

  const baseUrl =
    data.baseUrl;

  const hash =
    data.chapter.hash;

  const pages =
    data.chapter.data.map((page) => {
      return `${baseUrl}/data/${hash}/${page}`;
    });

  renderPages(pages);

  return true;
}

function setupChapterNavigation() {
  const storedChapters =
    safeParse(localStorage.getItem(`chapters-${mangaId}`), []);

  const currentIndex =
    storedChapters.findIndex((chapter) => {
      return chapter.id === chapterId && chapter.source === source;
    });

  if (!prevBtn || !nextBtn) return;

  if (currentIndex <= 0) {
    prevBtn.disabled = true;
  } else {
    const prev =
      storedChapters[currentIndex - 1];

    prevBtn.addEventListener("click", () => {
      window.location.href =
        `/pages/chapter.html?id=${prev.id}&source=${prev.source}&manga=${mangaId}`;
    });
  }

  if (
    currentIndex === -1 ||
    currentIndex >= storedChapters.length - 1
  ) {
    nextBtn.disabled = true;
  } else {
    const next =
      storedChapters[currentIndex + 1];

    nextBtn.addEventListener("click", () => {
      window.location.href =
        `/pages/chapter.html?id=${next.id}&source=${next.source}&manga=${mangaId}`;
    });
  }
}

async function loadChapter() {
  if (!reader || !chapterId || !mangaId) {
    showReaderMessage("Dados do capítulo inválidos.");
    return;
  }

  if (!canReadSource(source)) {
    showReaderMessage("Fonte não suportada.");
    return;
  }

  try {
    showReaderMessage("Carregando capítulo...");

    const saved =
      getSavedProgress();

    if (saved) {
      const mangaMeta =
        getMangaMeta();

      localStorage.setItem(
        "lastChapter",
        JSON.stringify({
          ...saved,
          title: saved.title || mangaMeta.title || "Mangá recente",
          cover: saved.cover || mangaMeta.cover || PLACEHOLDER_COVER
        })
      );
    }

    let loaded =
      false;

    if (source === SOURCES.FIREBASE) {
      loaded =
        await loadFirebaseChapter();
    }

    if (source === SOURCES.MANGADEX) {
      loaded =
        await loadMangaDexChapter();
    }

    if (source === SOURCES.COMICK) {
      showReaderMessage("Fonte Comick ainda não implementada.");
    }

    if (!loaded) return;

    await waitImagesThenRestore();

    startPageObserver();

    startScrollTracking();

  } catch (error) {
    console.log("Erro chapter:", error);

    showReaderMessage("Erro ao carregar capítulo.");
  }
}

setupChapterNavigation();

const readerBackBtn =
  document.getElementById("reader-back-btn");

if (readerBackBtn && mangaId) {
  readerBackBtn.href =
    `/pages/manga.html?id=${mangaId}`;
}

loadChapter();