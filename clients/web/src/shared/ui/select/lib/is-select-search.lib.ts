import { isValidElement } from "react";
import type { SelectSearchProps } from "../types";
import { SelectSearch } from "../ui";

export const isSelectSearch = (
	child: React.ReactNode,
): child is React.ReactElement<SelectSearchProps> => {
	return isValidElement(child) && child.type === SelectSearch;
};
