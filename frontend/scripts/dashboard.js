import app from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const auth =
  getAuth(app);

const PLACEHOLDER_COVER =
  "https://placehold.co/300x450?text=Sem+Capa";

const userName =
  document.getElementById("user-name");

const userPhoto =
  document.getElementById("user-photo");

const logoutBtn =
  document.getElementById("logout-btn");

const continueReadingDiv =
  document.getElementById("continue-reading");

const recentHistoryDiv =
  document.getElementById("recent-history");

const favoritesHomeGrid =
  document.getElementById("favorites-home-grid");

const libraryHomeGrid =
  document.getElementById("library-home-grid");

const menuToggle =
  document.getElementById("menu-toggle");

const navLinks =
  document.getElementById("nav-links");

const heroTitle =
  document.querySelector(".premium-hero h1");

const heroText =
  document.querySelector(".premium-hero p");

const heroPrimaryBtn =
  document.querySelector(".hero-btn.primary");

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

const lastChapter =
  safeParse(localStorage.getItem("lastChapter"), null);

function getMangaCache() {
  return safeParse(localStorage.getItem("mangaCache"), {});
}

function getMangaMeta(item = {}) {
  const mangaId =
    item.mangaId || item.id;

  const cache =
    getMangaCache();

  const favorites =
    safeParse(localStorage.getItem("favorites"), []);

  const library =
    safeParse(localStorage.getItem("library"), []);

  return (
    item ||
    cache[mangaId] ||
    favorites.find((manga) => manga.mangaId === mangaId || manga.id === mangaId) ||
    library.find((manga) => manga.mangaId === mangaId || manga.id === mangaId) ||
    {}
  );
}

function getCover(item = {}) {
  const mangaId =
    item.mangaId || item.id;

  const cache =
    getMangaCache();

  const cached =
    cache[mangaId];

  return (
    item.cover ||
    item.coverUrl ||
    cached?.cover ||
    PLACEHOLDER_COVER
  );
}

function getTitle(item = {}) {
  const mangaId =
    item.mangaId || item.id;

  const cache =
    getMangaCache();

  const cached =
    cache[mangaId];

  return (
    item.title ||
    cached?.title ||
    "Mangá"
  );
}

function normalizeProgress(progress) {
  const value =
    Number(progress || 0);

  if (Number.isNaN(value)) return 0;

  return Math.max(
    0,
    Math.min(100, value)
  );
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (userName) {
      userName.innerText =
        user.displayName || "Usuário";
    }

    if (userPhoto) {
      userPhoto.src =
        user.photoURL || "/assets/default-user.png";
    }

  } else {
    window.location.href =
      "/pages/login.html";
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);

    window.location.href =
      "/pages/login.html";
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

function renderContinueReading() {
  if (!continueReadingDiv) return;

  if (!lastChapter || !lastChapter.chapterId) {
    continueReadingDiv.innerHTML = `
      <div class="empty-message">
        <h3>Nenhuma leitura recente</h3>
        <p>Comece a ler um mangá para aparecer aqui.</p>
      </div>
    `;

    return;
  }

  const meta =
    getMangaMeta(lastChapter);

  const progress =
    normalizeProgress(lastChapter.progress);

  const cover =
    getCover({
      ...meta,
      ...lastChapter
    });

  const title =
    getTitle({
      ...meta,
      ...lastChapter
    });

  continueReadingDiv.innerHTML = `
    <a
      href="/pages/chapter.html?id=${lastChapter.chapterId}&source=${lastChapter.source || "mangadex"}&manga=${lastChapter.mangaId}"
      class="continue-card continue-card-cover"
    >
      <img
        src="${cover}"
        alt="${title}"
        class="continue-cover"
        onerror="this.src='${PLACEHOLDER_COVER}'"
      >

      <div class="continue-info">
        <div class="continue-top">
          <h3>${title}</h3>
          <span>${progress}%</span>
        </div>

        <p>Clique para voltar ao último capítulo lido.</p>

        <div class="progress-bar">
          <div
            class="progress-fill"
            style="width:${progress}%"
          ></div>
        </div>
      </div>
    </a>
  `;
}

function renderHero() {
  if (
    !lastChapter ||
    !heroTitle ||
    !heroText ||
    !heroPrimaryBtn
  ) return;

  heroTitle.innerText =
    "Continue sua última leitura";

  heroText.innerText =
    "Você tem um capítulo em andamento. Continue exatamente de onde parou.";

  heroPrimaryBtn.innerText =
    "Continuar lendo";

  heroPrimaryBtn.href =
    `/pages/chapter.html?id=${lastChapter.chapterId}&source=${lastChapter.source || "mangadex"}&manga=${lastChapter.mangaId}`;
}

