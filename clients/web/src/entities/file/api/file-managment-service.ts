import { $api } from "@shared/api";
import type { IFile, IFileListRequest, IFileListResponse } from "../types";

export class FileManagmentService {
	static route = "/api/file-managment";

	static async uploadFile(
		file: File,
		onProgress?: (percent: number) => void,
	): Promise<IFile> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await $api.post(
			`${FileManagmentService.route}/upload`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				maxBodyLength: Infinity,
				onUploadProgress: (progressEvent) => {
					if (onProgress) {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / (progressEvent.total ?? 1),
						);
						onProgress(percentCompleted);
					}
				},
			},
		);
		return response.data;
	}

	static async getFileList({
		page,
		limit,
	}: IFileListRequest): Promise<IFileListResponse> {
		const response = await $api.get(
			`${FileManagmentService.route}/list?page=${page}&limit=${limit}`,
		);
		return response.data;
	}

	static async getFile(fileId: string): Promise<Blob> {
		const response = await $api.get(
			`${FileManagmentService.route}/url/${fileId}`,
			{
				responseType: "blob",
			},
		);
		return response.data;
	}
}
