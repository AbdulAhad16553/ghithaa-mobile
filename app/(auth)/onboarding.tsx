import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageToggle } from '../../components/LanguageToggle';
import { MeshBackground } from '../../components/MeshBackground';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';

type Slide = {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string, string];
  en: [string, string];
  ar: [string, string];
};

const SLIDES: Slide[] = [
  {
    icon: 'bicycle',
    gradient: gradients.sunrise,
    en: ['Deliver to your Doorstep', 'Fresh meals delivered right to your door, every single day.'],
    ar: ['التوصيل إلى باب منزلك', 'وجبات طازجة تُوصّل إلى بابك كل يوم.'],
  },
  {
    icon: 'snow',
    gradient: ['#7EC8E3', '#0F6E68', '#07403B'],
    en: ['Freeze Subscription', 'Change your mind? Freeze your subscription anytime and resume when ready.'],
    ar: ['تجميد الاشتراك', 'غيّرت رأيك؟ جمّد اشتراكك في أي وقت واستأنفه عندما تشاء.'],
  },
  {
    icon: 'restaurant',
    gradient: gradients.twilight,
    en: ['Meals Selection', 'Select your meals from a wide variety — no limits, full control.'],
    ar: ['اختيار الوجبات', 'اختر وجباتك من تشكيلة واسعة — بلا حدود وبتحكم كامل.'],
  },
];

export default function Onboarding() {
  const { strings, locale } = useLocale();
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const ref = useRef<ScrollView>(null);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const goToPage = (index: number) => {
    if (index < 0 || index >= SLIDES.length) return;
    setPage(index);
    if (width > 0) {
      ref.current?.scrollTo({ x: index * width, animated: true });
    }
  };

  const syncPageFromOffset = (x: number) => {
    if (!width) return;
    setPage(Math.round(x / width));
  };

  const next = () => {
    if (page < SLIDES.length - 1) {
      goToPage(page + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const isLast = page === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Pressable hitSlop={8} onPress={() => router.replace('/(auth)/city')}>
            <Text style={styles.skip}>{strings.skip}</Text>
          </Pressable>
          <LanguageToggle />
        </View>

        <View style={styles.progress}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.progressSeg, i <= page && styles.progressSegOn]} />
          ))}
        </View>

        <View style={styles.carousel} onLayout={onLayout}>
          {width > 0 ? (
            <ScrollView
              ref={ref}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => syncPageFromOffset(e.nativeEvent.contentOffset.x)}
              onScrollEndDrag={(e) => syncPageFromOffset(e.nativeEvent.contentOffset.x)}
            >
              {SLIDES.map((s, i) => {
                const [title, body] = locale === 'ar' ? s.ar : s.en;
                return (
                  <View key={s.icon} style={[styles.slide, { width }]}>
                    <Text style={styles.slideNum}>0{i + 1}</Text>
                    <View style={styles.iconOuter}>
                      <LinearGradient colors={s.gradient} style={styles.iconRing}>
                        <View style={styles.iconInner}>
                          <Ionicons name={s.icon} size={56} color={colors.primary} />
                        </View>
                      </LinearGradient>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.body}>{body}</Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.bottom}>
          <View>
            <Text style={styles.stepLabel}>
              {locale === 'ar' ? `الخطوة ${page + 1} من ${SLIDES.length}` : `Step ${page + 1} of ${SLIDES.length}`}
            </Text>
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
              ))}
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, isLast && styles.getStartedBtn, pressed && styles.pressed]}
            onPress={next}
            accessibilityRole="button"
            accessibilityLabel={isLast ? strings.getStarted : strings.next}
          >
            <LinearGradient
              colors={SLIDES[page].gradient.slice(0, 2) as [string, string]}
              style={isLast ? styles.getStartedGradient : styles.nextGradient}
            >
              {isLast ? (
                <>
                  <Text style={styles.getStartedText}>{strings.getStarted}</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.surface} />
                </>
              ) : (
                <Ionicons name="arrow-forward" size={24} color={colors.surface} />
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  skip: { ...typography.title, color: colors.textSecondary, fontFamily: fonts.semibold, fontWeight: '600' },
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  progressSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  progressSegOn: { backgroundColor: colors.primary },
  carousel: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  slideNum: {
    fontSize: 13,
    fontFamily: fonts.bold, fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  iconOuter: { marginBottom: spacing.lg },
  iconRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    padding: 4,
    ...shadows.brand,
  },
  iconInner: {
    flex: 1,
    borderRadius: 80,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.displaySm,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 300,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  stepLabel: { ...typography.caption, color: colors.textMuted, fontFamily: fonts.semibold, fontWeight: '600', marginBottom: spacing.sm },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 22, backgroundColor: colors.primary },
  nextBtn: { borderRadius: 32, overflow: 'hidden', ...shadows.brand },
  getStartedBtn: { borderRadius: radius.full },
  nextGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedGradient: {
    minWidth: 180,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    ...typography.title,
    color: colors.surface,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.96 }] },
});
