import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fonts, spacing, typography } from '../constants/theme';

type Props = {
  overline?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

/** Standard section header — calm hierarchy, optional text action. */
export function SectionTitle({ overline, title, subtitle, actionLabel, onAction, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.textCol}>
        {overline ? <Text style={styles.overline}>{overline}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  textCol: { flex: 1, gap: 4 },
  overline: { ...typography.overline, color: colors.primary },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.callout, color: colors.textSecondary },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingTop: 2 },
  actionText: { ...typography.caption, color: colors.primary, fontFamily: fonts.semibold, fontWeight: '600' },
});
