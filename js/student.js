import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Your Firebase config
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
const db = getFirestore(app);

// Handle form submit
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
    alert("Invalid phone number. Must start with 070, 080, 081, 090, or 091 and be 11 digits.");
    return;
  }

  try {
    await addDoc(collection(db, "exeatRequests"), {
      fullName,
      matricNo,
      department,
      parentPhone,
      reason,
      status: "pending", // pending → hostel_approved → dsa_approved
      createdAt: Timestamp.now()  // ✅ Time of submission
    });

    feedback.classList.remove("hidden");
    form.reset();
  } catch (error) {
    console.error("Error submitting exeat request:", error);
    alert("Something went wrong. Try again.");
  }
});
