import React, { useEffect } from "react";
import { type ThemeInjectorProps } from "./types";

export const ThemeInjector: React.FC<ThemeInjectorProps> = ({
	theme,
	prefix,
	children,
}) => {
	useEffect(() => {
		const root = document.documentElement;

		Object.entries(theme.colors).forEach(([key, value]) => {
			root.style.setProperty(`--${prefix}-color-${key}`, value);
		});

		root.style.setProperty(
			`--${prefix}-font-family`,
			theme.typography.fontFamily,
		);
		root.style.setProperty(
			`--${prefix}-font-size-tiny`,
			theme.typography.fontSizeTiny,
		);
		root.style.setProperty(
			`--${prefix}-font-size-small`,
			theme.typography.fontSizeSmall,
		);
		root.style.setProperty(
			`--${prefix}-font-size-medium`,
			theme.typography.fontSizeMedium,
		);
		root.style.setProperty(
			`--${prefix}-font-size-large`,
			theme.typography.fontSizeLarge,
		);

		Object.entries(theme.spacing).forEach(([key, value]) => {
			root.style.setProperty(`--${prefix}-spacing-${key}`, value);
		});

		root.style.setProperty(`--${prefix}-border`, theme.border);
		root.style.setProperty(`--${prefix}-border-radius`, theme.borderRadius);
		root.style.setProperty(`--${prefix}-box-shadow`, theme.boxShadow);
		root.style.setProperty(
			`--${prefix}-box-shadow-hover`,
			theme.boxShadowHover,
		);
	}, [theme, prefix]);

	return <>{children}</>;
};
