import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJ-7oKXhRQqYB8nVMnb7z6ne-sOi034_0",
  authDomain: "msu-iit-watermonitoringsystem.firebaseapp.com",
  projectId: "msu-iit-watermonitoringsystem",
  storageBucket: "msu-iit-watermonitoringsystem.appspot.com",
  messagingSenderId: "289051512949",
  appId: "1:289051512949:web:a812eca549e1084ddd683c",
  measurementId: "G-HFG2RFKLJV",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAPk6sIYpsnmXYfHq41DsQjuM8Vooa7UYo",
//   authDomain: "waterms-dea9e.firebaseapp.com",
//   projectId: "waterms-dea9e",
//   storageBucket: "waterms-dea9e.appspot.com",
//   messagingSenderId: "930575343377",
//   appId: "1:930575343377:web:ec03e89912ec79724ef6b0",
//   measurementId: "G-FR8G04ZYS5"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
