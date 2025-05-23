// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// IMPORTANT: Replace this with your actual Firebase config from the Firebase console!
const firebaseConfig = {
  apiKey: "AIzaSyC4NYb8H9FpawFsFNoE8tG7JiB6ayekLHY",
  authDomain: "mindmaster-b127d.firebaseapp.com",
  databaseURL: "https://mindmaster-b127d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mindmaster-b127d",
  storageBucket: "mindmaster-b127d.firebasestorage.app",
  messagingSenderId: "325111727729",
  appId: "1:325111727729:web:9c418e998a1d62a1c37dd0",
  measurementId: "G-K9Z064XL75"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;