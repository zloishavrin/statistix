import type { IFileColumnPreviewResponse } from "@entities/file/types";

export const mapToReChartFormat = (data: IFileColumnPreviewResponse[]) => {
	const maxLength = Math.max(...data.map((col) => col.values.length));

	const array = Array.from({ length: maxLength }, (_, index) => {
		const point = { index };

		for (const column of data) {
			if (column.name) {
				point[column.name] = column.values[index];
			}
		}

		return point;
	});

	return array;
};
