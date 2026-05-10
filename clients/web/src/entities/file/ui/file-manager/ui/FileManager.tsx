import { Spinner } from "@shared/ui/spinner";
import { useFileManager } from "../hooks";
import type { FileManagerProps } from "../types";
import styles from "./styles.module.css";
import { Button } from "@shared/ui/button";
import { FileCard } from "../../file-card";
import { DownloadIcon } from "@shared/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { createMotionProps } from "@shared/lib/motion";
import { ProgressMotionTransition, ProgressMotionVariants } from "./motion";
import { useTranslation } from "react-i18next";

export const FileManager = ({
	selectedFile,
	setSelectedFile,
}: FileManagerProps) => {
	const {
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
		isUploading,
		fileProgress,
	} = useFileManager({
		selectedFile,
		setSelectedFile,
	});
	const { t } = useTranslation("fileManager");

	return (
		<div className={styles.Container}>
			<div className={styles.UploadContainer}>
				<input
					ref={inputRef}
					type="file"
					className={styles.Input}
					onChange={handleFile}
					accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
				/>

				<button className={styles.UploadButton} onClick={handleUpload}>
					<DownloadIcon
						color="hsla(var(--shaligula-ui-color-primary))"
						className={styles.UploadIcon}
					/>
					<div className={styles.LabelContainer}>
						<p className={styles.LabelTitle}>{t("upload.button")}</p>
						<p className={styles.LabelDescription}>{t("upload.label")}</p>
					</div>
				</button>

				{isUploadError && (
					<p className={styles.ErrorMessage}>{t("upload.errorMessage")}</p>
				)}

				<AnimatePresence>
					{isUploading && (
						<motion.div
							className={styles.ProgressBar}
							style={{
								width: `${fileProgress}%`,
							}}
							key="progress-bar-upload-button"
							{...createMotionProps({
								variants: ProgressMotionVariants,
								transition: ProgressMotionTransition,
							})}
						></motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className={styles.ListContainer}>
				<h2 className={styles.ListTitle}>{t("list.title")}</h2>

				{isLoading && <Spinner />}

				<div className={styles.FileGrid}>
					{fileList.length > 0 &&
						fileList.map((file) => (
							<FileCard
								key={file.id}
								file={file}
								onClick={() => setSelectedFile(file)}
							/>
						))}
				</div>

				{isFetchingNextPage && <Spinner />}

				{fileList.length === 0 && !isLoading && (
					<p className={styles.EmptyMessage}>{t("list.emptyMessage")}</p>
				)}

				{isError && (
					<p className={styles.ErrorMessage}>{t("list.errorMessage")}</p>
				)}

				{hasNextPage && (
					<Button variant="ghost" onClick={() => fetchNextPage()}>
						{t("list.buttonMore")}
					</Button>
				)}
			</div>
		</div>
	);
};
