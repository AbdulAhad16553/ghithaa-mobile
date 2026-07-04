import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MacroStrip } from '../../components/MacroStrip';
import { getMenuItem, loc } from '../../constants/dummyData';
import { getSlotMeta, type MealSlot } from '../../constants/mealSlots';
import { colors, fonts, radius, shadows, spacing, typography } from '../../constants/theme';
import { useLocale } from '../../contexts/LocaleContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const DESC = {
  en: 'A vibrant and nutritious dish featuring a mix of fresh ingredients, expertly balanced for taste and nutrition. Prepared daily by our chefs and delivered fresh to your doorstep.',
  ar: 'طبق غني ومتنوع من المكونات الطازجة، متوازن بعناية من حيث المذاق والتغذية. يُحضّر يومياً من طهاتنا ويُوصّل طازجاً إلى باب منزلك.',
};

export default function MealDetail() {
  const { id, date, slot } = useLocalSearchParams<{ id: string; date?: string; slot?: string }>();
  const { strings, locale } = useLocale();
  const { selectMeal, isMealSelected } = useSubscription();
  const [saving, setSaving] = useState(false);
  const meal = getMenuItem(id);

  const mealSlot: MealSlot =
    slot === 'breakfast' || slot === 'lunch' || slot === 'dinner' || slot === 'snacks'
      ? slot
      : meal?.category === 'breakfast' ||
          meal?.category === 'lunch' ||
          meal?.category === 'dinner' ||
          meal?.category === 'snacks'
        ? meal.category
        : 'lunch';
  const dateIso = date ?? new Date().toISOString().slice(0, 10);
  const slotMeta = getSlotMeta(mealSlot);
  const selected = meal ? isMealSelected(dateIso, mealSlot, meal.id) : false;

  if (!meal) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>—</Text>
      </SafeAreaView>
    );
  }

  const allergy = meal.tags.find((t) => /gluten|nut|seafood|بحري|غلوتين/i.test(t.en + t.ar));

  const handleSelect = async () => {
    setSaving(true);
    await selectMeal(dateIso, mealSlot, meal.id);
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.imageWrap}>
          <Image source={{ uri: meal.image }} style={styles.image} contentFit="cover" transition={150} />
          <LinearGradient colors={slotMeta.gradient} style={styles.slotBadge}>
            <Ionicons name={slotMeta.icon} size={14} color={colors.surface} />
            <Text style={styles.slotText}>{strings[mealSlot]}</Text>
          </LinearGradient>
        </View>

        <Text style={styles.name}>{loc(meal.name, locale)}</Text>
        <MacroStrip
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
          style={styles.macros}
        />

        <View style={styles.tags}>
          {meal.tags.map((t) => (
            <View key={t.en} style={[styles.tag, { backgroundColor: slotMeta.colorLight }]}>
              <Text style={[styles.tagText, { color: slotMeta.colorDark }]}>{loc(t, locale)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.desc}>{DESC[locale]}</Text>

        <Text style={styles.sectionTitle}>{strings.allergies}</Text>
        <View style={styles.allergyRow}>
          <View style={styles.allergyChip}>
            <Ionicons name="alert-circle" size={14} color={colors.accentDark} />
            <Text style={styles.allergyText}>
              {allergy ? loc(allergy, locale) : locale === 'ar' ? 'لا يوجد' : 'None'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: selected ? colors.success : slotMeta.color },
            pressed && styles.pressed,
          ]}
          onPress={handleSelect}
          disabled={saving || selected}
        >
          {saving ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <>
              <Ionicons
                name={selected ? 'checkmark-circle' : 'add'}
                size={20}
                color={colors.surface}
              />
              <Text style={styles.addText}>{selected ? strings.added : strings.select}</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  missing: { textAlign: 'center', marginTop: spacing.xxl, color: colors.textMuted },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border },
  back: { alignSelf: 'flex-end', marginTop: spacing.sm },
  imageWrap: { position: 'relative', marginTop: spacing.sm },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  slotBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  slotText: { ...typography.caption, color: colors.surface, fontFamily: fonts.bold, fontWeight: '700' },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.lg },
  macros: { marginTop: spacing.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  tagText: { ...typography.caption, fontSize: 10, fontFamily: fonts.bold, fontWeight: '700' },
  desc: { ...typography.body, color: colors.textSecondary, marginTop: spacing.lg },
  sectionTitle: { ...typography.title, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  allergyRow: { flexDirection: 'row', gap: spacing.sm },
  allergyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  allergyText: { ...typography.caption, color: colors.accentDark, fontFamily: fonts.bold, fontWeight: '700' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    minHeight: 52,
  },
  pressed: { opacity: 0.9 },
  addText: { ...typography.title, color: colors.surface, fontFamily: fonts.bold, fontWeight: '700' },
});
