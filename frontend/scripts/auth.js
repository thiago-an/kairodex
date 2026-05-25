import app from "./firebase.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const auth = getAuth(app);

const reader = document.getElementById("reader");

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("google-login");

loginBtn.addEventListener("click", async () => {

  try {

    const result = await signInWithPopup(auth, provider);

    console.log(result.user);

    setTimeout(() => {

  window.location.href = "./dashboard.html";

}, 500);

  } catch (error) {

    console.log(error);

  }

});