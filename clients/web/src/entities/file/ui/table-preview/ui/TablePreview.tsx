import { Spinner } from "@shared/ui/spinner";
import { useTablePreview } from "../hooks";
import type { TablePreviewProps } from "../types";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";

export const TablePreview = ({
	fileId,
	selectableTitle,
	selectedColumnsIndex,
	onSelectColumn,
	onConfirm,
	confirmDisabled = false,
	visibleOptions,
}: TablePreviewProps) => {
	const { columns, isLoading } = useTablePreview({ fileId, visibleOptions });
	const { t } = useTranslation("tablePreview");

	return (
		<div className={styles.Container}>
			<div className={styles.Header}>
				{selectableTitle && (
					<p>
						{t("title")} "{selectableTitle}"
					</p>
				)}

				{onConfirm && (
					<Button
						isDisabled={confirmDisabled}
						onClick={onConfirm}
						color="secondary"
					>
						{t("confirm")}
					</Button>
				)}
			</div>

			{isLoading && <Spinner />}

			{columns && (
				<table className={styles.Table}>
					<thead>
						<tr>
							<th colSpan={15}>{t("tableTitle")}</th>
						</tr>
					</thead>

					<tbody>
						{columns.map((column, index) => (
							<tr
								key={`column-${index}`}
								onClick={() => {
									if (onSelectColumn) {
										onSelectColumn(column, index);
									}
								}}
								className={`
                  ${onSelectColumn ? styles.Selectable : ""} 
                  ${selectedColumnsIndex && selectedColumnsIndex.includes(index) ? styles.Selected : ""}
                `}
							>
								<td>
									<p>{column.name || ""}</p>
								</td>
								{column.values.map((value, valueIndex) => (
									<td key={`${index}-${valueIndex}`}>
										<p>{value}</p>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};
