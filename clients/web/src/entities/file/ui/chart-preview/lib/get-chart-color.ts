import { chartColors } from "../const";

export const getChartColor = (index: number) => {
	const colorIndex = index % chartColors.length;
	return chartColors[colorIndex];
};
