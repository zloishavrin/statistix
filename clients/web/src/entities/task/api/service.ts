import { $api } from "@shared/api";
import type {
	ICreateTaskRequest,
	ICreateTaskResponse,
	ITaskDetails,
	ITaskListRequest,
	ITaskListResponse,
} from "../types";

export class TaskService {
	static route = "/api/task";

	static async getTask(id: string): Promise<ITaskDetails> {
		const response = await $api.get(`${TaskService.route}/details/${id}`);
		return response.data;
	}

	static async createTask(
		data: ICreateTaskRequest,
	): Promise<ICreateTaskResponse> {
		const response = await $api.post(`${TaskService.route}/create`, data);
		return response.data;
	}

	static async getTaskList({
		page,
		limit,
		sort,
		status,
	}: ITaskListRequest): Promise<ITaskListResponse> {
		let path = `${TaskService.route}/list?page=${page}&limit=${limit}`;
		if (sort) path += `&sort=${sort}`;
		if (status) path += `&status=${status}`;

		const response = await $api.get(path);
		return response.data;
	}
}
