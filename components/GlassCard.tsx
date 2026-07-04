import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, layout, shadows, spacing } from '../constants/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  /** Brand accent for soft halo elevation */
  glow?: string;
  /** Top accent stripe color */
  accent?: string;
  padded?: boolean;
};

/** Frosted Ghithaa card — white glass, optional brand accent stripe. */
export function GlassCard({ children, style, glow, accent = colors.primary, padded = true }: Props) {
  return (
    <View style={[styles.outer, glow ? shadows.glow(glow) : shadows.sm, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0.88)']}
        style={styles.gradient}
      >
        <LinearGradient
          colors={[accent, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentStripe}
        />
        <View style={[styles.inner, !padded && styles.innerFlush]}>{children}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  gradient: { borderRadius: layout.cardRadius },
  accentStripe: { height: 3, width: '100%' },
  inner: { padding: spacing.lg },
  innerFlush: { padding: 0 },
});
