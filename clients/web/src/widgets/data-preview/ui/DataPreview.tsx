import { ChartPreview, TablePreview } from "@entities/file";
import { useDataPreview } from "../hooks";
import type { DataPreviewMode, DataPreviewProps } from "../types";
import styles from "./styles.module.css";
import { Select, SelectItem } from "@shared/ui/select";
import { Button } from "@shared/ui/button";
import { useTranslation } from "react-i18next";

export const DataPreview = ({
	fileId,
	visibleOptions,
	defaultMode = "table",
}: DataPreviewProps) => {
	const { mode, setMode, isDownloading, handleDownload, contentContainerRef } =
		useDataPreview({
			fileId,
			visibleOptions,
			defaultMode,
		});
	const { t } = useTranslation("dataPreview");

	return (
		<div className={styles.Container}>
			<h2 className={styles.Title}>{t("title")}</h2>

			<div className={styles.ControllBar}>
				<Select<DataPreviewMode>
					value={mode}
					defaultValue={defaultMode}
					onValueChange={(value) => setMode(value)}
					label={<p>{t("selectors.visualization.title")}</p>}
					className={styles.VisualisationSelect}
				>
					<SelectItem value={"table"}>
						{t("selectors.visualization.table")}
					</SelectItem>
					<SelectItem value={"line-chart"}>
						{t("selectors.visualization.linear")}
					</SelectItem>
					<SelectItem value={"area-chart"}>
						{t("selectors.visualization.area")}
					</SelectItem>
					<SelectItem value={"bar-chart"}>
						{t("selectors.visualization.bar")}
					</SelectItem>
					<SelectItem value={"scatter-chart"}>
						{t("selectors.visualization.scatter")}
					</SelectItem>
				</Select>

				<Button
					onClick={handleDownload}
					isDisabled={isDownloading}
					className={styles.DownloadButton}
				>
					{t("download")}
				</Button>
			</div>

			<div ref={contentContainerRef}>
				{mode === "table" ? (
					<TablePreview fileId={fileId} visibleOptions={visibleOptions} />
				) : (
					<ChartPreview
						fileId={fileId}
						visibleOptions={visibleOptions}
						mode={mode}
					/>
				)}
			</div>
		</div>
	);
};
