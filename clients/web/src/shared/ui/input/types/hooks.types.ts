import type { ChangeEventHandler } from "react";

export interface UseInputProps {
	type?: "text" | "email" | "url" | "password" | "tel" | "number";
	id?: string;
	value?: string;
	errorMessage?: string;
	validate?: (value: string) => string | true | null | undefined;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onValueChange?: (value: string) => void;
	onClear?: () => void;
}
