import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OccurrenceRecord } from '../types';
import { STATUS_CONFIG, C } from '../constants';
import { hx } from '../styles';
import { OccurrenceCard } from '../components/OccurrenceCard';
import { EditModal }      from '../components/EditModal';

interface HistoryScreenProps {
  occurrences:        OccurrenceRecord[];
  onNewOccurrence:    () => void;
  onUpdateOccurrence: (u: OccurrenceRecord) => void;
  onDeleteOccurrence: (id: string) => void;
  onRefresh?:         () => Promise<void>;
}

export function HistoryScreen({
  occurrences,
  onNewOccurrence,
  onUpdateOccurrence,
  onDeleteOccurrence,
  onRefresh,
}: HistoryScreenProps) {
  const [editTarget,    setEditTarget]    = useState<OccurrenceRecord | null>(null);
  const [filterStatus,  setFilterStatus]  = useState<OccurrenceRecord['status'] | 'Todos'>('Todos');
  const [refreshing,    setRefreshing]    = useState(false);

  const allStatuses: (OccurrenceRecord['status'] | 'Todos')[] = [
    'Todos', 'Pendente', 'Em análise', 'Em andamento', 'Resolvido',
  ];

  const filtered = filterStatus === 'Todos'
    ? occurrences
    : occurrences.filter(o => o.status === filterStatus);

  const pendingCount = occurrences.filter(o => o.status === 'Pendente').length;

  // ── Pull to refresh (#25) ────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    else await new Promise(r => setTimeout(r, 800)); // simula latência
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <View style={hx.root}>

      {/* Header */}
      <View style={hx.header}>
        <View style={{ flex: 1 }}>
          <Text style={hx.headerTitle}>Minhas Ocorrências</Text>
          <Text style={hx.headerSub}>{occurrences.length} registro(s)</Text>
        </View>
        {pendingCount > 0 && (
          <View style={hx.pendingBadge}>
            <Text style={hx.pendingBadgeText}>
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Filtros por status */}
      {occurrences.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={hx.filterRow}
          style={hx.filterScroll}
        >
          {allStatuses.map(st => {
            const active = filterStatus === st;
            const cfg    = st !== 'Todos' ? STATUS_CONFIG[st] : null;
            return (
              <TouchableOpacity
                key={st}
                style={[
                  hx.filterTab,
                  active && { backgroundColor: cfg?.bg ?? C.primaryLight, borderColor: cfg?.color ?? C.primary },
                ]}
                onPress={() => setFilterStatus(st)}
                activeOpacity={0.75}
              >
                {st !== 'Todos' && cfg && (
                  <View style={[hx.filterDot, { backgroundColor: cfg.color }]} />
                )}
                <Text style={[
                  hx.filterText,
                  active && { color: cfg?.color ?? C.primary, fontWeight: '700' },
                ]}>
                  {st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Banner informativo */}
      {occurrences.length > 0 && (
        <View style={hx.infoBanner}>
          <Ionicons name="information-circle-outline" size={14} color={C.primary} />
          <Text style={hx.infoText}>
            Apenas ocorrências <Text style={{ fontWeight: '700' }}>Pendentes</Text> podem ser editadas ou excluídas.
          </Text>
        </View>
      )}

      {/* Lista com pull-to-refresh */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={hx.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[C.primary]}
            tintColor={C.primary}
          />
        }
      >
        {filtered.length === 0 ? (
          occurrences.length === 0 ? (
            /* Estado vazio total */
            <View style={hx.emptyWrap}>
              <View style={hx.emptyIcon}>
                <Ionicons name="clipboard-outline" size={38} color={C.textMuted} />
              </View>
              <Text style={hx.emptyTitle}>Nenhuma ocorrência</Text>
              <Text style={hx.emptySub}>
                Você ainda não registrou nenhuma ocorrência.{'\n'}
                Puxe para baixo para atualizar.
              </Text>
              <TouchableOpacity style={hx.emptyBtn} onPress={onNewOccurrence} activeOpacity={0.85}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={hx.emptyBtnText}>Registrar Ocorrência</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Filtro sem resultado */
            <View style={hx.emptyFilter}>
              <Ionicons name="filter-outline" size={32} color={C.textMuted} />
              <Text style={hx.emptyFilterText}>
                Nenhuma ocorrência com status "{filterStatus}"
              </Text>
            </View>
          )
        ) : (
          filtered.map(item => (
            <OccurrenceCard
              key={item.id}
              item={item}
              onEdit={setEditTarget}
              onDelete={onDeleteOccurrence}  // #24 — excluir pendente
            />
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FAB — nova ocorrência */}
      <TouchableOpacity style={hx.fab} onPress={onNewOccurrence} activeOpacity={0.85}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Modal de edição */}
      <EditModal
        visible={!!editTarget}
        occurrence={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={updated => {
          onUpdateOccurrence(updated);
          setEditTarget(null);
        }}
      />
    </View>
  );
}
