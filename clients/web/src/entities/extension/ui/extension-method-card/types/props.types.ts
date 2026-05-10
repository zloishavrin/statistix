import type { IExtensionMethod } from "@entities/extension/types/extension-method.types";
import type { ComponentPropsWithoutRef, ElementType } from "react";

export type ExtensionMethodCardProps<T extends ElementType = "div"> = {
	method: IExtensionMethod;
	as?: T;
	disabledPaddingLeft?: boolean;
	disabledPaddingTop?: boolean;
} & ComponentPropsWithoutRef<T>;
