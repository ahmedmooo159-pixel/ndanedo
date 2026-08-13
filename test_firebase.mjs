import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqtprLIvUuzDFhfkg9s386zGLoOlf876k",
  authDomain: "nadanedobd.firebaseapp.com",
  projectId: "nadanedobd",
  storageBucket: "nadanedobd.firebasestorage.app",
  messagingSenderId: "647570557156",
  appId: "1:647570557156:web:27d457ff9f8ee8eaa084f1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log("Testing Firestore Write...");
  try {
    const docRef = await addDoc(collection(db, "gallery"), {
      test: true,
      text: "Testing write",
      createdAt: serverTimestamp()
    });
    console.log("Success! Wrote doc with ID: ", docRef.id);
  } catch (error) {
    console.error("Firestore Write Error:", error.message);
  }
}

testWrite();
