import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { OccurrenceRecord, Severity } from '../types';
import { OCCURRENCE_TYPES, SEVERITIES, C } from '../constants';
import { em } from '../styles';

interface EditModalProps {
  visible:    boolean;
  occurrence: OccurrenceRecord | null;
  onClose:    () => void;
  onSave:     (updated: OccurrenceRecord) => void;
}

export function EditModal({ visible, occurrence, onClose, onSave }: EditModalProps) {
  const [description, setDescription] = useState('');
  const [severity,    setSeverity]    = useState<Severity>('baixa');

  React.useEffect(() => {
    if (occurrence) { setDescription(occurrence.description); setSeverity(occurrence.severity); }
  }, [occurrence]);

  if (!occurrence) return null;
  const typeInfo = OCCURRENCE_TYPES.find(t => t.id === occurrence.type);

  const handleSave = () => {
    if (description.trim().length < 10) { Alert.alert('Atenção', 'A descrição deve ter pelo menos 10 caracteres.'); return; }
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
            {SEVERITIES.map(sev => {
              const active = severity === sev.id;
              return (
                <TouchableOpacity key={sev.id} style={[em.severityPill, active && { borderColor: sev.color, backgroundColor: sev.color + '14' }]} onPress={() => setSeverity(sev.id)} activeOpacity={0.75}>
                  {active && <View style={[em.severityDot, { backgroundColor: sev.color }]} />}
                  <Text style={[em.severityLabel, active && { color: sev.color, fontWeight: '700' }]}>{sev.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={em.label}>Descrição</Text>
          <View style={em.textAreaWrap}>
            <TextInput style={em.textArea} value={description} onChangeText={setDescription} multiline maxLength={300} textAlignVertical="top" placeholder="Descreva o ocorrido..." placeholderTextColor={C.textMuted} />
            <Text style={em.charCount}>{description.length}/300</Text>
          </View>
          <View style={em.actions}>
            <TouchableOpacity style={em.cancelBtn} onPress={onClose} activeOpacity={0.75}><Text style={em.cancelText}>Cancelar</Text></TouchableOpacity>
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
