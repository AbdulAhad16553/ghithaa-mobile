import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { LanguageToggle } from '../../components/LanguageToggle';
import { Wordmark } from '../../components/Wordmark';
import { DEMO_CREDENTIALS } from '../../constants/dummyData';
import { colors, fonts, gradients, layout, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

export default function LoginScreen() {
  const { strings, rtl } = useLocale();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const proceed = async (identifier: string) => {
    setLoading(true);
    try {
      await login(identifier, '');
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const id = phone.trim() ? `+966${phone.trim()}` : DEMO_CREDENTIALS.email;
    void proceed(id);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <View style={styles.heroOrb} />
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.langRow}>
            <LanguageToggle />
          </View>
          <View style={styles.headerCenter}>
            <Wordmark size={32} variant="onDark" />
            <Text style={styles.tagline}>{strings.tagline}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <View style={styles.sheetHandle} />

        <View style={styles.titleWrap}>
          <Text style={styles.welcome}>{strings.welcome}</Text>
          <Text style={styles.subtitle}>{strings.loginOrCreate}</Text>
        </View>

        <View style={[styles.phoneField, focused && styles.phoneFieldFocused, shadows.sm]}>
          <View style={styles.flagBox}>
            <Text style={styles.flag}>🇸🇦</Text>
            <Text style={styles.code}>+966</Text>
          </View>
          <View style={styles.divider} />
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="phone-pad"
            placeholder={strings.phoneHint}
            placeholderTextColor={colors.textMuted}
            maxLength={9}
            textAlign={rtl ? 'right' : 'left'}
          />
        </View>

        <Button title={strings.login} loading={loading} onPress={handleLogin} fullWidth style={styles.cta} />

        <Pressable style={styles.guest} hitSlop={8} onPress={() => proceed(DEMO_CREDENTIALS.email)}>
          <Text style={styles.guestText}>{strings.continueAsGuest}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDarker },
  header: { height: '40%', overflow: 'hidden' },
  heroOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -36,
    right: -30,
  },
  headerSafe: { flex: 1, paddingHorizontal: spacing.lg },
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: spacing.sm },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.lg, gap: spacing.xs },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.84)',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 16,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -18,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.md,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  titleWrap: { marginBottom: spacing.lg },
  welcome: { ...typography.h2, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.controlRadius,
    paddingHorizontal: spacing.md,
    height: 56,
    marginBottom: spacing.md,
  },
  phoneFieldFocused: { borderColor: colors.primary, borderWidth: 1.5 },
  flagBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flag: { fontSize: 18 },
  code: { ...typography.callout, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  divider: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  phoneInput: {
    flex: 1,
    ...typography.callout,
    color: colors.text,
    letterSpacing: 1.1,
    paddingVertical: 0,
    fontFamily: fonts.semibold,
    fontWeight: '600',
  },
  cta: { marginTop: spacing.xs },
  guest: { alignSelf: 'center', marginTop: spacing.md, padding: spacing.sm },
  guestText: { ...typography.caption, color: colors.primary, fontFamily: fonts.semibold, fontWeight: '600' },
});
