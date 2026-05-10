import { Outlet } from "@tanstack/react-router";
import styles from "./styles.module.css";

export function PublicLayout() {
	return (
		<div className={`${styles.Container}`}>
			<Outlet />
		</div>
	);
}
