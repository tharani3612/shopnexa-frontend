import { initializeApp } from "firebase/app";

import {
    getAuth,
    GoogleAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "YOUR_NEW_COPIED_API_KEY",
    authDomain: "shopnexa-20f0e.firebaseapp.com",
    projectId: "shopnexa-20f0e",
    storageBucket: "shopnexa-20f0e.firebasestorage.app",
    messagingSenderId: "414635977079",
    appId: "1:414635977079:web:08777e156adce933ea9972",
    measurementId: "G-LPVHS8F33M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
    RecaptchaVerifier,
    signInWithPhoneNumber
};