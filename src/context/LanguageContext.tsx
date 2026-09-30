import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  updateTranslationWord: (lang: Language, key: string, newValue: string) => void;
  updateMultipleWords: (lang: Language, updates: Record<string, string>) => void;
  resetTranslations: () => void;
  getCustomOverrides: (lang: Language) => Record<string, string>;
  getAllDictionaryKeys: (lang: Language) => Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kea_language');
    if (saved === 'en' || saved === 'fr' || saved === 'rw') {
      return saved as Language;
    }
    return 'en';
  });

  const [customOverrides, setCustomOverrides] = useState<Record<Language, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('st_silas_custom_translations');
      return saved ? JSON.parse(saved) : { en: {}, fr: {}, rw: {} };
    } catch {
      return { en: {}, fr: {}, rw: {} };
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kea_language', lang);
  };

  const updateTranslationWord = (lang: Language, key: string, newValue: string) => {
    setCustomOverrides(prev => {
      const nextOverrides = {
        ...prev,
        [lang]: {
          ...(prev[lang] || {}),
          [key]: newValue,
        },
      };
      localStorage.setItem('st_silas_custom_translations', JSON.stringify(nextOverrides));
      return nextOverrides;
    });
  };

  const updateMultipleWords = (lang: Language, updates: Record<string, string>) => {
    setCustomOverrides(prev => {
      const nextOverrides = {
        ...prev,
        [lang]: {
          ...(prev[lang] || {}),
          ...updates,
        },
      };
      localStorage.setItem('st_silas_custom_translations', JSON.stringify(nextOverrides));
      return nextOverrides;
    });
  };

  const resetTranslations = () => {
    localStorage.removeItem('st_silas_custom_translations');
    setCustomOverrides({ en: {}, fr: {}, rw: {} });
  };

  const getCustomOverrides = (lang: Language): Record<string, string> => {
    return customOverrides[lang] || {};
  };

  const getAllDictionaryKeys = (lang: Language): Record<string, string> => {
    const base = translations[lang] || translations.en;
    const overrides = customOverrides[lang] || {};
    return { ...base, ...overrides };
  };

  const t = (key: string): string => {
    // 1. Check custom overrides for the active language
    if (customOverrides[language] && customOverrides[language][key] !== undefined) {
      return customOverrides[language][key];
    }

    // 2. Check predefined dictionary
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }

    // 3. Fallback to English custom override if available
    if (customOverrides.en && customOverrides.en[key] !== undefined) {
      return customOverrides.en[key];
    }

    // 4. Fallback to English predefined dictionary or key
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        updateTranslationWord,
        updateMultipleWords,
        resetTranslations,
        getCustomOverrides,
        getAllDictionaryKeys,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
