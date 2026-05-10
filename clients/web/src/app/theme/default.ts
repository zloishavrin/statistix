import type { Theme } from "./types";

export const defaultTheme: Theme = {
	colors: {
		primary: "0 0% 100%",
		secondary: "209 90% 51%",
		success: "153 90% 51%",
		danger: "339 90% 51%",
		warning: "51 90% 51%",
		info: "209 90% 51%",
		background: "0 0% 0%",
	},
	spacing: {
		small: "0.5rem",
		medium: "1rem",
		large: "2rem",
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
		fontSizeTiny: "0.75rem",
		fontSizeSmall: "0.875rem",
		fontSizeMedium: "1rem",
		fontSizeLarge: "1.25rem",
	},
	border: "0.5px solid rgba(255, 255, 255, 0.5)",
	borderRadius: "0.75rem",
	boxShadow: "0px 0px 2px 2px rgba(255, 255, 255, 0.3)",
	boxShadowHover: "0px 0px 10px 2px rgba(255, 255, 255, 0.2)",
};
