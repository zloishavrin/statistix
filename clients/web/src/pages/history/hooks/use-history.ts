import { useFileListInfinityQuery, useGetFileMutation } from "@entities/file";
import type { IFile } from "@entities/file/types";
import { useTaskInfinityQuery } from "@entities/task";
import { isTaskStatus, type ITask } from "@entities/task/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useHistory = () => {
	const initialFilePage = 1;
	const limitFile = 8;
	const {
		data: filesData,
		isLoading: isLoadingFileList,
		isError: isErrorFileList,
		fetchNextPage: fetchNextFileListPage,
		hasNextPage: hasNextFileListPage,
		isFetchingNextPage: isFetchingNextFileListPage,
	} = useFileListInfinityQuery({
		page: initialFilePage,
		limit: limitFile,
	});
	const fileLoaderRef = useRef<HTMLDivElement>(null);
	const fileList: IFile[] = filesData?.pages.flatMap((page) => page.list) || [];

	useEffect(() => {
		const element = fileLoaderRef.current;
		if (!element) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNextFileListPage) {
				fetchNextFileListPage();
			}
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, [hasNextFileListPage, fetchNextFileListPage]);

	const { mutateAsync: getFileUrl } = useGetFileMutation();
	const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
		null,
	);

	const handleFile = async (file: IFile) => {
		setDownloadingFileId(file.id);
		try {
			const blobData = await getFileUrl(file.id);
			const url = URL.createObjectURL(blobData);

			const link = document.createElement("a");
			link.href = url;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} finally {
			setDownloadingFileId(null);
		}
	};

	const initialTaskPage = 1;
	const limitTask = 16;
	const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
	const [taskCreateAtSort, setTaskCreatedAtSort] = useState<"asc" | "desc">(
		"desc",
	);
	const {
		data: taskData,
		isLoading: isLoadingTaskList,
		isError: isErrorTaskList,
		fetchNextPage: fetchNextTaskListPage,
		hasNextPage: hasNextTaskListPage,
		isFetchingNextPage: isFetchingNextTaskListPage,
	} = useTaskInfinityQuery({
		page: initialTaskPage,
		limit: limitTask,
		status: isTaskStatus(taskStatusFilter) ? taskStatusFilter : undefined,
		sort: taskCreateAtSort,
	});
	const taskList: ITask[] = taskData?.pages.flatMap((page) => page.list) || [];

	const handleScroll = useCallback(() => {
		const target = window;

		if (
			target.innerHeight + target.scrollY >= document.body.offsetHeight - 50 &&
			hasNextTaskListPage &&
			!isFetchingNextTaskListPage
		) {
			fetchNextTaskListPage();
		}
	}, [hasNextTaskListPage, isFetchingNextTaskListPage, fetchNextTaskListPage]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [hasNextTaskListPage, isFetchingNextTaskListPage, handleScroll]);

	const toggleTaskSort = () => {
		if (taskCreateAtSort === "desc") {
			setTaskCreatedAtSort("asc");
		} else {
			setTaskCreatedAtSort("desc");
		}
	};

	return {
		fileList,
		isLoadingFileList,
		isErrorFileList,
		fetchNextFileListPage,
		hasNextFileListPage,
		isFetchingNextFileListPage,
		handleFile,
		downloadingFileId,
		fileLoaderRef,
		taskList,
		isLoadingTaskList,
		isErrorTaskList,
		fetchNextTaskListPage,
		hasNextTaskListPage,
		isFetchingNextTaskListPage,
		taskStatusFilter,
		setTaskStatusFilter,
		taskCreateAtSort,
		toggleTaskSort,
	};
};
