import { useInfiniteQuery } from "@tanstack/react-query";
import type { IFileListRequest } from "../types";
import { FileManagmentService } from "../api";

export const useFileListInfinityQuery = ({
	page: initialPage,
	limit,
}: IFileListRequest) => {
	return useInfiniteQuery({
		queryKey: ["get-file-infinity-list", limit],
		queryFn: ({ pageParam = 1 }) => {
			const page = Number(pageParam);
			return FileManagmentService.getFileList({ page, limit });
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.isEnd ? undefined : allPages.length + 1;
		},
		initialPageParam: initialPage,
	});
};
