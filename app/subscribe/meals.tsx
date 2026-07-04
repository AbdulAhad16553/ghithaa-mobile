import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { DaySelector } from '../../components/DaySelector';
import { MealGridCard } from '../../components/MealGridCard';
import { MeshBackground } from '../../components/MeshBackground';
import { Wordmark } from '../../components/Wordmark';
import type { PlanId } from '../../constants/content';
import { MEAL_COMBOS, getSlotMeta, type MealSlot } from '../../constants/mealSlots';
import { getMealsForDayAndCategory, getWeekDays } from '../../constants/weeklyMenus';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import type { MealSelections } from '../../contexts/SubscriptionContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  buildDefaultWeekSelections,
  countPickedMeals,
  OFF_DAYS_MAP,
} from '../../lib/subscriptionPlan';

const SLOT_LABEL = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
} as const;

export default function SubscribeMealsScreen() {
  const { strings, locale } = useLocale();
  const params = useLocalSearchParams<{
    plan?: string;
    combo?: string;
    duration?: string;
    offPreset?: string;
    totalPaid?: string;
  }>();

  const plan = (params.plan as PlanId) ?? 'lose_weight';
  const combo = MEAL_COMBOS.find((c) => c.id === params.combo) ?? MEAL_COMBOS.find((c) => c.id === 'c6')!;
  const duration = (params.duration as 'week' | 'month' | 'quarter') ?? 'week';
  const offPreset = params.offPreset === 'fri' ? 'fri' : 'friSat';
  const totalPaid = Number(params.totalPaid ?? combo.price);
  const offDays = OFF_DAYS_MAP[offPreset];
  const planTitle = strings.plans[plan].title;
  const primaryMeta = getSlotMeta(combo.slots[0]);

  const weekDays = useMemo(() => getWeekDays(), []);
  const [dayIndex, setDayIndex] = useState(() => {
    const firstActive = weekDays.findIndex((d) => !offDays.includes(d.key));
    return firstActive >= 0 ? firstActive : 0;
  });

  const [selections, setSelections] = useState<MealSelections>(() =>
    buildDefaultWeekSelections(weekDays, combo.slots, offDays),
  );
  const [submitting, setSubmitting] = useState(false);
  const { confirmSubscription } = useSubscription();

  const selectedDay = weekDays[dayIndex];
  const isOffDay = offDays.includes(selectedDay.key);
  const { picked, total } = countPickedMeals(weekDays, combo.slots, offDays, selections);
  const allPicked = picked >= total;
  const singleSlot = combo.slots.length === 1;

  const daySelectorDays = weekDays.map((d) => {
    const disabled = offDays.includes(d.key);
    const done =
      !disabled &&
      combo.slots.every((slot) => Boolean(selections[d.iso]?.[slot]));
    return { en: d.en, ar: d.ar, date: d.date, done, disabled };
  });

  const comboTitle =
    combo.id === 'c6'
      ? strings.fullDayPlan
      : combo.id === 'c8'
        ? strings.fullDayPlusSnacks
        : combo.slots.map((s) => strings[SLOT_LABEL[s]]).join(' + ');

  const pickMeal = (slot: MealSlot, mealId: string) => {
    if (isOffDay) return;
    setSelections((prev) => ({
      ...prev,
      [selectedDay.iso]: { ...prev[selectedDay.iso], [slot]: mealId },
    }));
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await confirmSubscription({
      planId: plan,
      comboId: combo.id,
      duration,
      offPreset,
      totalPaid,
      weekSelections: selections,
    });
    setSubmitting(false);
    router.replace('/(tabs)/orders');
  };

  const renderSlotSection = (slot: MealSlot) => {
    const meta = getSlotMeta(slot);
    const meals = getMealsForDayAndCategory(selectedDay.key, slot);
    const selectedId = selections[selectedDay.iso]?.[slot];

    return (
      <View key={slot} style={styles.slotSection}>
        <View style={styles.slotHeader}>
          <LinearGradient colors={meta.gradient} style={styles.slotIcon}>
            <Ionicons name={meta.icon} size={13} color={colors.surface} />
          </LinearGradient>
          <View style={styles.slotText}>
            <Text style={styles.slotTitle}>{strings[SLOT_LABEL[slot]]}</Text>
            <Text style={styles.slotTime}>
              {locale === 'ar' ? meta.time.ar : meta.time.en}
            </Text>
          </View>
          {selectedId ? (
            <View style={[styles.pickedPill, { backgroundColor: meta.colorLight }]}>
              <Ionicons name="checkmark-circle" size={11} color={meta.color} />
              <Text style={[styles.pickedText, { color: meta.colorDark }]}>
                {strings.picked}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={singleSlot ? styles.mealGrid : styles.mealRowWrap}>
          {meals.map((meal) => (
            <View key={meal.id} style={singleSlot ? styles.mealGridCell : styles.mealCell}>
              <MealGridCard
                meal={meal}
                dense
                accentColor={meta.color}
                selected={selectedId === meal.id}
                onPress={() => pickMeal(slot, meal.id)}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <MeshBackground variant="warm" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={18} color={colors.text} />
            </View>
          </Pressable>
          <Text style={styles.topTitle}>{strings.chooseWeeklyMeals}</Text>
          <Wordmark size={18} variant="onLight" />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient colors={primaryMeta.gradient} style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                <Text style={styles.heroOverline}>
                  {comboTitle} · {planTitle}
                </Text>
                <Text style={styles.heroHint} numberOfLines={2}>
                  {strings.weeklyMealsHint}
                </Text>
              </View>
              <LinearGradient
                colors={allPicked ? gradients.brand : gradients.sunrise}
                style={styles.progressBadge}
              >
                <Ionicons name="checkmark-done-outline" size={11} color={colors.surface} />
                <Text style={styles.progressText}>
                  {picked}/{total}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.progressSub}>
              {picked}/{total} {strings.mealsPicked}
            </Text>
          </LinearGradient>

          <Text style={styles.weekLabel}>{strings.pickADay}</Text>
          <DaySelector days={daySelectorDays} selected={dayIndex} onSelect={setDayIndex} dense />

          {isOffDay ? (
            <View style={styles.offBanner}>
              <Ionicons name="moon-outline" size={16} color={colors.accentDark} />
              <Text style={styles.offText}>{strings.offDay}</Text>
            </View>
          ) : (
            combo.slots.map(renderSlotSection)
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{strings.total}</Text>
            <LinearGradient colors={gradients.sunrise} style={styles.totalPill}>
              <Text style={styles.totalNow}>
                {totalPaid} {locale === 'ar' ? 'ر.س' : 'SAR'}
              </Text>
            </LinearGradient>
          </View>
          <Button
            title={submitting ? strings.subscribing : strings.confirmAndSubscribe}
            variant="secondary"
            size="md"
            fullWidth
            icon="checkmark-circle"
            loading={submitting}
            disabled={picked < total}
            onPress={handleConfirm}
          />
        </View>
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
    paddingVertical: 2,
  },
  backBtn: { width: 36, minHeight: 32, justifyContent: 'center' },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    ...typography.caption,
    color: colors.text,
    fontFamily: fonts.bold,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  heroCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heroText: { flex: 1 },
  heroOverline: {
    fontSize: 9,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroHint: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  progressText: { fontSize: 11, color: colors.surface, fontFamily: fonts.bold, fontWeight: '800' },
  progressSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: fonts.semibold,
    fontWeight: '600',
  },
  weekLabel: {
    fontSize: 9,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  offBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
  },
  offText: { fontSize: 13, color: colors.accentDark, fontFamily: fonts.bold, fontWeight: '700' },
  slotSection: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 6,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slotIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: { flex: 1 },
  slotTitle: { fontSize: 13, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  slotTime: { fontSize: 9, color: colors.textMuted },
  pickedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pickedText: { fontSize: 9, fontFamily: fonts.bold, fontWeight: '700' },
  mealRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  mealCell: { width: 108 },
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  mealGridCell: { width: '31.6%' },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    gap: spacing.xs,
    ...shadows.md,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 13, fontFamily: fonts.bold, fontWeight: '800', color: colors.text },
  totalPill: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  totalNow: { fontSize: 14, fontFamily: fonts.bold, fontWeight: '900', color: colors.surface },
});
