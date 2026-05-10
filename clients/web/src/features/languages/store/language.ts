import { create } from "zustand";
import i18n from "i18next";
import type { LanguageCode, LanguageStore } from "../types";

export const SUPPORTED_LANGUAGES = [
	{ name: "English", code: "en" },
	{ name: "Русский", code: "ru" },
] as const;

export const useLanguageStore = create<LanguageStore>((set) => ({
	languages: [...SUPPORTED_LANGUAGES],
	currentLanguage: SUPPORTED_LANGUAGES[0],
	changeLanguage: (code) => {
		const newLanguage =
			SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ??
			SUPPORTED_LANGUAGES[0];
		i18n.changeLanguage(code);
		localStorage.setItem("i18nextLng", code);
		set({ currentLanguage: newLanguage });
	},
	initLanguage: (code) => {
		const newLanguage =
			SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ??
			SUPPORTED_LANGUAGES[0];
		set({ currentLanguage: newLanguage });
	},
}));

const savedLanguage = localStorage.getItem("i18nextLng");
if (savedLanguage) {
	useLanguageStore.getState().initLanguage(savedLanguage as LanguageCode);
}
