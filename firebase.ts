
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxrzmNGXpKQA7ylfGJTmj6jjDX_kVkUTg",
  authDomain: "chapeudejavali-505b8.firebaseapp.com",
  projectId: "chapeudejavali-505b8",
  storageBucket: "chapeudejavali-505b8.firebasestorage.app",
  messagingSenderId: "521528331520",
  appId: "1:521528331520:web:5f49ab0637b3f21ea9f7e5",
  measurementId: "G-HV6Y7XSG8V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
