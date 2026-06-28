// ── Firebase Configuration ──
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDK9xdbOMoq-wAMh-kYEZvFVOoLGTxcSik",
  authDomain: "rahul-portfolio-9b31a.firebaseapp.com",
  projectId: "rahul-portfolio-9b31a",
  storageBucket: "rahul-portfolio-9b31a.firebasestorage.app",
  messagingSenderId: "1005091595059",
  appId: "1:1005091595059:web:88b5a390e1f3ade5ded446",
  measurementId: "G-HKGSNDSLVQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
