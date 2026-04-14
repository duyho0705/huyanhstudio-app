import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5TNwkq4ZlmL09wOedxKp2XjDRCzVO5vE",
  authDomain: "hastudio-9367b.firebaseapp.com",
  projectId: "hastudio-9367b",
  storageBucket: "hastudio-9367b.firebasestorage.app",
  messagingSenderId: "712757853280",
  appId: "1:712757853280:web:80fd42db6287e754d8d705",
  measurementId: "G-NZXL4TMGLC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
