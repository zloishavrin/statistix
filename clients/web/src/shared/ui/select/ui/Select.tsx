import React, { forwardRef, isValidElement, Children } from "react";
import type { SelectProps } from "../types";
import { SelectSearch } from "./SelectSearch";
import { useSelect } from "../hooks";
import { SelectContext } from "./select-context";
import styles from "./styles.module.css";
import { AnimatePresence, motion } from "motion/react";
import { listBoxTransition, listBoxVariants } from "./motion";
import { createMotionProps } from "@shared/lib/motion";
import { ArrowIcon } from "@shared/ui/icons";
import { isSelectItem, isSelectSearch } from "../lib";
import { SelectedValue } from "./SelectValue";

export const Select = forwardRef(function SelectInner<T extends string>(
	{
		defaultValue,
		onValueChange,
		className,
		buttonClassName,
		iconClassName,
		selectClassName,
		openIcon,
		startContent,
		label,
		children,
		...rest
	}: SelectProps<T>,
	ref: React.Ref<HTMLSelectElement>,
) {
	const select = useSelect<T>({ defaultValue, onValueChange });

	return (
		<SelectContext.Provider value={select}>
			<div className={`${styles.Container} ${className || ""}`}>
				{/* hidden select */}
				<select
					ref={ref}
					value={select.selectedValue}
					onChange={() => {}}
					style={{ display: "none" }}
					{...rest}
				>
					{Children.map(children, (child) => {
						if (!isValidElement(child)) return null;
						if (child.type === SelectSearch) return null;

						if (isSelectItem<T>(child)) {
							return (
								<option value={child.props.value}>
									{child.props.children}
								</option>
							);
						}

						return null;
					})}
				</select>

				{/* button */}
				<button
					type="button"
					className={`
            ${styles.SelectButton}
            ${label ? styles.SelectButtonWithLabel : ""}
            ${buttonClassName || ""}
          `}
					onClick={() => select.setIsOpen(!select.isOpen)}
				>
					{label && <div className={styles.SelectButtonLabel}>{label}</div>}

					<div className={styles.SelectButtonContent}>
						{startContent}

						<span className={styles.SelectValue}>
							<SelectedValue<T> children={children} />
						</span>

						<span className={`${styles.SelectIcon} ${iconClassName || ""}`}>
							{openIcon || (
								<ArrowIcon color="hsl(var(--shaligula-ui-color-primary))" />
							)}
						</span>
					</div>
				</button>

				{/* list */}
				<AnimatePresence>
					{select.isOpen && (
						<motion.ul
							className={`${styles.SelectList} ${selectClassName || ""}`}
							role="listbox"
							id={select.listboxId}
							{...createMotionProps({
								variants: listBoxVariants,
								transition: listBoxTransition,
							})}
						>
							{Children.map(children, (child) => {
								if (!isValidElement(child)) return null;

								if (isSelectSearch(child)) {
									return React.cloneElement(child, {
										value: select.searchTerm,
										onChange: select.setSearchTerm,
									});
								}

								if (isSelectItem<T>(child)) {
									return React.cloneElement(child, {
										onSelect: select.handleSelect,
										isSelected: child.props.value === select.selectedValue,
									});
								}

								return null;
							})}
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
		</SelectContext.Provider>
	);
}) as <T extends string>(
	props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => JSX.Element;
