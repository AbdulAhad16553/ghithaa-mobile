import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MEAL_SLOTS, type MealSlot } from '../constants/mealSlots';
import { colors, fonts, gradients, layout, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  selected: MealSlot | 'all';
  onSelect: (slot: MealSlot | 'all') => void;
  compact?: boolean;
  dense?: boolean;
  centered?: boolean;
};

const SLOT_LABEL: Record<MealSlot, 'breakfast' | 'lunch' | 'dinner' | 'snacks'> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
};

/** Breakfast → lunch → dinner → snacks selector with Ghithaa slot colors. */
export function MealSlotBar({ selected, onSelect, compact, dense, centered }: Props) {
  const { strings, locale } = useLocale();
  const circle = dense ? 34 : compact ? 40 : 50;
  const iconSize = dense ? 14 : compact ? 15 : 18;

  const rail = (
    <View style={[styles.rail, centered && styles.railCentered]} accessibilityRole="tablist">
      <LinearGradient
        colors={[colors.breakfast, colors.lunch, colors.dinner, colors.snacks]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.railLine, dense && styles.railLineDense, centered && styles.railLineCentered]}
      />
      {MEAL_SLOTS.map((slot) => {
        const on = selected === slot.id;
        const label = strings[SLOT_LABEL[slot.id]];
        return (
          <Pressable
            key={slot.id}
            onPress={() => onSelect(slot.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={label}
            style={({ pressed }) => [styles.node, dense && styles.nodeDense, centered && dense && styles.nodeDenseCentered, pressed && styles.pressed]}
          >
            {on ? (
              <LinearGradient
                colors={slot.gradient}
                style={[styles.nodeCircle, { width: circle, height: circle, borderRadius: circle / 2 }]}
              >
                <Ionicons name={slot.icon} size={iconSize} color={colors.surface} />
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.nodeCircleOff,
                  dense && styles.nodeCircleOffDense,
                  { width: circle, height: circle, borderRadius: circle / 2, borderColor: `${slot.color}40` },
                ]}
              >
                <Ionicons name={slot.icon} size={iconSize} color={slot.color} />
              </View>
            )}
            <Text
              style={[
                styles.nodeLabel,
                dense && styles.nodeLabelDense,
                on && { color: slot.colorDark, fontFamily: fonts.bold, fontWeight: '700' },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {label}
            </Text>
            {!compact && !dense ? (
              <Text style={styles.nodeTime}>{locale === 'ar' ? slot.time.ar : slot.time.en}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact, dense && styles.wrapDense, centered && styles.wrapCentered]}>
      {centered ? (
        <View style={[styles.railScroll, dense && styles.railScrollDense, styles.railScrollCentered]}>{rail}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.railScroll, dense && styles.railScrollDense]}
        >
          {rail}
        </ScrollView>
      )}

      <Pressable
        onPress={() => onSelect('all')}
        accessibilityRole="tab"
        accessibilityState={{ selected: selected === 'all' }}
        style={({ pressed }) => [styles.allChip, dense && styles.allChipDense, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={selected === 'all' ? gradients.brand : ['#FFFFFF', colors.primaryTint]}
          style={[styles.allGradient, dense && styles.allGradientDense]}
        >
          <Ionicons
            name="grid-outline"
            size={dense ? 12 : 14}
            color={selected === 'all' ? colors.surface : colors.primary}
          />
          <Text style={[styles.allText, selected === 'all' && styles.allTextOn]}>
            {strings.allMeals}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  wrapCompact: { gap: spacing.sm },
  wrapDense: { gap: spacing.xs },
  wrapCentered: { alignItems: 'center' },
  railScroll: { paddingHorizontal: spacing.xs },
  railScrollDense: { paddingHorizontal: 0 },
  railScrollCentered: { width: '100%', alignItems: 'center' },
  rail: {
    flexDirection: 'row',
    gap: spacing.sm,
    position: 'relative',
    paddingTop: 2,
    paddingBottom: 2,
  },
  railCentered: { justifyContent: 'space-between', width: '100%' },
  railLine: {
    position: 'absolute',
    top: 24,
    left: 36,
    right: 36,
    height: 3,
    borderRadius: 2,
    opacity: 0.5,
  },
  railLineDense: { top: 17, left: 24, right: 24, height: 2 },
  railLineCentered: { left: '6%', right: '6%' },
  node: { width: 76, alignItems: 'center', gap: 4 },
  nodeDense: { width: 58, gap: 2 },
  nodeDenseCentered: { width: undefined, flex: 1, minWidth: 0, maxWidth: 76 },
  nodeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  nodeCircleOff: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
  },
  nodeCircleOffDense: { borderWidth: 1.5 },
  nodeLabel: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  nodeLabelDense: { fontSize: 9 },
  nodeTime: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  allChip: {
    alignSelf: 'center',
    borderRadius: layout.controlRadius,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  allChipDense: { borderWidth: 1 },
  allGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    minHeight: 42,
  },
  allGradientDense: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    minHeight: 32,
    gap: 4,
  },
  allText: { ...typography.caption, fontFamily: fonts.bold, fontWeight: '700', color: colors.primary },
  allTextOn: { color: colors.surface },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