function addToRecentHistory() {
  if (!lastChapter) return;

  const recent =
    safeParse(localStorage.getItem("recentHistory"), []);

  const existsIndex =
    recent.findIndex((item) => {
      return item.chapterId === lastChapter.chapterId;
    });

  if (existsIndex !== -1) {
    recent.splice(existsIndex, 1);
  }

  recent.unshift(lastChapter);

  localStorage.setItem(
    "recentHistory",
    JSON.stringify(recent.slice(0, 12))
  );
}

function renderRecentHistory() {
  if (!recentHistoryDiv) return;

  const recent =
    safeParse(localStorage.getItem("recentHistory"), []);

  if (!recent.length) {
    recentHistoryDiv.innerHTML = `
      <div class="empty-message">
        <h3>Nenhum histórico</h3>
        <p>Seus últimos capítulos aparecerão aqui.</p>
      </div>
    `;

    return;
  }

  recentHistoryDiv.innerHTML = "";

  recent.forEach((item) => {
    const meta =
      getMangaMeta(item);

    const progress =
      normalizeProgress(item.progress);

    const cover =
      getCover({
        ...meta,
        ...item
      });

    const title =
      getTitle({
        ...meta,
        ...item
      });

    recentHistoryDiv.innerHTML += `
      <a
        href="/pages/chapter.html?id=${item.chapterId}&source=${item.source || "mangadex"}&manga=${item.mangaId}"
        class="recent-card"
      >
        <img
          src="${cover}"
          alt="${title}"
          class="recent-cover"
          onerror="this.src='${PLACEHOLDER_COVER}'"
        >

        <div class="recent-top">
          <span class="recent-badge">${progress}%</span>
        </div>

        <h3>${title}</h3>

        <p>Continue sua leitura</p>

        <div class="progress-bar">
          <div
            class="progress-fill"
            style="width:${progress}%"
          ></div>
        </div>
      </a>
    `;
  });
}

function renderFavoritesHome() {
  if (!favoritesHomeGrid) return;

  const favorites =
    safeParse(localStorage.getItem("favorites"), []);

  if (!favorites.length) {
    favoritesHomeGrid.innerHTML = `
      <div class="empty-message">
        <h3>Nenhum favorito</h3>
        <p>Seus mangás favoritos aparecerão aqui.</p>
      </div>
    `;

    return;
  }

  favoritesHomeGrid.innerHTML = "";

  favorites.slice(0, 6).forEach((manga) => {
    const cover =
      getCover(manga);

    const title =
      getTitle(manga);

    favoritesHomeGrid.innerHTML += `
      <a
        href="/pages/manga.html?id=${manga.mangaId || manga.id}"
        class="favorite-home-card"
      >
        <img
          src="${cover}"
          alt="${title}"
          onerror="this.src='${PLACEHOLDER_COVER}'"
        >

        <div class="favorite-home-overlay">
          <h3>${title}</h3>
          <span>Favorito no KairoDEX</span>
        </div>
      </a>
    `;
  });
}

function renderLibraryHome() {
  if (!libraryHomeGrid) return;

  const library =
    safeParse(localStorage.getItem("library"), []);

  if (!library.length) {
    libraryHomeGrid.innerHTML = `
      <div class="empty-message">
        <h3>Biblioteca vazia</h3>
        <p>Mangás marcados como lendo, concluído ou planejado aparecerão aqui.</p>
      </div>
    `;

    return;
  }

  libraryHomeGrid.innerHTML = "";

  library.slice(0, 6).forEach((manga) => {
    const cover =
      getCover(manga);

    const title =
      getTitle(manga);

    libraryHomeGrid.innerHTML += `
      <a
        href="/pages/manga.html?id=${manga.mangaId || manga.id}"
        class="favorite-home-card"
      >
        <img
          src="${cover}"
          alt="${title}"
          onerror="this.src='${PLACEHOLDER_COVER}'"
        >

        <div class="favorite-home-overlay">
          <h3>${title}</h3>
          <span>${manga.statusLabel || "Na biblioteca"}</span>
        </div>
      </a>
    `;
  });
}

renderContinueReading();

renderHero();

addToRecentHistory();

renderRecentHistory();

renderFavoritesHome();

renderLibraryHome();