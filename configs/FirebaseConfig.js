// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "travel-ai-35d57.firebaseapp.com",
  projectId: "travel-ai-35d57",
  storageBucket: "travel-ai-35d57.appspot.com",
  messagingSenderId: "43615536702",
  appId: "1:43615536702:web:d4b6e3f13cc32cedd5336f",
  measurementId: "G-ZVD7ZC10QF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);