
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-1e7b4.firebaseapp.com",
  projectId: "interviewiq-1e7b4",
  storageBucket: "interviewiq-1e7b4.firebasestorage.app",
  messagingSenderId: "513544972273",
  appId: "1:513544972273:web:b8d603f854630137868650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };