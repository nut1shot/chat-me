// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA327ATiUvV5lo7TiE0EzARj11j_hu5AoQ",
  authDomain: "chat-app-12f0d.firebaseapp.com",
  projectId: "chat-app-12f0d",
  storageBucket: "chat-app-12f0d.appspot.com",
  messagingSenderId: "738251636056",
  appId: "1:738251636056:web:32bf0522bf2a10dfa5792d",
  measurementId: "G-DS899PTW6G"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);