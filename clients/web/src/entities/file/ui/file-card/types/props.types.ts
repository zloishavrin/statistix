import type { IFile } from "@entities/file/types";

export interface FileCardProps {
	file: IFile;
	variant?: "outlined" | "light";
	isLoading?: boolean;
	onClick?: () => void;
	className?: string;
}
