import { useMethodQuery } from "@entities/extension";
import { useCreateTaskMutation } from "@entities/task";
import type {
	TaskColumnRequest,
	TaskMultipleColumnRequest,
	TaskParamRequest,
} from "@entities/task/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { IChoisedColumns } from "@widgets/table-manager/types/choised-columns.types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useMethod = () => {
	const { t } = useTranslation("method");
	const { extensionId, methodId } = useParams({ strict: false });
	const navigate = useNavigate();

	const {
		data: method,
		isLoading,
		isError,
	} = useMethodQuery({
		extensionId,
		methodId,
	});

	const [formError, setFormError] = useState<string | null>(null);
	const [fileId, setFileId] = useState<string | null>(null);
	const [columns, setColumns] = useState<TaskColumnRequest[] | null>(null);
	const [multipleColumns, setMultipleColumns] = useState<
		TaskMultipleColumnRequest[] | null
	>(null);
	const [params, setParams] = useState<TaskParamRequest[] | null>(null);

	const {
		mutateAsync: createTask,
		isPending: isCreatingTask,
		isError: isCreateTaskError,
	} = useCreateTaskMutation();

	const handleChangeColumns = (choisedColumns: IChoisedColumns[] | null) => {
		if (!choisedColumns) {
			setColumns(null);
			setMultipleColumns(null);
			return;
		}

		const newSingleColumns: TaskColumnRequest[] = [];
		const newMultipleColumns: TaskMultipleColumnRequest[] = [];

		choisedColumns.forEach((column) => {
			if (column.type === "single") {
				if (column.tableIndex.length > 0) {
					newSingleColumns.push({
						column: column.id,
						index: column.tableIndex[0],
					});
				}
			} else if (column.type === "multiple") {
				if (column.tableIndex.length > 0) {
					newMultipleColumns.push({
						column: column.id,
						index: column.tableIndex,
					});
				}
			}
		});

		if (newSingleColumns.length > 0) setColumns(newSingleColumns);
		if (newMultipleColumns.length > 0) setMultipleColumns(newMultipleColumns);
	};

	const handleChangeParam = (id: string, value: number) => {
		if (!params) {
			setParams([{ param: id, value }]);
			return;
		}

		const isParamExist = params.some((param) => param.param === id);
		if (isParamExist) {
			setParams(
				params.map((param) => {
					if (param.param === id) {
						return {
							...param,
							value,
						};
					}
					return param;
				}),
			);
		} else {
			setParams([...params, { param: id, value }]);
		}
	};

	const handleCreateTask = async () => {
		const isValid = validate();
		if (!isValid) return;

		const { task } = await createTask({
			extension: extensionId,
			method: methodId,
			columns:
				(columns || multipleColumns) && fileId
					? {
							file: fileId,
							columns: columns || undefined,
							multipleColumns: multipleColumns || undefined,
						}
					: undefined,
			params: params ? params : undefined,
		});
		navigate({
			to: `/task/${task}`,
		});
	};

	const validate = (): boolean => {
		if (!method) {
			setFormError(t("errors.methodNotLoading"));
			return false;
		}

		if (method.columns && method.columns.length > 0) {
			const requiredColumns = method.columns.filter(
				(column) => column.isRequired,
			);
			if (requiredColumns.length > 0) {
				if (!fileId) {
					setFormError(t("errors.tableNotSelected"));
					return false;
				}
				if (!columns) {
					setFormError(
						`${t("errors.seriesNotSelected")} ${method.columns.map((column) => `"${column.title}"`).join(", ")}`,
					);
					return false;
				}

				const inputColumnsSet = new Set<string>();
				columns.forEach((column) => inputColumnsSet.add(column.column));

				const emptyColumnsTitles: string[] = [];
				requiredColumns.forEach((column) => {
					if (!inputColumnsSet.has(column.id) && column.isRequired) {
						emptyColumnsTitles.push(column.title);
					}
				});

				if (emptyColumnsTitles.length > 0) {
					setFormError(
						`${t("errors.paramsNotSelected")}: ${emptyColumnsTitles.map((column) => `"${column}"`).join(", ")}`,
					);
					return false;
				}
			}
		}

		if (method.multipleColumns && method.multipleColumns.length > 0) {
			const requiredMultipleColumns = method.multipleColumns.filter(
				(column) => column.isRequired,
			);
			if (requiredMultipleColumns.length > 0) {
				if (!fileId) {
					setFormError(t("errors.tableNotSelected"));
					return false;
				}
				if (!multipleColumns) {
					setFormError(
						`${t("errors.seriesNotSelected")} ${method.multipleColumns.map((column) => `"${column.title}"`).join(", ")}`,
					);
					return false;
				}

				const inputColumnsSet = new Set<string>();
				multipleColumns.forEach((column) => inputColumnsSet.add(column.column));

				const emptyColumnsTitles: string[] = [];
				requiredMultipleColumns.forEach((column) => {
					if (!inputColumnsSet.has(column.id) && column.isRequired) {
						emptyColumnsTitles.push(column.title);
					}
				});

				if (emptyColumnsTitles.length > 0) {
					setFormError(
						`${t("errors.paramsNotSelected")}: ${emptyColumnsTitles.map((column) => `"${column}"`).join(", ")}`,
					);
					return false;
				}
			}
		}

		if (method.params) {
			const requiredParams = method.params.filter((param) => param.isRequired);
			if (requiredParams.length > 0) {
				if (!params) {
					setFormError(
						`${t("errors.paramsNotSelected")} ${method.params.map((param) => `"${param.title}"`).join(", ")}`,
					);
					return false;
				}

				const inputParamsSet = new Set<string>();
				params.forEach((param) => inputParamsSet.add(param.param));

				const emptyParamsTitles: string[] = [];
				requiredParams.forEach((param) => {
					if (!inputParamsSet.has(param.id)) {
						emptyParamsTitles.push(param.title);
					}
				});

				if (emptyParamsTitles.length > 0) {
					setFormError(
						`${t("errors.paramsNotSelected")}: ${emptyParamsTitles.map((param) => `"${param}"`).join(", ")}`,
					);
					return false;
				}
			}
		}

		return true;
	};

	return {
		method,
		isLoading,
		isError,
		formError,
		handleCreateTask,
		isCreatingTask,
		isCreateTaskError,
		setFileId,
		handleChangeColumns,
		handleChangeParam,
		t,
	};
};
