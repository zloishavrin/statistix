import type { HTMLMotionProps, Transition, Variants } from "framer-motion";
import type { ReactNode } from "react";

export interface ModalProps extends HTMLMotionProps<"div"> {
	isOpen: boolean;
	modalKey?: string;
	children?: ReactNode;
	onExitComplete?: () => void;
	variants?: Variants;
	transition?: Transition;
	root?: HTMLElement;
}
