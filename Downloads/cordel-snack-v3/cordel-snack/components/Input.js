import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'none', error }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputContainer, focused && styles.focused, error && styles.errorBorder]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    color: colors.textMedium,
    marginBottom: spacing.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  focused: { borderColor: colors.primary },
  errorBorder: { borderColor: colors.error },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.textDark,
  },
  eye: { paddingHorizontal: spacing.md },
  errorText: { fontSize: 12, color: colors.error, marginTop: spacing.xs },
});
