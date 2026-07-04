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
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { MEALS } from '../constants/content';
import { colors, fonts, gradients, layout, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = { percent?: number };

const ROTATE_MS = 4500;

type PromoSlide = {
  imageIndex: number;
  percent: number;
  eyebrow: { en: string; ar: string };
  headline: { en: string; ar: string };
  sub: { en: string; ar: string };
  stampGradient: readonly string[];
};

const PROMO_SLIDES: PromoSlide[] = [
  {
    imageIndex: 2,
    percent: 15,
    eyebrow: { en: 'Limited offer', ar: 'عرض خاص' },
    headline: { en: 'Start your\nwellness journey', ar: 'ابدأ رحلتك\nالصحية اليوم' },
    sub: { en: 'on your first subscription', ar: 'على أول اشتراك' },
    stampGradient: gradients.sunrise,
  },
  {
    imageIndex: 5,
    percent: 20,
    eyebrow: { en: 'Daily freshness', ar: 'طازج كل يوم' },
    headline: { en: 'Chef-crafted\nmeals delivered', ar: 'وجبات من الطاهي\nتوصل لبابك' },
    sub: { en: 'breakfast, lunch, dinner & snacks', ar: 'فطور وغداء وعشاء ووجبات خفيفة' },
    stampGradient: gradients.brand,
  },
  {
    imageIndex: 8,
    percent: 10,
    eyebrow: { en: 'Member perk', ar: 'ميزة الأعضاء' },
    headline: { en: 'Build your\nhealthy habit', ar: 'ابنِ عادة\nصحية' },
    sub: { en: 'flexible weekly plans', ar: 'خطط أسبوعية مرنة' },
    stampGradient: gradients.twilight,
  },
];

/** Auto-rotating promo carousel with discount stamp and wellness copy. */
export function PromoBanner({ percent: defaultPercent = 15 }: Props) {
  const { locale } = useLocale();
  const slides = PROMO_SLIDES.map((s, i) =>
    i === 0 ? { ...s, percent: defaultPercent } : s,
  );

  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const stampScale = useSharedValue(1);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      if (next !== index) {
        setIndex(next);
        stampScale.value = withSequence(
          withTiming(1.12, { duration: 180, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }),
        );
      }
    }
  };

  useEffect(() => {
    if (!width || slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        stampScale.value = withSequence(
          withTiming(1.12, { duration: 180, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }),
        );
        return next;
      });
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [width, slides.length, stampScale]);

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '12deg' }, { scale: stampScale.value }],
  }));

  const openPlans = () => {
    router.push('/(tabs)/plans');
  };

  const active = slides[index];

  return (
    <View style={[styles.wrap, shadows.accent]} onLayout={onLayout}>
      {width > 0 ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
        >
          {slides.map((slide, i) => (
            <Pressable
              key={i}
              onPress={openPlans}
              style={({ pressed }) => [
                styles.slide,
                { width },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: MEALS[slide.imageIndex].image }}
                  style={styles.image}
                  contentFit="cover"
                  transition={400}
                />
                <LinearGradient
                  colors={['rgba(8,36,33,0.12)', 'rgba(8,36,33,0.55)', 'rgba(8,36,33,0.94)']}
                  locations={[0, 0.45, 1]}
                  style={styles.overlay}
                />
                <LinearGradient
                  colors={[slide.stampGradient[0], slide.stampGradient[1] ?? slide.stampGradient[0], 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.topStripe}
                />

                <Animated.View style={[styles.stamp, stampStyle, shadows.md]}>
                  <LinearGradient
                    colors={slide.stampGradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stampInner}
                  >
                    <Text style={styles.stampNum}>{slide.percent}%</Text>
                    <Text style={styles.stampOff}>{locale === 'ar' ? 'خصم' : 'OFF'}</Text>
                  </LinearGradient>
                </Animated.View>

                <View style={styles.content}>
                  <Text style={styles.eyebrow}>
                    {locale === 'ar' ? slide.eyebrow.ar : slide.eyebrow.en}
                  </Text>
                  <Text style={styles.headline}>
                    {locale === 'ar' ? slide.headline.ar : slide.headline.en}
                  </Text>
                  <Text style={styles.sub}>
                    {locale === 'ar' ? slide.sub.ar : slide.sub.en}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.dots}>
        {slides.map((slide, i) => (
          <Pressable
            key={i}
            onPress={() => {
              setIndex(i);
              scrollRef.current?.scrollTo({ x: i * width, animated: true });
              stampScale.value = withSequence(
                withTiming(1.12, { duration: 180 }),
                withTiming(1, { duration: 260 }),
              );
            }}
            style={[
              styles.dot,
              i === index && [styles.dotActive, { backgroundColor: active.stampGradient[0] }],
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
  },
  slide: {},
  card: {
    height: 168,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    backgroundColor: colors.primaryDarker,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.96, transform: [{ scale: 0.995 }] },
  placeholder: {
    height: 196,
    borderRadius: radius.xxl,
    backgroundColor: colors.primaryDarker,
  },
  image: { ...StyleSheet.absoluteFill },
  overlay: { ...StyleSheet.absoluteFill },
  topStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  stamp: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  stampInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampNum: { fontSize: 22, fontFamily: fonts.bold, fontWeight: '900', color: colors.surface, lineHeight: 24 },
  stampOff: {
    ...typography.overline,
    fontSize: 9,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.2,
  },
  content: {
    position: 'absolute',
    left: spacing.lg,
    right: 100,
    bottom: spacing.lg,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.accent,
    marginBottom: 6,
  },
  headline: {
    fontSize: 19,
    lineHeight: 23,
    fontFamily: fonts.bold, fontWeight: '700',
    color: colors.surface,
    letterSpacing: -0.35,
  },
  sub: { ...typography.callout, color: 'rgba(255,255,255,0.82)', marginTop: 6 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { width: 22 },
});
