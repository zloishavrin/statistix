import type { InputProps } from "../types";
import styles from "./styles.module.css";
import { AnimatePresence, motion } from "motion/react";
import { createMotionProps } from "@shared/lib/motion";
import {
	buttonTransition,
	buttonVariants,
	errorTransition,
	errorVariants,
} from "./motion";
import { useInput } from "../hooks";
import { forwardRef } from "react";
import { CloseCircleIcon, EyeOffIcon, EyeIcon } from "@shared/ui/icons";

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			type = "text",
			variant = "bordered",
			color = "primary",
			id,
			label,
			value,
			placeholder,
			errorMessage,
			validate,
			minLength,
			maxLength,
			pattern,
			startContent,
			endContent,
			labelPlacement = "outside",
			labelWrapperStyles,
			isClearable,
			isRequired,
			isReadOnly,
			isDisabled,
			isInvalid,
			isDisabledRequiredBadge,
			className,
			onChange,
			onValueChange,
			onClear,
			...rest
		},
		ref,
	) => {
		const {
			inputRef,
			inputId,
			isFocus,
			inputType,
			inputValue,
			error,
			isPassword,
			isPasswordVisible,
			setIsFocus,
			handleValidate,
			handleChange,
			handleTogglePasswordVisible,
			handleClear,
		} = useInput({
			type,
			id,
			value,
			errorMessage,
			validate,
			onChange,
			onValueChange,
			onClear,
		});

		return (
			<div
				className={`
      ${styles.Wrapper} 
      ${styles[`ColorProvider-${color}`]} 
      ${errorMessage || isInvalid ? styles.HasError : ""} 
      ${isReadOnly || isDisabled ? styles.IsReadOnly : ""} 
      ${isDisabled ? styles.IsDisabled : ""} 
      ${className || ""}
    `}
			>
				<div
					className={`
          ${styles.Container} 
          ${labelPlacement === "outside" ? styles.ContainerLabelOutside : ""} 
          ${variant === "underlined" ? styles.ContainerUnderlined : ""} 
          ${!label ? styles.ContainerWithoutLabel : ""} 
        `}
					onClick={() => {
						if (inputRef.current) {
							inputRef.current.focus();
						}
					}}
				>
					{label && (
						<label
							className={`
								${styles.Label}
								${labelPlacement === "outside" ? styles.LabelOutside : ""} 
								${isFocus ? styles.LabelFocus : ""}
							`}
							htmlFor={inputId}
							style={labelWrapperStyles}
						>
							{label}
							{isRequired && !isDisabledRequiredBadge && (
								<span className={`${styles.RequiredBadge}`}>*</span>
							)}
						</label>
					)}
					<div className={`${styles.InputContainer}`}>
						{startContent && startContent}

						<input
							type={inputType}
							id={inputId}
							ref={(node) => {
								inputRef.current = node;
								if (typeof ref === "function") {
									ref(node);
								} else if (ref) {
									ref.current = node;
								}
							}}
							value={inputValue}
							placeholder={placeholder}
							className={`${styles.Input}`}
							onFocus={() => {
								setIsFocus(true);
							}}
							onBlur={() => {
								setIsFocus(false);
								handleValidate();
							}}
							onInvalid={(e) => e.preventDefault()}
							required={isRequired}
							minLength={minLength}
							maxLength={maxLength}
							pattern={pattern}
							readOnly={isReadOnly}
							disabled={isDisabled}
							onChange={handleChange}
							aria-invalid={isInvalid || !!error}
							aria-describedby={error ? `${inputId}-error` : undefined}
							{...rest}
						/>

						{endContent && endContent}

						<AnimatePresence mode="popLayout">
							{isPassword &&
								!isPasswordVisible &&
								inputValue &&
								!isReadOnly &&
								!isDisabled && (
									<motion.button
										key={`${inputId}-eye-on-icon`}
										className={`${styles.ClearButton}`}
										type="button"
										onClick={handleTogglePasswordVisible}
										{...createMotionProps({
											variants: buttonVariants,
											transition: buttonTransition,
										})}
										whileHover={{
											opacity: 1,
										}}
										layout="size"
									>
										<EyeIcon
											className={`${styles.EyeIcon}`}
											color="hsl(var(--shaligula-ui-input-color))"
										/>
									</motion.button>
								)}
							{isPassword &&
								isPasswordVisible &&
								inputValue &&
								!isReadOnly &&
								!isDisabled && (
									<motion.button
										key={`${inputId}-eye-off-icon`}
										className={`${styles.ClearButton}`}
										type="button"
										onClick={handleTogglePasswordVisible}
										{...createMotionProps({
											variants: buttonVariants,
											transition: buttonTransition,
										})}
										whileHover={{
											opacity: 1,
										}}
										layout="size"
									>
										<EyeOffIcon
											className={`${styles.EyeIcon}`}
											color="hsl(var(--shaligula-ui-input-color))"
										/>
									</motion.button>
								)}
						</AnimatePresence>

						<AnimatePresence mode="popLayout">
							{isClearable && inputValue && !isReadOnly && !isDisabled && (
								<motion.button
									className={`${styles.ClearButton}`}
									type="button"
									onClick={handleClear}
									{...createMotionProps({
										variants: buttonVariants,
										transition: buttonTransition,
									})}
									whileHover={{
										opacity: 1,
									}}
									layout="size"
								>
									<CloseCircleIcon
										className={`${styles.ClearIcon}`}
										color="hsl(var(--shaligula-ui-input-color))"
									/>
								</motion.button>
							)}
						</AnimatePresence>
					</div>

					{variant === "underlined" && (
						<span
							className={`
              ${styles.Underlined}  
            `}
						></span>
					)}
				</div>

				<AnimatePresence mode="popLayout">
					{error && (
						<motion.p
							className={`${styles.ErrorMessage}`}
							id={`${inputId}-error`}
							key={`${inputId}-error-${error}`}
							role="alert"
							{...createMotionProps({
								variants: errorVariants,
								transition: errorTransition,
							})}
						>
							{error}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

Input.displayName = "ShaligulaUI.Input";
