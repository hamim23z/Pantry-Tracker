// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcvby5A2fwhQruKQmgx-1OrPm3A_l2eEY",
  authDomain: "pantry-tracker-823aa.firebaseapp.com",
  projectId: "pantry-tracker-823aa",
  storageBucket: "pantry-tracker-823aa.appspot.com",
  messagingSenderId: "731805932745",
  appId: "1:731805932745:web:3045ae76572d4da3484118"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app); // Initialize Firestore

export { app, auth, firestore }; // Export Firestore