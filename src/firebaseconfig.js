// Importando o Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6YD495MVHhtoNFfbVlwf83hHrTPkFk04",
  authDomain: "projecto1-db91d.firebaseapp.com",
  projectId: "projecto1-db91d",
  storageBucket: "projecto1-db91d.firebasestorage.app",
  messagingSenderId: "296901028545",
  appId: "1:296901028545:web:e0702e069527d05bc1c240",
  measurementId: "G-W7SKGQ8DGB"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
