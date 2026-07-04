import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { Review } from '../constants/content';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  review: Review;
};

export function ReviewCard({ review }: Props) {
  const { locale } = useLocale();

  return (
    <View style={[styles.card, shadows.sm]}>
      <Ionicons name="chatbox-ellipses" size={22} color={colors.primaryLight} style={styles.quoteMark} />
      <View style={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name="star"
            size={14}
            color={i < review.rating ? colors.star : colors.border}
          />
        ))}
      </View>
      <Text style={styles.text}>{review.text[locale]}</Text>
      <View style={styles.footer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{review.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteMark: { position: 'absolute', top: spacing.md, right: spacing.md },
  stars: { flexDirection: 'row', gap: 2, marginBottom: spacing.sm },
  text: { ...typography.body, color: colors.textSecondary, minHeight: 66 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.callout, fontFamily: fonts.bold, fontWeight: '800', color: colors.primary },
  name: { ...typography.bodyStrong, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
});
