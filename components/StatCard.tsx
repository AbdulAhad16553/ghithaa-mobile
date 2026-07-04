import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { loc, type Localized } from '../constants/dummyData';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  label: Localized;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
};

export function StatCard({ label, value, icon, accent = colors.primary }: Props) {
  const { locale } = useLocale();

  return (
    <View style={[styles.card, shadows.sm]}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: `${accent}14` }]}>
          <Ionicons name={icon} size={16} color={accent} />
        </View>
      ) : null}
      <Text style={[styles.value, { color: accent }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {loc(label, locale)}
      </Text>
    </View>
  );
}

export const STAT_LABELS = {
  calories: { en: 'Calories today', ar: 'سعرات اليوم' },
  streak: { en: 'Day streak', ar: 'أيام متتالية' },
  nextMeal: { en: 'Next delivery', ar: 'التوصيل القادم' },
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: { ...typography.h3, fontFamily: fonts.bold, fontWeight: '800', marginBottom: 2 },
  label: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
