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