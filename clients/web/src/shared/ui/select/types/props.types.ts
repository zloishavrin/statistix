import type { ReactElement, ReactNode, SelectHTMLAttributes } from "react";

export type SelectItemProps<T extends string = string> = {
	value: T;
	children: ReactNode;
	icon?: ReactNode;
	className?: string;
	onSelect?: (value: T) => void;
	isSelected?: boolean;
	isDisabled?: boolean;
};

export type SelectSearchProps = {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	bottomClassName?: string;
};

export type SelectChild<T extends string = string> =
	| ReactElement<SelectItemProps<T>>
	| ReactElement<SelectSearchProps>;

export interface SelectProps<
	T extends string,
> extends SelectHTMLAttributes<HTMLSelectElement> {
	defaultValue?: T;
	onValueChange?: (value: T) => void;
	className?: string;
	buttonClassName?: string;
	iconClassName?: string;
	selectClassName?: string;
	openIcon?: ReactNode;
	startContent?: ReactNode;
	label?: ReactNode;
	children: SelectChild<T> | SelectChild<T>[];
}
