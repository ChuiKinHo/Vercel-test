import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationENUS from "@locales/enus.json";
import translationZHTW from "@locales/zhtw.json";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

const resources = {
  en_us: {
    translation: translationENUS,
  },
  zh_tw: {
    translation: translationZHTW,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en_us",
  fallbackLng: "en_us",
  interpolation: {
    escapeValue: false,
  },
});

const LanguageContext = createContext();

const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const currentLanguage =
      localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";
    i18n.changeLanguage(currentLanguage);
    setLanguage(currentLanguage);
  }, []);

  const changeLanguage = ({ language }) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, language);
    setLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider, useLanguage, i18n };
