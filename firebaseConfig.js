import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReacctNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSM3T_1aP9RfTYpTG6ToMlvQTMa9bWCBQ",
  authDomain: "cashyourcoupons.firebaseapp.com",
  projectId: "cashyourcoupons",
  storageBucket: "cashyourcoupons.firebasestorage.app",
  messagingSenderId: "1017795541549",
  appId: "1:1017795541549:web:a8247233bcbd2351bc96a4",
  measurementId: "G-QZ9S5TR5F6",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
});
