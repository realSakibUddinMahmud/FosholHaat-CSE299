"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@fosholhaat/types";

const LOCALE_CHANGE_EVENT = "fosholhaat-locale-change";

export function readBrowserLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function writeBrowserLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, handleChange);
  };
}

export function useBrowserLocale() {
  const locale = useSyncExternalStore(subscribe, readBrowserLocale, () => DEFAULT_LOCALE);

  const setLocale = (nextLocale: Locale) => {
    writeBrowserLocale(nextLocale);
  };

  return { locale, setLocale };
}
