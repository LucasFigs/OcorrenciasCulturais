import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { OccurrenceRecord } from '../types';
import { OCCURRENCE_TYPES, SEVERITIES, STATUS_CONFIG } from '../constants';
import { oc } from '../styles';

interface OccurrenceCardProps {
  item:     OccurrenceRecord;
  onEdit:   (item: OccurrenceRecord) => void;
  onDelete: (id: string) => void;
}

export function OccurrenceCard({ item, onEdit, onDelete }: OccurrenceCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const typeInfo     = OCCURRENCE_TYPES.find(t => t.id === item.type);
  const severityInfo = SEVERITIES.find(sv => sv.id === item.severity);
  const statusCfg    = STATUS_CONFIG[item.status];
  const isPendente   = item.status === 'Pendente';

  return (
    <View style={oc.card}>
      <View style={oc.cardTop}>
        <View style={[oc.typeIconWrap, { backgroundColor: (typeInfo?.color ?? '#2563EB') + '15' }]}>
          <MaterialCommunityIcons name={typeInfo?.icon as any} size={18} color={typeInfo?.color ?? '#2563EB'} />
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
          <Ionicons name="calendar-outline" size={12} color="#A0AAB4" />
          <Text style={oc.metaText}>{item.dateTime}</Text>
        </View>
        <View style={oc.metaItem}>
          <Ionicons name="document-text-outline" size={12} color="#A0AAB4" />
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
              <Ionicons name="create-outline" size={14} color="#2563EB" />
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
          <Ionicons name="lock-closed-outline" size={12} color="#A0AAB4" />
          <Text style={oc.lockedText}>Não pode ser editada — já está {item.status.toLowerCase()}</Text>
        </View>
      )}
    </View>
  );
}
