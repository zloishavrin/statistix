import { useEffect } from "react";
import type { UseModalProps } from "../types/hook.types";

export const useModal = ({ locked }: UseModalProps) => {
	useEffect(() => {
		if (locked) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [locked]);
};
