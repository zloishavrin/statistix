import type { IconProps } from "../types";

export const MenuIcon = ({ className, color, ...rest }: IconProps) => {
	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			fill={color}
			{...rest}
		>
			<g strokeWidth="0"></g>
			<g strokeLinecap="round" strokeLinejoin="round"></g>
			<g>
				<g>
					<path fill="none" d="M0 0h24v24H0z"></path>
					<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
				</g>
			</g>
		</svg>
	);
};
