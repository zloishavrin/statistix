import { Skeleton } from "@shared/ui/skeleton";
import { useMethod } from "../hooks";
import styles from "./styles.module.css";
import { ReturnButton } from "@widgets/return-button";
import { Spinner } from "@shared/ui/spinner";
import { TableManager } from "@widgets/table-manager";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";

export const Method = () => {
	const {
		method,
		formError,
		setFileId,
		handleCreateTask,
		handleChangeColumns,
		handleChangeParam,
		t,
	} = useMethod();

	return (
		<div className={styles.Container}>
			<aside className={`${styles.Bar}`}>
				{method ? (
					<p className={styles.BarDescription}>{method.description}</p>
				) : (
					<Skeleton className={`${styles.BarSkeleton}`} />
				)}
			</aside>
			<main className={styles.Content}>
				<ReturnButton />
				{method ? (
					<>
						<h1 className={styles.Title}>{method.title}</h1>

						{method.params && method.params.length > 0 && (
							<div className={styles.InputParamGrid}>
								{method.params.map((param, index, array) => (
									<Input
										key={param.id}
										type="number"
										min={param.min}
										max={param.max}
										step="any"
										isRequired={param.isRequired}
										className={styles.InputParamItem}
										onValueChange={(value) =>
											handleChangeParam(param.id, Number(value))
										}
										labelWrapperStyles={{
											zIndex: array.length - index,
											display: "flex",
											justifyContent: "space-between",
											flexDirection: "row",
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

						{((method.columns && method.columns.length > 0) ||
							(method.multipleColumns &&
								method.multipleColumns.length > 0)) && (
							<TableManager
								requiredColumns={method.columns}
								requiredMultipleColumns={method.multipleColumns}
								onChangeFile={(file) => {
									if (file) {
										setFileId(file.id);
									} else {
										setFileId(file);
									}
								}}
								onChangeColumns={handleChangeColumns}
							/>
						)}
					</>
				) : (
					<div className={styles.LoaderContainer}>
						<Spinner />
					</div>
				)}

				{formError && <p className={styles.ErrorMessage}>{formError}</p>}

				<Button onClick={handleCreateTask}>{t("start")}</Button>
			</main>
		</div>
	);
};
