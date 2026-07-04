import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { colors, fonts, shadows } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(outline: IconName, filled: IconName) {
  return ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={focused ? filled : outline} size={focused ? size : size - 1} color={color} />
    </View>
  );
}

function TabLabel({ color, label }: { color: ColorValue; label: string }) {
  return (
    <View style={styles.labelWrap}>
      <Text
        style={[styles.tabLabel, { color }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        allowFontScaling={false}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { strings } = useLocale();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarAllowFontScaling: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarIconStyle: styles.tabIcon,
        tabBarLabel: ({ color, children }) => (
          <TabLabel color={color} label={String(children)} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: strings.tabHome, tabBarIcon: tabIcon('home-outline', 'home') }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: strings.tabOrders, tabBarIcon: tabIcon('cube-outline', 'cube') }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: strings.tabWallet, tabBarIcon: tabIcon('wallet-outline', 'wallet') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: strings.tabMe, tabBarIcon: tabIcon('person-outline', 'person') }}
      />
      <Tabs.Screen name="menu" options={{ href: null }} />
      <Tabs.Screen name="plans" options={{ href: null }} />
    </Tabs>
  );
}

const TAB_INSET = 12;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: TAB_INSET,
    right: TAB_INSET,
    bottom: Platform.OS === 'ios' ? 22 : 14,
    height: 68,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    paddingTop: 6,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    maxWidth: '25%',
    paddingVertical: 0,
  },
  tabIcon: { marginBottom: 0 },
  labelWrap: { width: '100%', maxWidth: 76, alignItems: 'center' },
  tabLabel: { fontSize: 10, fontFamily: fonts.bold, fontWeight: '700', textAlign: 'center', width: '100%' },
  iconWrap: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapActive: { backgroundColor: colors.primaryLight },
});
