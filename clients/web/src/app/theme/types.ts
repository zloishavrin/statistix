type ColorPalette = {
	primary: string;
	secondary: string;
	success: string;
	danger: string;
	warning: string;
	info: string;
	background: string;
};

type Spacing = {
	small: string;
	medium: string;
	large: string;
};

type Typography = {
	fontFamily: string;
	fontSizeTiny: string;
	fontSizeSmall: string;
	fontSizeMedium: string;
	fontSizeLarge: string;
};

export type Theme = {
	colors: ColorPalette;
	spacing: Spacing;
	typography: Typography;
	border: string;
	borderRadius: string;
	boxShadow: string;
	boxShadowHover: string;
};

export type ThemeInjectorProps = {
	theme: Theme;
	prefix: string;
	children: React.ReactNode;
};

export type ThemeProviderProps = {
	theme: Theme;
	children: React.ReactNode;
};
