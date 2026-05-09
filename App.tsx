import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, OccurrenceData, OccurrenceRecord, Screen } from './src/screens/types';
import { FormScreen } from './src/screens/FormScreen';
import { ConfirmationScreen } from './src/screens/ConfirmationScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';

export default function App() {
  const [screen,            setScreen]            = useState<Screen>('form');
  const [occurrences,       setOccurrences]       = useState<OccurrenceRecord[]>([]);
  const [submittedData,     setSubmittedData]     = useState<OccurrenceData | null>(null);
  const [submittedProtocol, setSubmittedProtocol] = useState<number>(0);

  const handleFormSubmit = (data: OccurrenceData) => {
    const protocol = Math.floor(100000 + Math.random() * 900000);
    const record: OccurrenceRecord = { ...data, id: String(Date.now()), protocol, status: 'Pendente' };
    setOccurrences((prev) => [record, ...prev]);
    setSubmittedData(data);
    setSubmittedProtocol(protocol);
    setScreen('confirmation');
  };

  const goToForm    = () => { setSubmittedData(null); setScreen('form'); };
  const goToHistory = () => setScreen('history');

  const handleUpdate = (updated: OccurrenceRecord) =>
    setOccurrences((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

  const handleDelete = (id: string) =>
    setOccurrences((prev) => prev.filter((o) => o.id !== id));

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {screen === 'form' && (
        <View style={{ flex: 1 }}>
          <FormScreen onSubmit={handleFormSubmit} />
          <View style={s.bottomNav}>
            <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
              <Ionicons name="home-outline" size={24} color={C.textMuted} />
              <Text style={s.navLabel}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navItem} activeOpacity={0.7} onPress={goToHistory}>
              <Ionicons name="list-outline" size={24} color={C.textMuted} />
              <Text style={s.navLabel}>Histórico</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
              <Ionicons name="alert-circle-outline" size={24} color={C.primary} />
              <Text style={[s.navLabel, { color: C.primary }]}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={C.textMuted} />
              <Text style={s.navLabel}>Alertas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
              <Ionicons name="person-outline" size={24} color={C.textMuted} />
              <Text style={s.navLabel}>Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {screen === 'confirmation' && submittedData && (
        <ConfirmationScreen
          data={submittedData}
          protocol={submittedProtocol}
          onNewOccurrence={goToForm}
          onViewHistory={goToHistory}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen
          occurrences={occurrences}
          onBack={() => setScreen(submittedData ? 'confirmation' : 'form')}
          onNewOccurrence={goToForm}
          onUpdateOccurrence={handleUpdate}
          onDeleteOccurrence={handleDelete}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: C.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
});
