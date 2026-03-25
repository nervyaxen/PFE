import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "./en.json";
import frTranslations from "./fr.json";
import tnTranslations from "./ar.json";

export type Language = "en" | "fr" | "ar";

type Translations = typeof enTranslations;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Translations> = {
  en: enTranslations,
  fr: frTranslations,
  ar: tnTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("machrou3i-language") as Language | null;
    // Handle old 'tn' values stored in users' browsers
    if (stored === ("tn" as string)) return "ar";
    return stored && ["en", "fr", "ar"].includes(stored) ? stored : "en";
  });

  useEffect(() => {
    localStorage.setItem("machrou3i-language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation missing
        value = translations.en;
        for (const k2 of keys) {
          value = value?.[k2];
        }
        break;
      }
    }

    let result = typeof value === "string" ? value : key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
