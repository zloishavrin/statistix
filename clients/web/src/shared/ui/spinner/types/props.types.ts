export type SpinnerProps = {
	variant?: "default" | "simple" | "gradient" | "wave" | "dots";
	color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
	label?: string;
	labelColor?:
		| "primary"
		| "secondary"
		| "success"
		| "danger"
		| "warning"
		| "info";
	labelPosition?: "row" | "column";
	containerClassName?: string;
	className?: string;
};
