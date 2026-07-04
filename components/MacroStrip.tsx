import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fonts, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  compact?: boolean;
  style?: ViewStyle;
};

type Item = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number;
  en: string;
  ar: string;
};

/** Four-macro nutrition strip (calories / protein / carbs / fat), bilingual. */
export function MacroStrip({ calories, protein, carbs = 0, fat = 0, compact, style }: Props) {
  const { locale } = useLocale();
  const items: Item[] = [
    { icon: 'flame-outline', color: colors.macroCalories, value: calories, en: 'cal', ar: 'سعرة' },
    { icon: 'barbell-outline', color: colors.macroProtein, value: protein, en: 'protein', ar: 'بروتين' },
    { icon: 'nutrition-outline', color: colors.macroCarbs, value: carbs, en: 'carbs', ar: 'كارب' },
    { icon: 'water-outline', color: colors.macroFat, value: fat, en: 'fat', ar: 'دهون' },
  ];

  return (
    <View style={[styles.row, style]}>
      {items.map((it) => (
        <View key={it.en} style={styles.item}>
          <Ionicons name={it.icon} size={compact ? 14 : 16} color={it.color} />
          <Text style={[styles.value, compact && styles.valueCompact]}>{it.value}</Text>
          {!compact ? <Text style={styles.label}>{locale === 'ar' ? it.ar : it.en}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', flex: 1, gap: 2 },
  value: { ...typography.callout, fontFamily: fonts.bold, fontWeight: '800', color: colors.text },
  valueCompact: { ...typography.caption, fontFamily: fonts.bold, fontWeight: '700' },
  label: { ...typography.caption, fontSize: 11, color: colors.textMuted },
});
