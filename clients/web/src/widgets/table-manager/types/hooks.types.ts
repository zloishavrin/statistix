import type {
	IExtensionMethodInputColumn,
	IExtensionMethodInputMultipleColumn,
} from "@entities/extension/types";
import type { IFile } from "@entities/file/types";
import type { IChoisedColumns } from "./choised-columns.types";

export interface UseTableManagerProps {
	requiredColumns?: IExtensionMethodInputColumn[];
	requiredMultipleColumns?: IExtensionMethodInputMultipleColumn[];
	onChangeFile?: (file: IFile | null) => void;
	file?: IFile;
	onChangeColumns?: (columns: IChoisedColumns[] | null) => void;
}
