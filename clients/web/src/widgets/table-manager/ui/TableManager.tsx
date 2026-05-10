import { CloseIcon, TableIcon } from "@shared/ui/icons";
import styles from "./styles.module.css";
import type { TableManagerProps } from "../types";
import { useTableManager } from "../hooks";
import { Modal } from "@shared/ui/modal";
import { Button } from "@shared/ui/button";
import { FileManager, TablePreview } from "@entities/file";
import { useTranslation } from "react-i18next";

export const TableManager = ({
	requiredColumns,
	requiredMultipleColumns,
	onChangeFile,
	onChangeColumns,
}: TableManagerProps) => {
	const {
		isOpenFileManager,
		setIsOpenFileManager,
		selectedFile,
		setSelectedFile,
		selectableColumn,
		handleSelectColumn,
		canChoised,
		handleRemoveFile,
		confirmMultipleColumns,
		visibleRows,
	} = useTableManager({
		requiredColumns,
		requiredMultipleColumns,
		onChangeFile,
		onChangeColumns,
	});
	const { t } = useTranslation("tableManager");

	return (
		<>
			{isOpenFileManager && (
				<Modal
					isOpen={isOpenFileManager}
					modalKey="file-manager-modal"
					className={styles.ModalContainer}
					onClick={() => setIsOpenFileManager(false)}
				>
					<div
						className={styles.ModalContent}
						onClick={(event) => event.stopPropagation()}
					>
						<header className={styles.ModalHeader}>
							<Button
								iconOnly
								variant="light"
								onClick={() => setIsOpenFileManager(false)}
							>
								<CloseIcon
									className={styles.ModalCloseIcon}
									color="hsl(var(--shaligula-ui-color-primary))"
								/>
							</Button>
						</header>

						<div className={styles.FileManagerContainer}>
							<FileManager
								selectedFile={selectedFile}
								setSelectedFile={setSelectedFile}
							/>
						</div>
					</div>
				</Modal>
			)}

			{selectedFile !== null && selectableColumn !== null && (
				<Modal
					isOpen={selectedFile !== null && selectableColumn !== null}
					modalKey="table-preview-modal"
					className={`${styles.ModalContainer} ${styles.ModalSecondLayerContainer}`}
					onClick={() => setSelectedFile(null)}
				>
					<div
						className={styles.ModalContent}
						onClick={(event) => event.stopPropagation()}
					>
						<header className={styles.ModalHeader}>
							<Button
								iconOnly
								variant="light"
								onClick={() => setSelectedFile(null)}
							>
								<CloseIcon
									className={styles.ModalCloseIcon}
									color="hsl(var(--shaligula-ui-color-primary))"
								/>
							</Button>
						</header>

						{selectedFile !== null && selectableColumn !== null && (
							<div className={styles.TablePreviewContainer}>
								<TablePreview
									fileId={selectedFile.id}
									selectableTitle={selectableColumn.title}
									selectedColumnsIndex={
										selectableColumn.type === "multiple"
											? selectableColumn.tableIndex
											: []
									}
									onSelectColumn={handleSelectColumn}
									onConfirm={
										selectableColumn.type === "multiple"
											? confirmMultipleColumns
											: undefined
									}
									confirmDisabled={
										selectableColumn.isRequired &&
										selectableColumn.tableIndex.length === 0
									}
								/>
							</div>
						)}
					</div>
				</Modal>
			)}

			{canChoised ? (
				<button
					className={styles.Container}
					onClick={() => setIsOpenFileManager(true)}
				>
					<TableIcon
						color="hsla(var(--shaligula-ui-color-primary))"
						className={styles.TableIcon}
					/>
					<div className={styles.LabelContainer}>
						<p className={styles.TableLabel}>{t("button.add")}</p>
						{((requiredColumns && requiredColumns.length) ||
							(requiredMultipleColumns && requiredMultipleColumns.length)) && (
							<div className={styles.QuestLabel}>
								<p className={styles.QuestLabelText}>?</p>
								<div className={styles.HelpContainer}>
									<p>
										{t("button.label")}
										{requiredColumns &&
											requiredColumns.length &&
											requiredColumns
												.map((column) => `"${column.title}"`)
												.join(", ")}
										{requiredMultipleColumns &&
											requiredMultipleColumns.length && (
												<>
													{requiredColumns && requiredColumns.length && ", "}
													{requiredMultipleColumns
														.map((column) => `"${column.title}"`)
														.join(", ")}
												</>
											)}
									</p>
								</div>
							</div>
						)}
					</div>
				</button>
			) : (
				<div className={styles.ConfirmTableContainer}>
					<div className={styles.TableContainer}>
						<table className={styles.Table}>
							<tbody>
								{visibleRows?.map((row, index) => (
									<tr key={index}>
										<td>{row.column.title}</td>

										{Array.isArray(row.value) ? (
											row.value.map((value, rowIndex) => (
												<td key={rowIndex}>
													<p>{value}</p>
												</td>
											))
										) : (
											<td>
												<p>{row.value}</p>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<Button
						variant="light"
						className={styles.RemoveTableButton}
						color="danger"
						onClick={handleRemoveFile}
					>
						{t("button.remove")}{" "}
					</Button>
				</div>
			)}
		</>
	);
};
