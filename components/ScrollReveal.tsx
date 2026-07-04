import { useEffect, useRef } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

type Props = {
  scrollY: SharedValue<number>;
  scrollRef: React.RefObject<View | null>;
  windowHeight: number;
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
};

/** Reveals children with an open-up animation when scrolled into view. */
export function ScrollReveal({
  scrollY,
  scrollRef,
  windowHeight,
  children,
  style,
  delay = 0,
}: Props) {
  const viewRef = useRef<View>(null);
  const offsetY = useSharedValue(0);
  const progress = useSharedValue(0);
  const revealLine = useSharedValue(windowHeight * 0.9);

  useEffect(() => {
    revealLine.value = windowHeight * 0.9;
  }, [windowHeight, revealLine]);

  const measure = () => {
    const scrollNode = scrollRef.current;
    const node = viewRef.current;
    if (!scrollNode || !node) return;
    node.measureLayout(
      scrollNode as unknown as number,
      (_x, y) => {
        offsetY.value = y;
        const line = scrollY.value + revealLine.value;
        if (y < line && progress.value < 1) {
          progress.value = withDelay(
            delay,
            withTiming(1, { duration: 560, easing: Easing.out(Easing.cubic) }),
          );
        }
      },
      () => {},
    );
  };

  useEffect(() => {
    const t = setTimeout(measure, 80);
    return () => clearTimeout(t);
  }, [delay]);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      if (progress.value >= 1) return;
      const line = y + revealLine.value;
      if (offsetY.value < line) {
        progress.value = withDelay(
          delay,
          withTiming(1, { duration: 560, easing: Easing.out(Easing.cubic) }),
        );
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 32 },
      { scale: 0.93 + progress.value * 0.07 },
    ],
  }));

  return (
    <View ref={viewRef} onLayout={measure} style={style} collapsable={false}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  );
}
