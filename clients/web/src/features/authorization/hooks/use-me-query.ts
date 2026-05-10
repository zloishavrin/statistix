import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../api";

export const useMeQuery = () => {
	return useQuery({
		queryKey: ["me"],
		queryFn: () => AuthService.getMe(),
	});
};
