// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACnk25jW17pQ9m8aiZCXPP3iwIb6F-qSY",
  authDomain: "etmark-8c887.firebaseapp.com",
  projectId: "etmark-8c887",
  storageBucket: "etmark-8c887.firebasestorage.app",
  messagingSenderId: "623376687430",
  appId: "1:623376687430:web:13f12f04c6af4fce314547",
  measurementId: "G-XXXXXXXXXX" // Add your measurement ID if you have one
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
