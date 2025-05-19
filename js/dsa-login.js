// dsa-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDfxhSGPNQAneP_iGjdnVSBDrbgidtGWTc",
    authDomain: "smart-exeat-form-system.firebaseapp.com",
    projectId: "smart-exeat-form-system",
    storageBucket: "smart-exeat-form-system.appspot.com",
    messagingSenderId: "811475212564",
    appId: "1:811475212564:web:a635f2c8c8b796915d0a01",
    measurementId: "G-028Y2XQ3LM"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dsa.html";
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
};
