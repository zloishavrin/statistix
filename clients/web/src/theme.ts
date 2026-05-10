import { defaultTheme, type Theme } from "@app/theme";

export const extendedTheme: Theme = {
	...defaultTheme,
	typography: {
		...defaultTheme.typography,
		fontFamily: "'Fira Sans', sans-serif",
	},
} as const;
