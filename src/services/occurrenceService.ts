import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Ocorrencia } from '../types/database';

export const occurrenceService = {
  // Criar 'Ocorrencia'
  create: async (data: Ocorrencia) => {
    return await addDoc(collection(db, "ocorrencias"), {
      ...data,
      createdAt: new Date(),
    });
  },
  // Buscar por usuário (Visitante)
  getByUser: async (userId: string) => {
    const q = query(
      collection(db, "ocorrencias"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Buscar todas (Admin)
  getAll: async () => {
    const q = query(collection(db, "ocorrencias"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};