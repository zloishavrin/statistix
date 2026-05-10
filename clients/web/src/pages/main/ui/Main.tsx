import { Button } from "@shared/ui/button";
import { useMain } from "../hooks";
import styles from "./styles.module.css";
import { Link } from "@tanstack/react-router";
import { Input } from "@shared/ui/input";
import { SearchIcon } from "@shared/ui/icons";
import { Skeleton } from "@shared/ui/skeleton";
import { Spinner } from "@shared/ui/spinner";
import { useTranslation } from "react-i18next";
import { MethodGrid } from "@widgets/method-grid";

export const Main = () => {
	const { searchText, setSearchText, extensions, searchExtensions } = useMain();
	const { t } = useTranslation("main");

	return (
		<div className={`${styles.Container}`}>
			<aside className={`${styles.Bar}`}>
				{extensions
					? extensions.map((extension, index) => (
							<Button
								key={`${index}-${extension.id}`}
								as={Link}
								to={`/extension/${extension.id}`}
								variant="light"
								className={`${styles.BarButton}`}
							>
								{extension.title}
							</Button>
						))
					: Array.from({ length: 5 }).map((_, index) => (
							<Skeleton
								key={`${index}-skeleton-bar-extensions`}
								className={`${styles.BarButtonSkeleton}`}
							/>
						))}
			</aside>
			<main className={`${styles.Content}`}>
				<Input
					variant="underlined"
					placeholder={t("search.placeholder")}
					value={searchText}
					onValueChange={(value) => setSearchText(value)}
					startContent={
						<SearchIcon
							color="hsl(var(--shaligula-ui-color-primary))"
							className={styles.SearchIcon}
						/>
					}
				/>

				{searchExtensions ? (
					searchExtensions.map((extension, index) => (
						<div
							key={`${index}-${extension.id}-main`}
							className={`${styles.ExtensionContainer}`}
						>
							<h2 className={`${styles.ExtensionTitle}`}>{extension.title}</h2>
							<MethodGrid
								extensionId={extension.id}
								methods={extension.methods}
							/>
						</div>
					))
				) : (
					<div className={styles.SkeletonContainer}>
						<Spinner />
					</div>
				)}
			</main>
		</div>
	);
};
