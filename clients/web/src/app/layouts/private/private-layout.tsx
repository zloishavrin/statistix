import { Navigate, Outlet } from "@tanstack/react-router";
import styles from "./styles.module.css";
import { Header } from "@widgets/header";
import { useAuthStore } from "@features/authorization";
import { Notification, useNotification } from "@features/notification";
import type { NotificationPayload } from "@features/notification/types";
import { useRef, useState } from "react";
import { Footer } from "@widgets/footer";

export function PrivateLayout() {
	const { refreshToken, accessToken } = useAuthStore();

	const [activeNotification, setActiveNotification] =
		useState<NotificationPayload | null>(null);
	const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const handleCloseNotification = () => {
		setActiveNotification(null);
	};

	const handleNotification = (notification: NotificationPayload) => {
		setActiveNotification(notification);

		if (notificationTimeoutRef.current) {
			clearTimeout(notificationTimeoutRef.current);
		}

		notificationTimeoutRef.current = setTimeout(() => {
			setActiveNotification(null);
		}, 3000);
	};

	useNotification({
		token: accessToken,
		handleNotification,
	});

	if (!refreshToken) {
		return <Navigate to="/home" />;
	}

	return (
		<div className={`${styles.Container}`}>
			<div className={`${styles.Content}`}>
				<Notification
					notification={activeNotification}
					onClose={handleCloseNotification}
				/>
				<Header />
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}
