import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to container
const container = document.getElementById("dsaRequestList");

async function loadApprovedRequests() {
  container.innerHTML = ""; // Clear container

  try {
    const q = query(
      collection(db, "exeatRequests"),
      orderBy("createdAt", "desc") // Sort by newest first
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (
        data.status === "hostel_approved" &&
        data.fullName &&
        data.matricNo &&
        data.reason &&
        data.parentPhone
      ) {
        const createdAt = data.createdAt?.toDate?.(); // Convert Firestore Timestamp
        const formattedTime = createdAt
          ? createdAt.toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "Time not available";

        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow mb-4";

        div.innerHTML = `
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Matric Number:</strong> ${data.matricNo}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Parent Phone:</strong> ${data.parentPhone}</p>
          <p><strong>Sent At:</strong> ${formattedTime}</p>
          <button onclick="approveByDSA('${docSnap.id}')" 
            class="bg-blue-600 text-white mt-2 px-3 py-1 rounded">Approve & Forward</button>
        `;

        container.appendChild(div);
      }
    });

    if (container.innerHTML === "") {
      container.innerHTML = `<p class="text-gray-500">No hostel-approved requests found.</p>`;
    }

  } catch (error) {
    console.error("Error loading requests:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load requests.</p>`;
  }
}

loadApprovedRequests();

// Updated DSA approval & forward to Gate
window.approveByDSA = async function(id) {
  try {
    const requestRef = doc(db, "exeatRequests", id);
    await updateDoc(requestRef, {
      status: "forwarded_to_gate"  // updated status here
    });
    alert("DSA approved and forwarded the request to the Gate!");
    loadApprovedRequests();
  } catch (error) {
    console.error("Error approving request:", error);
    alert("Failed to approve request.");
  }
};
