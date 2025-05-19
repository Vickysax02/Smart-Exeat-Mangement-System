// dsa.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get container
const container = document.getElementById("requestList");

// Load and render all requests approved by Hostel Master but pending from DSA
async function loadRequests() {
  const querySnapshot = await getDocs(collection(db, "exeatRequests"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.status === "hostel-approved") {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow mb-4";
      div.innerHTML = `
        <p><strong>Name:</strong> ${data.studentName}</p>
        <p><strong>Matric Number:</strong> ${data.matricNumber}</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Parent Phone:</strong> ${data.parentPhone}</p>
        <button onclick="approveByDSA('${docSnap.id}')" class="bg-green-600 text-white px-3 py-1 mt-2 rounded">Approve</button>
      `;
      container.appendChild(div);
    }
  });
}

loadRequests();

// Global approve function
window.approveByDSA = async function (id) {
  try {
    const docRef = doc(db, "exeatRequests", id);
    await updateDoc(docRef, {
      status: "dsa-approved"
    });
    alert("Request approved by DSA");
    location.reload();
  } catch (error) {
    console.error("Error approving request:", error);
    alert("An error occurred");
  }
};
