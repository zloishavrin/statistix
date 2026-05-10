import type { Transition, Variants } from "motion";

export const notificationVariants: Variants = {
	open: { opacity: 0, scale: 0.8, right: -100 },
	idle: { opacity: 1, scale: 1, right: 25 },
	close: { opacity: 0, scale: 0.8, right: -100 },
};

export const notificationTransition: Transition = {
	type: "keyframes",
	ease: "easeInOut",
	duration: 0.2,
};
