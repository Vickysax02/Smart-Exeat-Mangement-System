import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDfxhSGPNQAneP_iGjdnVSBDrbgidtGWTc",
  authDomain: "smart-exeat-form-system.firebaseapp.com",
  projectId: "smart-exeat-form-system",
  storageBucket: "smart-exeat-form-system.appspot.com",
  messagingSenderId: "811475212564",
  appId: "1:811475212564:web:a635f2c8c8b796915d0a01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("exeatForm");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const matricNo = document.getElementById("matricNo").value.trim();
  const department = document.getElementById("department").value.trim();
  const parentPhone = document.getElementById("parentPhone").value.trim();
  const reason = document.getElementById("reason").value.trim();

  if (!fullName || !matricNo || !department || !parentPhone || !reason) {
    alert("Please fill all fields");
    return;
  }

  const phoneRegex = /^(070|080|081|090|091)\d{8}$/;
  if (!phoneRegex.test(parentPhone)) {
    alert("Invalid phone number.");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("Please login again.");
    return;
  }

  try {
    await addDoc(collection(db, "exeatRequests"), {
      fullName,
      matricNo,
      department,
      parentPhone,
      reason,
      status: "pending",
      email: user.email, // 🔥 Needed for tracking
      createdAt: serverTimestamp() // 🔥 Needed for sorting
    });

    feedback.classList.remove("hidden");
    form.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});
