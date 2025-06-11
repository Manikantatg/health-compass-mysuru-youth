import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyACnk25jW17pQ9m8aiZCXPP3iwIb6F-qSY",
  authDomain: "etmark-8c887.firebaseapp.com",
  projectId: "etmark-8c887",
  storageBucket: "etmark-8c887.firebasestorage.app",
  messagingSenderId: "623376687430",
  appId: "1:623376687430:web:13f12f04c6af4fce314547"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics only if supported and in production
let analytics = null;
if (import.meta.env.PROD) {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize other services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics }; 