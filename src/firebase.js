// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCof0oEeLWYsrwEka9kK3reM3FvbAosYf0",
  authDomain: "prepflow-89210.firebaseapp.com",
  projectId: "prepflow-89210",
  storageBucket: "prepflow-89210.firebasestorage.app",
  messagingSenderId: "430436885461",
  appId: "1:430436885461:web:a5255e21e5f3c56313935c"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
