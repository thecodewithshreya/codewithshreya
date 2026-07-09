"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultLanguage,
  isLanguageCode,
  LanguageCode,
  translate,
} from "@/lib/i18n";

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const storageKey = "codewithshreya-language";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(storageKey);
    if (savedLanguage && isLanguageCode(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  function setLanguage(nextLanguage: LanguageCode) {
    setLanguageState(nextLanguage);
    localStorage.setItem(storageKey, nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translate(language, key),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}

export function T({ k }: { k: string }) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}
