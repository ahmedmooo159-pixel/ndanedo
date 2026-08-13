import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqtprLIvUuzDFhfkg9s386zGLoOlf876k",
  authDomain: "nadanedoBD.firebaseapp.com",
  projectId: "nadanedoBD",
  storageBucket: "nadanedoBD.firebasestorage.app",
  messagingSenderId: "647570557156",
  appId: "1:647570557156:web:27d457ff9f8ee8eaa084f1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebase() {
  console.log("Testing Firestore Connection...");
  try {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    console.log("Success! Found", querySnapshot.size, "documents in gallery.");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Firestore Read Error:", error.message);
  }
}

testFirebase();
