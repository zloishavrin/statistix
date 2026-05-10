import { Link } from "@tanstack/react-router";
import styles from "./styles.module.css";
import { Button } from "@shared/ui/button";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
	const { t } = useTranslation("notfound");

	return (
		<div className={`${styles.Container}`}>
			<motion.div
				className={`${styles.TitleContainer}`}
				initial={{ width: "100px", opacity: 0 }}
				animate={{ width: "300px", opacity: 1 }}
				transition={{ duration: 1 }}
			>
				<h1>{t("title")}</h1>
			</motion.div>
			<motion.div
				className={`${styles.ContentContainer}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<h2 className={`${styles.Content}`}>{t("subtitle")}</h2>
				<Button as={Link} to="/">
					{t("buttons.home")}
				</Button>
			</motion.div>
		</div>
	);
};
