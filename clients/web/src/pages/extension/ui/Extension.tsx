import { MethodGrid } from "@widgets/method-grid";
import { useExtension } from "../hooks";
import styles from "./styles.module.css";
import { Spinner } from "@shared/ui/spinner";
import { ReturnButton } from "@widgets/return-button";

export const Extension = () => {
	const { extension } = useExtension();

	return (
		<div className={styles.Container}>
			<div className={styles.Content}>
				<ReturnButton />
				{extension ? (
					<>
						<h1 className={styles.Title}>{extension.title}</h1>
						<p className={styles.Description}>{extension.description}</p>
						<div className={styles.MethodsContainer}>
							<MethodGrid
								extensionId={extension.id}
								methods={extension.methods}
							/>
						</div>
					</>
				) : (
					<div className={styles.LoaderContainer}>
						<Spinner />
					</div>
				)}
			</div>
		</div>
	);
};
