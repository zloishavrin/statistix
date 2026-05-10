import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		resources,
		interpolation: {
			escapeValue: false,
		},
		ns: ["header", "home", "login", "notfound", "profile", "main", "history"],
		defaultNS: "common",
	});

export default i18n;
