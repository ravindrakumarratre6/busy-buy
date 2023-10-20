import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJX9uWaweJGjvqmlwJUsudkRTVgDJcQak",
  authDomain: "buybusy-4487a.firebaseapp.com",
  projectId: "buybusy-4487a",
  storageBucket: "buybusy-4487a.appspot.com",
  messagingSenderId: "702219839024",
  appId: "1:1037177224110:web:54aecd882409ba5102e63f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable session persistence
setPersistence(auth, browserSessionPersistence);
