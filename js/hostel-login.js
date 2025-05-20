import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Firebase config
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

// Listen for form submit instead of button click
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the form from submitting normally

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorElem = document.getElementById("error");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "hostel.html"; // Redirect after successful login
  } catch (error) {
    errorElem.classList.remove("hidden");
    errorElem.textContent = "Login failed: " + error.message;
  }
});
