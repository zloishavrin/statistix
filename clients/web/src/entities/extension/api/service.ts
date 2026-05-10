import { $api } from "@shared/api";
import type {
	IExtension,
	IExtensionDetails,
	IExtensionMethodDetails,
	IMethodRequest,
} from "../types";

export class ExtensionService {
	static route = "/api/extensions";

	static async getExtensions(): Promise<IExtension[]> {
		const response = await $api.get(`${ExtensionService.route}/all`);
		return response.data;
	}

	static async getExtensionDetails(id: string): Promise<IExtensionDetails> {
		const response = await $api.get(
			`${ExtensionService.route}/extension/${id}`,
		);
		return response.data;
	}

	static async searchExtensions(query: string): Promise<IExtensionDetails[]> {
		const response = await $api.get(
			`${ExtensionService.route}/all/details${query.trim().length > 0 ? `?search=${query}` : ""}`,
		);
		return response.data;
	}

	static async getMethod({
		extensionId,
		methodId,
	}: IMethodRequest): Promise<IExtensionMethodDetails> {
		const response = await $api.get(
			`${ExtensionService.route}/method/${extensionId}/${methodId}`,
		);
		return response.data;
	}
}
