import { useCallback, useState } from "react";

export const useSelect = <T extends string>({
	defaultValue,
	onValueChange,
}: {
	defaultValue?: T;
	onValueChange?: (value: T) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState<T>(defaultValue as T);
	const [searchTerm, setSearchTerm] = useState("");

	const listboxId = "select-listbox";

	const handleSelect = useCallback(
		(value: T) => {
			setSelectedValue(value);
			onValueChange?.(value);

			setIsOpen(false);
			setSearchTerm("");
		},
		[onValueChange],
	);

	return {
		isOpen,
		setIsOpen,
		selectedValue,
		setSelectedValue,
		searchTerm,
		setSearchTerm,
		handleSelect,
		listboxId,
	};
};
