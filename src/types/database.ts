export interface UserProfile {
  uid: string;
  email: string;
  role: 'visitante' | 'admin';
  createdAt: Date;
}

export interface Ocorrencia {
  id?: string;
  titulo: string;
  descricao: string;
  tipo: string; 
  data: Date;
  userId: string;
  status: 'pendente' | 'em_andamento' | 'resolvido';
}
export interface Avaliacao {
  id?: string;
  ocorrenciaId: string;
  userId: string;
  nota: number; // 1 a 5
  comentario: string;
  createdAt: Date;
}

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  role: 'admin' | 'visitante';
}