import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Ghithaa design system.
 *
 * Single source of truth for color, spacing, radius, elevation and typography.
 * Components should consume these tokens rather than hard-coded values so the
 * whole app can be re-themed from one place.
 */

export const colors = {
  // Brand — Ghithaa deep teal
  primary: '#0F6E68',
  primaryDark: '#0A554F',
  primaryDarker: '#07403B',
  primaryLight: '#E1F0EE',
  primaryTint: '#F1F8F7',

  /** Official app splash / loader canvas (sampled from reference video frames) */
  splash: '#2C666E',

  // Ink — darkest teal used for high-emphasis text
  ink: '#103330',
  inkDark: '#0A2421',
  inkLight: '#E3ECEA',

  // Accent — warm coral (headings / highlights)
  accent: '#E8956B',
  accentDark: '#D9774A',
  accentLight: '#FBEDE3',

  // Surfaces & background
  background: '#F5F8F7',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF3F1',
  cream: '#F4F0E4',

  // Text
  text: '#1A2E2B',
  textSecondary: '#5C6F6B',
  textMuted: '#8A9A96',
  textInverse: '#FFFFFF',

  // Lines
  border: '#E8EDEB',
  borderStrong: '#D5DFDC',

  // Semantic
  star: '#F5B301',
  error: '#E03E3E',
  errorLight: '#FDECEC',
  success: '#0F8F6A',
  warning: '#F59E0B',
  info: '#0F6E68',
  whatsapp: '#25D366',

  // Macro accents (meal nutrition strip)
  macroCalories: '#E8743B',
  macroProtein: '#0F8F6A',
  macroCarbs: '#E0A800',
  macroFat: '#5BA8C9',

  // Meal-slot rhythm (breakfast → lunch → dinner)
  breakfast: '#E8956B',
  breakfastLight: '#FFF4EC',
  breakfastDark: '#C96B3A',
  lunch: '#0F6E68',
  lunchLight: '#E1F0EE',
  lunchDark: '#0A554F',
  dinner: '#3D4F7C',
  dinnerLight: '#ECEEF5',
  dinnerDark: '#2A3658',
  snacks: '#8B6BA8',
  snacksLight: '#F3EEF7',
  snacksDark: '#6A4F87',

  // Utility
  overlay: 'rgba(8, 36, 33, 0.5)',
  scrim: 'rgba(255, 255, 255, 0.16)',
  glass: 'rgba(255, 255, 255, 0.88)',
  glassBorder: 'rgba(232, 237, 235, 0.95)',
  meshTeal: 'rgba(15, 110, 104, 0.14)',
  meshCoral: 'rgba(232, 149, 107, 0.12)',
  meshIndigo: 'rgba(61, 79, 124, 0.09)',
} as const;

/** Brand gradients (use with expo-linear-gradient). */
export const gradients = {
  brand: [colors.primary, colors.primaryDark] as const,
  brandDeep: [colors.primary, colors.primaryDarker] as const,
  ink: [colors.ink, colors.inkDark] as const,
  accent: [colors.accent, colors.accentDark] as const,
  sunrise: ['#FFD4A8', '#E8956B', '#D9774A'] as const,
  twilight: ['#5A6FA0', '#3D4F7C', '#2A3658'] as const,
  mesh: ['#F5F8F7', '#EDF6F4', '#F8F0E8'] as const,
  hero: ['#0F6E68', '#0A554F', '#07403B'] as const,
  promo: ['rgba(8,36,33,0.05)', 'rgba(8,36,33,0.75)'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
} as const;

export const layout = {
  screenPadding: spacing.lg,
  sectionGap: spacing.lg,
  cardRadius: radius.lg,
  controlRadius: radius.md,
  hairline: 1,
} as const;

/**
 * Cross-platform elevation presets. Spreads cleanly into a style object:
 *   style={[styles.card, shadows.md]}
 */
const elevation = (
  y: number,
  blur: number,
  opacity: number,
  android: number,
): ViewStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: '#101828',
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: { elevation: android },
    default: {},
  }),
});

export const shadows = {
  none: {} as ViewStyle,
  xs: elevation(1, 2, 0.03, 1),
  sm: elevation(2, 6, 0.04, 2),
  md: elevation(4, 12, 0.05, 3),
  lg: elevation(8, 20, 0.06, 5),
  brand: {
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
      default: {},
    }),
  } as ViewStyle,
  glow: (color: string) =>
    ({
      ...Platform.select({
        ios: {
          shadowColor: color,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
        },
        android: { elevation: 8 },
        default: {},
      }),
    }) as ViewStyle,
  accent: {
    ...Platform.select({
      ios: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 22,
      },
      android: { elevation: 8 },
      default: {},
    }),
  } as ViewStyle,
} as const;

/**
 * Brand typeface — IBM Plex Sans Arabic.
 *
 * A single bilingual superfamily carries both the Latin and Arabic scripts, so
 * hierarchy comes from weight + size + tracking rather than swapping families
 * (the approach premium product suites use). Each weight is registered as its
 * own family name by expo-google-fonts, so `fontFamily` — not `fontWeight` —
 * is what actually selects the cut. Loaded in `app/_layout.tsx`.
 */
export const fonts = {
  light: 'IBMPlexSansArabic_300Light',
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;

/**
 * Typography presets. Spread into a Text style:
 *   style={[typography.h2, { color: colors.text }]}
 */
export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.6 },
  displaySm: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.5 },
  h1: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.4 },
  h2: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.25 },
  h3: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: -0.15 },
  title: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, fontWeight: '600', letterSpacing: -0.05 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, fontWeight: '400' },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  callout: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, fontWeight: '500' },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, fontWeight: '500' },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

/** Aggregate token object for ergonomic imports: `import { theme } from '...'`. */
export const theme = {
  colors,
  gradients,
  spacing,
  radius,
  shadows,
  fonts,
  typography,
  layout,
} as const;
