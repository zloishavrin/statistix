import { forwardRef } from "react";
import type { SkeletonProps } from "../types";
import styles from "./style.module.css";

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
	({ children, className, ...rest }, ref) => {
		return (
			<div
				ref={ref}
				className={`${styles.Skeleton} ${className || ""}`}
				{...rest}
			>
				{children}
			</div>
		);
	},
);

Skeleton.displayName = "ShaligulaUI.Skeleton";
