// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbf7x5nY1m7WDjPcGbI5OOryEoD2hZ_T0",
  authDomain: "ustad-hazir-1227f.firebaseapp.com",
  projectId: "ustad-hazir-1227f",
  storageBucket: "ustad-hazir-1227f.firebasestorage.app",
  messagingSenderId: "815522475659",
  appId: "1:815522475659:web:ebf2465089a8c81d3eae8e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage=getFirestore(app)
