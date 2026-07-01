import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFzilUQzuQHzxsP1wSVoapbP4AzOFFtHU",
  authDomain: "mensagensneweco-9b22e.firebaseapp.com",
  projectId: "mensagensneweco-9b22e",
  storageBucket: "mensagensneweco-9b22e.firebasestorage.app",
  messagingSenderId: "69509568215",
  appId: "1:69509568215:web:68253c968088b70e914292",
  measurementId: "G-RSXZHK34WY"
};

// Inicializa o Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (Banco de dados) e exporta como 'db'
export const db = getFirestore(app);