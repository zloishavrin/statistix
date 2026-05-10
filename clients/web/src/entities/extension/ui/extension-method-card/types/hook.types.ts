import type { ElementType } from "react";

export type UseExtensionMethodCardProps<T extends ElementType = "div"> = {
	as?: T;
};
