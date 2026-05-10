import { Skeleton } from "@shared/ui/skeleton";
import { useTask } from "../hooks";
import styles from "./styles.module.css";
import { ReturnButton } from "@widgets/return-button";
import { Spinner } from "@shared/ui/spinner";
import { TablePreview } from "@entities/file";
import type { TablePreviewProps } from "@entities/file/ui/TablePreview/types";
import { useTranslation } from "react-i18next";
import { Input } from "@shared/ui/input";
import { DataPreview } from "@widgets/data-preview";

export const Task = () => {
	const { task } = useTask();
	const { t } = useTranslation("task");

	const inputTableVisibleOptions: TablePreviewProps["visibleOptions"] = [
		...(task && task.inputColumns && task.inputColumns.columns
			? task.inputColumns.columns.map((column) => ({
					index: column.index,
					description: column.description,
					name: column.title,
				}))
			: []),
		...(task && task.inputColumns && task.inputColumns.multipleColumns
			? task.inputColumns.multipleColumns.flatMap((column) =>
					column.index.map((index) => ({
						index,
						name: column.title,
						description: column.description,
					})),
				)
			: []),
	];

	const resultTableVisibleOptions: TablePreviewProps["visibleOptions"] = [
		...(task &&
		task.result &&
		task.result.columns &&
		task.result.columns.columns
			? task.result.columns.columns.map((column) => ({
					index: column.index,
					description: column.description,
					name: column.title,
				}))
			: []),
		...(task &&
		task.result &&
		task.result.columns &&
		task.result.columns.multipleColumns
			? task.result.columns.multipleColumns.flatMap((column) =>
					column.index.map((index) => ({
						index,
						name: column.title,
						description: column.description,
					})),
				)
			: []),
	];

	return (
		<div className={styles.Container}>
			<aside className={`${styles.Bar}`}>
				{task ? (
					<p className={styles.BarDescription}>{task.description}</p>
				) : (
					<Skeleton className={`${styles.BarSkeleton}`} />
				)}
			</aside>
			<main className={styles.Content}>
				<ReturnButton />
				{task ? (
					<>
						<h1 className={styles.Title}>{task.title}</h1>

						{task.inputParams && task.inputParams.length > 0 && (
							<div className={styles.InputParamGrid}>
								{task.inputParams.map((param, index, array) => (
									<Input
										value={param.value.toString()}
										disabled
										key={param.id}
										className={styles.InputParamItem}
										labelWrapperStyles={{
											zIndex: array.length - index,
										}}
										label={
											<div className={styles.LabelContainer}>
												<p>{param.title}</p>
												<div className={styles.QuestLabel}>
													<p className={styles.QuestLabelText}>?</p>
													<div className={styles.HelpContainer}>
														<p>{param.description}</p>
													</div>
												</div>
											</div>
										}
									/>
								))}
							</div>
						)}

						{task.inputColumns && (
							<TablePreview
								fileId={task.inputColumns.file}
								visibleOptions={inputTableVisibleOptions}
							/>
						)}

						<h2 className={styles.Subtitle}>{t("results")}</h2>

						{task.errorMessage && (
							<div className={styles.ErrorMessageContainer}>
								<p>{task.errorMessage}</p>
							</div>
						)}

						{(task.status === "IN_PROGRESS" || task.status === "IN_QUEUE") && (
							<div className={styles.LoaderContainer}>
								<Spinner variant="gradient" />
							</div>
						)}

						{task.result &&
							task.result.params &&
							task.result.params.length > 0 && (
								<div className={styles.OutputParamGrid}>
									{task.result.params.map((param) => (
										<Input
											value={param.value.toString()}
											disabled
											key={param.id}
											label={
												<div className={styles.LabelContainer}>
													<p>{param.title}</p>
													<div className={styles.QuestLabel}>
														<p className={styles.QuestLabelText}>?</p>
														<div className={styles.HelpContainer}>
															<p>{param.description}</p>
														</div>
													</div>
												</div>
											}
										/>
									))}
								</div>
							)}

						{task.result && task.result.columns && (
							<DataPreview
								fileId={task.result.columns.file}
								defaultMode={
									task.result.columns.defaultVisualisation === "chart"
										? "line-chart"
										: "table"
								}
								visibleOptions={resultTableVisibleOptions}
							/>
						)}
					</>
				) : (
					<div className={styles.LoaderContainer}>
						<Spinner />
					</div>
				)}
			</main>
		</div>
	);
};
