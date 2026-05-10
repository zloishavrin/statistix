import { Children, isValidElement, type FormEvent, forwardRef } from "react";
import styles from "./styles.module.css";
import type { FormProps } from "../types";
import { Button } from "@shared/ui/button";

export const Form = forwardRef<HTMLFormElement, FormProps>(
	({ onSubmit, className, children, errors, errorClassName, ...rest }, ref) => {
		const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
			if (!onSubmit) return;
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			const data = Object.fromEntries(formData.entries());
			onSubmit(event, data);
		};

		return (
			<form
				ref={ref}
				className={`
        ${styles.FormContainer} 
        ${className || ""}
      `}
				onSubmit={handleSubmit}
				{...rest}
			>
				{Children.toArray(children).map((child) => {
					if (!isValidElement(child)) return null;

					if (child.type === "button" || child.type === Button) return null;
					return child;
				})}
				{errors &&
					errors.map((error, index) => (
						<p
							key={index}
							className={`
          ${styles.Error} 
          ${errorClassName || ""}
        `}
						>
							{error}
						</p>
					))}
				{Children.toArray(children).map((child) => {
					if (!isValidElement(child)) return null;

					if (child.type !== "button" && child.type !== Button) return null;
					return child;
				})}
			</form>
		);
	},
);

Form.displayName = "ShaligulaUI.Form";
