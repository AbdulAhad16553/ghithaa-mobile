import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MeshBackground } from '../../components/MeshBackground';
import { OrderRow } from '../../components/OrderRow';
import { SectionTitle } from '../../components/SectionTitle';
import { Button } from '../../components/Button';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

export default function OrdersScreen() {
  const { strings, locale } = useLocale();
  const { user } = useAuth();
  const { subscription, upcomingOrders, pastOrders } = useSubscription();
  const hasPlan = Boolean(user?.activePlan && subscription);
  const planCopy = user?.activePlan ? strings.plans[user.activePlan] : null;

  return (
    <View style={styles.root}>
      <MeshBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <SectionTitle overline={strings.orders} title={strings.orders} />

          {hasPlan && planCopy ? (
            <>
              <LinearGradient colors={gradients.hero} style={styles.activeCard}>
                <View style={styles.cardOrb} />
                <View style={styles.activeTop}>
                  <LinearGradient colors={gradients.sunrise} style={styles.activeIcon}>
                    <Ionicons name="fitness" size={18} color={colors.surface} />
                  </LinearGradient>
                  <View style={styles.activeBadge}>
                    <View style={styles.dot} />
                    <Text style={styles.activeBadgeText}>
                      {locale === 'ar' ? 'نشط' : 'Active'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.planName}>{planCopy.title}</Text>
                <Text style={styles.planDesc}>{planCopy.desc}</Text>
                <Pressable style={styles.menuLink} onPress={() => router.push('/(tabs)/menu')}>
                  <Ionicons name="restaurant-outline" size={16} color={colors.surface} />
                  <Text style={styles.menuLinkText}>{strings.viewMenu}</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.7)" />
                </Pressable>
              </LinearGradient>

              {upcomingOrders.length > 0 ? (
                <>
                  <SectionTitle
                    title={locale === 'ar' ? 'التوصيلات القادمة' : 'Upcoming deliveries'}
                    subtitle={`${upcomingOrders.length} ${locale === 'ar' ? 'قادمة' : 'scheduled'}`}
                  />
                  <View style={styles.listCard}>
                    {upcomingOrders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </View>
                </>
              ) : null}

              {pastOrders.length > 0 ? (
                <>
                  <SectionTitle
                    title={locale === 'ar' ? 'سجل الطلبات' : 'Order history'}
                  />
                  <View style={styles.listCard}>
                    {pastOrders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </View>
                </>
              ) : null}
            </>
          ) : (
            <View style={styles.empty}>
              <LinearGradient colors={gradients.brand} style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={36} color={colors.surface} />
              </LinearGradient>
              <Text style={styles.emptyTitle}>{strings.noOrders}</Text>
              <Text style={styles.emptyHint}>{strings.noOrdersHint}</Text>
              <Button
                title={strings.selectPlan}
                onPress={() => router.push('/(tabs)/plans')}
                style={styles.cta}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl + 32 },
  activeCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.brand,
  },
  cardOrb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -30,
    right: -20,
  },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  activeIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#7DF0AE' },
  activeBadgeText: { ...typography.caption, color: colors.surface, fontFamily: fonts.bold, fontWeight: '800' },
  planName: { ...typography.h2, color: colors.surface },
  planDesc: { ...typography.callout, color: 'rgba(255,255,255,0.85)', marginTop: 4, lineHeight: 18 },
  menuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  menuLinkText: { ...typography.caption, color: colors.surface, fontFamily: fonts.bold, fontWeight: '700', flex: 1 },
  listCard: {
    backgroundColor: colors.glass,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.brand,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  cta: { alignSelf: 'stretch' },
});
