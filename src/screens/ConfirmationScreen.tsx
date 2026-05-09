import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, OCCURRENCE_TYPES, SEVERITIES, OccurrenceData } from './types';
import { BottomNav } from './BottomNav';

export function ConfirmationScreen({ data, protocol, onNewOccurrence, onViewHistory }: {
  data: OccurrenceData; protocol: number;
  onNewOccurrence: () => void; onViewHistory: () => void;
}) {
  const typeInfo     = OCCURRENCE_TYPES.find((t) => t.id === data.type);
  const severityInfo = SEVERITIES.find((sv) => sv.id === data.severity);

  return (
    <View style={s.root}>
      <View style={cs.topBand} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={cs.content} showsVerticalScrollIndicator={false}>

        <View style={cs.iconWrap}>
          <View style={cs.iconOuter}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
        </View>

        <Text style={cs.title}>Ocorrência Registrada!</Text>
        <Text style={cs.subtitle}>
          Sua ocorrência foi enviada com sucesso e será analisada em breve pela equipe responsável.
        </Text>

        <View style={cs.protocolBadge}>
          <Ionicons name="document-text-outline" size={13} color={C.primary} />
          <Text style={cs.protocolText}>Protocolo #{protocol}</Text>
        </View>

        <View style={cs.card}>
          <Text style={cs.cardTitle}>RESUMO DA OCORRÊNCIA</Text>

          <View style={cs.row}>
            <View style={cs.rowIcon}><Ionicons name="location-outline" size={16} color={C.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={cs.rowLabel}>Local</Text>
              <Text style={cs.rowValue}>{data.place.name}</Text>
              <Text style={cs.rowSub}>{data.place.address}</Text>
            </View>
          </View>
          <View style={cs.divider} />

          <View style={cs.row}>
            <View style={cs.rowIcon}><Ionicons name="calendar-outline" size={16} color={C.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={cs.rowLabel}>Data e hora</Text>
              <Text style={cs.rowValue}>{data.dateTime}</Text>
            </View>
          </View>
          <View style={cs.divider} />

          <View style={cs.row}>
            <View style={[cs.rowIcon, { backgroundColor: (typeInfo?.color ?? C.primary) + '18' }]}>
              <MaterialCommunityIcons name={typeInfo?.icon as any} size={16} color={typeInfo?.color ?? C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={cs.rowLabel}>Tipo</Text>
              <Text style={[cs.rowValue, { color: typeInfo?.color }]}>{typeInfo?.label}</Text>
            </View>
            {severityInfo && (
              <View style={[cs.sevTag, { backgroundColor: severityInfo.color + '18', borderColor: severityInfo.color + '40' }]}>
                <View style={[cs.sevDot, { backgroundColor: severityInfo.color }]} />
                <Text style={[cs.sevTagText, { color: severityInfo.color }]}>{severityInfo.label}</Text>
              </View>
            )}
          </View>
          <View style={cs.divider} />

          <Text style={cs.rowLabel}>Descrição</Text>
          <Text style={cs.descText}>{data.description}</Text>
        </View>

        <View style={cs.card}>
          <Text style={cs.cardTitle}>ACOMPANHAMENTO</Text>
          {[
            { label: 'Enviado',      done: true,  icon: 'checkmark-circle' as const },
            { label: 'Em análise',   done: false, icon: 'time-outline' as const },
            { label: 'Em andamento', done: false, icon: 'construct-outline' as const },
            { label: 'Resolvido',    done: false, icon: 'ribbon-outline' as const },
          ].map((step, i) => (
            <View key={step.label} style={cs.stepRow}>
              <View style={[cs.stepDot, step.done && cs.stepDotDone]}>
                <Ionicons name={step.icon} size={13} color={step.done ? '#fff' : C.textMuted} />
              </View>
              {i < 3 && <View style={[cs.stepLine, step.done && cs.stepLineDone]} />}
              <Text style={[cs.stepLabel, step.done && { color: C.success, fontWeight: '700' }]}>{step.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={cs.primaryBtn} onPress={onNewOccurrence} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={cs.primaryBtnText}>Registrar Nova Ocorrência</Text>
        </TouchableOpacity>

        <TouchableOpacity style={cs.secondaryBtn} onPress={onViewHistory} activeOpacity={0.7}>
          <Ionicons name="list-outline" size={18} color={C.primary} style={{ marginRight: 8 }} />
          <Text style={cs.secondaryBtnText}>Ver Minhas Ocorrências</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav active="form" onGoHistory={onViewHistory} onGoForm={onNewOccurrence} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
});

const cs = StyleSheet.create({
  topBand: { position: 'absolute', top: 0, left: 0, right: 0, height: 180, backgroundColor: C.primary, opacity: 0.05, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 60 : 72, alignItems: 'center' },
  iconWrap: { marginBottom: 20 },
  iconOuter: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.success, alignItems: 'center', justifyContent: 'center', shadowColor: C.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8, borderWidth: 6, borderColor: C.successLight },
  title: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.3, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 21, marginBottom: 16, paddingHorizontal: 10 },
  protocolBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.primaryLight, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginBottom: 24, borderWidth: 1, borderColor: C.primary + '30' },
  protocolText: { fontSize: 12, fontWeight: '700', color: C.primary },
  card: { width: '100%', backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardTitle: { fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 1 },
  rowLabel: { fontSize: 10, fontWeight: '700', color: C.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  rowValue: { fontSize: 14, fontWeight: '700', color: C.text },
  rowSub: { fontSize: 12, color: C.textSub, marginTop: 2 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  descText: { fontSize: 14, color: C.textSub, lineHeight: 20, marginTop: 4 },
  sevTag: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, marginLeft: 8 },
  sevDot: { width: 7, height: 7, borderRadius: 4 },
  sevTagText: { fontSize: 12, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, position: 'relative' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginRight: 12, zIndex: 1 },
  stepDotDone: { backgroundColor: C.success, borderColor: C.success },
  stepLine: { position: 'absolute', left: 13, top: 28, width: 2, height: 10, backgroundColor: C.border },
  stepLineDone: { backgroundColor: C.success },
  stepLabel: { fontSize: 13, fontWeight: '600', color: C.textSub },
  primaryBtn: { width: '100%', backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  secondaryBtn: { width: '100%', backgroundColor: C.card, borderRadius: 14, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: C.primary + '50' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: C.primary, letterSpacing: 0.2 },
});
