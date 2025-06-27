// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0E8VTqmHGFyVnMN4au7s7o0AWFpHUQdA",
  authDomain: "todoapp-c9f9a.firebaseapp.com",
  projectId: "todoapp-c9f9a",
  storageBucket: "todoapp-c9f9a.appspot.com",
  messagingSenderId: "45228019212",
  appId: "1:45228019212:web:f45b5b350cb368eb76e829",
  measurementId: "G-FJWQBZ7XYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Provider, and export them
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, analytics };
