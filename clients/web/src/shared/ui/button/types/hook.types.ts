import type { ElementType } from "react";

export type UseButtonProps<T extends ElementType = "button"> = {
	as?: T;
	isDisabled?: boolean;
};
