import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import viData from '../i18n/vi/common.json';
import enData from '../i18n/en/common.json';

export type Language = 'vi' | 'en';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const resources: Record<Language, any> = {
  vi: viData,
  en: enData,
};

const I18N_STORAGE_KEY = 'java_quiz_language';

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: any, path: string): string {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return path;
    }
    current = current[part];
  }
  return typeof current === 'string' ? current : path;
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(I18N_STORAGE_KEY);
      if (saved === 'vi' || saved === 'en') return saved;
    } catch {}
    return 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(I18N_STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>): string => {
      let text = getNestedValue(resources[language], path);
      if (text === path && language !== 'vi') {
        text = getNestedValue(resources.vi, path);
      }
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    };
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
