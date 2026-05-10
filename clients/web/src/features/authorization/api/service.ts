import type {
	ILoginForm,
	ILoginResponse,
	IRegistrationForm,
	IRegistrationResponse,
	IChangePasswordForm,
	IChangePasswordResponse,
	IRefreshTokenRequest,
	IUserResponse,
} from "../types";
import { $api, $authApi } from "@shared/api";

export class AuthService {
	static route = "/api/auth";

	static async login(data: ILoginForm): Promise<ILoginResponse> {
		const response = await $api.post(`${AuthService.route}/login`, data);
		return response.data;
	}

	static async registration(
		data: IRegistrationForm,
	): Promise<IRegistrationResponse> {
		const response = await $api.post(`${AuthService.route}/registration`, data);
		return response.data;
	}

	static async getMe(): Promise<IUserResponse> {
		const response = await $api.get(`${AuthService.route}/me`);
		return response.data;
	}

	static async changePassword(
		data: IChangePasswordForm,
	): Promise<IChangePasswordResponse> {
		const response = await $api.post(
			`${AuthService.route}/change-password`,
			data,
		);
		return response.data;
	}

	static async refreshAccessToken(data: IRefreshTokenRequest): Promise<string> {
		const response = await $authApi.post(`${AuthService.route}/refresh`, data);
		return response.data;
	}

	static async logout(): Promise<void> {
		return $api.post(`${AuthService.route}/logout`);
	}
}
