import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { getMenuItem, loc, ORDER_STATUS_LABELS, type DeliveryOrder, type OrderStatus } from '../constants/dummyData';
import { getSlotMeta } from '../constants/mealSlots';
import { colors, fonts, radius, shadows, spacing, typography } from '../constants/theme';
import { useLocale } from '../contexts/LocaleContext';

const STATUS_COLORS: Record<OrderStatus, string> = {
  delivered: colors.success,
  out_for_delivery: colors.accent,
  preparing: colors.star,
  scheduled: colors.textMuted,
  cancelled: colors.error,
};

const STATUS_ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  delivered: 'checkmark-circle',
  out_for_delivery: 'bicycle',
  preparing: 'restaurant',
  scheduled: 'calendar-outline',
  cancelled: 'close-circle',
};

type Props = { order: DeliveryOrder };

export function OrderRow({ order }: Props) {
  const { locale, strings } = useLocale();
  const meal = getMenuItem(order.mealId);
  const statusColor = STATUS_COLORS[order.status];
  const slotMeta = order.slot ? getSlotMeta(order.slot) : null;

  return (
    <View style={styles.row}>
      {meal ? (
        <View style={styles.thumbWrap}>
          <Image source={{ uri: meal.image }} style={styles.thumb} contentFit="cover" />
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: `${statusColor}18` }]}>
          <Ionicons name={STATUS_ICONS[order.status]} size={20} color={statusColor} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.day}>{loc(order.dayLabel, locale)}</Text>
        <Text style={styles.meal} numberOfLines={1}>
          {meal ? loc(meal.name, locale) : '—'}
        </Text>
        <View style={styles.metaRow}>
          {slotMeta ? (
            <View style={[styles.slotChip, { backgroundColor: slotMeta.colorLight }]}>
              <Text style={[styles.slotText, { color: slotMeta.colorDark }]}>
                {strings[order.slot!]}
              </Text>
            </View>
          ) : null}
          <Text style={styles.cal}>{meal?.calories ?? 0} cal</Text>
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: `${statusColor}14` }]}>
        <Ionicons name={STATUS_ICONS[order.status]} size={11} color={statusColor} />
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {loc(ORDER_STATUS_LABELS[order.status], locale)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumbWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.xs,
  },
  thumb: { width: '100%', height: '100%', backgroundColor: colors.primaryLight },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  day: { ...typography.caption, color: colors.textMuted, fontFamily: fonts.semibold, fontWeight: '600' },
  meal: { ...typography.bodyStrong, fontFamily: fonts.bold, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  slotChip: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  slotText: { ...typography.caption, fontSize: 10, fontFamily: fonts.bold, fontWeight: '800' },
  cal: { ...typography.caption, fontSize: 11, color: colors.textSecondary },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    maxWidth: 100,
  },
  badgeText: { fontSize: 9, fontFamily: fonts.bold, fontWeight: '800', letterSpacing: 0.1 },
});
