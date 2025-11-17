// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Import your translation files
import en from "./locales/en.json";
import ur from "./locales/ur.json";
import fr from "./locales/fr.json";

// Safely get device language
let deviceLanguage = "en";
if (Localization.locale) {
  deviceLanguage = Localization.locale.split("-")[0];
}

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: deviceLanguage, // default language
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ur: { translation: ur },
    fr: { translation: fr },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
