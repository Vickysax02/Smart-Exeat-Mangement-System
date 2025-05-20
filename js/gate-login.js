import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");
const loadingMessage = document.getElementById("loadingMessage");

// Show loading message while checking auth state
loadingMessage.classList.remove("hidden");
loginBtn.disabled = true;

onAuthStateChanged(auth, (user) => {
  loadingMessage.classList.add("hidden");
  loginBtn.disabled = false;
  if (user) {
    // User already logged in, redirect to gate.html
    window.location.href = "gate.html";
  }
  // If no user, stay on login page and allow login
});

loginBtn.addEventListener("click", async () => {
  message.textContent = "";
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    message.textContent = "Please enter both email and password.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect after successful login
    window.location.href = "gate.html";
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});
