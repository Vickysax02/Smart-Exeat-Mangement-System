import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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

const requestList = document.getElementById("requestList");
const noRequests = document.getElementById("noRequests");

function getStatusColor(status) {
  switch (status) {
    case "pending": return "text-yellow-500";
    case "hostel_approved": return "text-blue-500";
    case "dsa_approved": return "text-green-600";
    case "forwarded_to_gate": return "text-purple-600";
    case "exited": return "text-indigo-600";
    case "rejected": return "text-red-500";
    default: return "text-gray-500";
  }
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("Exeat Status", { body: message });
  }
}

// Request notification permission on page load
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "student-login.html";
    return;
  }

  const studentEmail = user.email;

  const q = query(
    collection(db, "exeatRequests"),
    where("email", "==", studentEmail),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    requestList.innerHTML = "";

    if (snapshot.empty) {
      noRequests.classList.remove("hidden");
      return;
    }

    noRequests.classList.add("hidden");

    snapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.();
      const formattedTime = createdAt
        ? createdAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
        : "N/A";

      const div = document.createElement("div");
      div.className = "p-4 bg-white shadow rounded mb-4";

      div.innerHTML = `
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Status:</strong> 
          <span class="${getStatusColor(data.status)} font-semibold">
            ${data.status.replace(/_/g, " ")}
          </span>
        </p>
        <p><strong>Submitted:</strong> ${formattedTime}</p>
      `;

      requestList.appendChild(div);
    });

    snapshot.docChanges().forEach(change => {
      if (change.type === "modified") {
        const updatedData = change.doc.data();
        showNotification(`Your request status is now: ${updatedData.status.replace(/_/g, " ")}`);
      }
    });
  });
});
