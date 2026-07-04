import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { MeshBackground } from '../../components/MeshBackground';
import { Wordmark } from '../../components/Wordmark';
import type { PlanId } from '../../constants/content';
import { getSlotMeta, MEAL_COMBOS } from '../../constants/mealSlots';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';

const DAYS = [
  { en: 'Sun', ar: 'الأحد' },
  { en: 'Mon', ar: 'الاثنين' },
  { en: 'Tue', ar: 'الثلاثاء' },
  { en: 'Wed', ar: 'الأربعاء' },
  { en: 'Thu', ar: 'الخميس' },
  { en: 'Fri', ar: 'الجمعة' },
  { en: 'Sat', ar: 'السبت' },
];

const DURATIONS = [
  { key: 'week' as const, en: '1 Week', ar: 'أسبوع', mult: 1 },
  { key: 'month' as const, en: '1 Month', ar: 'شهر', mult: 4 },
  { key: 'quarter' as const, en: '3 Months', ar: '٣ أشهر', mult: 12 },
];

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChange(Math.max(0, value - 1))} style={styles.stepBtn} hitSlop={6}>
        <Ionicons name="remove" size={12} color={colors.primary} />
      </Pressable>
      <Text style={styles.stepVal}>{value}</Text>
      <Pressable onPress={() => onChange(value + 1)} style={styles.stepBtnOn} hitSlop={6}>
        <Ionicons name="add" size={12} color={colors.surface} />
      </Pressable>
    </View>
  );
}

