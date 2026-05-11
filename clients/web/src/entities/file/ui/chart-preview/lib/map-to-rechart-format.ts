import type { IFileColumnPreviewResponse } from "@entities/file/types";

export const mapToReChartFormat = (data: IFileColumnPreviewResponse[]) => {
	const maxLength = Math.max(...data.map((col) => col.values.length));

	const array = Array.from({ length: maxLength }, (_, index) => {
		const point = { index };

		for (const column of data) {
			const value = column.values[index];
			if (value == null || Number.isNaN(value)) continue;

			if (column.name) {
				point[column.name] = value;
			}
		}

		return point;
	});

	return array;
};
