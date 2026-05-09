import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, StyleSheet, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, OCCURRENCE_TYPES, SEVERITIES, STATUS_CONFIG, OccurrenceRecord, Severity } from './types';
import { BottomNav } from './BottomNav';

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ visible, occurrence, onClose, onSave }: {
  visible: boolean; occurrence: OccurrenceRecord | null;
  onClose: () => void; onSave: (updated: OccurrenceRecord) => void;
}) {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('baixa');

  React.useEffect(() => {
    if (occurrence) {
      setDescription(occurrence.description);
      setSeverity(occurrence.severity);
    }
  }, [occurrence]);

  if (!occurrence) return null;
  const typeInfo = OCCURRENCE_TYPES.find((t) => t.id === occurrence.type);

  const handleSave = () => {
    if (description.trim().length < 10) {
      Alert.alert('Atenção', 'A descrição deve ter pelo menos 10 caracteres.');
      return;
    }
    onSave({ ...occurrence, description: description.trim(), severity });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={em.overlay}>
        <View style={em.sheet}>
          <View style={em.header}>
            <Text style={em.title}>Editar Ocorrência</Text>
            <TouchableOpacity onPress={onClose} style={em.closeBtn}>
              <Ionicons name="close" size={20} color={C.textSub} />
            </TouchableOpacity>
          </View>

          <View style={em.infoBadge}>
            <MaterialCommunityIcons name={typeInfo?.icon as any} size={14} color={typeInfo?.color} />
            <Text style={[em.infoBadgeText, { color: typeInfo?.color }]}>{typeInfo?.label}</Text>
            <Text style={em.infoBadgeSep}>·</Text>
            <Text style={em.infoBadgeSub}>Protocolo #{occurrence.protocol}</Text>
          </View>

          <Text style={em.label}>Gravidade</Text>
          <View style={em.severityRow}>
            {SEVERITIES.map((sev) => {
              const active = severity === sev.id;
              return (
                <TouchableOpacity
                  key={sev.id}
                  style={[em.severityPill, active && { borderColor: sev.color, backgroundColor: sev.color + '14' }]}
                  onPress={() => setSeverity(sev.id)} activeOpacity={0.75}
                >
                  {active && <View style={[em.severityDot, { backgroundColor: sev.color }]} />}
                  <Text style={[em.severityLabel, active && { color: sev.color, fontWeight: '700' }]}>{sev.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={em.label}>Descrição</Text>
          <View style={em.textAreaWrap}>
            <TextInput
              style={em.textArea} value={description} onChangeText={setDescription}
              multiline maxLength={300} textAlignVertical="top"
              placeholder="Descreva o ocorrido..." placeholderTextColor={C.textMuted}
            />
            <Text style={em.charCount}>{description.length}/300</Text>
          </View>

          <View style={em.actions}>
            <TouchableOpacity style={em.cancelBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={em.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={em.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={em.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Occurrence Card ──────────────────────────────────────────────────────────
function OccurrenceCard({ item, onEdit, onDelete }: {
  item: OccurrenceRecord;
  onEdit: (item: OccurrenceRecord) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const typeInfo     = OCCURRENCE_TYPES.find((t) => t.id === item.type);
  const severityInfo = SEVERITIES.find((sv) => sv.id === item.severity);
  const statusCfg    = STATUS_CONFIG[item.status];
  const isPendente   = item.status === 'Pendente';

  return (
    <View style={oc.card}>
      <View style={oc.cardTop}>
        <View style={[oc.typeIconWrap, { backgroundColor: (typeInfo?.color ?? C.primary) + '15' }]}>
          <MaterialCommunityIcons name={typeInfo?.icon as any} size={18} color={typeInfo?.color ?? C.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={oc.typeLabel}>{typeInfo?.label}</Text>
          <Text style={oc.placeName}>{item.place.name}</Text>
        </View>
        <View style={[oc.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Ionicons name={statusCfg.icon} size={11} color={statusCfg.color} />
          <Text style={[oc.statusText, { color: statusCfg.color }]}>{item.status}</Text>
        </View>
      </View>

      <View style={oc.divider} />

      <View style={oc.metaRow}>
        <View style={oc.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={C.textMuted} />
          <Text style={oc.metaText}>{item.dateTime}</Text>
        </View>
        <View style={oc.metaItem}>
          <Ionicons name="document-text-outline" size={12} color={C.textMuted} />
          <Text style={oc.metaText}>#{item.protocol}</Text>
        </View>
        {severityInfo && (
          <View style={[oc.sevBadge, { backgroundColor: severityInfo.color + '15' }]}>
            <View style={[oc.sevDot, { backgroundColor: severityInfo.color }]} />
            <Text style={[oc.sevText, { color: severityInfo.color }]}>{severityInfo.label}</Text>
          </View>
        )}
      </View>

      <Text style={oc.description} numberOfLines={2}>{item.description}</Text>

      {isPendente ? (
        confirmDelete ? (
          <View style={oc.confirmBox}>
            <Text style={oc.confirmText}>Excluir ocorrência #{item.protocol}?</Text>
            <Text style={oc.confirmSub}>Esta ação não pode ser desfeita.</Text>
            <View style={oc.confirmActions}>
              <TouchableOpacity style={oc.confirmCancelBtn} onPress={() => setConfirmDelete(false)} activeOpacity={0.8}>
                <Text style={oc.confirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={oc.confirmDeleteBtn} onPress={() => onDelete(item.id)} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={14} color="#fff" />
                <Text style={oc.confirmDeleteText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={oc.actions}>
            <TouchableOpacity style={oc.editBtn} onPress={() => onEdit(item)} activeOpacity={0.8}>
              <Ionicons name="create-outline" size={14} color={C.primary} />
              <Text style={oc.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={oc.deleteBtn} onPress={() => setConfirmDelete(true)} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={14} color="#E11D48" />
              <Text style={oc.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={oc.lockedRow}>
          <Ionicons name="lock-closed-outline" size={12} color={C.textMuted} />
          <Text style={oc.lockedText}>Não pode ser editada — já está {item.status.toLowerCase()}</Text>
        </View>
      )}
    </View>
  );
}

// ─── History Screen ───────────────────────────────────────────────────────────
export function HistoryScreen({ occurrences, onBack, onNewOccurrence, onUpdateOccurrence, onDeleteOccurrence }: {
  occurrences: OccurrenceRecord[];
  onBack: () => void; onNewOccurrence: () => void;
  onUpdateOccurrence: (u: OccurrenceRecord) => void;
  onDeleteOccurrence: (id: string) => void;
}) {
  const [editTarget,   setEditTarget]   = useState<OccurrenceRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<OccurrenceRecord['status'] | 'Todos'>('Todos');

  const allStatuses: (OccurrenceRecord['status'] | 'Todos')[] = ['Todos', 'Pendente', 'Em análise', 'Em andamento', 'Resolvido'];
  const filtered     = filterStatus === 'Todos' ? occurrences : occurrences.filter((o) => o.status === filterStatus);
  const pendingCount = occurrences.filter((o) => o.status === 'Pendente').length;

  return (
    <View style={hx.root}>
      {/* Header */}
      <View style={hx.header}>
        <TouchableOpacity style={hx.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={hx.headerTitle}>Minhas Ocorrências</Text>
          <Text style={hx.headerSub}>{occurrences.length} registro(s) encontrado(s)</Text>
        </View>
        {pendingCount > 0 && (
          <View style={hx.pendingBadge}>
            <Text style={hx.pendingBadgeText}>{pendingCount} pendente{pendingCount > 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>

      {/* Filtros */}
      {occurrences.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={hx.filterRow} style={hx.filterScroll}>
          {allStatuses.map((st) => {
            const active = filterStatus === st;
            const cfg    = st !== 'Todos' ? STATUS_CONFIG[st] : null;
            return (
              <TouchableOpacity
                key={st}
                style={[hx.filterTab, active && { backgroundColor: cfg?.bg ?? C.primaryLight, borderColor: cfg?.color ?? C.primary }]}
                onPress={() => setFilterStatus(st)} activeOpacity={0.75}
              >
                {st !== 'Todos' && cfg && <View style={[hx.filterDot, { backgroundColor: cfg.color }]} />}
                <Text style={[hx.filterText, active && { color: cfg?.color ?? C.primary, fontWeight: '700' }]}>{st}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Info Banner */}
      {occurrences.length > 0 && (
        <View style={hx.infoBanner}>
          <Ionicons name="information-circle-outline" size={14} color={C.primary} />
          <Text style={hx.infoText}>
            Apenas ocorrências <Text style={{ fontWeight: '700' }}>Pendentes</Text> podem ser editadas ou excluídas.
          </Text>
        </View>
      )}

      {/* Lista */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={hx.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          occurrences.length === 0 ? (
            <View style={hx.emptyWrap}>
              <View style={hx.emptyIcon}><Ionicons name="clipboard-outline" size={38} color={C.textMuted} /></View>
              <Text style={hx.emptyTitle}>Nenhuma ocorrência</Text>
              <Text style={hx.emptySub}>Você ainda não registrou nenhuma ocorrência.</Text>
              <TouchableOpacity style={hx.emptyBtn} onPress={onNewOccurrence} activeOpacity={0.85}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={hx.emptyBtnText}>Registrar Ocorrência</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={hx.emptyFilter}>
              <Ionicons name="filter-outline" size={32} color={C.textMuted} />
              <Text style={hx.emptyFilterText}>Nenhuma ocorrência com status "{filterStatus}"</Text>
            </View>
          )
        ) : (
          filtered.map((item) => (
            <OccurrenceCard key={item.id} item={item} onEdit={setEditTarget} onDelete={onDeleteOccurrence} />
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={hx.fab} onPress={onNewOccurrence} activeOpacity={0.85}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <BottomNav active="history" onGoHistory={() => {}} onGoForm={onNewOccurrence} />

      <EditModal
        visible={!!editTarget} occurrence={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(updated) => { onUpdateOccurrence(updated); setEditTarget(null); }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const hx = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: Platform.OS === 'android' ? 42 : 56, paddingBottom: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  headerSub: { fontSize: 12, color: C.textMuted, marginTop: 1 },
  pendingBadge: { backgroundColor: '#FEF3C7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#FDE68A' },
  pendingBadgeText: { fontSize: 11, fontWeight: '700', color: '#B45309' },
  filterScroll: { flexGrow: 0, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterTab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card },
  filterDot: { width: 7, height: 7, borderRadius: 4 },
  filterText: { fontSize: 12, fontWeight: '500', color: C.textSub },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.primary + '20' },
  infoText: { fontSize: 12, color: C.primary, flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  emptyFilter: { alignItems: 'center', paddingTop: 50, gap: 12 },
  emptyFilterText: { fontSize: 14, color: C.textSub, textAlign: 'center' },
  fab: { position: 'absolute', right: 18, bottom: 90, width: 52, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.32, shadowRadius: 12, elevation: 8 },
});

const oc = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  typeIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontSize: 11, fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  placeName: { fontSize: 14, fontWeight: '700', color: C.text, marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: C.textMuted, fontWeight: '500' },
  sevBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  sevDot: { width: 6, height: 6, borderRadius: 3 },
  sevText: { fontSize: 11, fontWeight: '700' },
  description: { fontSize: 13, color: C.textSub, lineHeight: 19, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: C.primary + '50', backgroundColor: C.primaryLight },
  editText: { fontSize: 13, fontWeight: '700', color: C.primary },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: '#FECDD3', backgroundColor: '#FFF1F2' },
  deleteText: { fontSize: 13, fontWeight: '700', color: '#E11D48' },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lockedText: { fontSize: 11, color: C.textMuted, fontStyle: 'italic' },
  confirmBox: { backgroundColor: '#FFF1F2', borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: '#FECDD3' },
  confirmText: { fontSize: 13, fontWeight: '700', color: '#E11D48', marginBottom: 2 },
  confirmSub: { fontSize: 11, color: C.textMuted, marginBottom: 10 },
  confirmActions: { flexDirection: 'row', gap: 8 },
  confirmCancelBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', backgroundColor: C.card },
  confirmCancelText: { fontSize: 13, fontWeight: '600', color: C.textSub },
  confirmDeleteBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#E11D48', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  confirmDeleteText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

const em = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 17, fontWeight: '800', color: C.text },
  closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  infoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 18 },
  infoBadgeText: { fontSize: 12, fontWeight: '700' },
  infoBadgeSep: { color: C.textMuted, marginHorizontal: 2 },
  infoBadgeSub: { fontSize: 12, color: C.textMuted },
  label: { fontSize: 11, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  severityRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  severityPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },
  severityDot: { width: 7, height: 7, borderRadius: 4 },
  severityLabel: { fontSize: 13, color: C.textSub },
  textAreaWrap: { backgroundColor: C.bg, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, padding: 12, marginBottom: 20 },
  textArea: { fontSize: 14, color: C.text, minHeight: 90, lineHeight: 21 },
  charCount: { fontSize: 11, color: C.textMuted, textAlign: 'right', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: C.textSub },
  saveBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
