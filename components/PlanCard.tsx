import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plan, PlanId } from '../constants/content';
import { getPlanPricing, loc } from '../constants/dummyData';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  plan: Plan;
  selected?: boolean;
  onSelect?: (id: PlanId) => void;
};

export function PlanCard({ plan, selected, onSelect }: Props) {
  const { strings, locale } = useLocale();
  const copy = strings.plans[plan.id];
  const pricing = getPlanPricing(plan.id);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        shadows.sm,
        selected && styles.selected,
        selected && shadows.md,
        pressed && styles.pressed,
      ]}
      onPress={() => onSelect?.(plan.id)}
    >
      <View style={styles.topRow}>
        <View style={[styles.imageWrap, selected && styles.imageWrapSelected]}>
          <Image source={{ uri: plan.image }} style={styles.image} contentFit="contain" />
        </View>
        <View style={styles.headText}>
          <Text style={styles.title}>{copy.title}</Text>
          {pricing ? (
            <Text style={styles.calRange}>{loc(pricing.caloriesRange, locale)}</Text>
          ) : null}
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Ionicons name="checkmark" size={14} color={colors.surface} /> : null}
        </View>
      </View>

      <Text style={styles.desc}>{copy.desc}</Text>

      {pricing ? (
        <View style={styles.footer}>
          <View style={styles.pricingRow}>
            <Text style={styles.price}>{pricing.priceMonthly}</Text>
            <Text style={styles.priceMeta}>
              SAR / {locale === 'ar' ? 'شهر' : 'mo'}
            </Text>
          </View>
          <View style={styles.mealsPill}>
            <Ionicons name="fast-food-outline" size={13} color={colors.primary} />
            <Text style={styles.mealsText}>
              {pricing.mealsPerDay} {locale === 'ar' ? 'وجبات/يوم' : 'meals/day'}
            </Text>
          </View>
        </View>
      ) : null}

      {selected ? (
        <View style={styles.activeStrip}>
          <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          <Text style={styles.activeLabel}>{strings.activePlan}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primaryTint },
  pressed: { transform: [{ scale: 0.99 }] },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  imageWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageWrapSelected: { backgroundColor: colors.primaryLight },
  image: { width: '78%', height: '78%' },
  headText: { flex: 1 },
  title: { ...typography.h3, color: colors.text },
  calRange: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: spacing.md },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  pricingRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  price: { ...typography.h2, color: colors.primary, fontFamily: fonts.bold, fontWeight: '800' },
  priceMeta: { ...typography.caption, color: colors.textSecondary },
  mealsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  mealsText: { ...typography.caption, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
  activeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
  },
  activeLabel: { ...typography.callout, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
});
