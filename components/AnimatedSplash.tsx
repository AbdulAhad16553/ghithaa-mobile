import { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../constants/theme';

// Transparent wordmark sampled pixel-for-pixel from the reference launch video
// (white "ghithaa" + Arabic غذاء + coral accent, teal keyed out).
const WORDMARK = require('../assets/splash/ghithaa-wordmark.png');

// Intrinsic pixel size of the exported asset — kept as a ratio so the mark
// scales crisply to any screen without distortion.
const WORDMARK_RATIO = 764 / 256;

// The mark spans ~52% of the screen width — slightly smaller for a refined launch.
const WIDTH_FRACTION = 0.52;
const MAX_WIDTH = 300;

export const SPLASH_DURATION_MS = 2600;

const DRAW_DELAY = 140;
const DRAW_DURATION = 1500;

/**
 * Ghithaa launch animation — recreates the reference video exactly: a solid
 * teal canvas on which the wordmark is painted on left-to-right, led by a warm
 * coral brush tip that dissolves as the mark completes. No spinner, no footer.
 */
export function AnimatedSplash() {
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width * WIDTH_FRACTION, MAX_WIDTH);
  const logoHeight = logoWidth / WORDMARK_RATIO;
  const nibSize = logoHeight * 0.16;

  const progress = useSharedValue(0); // 0 → 1 : left-to-right paint reveal
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.quad) });
    progress.value = withDelay(
      DRAW_DELAY,
      withTiming(1, { duration: DRAW_DURATION, easing: Easing.bezier(0.42, 0, 0.2, 1) }),
    );
  }, [fade, progress]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  // Growing clip window reveals the fixed-width, left-anchored image so the
  // glyphs appear in stroke order (g → h → i → t → h → a → a).
  const clipStyle = useAnimatedStyle(() => ({ width: progress.value * logoWidth }));

  const nibStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.08, 0.85, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateX: progress.value * logoWidth - nibSize / 2 }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.stage}>
        <Animated.View style={[{ width: logoWidth, height: logoHeight }, fadeStyle]}>
          <Animated.View style={[styles.clip, { height: logoHeight }, clipStyle]}>
            <Image
              source={WORDMARK}
              style={{ width: logoWidth, height: logoHeight }}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.nib,
              {
                width: nibSize,
                height: nibSize,
                borderRadius: nibSize / 2,
                top: logoHeight / 2 - nibSize / 2,
              },
              nibStyle,
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.splash },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  clip: { overflow: 'hidden' },
  nib: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
