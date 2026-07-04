import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PLANS, type PlanId } from '../constants/content';
import { colors, fonts, radius, shadows, spacing } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

const ICONS: Record<PlanId, keyof typeof Ionicons.glyphMap> = {
  lose_weight: 'scale-outline',
  lifestyle: 'heart-outline',
  gain_muscle: 'barbell-outline',
};

const THEMES: Record<
  PlanId,
  {
    gradient: readonly [string, string, string];
    glow: string;
    ring: string;
    badge: readonly [string, string];
  }
> = {
  lose_weight: {
    gradient: ['#2BB5A8', '#0F6E68', '#07403B'],
    glow: 'rgba(43, 181, 168, 0.35)',
    ring: 'rgba(255,255,255,0.42)',
    badge: ['#E8FFFB', '#B8EDE6'],
  },
  lifestyle: {
    gradient: ['#FFD4A8', '#E8956B', '#C96B3A'],
    glow: 'rgba(232, 149, 107, 0.38)',
    ring: 'rgba(255,255,255,0.5)',
    badge: ['#FFF8F0', '#FFE4CC'],
  },
  gain_muscle: {
    gradient: ['#8B9FD4', '#3D4F7C', '#1E2844'],
    glow: 'rgba(107, 127, 184, 0.38)',
    ring: 'rgba(255,255,255,0.42)',
    badge: ['#EEF1FA', '#C8D2EC'],
  },
};

type Props = { id: PlanId; onPress?: () => void };

/** Health-goal orbit card — medallion food hero, jewel icon, three-across fit. */
export function PlanPill({ id, onPress }: Props) {
  const { strings } = useLocale();
  const plan = PLANS.find((p) => p.id === id)!;
  const title = strings.plans[id].title;
  const theme = THEMES[id];

  return (
    <Pressable
      onPress={onPress ?? (() => router.push({ pathname: '/(tabs)/plans', params: { plan: id } }))}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.card, { shadowColor: theme.glow }, shadows.md, pressed && styles.pressed]}
    >
      <LinearGradient colors={theme.gradient} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.fill}>
        <View style={[styles.blob, styles.blobA, { backgroundColor: theme.glow }]} />
        <View style={[styles.blob, styles.blobB, { backgroundColor: 'rgba(255,255,255,0.14)' }]} />

        <Text style={styles.watermark}>{plan.number}</Text>

        <View style={styles.content}>
          <View style={styles.medallionStage}>
            <View style={[styles.orbit, { borderColor: theme.ring }]} />
            <View style={[styles.foodRing, { borderColor: theme.ring }]}>
              <Image source={{ uri: plan.image }} style={styles.food} contentFit="cover" transition={250} />
              <View style={styles.foodDim} />
              <LinearGradient colors={theme.badge} style={styles.iconBadge}>
                <Ionicons name={ICONS[id]} size={16} color={theme.gradient[2]} />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.labelWrap}>
            <Text style={styles.label} numberOfLines={2}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.shine} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    height: 132,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.95, transform: [{ scale: 0.98 }] },
  fill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobA: {
    width: 72,
    height: 72,
    top: -18,
    right: -16,
    opacity: 0.55,
  },
  blobB: {
    width: 44,
    height: 44,
    bottom: 8,
    left: -10,
    opacity: 0.7,
  },
  orbit: {
    position: 'absolute',
    width: '112%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.55,
  },
  watermark: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: 28,
    fontFamily: fonts.bold,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.16)',
    letterSpacing: -1.5,
  },
  medallionStage: {
    width: '68%',
    maxWidth: 54,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  foodRing: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  food: { ...StyleSheet.absoluteFillObject },
  foodDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,36,33,0.28)',
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.92)',
    zIndex: 2,
    ...shadows.sm,
  },
  labelWrap: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    color: colors.surface,
    fontFamily: fonts.bold,
    fontWeight: '800',
    letterSpacing: -0.15,
    paddingHorizontal: 2,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
  },
});
