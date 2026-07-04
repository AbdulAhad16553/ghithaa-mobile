import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { PlanId } from '../constants/content';
import type { DeliveryOrder, OrderStatus } from '../constants/dummyData';
import { getMenuItem } from '../constants/dummyData';
import { MEAL_COMBOS, type MealSlot } from '../constants/mealSlots';
import { formatDayLabel, getWeeklyMenu, type DayKey } from '../constants/weeklyMenus';
import {
  expandSelectionsToDuration,
  OFF_DAYS_MAP,
} from '../lib/subscriptionPlan';
import { useAuth } from './AuthContext';

const SUB_KEY = 'ghithaa_subscription';

export type Subscription = {
  planId: PlanId;
  comboId: string;
  duration: 'week' | 'month' | 'quarter';
  startDate: string;
  offDays: DayKey[];
  totalPaid: number;
  slots: MealSlot[];
};

export type MealSelections = Record<string, Partial<Record<MealSlot, string>>>;

type StoredState = {
  subscription: Subscription | null;
  selections: MealSelections;
  orders: DeliveryOrder[];
  walletBalance: number;
};

type SubscriptionContextValue = {
  subscription: Subscription | null;
  selections: MealSelections;
  orders: DeliveryOrder[];
  upcomingOrders: DeliveryOrder[];
  pastOrders: DeliveryOrder[];
  walletBalance: number;
  isLoading: boolean;
  selectMeal: (dateIso: string, slot: MealSlot, mealId: string) => Promise<void>;
  isMealSelected: (dateIso: string, slot: MealSlot, mealId: string) => boolean;
  getSelectedMealId: (dateIso: string, slot: MealSlot) => string | undefined;
  confirmSubscription: (input: {
    planId: PlanId;
    comboId: string;
    duration: Subscription['duration'];
    offPreset: 'friSat' | 'fri';
    totalPaid: number;
    weekSelections?: MealSelections;
  }) => Promise<void>;
  clearSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const DURATION_DAYS: Record<Subscription['duration'], number> = {
  week: 7,
  month: 28,
  quarter: 84,
};

const DEFAULT_COMBO = MEAL_COMBOS.find((c) => c.id === 'c6') ?? MEAL_COMBOS[0];

const DELIVERY_WINDOWS: Record<MealSlot, { en: string; ar: string }> = {
  breakfast: { en: '6:00 – 9:00 AM', ar: '6:00 – 9:00 ص' },
  lunch: { en: '12:00 – 2:00 PM', ar: '12:00 – 2:00 م' },
  dinner: { en: '6:00 – 8:00 PM', ar: '6:00 – 8:00 م' },
  snacks: { en: '3:00 – 5:00 PM', ar: '3:00 – 5:00 م' },
};

function dayKeyFromIso(iso: string): DayKey {
  const d = new Date(iso + 'T12:00:00');
  const keys: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[d.getDay()];
}

function generateOrders(sub: Subscription, selections: MealSelections): DeliveryOrder[] {
  const combo = MEAL_COMBOS.find((c) => c.id === sub.comboId) ?? DEFAULT_COMBO;
  const orders: DeliveryOrder[] = [];
  const start = new Date(sub.startDate + 'T12:00:00');
  const totalDays = DURATION_DAYS[sub.duration];
  let orderIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayKey = dayKeyFromIso(iso);

    if (sub.offDays.includes(dayKey)) continue;

    const menu = getWeeklyMenu(dayKey);

    for (const slot of combo.slots) {
      const mealId =
        selections[iso]?.[slot] ??
        menu.slots[slot]?.[0];
      if (!mealId) continue;

      const meal = getMenuItem(mealId);
      if (!meal) continue;

      let status: OrderStatus = 'scheduled';
      if (orderIndex === 0) status = 'out_for_delivery';
      else if (orderIndex === 1) status = 'preparing';

      orders.push({
        id: `ord_${iso}_${slot}`,
        date: iso,
        dayLabel: { en: formatDayLabel(iso, 'en'), ar: formatDayLabel(iso, 'ar') },
        mealId,
        status,
        deliveryWindow: DELIVERY_WINDOWS[slot],
        slot,
      });
      orderIndex++;
    }
  }

  return orders;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, selectPlan } = useAuth();
  const [state, setState] = useState<StoredState>({
    subscription: null,
    selections: {},
    orders: [],
    walletBalance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SUB_KEY).then((raw) => {
      if (raw) setState(JSON.parse(raw));
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: StoredState) => {
    setState(next);
    await AsyncStorage.setItem(SUB_KEY, JSON.stringify(next));
  }, []);

  const selectMeal = useCallback(
    async (dateIso: string, slot: MealSlot, mealId: string) => {
      const nextSelections: MealSelections = {
        ...state.selections,
        [dateIso]: { ...state.selections[dateIso], [slot]: mealId },
      };

      const nextOrders = state.orders.map((o) =>
        o.date === dateIso && o.slot === slot ? { ...o, mealId } : o,
      );

      await persist({
        ...state,
        selections: nextSelections,
        orders: nextOrders,
      });
    },
    [persist, state],
  );

  const isMealSelected = useCallback(
    (dateIso: string, slot: MealSlot, mealId: string) =>
      state.selections[dateIso]?.[slot] === mealId,
    [state.selections],
  );

  const getSelectedMealId = useCallback(
    (dateIso: string, slot: MealSlot) => state.selections[dateIso]?.[slot],
    [state.selections],
  );

  const confirmSubscription = useCallback(
    async (input: {
      planId: PlanId;
      comboId: string;
      duration: Subscription['duration'];
      offPreset: 'friSat' | 'fri';
      totalPaid: number;
      weekSelections?: MealSelections;
    }) => {
      const combo = MEAL_COMBOS.find((c) => c.id === input.comboId) ?? DEFAULT_COMBO;
      const startDate = new Date().toISOString().slice(0, 10);
      const offDays = OFF_DAYS_MAP[input.offPreset];

      const subscription: Subscription = {
        planId: input.planId,
        comboId: input.comboId,
        duration: input.duration,
        startDate,
        offDays,
        totalPaid: input.totalPaid,
        slots: combo.slots,
      };

      const selections = input.weekSelections
        ? expandSelectionsToDuration(
            input.weekSelections,
            startDate,
            DURATION_DAYS[input.duration],
            offDays,
          )
        : {};

      const orders = generateOrders(subscription, selections);
      const walletCredit = Math.round(input.totalPaid * 0.05);

      await selectPlan(input.planId);
      await persist({
        subscription,
        selections,
        orders,
        walletBalance: state.walletBalance + walletCredit,
      });
    },
    [persist, selectPlan, state.walletBalance],
  );

  const clearSubscription = useCallback(async () => {
    await persist({
      subscription: null,
      selections: {},
      orders: [],
      walletBalance: state.walletBalance,
    });
  }, [persist, state.walletBalance]);

  useEffect(() => {
    if (!user && state.subscription) {
      clearSubscription();
    }
  }, [user, state.subscription, clearSubscription]);

  const { upcomingOrders, pastOrders } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = state.orders.filter(
      (o) => o.date >= today && o.status !== 'delivered' && o.status !== 'cancelled',
    );
    const past = state.orders.filter(
      (o) => o.date < today || o.status === 'delivered' || o.status === 'cancelled',
    );
    return { upcomingOrders: upcoming, pastOrders: past };
  }, [state.orders]);

  const value = useMemo(
    () => ({
      subscription: state.subscription,
      selections: state.selections,
      orders: state.orders,
      upcomingOrders,
      pastOrders,
      walletBalance: state.walletBalance,
      isLoading,
      selectMeal,
      isMealSelected,
      getSelectedMealId,
      confirmSubscription,
      clearSubscription,
    }),
    [
      state,
      upcomingOrders,
      pastOrders,
      isLoading,
      selectMeal,
      isMealSelected,
      getSelectedMealId,
      confirmSubscription,
      clearSubscription,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
