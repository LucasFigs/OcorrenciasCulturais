import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { OccurrenceData, OccurrenceRecord, UserProfile, AuthFlow, MainTab } from './src/types';
import { VISITOR_PROFILE, makeInitials, getNowFormatted } from './src/constants';

import { BottomNav }          from './src/components/BottomNav';
import { LoginScreen }        from './src/screens/LoginScreen';
import { RegisterScreen }     from './src/screens/RegisterScreen';
import { FormScreen }         from './src/screens/FormScreen';
import { ConfirmationScreen } from './src/screens/ConfirmationScreen';
import { HistoryScreen }      from './src/screens/HistoryScreen';
import { ProfileScreen }      from './src/screens/ProfileScreen';

export default function App() {
  const [authFlow,      setAuthFlow]      = useState<AuthFlow>('login');
  const [profile,       setProfile]       = useState<UserProfile | null>(null);
  const [activeTab,     setActiveTab]     = useState<MainTab>('historico');
  const [occurrences,   setOccurrences]   = useState<OccurrenceRecord[]>([]);
  const [submitted,     setSubmitted]     = useState<{ data: OccurrenceData; protocol: number } | null>(null);

  // ── Auth ────────────────────────────────────────────────────────────────
  const handleLogin = (_email: string, _password: string) => {
    setProfile({ ...VISITOR_PROFILE, email: _email });
    setActiveTab('historico');
  };

  const handleRegister = (
    firstName: string, lastName: string,
    email: string, _password: string,
  ) => {
    setProfile({
      id: `user-${Date.now()}`,
      firstName, lastName, email,
      role: 'visitante',
      initials: makeInitials(firstName, lastName),
      bio: '', address: '', phone: '',
    });
    setActiveTab('historico');
  };

  const handleLogout = () => {
    setProfile(null);
    setAuthFlow('login');
    setOccurrences([]);
    setSubmitted(null);
  };

  // ── Perfil ──────────────────────────────────────────────────────────────
  const handleSaveProfile = (updated: UserProfile) => setProfile(updated);

  // ── Ocorrências ─────────────────────────────────────────────────────────
  // #16 — submeter nova ocorrência
  const handleFormSubmit = (data: OccurrenceData) => {
    const protocol = Math.floor(100000 + Math.random() * 900000);
    const record: OccurrenceRecord = {
      ...data,
      id:       String(Date.now()),
      protocol,
      status:   'Pendente',
    };
    setOccurrences(prev => [record, ...prev]);
    setSubmitted({ data, protocol });   // #22 — vai para confirmação
  };

  // #22 — voltar do feedback para nova ocorrência
  const handleNovaOcorrencia = () => {
    setSubmitted(null);
    setActiveTab('registrar');
  };

  // #18 — ir para histórico a partir da confirmação
  const handleVerHistorico = () => {
    setSubmitted(null);
    setActiveTab('historico');
  };

  // Editar / Excluir — #24
  const handleUpdate = (u: OccurrenceRecord) =>
    setOccurrences(prev => prev.map(o => o.id === u.id ? u : o));

  const handleDelete = (id: string) =>
    setOccurrences(prev => prev.filter(o => o.id !== id));

  // ── Sem sessão ──────────────────────────────────────────────────────────
  if (!profile) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
        {authFlow === 'login' ? (
          <LoginScreen
            onLogin={handleLogin}
            onRegister={() => setAuthFlow('register')}
          />
        ) : (
          <RegisterScreen
            onRegister={handleRegister}
            onBack={() => setAuthFlow('login')}
          />
        )}
      </>
    );
  }

  // ── #22 — Tela de confirmação pós-envio ─────────────────────────────────
  if (submitted) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
        <ConfirmationScreen
          data={submitted.data}
          protocol={submitted.protocol}
          onNovaOcorrencia={handleNovaOcorrencia}
          onVerHistorico={handleVerHistorico}
        />
      </>
    );
  }

  // ── App principal ───────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (activeTab) {
      case 'registrar':   // #16
        return <FormScreen onSubmit={handleFormSubmit} />;

      case 'historico':   // #18 + #25 pull-to-refresh + #24 excluir
        return (
          <HistoryScreen
            occurrences={occurrences}
            onNewOccurrence={() => setActiveTab('registrar')}
            onUpdateOccurrence={handleUpdate}
            onDeleteOccurrence={handleDelete}
          />
        );

      case 'perfil':
        return (
          <ProfileScreen
            profile={profile}
            occurrences={occurrences}
            onSave={handleSaveProfile}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

      {/* #19 — todas as telas conectadas na navegação */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      <BottomNav active={activeTab} onPress={setActiveTab} />
    </View>
  );
}
