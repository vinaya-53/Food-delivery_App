// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics} from "firebase/analytics";
import {getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeIe2nS3wjPp2BWAn68m1_UpW1zY9pX4E",
  authDomain: "food-delivery-app-816a6.firebaseapp.com",
  projectId: "food-delivery-app-816a6",
  storageBucket: "food-delivery-app-816a6.firebasestorage.app",
  messagingSenderId: "977016696812",
  appId: "1:977016696812:web:d95e98a40a9a4e3b81dac9",
  measurementId: "G-FM68QG93BX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

