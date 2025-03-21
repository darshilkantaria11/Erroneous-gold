
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1TRp5COhB_mKe9F6PyR0Glm7CdA_ZaFA",
    authDomain: "otp-verify-34c21.firebaseapp.com",
    projectId: "otp-verify-34c21",
    storageBucket: "otp-verify-34c21.firebasestorage.app",
    messagingSenderId: "620388587897",
    appId: "1:620388587897:web:a8acec7c24074e205b77a8",
    measurementId: "G-1RHJ7SKLMK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Automatically uses the device language

export { auth, RecaptchaVerifier, signInWithPhoneNumber };


