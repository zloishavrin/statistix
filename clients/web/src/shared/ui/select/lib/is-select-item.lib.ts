import { isValidElement } from "react";
import type { SelectItemProps } from "../types";
import { SelectSearch } from "../ui/SelectSearch";

export const isSelectItem = <T extends string>(
	child: React.ReactNode,
): child is React.ReactElement<SelectItemProps<T>> => {
	return isValidElement(child) && child.type !== SelectSearch;
};
