import { GitHubIcon } from "@shared/ui/icons";
import styles from "./styles.module.css";

export const Footer = () => {
	return (
		<footer className={styles.Container}>
			<a
				className={styles.Element}
				href="https://github.com/zloishavrin/statistix"
				target="_blank"
			>
				<GitHubIcon
					className={styles.ElementIcon}
					color="hsl(var(--shaligula-ui-color-primary))"
				/>
				<p className={styles.ElementTitle}>GitHub</p>
			</a>
		</footer>
	);
};
