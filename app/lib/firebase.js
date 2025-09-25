// app/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMgvYm1VWXW2T4hFrlrlzj9DyKX6Js_D0",
  authDomain: "hustleledger-88cbe.firebaseapp.com",
  projectId: "hustleledger-88cbe",
  storageBucket: "hustleledger-88cbe.appspot.com",
  messagingSenderId: "972621244722",
  appId: "1:972621244722:web:0b488af8fb656cc7d00f2b"
};

// Initialize Firebase (only once, even if Expo refreshes)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export the auth instance for Sign In / Sign Up
export const auth = getAuth(app);
