import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaySelector } from '../../components/DaySelector';
import { MealGridCard } from '../../components/MealGridCard';
import { MealSlotBar } from '../../components/MealSlotBar';
import { MeshBackground } from '../../components/MeshBackground';
import { Wordmark } from '../../components/Wordmark';
import { ALL_MEAL_SLOTS, getSlotMeta, type MealSlot } from '../../constants/mealSlots';
import { getMealsForDayAndCategory, getWeekDays } from '../../constants/weeklyMenus';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SLOT_LABEL = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
} as const;

export default function MenuScreen() {
  const { strings, locale } = useLocale();
  const { isMealSelected, getSelectedMealId } = useSubscription();
  const weekDays = useMemo(() => getWeekDays(), []);
  const todayIndex = useMemo(() => {
    const idx = weekDays.findIndex((d) => d.isToday);
    return idx >= 0 ? idx : 0;
  }, [weekDays]);
  const [dayIndex, setDayIndex] = useState(todayIndex);
  const [slot, setSlot] = useState<MealSlot | 'all'>('all');

  const selectedDay = weekDays[dayIndex];
  const sections: MealSlot[] = slot === 'all' ? ALL_MEAL_SLOTS : [slot];

  const daySelectorDays = weekDays.map((d) => ({
    en: d.en,
    ar: d.ar,
    date: d.date,
    done: ALL_MEAL_SLOTS.every((s) => Boolean(getSelectedMealId(d.iso, s))),
  }));

  const totalMealsToday = useMemo(() => {
    return sections.reduce(
      (sum, s) => sum + getMealsForDayAndCategory(selectedDay.key, s).length,
      0,
    );
  }, [sections, selectedDay.key]);

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
          <Text style={styles.topTitle}>{strings.menu}</Text>
          <Wordmark size={15} variant="onLight" background="page" framed />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={gradients.hero} style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                <Text style={styles.hungry}>{strings.lookingHungry}</Text>
                <Text style={styles.hungrySub} numberOfLines={2}>
                  {strings.dailyMenuChanges}
                </Text>
              </View>
              {selectedDay.isToday ? (
                <LinearGradient colors={gradients.sunrise} style={styles.todayBadge}>
                  <Ionicons name="today-outline" size={11} color={colors.surface} />
                  <Text style={styles.todayText}>{strings.today}</Text>
                </LinearGradient>
              ) : null}
            </View>
          </LinearGradient>

          <Text style={styles.weekLabel}>{strings.pickADay}</Text>
          <DaySelector days={daySelectorDays} selected={dayIndex} onSelect={setDayIndex} dense />

          <View style={styles.slotSection}>
            <MealSlotBar selected={slot} onSelect={setSlot} dense centered />
          </View>

          <View style={styles.countRow}>
            <Text style={styles.countText}>
              {totalMealsToday} {strings.mealsAvailable}
            </Text>
            <Text style={styles.dateText}>
              {locale === 'ar'
                ? `${selectedDay.ar} ${selectedDay.date}`
                : `${selectedDay.en} ${selectedDay.date}`}
            </Text>
          </View>

          {sections.map((s) => {
            const meta = getSlotMeta(s);
            const items = getMealsForDayAndCategory(selectedDay.key, s);
            if (!items.length) return null;

            const selectedId = getSelectedMealId(selectedDay.iso, s);

            return (
              <View key={s} style={styles.sectionBlock}>
                <View style={styles.sectionHeader}>
                  <LinearGradient colors={meta.gradient} style={styles.sectionIcon}>
                    <Ionicons name={meta.icon} size={13} color={colors.surface} />
                  </LinearGradient>
                  <View style={styles.sectionText}>
                    <Text style={styles.section}>{strings[SLOT_LABEL[s]]}</Text>
                    <Text style={styles.sectionTime}>
                      {locale === 'ar' ? meta.time.ar : meta.time.en}
                    </Text>
                  </View>
                  {selectedId ? (
                    <View style={[styles.pickedPill, { backgroundColor: meta.colorLight }]}>
                      <Ionicons name="checkmark-circle" size={12} color={meta.color} />
                      <Text style={[styles.pickedText, { color: meta.colorDark }]}>
                        {strings.picked}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.grid}>
                  {items.map((m) => (
                    <View key={m.id} style={styles.cell}>
                      <MealGridCard
                        meal={m}
                        dense
                        accentColor={meta.color}
                        selected={isMealSelected(selectedDay.iso, s, m.id)}
                        onPress={() =>
                          router.push({
                            pathname: '/meal/[id]',
                            params: {
                              id: m.id,
                              date: selectedDay.iso,
                              slot: s,
                            },
                          })
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
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
  hungry: { fontSize: 16, fontFamily: fonts.bold, fontWeight: '800', color: colors.surface, letterSpacing: -0.3 },
  hungrySub: { fontSize: 11, lineHeight: 15, color: 'rgba(255,255,255,0.82)', marginTop: 2 },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  todayText: { fontSize: 10, color: colors.surface, fontFamily: fonts.bold, fontWeight: '800' },
  weekLabel: {
    fontSize: 10,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
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
  dateText: { fontSize: 11, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
  sectionBlock: { marginTop: spacing.xs },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: { flex: 1 },
  section: { fontSize: 14, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  sectionTime: { fontSize: 10, color: colors.textMuted },
  pickedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pickedText: { fontSize: 9, fontFamily: fonts.bold, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  cell: { width: '31.6%' },
});
