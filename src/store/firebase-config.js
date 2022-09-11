// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAXV-7akl_8YdI9eM67hFfXck7n_wjh74",
  authDomain: "netflix-clone-react-app-37eb2.firebaseapp.com",
  projectId: "netflix-clone-react-app-37eb2",
  storageBucket: "netflix-clone-react-app-37eb2.appspot.com",
  messagingSenderId: "949273617829",
  appId: "1:949273617829:web:09fcdd4a72b18e96e5344c",
  measurementId: "G-VYBL7T3XY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);