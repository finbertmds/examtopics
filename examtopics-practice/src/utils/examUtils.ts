import { Language } from '../locales';

export const getLocalizedText = (
  text: string | { en: string; vi: string; ja: string },
  language: Language
): string => {
  if (typeof text === 'string') {
    return text;
  }
  
  return text[language] || text.en || '';
};

export const getExamName = (exam: { name: string | { en: string; vi: string; ja: string } }, language: Language): string => {
  return getLocalizedText(exam.name, language);
};

export const getExamDescription = (exam: { description: string | { en: string; vi: string; ja: string } }, language: Language): string => {
  return getLocalizedText(exam.description, language);
};
