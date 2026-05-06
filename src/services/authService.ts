import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export const authService = {
  // Cadastro de novo usuário
  register: (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  },

  // Login
  login: (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  },

  // Logout
  logout: () => {
    return signOut(auth);
  },

  // Observador de persistência de sessão (requisito da task)
  checkSession: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};  