import {
	useFileListInfinityQuery,
	useUploadFileMutation,
} from "@entities/file/hooks";
import type { IFile } from "@entities/file/types";
import { useRef, useState, type ChangeEvent } from "react";
import type { UseFileManagerProps } from "../types/hooks.types";

export const useFileManager = ({ setSelectedFile }: UseFileManagerProps) => {
	const initialPage = 1;
	const limit = 8;
	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useFileListInfinityQuery({
		page: initialPage,
		limit,
	});
	const fileList: IFile[] = data?.pages.flatMap((page) => page.list) || [];

	const inputRef = useRef<HTMLInputElement>(null);
	const handleUpload = () => {
		if (!isLoading) {
			inputRef.current?.click();
		}
	};

	const [fileProgress, setFileProgress] = useState<number>(0);
	const {
		mutateAsync: upload,
		isSuccess: isUploadSuccess,
		isError: isUploadError,
		isPending: isUploading,
	} = useUploadFileMutation({
		onProgress: (percent) => setFileProgress(percent),
	});

	const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		setFileProgress(0);

		const file = event.target.files[0];
		const uploadedFile = await upload(file);
		setSelectedFile(uploadedFile);
	};

	return {
		fileList,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		handleUpload,
		inputRef,
		handleFile,
		isUploadError,
		isUploadSuccess,
		isUploading,
		fileProgress,
	};
};
