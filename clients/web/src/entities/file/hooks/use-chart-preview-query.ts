import { useQuery } from "@tanstack/react-query";
import { FilePreviewService } from "../api";

export const useChartPreviewQuery = (fileId: string) => {
	return useQuery({
		queryKey: ["get-chart-preview", fileId],
		queryFn: () => FilePreviewService.getChartPreview(fileId),
	});
};
