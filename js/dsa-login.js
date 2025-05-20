// dsa-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Firebase config (keep yours)
const firebaseConfig = {
  apiKey: "AIzaSyDfxhSGPNQAneP_iGjdnVSBDrbgidtGWTc",
  authDomain: "smart-exeat-form-system.firebaseapp.com",
  projectId: "smart-exeat-form-system",
  storageBucket: "smart-exeat-form-system.appspot.com",
  messagingSenderId: "811475212564",
  appId: "1:811475212564:web:a635f2c8c8b796915d0a01",
  measurementId: "G-028Y2XQ3LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const errorElem = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent default form submit behavior

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  errorElem.textContent = ""; // clear previous error

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect on successful login
    window.location.href = "../pages/dsa.html";  // Adjust path if needed
  } catch (error) {
    errorElem.textContent = "Login failed: " + error.message;
  }
});
