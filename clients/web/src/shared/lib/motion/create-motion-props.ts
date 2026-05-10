import type { CreateMotionProps } from "./types";

export const createMotionProps = ({
	variants,
	transition,
}: CreateMotionProps) => {
	return {
		variants,
		initial: "open",
		animate: "idle",
		exit: "close",
		transition,
	};
};
