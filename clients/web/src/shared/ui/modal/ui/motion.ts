import type { Transition, Variants } from "motion";

export const containerVariants: Variants = {
	open: { opacity: 0 },
	idle: { opacity: 1 },
	close: { opacity: 0 },
};

export const containerTransition: Transition = {
	duration: 0.5,
};
