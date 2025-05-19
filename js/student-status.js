import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

// 🔐 Replace with your config
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

const statusDiv = document.getElementById("statusInfo");

// 👇 Replace with the current logged-in student's matric number
const currentMatricNo = "FCES/OY/PDE/24/920"; // or get from login/localStorage

async function fetchStatus() {
  try {
    const q = query(
      collection(db, "exeatRequests"),
      where("matricNo", "==", currentMatricNo),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      statusDiv.innerHTML = `<p>No exeat request found for you.</p>`;
      return;
    }

    // Show the latest request status
    const latestDoc = querySnapshot.docs[0];
    const data = latestDoc.data();

    let statusText = `<p><strong>Name:</strong> ${data.fullName}</p>`;
    statusText += `<p><strong>Matric Number:</strong> ${data.matricNo}</p>`;
    statusText += `<p><strong>Reason:</strong> ${data.reason}</p>`;

    // Progress check
    statusText += `<p><strong>Status:</strong> `;
    if (data.status === "pending") {
      statusText += "⏳ Awaiting Hostel Master Approval</p>";
    } else if (data.status === "hostel_approved") {
      statusText += "✅ Hostel Master Approved<br>⏳ Awaiting DSA Approval</p>";
    } else if (data.status === "forwarded_to_gate") {
      statusText += "✅ Approved by Hostel & DSA<br>✅ Forwarded to Gate</p>";
    } else {
      statusText += `Unknown status: ${data.status}</p>`;
    }

    const currentEmail = localStorage.getItem("studentEmail");

    statusDiv.innerHTML = statusText;

  } catch (err) {
    console.error("Error fetching status:", err);
    statusDiv.innerHTML = `<p class="text-red-500">Failed to load status.</p>`;
  }
}

fetchStatus();
