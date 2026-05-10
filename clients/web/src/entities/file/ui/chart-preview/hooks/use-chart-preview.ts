import { useChartPreviewQuery } from "@entities/file/hooks";
import type { LineMode, UseChartPreviewProps } from "../types";
import { useMemo, useState } from "react";
import type { IFileColumnPreviewResponse } from "@entities/file/types";

export const useChartPreview = ({
	fileId,
	visibleOptions,
}: UseChartPreviewProps) => {
	const { data, isLoading } = useChartPreviewQuery(fileId);

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

	const [lineMode, setLineMode] = useState<LineMode>("linear");
	const [xAxisOn, setXAxisOn] = useState<"on" | "off">("on");
	const [yAxisOn, setYAxisOn] = useState<"on" | "off">("off");
	const [legendOn, setLegendOn] = useState<"on" | "off">("on");
	const [gridOn, setGridOn] = useState<"on" | "off">("on");
	const [dotsOn, setDotsOn] = useState<"on" | "off">("on");

	return {
		columns,
		isLoading,
		lineMode,
		setLineMode,
		xAxisOn,
		setXAxisOn,
		yAxisOn,
		setYAxisOn,
		legendOn,
		setLegendOn,
		gridOn,
		setGridOn,
		dotsOn,
		setDotsOn,
	};
};
