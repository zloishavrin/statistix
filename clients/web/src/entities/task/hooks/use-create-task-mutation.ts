import { useMutation } from "@tanstack/react-query";
import { TaskService } from "../api";

export const useCreateTaskMutation = () => {
	return useMutation({
		mutationFn: TaskService.createTask,
		onError: (error) => {
			throw new Error(error.message);
		},
	});
};
