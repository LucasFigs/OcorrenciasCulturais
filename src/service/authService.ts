import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "./firebaseConfig"; 

export const authService = {
  // Adicionamos : string para dizer que é texto
  signUp: (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  login: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  logout: () => {
    return signOut(auth);
  },

  // callback: any aceita a função de retorno do Firebase
  onAuthStateChange: (callback: any) => {
    return onAuthStateChanged(auth, callback);
  }
};