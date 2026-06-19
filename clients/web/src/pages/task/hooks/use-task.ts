import type { TablePreviewProps } from "@entities/file/ui/table-preview/types";
import { useTaskQuery } from "@entities/task";
import { useParams } from "@tanstack/react-router";

export const useTask = () => {
	const { id } = useParams({ strict: false });
	const { data: task, isLoading, isError } = useTaskQuery(id);

	const inputTableVisibleOptions: TablePreviewProps["visibleOptions"] = [
		...(task && task.inputColumns && task.inputColumns.columns
			? task.inputColumns.columns.map((column) => ({
					index: column.index,
					description: column.description,
					name: column.title,
				}))
			: []),
		...(task && task.inputColumns && task.inputColumns.multipleColumns
			? task.inputColumns.multipleColumns.flatMap((column) =>
					column.index.map((index) => ({
						index,
						name: column.title,
						description: column.description,
					})),
				)
			: []),
	];

	const resultTableVisibleOptions: TablePreviewProps["visibleOptions"] = [
		...(task &&
		task.result &&
		task.result.columns &&
		task.result.columns.columns
			? task.result.columns.columns.map((column) => ({
					index: column.index,
					description: column.description,
					name: column.title,
				}))
			: []),
		...(task &&
		task.result &&
		task.result.columns &&
		task.result.columns.multipleColumns
			? task.result.columns.multipleColumns.flatMap((column) =>
					column.index.map((index) => ({
						index,
						name: column.title,
						description: column.description,
					})),
				)
			: []),
	];

	return {
		task,
		isLoading,
		isError,
		inputTableVisibleOptions,
		resultTableVisibleOptions,
	};
};
