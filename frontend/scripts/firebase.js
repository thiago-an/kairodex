import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

const firebaseConfig = {

  apiKey: "AIzaSyCXGv9l9uHzxLUz1t4ztlJS41VVBIlAVTM",
  authDomain: "kairodex.firebaseapp.com",
  projectId: "kairodex",
  storageBucket: "kairodex.firebasestorage.app",
  messagingSenderId: "349259093454",
  appId: "1:349259093454:web:3bd2abea0c1d0bcdad479f",

};

const app = initializeApp(firebaseConfig);

export default app;

export const db = getFirestore(app);