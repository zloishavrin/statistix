import type { NotificationPayload } from "@features/notification/types";

export interface NotificationProps {
	notification?: NotificationPayload | null;
	onClose?: () => void;
}
