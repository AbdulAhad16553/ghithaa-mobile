import type { MealSlot } from '../constants/mealSlots';
import { getMealsForDayAndCategory, type DayKey } from '../constants/weeklyMenus';
import type { MealSelections } from '../contexts/SubscriptionContext';

export const OFF_DAYS_MAP: Record<'friSat' | 'fri', DayKey[]> = {
  friSat: ['fri', 'sat'],
  fri: ['fri'],
};

export function dayKeyFromIso(iso: string): DayKey {
  const d = new Date(iso + 'T12:00:00');
  const keys: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[d.getDay()];
}

/** Default first available meal per slot for each active day in the week. */
export function buildDefaultWeekSelections(
  weekDays: { key: DayKey; iso: string }[],
  slots: MealSlot[],
  offDays: DayKey[],
): MealSelections {
  const selections: MealSelections = {};

  for (const day of weekDays) {
    if (offDays.includes(day.key)) continue;

    const dayPick: Partial<Record<MealSlot, string>> = {};
    for (const slot of slots) {
      const meals = getMealsForDayAndCategory(day.key, slot);
      if (meals[0]) dayPick[slot] = meals[0].id;
    }
    if (Object.keys(dayPick).length) selections[day.iso] = dayPick;
  }

  return selections;
}

/** Repeat weekly picks across the full subscription period (same weekday template). */
export function expandSelectionsToDuration(
  weekSelections: MealSelections,
  startDate: string,
  totalDays: number,
  offDays: DayKey[],
): MealSelections {
  const expanded: MealSelections = { ...weekSelections };
  const start = new Date(startDate + 'T12:00:00');

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayKey = dayKeyFromIso(iso);

    if (offDays.includes(dayKey)) continue;

    const templateIso = Object.keys(weekSelections).find((k) => dayKeyFromIso(k) === dayKey);
    if (templateIso && weekSelections[templateIso]) {
      expanded[iso] = { ...expanded[iso], ...weekSelections[templateIso] };
    }
  }

  return expanded;
}

export function countPickedMeals(
  weekDays: { key: DayKey; iso: string }[],
  slots: MealSlot[],
  offDays: DayKey[],
  selections: MealSelections,
): { picked: number; total: number } {
  let total = 0;
  let picked = 0;

  for (const day of weekDays) {
    if (offDays.includes(day.key)) continue;
    for (const slot of slots) {
      total++;
      if (selections[day.iso]?.[slot]) picked++;
    }
  }

  return { picked, total };
}
