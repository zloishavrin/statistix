export const TASK_STATUSES = ["IN_QUEUE", "IN_PROGRESS", "COMPLETED", "FAILED"];

export type TaskStatus = (typeof TASK_STATUSES)[number];

export function isTaskStatus(value: unknown): value is TaskStatus {
	return typeof value === "string" && TASK_STATUSES.includes(value);
}
