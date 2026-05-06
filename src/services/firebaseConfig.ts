import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCek_bkPBc2gl3cGrhMqzZroMQsmUkGQM",
  authDomain: "cordel-app.firebaseapp.com",
  projectId: "cordel-app",
  storageBucket: "cordel-app.firebasestorage.app",
  messagingSenderId: "116935046771",
  appId: "1:116935046771:web:20d7db5ef6ffbbbb871c06",
  measurementId: "G-ZTK1WRJN6D"
};

// 1. Inicializa o Firebase Core
const app = initializeApp(firebaseConfig);

// 2. Inicializa o Auth com persistência
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) as any
});

// 3. Inicializa o Firestore
export const db = getFirestore(app);