import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

export type Day = {
  en: string;
  ar: string;
  date: number;
  done?: boolean;
  disabled?: boolean;
};

type Props = {
  days: Day[];
  selected: number;
  onSelect: (index: number) => void;
  dense?: boolean;
};

/** Jewel-tone week picker with gradient active state and completion gems. */
export function DaySelector({ days, selected, onSelect, dense }: Props) {
  const { locale } = useLocale();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, dense && styles.rowDense]}
    >
      {days.map((d, i) => {
        const active = i === selected;
        const disabled = d.disabled;
        return (
          <Pressable
            key={`${d.en}-${d.date}`}
            onPress={() => !disabled && onSelect(i)}
            disabled={disabled}
            style={({ pressed }) => [pressed && !disabled && styles.pressed]}
          >
            {active && !disabled ? (
              <LinearGradient
                colors={['#0F6E68', '#07403B']}
                style={[styles.chip, dense && styles.chipDense, styles.chipActive, shadows.glow(colors.primary)]}
              >
                <Text style={[styles.name, dense && styles.nameDense, styles.nameActive]} numberOfLines={1}>
                  {locale === 'ar' ? d.ar : d.en}
                </Text>
                <Text style={[styles.date, dense && styles.dateDense, styles.dateActive]}>{d.date}</Text>
                {d.done ? (
                  <Ionicons name="checkmark-circle" size={dense ? 11 : 14} color={colors.accent} />
                ) : (
                  <View style={[styles.dotPlaceholder, dense && styles.dotPlaceholderDense]} />
                )}
              </LinearGradient>
            ) : (
              <View style={[styles.chip, dense && styles.chipDense, disabled && styles.chipDisabled]}>
                <Text style={[styles.name, dense && styles.nameDense, disabled && styles.nameDisabled]} numberOfLines={1}>
                  {locale === 'ar' ? d.ar : d.en}
                </Text>
                <Text style={[styles.date, dense && styles.dateDense, disabled && styles.nameDisabled]}>{d.date}</Text>
                {disabled ? (
                  <Text style={styles.offMark}>—</Text>
                ) : d.done ? (
                  <Ionicons name="checkmark-circle" size={dense ? 11 : 14} color={colors.primary} />
                ) : (
                  <View style={[styles.dotPlaceholder, dense && styles.dotPlaceholderDense]} />
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  rowDense: { gap: 6, paddingVertical: 0 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  chip: {
    width: 68,
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 76,
  },
  chipDense: {
    width: 50,
    minHeight: 56,
    paddingVertical: 5,
    borderRadius: radius.md,
    gap: 1,
  },
  chipActive: { borderColor: 'transparent' },
  name: { ...typography.caption, fontSize: 11, color: colors.textSecondary, fontFamily: fonts.bold, fontWeight: '700' },
  nameDense: { fontSize: 9 },
  nameActive: { color: 'rgba(255,255,255,0.85)' },
  date: { ...typography.title, fontSize: 16, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  dateDense: { fontSize: 13 },
  dateActive: { color: colors.surface },
  dotPlaceholder: { height: 14 },
  dotPlaceholderDense: { height: 11 },
  chipDisabled: { backgroundColor: colors.surfaceAlt, borderColor: colors.border, opacity: 0.65 },
  nameDisabled: { color: colors.textMuted },
  offMark: { ...typography.caption, fontSize: 11, color: colors.textMuted },
});
