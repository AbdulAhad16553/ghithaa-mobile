import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors, radius } from '../constants/theme';

/**
 * On the web, large viewports stretch a mobile app full-width which looks wrong.
 * This wrapper centers the app inside a phone-sized device frame on wide web
 * screens, and renders children untouched on native devices / narrow screens.
 */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 480;

  if (!isWideWeb) {
    return <View style={styles.flex}>{children}</View>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.device}>{children}</View>
    </View>
  );
}

const DEVICE_WIDTH = 414;
const DEVICE_HEIGHT = 896;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1B14',
    padding: 24,
  },
  device: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    maxHeight: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.xxl + 12,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#10141A',
    ...Platform.select({
      web: { boxShadow: '0 30px 80px rgba(0,0,0,0.55)' } as object,
      default: {},
    }),
  },
});
