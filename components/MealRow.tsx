import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { loc, type MenuItem } from '../constants/dummyData';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';
import { MacroStrip } from './MacroStrip';

type Props = {
  meal: MenuItem;
  selected?: boolean;
  onToggle?: (id: string) => void;
};

/** Row-style menu item: thumbnail, name, macro strip and a Select/Added button. */
export function MealRow({ meal, selected, onToggle }: Props) {
  const { locale, strings } = useLocale();

  return (
    <View style={[styles.row, shadows.xs]}>
      <Image source={{ uri: meal.image }} style={styles.image} contentFit="cover" transition={150} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {loc(meal.name, locale)}
        </Text>
        {meal.tags[0] ? (
          <Text style={styles.tag} numberOfLines={1}>
            {loc(meal.tags[0], locale)}
          </Text>
        ) : null}
        <MacroStrip
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
          compact
          style={styles.macros}
        />
      </View>
      <Pressable
        onPress={() => onToggle?.(meal.id)}
        style={({ pressed }) => [
          styles.select,
          selected && styles.selectOn,
          pressed && styles.pressed,
        ]}
        hitSlop={4}
      >
        {selected ? (
          <Ionicons name="checkmark" size={16} color={colors.surface} />
        ) : null}
        <Text style={[styles.selectText, selected && styles.selectTextOn]}>
          {selected ? strings.added : strings.select}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm + 4,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  info: { flex: 1, gap: 3 },
  name: { ...typography.bodyStrong, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  tag: { ...typography.caption, color: colors.primary, fontFamily: fonts.semibold, fontWeight: '600' },
  macros: { marginTop: 4, gap: spacing.sm },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  selectOn: { backgroundColor: colors.primary },
  pressed: { opacity: 0.8 },
  selectText: { ...typography.caption, fontFamily: fonts.bold, fontWeight: '800', color: colors.primary },
  selectTextOn: { color: colors.surface },
});
