// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlM2tKxFL7bAME_2DCZJJnPCVkOEkrHGA",
  authDomain: "semester-projekt-762fa.firebaseapp.com",
  projectId: "semester-projekt-762fa",
  storageBucket: "semester-projekt-762fa.firebasestorage.app",
  messagingSenderId: "386454731558",
  appId: "1:386454731558:web:6300119a049d21634c5fe7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };