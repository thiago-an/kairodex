import app from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const auth = getAuth(app);

const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, (user) => {

  console.log("Usuário detectado:", user);

  if (user) {

    userName.innerText = user.displayName;
    userPhoto.src = user.photoURL;

  } else {

    console.log("Usuário não autenticado");

    setTimeout(() => {

      window.location.href = "../pages/login.html";

    }, 1000);

  }

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "/pages/login.html";

const continueReadingDiv =
  document.getElementById("continue-reading");

const lastChapter =
  JSON.parse(localStorage.getItem("lastChapter"));

if (lastChapter && lastChapter.chapterId) {

  continueReadingDiv.innerHTML = `

    <a
      href="./chapter.html?id=${lastChapter.chapterId}&manga=${lastChapter.mangaId}"
      class="continue-card"
    >

      <h3>Continuar leitura</h3>

      <p>
        Clique para voltar ao último capítulo lido.
      </p>

    </a>

  `;

}

const menuToggle =
  document.getElementById("menu-toggle");

const navLinks =
  document.getElementById("nav-links");

if(menuToggle){

  menuToggle.addEventListener("click", ()=>{

    navLinks.classList.toggle("active");

  });

}

});