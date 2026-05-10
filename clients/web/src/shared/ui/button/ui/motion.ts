import type { Transition, Variants } from "motion";

export const RippleMotionVariants: Variants = {
	open: {
		opacity: 0.3,
		scale: 0,
	},
	idle: {
		opacity: 0,
		scale: 1,
	},
	close: {
		opacity: 0,
		scale: 1,
	},
};

export const RippleMotionTransition: Transition = {
	duration: 0.6,
	ease: "easeOut",
};
