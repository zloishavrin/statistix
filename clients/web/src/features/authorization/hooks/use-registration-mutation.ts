import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../api";

export const useRegistrationMutation = () => {
	return useMutation({
		mutationFn: AuthService.registration,
		onError: (error) => {
			throw new Error(error.message);
		},
	});
};
