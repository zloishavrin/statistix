import { useTablePreviewQuery } from "@entities/file";
import type { UseTablePreviewProps } from "../types";
import { useMemo } from "react";
import type { IFileColumnPreviewResponse } from "@entities/file/types";

export const useTablePreview = ({
	fileId,
	visibleOptions,
}: UseTablePreviewProps) => {
	const { data, isLoading } = useTablePreviewQuery(fileId);

	const columns = useMemo<IFileColumnPreviewResponse[] | undefined>(() => {
		if (!data) {
			return undefined;
		}

		if (!visibleOptions) {
			return data.columns;
		}

		return visibleOptions.reduce<IFileColumnPreviewResponse[]>(
			(acc, columnOptions) => {
				const columnItem = data.columns[columnOptions.index];

				if (columnItem) {
					acc.push({
						...columnItem,
						name: columnOptions.name,
						description: columnOptions.description,
					});
				}

				return acc;
			},
			[],
		);
	}, [data, visibleOptions]);

	return {
		columns,
		isLoading,
	};
};
