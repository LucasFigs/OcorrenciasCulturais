import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar,
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { CordelBanner, CordelDivider } from '../components/CordelDecoration';
import { colors, spacing, borderRadius } from '../theme/colors';

// occurrenceService deve expor: salvarOcorrencia(dados) -> grava no Firestore
// (collection "ocorrencias", status "pendente"). Caso ainda não exista, basta
// criar o arquivo em ../services/occurrenceService.js
import { occurrenceService } from '../services/occurrenceService';

const TIPOS = [
  { id: 'estrutura',     label: 'Estrutura',     icon: '🏛' },
  { id: 'atendimento',   label: 'Atendimento',   icon: '🤝' },
  { id: 'acessibilidade',label: 'Acessibilidade',icon: '♿' },
  { id: 'limpeza',       label: 'Limpeza',       icon: '🧹' },
];

// Data atual formatada em pt-BR (dd/mm/aaaa)
const formatarData = (d) => {
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export default function RegistroScreen({ navigation }) {
  const dataAtual = useMemo(() => new Date(), []);
  const dataFormatada = useMemo(() => formatarData(dataAtual), [dataAtual]);

  const [tipo, setTipo] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const e = {};
    if (!tipo) e.tipo = 'Selecione o tipo da ocorrência';
    if (!descricao.trim()) e.descricao = 'Descreva a ocorrência';
    else if (descricao.trim().length < 10) e.descricao = 'Detalhe um pouco mais (mín. 10 caracteres)';
    if (!local.trim()) e.local = 'Informe o local';
    return e;
  };

  const handleEnviar = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); shake(); return; }
    setErrors({});
    setLoading(true);

    try {
      await occurrenceService.salvarOcorrencia({
        tipo,
        descricao: descricao.trim(),
        local: local.trim(),
        data: dataAtual.toISOString(),
        status: 'pendente',
        criadoEm: dataAtual.toISOString(),
      });
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setErrors({ geral: 'Não foi possível enviar. Tente novamente.' });
      shake();
    }
  };

  const limparFormulario = () => {
    setTipo(null);
    setDescricao('');
    setLocal('');
    setErrors({});
    setSuccess(false);
  };

  // ---------- Tela de confirmação visual ----------
  if (success) {
    const tipoSelecionado = TIPOS.find(t => t.id === tipo);
    return (
      <View style={[styles.container, { backgroundColor: colors.primaryDark }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <CordelBanner color={colors.accent} />
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>✦</Text>
          <Text style={styles.successTitle}>Ocorrência Registrada!</Text>
          <Text style={styles.successSubtitle}>
            Seu registro foi enviado{'\n'}e está aguardando análise.
          </Text>

          <View style={styles.successDivider} />

          <View style={styles.successCard}>
            <Text style={styles.successCardLabel}>Protocolo</Text>
            <Text style={styles.successCardValue}>
              {tipoSelecionado?.icon} {tipoSelecionado?.label}
            </Text>
            <Text style={styles.successCardMeta}>
              {dataFormatada} • status: pendente
            </Text>
          </View>

          <Text style={styles.successVerse}>
            "Quem registra com cuidado,{'\n'}ajuda a melhorar o lugar,{'\n'}sua voz foi escutada,{'\n'}logo iremos averiguar."
          </Text>

          <View style={{ height: spacing.xl }} />
          <Button
            title="Registrar outra"
            onPress={limparFormulario}
            style={{ backgroundColor: colors.accent, borderColor: colors.accentLight }}
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title="Voltar"
            variant="outline"
            onPress={() => navigation?.goBack?.()}
            style={{ borderColor: colors.borderLight }}
          />
        </View>
        <CordelBanner color={colors.accent} inverted />
      </View>
    );
  }

  // ---------- Formulário ----------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <CordelBanner color={colors.accent} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.brandArea}>
            <View style={styles.ornamentRow}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentStar}>✦ ✦ ✦</Text>
              <View style={styles.ornamentLine} />
            </View>
            <Text style={styles.appName}>REGISTRO</Text>
            <Text style={styles.slug}>nova ocorrência</Text>
            <View style={styles.ornamentRow}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentStar}>✦ ✦ ✦</Text>
              <View style={styles.ornamentLine} />
            </View>
          </View>
        </View>
        <CordelBanner color={colors.accent} inverted />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.formCard}>
            <View style={[styles.cc, styles.ccTL]}><Text style={styles.ccChar}>┌</Text></View>
            <View style={[styles.cc, styles.ccTR]}><Text style={styles.ccChar}>┐</Text></View>
            <View style={[styles.cc, styles.ccBL]}><Text style={styles.ccChar}>└</Text></View>
            <View style={[styles.cc, styles.ccBR]}><Text style={styles.ccChar}>┘</Text></View>

            <Text style={styles.formTitle}>Registrar Ocorrência</Text>
            <CordelDivider color={colors.borderLight} />
            <View style={{ height: spacing.md }} />

            {/* Seletor de tipo */}
            <Text style={styles.label}>Tipo da ocorrência</Text>
            <View style={styles.tiposGrid}>
              {TIPOS.map((t) => {
                const ativo = tipo === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    activeOpacity={0.8}
                    onPress={() => { setTipo(t.id); if (errors.tipo) setErrors({ ...errors, tipo: undefined }); }}
                    style={[styles.tipoChip, ativo && styles.tipoChipAtivo]}
                  >
                    <Text style={[styles.tipoIcon, ativo && styles.tipoIconAtivo]}>{t.icon}</Text>
                    <Text style={[styles.tipoLabel, ativo && styles.tipoLabelAtivo]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.tipo ? <Text style={styles.errorText}>{errors.tipo}</Text> : null}

            <View style={{ height: spacing.md }} />

            {/* Descrição */}
            <Text style={styles.label}>Descrição</Text>
            <View style={[styles.textAreaWrap, errors.descricao && styles.errorBorder]}>
              <Input
                placeholder="Conte com detalhes o que aconteceu..."
                value={descricao}
                onChangeText={(v) => {
                  setDescricao(v);
                  if (errors.descricao) setErrors({ ...errors, descricao: undefined });
                }}
                autoCapitalize="sentences"
              />
            </View>
            {errors.descricao ? <Text style={styles.errorText}>{errors.descricao}</Text> : null}

            {/* Local */}
            <Input
              label="Local"
              placeholder="Ex: Praça do Mercado, sala 02..."
              value={local}
              onChangeText={(v) => {
                setLocal(v);
                if (errors.local) setErrors({ ...errors, local: undefined });
              }}
              autoCapitalize="sentences"
              error={errors.local}
            />

            {/* Data (auto-preenchida) */}
            <Text style={styles.label}>Data</Text>
            <View style={styles.dataReadonly}>
              <Text style={styles.dataIcon}>📅</Text>
              <Text style={styles.dataValue}>{dataFormatada}</Text>
              <Text style={styles.dataHint}>preenchida automaticamente</Text>
            </View>

            {errors.geral ? (
              <View style={styles.geralErrorBox}>
                <Text style={styles.geralErrorText}>{errors.geral}</Text>
              </View>
            ) : null}

            <View style={{ height: spacing.md }} />
            <Button title="Confirmar registro" onPress={handleEnviar} loading={loading} />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <CordelDivider color={colors.borderLight} />
          <Text style={styles.footerHint}>
            Sua ocorrência será enviada com status{' '}
            <Text style={styles.footerHintStrong}>pendente</Text> para análise.
          </Text>
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header (mesmo padrão do CadastroScreen)
  header: { backgroundColor: colors.primaryDark, paddingBottom: spacing.sm },
  headerContent: { paddingHorizontal: spacing.lg },
  backText: { paddingVertical: spacing.sm, fontSize: 14, color: colors.borderLight },
  brandArea: { alignItems: 'center', paddingVertical: spacing.md },
  appName: { fontSize: 38, fontWeight: 'bold', color: colors.textLight, letterSpacing: 8 },
  slug: { fontSize: 14, fontStyle: 'italic', color: colors.borderLight, letterSpacing: 3, marginTop: 4, marginBottom: spacing.sm },
  ornamentRow: { flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: spacing.xs },
  ornamentLine: { flex: 1, height: 1, backgroundColor: colors.accent, opacity: 0.6 },
  ornamentStar: { color: colors.accent, fontSize: 11, marginHorizontal: spacing.sm, letterSpacing: 4 },

  // Card do formulário (mesmo padrão)
  formContainer: { padding: spacing.lg, paddingTop: spacing.xl },
  formCard: {
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 2, padding: spacing.lg, paddingTop: spacing.xl,
    shadowColor: '#000', shadowOffset: { width: 3, height: 6 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5, position: 'relative',
  },
  cc: { position: 'absolute', width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  ccTL: { top: -2, left: -2 }, ccTR: { top: -2, right: -2 },
  ccBL: { bottom: -2, left: -2 }, ccBR: { bottom: -2, right: -2 },
  ccChar: { fontSize: 18, color: colors.accent, fontWeight: 'bold' },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: colors.primary, textAlign: 'center', letterSpacing: 2, marginBottom: spacing.xs },

  // Labels (mesmo estilo do componente Input)
  label: {
    fontSize: 13,
    color: colors.textMedium,
    marginBottom: spacing.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Seletor de tipo (chips)
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  tipoChip: {
    width: '50%',
    paddingHorizontal: spacing.xs / 2,
    marginBottom: spacing.sm,
  },
  tipoChipAtivo: {},
  tipoIcon: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 2,
    opacity: 0.6,
  },
  tipoIconAtivo: { opacity: 1 },
  tipoLabel: {
    fontSize: 13,
    textAlign: 'center',
    color: colors.textMedium,
    fontWeight: '500',
    letterSpacing: 0.5,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  tipoLabelAtivo: {
    color: colors.textLight,
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    fontWeight: '700',
  },

  // Wrapper para textarea (não há Input multiline no projeto, então mantemos coerência visual)
  textAreaWrap: {},
  errorBorder: { borderColor: colors.error },
  errorText: { fontSize: 12, color: colors.error, marginTop: -spacing.sm, marginBottom: spacing.sm },

  // Data readonly
  dataReadonly: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  dataIcon: { fontSize: 16, marginRight: spacing.sm },
  dataValue: { fontSize: 15, fontWeight: '700', color: colors.textDark, letterSpacing: 1 },
  dataHint: { fontSize: 11, fontStyle: 'italic', color: colors.textMuted, marginLeft: spacing.sm, flex: 1, textAlign: 'right' },

  // Erro geral
  geralErrorBox: {
    backgroundColor: '#F9E2DC',
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  geralErrorText: { color: colors.error, fontSize: 13 },

  // Footer
  footer: { marginTop: spacing.xl, alignItems: 'center', paddingHorizontal: spacing.md },
  footerHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 19 },
  footerHintStrong: { color: colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

  // Tela de sucesso (mesmo padrão do CadastroScreen)
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successIcon: { fontSize: 48, color: colors.accent, marginBottom: spacing.lg },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textLight, letterSpacing: 2, textAlign: 'center', marginBottom: spacing.md },
  successSubtitle: { fontSize: 16, color: colors.borderLight, textAlign: 'center', lineHeight: 24 },
  successDivider: { width: 60, height: 2, backgroundColor: colors.accent, marginVertical: spacing.lg },
  successCard: {
    backgroundColor: 'rgba(245, 237, 214, 0.08)',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successCardLabel: { fontSize: 11, color: colors.borderLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  successCardValue: { fontSize: 18, color: colors.textLight, fontWeight: '700', letterSpacing: 1 },
  successCardMeta: { fontSize: 12, color: colors.borderLight, marginTop: 6, fontStyle: 'italic' },
  successVerse: { fontSize: 14, fontStyle: 'italic', color: colors.borderLight, textAlign: 'center', lineHeight: 24, opacity: 0.85 },
});