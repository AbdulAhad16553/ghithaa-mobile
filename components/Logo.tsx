import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fonts, gradients, radius, shadows } from '../constants/theme';

type Props = {
  size?: number;
  rounded?: boolean;
  withShadow?: boolean;
  style?: ViewStyle;
};

/**
 * Original Ghithaa logo mark: a rounded blue badge with a "G" monogram and a
 * leaf sprig. A self-contained vector composition (no raster asset required).
 */
export function Logo({ size = 64, rounded = true, withShadow = true, style }: Props) {
  return (
    <LinearGradient
      colors={gradients.accent}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: rounded ? size * 0.28 : 0,
        },
        withShadow && shadows.lg,
        style,
      ]}
    >
      <Text style={[styles.mono, { fontSize: size * 0.56 }]}>G</Text>
      <View style={[styles.leaf, { top: size * 0.16, right: size * 0.18 }]}>
        <Ionicons name="leaf" size={size * 0.26} color={colors.surface} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  mono: {
    color: colors.surface,
    fontFamily: fonts.bold, fontWeight: '900',
    letterSpacing: -1,
  },
  leaf: {
    position: 'absolute',
    transform: [{ rotate: '35deg' }],
    opacity: 0.9,
  },
});
