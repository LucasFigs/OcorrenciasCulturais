import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, StyleSheet, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  C, PLACES, OCCURRENCE_TYPES, SEVERITIES,
  OccurrenceData, OccurrenceType, Severity, Place, getNowFormatted,
} from './types';

// ─── Place Picker Modal ───────────────────────────────────────────────────────
function PlacePickerModal({ visible, current, onSelect, onClose }: {
  visible: boolean; current: Place;
  onSelect: (p: Place) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={pm.overlay}>
        <View style={pm.sheet}>
          <View style={pm.header}>
            <Text style={pm.title}>Escolha o Local</Text>
            <TouchableOpacity onPress={onClose} style={pm.closeBtn}>
              <Ionicons name="close" size={20} color={C.textSub} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {PLACES.map((place) => {
              const active = current.id === place.id;
              return (
                <TouchableOpacity
                  key={place.id}
                  style={[pm.item, active && { backgroundColor: place.color + '10', borderColor: place.color }]}
                  onPress={() => { onSelect(place); onClose(); }} activeOpacity={0.8}
                >
                  <View style={[pm.iconWrap, { backgroundColor: place.color + '18' }]}>
                    <MaterialCommunityIcons name={place.icon as any} size={22} color={place.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[pm.itemName, active && { color: place.color }]}>{place.name}</Text>
                    <Text style={pm.itemAddr}>{place.address}</Text>
                  </View>
                  {active && <Ionicons name="checkmark-circle" size={20} color={place.color} />}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Form Screen ──────────────────────────────────────────────────────────────
export function FormScreen({ onSubmit }: { onSubmit: (data: OccurrenceData) => void }) {
  const [place,       setPlace]       = useState<Place>(PLACES[0]);
  const [placeModal,  setPlaceModal]  = useState(false);
  const [dateTime]                    = useState(getNowFormatted());
  const [occType,     setOccType]     = useState<OccurrenceType | null>(null);
  const [severity,    setSeverity]    = useState<Severity | null>(null);
  const [description, setDescription] = useState('');
  const [touched,     setTouched]     = useState<Record<string, boolean>>({});

  const CHAR_LIMIT = 300;

  const errors: { type?: string; description?: string } = {};
  if (!occType)                       errors.type        = 'Selecione o tipo de ocorrência';
  if (description.trim().length < 10) errors.description = 'Descreva o ocorrido com pelo menos 10 caracteres';
  const isValid = Object.keys(errors).length === 0;

  function touch(field: string) { setTouched((prev) => ({ ...prev, [field]: true })); }

  const handleSubmit = () => {
    setTouched({ type: true, description: true });
    if (!isValid) return;
    onSubmit({ place, dateTime, type: occType!, severity: severity ?? 'baixa', description });
  };

  const typeError = touched.type        ? errors.type        : undefined;
  const descError = touched.description ? errors.description : undefined;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerBack}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nova Ocorrência</Text>
        <View style={s.headerBadge}><Text style={s.headerBadgeText}>Formulário</Text></View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Local */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Local <Text style={s.req}>*</Text></Text>
          <TouchableOpacity style={s.placeCard} onPress={() => setPlaceModal(true)} activeOpacity={0.8}>
            <View style={[s.placeIconWrap, { backgroundColor: place.color + '18' }]}>
              <MaterialCommunityIcons name={place.icon as any} size={26} color={place.color} />
            </View>
            <View style={s.placeInfo}>
              <Text style={s.placeName}>{place.name}</Text>
              <Text style={s.placeAddress}>{place.address}</Text>
              <Text style={[s.placeCount, { color: place.color }]}>{place.count} ocorrências</Text>
            </View>
            <View style={s.placeChevron}>
              <Ionicons name="chevron-down" size={18} color={C.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Data de registro</Text>
          <View style={s.dateBox}>
            <View style={s.dateIconWrap}><Ionicons name="calendar" size={18} color={C.primary} /></View>
            <Text style={s.dateText}>{dateTime}</Text>
            <View style={s.autoBadge}><Text style={s.autoBadgeText}>auto</Text></View>
          </View>
          <Text style={s.helper}>Registrada automaticamente — não pode ser futura.</Text>
        </View>

        {/* Tipo */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Tipo de ocorrência <Text style={s.req}>*</Text></Text>
          <View style={s.categoriesGrid}>
            {OCCURRENCE_TYPES.map((cat) => {
              const active = occType === cat.id;
              return (
                <TouchableOpacity key={cat.id}
                  style={[s.categoryCard, active && { borderColor: cat.color, backgroundColor: cat.color + '10' }, !!typeError && !active && s.cardErr]}
                  onPress={() => { setOccType(cat.id); touch('type'); }} activeOpacity={0.75}>
                  <View style={[s.categoryIconCircle, { backgroundColor: active ? cat.color : '#F3F4F6' }]}>
                    <MaterialCommunityIcons name={cat.icon as any} size={22} color={active ? '#fff' : C.textSub} />
                  </View>
                  <Text style={[s.categoryLabel, active && { color: cat.color }]}>{cat.label}</Text>
                  {active && (
                    <View style={[s.categoryCheck, { backgroundColor: cat.color }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {!!typeError && (
            <View style={s.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#E11D48" />
              <Text style={s.errorText}>{typeError}</Text>
            </View>
          )}
        </View>

        {/* Gravidade */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Gravidade <Text style={s.optional}>(opcional)</Text></Text>
          <View style={s.severityRow}>
            {SEVERITIES.map((sev) => {
              const active = severity === sev.id;
              return (
                <TouchableOpacity key={sev.id}
                  style={[s.severityPill, active && { borderColor: sev.color, backgroundColor: sev.color + '12' }]}
                  onPress={() => setSeverity(sev.id)} activeOpacity={0.75}>
                  {active && <View style={[s.severityDot, { backgroundColor: sev.color }]} />}
                  <Text style={[s.severityLabel, active && { color: sev.color }]}>{sev.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Descrição */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Descrição <Text style={s.req}>*</Text></Text>
          <View style={[s.textAreaWrap, !!descError && s.inputErr]}>
            <TextInput style={s.textArea}
              placeholder="Descreva o ocorrido com pelo menos 10 caracteres..."
              placeholderTextColor={C.textMuted} multiline maxLength={CHAR_LIMIT}
              value={description}
              onChangeText={(v) => { setDescription(v); touch('description'); }}
              onBlur={() => touch('description')} textAlignVertical="top"
            />
            <View style={s.charRow}>
              <Text style={[s.charCount,
                description.trim().length > 0 && description.trim().length < 10 && { color: '#E11D48' },
                description.trim().length >= 10 && { color: C.success }]}>
                {description.length}/{CHAR_LIMIT}
              </Text>
              {description.trim().length > 0 && description.trim().length < 10 && (
                <Text style={s.charHint}>Faltam {10 - description.trim().length} caractere(s)</Text>
              )}
            </View>
          </View>
          {!!descError && (
            <View style={s.errorRow}>
              <Ionicons name="alert-circle" size={13} color="#E11D48" />
              <Text style={s.errorText}>{descError}</Text>
            </View>
          )}
        </View>

        {Object.values(touched).some(Boolean) && !isValid && (
          <View style={s.warnBanner}>
            <Ionicons name="warning-outline" size={16} color="#92400E" />
            <Text style={s.warnText}>Preencha todos os campos obrigatórios antes de enviar.</Text>
          </View>
        )}

        <TouchableOpacity style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
          onPress={handleSubmit} activeOpacity={0.82}>
          <Ionicons name="send" size={16} color={isValid ? '#fff' : C.textMuted} style={{ marginRight: 8 }} />
          <Text style={[s.submitText, !isValid && { color: C.textMuted }]}>Registrar Ocorrência</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <PlacePickerModal visible={placeModal} current={place}
        onSelect={setPlace} onClose={() => setPlaceModal(false)} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: Platform.OS === 'android' ? 42 : 56, paddingBottom: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  headerBack: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.text, letterSpacing: 0.2 },
  headerBadge: { backgroundColor: C.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: C.primary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20 },
  section: { marginBottom: 22 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  req: { color: '#E11D48', fontWeight: '700' },
  optional: { color: C.textMuted, fontWeight: '400', letterSpacing: 0, textTransform: 'none', fontSize: 11 },
  helper: { fontSize: 11, color: C.textMuted, marginTop: 6 },
  inputErr: { borderColor: '#E11D48', borderWidth: 1.5 },
  cardErr: { borderColor: '#FECDD3', backgroundColor: '#FFF1F2' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errorText: { fontSize: 12, color: '#E11D48', fontWeight: '500', flex: 1 },
  warnBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  warnText: { fontSize: 13, color: '#92400E', fontWeight: '500', flex: 1 },
  placeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: C.border },
  placeIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 15, fontWeight: '700', color: C.text },
  placeAddress: { fontSize: 12, color: C.textSub, marginTop: 2 },
  placeCount: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  placeChevron: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 13, gap: 10 },
  dateIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  dateText: { flex: 1, color: C.text, fontSize: 14, fontWeight: '500' },
  autoBadge: { backgroundColor: '#F3F4F6', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  autoBadgeText: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: '47%', backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 14, alignItems: 'flex-start', position: 'relative' },
  categoryIconCircle: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: C.textSub },
  categoryCheck: { position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  severityRow: { flexDirection: 'row', gap: 10 },
  severityPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card },
  severityDot: { width: 7, height: 7, borderRadius: 4 },
  severityLabel: { fontSize: 13, fontWeight: '600', color: C.textSub },
  textAreaWrap: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 14 },
  textArea: { color: C.text, fontSize: 14, minHeight: 100, lineHeight: 22 },
  charRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  charCount: { fontSize: 11, color: C.textMuted },
  charHint: { fontSize: 10, color: '#E11D48' },
  submitBtn: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  submitBtnDisabled: { backgroundColor: '#F3F4F6', shadowOpacity: 0, elevation: 0, borderWidth: 1, borderColor: C.border },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
});

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, maxHeight: '80%', paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', color: C.text },
  closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, marginBottom: 10, backgroundColor: C.card },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: C.text },
  itemAddr: { fontSize: 12, color: C.textSub, marginTop: 2 },
});
