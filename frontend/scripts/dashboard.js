import app from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const auth = getAuth(app);

/* ELEMENTOS */

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

/* STORAGE */

const lastChapter =
  JSON.parse(localStorage.getItem("lastChapter"));

/* LOGIN */

onAuthStateChanged(auth, (user) => {

  if (user) {

    userName.innerText =
      user.displayName || "Usuário";

    userPhoto.src =
      user.photoURL || "/assets/default-user.png";

  } else {

    window.location.href =
      "/pages/login.html";

  }

});

/* LOGOUT */

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
      "/pages/login.html";

  });

}

/* MENU MOBILE */

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

  });

}

/* CONTINUAR LENDO */

function renderContinueReading() {

  if (!continueReadingDiv) return;

  if (!lastChapter || !lastChapter.chapterId) {

    continueReadingDiv.innerHTML = `

      <div class="empty-message">

        <h3>Nenhuma leitura recente</h3>

        <p>
          Comece a ler um mangá para aparecer aqui.
        </p>

      </div>

    `;

    return;
  }

  const progress =
    lastChapter.progress || 0;

  continueReadingDiv.innerHTML = `

    <a
      href="/pages/chapter.html?id=${lastChapter.chapterId}&source=${lastChapter.source || "mangadex"}&manga=${lastChapter.mangaId}"
      class="continue-card"
    >

      <div class="continue-top">

        <h3>Continuar leitura</h3>

        <span>
          ${progress}%
        </span>

      </div>

      <p>
        Clique para voltar ao último capítulo lido.
      </p>

      <div class="progress-bar">

        <div
          class="progress-fill"
          style="width:${progress}%"
        ></div>

      </div>

    </a>

  `;

}

/* HERO */

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

/* HISTÓRICO */

function addToRecentHistory() {

  if (!lastChapter) return;

  const recent =
    JSON.parse(localStorage.getItem("recentHistory")) || [];

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
    JSON.parse(localStorage.getItem("recentHistory")) || [];

  if (!recent.length) {

    recentHistoryDiv.innerHTML = `

      <div class="empty-message">

        <h3>Nenhum histórico</h3>

        <p>
          Seus últimos capítulos aparecerão aqui.
        </p>

      </div>

    `;

    return;
  }

  recentHistoryDiv.innerHTML = "";

  recent.forEach((item) => {

    const progress =
      item.progress || 0;

    recentHistoryDiv.innerHTML += `

      <a
        href="/pages/chapter.html?id=${item.chapterId}&source=${item.source || "mangadex"}&manga=${item.mangaId}"
        class="recent-card"
      >

        <div class="recent-top">

          <span class="recent-badge">
            ${progress}%
          </span>

        </div>

        <h3>
          Mangá recente
        </h3>

        <p>
          Continue sua leitura
        </p>

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

/* FAVORITOS */

function renderFavoritesHome() {

  if (!favoritesHomeGrid) return;

  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.length) {

    favoritesHomeGrid.innerHTML = `

      <div class="empty-message">

        <h3>Nenhum favorito</h3>

        <p>
          Seus mangás favoritos aparecerão aqui.
        </p>

      </div>

    `;

    return;
  }

  favoritesHomeGrid.innerHTML = "";

  favorites.slice(0, 6).forEach((manga) => {

    favoritesHomeGrid.innerHTML += `

      <a
        href="/pages/manga.html?id=${manga.id}"
        class="favorite-home-card"
      >

        <img
          src="${manga.cover}"
          alt="${manga.title}"
        >

        <div class="favorite-home-overlay">

          <h3>${manga.title}</h3>

          <span>
            Favorito no KairoDEX
          </span>

        </div>

      </a>

    `;

  });

}

/* BIBLIOTECA HOME */

const libraryHomeGrid =
  document.getElementById("library-home-grid");

function renderLibraryHome() {

  if (!libraryHomeGrid) return;

  const library =
    JSON.parse(localStorage.getItem("library")) || [];

  if (!library.length) {

    libraryHomeGrid.innerHTML = `
      <div class="empty-message">
        <h3>Biblioteca vazia</h3>
        <p>
          Mangás marcados como lendo, concluído ou planejado aparecerão aqui.
        </p>
      </div>
    `;

    return;
  }

  libraryHomeGrid.innerHTML = "";

  library.slice(0, 6).forEach((manga) => {

    libraryHomeGrid.innerHTML += `

      <a
        href="/pages/manga.html?id=${manga.mangaId || manga.id}"
        class="favorite-home-card"
      >

        <img
          src="${manga.cover}"
          alt="${manga.title}"
        >

        <div class="favorite-home-overlay">

          <h3>${manga.title}</h3>

          <span>
            ${manga.statusLabel || "Na biblioteca"}
          </span>

        </div>

      </a>

    `;

  });

}

/* INIT */

renderContinueReading();

renderHero();

addToRecentHistory();

renderRecentHistory();

renderFavoritesHome();

renderLibraryHome();