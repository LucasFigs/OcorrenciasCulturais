import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function CordelBanner({ color = colors.accent, inverted = false }) {
  const triangles = Array.from({ length: 20 });
  return (
    <View style={styles.bannerRow}>
      {triangles.map((_, i) => (
        <View
          key={i}
          style={[
            styles.triangle,
            {
              borderTopColor: inverted ? 'transparent' : color,
              borderBottomColor: inverted ? color : 'transparent',
              borderTopWidth: inverted ? 0 : 10,
              borderBottomWidth: inverted ? 10 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function CordelDivider({ color = colors.border }) {
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
      <Text style={[styles.dividerStar, { color }]}>✦</Text>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginHorizontal: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerStar: { fontSize: 12, marginHorizontal: 10 },
});
