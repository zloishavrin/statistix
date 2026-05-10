export interface ICreateTaskRequest {
	extension: string;
	method: string;
	params?: TaskParamRequest[];
	columns?: TaskTableRequest;
}

export interface TaskParamRequest {
	param: string;
	value: number;
}

export interface TaskTableRequest {
	file: string;
	columns?: TaskColumnRequest[];
	multipleColumns?: TaskMultipleColumnRequest[];
}

export interface TaskColumnRequest {
	column: string;
	index: number;
}

export interface TaskMultipleColumnRequest {
	column: string;
	index: number[];
}
