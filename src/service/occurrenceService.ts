import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // Mudamos de auth para db aqui

const collectionRef = collection(db, "ocorrencias");

export const occurrenceService = {
  // data: any permite enviar o objeto da ocorrência
  create: (data: any) => {
    return addDoc(collectionRef, {
      ...data,
      createdAt: new Date(),
    });
  },

  getByUser: async (userId: string) => {
    const q = query(collectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getAll: async () => {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};