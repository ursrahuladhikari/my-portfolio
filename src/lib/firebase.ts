// ── Firebase Configuration ──
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD16jpB9vgGs72oX6XoTkS_p9adCNoJl2w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-portfolio-5f845.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-portfolio-5f845",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-portfolio-5f845.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "981731381702",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:981731381702:web:cfd777fcea8e0f982562c7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K7XMZQB0RY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
