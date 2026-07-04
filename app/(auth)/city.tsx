import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { colors, fonts, radius, spacing, typography } from '../../constants/theme';
import { getSavedCity, saveCity } from '../../lib/preferences';
import { useLocale } from '../../contexts/LocaleContext';

const CITIES = [
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'King Abdullah Economic City', ar: 'مدينة الملك عبدالله الاقتصادية' },
  { en: 'Makkah', ar: 'مكة المكرمة' },
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Al Khobar', ar: 'الخبر' },
  { en: 'Al Jubail', ar: 'الجبيل' },
  { en: 'Buraydah', ar: 'بريدة' },
];

export default function CityScreen() {
  const { strings, locale } = useLocale();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getSavedCity().then((city) => {
      if (!city) return;
      const idx = CITIES.findIndex((c) => c.en === city.en);
      if (idx >= 0) setSelected(idx);
    });
  }, []);

  const saveAndContinue = async () => {
    await saveCity(CITIES[selected]);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.head}>
        <Text style={styles.title}>{strings.chooseCity}</Text>
        <Text style={styles.hint}>{strings.chooseCityHint}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {CITIES.map((c, i) => {
          const on = i === selected;
          return (
            <Pressable key={c.en} onPress={() => setSelected(i)} style={[styles.row, on && styles.rowOn]}>
              <Ionicons
                name={on ? 'radio-button-on' : 'radio-button-off'}
                size={19}
                color={on ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.city, on && styles.cityOn]}>{locale === 'ar' ? c.ar : c.en}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={strings.next} fullWidth onPress={saveAndContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  head: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { ...typography.h2, color: colors.text, fontFamily: fonts.bold, fontWeight: '800' },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  rowOn: { backgroundColor: colors.primaryTint, borderBottomColor: 'transparent' },
  city: { ...typography.callout, color: colors.text, flex: 1 },
  cityOn: { color: colors.primary, fontFamily: fonts.bold, fontWeight: '700' },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
