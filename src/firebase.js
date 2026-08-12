import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAqtprLIvUuzDFhfkg9s386zGLoOlf876k",
  authDomain: "nadanedoBD.firebaseapp.com",
  projectId: "nadanedoBD",
  storageBucket: "nadanedoBD.firebasestorage.app",
  messagingSenderId: "647570557156",
  appId: "1:647570557156:web:27d457ff9f8ee8eaa084f1",
  measurementId: "G-SHEZVWS307"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
