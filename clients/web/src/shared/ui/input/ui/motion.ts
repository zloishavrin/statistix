import type { Transition, Variants } from "motion";

export const buttonVariants: Variants = {
	open: { opacity: 0, scale: 0.8 },
	idle: { opacity: 0.5, scale: 1 },
	close: { opacity: 0, scale: 0.8 },
};

export const buttonTransition: Transition = {
	type: "keyframes",
	ease: "easeInOut",
	duration: 0.2,
};

export const errorVariants: Variants = {
	open: { opacity: 0, y: -10 },
	idle: { opacity: 1, y: 0 },
	close: { opacity: 0, y: -10 },
};

export const errorTransition: Transition = {
	type: "keyframes",
	ease: "easeInOut",
	duration: 0.2,
};
