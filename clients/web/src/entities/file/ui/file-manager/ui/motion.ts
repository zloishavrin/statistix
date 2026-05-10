import type { Transition, Variants } from "motion";

export const ProgressMotionVariants: Variants = {
	open: {
		opacity: 0,
	},
	idle: {
		opacity: 1,
	},
	close: {
		opacity: 0,
	},
};

export const ProgressMotionTransition: Transition = {
	duration: 0.3,
};
