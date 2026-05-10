import type { ElementType } from "react";
import type { UseButtonProps } from "../types";

export const useButton = <T extends ElementType = "button">({
	as,
	isDisabled,
	...rest
}: UseButtonProps<T>) => {
	const Component = as || "button";
	const isNativeButton = Component === "button";

	const accessibilityProps = !isNativeButton
		? {
				role: "button",
				tabIndex: isDisabled ? -1 : 0,
				"aria-disabled": isDisabled,
			}
		: {
				disabled: isDisabled,
			};

	const props = {
		...accessibilityProps,
		...rest,
	};
	return {
		Component,
		props,
	};
};
