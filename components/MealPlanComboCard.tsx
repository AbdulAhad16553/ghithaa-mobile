import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getSlotMeta, MEAL_SLOTS, type MealCombo } from '../constants/mealSlots';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  combo: MealCombo;
  image: string;
  planTitle: string;
  compact?: boolean;
  onPress?: () => void;
};

const SLOT_LABEL = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
} as const;

/** Subscription bundle card — editorial food hero with slot chips and pricing. */
export function MealPlanComboCard({ combo, image, planTitle, compact, onPress }: Props) {
  const { strings, locale } = useLocale();
  const title =
    combo.id === 'c6'
      ? strings.fullDayPlan
      : combo.id === 'c8'
        ? strings.fullDayPlusSnacks
        : combo.slots.map((s) => strings[SLOT_LABEL[s]]).join(' · ');

  const primarySlot = getSlotMeta(combo.slots[0]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        shadows.sm,
        pressed && styles.pressed,
      ]}
    >
      {combo.popular ? (
        <LinearGradient colors={gradients.sunrise} style={[styles.popularBadge, compact && styles.popularBadgeCompact]}>
          <Ionicons name="star" size={10} color={colors.surface} />
          <Text style={styles.popularText}>{strings.popularChoice}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.accentStripe, { backgroundColor: primarySlot.color }]} />
      )}

      <View style={[styles.hero, compact && styles.heroCompact]}>
        <Image source={{ uri: image }} style={styles.heroImg} contentFit="cover" transition={250} />
        <LinearGradient
          colors={['transparent', 'rgba(8,36,33,0.35)', 'rgba(8,36,33,0.9)']}
          locations={[0, 0.45, 1]}
          style={styles.heroFade}
        />
        <LinearGradient colors={gradients.hero} style={[styles.priceTag, compact && styles.priceTagCompact]}>
          <Text style={[styles.price, compact && styles.priceCompact]}>{combo.price}</Text>
          <Text style={styles.currency}>{locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
        </LinearGradient>
        <View style={[styles.slotRow, compact && styles.slotRowCompact]}>
          {MEAL_SLOTS.map((slot) => {
            const active = combo.slots.includes(slot.id);
            return (
              <View key={slot.id}>
                {active ? (
                  <LinearGradient
                    colors={slot.gradient}
                    style={[styles.slotDot, compact && styles.slotDotCompact]}
                  >
                    <Ionicons name={slot.icon} size={compact ? 11 : 13} color={colors.surface} />
                  </LinearGradient>
                ) : (
                  <View style={[styles.slotDotOff, compact && styles.slotDotCompact]}>
                    <Ionicons name={slot.icon} size={compact ? 11 : 13} color="rgba(255,255,255,0.35)" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.body, compact && styles.bodyCompact]}>
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.planMeta, compact && styles.planMetaCompact]} numberOfLines={1}>
              {planTitle} · {combo.slots.length} {strings.slotsIncluded}
            </Text>
          </View>
          <LinearGradient colors={gradients.brand} style={[styles.cta, compact && styles.ctaCompact]}>
            <Text style={styles.ctaText}>{strings.subscribe}</Text>
            <Ionicons name="arrow-forward" size={compact ? 12 : 14} color={colors.surface} />
          </LinearGradient>
        </View>

        <View style={styles.chips}>
          {combo.slots.map((s) => {
            const meta = getSlotMeta(s);
            return (
              <View key={s} style={[styles.chip, compact && styles.chipCompact, { backgroundColor: meta.colorLight }]}>
                <Ionicons name={meta.icon} size={9} color={meta.color} />
                <Text style={[styles.chipText, { color: meta.colorDark }]}>
                  {strings[SLOT_LABEL[s]]}
                </Text>
              </View>
            );
          })}
          <View style={[styles.perMealPill, compact && styles.perMealPillCompact]}>
            <Text style={styles.perMealLabel}>{strings.perMeal}</Text>
            <Text style={styles.perMeal}>
              {Math.round(combo.price / combo.slots.length)} {locale === 'ar' ? 'ر.س' : 'SAR'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompact: {
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderColor: colors.glassBorder,
  },
  pressed: { opacity: 0.96, transform: [{ scale: 0.985 }] },
  accentStripe: { height: 3, width: '100%' },
  popularBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    ...shadows.sm,
  },
  popularBadgeCompact: {
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: { ...typography.caption, fontSize: 10, fontFamily: fonts.bold, fontWeight: '800', color: colors.surface },
  hero: { height: 168, position: 'relative' },
  heroCompact: { height: 118 },
  heroImg: { width: '100%', height: '100%' },
  heroFade: { ...StyleSheet.absoluteFill },
  priceTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  priceTagCompact: {
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  price: { fontSize: 22, fontFamily: fonts.bold, fontWeight: '900', color: colors.surface, lineHeight: 24 },
  priceCompact: { fontSize: 18, lineHeight: 20 },
  currency: { ...typography.caption, fontSize: 10, color: 'rgba(255,255,255,0.8)', fontFamily: fonts.bold, fontWeight: '700' },
  slotRow: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  slotRowCompact: { bottom: spacing.sm, left: spacing.sm, gap: 6 },
  slotDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  slotDotCompact: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5 },
  slotDotOff: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  body: { padding: spacing.lg, gap: spacing.sm },
  bodyCompact: { padding: spacing.sm + 4, gap: spacing.xs },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleCol: { flex: 1, gap: 2 },
  title: { ...typography.h3, color: colors.text, fontSize: 17 },
  titleCompact: { fontSize: 14, lineHeight: 18 },
  planMeta: { ...typography.caption, color: colors.textSecondary },
  planMetaCompact: { fontSize: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  chipCompact: { paddingHorizontal: 7, paddingVertical: 3 },
  chipText: { ...typography.caption, fontSize: 10, fontFamily: fonts.bold, fontWeight: '800' },
  perMealPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accentLight,
  },
  perMealPillCompact: { paddingHorizontal: 7, paddingVertical: 3 },
  perMealLabel: { ...typography.caption, fontSize: 9, color: colors.textMuted },
  perMeal: { ...typography.caption, fontSize: 10, color: colors.accentDark, fontFamily: fonts.bold, fontWeight: '800' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    minHeight: 36,
    ...shadows.brand,
  },
  ctaCompact: { paddingHorizontal: 12, paddingVertical: 7, minHeight: 32, gap: 4 },
  ctaText: { ...typography.caption, fontSize: 11, color: colors.surface, fontFamily: fonts.bold, fontWeight: '800' },
});
