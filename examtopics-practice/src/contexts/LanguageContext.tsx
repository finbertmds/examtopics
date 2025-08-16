import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getTranslation, Language } from '../locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
];

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'vi', 'ja'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to detect language from browser
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('vi')) return 'vi';
    if (browserLanguage.startsWith('ja')) return 'ja';
    
    // Default to English
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

           const t = (key: string): string => {
           return getTranslation(language, key);
         };

  useEffect(() => {
    // Update document title and meta tags when language changes
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
