import type { FormEvent } from "react";

export type FormInputValues = Record<
	string,
	string | number | boolean | File | null
>;

export type FormProps = {
	onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormInputValues) => void;
	className?: string;
	errors?: string[];
	errorClassName?: string;
	children?: React.ReactNode;
};
