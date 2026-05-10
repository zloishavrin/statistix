import type { IconProps } from "../types";

export const AddBoxIcon = ({ className, color, ...rest }: IconProps) => {
	return (
		<svg fill={color} className={className || ""} viewBox="0 0 24 24" {...rest}>
			<g>
				<path fill="none" d="M0 0h24v24H0z" />
				<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 8H7v2h4v4h2v-4h4v-2h-4V7h-2v4z" />
			</g>
		</svg>
	);
};
