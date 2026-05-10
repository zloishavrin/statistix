import { ExtensionMethodCard } from "@entities/extension";
import type { MethodGridProps } from "../types";
import styles from "./styles.module.css";
import { Link } from "@tanstack/react-router";
import { useMethodGrid } from "../hooks";

export const MethodGrid = ({ extensionId, methods }: MethodGridProps) => {
	const { isMobile } = useMethodGrid();

	return (
		<div className={`${styles.Container}`}>
			{methods.map((method, index) => (
				<ExtensionMethodCard
					key={`${index}-${extensionId}-${method.id}`}
					method={method}
					as={Link}
					to={`/method/${extensionId}/${method.id}`}
					disabledPaddingLeft={isMobile ? true : index % 3 === 0}
					disabledPaddingTop={isMobile ? index === 0 : index / 3 < 1}
				/>
			))}
		</div>
	);
};
