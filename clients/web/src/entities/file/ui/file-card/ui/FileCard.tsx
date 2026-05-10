import { TableIcon } from "@shared/ui/icons";
import type { FileCardProps } from "../types";
import styles from "./styles.module.css";
import { formatDate } from "@shared/lib/date";
import { Spinner } from "@shared/ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { createMotionProps } from "@shared/lib/motion";
import { fileIconTransition, fileIconVariants } from "./motion";
import { useTranslation } from "react-i18next";

export const FileCard = ({
	file,
	variant = "outlined",
	isLoading = false,
	onClick,
	className = "",
}: FileCardProps) => {
	const { i18n } = useTranslation();

	return (
		<button
			className={`
        ${styles.Container} 
        ${variant === "outlined" ? styles.Outlined : ""} 
        ${variant === "light" ? styles.Light : ""} 
        ${className}
      `}
			onClick={onClick}
		>
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.div
						className={styles.IconContainer}
						key="loader-file-icon"
						{...createMotionProps({
							variants: fileIconVariants,
							transition: fileIconTransition,
						})}
					>
						<Spinner variant="gradient" containerClassName={styles.TableIcon} />
					</motion.div>
				) : (
					<motion.div
						className={styles.IconContainer}
						key="file-icon"
						{...createMotionProps({
							variants: fileIconVariants,
							transition: fileIconTransition,
						})}
					>
						<TableIcon
							className={styles.TableIcon}
							color="hsl(var(--shaligula-ui-color-primary))"
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<div className={styles.DescriptionContainer}>
				<p className={styles.Name}>{file.name}</p>
				<p className={styles.Size}>{file.size}</p>
			</div>

			<div className={styles.Date}>
				{formatDate({ dateString: file.createdAt, i18n })}
			</div>
		</button>
	);
};
