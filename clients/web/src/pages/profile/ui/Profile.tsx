import { Controller } from "react-hook-form";
import { LanguageSwitcher } from "@features/languages";
import { Button } from "@shared/ui/button";
import { Form } from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import styles from "./styles.module.css";
import { useProfile } from "../hooks";
import { Spinner } from "@shared/ui/spinner";
import { useTranslation } from "react-i18next";

export const Profile = () => {
	const {
		profile,
		changePasswordForm,
		handleChangePassword,
		IsChangingPassword,
		IsChangePasswordError,
		IsPasswordChanged,
		handleSubmitLogout,
	} = useProfile();
	const { t } = useTranslation("profile");

	return (
		<div className={`${styles.Container}`}>
			<aside className={`${styles.Bar}`}>
				<Button
					as="a"
					href="#profileForm"
					variant="light"
					className={`${styles.BarButton}`}
				>
					{t("sidebar.profile")}
				</Button>
				<Button
					as="a"
					href="#changePasswordForm"
					variant="light"
					className={`${styles.BarButton}`}
				>
					{t("sidebar.changePassword")}
				</Button>
				<Button
					as="a"
					href="#languageForm"
					variant="light"
					className={`${styles.BarButton}`}
				>
					{t("sidebar.language")}
				</Button>
				<Button
					variant="light"
					color="danger"
					type="button"
					onClick={handleSubmitLogout}
					className={`${styles.BarButton}`}
				>
					{t("sidebar.logout")}
				</Button>
			</aside>
			<div className={`${styles.Content}`}>
				<Form className={`${styles.Form}`} id="profileForm">
					<h2 className={`${styles.FormTitle}`}>{t("profileForm.title")}</h2>
					<Input
						type="text"
						variant="bordered"
						color="primary"
						value={profile?.login}
						label={t("profileForm.inputs.login.label")}
						labelPlacement="outside"
						isDisabled
						className={`${styles.FormInput}`}
					/>
				</Form>

				<Form
					id="changePasswordForm"
					className={`${styles.Form}`}
					onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
				>
					<h2 className={`${styles.FormTitle}`}>
						{t("changePasswordForm.title")}
					</h2>
					<Controller
						control={changePasswordForm.control}
						name="currentPassword"
						render={({ field, fieldState }) => (
							<Input
								ref={field.ref}
								value={field.value}
								onChange={field.onChange}
								name={field.name}
								type="password"
								variant="bordered"
								color="primary"
								label={t("changePasswordForm.inputs.currentPassword.label")}
								labelPlacement="outside"
								isClearable
								isRequired
								minLength={5}
								maxLength={64}
								errorMessage={fieldState.error?.message}
								className={`${styles.FormInput}`}
							/>
						)}
					/>
					<Controller
						control={changePasswordForm.control}
						name="newPassword"
						render={({ field, fieldState }) => (
							<Input
								ref={field.ref}
								value={field.value}
								onChange={field.onChange}
								name={field.name}
								type="password"
								variant="bordered"
								color="primary"
								label={t("changePasswordForm.inputs.password.label")}
								labelPlacement="outside"
								isClearable
								isRequired
								minLength={5}
								maxLength={64}
								errorMessage={fieldState.error?.message}
								className={`${styles.FormInput}`}
							/>
						)}
					/>
					{IsChangePasswordError && (
						<p className={`${styles.Error}`}>{t("changePasswordForm.error")}</p>
					)}
					{IsPasswordChanged && (
						<p className={`${styles.Success}`}>
							{t("changePasswordForm.success")}
						</p>
					)}
					<Button className={`${styles.FormButton}`}>
						{IsChangingPassword ? (
							<div className={`${styles.LoaderContainer}`}>
								<Spinner color="secondary" variant="dots" />
							</div>
						) : (
							t("changePasswordForm.buttons.submit.label")
						)}
					</Button>
				</Form>

				<Form className={`${styles.Form}`} id="languageForm">
					<h2 className={`${styles.FormTitle}`}>{t("languageForm.title")}</h2>
					<div className={`${styles.LanguageSwitcherContainer}`}>
						<LanguageSwitcher />
					</div>
				</Form>

				<Button
					type="button"
					onClick={handleSubmitLogout}
					color="danger"
					variant="solid"
					className={`${styles.FormButton}`}
				>
					{t("logoutForm.buttons.submit.label")}
				</Button>
			</div>
		</div>
	);
};
