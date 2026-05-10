import type { IFile } from "./file.types";

export interface IFileListResponse {
	list: IFile[];
	isEnd: boolean;
}
