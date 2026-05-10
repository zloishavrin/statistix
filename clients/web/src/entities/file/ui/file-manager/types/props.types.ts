import type { IFile } from "@entities/file/types";

export interface FileManagerProps {
	selectedFile: IFile | null;
	setSelectedFile: (file: IFile | null) => void;
}
