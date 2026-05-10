import { forwardRef } from "react";
import type { SelectSearchProps } from "../types";
import styles from "./styles.module.css";
import { createMotionProps } from "@shared/lib/motion";
import { searchInputTransition, searchInputVariants } from "./motion";
import { motion } from "motion/react";

export const SelectSearch = forwardRef<HTMLInputElement, SelectSearchProps>(
	(
		{ value, onChange, placeholder, className, bottomClassName, ...rest },
		ref,
	) => {
		return (
			<li className={bottomClassName}>
				<motion.input
					ref={ref}
					type="text"
					role="searchbox"
					value={value}
					placeholder={placeholder}
					onChange={(event) => {
						if (onChange) {
							onChange(event.target.value);
						}
					}}
					className={`
          ${styles.SelectSearch} 
          ${className || ""} 
        `}
					{...createMotionProps({
						variants: searchInputVariants,
						transition: searchInputTransition,
					})}
					layout="size"
					{...rest}
				/>
			</li>
		);
	},
);

SelectSearch.displayName = "ShaligulaUI.SelectSearch";
