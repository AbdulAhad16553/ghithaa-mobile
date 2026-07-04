import type { MenuCategory, MenuItem } from './dummyData';
import { getMenuItem } from './dummyData';

export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export type DaySlots = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
};

export type WeeklyMenu = {
  day: DayKey;
  slots: DaySlots;
};

/** Unique meal lineup per weekday — breakfast, lunch, dinner rotate daily. */
export const WEEKLY_MENUS: WeeklyMenu[] = [
  {
    day: 'sun',
    slots: {
      breakfast: ['meal_06', 'meal_14'],
      lunch: ['meal_01', 'meal_04', 'meal_15'],
      dinner: ['meal_02', 'meal_17'],
      snacks: ['meal_09'],
    },
  },
  {
    day: 'mon',
    slots: {
      breakfast: ['meal_07', 'meal_13'],
      lunch: ['meal_03', 'meal_12', 'meal_16'],
      dinner: ['meal_08', 'meal_10'],
      snacks: ['meal_22'],
    },
  },
  {
    day: 'tue',
    slots: {
      breakfast: ['meal_11', 'meal_06'],
      lunch: ['meal_05', 'meal_01', 'meal_15'],
      dinner: ['meal_18', 'meal_02'],
      snacks: ['meal_19'],
    },
  },
  {
    day: 'wed',
    slots: {
      breakfast: ['meal_14', 'meal_07'],
      lunch: ['meal_04', 'meal_03', 'meal_12'],
      dinner: ['meal_17', 'meal_08'],
      snacks: ['meal_21'],
    },
  },
  {
    day: 'thu',
    slots: {
      breakfast: ['meal_13', 'meal_11'],
      lunch: ['meal_16', 'meal_05', 'meal_01'],
      dinner: ['meal_10', 'meal_18'],
      snacks: ['meal_20'],
    },
  },
  {
    day: 'fri',
    slots: {
      breakfast: ['meal_06', 'meal_07'],
      lunch: ['meal_15', 'meal_12', 'meal_04'],
      dinner: ['meal_02', 'meal_17'],
      snacks: ['meal_23'],
    },
  },
  {
    day: 'sat',
    slots: {
      breakfast: ['meal_11', 'meal_14'],
      lunch: ['meal_03', 'meal_16', 'meal_05'],
      dinner: ['meal_08', 'meal_10'],
      snacks: ['meal_09', 'meal_22'],
    },
  },
];

const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const DAY_LABELS: Record<DayKey, { en: string; ar: string }> = {
  sun: { en: 'Sun', ar: 'الأحد' },
  mon: { en: 'Mon', ar: 'الاثنين' },
  tue: { en: 'Tue', ar: 'الثلاثاء' },
  wed: { en: 'Wed', ar: 'الأربعاء' },
  thu: { en: 'Thu', ar: 'الخميس' },
  fri: { en: 'Fri', ar: 'الجمعة' },
  sat: { en: 'Sat', ar: 'السبت' },
};

export function dayKeyFromDate(date: Date): DayKey {
  return DAY_KEYS[date.getDay()];
}

export function dayKeyFromIndex(index: number): DayKey {
  return DAY_KEYS[index % 7];
}

export function getWeeklyMenu(day: DayKey): WeeklyMenu {
  return WEEKLY_MENUS.find((m) => m.day === day) ?? WEEKLY_MENUS[0];
}

export function getMealIdsForDayAndCategory(day: DayKey, category: MenuCategory): string[] {
  const menu = getWeeklyMenu(day);
  return menu.slots[category] ?? [];
}

export function getMealsForDayAndCategory(day: DayKey, category: MenuCategory): MenuItem[] {
  return getMealIdsForDayAndCategory(day, category)
    .map((id) => getMenuItem(id))
    .filter((m): m is MenuItem => Boolean(m));
}

export type WeekDayItem = {
  key: DayKey;
  en: string;
  ar: string;
  date: number;
  iso: string;
  isToday: boolean;
};

/** Rolling 7-day window starting from the given date (defaults to today). */
export function getWeekDays(anchor: Date = new Date()): WeekDayItem[] {
  const start = new Date(anchor);
  start.setHours(0, 0, 0, 0);
  const todayIso = new Date().toISOString().slice(0, 10);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dayKeyFromDate(d);
    const iso = d.toISOString().slice(0, 10);
    return {
      key,
      en: DAY_LABELS[key].en,
      ar: DAY_LABELS[key].ar,
      date: d.getDate(),
      iso,
      isToday: iso === todayIso,
    };
  });
}

export function formatDayLabel(iso: string, locale: 'en' | 'ar'): string {
  const d = new Date(iso + 'T12:00:00');
  const key = dayKeyFromDate(d);
  const label = DAY_LABELS[key][locale];
  const month = d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' });
  return locale === 'ar'
    ? `${label} ${d.getDate()} ${month}`
    : `${label}, ${month} ${d.getDate()}`;
}
