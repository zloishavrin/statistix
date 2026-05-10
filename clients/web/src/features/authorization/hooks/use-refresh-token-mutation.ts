import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { AuthService } from "../api";

export const useRefreshTokenMutation = () => {
	const { refreshToken, refreshAccessToken, removeTokens } = useAuthStore();

	return useMutation({
		mutationFn: () => {
			if (!refreshToken) throw new Error();
			return AuthService.refreshAccessToken({ refreshToken });
		},
		onSuccess: (token) => {
			refreshAccessToken(token);
		},
		onError: () => {
			removeTokens();
		},
	});
};
