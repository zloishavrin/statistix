import axios, { type AxiosError } from "axios";
import type { RetryRequestConfig } from "./types";

export const API_URL = import.meta.env.VITE_API_URL;

export const $api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

export const $authApi = axios.create({
	baseURL: API_URL,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export function attachI18nInterceptor(getLanguageCode: () => string | null) {
	$api.interceptors.request.use((config) => {
		const languageCode = getLanguageCode();
		config.headers["Accept-Language"] = languageCode;
		return config;
	});
}

export function attachTokenProvider(
	getToken: () => string | null,
	refreshTokenFn: () => Promise<string>,
	onLogout: () => void,
	setToken: (token: string) => void,
) {
	$api.interceptors.request.use((config) => {
		const token = getToken();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	});

	$api.interceptors.response.use(
		(res) => res,
		async (error: AxiosError) => {
			const originalRequest = error.config as RetryRequestConfig;

			if (!error.response) {
				return Promise.reject(error);
			}

			const status = error.response.status;
			if (status !== 401 && status !== 403) {
				return Promise.reject(error);
			}

			if (originalRequest._retry) {
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				if (!isRefreshing) {
					isRefreshing = true;

					refreshPromise = refreshTokenFn()
						.then((newToken) => {
							setToken(newToken);
							return newToken;
						})
						.catch((err) => {
							onLogout();
							throw err;
						})
						.finally(() => {
							isRefreshing = false;
							refreshPromise = null;
						});
				}

				const newToken = await refreshPromise;

				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				return $api(originalRequest);
			} catch (err) {
				return Promise.reject(err);
			}
		},
	);
}
