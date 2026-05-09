import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './types';

export function BottomNav({ active, onGoHistory, onGoForm }: {
  active: 'form' | 'history';
  onGoHistory: () => void;
  onGoForm: () => void;
}) {
  return (
    <View style={s.bottomNav}>
      <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
        <Ionicons name="home-outline" size={24} color={C.textMuted} />
        <Text style={s.navLabel}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.navItem} activeOpacity={0.7} onPress={onGoHistory}>
        <Ionicons name="list-outline" size={24} color={active === 'history' ? C.primary : C.textMuted} />
        <Text style={[s.navLabel, active === 'history' && { color: C.primary }]}>Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.navItem} activeOpacity={0.7} onPress={onGoForm}>
        <Ionicons name="alert-circle-outline" size={24} color={active === 'form' ? C.primary : C.textMuted} />
        <Text style={[s.navLabel, active === 'form' && { color: C.primary }]}>Registrar</Text>
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
  );
}

const s = StyleSheet.create({
  bottomNav: { flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
});
