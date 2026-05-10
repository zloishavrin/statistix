import { useId, useRef, useState } from "react";
import type { UseInputProps } from "../types";

export const useInput = ({
	type = "text",
	id,
	value,
	errorMessage,
	validate,
	onValueChange,
	onChange,
	onClear,
}: UseInputProps) => {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(value || "");
	const inputValue = isControlled ? value : internalValue;
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const error = errorMessage || localError;
	const isPassword = type === "password";
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const inputType = isPassword && isPasswordVisible ? "text" : type;
	const inputRef = useRef<HTMLInputElement>(null);
	const generatedId = useId();
	const inputId = id || generatedId;

	const handleValidate = () => {
		if (!inputRef.current) return;
		if (errorMessage) return false;

		const input = inputRef.current;
		if (!input.checkValidity()) {
			setLocalError(input.validationMessage);
			return false;
		}

		if (validate) {
			const customError = validate(input.value);
			if (typeof customError === "string") {
				setLocalError(customError);
				return false;
			}
		}

		setLocalError(null);
		return true;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setInternalValue(e.target.value);
		if (onChange) onChange(e);
		if (onValueChange) onValueChange(e.target.value);
	};

	const handleClear = () => {
		if (!isControlled) setInternalValue("");
		if (onClear) onClear();
		if (onChange) {
			const event = {
				...new Event("change"),
				target: { value: "" },
			} as unknown as React.ChangeEvent<HTMLInputElement>;
			onChange(event);
		}
		if (onValueChange) onValueChange("");
	};

	const handleTogglePasswordVisible = () => {
		if (isPassword) {
			setIsPasswordVisible(!isPasswordVisible);
		}
	};

	return {
		inputRef,
		inputId,
		isFocus,
		inputType,
		inputValue,
		error,
		isPassword,
		isPasswordVisible,
		setIsFocus,
		handleValidate,
		handleChange,
		handleTogglePasswordVisible,
		handleClear,
	};
};
