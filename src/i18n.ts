import { ILanguage } from "@/interface/common";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {setLanguage } from "./store/slice/sessionSlice";
import HttpBackend from 'i18next-http-backend';
import { RootState, useAppDispatch, useAppSelector } from '@/store';




i18n
  .use(HttpBackend) // Use HttpBackend for loading translations
  .use(initReactI18next) // Initialize i18next for React
  .init({
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Adjust the loadPath according to your server setup
    },
    ns: ['common', 'menus'], // Specify the namespaces you want to use
    defaultNS: 'common',
    react: {
      useSuspense: false, // Set to true if you want to use React Suspense for loading translations
    },
  });


export const useLocale = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state: RootState) => state.session.lang);

  const changeLanguage = (newLanguage: ILanguage) => {
    dispatch(setLanguage(newLanguage));
    i18n.changeLanguage(newLanguage.code);
  };

  return { language, changeLanguage };
};

export default i18n;
