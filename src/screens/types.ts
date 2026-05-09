// ─── Types ───────────────────────────────────────────────────────────────────
export type OccurrenceType = 'estrutura' | 'atendimento' | 'acessibilidade' | 'limpeza';
export type Severity = 'baixa' | 'media' | 'alta';

export type Place = {
  id: string; name: string; address: string;
  count: string; icon: string; color: string;
};

export type OccurrenceData = {
  place: Place; dateTime: string;
  type: OccurrenceType; severity: Severity; description: string;
};

export type OccurrenceRecord = OccurrenceData & {
  id: string; protocol: number;
  status: 'Pendente' | 'Em análise' | 'Em andamento' | 'Resolvido';
};

export type Screen = 'form' | 'confirmation' | 'history';

// ─── Constants ───────────────────────────────────────────────────────────────
export const C = {
  bg: '#F7F8FA', card: '#FFFFFF', border: '#E8ECF2',
  primary: '#2563EB', primaryLight: '#EEF3FF',
  text: '#111827', textSub: '#6B7280', textMuted: '#A0AAB4',
  success: '#059669', successLight: '#ECFDF5',
} as const;

export const PLACES: Place[] = [
  { id: '1', name: 'Arena Castelão',        address: 'Av. Alberto Craveiro, 2901', count: '1,2K', icon: 'stadium-outline',        color: '#2563EB' },
  { id: '2', name: 'Museu do Ceará',         address: 'R. São Paulo, 51 – Centro',  count: '847',  icon: 'bank-outline',           color: '#7C3AED' },
  { id: '3', name: 'Parque da Cidade',       address: 'Av. Sen. Virgílio Távora',   count: '2,1K', icon: 'tree-outline',           color: '#059669' },
  { id: '4', name: 'Teatro José de Alencar', address: 'Praça José de Alencar, s/n', count: '633',  icon: 'drama-masks',            color: '#DC2626' },
  { id: '5', name: 'Praia de Iracema',       address: 'Av. Historiador Raimundo',   count: '3,4K', icon: 'umbrella-beach-outline', color: '#0891B2' },
];

export const OCCURRENCE_TYPES = [
  { id: 'estrutura'      as OccurrenceType, label: 'Estrutura',      icon: 'office-building-outline',  color: '#2563EB' },
  { id: 'atendimento'    as OccurrenceType, label: 'Atendimento',    icon: 'account-heart-outline',    color: '#E11D48' },
  { id: 'acessibilidade' as OccurrenceType, label: 'Acessibilidade', icon: 'wheelchair-accessibility', color: '#7C3AED' },
  { id: 'limpeza'        as OccurrenceType, label: 'Limpeza',        icon: 'broom',                    color: '#059669' },
];

export const SEVERITIES = [
  { id: 'baixa' as Severity, label: 'Baixa', color: '#059669' },
  { id: 'media' as Severity, label: 'Média', color: '#F59E0B' },
  { id: 'alta'  as Severity, label: 'Alta',  color: '#E11D48' },
];

export const STATUS_CONFIG: Record<OccurrenceRecord['status'], { color: string; bg: string; icon: any }> = {
  'Pendente':     { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  'Em análise':   { color: '#2563EB', bg: '#EEF3FF', icon: 'search-outline' },
  'Em andamento': { color: '#7C3AED', bg: '#F3F0FF', icon: 'construct-outline' },
  'Resolvido':    { color: '#059669', bg: '#ECFDF5', icon: 'checkmark-circle-outline' },
};

// ─── Utils ───────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0'); }
export function getNowFormatted(): string {
  const d = new Date();
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}  ·  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
