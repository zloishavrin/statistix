import { createContext, useContext } from "react";

export type SelectContextValue<T extends string> = {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;

	selectedValue: T;
	setSelectedValue: (value: T) => void;

	searchTerm: string;
	setSearchTerm: (value: string) => void;

	handleSelect: (value: T) => void;

	listboxId: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SelectContext = createContext<SelectContextValue<any> | null>(
	null,
);

export const useSelectContext = <T extends string>() => {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new Error("Select components must be used inside Select");
	return ctx as SelectContextValue<T>;
};
