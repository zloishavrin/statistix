import type { TaskStatus } from "./task-status.types";

export interface ITaskListRequest {
	page: number;
	limit: number;
	sort?: "asc" | "desc";
	status?: TaskStatus;
}
