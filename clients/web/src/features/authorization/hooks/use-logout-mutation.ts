import { useMutation } from "@tanstack/react-query";
import { AuthService, useAuthStore } from "@features/authorization";

export const useLogoutMutation = () => {
	const removeTokens = useAuthStore((state) => state.removeTokens);

	return useMutation({
		mutationFn: AuthService.logout,
		onSuccess: () => {
			removeTokens();
		},
	});
};
