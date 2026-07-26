// ── Firebase Configuration ──
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDK9xdbOMoq-wAMh-kYEZvFVOoLGTxcSik",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rahul-portfolio-9b31a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rahul-portfolio-9b31a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rahul-portfolio-9b31a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1005091595059",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1005091595059:web:88b5a390e1f3ade5ded446",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HKGSNDSLVQ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
