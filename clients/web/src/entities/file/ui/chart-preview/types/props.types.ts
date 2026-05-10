import type { ChartPreviewMode } from "./mode.types";

export interface ChartPreviewProps {
	fileId: string;
	visibleOptions?: {
		index: number;
		name: string;
		description: string;
	}[];
	mode?: ChartPreviewMode;
}
