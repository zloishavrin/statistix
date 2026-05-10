import { useTaskQuery } from "@entities/task";
import { useParams } from "@tanstack/react-router";

export const useTask = () => {
	const { id } = useParams({ strict: false });
	const { data: task, isLoading, isError } = useTaskQuery(id);

	return {
		task,
		isLoading,
		isError,
	};
};
