import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, type PressableProps } from 'react-native';

import { colors, fonts, layout, shadows, spacing, typography } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'ink' | 'outline' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: colors.textInverse,
  secondary: colors.textInverse,
  ink: colors.textInverse,
  whatsapp: colors.textInverse,
  outline: colors.primary,
  ghost: colors.primary,
};

export function Button({
  title,
  variant = 'primary',
  size = 'lg',
  loading = false,
  icon,
  fullWidth,
  disabled,
  style,
  ...props
}: Props) {
  const fg = TEXT_COLOR[variant];
  const isDisabled = disabled || loading;
  const elevated =
    variant === 'primary' || variant === 'secondary' || variant === 'ink' || variant === 'whatsapp';

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        elevated && shadows.sm,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={fg} /> : null}
          <Text style={[styles.text, size === 'sm' && styles.textSm, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.controlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fullWidth: { alignSelf: 'stretch' },
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.ink },
  ink: { backgroundColor: colors.ink },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: { backgroundColor: colors.primaryLight },
  whatsapp: { backgroundColor: colors.whatsapp },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  text: { ...typography.title, fontFamily: fonts.bold, fontWeight: '700' },
  textSm: { ...typography.callout, fontFamily: fonts.bold, fontWeight: '700' },
});
