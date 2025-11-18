// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCwsYD4ulXopVGY14vGLNVH-q9ySvAu8lo",
    authDomain: "aquasense-ecommerce.firebaseapp.com",
    projectId: "aquasense-ecommerce",
    storageBucket: "aquasense-ecommerce.firebasestorage.app",
    messagingSenderId: "582526064371",
    appId: "1:582526064371:web:54b50b4480266ab0af0986",
    measurementId: "G-2DV716P4VN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db };