export default function SubscribeScreen() {
  const { strings, locale, rtl } = useLocale();
  const params = useLocalSearchParams<{ plan?: string; combo?: string }>();
  const plan = (params.plan as PlanId) ?? 'lose_weight';
  const planTitle = strings.plans[plan].title;
  const combo = MEAL_COMBOS.find((c) => c.id === params.combo) ?? MEAL_COMBOS.find((c) => c.id === 'c6')!;

  const SLOT_LABEL = {
    breakfast: 'breakfast',
    lunch: 'lunch',
    dinner: 'dinner',
    snacks: 'snacks',
  } as const;

  const comboTitle =
    combo.id === 'c6'
      ? strings.fullDayPlan
      : combo.id === 'c8'
        ? strings.fullDayPlusSnacks
        : combo.slots.map((s) => strings[SLOT_LABEL[s]]).join(' + ');

  const primaryMeta = getSlotMeta(combo.slots[0]);

  const [mainAdd, setMainAdd] = useState(0);
  const [sideAdd, setSideAdd] = useState(0);
  const [offPreset, setOffPreset] = useState<'friSat' | 'fri'>('friSat');
  const [duration, setDuration] = useState<'week' | 'month' | 'quarter'>('week');

  const offDays = offPreset === 'friSat' ? ['Fri', 'Sat'] : ['Fri'];
  const mult = DURATIONS.find((d) => d.key === duration)?.mult ?? 1;

  const total = useMemo(() => {
    const base = combo.price;
    const addons = (mainAdd * 40 + sideAdd * 15) * 5;
    return (base + addons) * mult;
  }, [mainAdd, sideAdd, mult, combo.price]);
  const discounted = Math.round(total * 0.85);

  const startLabel = rtl ? 'يبدأ ٠٥ يوليو' : 'Starts 05 Jul';

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
          <Text style={styles.topTitle}>{strings.subscribe}</Text>
          <Wordmark size={18} variant="onLight" />
        </View>

        <View style={styles.body}>
          <LinearGradient colors={primaryMeta.gradient} style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                <Text style={styles.heroOverline}>{planTitle}</Text>
                <Text style={styles.heroTitle} numberOfLines={1}>
                  {comboTitle}
                </Text>
                <Text style={styles.heroSub}>{startLabel}</Text>
              </View>
              <Pressable hitSlop={6}>
                <LinearGradient colors={gradients.sunrise} style={styles.dateBadge}>
                  <Ionicons name="calendar-outline" size={10} color={colors.surface} />
                  <Text style={styles.dateBadgeText}>{rtl ? 'تغيير' : 'Date'}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{strings.extraAddons}</Text>
            <View style={styles.addonRow}>
              <View style={styles.addonCard}>
                <View style={styles.addonTop}>
                  <Ionicons name="restaurant" size={14} color={colors.primary} />
                  <Text style={styles.addonLabel} numberOfLines={1}>
                    {strings.mainDishLabel}
                  </Text>
                </View>
                <View style={styles.addonBottom}>
                  <Text style={styles.addonPrice}>40 {strings.perDayShort}</Text>
                  <Stepper value={mainAdd} onChange={setMainAdd} />
                </View>
              </View>
              <View style={styles.addonCard}>
                <View style={styles.addonTop}>
                  <Ionicons name="cafe" size={14} color={colors.accent} />
                  <Text style={styles.addonLabel} numberOfLines={1}>
                    {strings.sideItemLabel}
                  </Text>
                </View>
                <View style={styles.addonBottom}>
                  <Text style={styles.addonPrice}>15 {strings.perDayShort}</Text>
                  <Stepper value={sideAdd} onChange={setSideAdd} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{strings.chooseOffDays}</Text>
            <View style={styles.offChips}>
              <Pressable
                onPress={() => setOffPreset('friSat')}
                style={[styles.offChip, offPreset === 'friSat' && styles.offChipOn]}
              >
                <Text style={[styles.offChipText, offPreset === 'friSat' && styles.offChipTextOn]} numberOfLines={1}>
                  {rtl ? 'بدون جمع وسبت' : 'No Fri & Sat'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOffPreset('fri')}
                style={[styles.offChip, offPreset === 'fri' && styles.offChipOn]}
              >
                <Text style={[styles.offChipText, offPreset === 'fri' && styles.offChipTextOn]} numberOfLines={1}>
                  {rtl ? 'بدون جمعة' : 'No Fridays'}
                </Text>
              </Pressable>
            </View>
            <View style={styles.dayRow}>
              {DAYS.map((d) => {
                const off = offDays.includes(d.en);
                return (
                  <View key={d.en} style={[styles.dayCell, off && styles.dayOff]}>
                    <Text style={[styles.dayText, off && styles.dayOffText]}>
                      {(locale === 'ar' ? d.ar : d.en).slice(0, 3)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.sectionCard, styles.durationCard]}>
            <Text style={styles.sectionLabel}>{strings.choosePlanDuration}</Text>
            <View style={styles.durRow}>
              {DURATIONS.map((d) => {
                const on = duration === d.key;
                return (
                  <Pressable
                    key={d.key}
                    onPress={() => setDuration(d.key)}
                    style={[styles.durChip, on && styles.durOn]}
                  >
                    {on ? (
                      <LinearGradient colors={gradients.brand} style={styles.durGradient}>
                        <Text style={[styles.durText, styles.durTextOn]}>
                          {locale === 'ar' ? d.ar : d.en}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.durText}>{locale === 'ar' ? d.ar : d.en}</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{strings.total}</Text>
            <View style={styles.totalPrices}>
              <Text style={styles.totalStruck}>{total}</Text>
              <LinearGradient colors={gradients.sunrise} style={styles.totalPill}>
                <Text style={styles.totalNow}>
                  {discounted} {locale === 'ar' ? 'ر.س' : 'SAR'}
                </Text>
              </LinearGradient>
            </View>
          </View>
          <Button
            title={strings.next}
            variant="secondary"
            size="md"
            fullWidth
            icon="arrow-forward"
            onPress={() => {
              router.push({
                pathname: '/subscribe/meals',
                params: {
                  plan,
                  combo: combo.id,
                  duration,
                  offPreset,
                  totalPaid: String(discounted),
                },
              });
            }}
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
  topTitle: { ...typography.callout, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    gap: 6,
    justifyContent: 'space-evenly',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heroText: { flex: 1 },
  heroOverline: {
    fontSize: 9,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: -0.2,
    marginTop: 1,
  },
  heroSub: { fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dateBadgeText: { fontSize: 9, color: colors.surface, fontFamily: fonts.bold, fontWeight: '800' },
  sectionCard: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  addonRow: { flexDirection: 'row', gap: 6 },
  addonCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    gap: 6,
  },
  addonTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  addonBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addonLabel: { flex: 1, fontSize: 11, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  addonPrice: { fontSize: 9, color: colors.accentDark, fontFamily: fonts.bold, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stepBtnOn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepVal: { fontSize: 13, fontFamily: fonts.bold, fontWeight: '800', color: colors.text, minWidth: 14, textAlign: 'center' },
  offChips: { flexDirection: 'row', gap: 6 },
  offChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  offChipOn: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  offChipText: { fontSize: 10, color: colors.textSecondary, fontFamily: fonts.bold, fontWeight: '700' },
  offChipTextOn: { color: colors.accentDark },
  dayRow: { flexDirection: 'row', gap: 3 },
  dayCell: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayOff: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  dayText: { fontSize: 9, color: colors.textSecondary, fontFamily: fonts.semibold, fontWeight: '600' },
  dayOffText: { color: colors.accentDark, fontFamily: fonts.bold, fontWeight: '700' },
  durationCard: {
    paddingVertical: 7,
    gap: 4,
  },
  durRow: { flexDirection: 'row', gap: 5 },
  durChip: {
    flex: 1,
    minWidth: 0,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durOn: { borderWidth: 0, paddingVertical: 0, paddingHorizontal: 0 },
  durGradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  durText: { fontSize: 10, lineHeight: 12, color: colors.textSecondary, fontFamily: fonts.bold, fontWeight: '700', textAlign: 'center' },
  durTextOn: { color: colors.surface },
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
  totalPrices: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  totalStruck: { fontSize: 12, color: colors.textMuted, textDecorationLine: 'line-through' },
  totalPill: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  totalNow: { fontSize: 14, fontFamily: fonts.bold, fontWeight: '900', color: colors.surface },
});
