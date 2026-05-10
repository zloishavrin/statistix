import type { DataPreviewMode } from "./mode.types";

export interface UseDataPreviewProps {
	fileId: string;
	visibleOptions?: {
		index: number;
		name: string;
		description: string;
	}[];
	defaultMode: DataPreviewMode;
}
