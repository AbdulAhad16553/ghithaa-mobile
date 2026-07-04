import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { loc, type MenuItem } from '../constants/dummyData';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  meal: MenuItem;
  onPress?: () => void;
  selected?: boolean;
  accentColor?: string;
  dense?: boolean;
};

/** Polaroid-style meal tile with glow selection and calorie jewel. */
export function MealGridCard({ meal, onPress, selected, accentColor = colors.primary, dense }: Props) {
  const { locale } = useLocale();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        dense && styles.cardDense,
        selected && shadows.glow(accentColor),
        selected && { borderColor: accentColor },
        pressed && styles.pressed,
      ]}
    >
      {selected ? <View style={[styles.topStripe, dense && styles.topStripeDense, { backgroundColor: accentColor }]} /> : null}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: meal.image }}
          style={[styles.image, dense && styles.imageDense]}
          contentFit="cover"
          transition={200}
        />
        {selected ? (
          <LinearGradient
            colors={[accentColor, accentColor + 'CC']}
            style={[styles.selectedBadge, dense && styles.selectedBadgeDense]}
          >
            <Ionicons name="checkmark" size={dense ? 11 : 14} color={colors.surface} />
          </LinearGradient>
        ) : null}
        <LinearGradient colors={['transparent', 'rgba(8,36,33,0.65)']} style={[styles.imageFade, dense && styles.imageFadeDense]} />
        <View style={[styles.calJewel, dense && styles.calJewelDense]}>
          <Ionicons name="flame-outline" size={dense ? 8 : 10} color={colors.accent} />
          <Text style={[styles.calOverlay, dense && styles.calOverlayDense]}>{meal.calories}</Text>
        </View>
      </View>
      <View style={[styles.body, dense && styles.bodyDense]}>
        <Text style={[styles.name, dense && styles.nameDense]} numberOfLines={dense ? 1 : 2}>
          {loc(meal.name, locale)}
        </Text>
        {meal.tags[0] && !dense ? (
          <View style={[styles.tag, { backgroundColor: accentColor + '18' }]}>
            <Text style={[styles.tagText, { color: accentColor }]} numberOfLines={1}>
              {loc(meal.tags[0], locale)}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.xs,
  },
  cardDense: { borderRadius: radius.md, borderWidth: 1 },
  topStripe: { height: 3, width: '100%' },
  topStripeDense: { height: 2 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  imageWrap: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.primaryLight },
  imageDense: { aspectRatio: 1.15 },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
  imageFadeDense: { height: 28 },
  calJewel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  calJewelDense: {
    bottom: 4,
    left: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  calOverlay: {
    ...typography.caption,
    fontSize: 10,
    fontFamily: fonts.bold, fontWeight: '800',
    color: colors.text,
  },
  calOverlayDense: { fontSize: 8 },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  selectedBadgeDense: {
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  body: { padding: spacing.sm + 2, gap: 4, minHeight: 56 },
  bodyDense: { padding: 5, gap: 0, minHeight: 0 },
  name: { ...typography.caption, fontFamily: fonts.bold, fontWeight: '800', color: colors.text, lineHeight: 15 },
  nameDense: { fontSize: 10, lineHeight: 13 },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  tagText: { ...typography.caption, fontSize: 9, fontFamily: fonts.bold, fontWeight: '700' },
});
