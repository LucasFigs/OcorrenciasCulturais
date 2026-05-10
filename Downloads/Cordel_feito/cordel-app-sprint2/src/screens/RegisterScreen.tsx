import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../constants';

interface RegisterScreenProps {
  onRegister: (firstName: string, lastName: string, email: string, password: string) => void;
  onBack:     () => void;
}

export function RegisterScreen({ onRegister, onBack }: RegisterScreenProps) {
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched,     setTouched]     = useState<Record<string, boolean>>({});
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);

  function touch(f: string) { setTouched(p => ({ ...p, [f]: true })); }

  const firstNameOk = firstName.trim().length >= 2;
  const lastNameOk  = lastName.trim().length >= 2;
  const emailOk     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordOk  = password.length >= 6;
  const confirmOk   = confirm === password && confirm.length > 0;
  const isValid     = firstNameOk && lastNameOk && emailOk && passwordOk && confirmOk;

  const handleRegister = async () => {
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    setTimeout(() => onRegister(firstName.trim(), lastName.trim(), email.trim(), password), 1200);
  };

  // ── Tela de sucesso ───────────────────────────────────────────────────
  if (done) {
    return (
      <View style={r.successRoot}>
        <View style={r.successIcon}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </View>
        <Text style={r.successTitle}>Conta criada!</Text>
        <Text style={r.successSub}>
          Bem-vindo(a) ao Cordel,{'\n'}{firstName}! Redirecionando...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={r.root}>
        <View style={r.topBand} />

        {/* Header */}
        <View style={r.header}>
          <TouchableOpacity style={r.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={r.headerTitle}>Criar conta</Text>
          </View>
          <View style={r.headerBadge}>
            <Text style={r.headerBadgeText}>Gratuito</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={r.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Mini branding */}
          <View style={r.miniLogo}>
            <View style={r.miniLogoCircle}>
              <Ionicons name="book-outline" size={22} color="#fff" />
            </View>
            <Text style={r.miniLogoText}>Cordel</Text>
            <Text style={r.miniLogoSlug}>Registre sua história</Text>
          </View>

          <View style={r.card}>
            <Text style={r.cardTitle}>Seus dados</Text>
            <Text style={r.cardSub}>Preencha para criar sua conta gratuitamente.</Text>

            {/* Nome + Sobrenome */}
            <View style={r.row2}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Nome" required icon="person-outline"
                  placeholder="Seu nome" value={firstName}
                  onChangeText={v => { setFirstName(v); touch('name'); }}
                  error={touched.name && !firstNameOk ? 'Mínimo 2 caracteres' : undefined}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Sobrenome" required icon="person-outline"
                  placeholder="Sobrenome" value={lastName}
                  onChangeText={v => { setLastName(v); touch('name'); }}
                  error={touched.name && !lastNameOk ? 'Mínimo 2 caracteres' : undefined}
                />
              </View>
            </View>

            {/* E-mail */}
            <Field
              label="E-mail" required icon="mail-outline"
              placeholder="seu@email.com" value={email}
              keyboardType="email-address" autoCapitalize="none"
              onChangeText={v => { setEmail(v); touch('email'); }}
              error={touched.email && !emailOk ? 'Informe um e-mail válido' : undefined}
            />

            {/* Senha */}
            <Field
              label="Senha" required icon="lock-closed-outline"
              placeholder="Mínimo 6 caracteres" value={password}
              secureTextEntry={!showPass}
              rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
              onRightIcon={() => setShowPass(p => !p)}
              onChangeText={v => { setPassword(v); touch('password'); }}
              error={touched.password && !passwordOk ? 'Mínimo 6 caracteres' : undefined}
            />

            {/* Força da senha */}
            {password.length > 0 && <StrengthMeter password={password} />}

            {/* Confirmar senha */}
            <Field
              label="Confirmar senha" required icon="lock-closed-outline"
              placeholder="Repita a senha" value={confirm}
              secureTextEntry={!showConfirm}
              rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              onRightIcon={() => setShowConfirm(p => !p)}
              onChangeText={v => { setConfirm(v); touch('confirm'); }}
              error={touched.confirm && !confirmOk ? 'As senhas não coincidem' : undefined}
            />

            {/* Aviso geral */}
            {Object.keys(touched).length > 0 && !isValid && (
              <View style={r.warnBanner}>
                <Ionicons name="warning-outline" size={16} color="#92400E" />
                <Text style={r.warnText}>Preencha todos os campos corretamente.</Text>
              </View>
            )}

            {/* Botão */}
            <TouchableOpacity
              style={[r.submitBtn, (!isValid || loading) && r.submitBtnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              {loading ? (
                <Text style={r.submitText}>Criando conta...</Text>
              ) : (
                <>
                  <Ionicons
                    name="person-add-outline" size={18}
                    color={isValid ? '#fff' : C.textMuted}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[r.submitText, !isValid && { color: C.textMuted }]}>
                    Criar Conta
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Link login */}
          <View style={r.loginRow}>
            <Text style={r.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
              <Text style={r.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>

          <Text style={r.version}>Cordel · v1.0.0</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────

interface FieldProps {
  label:           string;
  required?:       boolean;
  icon:            any;
  placeholder:     string;
  value:           string;
  onChangeText:    (v: string) => void;
  error?:          string;
  secureTextEntry?: boolean;
  keyboardType?:   any;
  autoCapitalize?: any;
  rightIcon?:      any;
  onRightIcon?:    () => void;
}

function Field({
  label, required, icon, placeholder, value,
  onChangeText, error, secureTextEntry,
  keyboardType, autoCapitalize, rightIcon, onRightIcon,
}: FieldProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={r.label}>
        {label}{required && <Text style={r.req}> *</Text>}
      </Text>
      <View style={[r.inputWrap, !!error && r.inputErr]}>
        <Ionicons name={icon} size={18} color={C.textMuted} style={r.inputIcon} />
        <TextInput
          style={r.input}
          placeholder={placeholder}
          placeholderTextColor={C.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'words'}
          autoCorrect={false}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIcon} style={{ padding: 4 }}>
            <Ionicons name={rightIcon} size={18} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <View style={r.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#E11D48" />
          <Text style={r.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const checks = [
    { label: 'Mínimo 6 caracteres', ok: password.length >= 6 },
    { label: 'Letra maiúscula',      ok: /[A-Z]/.test(password) },
    { label: 'Número',               ok: /\d/.test(password) },
    { label: 'Caractere especial',   ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score  = checks.filter(c => c.ok).length;
  const colors = ['#E11D48', '#E11D48', '#F59E0B', '#F59E0B', C.success];
  const labels = ['', 'Fraca', 'Fraca', 'Média', 'Forte'];

  return (
    <View style={r.strengthWrap}>
      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[r.strengthBar, { backgroundColor: i < score ? colors[score] : C.border }]}
          />
        ))}
        <Text style={[r.strengthLabel, { color: colors[score] }]}>{labels[score]}</Text>
      </View>
      <View style={{ gap: 4 }}>
        {checks.map(c => (
          <View key={c.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name={c.ok ? 'checkmark-circle' : 'ellipse-outline'}
              size={13}
              color={c.ok ? C.success : C.textMuted}
            />
            <Text style={{ fontSize: 12, color: c.ok ? C.success : C.textMuted }}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────
const r = StyleSheet.create({
  root:    { flex: 1, backgroundColor: C.bg },
  topBand: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 180,
    backgroundColor: C.primary,
    borderBottomLeftRadius: 48, borderBottomRightRadius: 48,
    opacity: 0.07,
  },

  header: {
    paddingTop: Platform.OS === 'android' ? 44 : 58,
    paddingBottom: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backBtn:         { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle:     { fontSize: 17, fontWeight: '700', color: C.text },
  headerBadge:     { backgroundColor: C.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: C.primary },

  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },

  miniLogo:       { alignItems: 'center', marginBottom: 20, marginTop: 4 },
  miniLogoCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  miniLogoText:   { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  miniLogoSlug:   { fontSize: 12, color: C.textSub, fontStyle: 'italic', marginTop: 2 },

  card: {
    backgroundColor: C.card, borderRadius: 24, padding: 22,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 3, marginBottom: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: C.textSub, marginBottom: 20 },

  row2: { flexDirection: 'row', gap: 10 },

  label:     { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  req:       { color: '#E11D48' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 13 : 10 },
  inputErr:  { borderColor: '#E11D48' },
  inputIcon: { marginRight: 8 },
  input:     { flex: 1, fontSize: 14, color: C.text, padding: 0 },
  errorRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  errorText: { fontSize: 12, color: '#E11D48', fontWeight: '500' },

  strengthWrap:  { backgroundColor: C.bg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  strengthBar:   { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '700', marginLeft: 6 },

  warnBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  warnText:   { fontSize: 13, color: '#92400E', fontWeight: '500', flex: 1 },

  submitBtn:         { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  submitBtnDisabled: { backgroundColor: '#F3F4F6', shadowOpacity: 0, elevation: 0, borderWidth: 1, borderColor: C.border },
  submitText:        { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  loginRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  loginText: { fontSize: 14, color: C.textSub },
  loginLink: { fontSize: 14, fontWeight: '700', color: C.primary },

  version: { textAlign: 'center', fontSize: 11, color: C.textMuted },

  successRoot:  { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon:  { width: 92, height: 92, borderRadius: 46, backgroundColor: C.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 6, borderColor: C.successLight, shadowColor: C.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  successTitle: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 12, textAlign: 'center' },
  successSub:   { fontSize: 15, color: C.textSub, textAlign: 'center', lineHeight: 23 },
});
