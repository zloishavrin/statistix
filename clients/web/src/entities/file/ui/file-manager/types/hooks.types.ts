import type { IFile } from "@entities/file/types";

export interface UseFileManagerProps {
	selectedFile: IFile | null;
	setSelectedFile: (file: IFile | null) => void;
}
