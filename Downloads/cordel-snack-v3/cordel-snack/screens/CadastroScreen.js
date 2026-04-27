import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar,
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { CordelBanner, CordelDivider } from '../components/CordelDecoration';
import { colors, spacing } from '../theme/colors';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
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
    if (!nome.trim()) e.nome = 'Informe seu nome';
    else if (nome.trim().length < 3) e.nome = 'Nome muito curto';
    if (!email.trim()) e.email = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!senha) e.senha = 'Crie uma senha';
    else if (senha.length < 6) e.senha = 'Mínimo 6 caracteres';
    if (!confirmSenha) e.confirmSenha = 'Confirme sua senha';
    else if (senha !== confirmSenha) e.confirmSenha = 'As senhas não coincidem';
    return e;
  };

  const handleCadastro = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); shake(); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primaryDark }]}>
        <CordelBanner color={colors.accent} />
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>✦</Text>
          <Text style={styles.successTitle}>Bem-vindo ao Cordel!</Text>
          <Text style={styles.successSubtitle}>Sua história começa agora,{'\n'}{nome}!</Text>
          <View style={styles.successDivider} />
          <Text style={styles.successVerse}>
            "De todo canto do sertão{'\n'}vem vozes com emoção,{'\n'}conte a sua história aqui{'\n'}com rima e com tradição."
          </Text>
          <View style={{ height: spacing.xl }} />
          <Button title="Ir para o Login" onPress={() => navigation.navigate('Login')} style={{ backgroundColor: colors.accent, borderColor: colors.accentLight }} />
        </View>
        <CordelBanner color={colors.accent} inverted />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <CordelBanner color={colors.accent} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.brandArea}>
            <View style={styles.ornamentRow}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentStar}>✦ ✦ ✦</Text>
              <View style={styles.ornamentLine} />
            </View>
            <Text style={styles.appName}>CORDEL</Text>
            <Text style={styles.slug}>nova história</Text>
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

            <Text style={styles.formTitle}>Criar Conta</Text>
            <CordelDivider color={colors.borderLight} />
            <View style={{ height: spacing.md }} />

            <Input label="Nome completo" placeholder="Como prefere ser chamado(a)?" value={nome} onChangeText={setNome} autoCapitalize="words" error={errors.nome} />
            <Input label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
            <Input label="Senha" placeholder="Mínimo 6 caracteres" value={senha} onChangeText={setSenha} secureTextEntry error={errors.senha} />
            <Input
              label="Confirmar senha"
              placeholder="Repita a senha acima"
              value={confirmSenha}
              onChangeText={(v) => {
                setConfirmSenha(v);
                setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
              }}
              secureTextEntry
              error={errors.confirmSenha}
            />

            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com nossos <Text style={styles.termsLink}>Termos de Uso</Text>.
            </Text>

            <View style={{ height: spacing.sm }} />
            <Button title="Criar minha conta" onPress={handleCadastro} loading={loading} />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <CordelDivider color={colors.borderLight} />
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primaryDark, paddingBottom: spacing.sm },
  headerContent: { paddingHorizontal: spacing.lg },
  backText: { paddingVertical: spacing.sm, fontSize: 14, color: colors.borderLight },
  brandArea: { alignItems: 'center', paddingVertical: spacing.md },
  appName: { fontSize: 46, fontWeight: 'bold', color: colors.textLight, letterSpacing: 10 },
  slug: { fontSize: 14, fontStyle: 'italic', color: colors.borderLight, letterSpacing: 3, marginTop: 4, marginBottom: spacing.sm },
  ornamentRow: { flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: spacing.xs },
  ornamentLine: { flex: 1, height: 1, backgroundColor: colors.accent, opacity: 0.6 },
  ornamentStar: { color: colors.accent, fontSize: 11, marginHorizontal: spacing.sm, letterSpacing: 4 },
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
  formTitle: { fontSize: 26, fontWeight: 'bold', color: colors.primary, textAlign: 'center', letterSpacing: 2, marginBottom: spacing.xs },
  termsText: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 18 },
  termsLink: { color: colors.accent, textDecorationLine: 'underline' },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.accent, textDecorationLine: 'underline' },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successIcon: { fontSize: 48, color: colors.accent, marginBottom: spacing.lg },
  successTitle: { fontSize: 32, fontWeight: 'bold', color: colors.textLight, letterSpacing: 2, textAlign: 'center', marginBottom: spacing.md },
  successSubtitle: { fontSize: 18, color: colors.borderLight, textAlign: 'center', lineHeight: 26 },
  successDivider: { width: 60, height: 2, backgroundColor: colors.accent, marginVertical: spacing.xl },
  successVerse: { fontSize: 15, fontStyle: 'italic', color: colors.borderLight, textAlign: 'center', lineHeight: 26, opacity: 0.85 },
});
