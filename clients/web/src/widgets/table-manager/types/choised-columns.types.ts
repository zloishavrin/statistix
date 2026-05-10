import type { IExtensionMethodInputColumn } from "@entities/extension/types";
import type { IFileColumnPreviewResponse } from "@entities/file/types";

export interface ISingleChoisedColumns extends IExtensionMethodInputColumn {
	type: "single";
	tableIndex: number[];
	values?: IFileColumnPreviewResponse["values"];
}

export interface IMultipleChoisedColumns extends IExtensionMethodInputColumn {
	type: "multiple";
	tableIndex: number[];
	values: IFileColumnPreviewResponse["values"][];
}

export type IChoisedColumns = ISingleChoisedColumns | IMultipleChoisedColumns;
