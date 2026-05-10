import type { ITask } from "./task.types";

export interface ITaskListResponse {
	list: ITask[];
	isEnd: boolean;
}
