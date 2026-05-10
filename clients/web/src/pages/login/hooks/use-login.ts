import { useState } from "react";
import type {
	ILoginForm,
	IRegistrationForm,
} from "@features/authorization/types";
import { useForm } from "react-hook-form";
import {
	useLoginMutation,
	useRegistrationMutation,
} from "@features/authorization";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
	const [openMode, setOpenMode] = useState<"login" | "registration">("login");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const loginForm = useForm<ILoginForm>();
	const registrationForm = useForm<IRegistrationForm>();
	const { mutateAsync: login } = useLoginMutation();
	const { mutateAsync: registration } = useRegistrationMutation();
	const navigate = useNavigate();

	const handleToggleMode = () => {
		setIsLoading(false);
		setIsError(false);

		setOpenMode((prev) => (prev === "login" ? "registration" : "login"));
	};

	const navigateToPrivateLayout = () => {
		navigate({
			to: "/",
		});
	};

	const handleSubmitLogin = async (data: ILoginForm) => {
		setIsLoading(true);
		setIsError(false);
		try {
			await login(data);
			navigateToPrivateLayout();
		} catch {
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegistrationForm = async (data: IRegistrationForm) => {
		setIsLoading(true);
		setIsError(false);
		try {
			await registration(data);
			setOpenMode("login");
		} catch {
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		openMode,
		handleToggleMode,
		loginForm,
		handleSubmitLogin,
		registrationForm,
		handleRegistrationForm,
		isLoading,
		isError,
	};
};
