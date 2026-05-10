import type { Transition, Variants } from "framer-motion";

export const fileIconVariants: Variants = {
	open: { opacity: 0 },
	idle: { opacity: 1 },
	close: { opacity: 0 },
};

export const fileIconTransition: Transition = {
	duration: 0.2,
	ease: "easeInOut",
	type: "keyframes",
};
