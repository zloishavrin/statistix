import { createPortal } from "react-dom";
import type { ModalProps } from "../types";
import { AnimatePresence, motion } from "motion/react";
import styles from "./style.module.css";
import { createMotionProps } from "@shared/lib/motion";
import { containerTransition, containerVariants } from "./motion";
import { useModal } from "../hooks";

const modalRoot = document.getElementById("modals") as HTMLElement;

export const Modal = ({
	isOpen,
	modalKey = "modal",
	children,
	onExitComplete,
	variants,
	transition,
	root,
	...rest
}: ModalProps) => {
	useModal({
		locked: isOpen,
	});

	return createPortal(
		<AnimatePresence mode="wait" onExitComplete={onExitComplete}>
			{isOpen ? (
				<motion.div
					className={styles.Container}
					key={modalKey}
					{...createMotionProps({
						variants: variants || containerVariants,
						transition: transition || containerTransition,
					})}
					{...rest}
				>
					{children}
				</motion.div>
			) : null}
		</AnimatePresence>,
		root || modalRoot,
	);
};
