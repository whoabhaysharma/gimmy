// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBP46VSNCVB6oLThUJ9Zt-Im4h-y2p-jIA",
    authDomain: "gimmy-f8825.firebaseapp.com",
    projectId: "gimmy-f8825",
    storageBucket: "gimmy-f8825.appspot.com",
    messagingSenderId: "505603988006",
    appId: "1:505603988006:web:1ce4c1683a894b873264e7",
    measurementId: "G-PY1BLD5KTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };