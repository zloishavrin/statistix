import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	type?: "text" | "email" | "url" | "password" | "tel" | "number";
	variant?: "bordered" | "underlined";
	color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
	id?: string;
	label?: ReactNode;
	value?: string;
	placeholder?: string;
	errorMessage?: string;
	validate?: (value: string) => string | true | null | undefined;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	startContent?: ReactNode;
	endContent?: ReactNode;
	labelPlacement?: "inside" | "outside";
	labelWrapperStyles?: CSSProperties;
	isClearable?: boolean;
	isRequired?: boolean;
	isReadOnly?: boolean;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isDisabledRequiredBadge?: boolean;
	className?: string;
	onValueChange?: (value: string) => void;
	onClear?: () => void;
}
