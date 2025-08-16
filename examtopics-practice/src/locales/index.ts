// Import translations from JSON files
import enTranslations from './translations/en.json';
import jaTranslations from './translations/ja.json';
import viTranslations from './translations/vi.json';

export type Language = 'en' | 'vi' | 'ja';

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  en: enTranslations as Translations,
  vi: viTranslations as Translations,
  ja: jaTranslations as Translations,
};

export const getTranslation = (language: Language, key: string): string => {
  return translations[language][key] || key;
};
