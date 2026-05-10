import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../constants';

interface LoginScreenProps {
  onLogin:    (email: string, password: string) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched,  setTouched]  = useState<Record<string, boolean>>({});
  const [loading,  setLoading]  = useState(false);

  const emailOk    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordOk = password.length >= 6;
  const isValid    = emailOk && passwordOk;

  function touch(f: string) { setTouched(p => ({ ...p, [f]: true })); }

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onLogin(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={l.root}>

        {/* Fundo decorativo */}
        <View style={l.topBand} />
        <View style={l.topBandAccent} />

        <ScrollView
          contentContainerStyle={l.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Branding */}
          <View style={l.brandWrap}>
            <View style={l.logoCircle}>
              <Ionicons name="book-outline" size={38} color="#fff" />
            </View>
            <Text style={l.appName}>Cordel</Text>
            <Text style={l.appSlug}>Registre sua história</Text>
          </View>

          {/* Card do formulário */}
          <View style={l.card}>
            <Text style={l.cardTitle}>Entrar na conta</Text>
            <Text style={l.cardSub}>Bem-vindo(a) de volta!</Text>

            {/* E-mail */}
            <Text style={l.label}>E-mail <Text style={l.req}>*</Text></Text>
            <View style={[l.inputWrap, touched.email && !emailOk && l.inputErr]}>
              <Ionicons name="mail-outline" size={18} color={C.textMuted} style={l.inputIcon} />
              <TextInput
                style={l.input}
                placeholder="seu@email.com"
                placeholderTextColor={C.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={v => { setEmail(v); touch('email'); }}
                onBlur={() => touch('email')}
              />
            </View>
            {touched.email && !emailOk && (
              <View style={l.errorRow}>
                <Ionicons name="alert-circle" size={13} color="#E11D48" />
                <Text style={l.errorText}>Informe um e-mail válido</Text>
              </View>
            )}

            {/* Senha */}
            <Text style={[l.label, { marginTop: 14 }]}>Senha <Text style={l.req}>*</Text></Text>
            <View style={[l.inputWrap, touched.password && !passwordOk && l.inputErr]}>
              <Ionicons name="lock-closed-outline" size={18} color={C.textMuted} style={l.inputIcon} />
              <TextInput
                style={l.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={C.textMuted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={v => { setPassword(v); touch('password'); }}
                onBlur={() => touch('password')}
              />
              <TouchableOpacity onPress={() => setShowPass(p => !p)} style={l.eyeBtn}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={C.textMuted}
                />
              </TouchableOpacity>
            </View>
            {touched.password && !passwordOk && (
              <View style={l.errorRow}>
                <Ionicons name="alert-circle" size={13} color="#E11D48" />
                <Text style={l.errorText}>A senha deve ter pelo menos 6 caracteres</Text>
              </View>
            )}

            {/* Esqueci senha */}
            <TouchableOpacity style={l.forgotBtn} activeOpacity={0.7}>
              <Text style={l.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão entrar */}
            <TouchableOpacity
              style={[l.submitBtn, (!isValid || loading) && l.submitBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              {loading ? (
                <Text style={l.submitText}>Entrando...</Text>
              ) : (
                <>
                  <Ionicons
                    name="log-in-outline"
                    size={18}
                    color={isValid ? '#fff' : C.textMuted}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[l.submitText, !isValid && { color: C.textMuted }]}>
                    Entrar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Link cadastro */}
          <View style={l.registerRow}>
            <Text style={l.registerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={onRegister} activeOpacity={0.7}>
              <Text style={l.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          <Text style={l.version}>Cordel · v1.0.0</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const l = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  topBand: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 280,
    backgroundColor: C.primary,
    borderBottomLeftRadius: 48, borderBottomRightRadius: 48,
    opacity: 0.07,
  },
  topBandAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 140,
    backgroundColor: C.primary,
    borderBottomLeftRadius: 48, borderBottomRightRadius: 48,
    opacity: 0.05,
  },

  scroll: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 60 : 76,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Branding
  brandWrap:  { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  appName: {
    fontSize: 34, fontWeight: '800', color: C.text,
    letterSpacing: -0.5,
  },
  appSlug: {
    fontSize: 14, color: C.textSub,
    marginTop: 5, fontStyle: 'italic',
  },

  // Card
  card: {
    width: '100%', backgroundColor: C.card,
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 4,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: C.textSub, marginBottom: 24 },

  // Campos
  label:     { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  req:       { color: '#E11D48' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
  },
  inputErr:  { borderColor: '#E11D48' },
  inputIcon: { marginRight: 10 },
  input:     { flex: 1, fontSize: 14, color: C.text, padding: 0 },
  eyeBtn:    { padding: 4 },
  errorRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errorText: { fontSize: 12, color: '#E11D48', fontWeight: '500' },

  forgotBtn:  { alignSelf: 'flex-end', marginTop: 12, marginBottom: 22 },
  forgotText: { fontSize: 13, fontWeight: '600', color: C.primary },

  // Botão
  submitBtn: {
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  submitBtnDisabled: {
    backgroundColor: '#F3F4F6',
    shadowOpacity: 0, elevation: 0,
    borderWidth: 1, borderColor: C.border,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  // Rodapé
  registerRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  registerText: { fontSize: 14, color: C.textSub },
  registerLink: { fontSize: 14, fontWeight: '700', color: C.primary },
  version:      { fontSize: 11, color: C.textMuted },
});
