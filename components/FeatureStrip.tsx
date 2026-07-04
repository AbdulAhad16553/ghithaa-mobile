import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FEATURES } from '../constants/content';
import { colors, fonts, layout, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

const TINTS = [colors.primary, colors.accent, colors.dinner, colors.success] as const;

/** Horizontal strip of Ghithaa value props — quality, delivery, app, support. */
export function FeatureStrip() {
  const { strings } = useLocale();

  return (
    <View style={styles.row}>
      {FEATURES.map((f, i) => {
        const tint = TINTS[i % TINTS.length];
        const copy = strings.features[f.id as keyof typeof strings.features];
        return (
          <View key={f.id} style={styles.chip}>
            <View style={[styles.icon, { backgroundColor: `${tint}18` }]}>
              <Ionicons name={f.icon} size={16} color={tint} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {copy.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: layout.controlRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    minHeight: 52,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.text,
    fontFamily: fonts.semibold, fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
});
