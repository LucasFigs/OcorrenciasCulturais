import { db } from '../firebaseConfig';
   import { collection, addDoc } from 'firebase/firestore';
   export const occurrenceService = {
     salvarOcorrencia: (dados) => addDoc(collection(db, 'ocorrencias'), dados),
   };