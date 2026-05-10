import type { ElementType } from "react";
import type { ButtonProps } from "../types";
import styles from "./styles.module.css";
import { useButton } from "../hooks";
import { useRipple } from "@shared/hooks/ripple";
import { motion } from "motion/react";
import { createMotionProps } from "@shared/lib/motion";
import { RippleMotionTransition, RippleMotionVariants } from "./motion";

export const Button = <T extends ElementType = "button">({
	as,
	variant = "ghost",
	color = "primary",
	withShadow,
	isDisabled = false,
	rippleDisabled = false,
	iconOnly,
	className,
	children,
	...rest
}: ButtonProps<T>) => {
	const { Component, props } = useButton<T>({ as, isDisabled, ...rest });
	const { rippleContainerRef, ripples, handleRipple } = useRipple({
		duration: 600,
	});

	const buttonClasses = `
    ${styles.Button} 
    ${styles[`Button-${variant}`]} 
    ${styles[`ColorProvider-${color}`]} 
    ${withShadow ? styles.WithShadow : ""} 
    ${iconOnly ? styles.IconOnly : ""} 
    ${isDisabled ? styles.Disabled : ""} 
    ${className || ""}
  `.trim();

	return (
		<Component className={buttonClasses} {...props}>
			{(!rippleDisabled || isDisabled) && (
				<div
					className={`${styles.RippleContainer}`}
					onClick={handleRipple}
					ref={rippleContainerRef}
					aria-hidden={true}
				>
					{ripples.map((ripple) => (
						<motion.span
							key={ripple.id}
							className={`${styles.Ripple}`}
							style={{
								top: ripple.y,
								left: ripple.x,
								width: ripple.size,
								height: ripple.size,
							}}
							{...createMotionProps({
								variants: RippleMotionVariants,
								transition: RippleMotionTransition,
							})}
							aria-hidden={true}
						/>
					))}
				</div>
			)}
			{children}
		</Component>
	);
};

Button.displayName = "ShaligulaUI.Button";
