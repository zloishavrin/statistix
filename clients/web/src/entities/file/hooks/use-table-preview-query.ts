import { useQuery } from "@tanstack/react-query";
import { FilePreviewService } from "../api";

export const useTablePreviewQuery = (fileId: string) => {
	return useQuery({
		queryKey: ["get-table-preview", fileId],
		queryFn: () => FilePreviewService.getTablePreview(fileId),
	});
};
