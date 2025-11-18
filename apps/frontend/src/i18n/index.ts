import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

const STORAGE_KEY = 'lang';

const getInitialLanguage = (): string => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ru' ? 'ru' : 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

