import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../constants/theme';

type Tone = 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';

type Props = {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
};

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primaryLight, fg: colors.primary },
  accent: { bg: colors.accentLight, fg: colors.accentDark },
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
  success: { bg: '#E7F6EC', fg: colors.success },
  warning: { bg: '#FEF3E2', fg: '#B45309' },
  error: { bg: colors.errorLight, fg: colors.error },
};

/** Small pill label used for section eyebrows, statuses and tags. */
export function Badge({ label, tone = 'primary', style }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  text: {
    ...typography.caption,
    fontFamily: fonts.bold, fontWeight: '700',
  },
});
