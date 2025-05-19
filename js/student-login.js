// /js/student-login.js
import { auth } from './firebase.js'; // Adjust the path if needed
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.classList.add("hidden");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect on success
    window.location.href = "student-dashboard.html";
  } catch (error) {
    errorMessage.textContent = "Login failed: " + error.message;
    errorMessage.classList.remove("hidden");
  }
});

localStorage.setItem("studentEmail", enteredEmail); // Save the student's email
