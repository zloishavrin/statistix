import { $api } from "@shared/api";
import type { IFilePreviewResponse } from "../types";

export class FilePreviewService {
	static route = "/api/file-preview";

	static async getTablePreview(fileId: string): Promise<IFilePreviewResponse> {
		const response = await $api.get(
			`${FilePreviewService.route}/table/${fileId}`,
		);
		return response.data;
	}

	static async getChartPreview(fileId: string): Promise<IFilePreviewResponse> {
		const response = await $api.get(
			`${FilePreviewService.route}/chart/${fileId}`,
		);
		return response.data;
	}
}
