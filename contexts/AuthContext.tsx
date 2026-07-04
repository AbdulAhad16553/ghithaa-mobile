import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { PlanId } from '../constants/content';
import { DEMO_USER } from '../constants/dummyData';

const AUTH_KEY = 'ghithaa_auth';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  activePlan?: PlanId;
  caloriesTarget?: number;
  memberSince?: string;
  address?: { en: string; ar: string; building: string; unit: string };
  deliveryWindow?: { en: string; ar: string };
  paymentMethod?: { brand: string; last4: string; expiry: string };
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  selectPlan: (planId: PlanId) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildDemoUser(email: string): User {
  return {
    id: DEMO_USER.id,
    name: DEMO_USER.name,
    email,
    phone: DEMO_USER.phone,
    activePlan: DEMO_USER.activePlan,
    caloriesTarget: DEMO_USER.caloriesTarget,
    memberSince: DEMO_USER.memberSince,
    address: DEMO_USER.address,
    deliveryWindow: DEMO_USER.deliveryWindow,
    paymentMethod: DEMO_USER.paymentMethod,
  };
}

function buildNewUser(data: { name: string; email: string; phone: string }): User {
  return {
    ...buildDemoUser(data.email),
    id: `usr_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    activePlan: undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((raw) => {
      if (raw) setUser(JSON.parse(raw));
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: User | null) => {
    setUser(next);
    if (next) {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      await persist(buildDemoUser(email.trim()));
    },
    [persist],
  );

  const signup = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
      await persist(buildNewUser(data));
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const selectPlan = useCallback(async (planId: PlanId) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, activePlan: planId };
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout, selectPlan }),
    [user, isLoading, login, signup, logout, selectPlan],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
