export interface NotificationPayload {
	id: string;
	title: string;
	status: "completed" | "failed";
}
