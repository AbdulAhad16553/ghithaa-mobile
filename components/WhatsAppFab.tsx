import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet } from 'react-native';

import { SUPPORT } from '../constants/content';
import { colors, shadows } from '../constants/theme';

/** Floating WhatsApp support button, bottom-end of the screen. */
export function WhatsAppFab({ bottom = 84 }: { bottom?: number }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.fab, { bottom }, pressed && styles.pressed]}
      onPress={() => Linking.openURL(SUPPORT.whatsappUrl)}
    >
      <Ionicons name="logo-whatsapp" size={24} color={colors.surface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
});
