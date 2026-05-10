import type { SelectChild } from "./props.types";

export type UseSelectProps = {
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	children: SelectChild | SelectChild[];
};
