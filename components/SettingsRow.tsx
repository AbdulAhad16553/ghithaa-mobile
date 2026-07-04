import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../constants/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint?: string;
  onPress?: () => void;
  last?: boolean;
};

/** Premium settings list row with rounded icon tile. */
export function SettingsRow({ icon, label, tint = colors.primary, onPress, last }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${tint}12` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.label, tint === colors.error && { color: colors.error }]}>{label}</Text>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
    minHeight: 56,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { opacity: 0.65 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.body, fontFamily: fonts.semibold, fontWeight: '600', color: colors.text, flex: 1 },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
