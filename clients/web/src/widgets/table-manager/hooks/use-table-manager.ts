import type { IFile, IFileColumnPreviewResponse } from "@entities/file/types";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import type { UseTableManagerProps } from "../types/hooks.types";
import type {
	IChoisedColumns,
	IMultipleChoisedColumns,
	ISingleChoisedColumns,
} from "../types/choised-columns.types";
import { isArrayOfArrays } from "@shared/lib/array";

export const useTableManager = ({
	requiredColumns,
	requiredMultipleColumns,
	onChangeFile,
	onChangeColumns,
}: UseTableManagerProps) => {
	const baseColumns = useMemo<IChoisedColumns[]>(() => {
		return [
			...(requiredColumns ?? []).map<ISingleChoisedColumns>((column) => ({
				...column,
				type: "single",
				tableIndex: [],
				values: [],
			})),
			...(requiredMultipleColumns ?? []).map<IMultipleChoisedColumns>(
				(column) => ({
					...column,
					type: "multiple",
					tableIndex: [],
					values: [],
				}),
			),
		];
	}, [requiredColumns, requiredMultipleColumns]);

	const [isOpenFileManager, setIsOpenFileManager] = useState(false);
	const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

	const [activeColumnIndex, setActiveColumnIndex] = useState(0);
	const [columns, setColumns] = useState<IChoisedColumns[]>(baseColumns);

	/** UI SIDE-EFFECT **/
	/* eslint-disable react-hooks/set-state-in-effect */
	useEffect(() => {
		if (!selectedFile) return;

		setColumns(baseColumns);
		setActiveColumnIndex(0);
		setIsOpenFileManager(false);
	}, [selectedFile, baseColumns]);
	/* eslint-disable react-hooks/set-state-in-effect */

	const selectableColumn = useMemo(() => {
		return columns[activeColumnIndex] ?? null;
	}, [columns, activeColumnIndex]);

	const hasNextColumn = activeColumnIndex < columns.length;

	useEffect(() => {
		if (!hasNextColumn) {
			setIsOpenFileManager(false);
		}
	}, [hasNextColumn]);

	useEffect(() => {
		onChangeFile?.(selectedFile);
	}, [selectedFile, onChangeFile]);

	const prevRef = useRef<IChoisedColumns[] | null>(null);
	useEffect(() => {
		if (!onChangeColumns) return;

		const choisedColumns = columns.filter(
			(column) => column.tableIndex.length > 0,
		);

		const next = choisedColumns.length ? choisedColumns : null;

		const prev = prevRef.current;

		const isSame =
			prev?.length === next?.length &&
			JSON.stringify(prev) === JSON.stringify(next);

		if (isSame) return;

		prevRef.current = next;
		onChangeColumns(next);
	}, [columns, onChangeColumns]);

	const goNext = useCallback(() => {
		setActiveColumnIndex((i) => i + 1);
	}, []);

	const handleSelectColumn = useCallback(
		(targetColumn: IFileColumnPreviewResponse, index: number) => {
			if (!selectableColumn) return;

			setColumns((prev) => {
				if (!prev) return prev;

				return prev.map((column) => {
					if (column.id !== selectableColumn.id) return column;

					// SINGLE
					if (column.type === "single") {
						return {
							...column,
							tableIndex: [index],
							values: targetColumn.values,
						};
					}

					// MULTIPLE
					const currentIndexes = column.tableIndex ?? [];
					const currentValues = column.values ?? [];

					const hasIndex = currentIndexes.includes(index);

					// REMOVE
					if (hasIndex) {
						const removeIndex = currentIndexes.indexOf(index);

						return {
							...column,
							tableIndex: currentIndexes.filter((_, i) => i !== removeIndex),
							values: currentValues.filter((_, i) => i !== removeIndex),
						};
					}

					// ADD
					return {
						...column,
						tableIndex: [...currentIndexes, index],
						values: [...currentValues, targetColumn.values],
					};
				});
			});

			// SINGLE auto-next
			if (selectableColumn.type === "single") {
				goNext();
			}
		},
		[selectableColumn, goNext],
	);

	const confirmMultipleColumns = useCallback(() => {
		if (!selectableColumn) return;
		if (!selectableColumn.tableIndex.length) return;

		goNext();
	}, [selectableColumn, goNext]);

	const handleRemoveFile = useCallback(() => {
		setSelectedFile(null);
		setColumns(baseColumns);
		setActiveColumnIndex(0);
	}, [baseColumns]);

	const canChoised = activeColumnIndex < baseColumns.length;

	const visibleRows = useMemo(() => {
		return columns.flatMap((column) => {
			const values = column.values ?? [];

			if (!isArrayOfArrays(values)) {
				return [{ column, value: values }];
			}

			return values.map((row) => ({
				column,
				value: row,
			}));
		});
	}, [columns]);

	return {
		isOpenFileManager,
		setIsOpenFileManager,

		selectedFile,
		setSelectedFile,

		selectableColumn,
		handleSelectColumn,

		canChoised,

		columns,

		handleRemoveFile,
		confirmMultipleColumns,

		visibleRows,
	};
};
