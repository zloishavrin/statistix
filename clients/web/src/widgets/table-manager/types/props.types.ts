import type {
	IExtensionMethodInputColumn,
	IExtensionMethodInputMultipleColumn,
} from "@entities/extension/types";
import type { IFile } from "@entities/file/types";
import type { IChoisedColumns } from "./choised-columns.types";

export interface TableManagerProps {
	requiredColumns?: IExtensionMethodInputColumn[];
	requiredMultipleColumns?: IExtensionMethodInputMultipleColumn[];
	onChangeFile?: (file: IFile | null) => void;
	onChangeColumns?: (columns: IChoisedColumns[] | null) => void;
}
