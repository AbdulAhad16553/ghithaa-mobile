import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius } from '../constants/theme';

const LOGO_DARK = require('../assets/brand/ghithaa-logo.png');
const LOGO_LIGHT = require('../assets/splash/ghithaa-wordmark.png');

const RATIO_ON_LIGHT = 404 / 125;
const RATIO_ON_DARK = 764 / 256;

type Props = {
  /** Logo height in dp. */
  size?: number;
  /** Teal logo on light backgrounds (default). */
  variant?: 'onLight' | 'onDark';
  /** Blend logo matte with page or glass surface. */
  background?: 'transparent' | 'page' | 'glass';
  /** Rounded chip matching top-bar controls. */
  framed?: boolean;
  style?: ViewStyle;
  /** @deprecated Use `variant="onDark"` instead. */
  color?: string;
  accentColor?: string;
  arabicColor?: string;
  showArabic?: boolean;
};

const BG: Record<NonNullable<Props['background']>, string> = {
  transparent: 'transparent',
  page: colors.background,
  glass: colors.glass,
};

/** Ghithaa brand logo — official wordmark image. */
export function Wordmark({
  size = 34,
  variant,
  background = 'transparent',
  framed,
  style,
  color,
}: Props) {
  const onDark = variant === 'onDark' || color === colors.surface;
  const source = onDark ? LOGO_LIGHT : LOGO_DARK;
  const ratio = onDark ? RATIO_ON_DARK : RATIO_ON_LIGHT;
  const fill = BG[background];

  return (
    <View
      style={[
        styles.wrap,
        framed && styles.frame,
        framed && background !== 'transparent' && { backgroundColor: fill },
        style,
      ]}
    >
      <Image
        source={source}
        style={{
          width: size * ratio,
          height: size,
          backgroundColor: fill,
        }}
        contentFit="contain"
        accessibilityLabel="Ghithaa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start', overflow: 'hidden' },
  frame: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});
