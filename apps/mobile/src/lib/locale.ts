import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@fosholhaat/types";

export async function readStoredLocale(): Promise<Locale> {
  const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export async function writeStoredLocale(locale: Locale) {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function useStoredLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let active = true;

    readStoredLocale().then((storedLocale) => {
      if (active) {
        setLocaleState(storedLocale);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    await writeStoredLocale(nextLocale);
  };

  return { locale, setLocale };
}
