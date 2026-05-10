import type { IFileColumnPreviewResponse } from "@entities/file/types";

export interface TablePreviewProps {
	fileId: string;
	selectableTitle?: string;
	selectedColumnsIndex?: number[];
	onSelectColumn?: (column: IFileColumnPreviewResponse, index: number) => void;
	onConfirm?: () => void;
	confirmDisabled?: boolean;
	visibleOptions?: {
		index: number;
		name: string;
		description: string;
	}[];
}
