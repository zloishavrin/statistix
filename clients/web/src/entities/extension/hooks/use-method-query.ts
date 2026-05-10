import { useQuery } from "@tanstack/react-query";
import { ExtensionService } from "../api";
import type { IMethodRequest } from "../types";

export const useMethodQuery = ({ extensionId, methodId }: IMethodRequest) => {
	return useQuery({
		queryKey: ["get-method", extensionId, methodId],
		queryFn: () =>
			ExtensionService.getMethod({
				extensionId,
				methodId,
			}),
	});
};
