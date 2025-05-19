import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
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
const db = getFirestore(app);
const auth = getAuth(app);

const container = document.getElementById("requestsContainer");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "gate-login.html";
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "gate-login.html";
  } else {
    loadForwardedRequests();
  }
});

async function loadForwardedRequests() {
  container.innerHTML = "";
  try {
    const q = query(
      collection(db, "exeatRequests"),
      where("status", "==", "forwarded_to_gate"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      container.innerHTML = "<p class='text-gray-500'>No requests forwarded to gate.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toDate?.();
      const formattedTime = createdAt
        ? createdAt.toLocaleString("en-NG", {
            dateStyle: "medium",
            timeStyle: "short"
          })
        : "Time not available";

      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow";

      div.innerHTML = `
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Matric Number:</strong> ${data.matricNo}</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Parent Phone:</strong> ${data.parentPhone}</p>
        <p><strong>Sent At:</strong> ${formattedTime}</p>
        <button
          class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          onclick="markExited('${docSnap.id}')"
        >
          Mark as Exited
        </button>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading requests:", error);
    container.innerHTML = "<p class='text-red-500'>Failed to load requests.</p>";
  }
}

window.markExited = async function(id) {
  try {
    const requestRef = doc(db, "exeatRequests", id);
    await updateDoc(requestRef, {
      status: "exited",
      exitTime: new Date()
    });
    alert("Marked as exited!");
    loadForwardedRequests();
  } catch (error) {
    console.error("Error marking as exited:", error);
    alert("Failed to mark as exited.");
  }
};
