import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, gradients } from '../constants/theme';

type Props = {
  style?: ViewStyle;
  variant?: 'default' | 'warm' | 'cool';
};

/** Ghithaa brand atmosphere — soft teal, coral and indigo mesh. */
export function MeshBackground({ style, variant = 'default' }: Props) {
  const orbCoral = variant === 'cool' ? colors.meshIndigo : colors.meshCoral;
  const orbTeal = variant === 'warm' ? colors.meshCoral : colors.meshTeal;

  return (
    <View style={[styles.root, style]} pointerEvents="none">
      <LinearGradient
        colors={[...gradients.mesh]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbTeal, { backgroundColor: orbTeal }]} />
      <View style={[styles.orb, styles.orbCoral, { backgroundColor: orbCoral }]} />
      <View style={[styles.orb, styles.orbIndigo, { backgroundColor: colors.meshIndigo }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: 999 },
  orbTeal: { width: 280, height: 280, top: -90, right: -70 },
  orbCoral: { width: 220, height: 220, top: 140, left: -80 },
  orbIndigo: { width: 180, height: 180, bottom: 100, right: -50 },
});
