import type { SUPPORTED_LANGUAGES } from "../store";

type Language = (typeof SUPPORTED_LANGUAGES)[number];

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export type LanguageStore = {
	languages: Language[];
	currentLanguage: Language;
	changeLanguage: (code: LanguageCode) => void;
	initLanguage: (code: LanguageCode) => void;
};
