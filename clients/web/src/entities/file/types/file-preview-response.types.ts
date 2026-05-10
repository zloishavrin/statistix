export type IFileValuePreviewResponse = string | number | boolean | null;

export interface IFileColumnPreviewResponse {
	name?: string;
	description?: string;
	values: IFileValuePreviewResponse[];
}

export interface IFilePreviewResponse {
	id: string;
	filename: string;
	columns: IFileColumnPreviewResponse[];
}
