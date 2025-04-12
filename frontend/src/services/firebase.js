// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API,
    authDomain: "streamlog-cee43.firebaseapp.com",
    projectId: "streamlog-cee43",
    storageBucket: "streamlog-cee43.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
