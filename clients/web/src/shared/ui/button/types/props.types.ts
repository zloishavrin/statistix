import type { ComponentPropsWithoutRef, ElementType } from "react";

export type ButtonProps<T extends ElementType = "button"> = {
	as?: T;
	variant?: "solid" | "bordered" | "ghost" | "light";
	color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
	withShadow?: boolean;
	isDisabled?: boolean;
	rippleDisabled?: boolean;
	iconOnly?: boolean;
	className?: string;
} & ComponentPropsWithoutRef<T>;
