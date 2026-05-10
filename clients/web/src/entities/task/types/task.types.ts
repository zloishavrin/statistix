import type { TaskStatus } from "./task-status.types";

export interface ITask {
	id: string;
	title: string;
	status: TaskStatus;
	createdAt: string;
	completedAt?: string;
}

export interface ITaskParam {
	id: string;
	title: string;
	description: string;
	value: number;
}

export interface ITaskColumns {
	file: string;
	defaultVisualisation?: "table" | "chart";
	columns?: {
		id: string;
		title: string;
		description: string;
		index: number;
	}[];
	multipleColumns?: {
		id: string;
		title: string;
		description: string;
		index: number[];
	}[];
}

export interface ITaskDetails {
	id: string;
	title: string;
	description: string;
	inputParams?: ITaskParam[];
	inputColumns?: ITaskColumns;
	status: TaskStatus;
	errorMessage?: string;
	result?: {
		params?: ITaskParam[];
		columns?: ITaskColumns;
	};
	createdAt: string;
	completedAt?: string;
}
