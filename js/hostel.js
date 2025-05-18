// Firebase imports
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

// Get reference to the container
const container = document.getElementById("requestList");

// Fetch and render pending exeat requests
async function loadRequests() {
  try {
    const querySnapshot = await getDocs(collection(db, "exeatRequests"));
    container.innerHTML = ""; // Clear container first

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Ensure fields exist and status is "pending"
      if (
        data.status === "pending" &&
        data.fullName &&
        data.matricNo &&
        data.reason &&
        data.parentPhone
      ) {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow mb-4";

        div.innerHTML = `
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Matric Number:</strong> ${data.matricNo}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Parent Phone:</strong> ${data.parentPhone}</p>
          <button onclick="approve('${docSnap.id}')" 
            class="bg-green-500 text-white px-3 py-1 mt-2 rounded">Approve</button>
        `;

        container.appendChild(div);
      }
    });

    if (container.innerHTML === "") {
      container.innerHTML = `<p class="text-gray-500">No pending requests found.</p>`;
    }
  } catch (error) {
    console.error("Error loading requests:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load requests.</p>`;
  }
}

loadRequests();

// Approve request
window.approve = async function (id) {
  try {
    const requestRef = doc(db, "exeatRequests", id);
    await updateDoc(requestRef, {
      status: "hostel_approved"
    });
    alert("Request approved!");
    loadRequests(); // Reload to reflect changes
  } catch (error) {
    console.error("Error approving request:", error);
    alert("Failed to approve request.");
  }
};
