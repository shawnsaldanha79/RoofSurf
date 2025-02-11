import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-mern-8e32c.firebaseapp.com",
  projectId: "real-estate-mern-8e32c",
  storageBucket: "real-estate-mern-8e32c.firebasestorage.app",
  messagingSenderId: "239148525464",
  appId: "1:239148525464:web:eddfd14eff65648723eded"
};

export const app = initializeApp(firebaseConfig);