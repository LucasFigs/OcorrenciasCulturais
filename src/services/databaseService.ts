import { db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Avaliacao, Usuario } from '../types/database';

export const databaseService = {
  // --- COLEÇÃO USUÁRIOS ---
  async salvarDadosUsuario(user: Usuario) {
    return await setDoc(doc(db, "usuarios", user.uid), user);
  },

  // --- COLEÇÃO AVALIAÇÕES ---
  async criarAvaliacao(data: Avaliacao) {
    return await addDoc(collection(db, "avaliacoes"), {
      ...data,
      createdAt: new Date()
    });
  },

  async buscarAvaliacoesPorOcorrencia(ocorrenciaId: string) {
    const q = query(
      collection(db, "avaliacoes"),
      where("ocorrenciaId", "==", ocorrenciaId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};