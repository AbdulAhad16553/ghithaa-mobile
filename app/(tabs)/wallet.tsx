import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MeshBackground } from '../../components/MeshBackground';
import { WhatsAppFab } from '../../components/WhatsAppFab';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

export default function WalletScreen() {
  const { strings, locale } = useLocale();
  const { walletBalance, subscription } = useSubscription();
  const points = Math.round(walletBalance * 2);

  return (
    <View style={styles.root}>
      <MeshBackground variant="cool" />
      <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{strings.wallet}</Text>

        <LinearGradient colors={gradients.brandDeep} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>{strings.walletBalance}</Text>
            <Ionicons name="wallet" size={22} color="rgba(255,255,255,0.85)" />
          </View>
          <Text style={styles.balance}>
            {walletBalance.toFixed(2)}{' '}
            <Text style={styles.sar}>{locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
          </Text>
          <View style={styles.pointsPill}>
            <Ionicons name="star" size={13} color={colors.star} />
            <Text style={styles.pointsText}>
              {points} {strings.points}
            </Text>
          </View>
        </LinearGradient>

        {subscription ? (
          <View style={styles.txCard}>
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: colors.success + '18' }]}>
                <Ionicons name="add-circle" size={20} color={colors.success} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{strings.subscriptionSuccess}</Text>
                <Text style={styles.txSub}>{strings.pointsEarned}</Text>
              </View>
              <Text style={styles.txAmount}>
                +{(subscription.totalPaid * 0.05).toFixed(2)}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={34} color={colors.primary} />
            </View>
            <Text style={styles.emptyText}>{strings.noTransactions}</Text>
          </View>
        )}
      </ScrollView>

      <WhatsAppFab />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl + 32 },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.lg, fontSize: 26 },
  card: { borderRadius: radius.xl, padding: spacing.lg, ...shadows.brand },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { ...typography.callout, color: 'rgba(255,255,255,0.85)' },
  balance: { fontSize: 28, fontFamily: fonts.bold, fontWeight: '800', color: colors.surface, marginTop: spacing.sm },
  sar: { ...typography.title, color: 'rgba(255,255,255,0.8)' },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.scrim,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  pointsText: { ...typography.caption, color: colors.surface, fontFamily: fonts.bold, fontWeight: '700' },
  txCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txTitle: { ...typography.bodyStrong, color: colors.text },
  txSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  txAmount: { ...typography.title, color: colors.success, fontFamily: fonts.bold, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyText: { ...typography.body, color: colors.textSecondary },
});
