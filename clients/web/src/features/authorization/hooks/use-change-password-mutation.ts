import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../api";

export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: AuthService.changePassword,
		onError: (error) => {
			throw new Error(error.message);
		},
	});
};
