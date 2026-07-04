import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../lib/i18n';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const toggle = () => {
    const next: Locale = locale === 'en' ? 'ar' : 'en';
    void setLocale(next);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={toggle}
      hitSlop={8}
    >
      <Ionicons name="globe-outline" size={15} color={colors.primary} />
      <Text style={styles.text}>{locale === 'en' ? 'عربي' : 'EN'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  pressed: { opacity: 0.7 },
  text: { ...typography.callout, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
});
