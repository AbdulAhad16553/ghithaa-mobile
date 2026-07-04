import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatureStrip } from '../../components/FeatureStrip';
import { GlassCard } from '../../components/GlassCard';
import { MealSlotBar } from '../../components/MealSlotBar';
import { MeshBackground } from '../../components/MeshBackground';
import { PlanPill } from '../../components/PlanPill';
import { PromoBanner } from '../../components/PromoBanner';
import { ScrollReveal } from '../../components/ScrollReveal';
import { SectionTitle } from '../../components/SectionTitle';
import { TodayMenuPreview } from '../../components/TodayMenuPreview';
import { WhatsAppFab } from '../../components/WhatsAppFab';
import { Wordmark } from '../../components/Wordmark';
import { PLANS } from '../../constants/content';
import { colors, fonts, gradients, layout, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { getSavedCity } from '../../lib/preferences';

const TRUST_POINTS = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;

export default function HomeScreen() {
  const { strings, locale } = useLocale();
  const { user } = useAuth();
  const name = user?.name ?? strings.guest;
  const [cityLabel, setCityLabel] = useState(locale === 'ar' ? 'جدة' : 'Jeddah');
  const scrollRef = useRef<View>(null);
  const scrollY = useSharedValue(0);
  const { height: windowHeight } = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    getSavedCity().then((city) => {
      if (city) setCityLabel(locale === 'ar' ? city.ar : city.en);
    });
  }, [locale]);

  const firstName = name.split(' ')[0];

  return (
    <View style={styles.root}>
      <MeshBackground variant="warm" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <View ref={scrollRef} collapsable={false}>
            <LinearGradient colors={gradients.hero} style={styles.heroCard}>
              <View style={styles.heroOrb} />
              <View style={styles.heroTop}>
                <Wordmark size={22} variant="onDark" />
                <Pressable style={styles.bell} hitSlop={8} accessibilityLabel="Notifications">
                  <Ionicons name="notifications-outline" size={18} color={colors.surface} />
                  <View style={styles.bellDot} />
                </Pressable>
              </View>

              <View style={styles.heroMeta}>
                <View style={styles.heroMetaText}>
                  <Text style={styles.greeting}>
                    {strings.welcome}, {firstName}
                  </Text>
                  <Text style={styles.heroTagline}>{strings.tagline}</Text>
                </View>
                <Pressable style={styles.locationPill}>
                  <Ionicons name="location" size={11} color={colors.accent} />
                  <Text style={styles.location}>{cityLabel}</Text>
                </Pressable>
              </View>

              <View style={styles.trustRow}>
                {TRUST_POINTS.map((key) => (
                  <View key={key} style={styles.trustChip}>
                    <Text style={styles.trustChipText}>{strings[key]}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            <ScrollReveal scrollY={scrollY} scrollRef={scrollRef} windowHeight={windowHeight} style={styles.section}>
              <PromoBanner percent={15} />
            </ScrollReveal>

            <ScrollReveal
              scrollY={scrollY}
              scrollRef={scrollRef}
              windowHeight={windowHeight}
              delay={40}
              style={styles.section}
            >
              <TodayMenuPreview />
            </ScrollReveal>

            <ScrollReveal
              scrollY={scrollY}
              scrollRef={scrollRef}
              windowHeight={windowHeight}
              delay={60}
              style={styles.section}
            >
              <GlassCard glow={colors.primary} accent={colors.primary}>
                <SectionTitle
                  overline={strings.dayRhythm}
                  title={strings.mealSlotsHeading}
                  actionLabel={strings.menu}
                  onAction={() => router.push('/(tabs)/menu')}
                />
                <MealSlotBar selected="all" onSelect={() => router.push('/(tabs)/menu')} dense centered />
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal
              scrollY={scrollY}
              scrollRef={scrollRef}
              windowHeight={windowHeight}
              delay={80}
              style={styles.section}
            >
              <GlassCard glow={colors.accent} accent={colors.accent}>
                <SectionTitle
                  title={strings.ourPlans}
                  subtitle={strings.healthGoal}
                  style={styles.plansHead}
                />
                <View style={styles.plansStage}>
                  <LinearGradient
                    colors={['rgba(15,110,104,0.08)', 'rgba(232,149,107,0.1)', 'rgba(61,79,124,0.08)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.plansTrack}
                  />
                  <View style={styles.plansRow}>
                    {PLANS.map((p) => (
                      <PlanPill key={p.id} id={p.id} />
                    ))}
                  </View>
                </View>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal
              scrollY={scrollY}
              scrollRef={scrollRef}
              windowHeight={windowHeight}
              delay={100}
              style={styles.section}
            >
              <GlassCard accent={colors.primary}>
                <SectionTitle overline={strings.whyChooseUs} title={strings.aboutUs} />
                <Text style={styles.aboutBlurb} numberOfLines={3}>
                  {strings.about}
                </Text>
                <FeatureStrip />
              </GlassCard>
            </ScrollReveal>
          </View>
        </Animated.ScrollView>

        <WhatsAppFab />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scroll: { paddingBottom: spacing.xxl + 96 },
  heroCard: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.xs,
    marginBottom: layout.sectionGap,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.brand,
  },
  heroOrb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40,
    right: -30,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroMetaText: { flex: 1, gap: 3 },
  greeting: {
    fontSize: 20,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: -0.3,
  },
  heroTagline: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.82)',
    fontFamily: fonts.medium,
    fontWeight: '500',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  location: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.92)',
    fontFamily: fonts.semibold,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: spacing.md,
  },
  trustChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  trustChipText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fonts.semibold,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  bell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  section: { paddingHorizontal: layout.screenPadding, marginBottom: layout.sectionGap },
  aboutBlurb: {
    ...typography.callout,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  plansHead: { marginBottom: spacing.sm },
  plansStage: { position: 'relative', paddingTop: 2 },
  plansTrack: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: 48,
    height: 36,
    borderRadius: 18,
    opacity: 0.9,
  },
  plansRow: { flexDirection: 'row', gap: 6, alignItems: 'stretch' },
});
