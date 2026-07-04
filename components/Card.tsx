import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '../constants/theme';

type Elevation = 'none' | 'xs' | 'sm' | 'md' | 'lg';
type Padding = keyof typeof spacing | 'none';

type BaseProps = {
  elevation?: Elevation;
  padding?: Padding;
  bordered?: boolean;
  style?: ViewStyle | ViewStyle[];
};

function cardStyle({ elevation = 'sm', padding = 'md', bordered = true }: BaseProps): ViewStyle[] {
  return [
    styles.card,
    bordered && styles.bordered,
    padding !== 'none' && { padding: spacing[padding] },
    shadows[elevation],
  ].filter(Boolean) as ViewStyle[];
}

/** Elevated surface used as the base for every card-like block in the app. */
export function Card({ elevation, padding, bordered, style, children, ...rest }: BaseProps & ViewProps) {
  return (
    <View style={[...cardStyle({ elevation, padding, bordered }), style]} {...rest}>
      {children}
    </View>
  );
}

/** Pressable variant with a subtle scale-down feedback on press. */
export function PressableCard({
  elevation,
  padding,
  bordered,
  style,
  children,
  ...rest
}: BaseProps & Omit<PressableProps, 'style'>) {
  return (
    <Pressable
      style={({ pressed }) => [
        ...cardStyle({ elevation, padding, bordered }),
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {children as React.ReactNode}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.97,
    transform: [{ scale: 0.985 }],
  },
});
