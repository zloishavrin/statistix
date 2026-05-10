import { useQuery } from "@tanstack/react-query";
import { ExtensionService } from "../api";

export const useExtensionQuery = (id: string) => {
	return useQuery({
		queryKey: ["get-extensions", id],
		queryFn: () => ExtensionService.getExtensionDetails(id),
	});
};
