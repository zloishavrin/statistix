import { Link } from "@tanstack/react-router";
import { Button } from "../../../shared/ui/button";
import styles from "./styles.module.css";
import {
	FileChartIcon,
	MenuIcon,
	SettingsIcon,
	HomeIcon,
	ArrowIcon,
} from "@shared/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { useHeader } from "../hooks";
import { useTranslation } from "react-i18next";

export const Header = () => {
	const {
		isMobile,
		handleToggleOpenMobileMenu,
		isOpenMobileMenu,
		handleReturn,
		canReturn,
	} = useHeader();
	const { t } = useTranslation("header");

	return (
		<header
			className={`
			${styles.Header} 
			${isOpenMobileMenu ? styles.isOpenMenu : ""}
		`}
		>
			{isMobile ? (
				<>
					<div
						className={`
						${styles.MobileMenuContainer} 
						${canReturn ? styles.CanReturn : ""}
					`}
					>
						{canReturn && (
							<Button
								onClick={handleReturn}
								variant="light"
								iconOnly
								isDisabled={!canReturn}
							>
								<ArrowIcon
									color="hsl(var(--shaligula-ui-color-primary))"
									className={`${styles.ArrowIcon}`}
								/>
							</Button>
						)}

						<Button
							onClick={handleToggleOpenMobileMenu}
							variant="light"
							iconOnly
						>
							<MenuIcon
								color="hsl(var(--shaligula-ui-color-primary))"
								className={`${styles.MenuIcon}`}
							/>
						</Button>
					</div>
					<AnimatePresence mode="sync">
						{isOpenMobileMenu && (
							<motion.div
								key="mobile-menu"
								className={`${styles.MobileMenu}`}
								initial={{ opacity: 0, y: -100 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -100 }}
								transition={{ duration: 0.35 }}
								layout="size"
							>
								<div className={`${styles.MobileMenuItem}`}>
									<Button as={Link} to="/" variant="light" iconOnly>
										<HomeIcon
											color="hsl(var(--shaligula-ui-color-primary))"
											className={`${styles.MenuIcon}`}
										/>
									</Button>
									<p>{t("home")}</p>
								</div>
								<div className={`${styles.MobileMenuItem}`}>
									<Button as={Link} to="/history" variant="light" iconOnly>
										<FileChartIcon
											color="hsl(var(--shaligula-ui-color-primary))"
											className={`${styles.MenuIcon}`}
										/>
									</Button>
									<p>{t("history")}</p>
								</div>
								<div className={`${styles.MobileMenuItem}`}>
									<Button as={Link} to="/profile" variant="light" iconOnly>
										<SettingsIcon
											color="hsl(var(--shaligula-ui-color-primary))"
											className={`${styles.MenuIcon}`}
										/>
									</Button>
									<p>{t("profile")}</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</>
			) : (
				<div className={`${styles.MenuContainer}`}>
					<Button as={Link} to="/" variant="light" iconOnly rippleDisabled>
						<HomeIcon
							color="hsl(var(--shaligula-ui-color-primary))"
							className={`${styles.MenuIcon}`}
						/>
					</Button>
					<Button
						as={Link}
						to="/history"
						variant="light"
						iconOnly
						rippleDisabled
					>
						<FileChartIcon
							color="hsl(var(--shaligula-ui-color-primary))"
							className={`${styles.MenuIcon}`}
						/>
					</Button>
					<Button
						as={Link}
						to="/profile"
						variant="light"
						rippleDisabled
						iconOnly
					>
						<SettingsIcon
							color="hsl(var(--shaligula-ui-color-primary))"
							className={`${styles.MenuIcon}`}
						/>
					</Button>
				</div>
			)}
		</header>
	);
};
