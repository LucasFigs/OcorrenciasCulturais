import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar, LinearGradient,
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { CordelBanner, CordelDivider } from '../components/CordelDecoration';
import { colors, spacing } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    if (!email.trim()) e.email = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!senha) e.senha = 'Informe sua senha';
    else if (senha.length < 6) e.senha = 'Mínimo 6 caracteres';
    return e;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); shake(); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <CordelBanner color={colors.accent} />
        <View style={styles.brandArea}>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Text style={styles.ornamentStar}>✦ ✦ ✦</Text>
            <View style={styles.ornamentLine} />
          </View>
          <Text style={styles.appName}>CORDEL</Text>
          <Text style={styles.slug}>conte sua história</Text>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Text style={styles.ornamentStar}>✦ ✦ ✦</Text>
            <View style={styles.ornamentLine} />
          </View>
        </View>
        <CordelBanner color={colors.accent} inverted />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.formCard}>
              <View style={[styles.cc, styles.ccTL]}><Text style={styles.ccChar}>┌</Text></View>
              <View style={[styles.cc, styles.ccTR]}><Text style={styles.ccChar}>┐</Text></View>
              <View style={[styles.cc, styles.ccBL]}><Text style={styles.ccChar}>└</Text></View>
              <View style={[styles.cc, styles.ccBR]}><Text style={styles.ccChar}>┘</Text></View>

              <Text style={styles.formTitle}>Entrar</Text>
              <CordelDivider color={colors.borderLight} />
              <View style={{ height: spacing.md }} />

              <Input label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
              <Input label="Senha" placeholder="••••••••" value={senha} onChangeText={setSenha} secureTextEntry error={errors.senha} />

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              <View style={{ height: spacing.md }} />
              <Button title="Entrar no Cordel" onPress={handleLogin} loading={loading} />
            </View>
          </Animated.View>

          <View style={styles.footer}>
            <CordelDivider color={colors.borderLight} />
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Novo por aqui? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.footerLink}>Criar uma conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primaryDark, paddingBottom: spacing.sm },
  brandArea: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  appName: { fontSize: 54, fontWeight: 'bold', color: colors.textLight, letterSpacing: 12 },
  slug: { fontSize: 16, fontStyle: 'italic', color: colors.borderLight, letterSpacing: 3, marginTop: 4, marginBottom: spacing.md },
  ornamentRow: { flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: spacing.xs },
  ornamentLine: { flex: 1, height: 1, backgroundColor: colors.accent, opacity: 0.6 },
  ornamentStar: { color: colors.accent, fontSize: 12, marginHorizontal: spacing.sm, letterSpacing: 4 },
  formContainer: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  formCard: {
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 2, padding: spacing.lg, paddingTop: spacing.xl,
    shadowColor: '#000', shadowOffset: { width: 3, height: 6 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5, position: 'relative',
  },
  cc: { position: 'absolute', width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  ccTL: { top: -2, left: -2 }, ccTR: { top: -2, right: -2 }, ccBL: { bottom: -2, left: -2 }, ccBR: { bottom: -2, right: -2 },
  ccChar: { fontSize: 18, color: colors.accent, fontWeight: 'bold' },
  formTitle: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center', letterSpacing: 2, marginBottom: spacing.xs },
  forgotButton: { alignSelf: 'flex-end', marginTop: -spacing.xs, marginBottom: spacing.sm },
  forgotText: { fontSize: 13, fontStyle: 'italic', color: colors.accent, textDecorationLine: 'underline' },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.accent, textDecorationLine: 'underline' },
});
