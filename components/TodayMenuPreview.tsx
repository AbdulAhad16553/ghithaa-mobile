import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlassCard } from './GlassCard';
import { SectionTitle } from './SectionTitle';
import { loc } from '../constants/dummyData';
import { MEAL_SLOTS } from '../constants/mealSlots';
import { dayKeyFromDate, getMealsForDayAndCategory } from '../constants/weeklyMenus';
import { colors, fonts, gradients, layout, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const ROTATE_MS = 4000;

/** Auto-rotating today's menu carousel — breakfast → lunch → dinner → snacks. */
export function TodayMenuPreview() {
  const { strings, locale } = useLocale();
  const { getSelectedMealId } = useSubscription();
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const dayKey = dayKeyFromDate(today);

  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const dateLabel = today.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const slots = MEAL_SLOTS.map((slot) => {
    const meals = getMealsForDayAndCategory(dayKey, slot.id);
    const selectedId = getSelectedMealId(iso, slot.id);
    const meal = meals.find((m) => m.id === selectedId) ?? meals[0];
    const picked = Boolean(selectedId);
    return { slot, meal, picked };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) {
      setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    }
  };

  useEffect(() => {
    if (!width || slots.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slots.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [width, slots.length]);

  const openTodayMenu = () => {
    router.push({ pathname: '/(tabs)/menu', params: { today: '1' } });
  };

  const openMeal = (mealId: string, slotId: string) => {
    router.push({
      pathname: '/meal/[id]',
      params: { id: mealId, date: iso, slot: slotId },
    });
  };

  return (
    <GlassCard glow={colors.primary} accent={colors.primary} style={styles.card}>
      <SectionTitle
        title={strings.todaysMenu}
        subtitle={dateLabel}
        actionLabel={strings.viewMenu}
        onAction={openTodayMenu}
        style={styles.sectionHead}
      />

      <View style={styles.carouselWrap} onLayout={onLayout}>
        {width > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
          >
            {slots.map(({ slot, meal, picked }) => (
              <Pressable
                key={slot.id}
                onPress={() => openMeal(meal.id, slot.id)}
                style={({ pressed }) => [
                  styles.slide,
                  { width },
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.slideInner, shadows.md]}>
                  <Image
                    source={{ uri: meal.image }}
                    style={styles.heroImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(8,36,33,0.5)', 'rgba(8,36,33,0.92)']}
                    locations={[0.2, 0.55, 1]}
                    style={styles.heroFade}
                  />
                  <LinearGradient
                    colors={[...slot.gradient, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.slotStripe}
                  />

                  <View style={styles.slideContent}>
                    <View style={styles.slotLabelRow}>
                      <LinearGradient colors={slot.gradient} style={styles.slotIcon}>
                        <Ionicons name={slot.icon} size={16} color={colors.surface} />
                      </LinearGradient>
                      <Text style={[styles.slotLabel, { color: slot.color }]}>
                        {strings[slot.id]}
                      </Text>
                      {picked ? (
                        <View style={[styles.pickedPill, { backgroundColor: slot.colorLight }]}>
                          <Ionicons name="checkmark-circle" size={12} color={slot.color} />
                          <Text style={[styles.pickedText, { color: slot.colorDark }]}>
                            {strings.picked}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.mealName} numberOfLines={2}>
                      {loc(meal.name, locale)}
                    </Text>

                    <View style={styles.calRow}>
                      <Ionicons name="flame" size={14} color={colors.accent} />
                      <Text style={styles.calories}>
                        {meal.calories} {strings.calories}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.dots}>
        {slots.map(({ slot }, i) => (
          <Pressable
            key={slot.id}
            onPress={() => {
              setIndex(i);
              scrollRef.current?.scrollTo({ x: i * width, animated: true });
            }}
            style={[
              styles.dot,
              i === index && [styles.dotActive, { backgroundColor: slot.color }],
            ]}
          />
        ))}
      </View>

      <Pressable onPress={openTodayMenu} style={styles.footerLink}>
        <Text style={styles.footerLinkText}>
          {strings.dailyMenuChanges}
        </Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 0 },
  sectionHead: { marginBottom: spacing.sm },
  pressed: { opacity: 0.94 },
  carouselWrap: { marginHorizontal: -spacing.xs },
  placeholder: { height: 168, borderRadius: layout.cardRadius, backgroundColor: colors.surfaceAlt },
  slide: { paddingHorizontal: spacing.xs },
  slideInner: {
    height: 168,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImage: { width: '100%', height: '100%' },
  heroFade: { ...StyleSheet.absoluteFill },
  slotStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  slideContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  slotLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  slotIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    ...typography.overline,
    fontSize: 11,
    letterSpacing: 1,
    flex: 1,
  },
  pickedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pickedText: { ...typography.caption, fontSize: 10, fontFamily: fonts.bold, fontWeight: '700' },
  mealName: {
    fontSize: 17,
    fontFamily: fonts.bold, fontWeight: '700',
    color: colors.surface,
    letterSpacing: -0.3,
    lineHeight: 21,
  },
  calRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  calories: { ...typography.title, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bold, fontWeight: '700' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { width: 22 },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLinkText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontWeight: '500',
    flex: 1,
    lineHeight: 15,
  },
});
