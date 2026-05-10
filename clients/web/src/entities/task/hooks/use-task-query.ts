import { useQuery } from "@tanstack/react-query";
import { TaskService } from "../api";

export const useTaskQuery = (id: string) => {
	return useQuery({
		queryKey: ["get-task", id],
		queryFn: () => TaskService.getTask(id),
	});
};
