import React from "react";
import { useSelectContext } from "./select-context";
import { isSelectItem } from "../lib";

export function SelectedValue<T extends string>({
	children,
}: {
	children: React.ReactNode;
}) {
	const { selectedValue } = useSelectContext<T>();

	const selectedChild = React.Children.toArray(children).find((child) => {
		if (!isSelectItem<T>(child)) return false;

		return child.props.value === selectedValue;
	});

	if (!isSelectItem<T>(selectedChild)) {
		return <span>{selectedValue}</span>;
	}

	return <span>{selectedChild.props.children}</span>;
}
