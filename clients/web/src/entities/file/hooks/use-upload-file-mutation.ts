import { useMutation } from "@tanstack/react-query";
import type { IUploadFileRequest } from "../types";
import { FileManagmentService } from "../api";

export const useUploadFileMutation = ({ onProgress }: IUploadFileRequest) => {
	return useMutation({
		mutationFn: (file: File) =>
			FileManagmentService.uploadFile(file, onProgress),
	});
};
