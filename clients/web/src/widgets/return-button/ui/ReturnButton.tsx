import { ArrowIcon } from "@shared/ui/icons";
import styles from "./styles.module.css";
import { useReturnButton } from "../hooks";
import { useTranslation } from "react-i18next";

export const ReturnButton = () => {
	const { handleReturn } = useReturnButton();
	const { t } = useTranslation("common");

	return (
		<button className={styles.Button} onClick={handleReturn}>
			<ArrowIcon
				color="hsl(var(--shaligula-ui-color-primary))"
				className={styles.Icon}
			/>
			<p>{t("buttons.return")}</p>
		</button>
	);
};
