import type { IconProps } from "../types";

export const CloseIcon = ({ className, color, ...rest }: IconProps) => {
	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			fill={color}
			className={className}
			{...rest}
		>
			<g>
				<path fill="none" d="M0 0h24v24H0z" />
				<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
			</g>
		</svg>
	);
};
