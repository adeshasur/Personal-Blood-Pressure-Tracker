import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtx6nbGvboD9Sw2dksX9eONBHzEqmMlkg",
  authDomain: "wallpaper-incc.firebaseapp.com",
  projectId: "wallpaper-incc",
  storageBucket: "wallpaper-incc.firebasestorage.app",
  messagingSenderId: "795698360511",
  appId: "1:795698360511:web:2758ce907e88ee476ad60a",
  measurementId: "G-PBTKYZJPDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
