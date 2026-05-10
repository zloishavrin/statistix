import type { NotificationPayload } from "./notification-payload.types";

export interface NotificationRequestParams {
	token?: string | null;
	handleNotification?: (notification: NotificationPayload) => void;
}
