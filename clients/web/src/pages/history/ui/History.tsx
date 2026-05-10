import { FileCard } from "@entities/file";
import { useHistory } from "../hooks";
import styles from "./styles.module.css";
import { Skeleton } from "@shared/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@shared/lib/date";
import { Select, SelectItem } from "@shared/ui/select";
import type { TaskStatus } from "@entities/task/types";
import { ArrowIcon } from "@shared/ui/icons";
import { Spinner } from "@shared/ui/spinner";
import { useTranslation } from "react-i18next";

export const History = () => {
	const {
		fileList,
		isLoadingFileList,
		isErrorFileList,
		isFetchingNextFileListPage,
		handleFile,
		downloadingFileId,
		fileLoaderRef,
		taskList,
		isLoadingTaskList,
		isFetchingNextTaskListPage,
		taskStatusFilter,
		setTaskStatusFilter,
		taskCreateAtSort,
		toggleTaskSort,
	} = useHistory();
	const { t, i18n } = useTranslation("history");

	const TaskStatusTitles: Record<TaskStatus, string> = {
		IN_QUEUE: t("task_statuses.inQueue"),
		IN_PROGRESS: t("task_statuses.inProgress"),
		COMPLETED: t("task_statuses.completed"),
		FAILED: t("task_statuses.failed"),
	};

	return (
		<div className={styles.Container}>
			{!isErrorFileList && !(fileList.length === 0 && !isLoadingFileList) && (
				<aside className={`${styles.Bar}`}>
					{isLoadingFileList &&
						Array.from({ length: 8 }).map((_, index) => (
							<Skeleton
								key={`skeleton-file-card-${index}`}
								className={styles.FileCardSkeleton}
							/>
						))}

					{fileList.length > 0 &&
						fileList.map((file) => (
							<FileCard
								key={file.id}
								file={file}
								variant="light"
								isLoading={downloadingFileId === file.id}
								onClick={() => handleFile(file)}
								className={styles.FileCard}
							/>
						))}

					<div ref={fileLoaderRef}>
						{isFetchingNextFileListPage &&
							Array.from({ length: 8 }).map((_, index) => (
								<Skeleton
									key={`skeleton-file-card-${index}`}
									className={styles.FileCardSkeleton}
								/>
							))}
					</div>
				</aside>
			)}

			<main className={`${styles.Content}`}>
				<div className={styles.TaskTable}>
					<div className={styles.TaskHeader}>
						<div
							className={`
              ${styles.TaskHeaderElement}
            `}
						>
							{t("header.name")}
						</div>
						<div
							className={`
              ${styles.TaskHeaderElement} 
              ${styles.TaskStatusSelectContainer} 
            `}
						>
							<Select
								className={styles.TaskStatusSelect}
								buttonClassName={styles.TaskStatusSelectButton}
								defaultValue="all"
								label={<p>{t("task_statuses.title")}</p>}
								value={taskStatusFilter}
								onValueChange={setTaskStatusFilter}
							>
								<SelectItem value={"all"}>{t("task_statuses.all")}</SelectItem>
								<SelectItem value={"IN_QUEUE"}>
									{TaskStatusTitles["IN_QUEUE"]}
								</SelectItem>
								<SelectItem value={"IN_PROGRESS"}>
									{TaskStatusTitles["IN_PROGRESS"]}
								</SelectItem>
								<SelectItem value={"COMPLETED"}>
									{TaskStatusTitles["COMPLETED"]}
								</SelectItem>
								<SelectItem value={"FAILED"}>
									{TaskStatusTitles["FAILED"]}
								</SelectItem>
							</Select>
						</div>
						<div
							className={`
                ${styles.TaskHeaderElement} 
                ${styles.TaskCreatedAt}
              `}
							role="button"
							onClick={toggleTaskSort}
						>
							<p>{t("header.createdAt")}</p>
							<span
								className={`
                  ${styles.TaskCreatedAtIcon} 
                  ${taskCreateAtSort === "asc" ? styles.Reverese : ""}
                `}
							>
								<ArrowIcon
									color="hsl(var(--shaligula-ui-color-primary))"
									aria-hidden="true"
								/>
							</span>
						</div>
						<div className={styles.TaskHeaderElement}>
							{t("header.completedAt")}
						</div>
					</div>

					{taskList.map((task) => (
						<Link
							key={task.id}
							className={styles.TaskRow}
							to={`/task/${task.id}`}
						>
							<div
								className={`
                ${styles.TaskRowElement} 
                ${styles.TaskTitle}
              `}
							>
								<p>{task.title}</p>
							</div>
							<div className={`${styles.TaskRowElement}`}>
								{(task.status === "IN_PROGRESS" ||
									task.status === "IN_QUEUE") && <Spinner variant="gradient" />}

								<p
									className={`
                    ${
											task.status === "COMPLETED"
												? styles.IsSuccess
												: task.status === "FAILED"
													? styles.IsFailed
													: ""
										}`}
								>
									{TaskStatusTitles[task.status]}
								</p>
							</div>
							<div className={styles.TaskRowElement}>
								<p>{formatDate({ dateString: task.createdAt, i18n })}</p>
							</div>
							<div className={styles.TaskRowElement}>
								<p>
									{task.completedAt
										? formatDate({ dateString: task.completedAt, i18n })
										: "-"}
								</p>
							</div>
						</Link>
					))}

					{(isLoadingTaskList || isFetchingNextTaskListPage) &&
						Array.from({ length: 8 }).map((_, index) => (
							<Skeleton
								className={styles.TaskRowSkeleton}
								key={`skeleton-task-row-${index}`}
							/>
						))}
				</div>
			</main>
		</div>
	);
};
