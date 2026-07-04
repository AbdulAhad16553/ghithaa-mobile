import type { Ionicons } from '@expo/vector-icons';

import { colors } from './theme';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type MealSlotMeta = {
  id: MealSlot;
  icon: keyof typeof Ionicons.glyphMap;
  time: { en: string; ar: string };
  color: string;
  colorLight: string;
  colorDark: string;
  gradient: readonly [string, string];
};

export const MEAL_SLOTS: MealSlotMeta[] = [
  {
    id: 'breakfast',
    icon: 'sunny-outline',
    time: { en: '6 – 9 AM', ar: '6 – 9 ص' },
    color: colors.breakfast,
    colorLight: colors.breakfastLight,
    colorDark: colors.breakfastDark,
    gradient: ['#F5B87A', '#E8956B'] as const,
  },
  {
    id: 'lunch',
    icon: 'restaurant-outline',
    time: { en: '12 – 2 PM', ar: '12 – 2 م' },
    color: colors.lunch,
    colorLight: colors.lunchLight,
    colorDark: colors.lunchDark,
    gradient: ['#1A8A82', '#0F6E68'] as const,
  },
  {
    id: 'dinner',
    icon: 'moon-outline',
    time: { en: '6 – 8 PM', ar: '6 – 8 م' },
    color: colors.dinner,
    colorLight: colors.dinnerLight,
    colorDark: colors.dinnerDark,
    gradient: ['#5A6FA0', '#3D4F7C'] as const,
  },
  {
    id: 'snacks',
    icon: 'cafe-outline',
    time: { en: '3 – 5 PM', ar: '3 – 5 م' },
    color: colors.snacks,
    colorLight: colors.snacksLight,
    colorDark: colors.snacksDark,
    gradient: ['#A88BC4', '#8B6BA8'] as const,
  },
];

export type MealCombo = {
  id: string;
  slots: MealSlot[];
  price: number;
  popular?: boolean;
};

/** Subscription bundles keyed by which day-part meals are included. */
export const MEAL_COMBOS: MealCombo[] = [
  { id: 'c1', slots: ['breakfast'], price: 235 },
  { id: 'c2', slots: ['lunch'], price: 235 },
  { id: 'c3', slots: ['dinner'], price: 235 },
  { id: 'c7', slots: ['snacks'], price: 165 },
  { id: 'c4', slots: ['breakfast', 'lunch'], price: 385 },
  { id: 'c5', slots: ['lunch', 'dinner'], price: 385 },
  { id: 'c6', slots: ['breakfast', 'lunch', 'dinner'], price: 525, popular: true },
  { id: 'c8', slots: ['breakfast', 'lunch', 'dinner', 'snacks'], price: 655 },
];

export const ALL_MEAL_SLOTS: MealSlot[] = MEAL_SLOTS.map((s) => s.id);

export function getSlotMeta(id: MealSlot): MealSlotMeta {
  return MEAL_SLOTS.find((s) => s.id === id)!;
}

export function comboMatchesFilter(combo: MealCombo, filter: MealSlot | 'all'): boolean {
  if (filter === 'all') return true;
  return combo.slots.includes(filter);
}
