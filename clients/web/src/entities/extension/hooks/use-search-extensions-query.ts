import { useQuery } from "@tanstack/react-query";
import { ExtensionService } from "../api";

export const useSearchExtensionsQuery = (query: string) => {
	return useQuery({
		queryKey: ["search-extensions", query],
		queryFn: () => ExtensionService.searchExtensions(query),
	});
};
