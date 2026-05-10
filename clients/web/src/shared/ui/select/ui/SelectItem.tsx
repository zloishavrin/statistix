import { forwardRef } from "react";
import type { SelectItemProps } from "../types";
import styles from "./styles.module.css";
import { motion } from "motion/react";
import { listElementTransition, listElementVariants } from "./motion";
import { createMotionProps } from "@shared/lib/motion";

export const SelectItem = forwardRef<HTMLLIElement, SelectItemProps>(
	(
		{
			value,
			children,
			className,
			onSelect,
			isSelected,
			isDisabled = false,
			...rest
		},
		ref,
	) => {
		return (
			<motion.li
				ref={ref}
				className={`
          ${styles.SelectItem}
          ${isSelected ? styles.IsSelected : ""}
          ${isDisabled ? styles.IsDisabled : ""}
          ${className || ""}
        `}
				onClick={() => onSelect?.(value)}
				role="option"
				aria-selected={isSelected}
				aria-disabled={isDisabled}
				{...createMotionProps({
					variants: listElementVariants,
					transition: listElementTransition,
				})}
				layout="size"
				{...rest}
			>
				{children}
			</motion.li>
		);
	},
);

SelectItem.displayName = "ShaligulaUI.SelectItem";
