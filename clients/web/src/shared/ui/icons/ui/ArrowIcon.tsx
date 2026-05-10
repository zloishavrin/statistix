import type { IconProps } from "../types";

export const ArrowIcon = ({ className, color, ...rest }: IconProps) => {
	return (
		<svg
			fill="none"
			stroke={color}
			className={className || ""}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			{...rest}
		>
			<path d="m6 9 6 6 6-6"></path>
		</svg>
	);
};
