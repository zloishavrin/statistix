import { Form } from "../../../shared/ui/form";
import styles from "./styles.module.css";
import { Button } from "../../../shared/ui/button";
import { Input } from "@shared/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { Controller } from "react-hook-form";
import { useLogin } from "../hooks";
import { useTranslation } from "react-i18next";
import { Spinner } from "@shared/ui/spinner";

export const Login = () => {
	const {
		openMode,
		handleToggleMode,
		loginForm,
		handleSubmitLogin,
		registrationForm,
		handleRegistrationForm,
		isLoading,
		isError,
	} = useLogin();
	const { t } = useTranslation("login");

	return (
		<AnimatePresence mode="popLayout">
			{openMode === "login" ? (
				<motion.div
					key="login"
					className={`${styles.Container}`}
					initial={{ opacity: 0, y: -200 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -200 }}
					transition={{ duration: 1, delay: 0.2 }}
					layout
				>
					<Form
						className={`${styles.Form}`}
						onSubmit={loginForm.handleSubmit(handleSubmitLogin)}
					>
						<h2>{t("login.title")}</h2>

						<Controller
							control={loginForm.control}
							name="login"
							render={({ field, fieldState }) => (
								<Input
									ref={field.ref}
									value={field.value}
									onChange={field.onChange}
									name={field.name}
									type="text"
									variant="bordered"
									color="primary"
									labelPlacement="outside"
									label={t("login.inputs.login.label")}
									isClearable
									isRequired
									isDisabledRequiredBadge
									minLength={5}
									maxLength={64}
									errorMessage={fieldState.error?.message}
									className={`${styles.Input}`}
								/>
							)}
						/>
						<Controller
							control={loginForm.control}
							name="password"
							render={({ field, fieldState }) => (
								<Input
									ref={field.ref}
									value={field.value}
									onChange={field.onChange}
									name={field.name}
									type="password"
									variant="bordered"
									color="primary"
									labelPlacement="outside"
									label={t("login.inputs.password.label")}
									isClearable
									isRequired
									isDisabledRequiredBadge
									minLength={5}
									maxLength={64}
									errorMessage={fieldState.error?.message}
									className={`${styles.Input}`}
								/>
							)}
						/>

						{isError && <p className={`${styles.Error}`}>{t("login.error")}</p>}

						<Button type="submit" className={`${styles.Input}`}>
							{isLoading ? (
								<div className={`${styles.LoaderContainer}`}>
									<Spinner color="secondary" variant="dots" />
								</div>
							) : (
								t("login.buttons.enter.label")
							)}
						</Button>
					</Form>

					<p className={`${styles.ModeChanger}`} onClick={handleToggleMode}>
						{t("login.buttons.registration.label")}
					</p>
				</motion.div>
			) : (
				<motion.div
					key="registration"
					className={`${styles.Container}`}
					initial={{ opacity: 0, y: 200 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 200 }}
					transition={{ duration: 1, delay: 0.2 }}
					layout
				>
					<Form
						className={`${styles.Form}`}
						onSubmit={registrationForm.handleSubmit(handleRegistrationForm)}
					>
						<h2>{t("registration.title")}</h2>

						<Controller
							control={registrationForm.control}
							name="login"
							render={({ field, fieldState }) => (
								<Input
									ref={field.ref}
									value={field.value}
									onChange={field.onChange}
									name={field.name}
									type="text"
									variant="bordered"
									color="primary"
									labelPlacement="outside"
									label={t("registration.inputs.login.label")}
									isClearable
									isRequired
									isDisabledRequiredBadge
									minLength={5}
									maxLength={64}
									errorMessage={fieldState.error?.message}
									className={`${styles.Input}`}
								/>
							)}
						/>
						<Controller
							control={registrationForm.control}
							name="password"
							render={({ field, fieldState }) => (
								<Input
									ref={field.ref}
									value={field.value}
									onChange={field.onChange}
									name={field.name}
									type="password"
									variant="bordered"
									color="primary"
									labelPlacement="outside"
									label={t("registration.inputs.password.label")}
									isClearable
									isRequired
									isDisabledRequiredBadge
									minLength={5}
									maxLength={64}
									errorMessage={fieldState.error?.message}
									className={`${styles.Input}`}
								/>
							)}
						/>

						{isError && (
							<p className={`${styles.Error}`}>{t("registration.error")}</p>
						)}

						<Button type="submit" className={`${styles.Input}`}>
							{isLoading ? (
								<div className={`${styles.LoaderContainer}`}>
									<Spinner color="secondary" variant="dots" />
								</div>
							) : (
								t("registration.buttons.enter.label")
							)}
						</Button>
					</Form>

					<p className={`${styles.ModeChanger}`} onClick={handleToggleMode}>
						{t("registration.buttons.login.label")}
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
