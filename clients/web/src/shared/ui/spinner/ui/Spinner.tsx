import type { SpinnerProps } from "../types";
import styles from "./styles.module.css";
import { forwardRef } from "react";

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
	(
		{
			variant = "default",
			color = "primary",
			label,
			labelColor = "primary",
			labelPosition = "column",
			containerClassName,
			className,
			...rest
		},
		ref,
	) => {
		return (
			<div
				className={`
        ${styles.Container}
        ${styles[`Position-${labelPosition}`]} 
				${containerClassName || ""}
      `}
			>
				<span
					className={`
          ${styles.Spinner} 
          ${styles[`ColorProvider-${color}`]} 
          ${styles[`Spinner-${variant}`]} 
          ${className || ""}
        `}
					ref={ref}
					{...rest}
				></span>

				{label && (
					<p
						className={`
          ${styles.Label} 
          ${styles[`LabelColor-${labelColor}`]}
        `}
					>
						{label}
					</p>
				)}
			</div>
		);
	},
);

Spinner.displayName = "ShaligulaUI.Spinner";
