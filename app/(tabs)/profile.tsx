import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MeshBackground } from '../../components/MeshBackground';
import { SettingsRow } from '../../components/SettingsRow';
import { WhatsAppFab } from '../../components/WhatsAppFab';
import { Wordmark } from '../../components/Wordmark';
import { BRAND_LINKS, SUPPORT } from '../../constants/content';
import { colors, fonts, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { APP_VERSION } from '../../lib/appInfo';

export default function MeScreen() {
  const { strings, locale, setLocale } = useLocale();
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();

  const openUrl = (url: string) => {
    void Linking.openURL(url);
  };

  const openEmail = () => {
    void Linking.openURL(`mailto:${SUPPORT.email}`);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const toggleLang = () => void setLocale(locale === 'en' ? 'ar' : 'en');
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'G';
  const planLabel = user?.activePlan ? strings.plans[user.activePlan].title : null;

  return (
    <View style={styles.root}>
      <MeshBackground variant="cool" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {user ? (
            <LinearGradient colors={gradients.hero} style={styles.profileHero}>
              <View style={styles.heroOrb} />
              <View style={styles.avatarRing}>
                <LinearGradient colors={gradients.sunrise} style={styles.avatarGradient}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
              {planLabel && subscription ? (
                <View style={styles.planBadge}>
                  <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
                  <Text style={styles.planBadgeText}>{planLabel}</Text>
                </View>
              ) : null}
            </LinearGradient>
          ) : null}

          <View style={styles.listCard}>
            {!user ? (
              <SettingsRow icon="log-in-outline" label={strings.signIn} onPress={() => router.replace('/(auth)/login')} />
            ) : null}
            <SettingsRow
              icon="information-circle-outline"
              label={strings.aboutUs}
              onPress={() => openUrl(BRAND_LINKS.about)}
            />
            <SettingsRow
              icon="call-outline"
              label={strings.contactUs}
              onPress={() => openUrl(BRAND_LINKS.contact)}
            />
            <SettingsRow
              icon="mail-outline"
              label={strings.emailUs}
              onPress={openEmail}
            />
            <SettingsRow
              icon="document-text-outline"
              label={strings.terms}
              onPress={() => openUrl(BRAND_LINKS.terms)}
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              label={strings.privacy}
              onPress={() => openUrl(BRAND_LINKS.privacy)}
            />
            <SettingsRow
              icon="language-outline"
              label={locale === 'en' ? strings.switchArabic : strings.switchEnglish}
              onPress={toggleLang}
              last={!user}
            />
            {user ? (
              <SettingsRow
                icon="log-out-outline"
                label={strings.logout}
                tint={colors.error}
                onPress={handleLogout}
                last
              />
            ) : null}
          </View>

          <View style={styles.brand}>
            <Wordmark size={28} variant="onLight" />
            <Text style={styles.version}>
              {locale === 'ar' ? `الإصدار ${APP_VERSION}` : `Version ${APP_VERSION}`}
            </Text>
            <Text style={styles.rights}>{strings.brandRights}</Text>
          </View>
        </ScrollView>

        <WhatsAppFab />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl + 24 },
  profileHero: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.brand,
  },
  heroOrb: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -50,
    right: -40,
  },
  avatarRing: { marginBottom: spacing.md },
  avatarGradient: { padding: 3, borderRadius: 40 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontFamily: fonts.bold, fontWeight: '800', color: colors.surface },
  userName: { ...typography.h2, color: colors.surface },
  userPhone: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  planBadgeText: { ...typography.caption, color: colors.surface, fontFamily: fonts.bold, fontWeight: '700' },
  listCard: {
    backgroundColor: colors.glass,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  brand: { alignItems: 'center', gap: 4, marginTop: spacing.sm },
  version: { ...typography.caption, color: colors.textMuted, fontFamily: fonts.semibold, fontWeight: '600' },
  rights: { ...typography.caption, color: colors.textMuted, opacity: 0.85, textAlign: 'center' },
});
