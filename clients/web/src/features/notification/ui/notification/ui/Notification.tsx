import { AnimatePresence, motion } from "motion/react";
import type { NotificationProps } from "../types";
import styles from "./styles.module.css";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { createMotionProps } from "@shared/lib/motion";
import { notificationVariants, notificationTransition } from "./motion";
import { CloseIcon } from "@shared/ui/icons";

export const Notification = ({ notification, onClose }: NotificationProps) => {
	const { t } = useTranslation("notification");
	const navigate = useNavigate();

	const handleClick = () => {
		if (notification) {
			navigate({
				to: `/task/${notification.id}`,
			});
		}
	};

	return (
		<AnimatePresence mode="wait">
			{notification && (
				<motion.button
					className={`
            ${styles.Container} 
            ${notification.status === "failed" ? styles.Failed : styles.Success}
          `}
					key="notification"
					role="alert"
					{...createMotionProps({
						variants: notificationVariants,
						transition: notificationTransition,
					})}
					onClick={handleClick}
				>
					<div
						className={styles.IconContainer}
						role="button"
						onClick={(event) => {
							event.stopPropagation();
							onClose?.();
						}}
					>
						<CloseIcon
							color={
								notification.status === "failed"
									? "hsl(var(--shaligula-ui-color-danger))"
									: "hsl(var(--shaligula-ui-color-secondary))"
							}
						/>
					</div>
					<div className={styles.Content}>
						<p className={styles.Title}>{notification.title}</p>
						<p className={styles.Description}>
							{notification.status === "failed" ? t("failed") : t("success")}
						</p>
					</div>
				</motion.button>
			)}
		</AnimatePresence>
	);
};
