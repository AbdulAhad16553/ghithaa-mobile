import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';

import { isRTL, Locale, t } from '../lib/i18n';

const LOCALE_KEY = 'ghithaa_locale';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  strings: ReturnType<typeof t>;
  rtl: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getDeviceLocale(): Locale {
  const code = Localization.getLocales()[0]?.languageCode;
  return code === 'ar' ? 'ar' : 'en';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getDeviceLocale());

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_KEY).then((stored) => {
      if (stored === 'en' || stored === 'ar') {
        setLocaleState(stored);
      }
    });
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    await AsyncStorage.setItem(LOCALE_KEY, next);
    setLocaleState(next);
    const shouldRTL = isRTL(next);
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
    }
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      strings: t(locale),
      rtl: isRTL(locale),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
