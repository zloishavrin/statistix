import { useQuery } from "@tanstack/react-query";
import { ExtensionService } from "../api";

export const useAllExtensionsQuery = () => {
	return useQuery({
		queryKey: ["get-all-extensions"],
		queryFn: () => ExtensionService.getExtensions(),
	});
};
