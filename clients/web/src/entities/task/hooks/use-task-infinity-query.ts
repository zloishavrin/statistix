import { useInfiniteQuery } from "@tanstack/react-query";
import type { ITaskListRequest } from "../types";
import { TaskService } from "../api";

export const useTaskInfinityQuery = ({
	page: initialPage,
	limit,
	sort,
	status,
}: ITaskListRequest) => {
	return useInfiniteQuery({
		queryKey: ["get-task-list-infinity", limit, sort, status],
		queryFn: ({ pageParam = 1 }) => {
			const page = Number(pageParam);
			return TaskService.getTaskList({
				page,
				limit,
				sort,
				status,
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.isEnd ? undefined : allPages.length + 1;
		},
		initialPageParam: initialPage,
	});
};
