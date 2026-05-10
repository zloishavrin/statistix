import { ThemeContext } from "./theme-context";
import { ThemeInjector } from "./theme-injector";
import type { ThemeProviderProps } from "./types";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	theme,
	children,
}) => {
	const prefix = "shaligula-ui";

	return (
		<ThemeContext.Provider value={theme}>
			<ThemeInjector theme={theme} prefix={prefix}>
				{children}
			</ThemeInjector>
		</ThemeContext.Provider>
	);
};

ThemeProvider.displayName = "ShaligulaUI.ThemeProvider";
