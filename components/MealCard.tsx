import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';

type Props = {
  name: string;
  calories: number;
  protein: number;
  image?: string;
  rating?: number;
  fullWidth?: boolean;
};

export function MealCard({ name, calories, protein, image, rating = 4.8, fullWidth }: Props) {
  return (
    <View style={[styles.card, shadows.sm, fullWidth && styles.fullWidth]}>
      <View style={styles.imageWrap}>
        <Image
          source={image ? { uri: image } : require('../assets/icon.png')}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient colors={['transparent', 'rgba(16,24,40,0.55)']} style={styles.imageScrim} />
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaPill}>
            <Ionicons name="flame-outline" size={12} color={colors.primary} />
            <Text style={styles.metaText}>{calories} cal</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="barbell-outline" size={12} color={colors.accent} />
            <Text style={styles.metaText}>{protein}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%', marginRight: 0 },
  card: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 128, backgroundColor: colors.primaryLight },
  imageScrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 48 },
  ratingPill: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  ratingText: { ...typography.caption, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  body: { padding: spacing.md },
  name: { ...typography.bodyStrong, fontFamily: fonts.bold, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  meta: { flexDirection: 'row', gap: spacing.sm },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  metaText: { ...typography.caption, color: colors.textSecondary, fontFamily: fonts.semibold, fontWeight: '600' },
});
