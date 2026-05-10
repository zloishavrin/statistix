import type { Transition, Variants } from "framer-motion";

export const listBoxVariants: Variants = {
	open: { opacity: 0, y: -5, pointerEvents: "none" },
	idle: {
		opacity: 1,
		y: 0,
		pointerEvents: "auto",
	},
	close: { opacity: 0, y: -5, pointerEvents: "none" },
};

export const listBoxTransition: Transition = {
	duration: 0.2,
	ease: "easeInOut",
	type: "keyframes",
};

export const listElementVariants: Variants = {
	open: { opacity: 0, y: -15 },
	idle: { opacity: 1, y: 0 },
	close: { opacity: 0, y: -15 },
};

export const listElementTransition: Transition = {
	type: "keyframes",
	ease: "easeInOut",
	duration: 0.2,
};

export const searchInputVariants: Variants = {
	open: { opacity: 0 },
	idle: { opacity: 1 },
	close: { opacity: 0 },
};

export const searchInputTransition: Transition = {
	delay: 0.2,
	duration: 0.4,
	ease: "easeInOut",
	type: "keyframes",
};
