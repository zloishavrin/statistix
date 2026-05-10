import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { AuthService } from "../api";

export const useLoginMutation = () => {
	const setTokens = useAuthStore((state) => state.setTokens);

	return useMutation({
		mutationFn: AuthService.login,
		onSuccess: (data) => {
			setTokens(data.accessToken, data.refreshToken);
		},
		onError: (error) => {
			throw new Error(error.message);
		},
	});
};
