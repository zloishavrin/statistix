import { useAuthStore } from "@features/authorization";
import { AuthService } from "@features/authorization/api";
import { useLanguageStore } from "@features/languages";
import { attachI18nInterceptor, attachTokenProvider } from "@shared/api";

export const initializeApi = () => {
	const { removeTokens, refreshAccessToken } = useAuthStore.getState();

	attachTokenProvider(
		() => useAuthStore.getState().accessToken,
		async () => {
			const refreshToken = useAuthStore.getState().refreshToken;

			if (!refreshToken) {
				return Promise.reject("No refresh token");
			}

			const response = await AuthService.refreshAccessToken({ refreshToken });
			return response;
		},
		() => removeTokens(),
		(token: string) => refreshAccessToken(token),
	);

	attachI18nInterceptor(() => useLanguageStore.getState().currentLanguage.code);
};
