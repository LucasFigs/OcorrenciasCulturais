export type OccurrenceType   = 'estrutura' | 'atendimento' | 'acessibilidade' | 'limpeza';
export type Severity         = 'baixa' | 'media' | 'alta';
export type OccurrenceStatus = 'Pendente' | 'Em análise' | 'Em andamento' | 'Resolvido';
export type UserRole         = 'visitante' | 'admin';
export type AuthFlow         = 'login' | 'register';
export type MainTab          = 'registrar' | 'historico' | 'perfil';

export type Place = {
  id: string; name: string; address: string;
  count: string; icon: string; color: string;
};

export type OccurrenceData = {
  place: Place; dateTime: string;
  type: OccurrenceType; severity: Severity;
  description: string; rating?: number;
};

export type OccurrenceRecord = OccurrenceData & {
  id: string; protocol: number;
  status: OccurrenceStatus;
};

export type UserProfile = {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  role:      UserRole;
  initials:  string;
  bio?:      string;
  address?:  string;
  phone?:    string;
};
