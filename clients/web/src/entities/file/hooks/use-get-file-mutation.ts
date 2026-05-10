import { useMutation } from "@tanstack/react-query";
import { FileManagmentService } from "../api";

export const useGetFileMutation = () => {
	return useMutation({
		mutationFn: FileManagmentService.getFile,
	});
};
