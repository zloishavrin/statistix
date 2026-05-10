import type { ElementType } from "react";
import type { UseExtensionMethodCardProps } from "../types/hook.types";

export const useExtensionMethodCard = <T extends ElementType = "div">({
	as,
}: UseExtensionMethodCardProps<T>) => {
	const Component = as || "div";

	return {
		Component,
	};
};
