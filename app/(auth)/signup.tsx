import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LanguageToggle } from '../../components/LanguageToggle';
import { colors, fonts, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';

export default function SignupScreen() {
  const { strings, rtl } = useLocale();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup({ name, email, phone, password });
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brand}>{strings.appName}</Text>
            <LanguageToggle />
          </View>

          <Text style={styles.title}>{strings.signup}</Text>
          <Text style={styles.subtitle}>
            {rtl ? 'أنشئ حسابك وابدأ رحلتك الصحية' : 'Create your account and start eating well'}
          </Text>

          <Input
            label={strings.name}
            icon="person-outline"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label={strings.email}
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label={strings.phone}
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label={strings.password}
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secure
          />

          <Button title={strings.signup} loading={loading} onPress={handleSignup} fullWidth />

          <View style={styles.footer}>
            <Text style={styles.footerText}>{strings.hasAccount} </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.link}>{strings.login}</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brand: {
    ...typography.h1,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.body, color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
});
