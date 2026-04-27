import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Esses dados eu peguei direto do seu print!
const firebaseConfig = {
  apiKey: "AIzaSyCek_bkPBc2gl3cGrhMqztZroMQsmUkGQM",
  authDomain: "cordel-app.firebaseapp.com",
  projectId: "cordel-app",
  storageBucket: "cordel-app.firebasestorage.app",
  messagingSenderId: "116935046771",
  appId: "1:116935046771:web:20d7db5ef6ffbbbb871c06",
  measurementId: "G-ZTK1WRJN6D"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// -----------------do firebase linha 25 e 26 (deu erro)------------------------------
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Exporta para usar no resto do app
export const auth = getAuth(app);
export const db = getFirestore(app);