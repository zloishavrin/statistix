import type { ElementType } from "react";
import type { ExtensionMethodCardProps } from "../types";
import styles from "./styles.module.css";
import { useExtensionMethodCard } from "../hooks";
import { useLineCount } from "@shared/hooks/line-count";

export const ExtensionMethodCard = <T extends ElementType = "div">({
	method,
	as,
	disabledPaddingLeft = false,
	disabledPaddingTop = false,
	...rest
}: ExtensionMethodCardProps<T>) => {
	const { Component } = useExtensionMethodCard<T>({ as });
	const { ref: titleRef, lines: titleLines } =
		useLineCount<HTMLParagraphElement>();
	const descriptionClamp = titleLines >= 2 ? 2 : 3;

	return (
		<Component
			className={`
        ${styles.Container} 
        ${disabledPaddingLeft ? styles.DisabledPaddingLeft : ""}
      `}
			{...rest}
		>
			<div
				className={`
          ${styles.Content} 
          ${disabledPaddingTop ? styles.DisabledPaddingTop : ""}
        `}
			>
				<p className={styles.Title} ref={titleRef}>
					{method.title}
				</p>
				<p
					className={styles.Description}
					style={{
						WebkitLineClamp: descriptionClamp,
					}}
				>
					{method.description}
				</p>
			</div>
			<div className={`${styles.Divider}`}></div>
		</Component>
	);
};
