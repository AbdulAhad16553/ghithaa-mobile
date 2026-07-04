import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MealPlanComboCard } from '../../components/MealPlanComboCard';
import { MealSlotBar } from '../../components/MealSlotBar';
import { MeshBackground } from '../../components/MeshBackground';
import { Wordmark } from '../../components/Wordmark';
import { MEALS, PLANS, type PlanId } from '../../constants/content';
import {
  comboMatchesFilter,
  getSlotMeta,
  MEAL_COMBOS,
  type MealSlot,
} from '../../constants/mealSlots';
import { colors, fonts, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';

const PLAN_ICONS: Record<PlanId, keyof typeof Ionicons.glyphMap> = {
  lose_weight: 'scale-outline',
  lifestyle: 'heart-outline',
  gain_muscle: 'barbell-outline',
};

const PLAN_GRADIENTS: Record<PlanId, readonly [string, string]> = {
  lose_weight: ['#1A8A82', '#0F6E68'],
  lifestyle: ['#F5B87A', '#E8956B'],
  gain_muscle: ['#6B7FB8', '#3D4F7C'],
};

const SLOT_LABEL = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
} as const;

export default function PlansScreen() {
  const { strings } = useLocale();
  const params = useLocalSearchParams<{ plan?: string }>();
  const plan = (params.plan as PlanId) ?? 'lifestyle';
  const planMeta = PLANS.find((p) => p.id === plan)!;
  const planTitle = strings.plans[plan].title;
  const planDesc = strings.plans[plan].desc;
  const [slotFilter, setSlotFilter] = useState<MealSlot | 'all'>('all');

  const filtered = useMemo(
    () => MEAL_COMBOS.filter((c) => comboMatchesFilter(c, slotFilter)),
    [slotFilter],
  );

  const filterMeta = slotFilter !== 'all' ? getSlotMeta(slotFilter) : null;

  return (
    <View style={styles.root}>
      <MeshBackground variant="warm" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={18} color={colors.text} />
            </View>
          </Pressable>
          <Text style={styles.topTitle}>{strings.plansLabel}</Text>
          <Wordmark size={18} variant="onLight" />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={PLAN_GRADIENTS[plan]} style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                <Text style={styles.heroOverline}>{strings.dayRhythm}</Text>
                <Text style={styles.heroTitle}>{planTitle}</Text>
                <Text style={styles.heroSub} numberOfLines={2}>
                  {planDesc}
                </Text>
              </View>
              <View style={styles.heroBadge}>
                <Image source={{ uri: planMeta.image }} style={styles.heroFood} contentFit="contain" />
                <View style={styles.heroIcon}>
                  <Ionicons name={PLAN_ICONS[plan]} size={14} color={colors.surface} />
                </View>
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.sectionLabel}>{strings.mealSlotsHeading}</Text>
          <Text style={styles.sectionHint}>{strings.mealSlotsHint}</Text>

          <View style={styles.slotSection}>
            <MealSlotBar selected={slotFilter} onSelect={setSlotFilter} dense centered />
          </View>

          <View style={styles.countRow}>
            <Text style={styles.countText}>
              {filtered.length} {strings.plansAvailable}
            </Text>
            {filterMeta ? (
              <View style={[styles.filterPill, { backgroundColor: filterMeta.colorLight }]}>
                <Ionicons name={filterMeta.icon} size={11} color={filterMeta.color} />
                <Text style={[styles.filterPillText, { color: filterMeta.colorDark }]}>
                  {strings[SLOT_LABEL[slotFilter]]}
                </Text>
              </View>
            ) : (
              <View style={styles.filterPillAll}>
                <Ionicons name="sparkles" size={11} color={colors.primary} />
                <Text style={styles.filterPillAllText}>{strings.filters}</Text>
              </View>
            )}
          </View>

          {filtered.map((c, i) => (
            <MealPlanComboCard
              key={c.id}
              combo={c}
              image={MEALS[i % MEALS.length].image}
              planTitle={planTitle}
              compact
              onPress={() =>
                router.push({
                  pathname: '/subscribe/[plan]',
                  params: { plan, combo: c.id },
                })
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  backBtn: { width: 36, minHeight: 36, justifyContent: 'center' },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { ...typography.callout, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl + 24, gap: spacing.sm },
  heroCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    overflow: 'hidden',
    ...shadows.sm,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heroText: { flex: 1 },
  heroOverline: {
    fontSize: 10,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  heroSub: { fontSize: 11, lineHeight: 15, color: 'rgba(255,255,255,0.85)', marginTop: 3 },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroFood: { position: 'absolute', width: 44, height: 44, opacity: 0.45 },
  heroIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: -4,
    marginBottom: 2,
  },
  slotSection: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  countText: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.semibold, fontWeight: '600' },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  filterPillText: { fontSize: 10, fontFamily: fonts.bold, fontWeight: '700' },
  filterPillAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  filterPillAllText: { fontSize: 10, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
});
