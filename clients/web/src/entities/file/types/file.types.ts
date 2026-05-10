export interface IFile {
	id: string;
	size: string;
	name: string;
	createdAt: string;
}

export interface IUploadFileRequest {
	onProgress?: (progress: number) => void;
}
