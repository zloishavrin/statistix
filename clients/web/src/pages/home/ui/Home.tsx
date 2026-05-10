import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";
import { motion } from "motion/react";
import { LanguageSwitcher } from "@features/languages";
import { Button } from "@shared/ui/button";
import { Link } from "@tanstack/react-router";

export const Home = () => {
	const { t } = useTranslation("home");

	return (
		<div className={`${styles.Container}`}>
			<motion.div
				className={`${styles.LanguageSwitcherContainer}`}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
			>
				<LanguageSwitcher />
			</motion.div>

			<motion.div
				className={`${styles.TitleContainer}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
			>
				<h1>{t("title")}</h1>
				<p>{t("subtitle")}</p>
				<Button as={Link} to="/login" withShadow className={`${styles.Button}`}>
					{t("buttons.start")}
				</Button>
			</motion.div>
		</div>
	);
};
