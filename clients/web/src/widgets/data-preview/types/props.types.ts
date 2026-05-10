import type { DataPreviewMode } from "./mode.types";

export interface DataPreviewProps {
	fileId: string;
	visibleOptions?: {
		index: number;
		name: string;
		description: string;
	}[];
	defaultMode?: DataPreviewMode;
}
