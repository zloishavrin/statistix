import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import type { IChangePasswordForm } from "@features/authorization/types";
import {
	useChangePasswordMutation,
	useMeQuery,
	useLogoutMutation,
} from "@features/authorization";

export const useProfile = () => {
	const { data: profile, isLoading, isError } = useMeQuery();

	const navigate = useNavigate();

	const changePasswordForm = useForm<IChangePasswordForm>();
	const {
		mutateAsync: changePassword,
		isPending: IsChangingPassword,
		isError: IsChangePasswordError,
		isSuccess: IsPasswordChanged,
	} = useChangePasswordMutation();
	const handleChangePassword = async (data: IChangePasswordForm) => {
		changePassword(data);
	};

	const { mutateAsync: logout } = useLogoutMutation();
	const handleSubmitLogout = async () => {
		logout();
		navigate({
			to: "/home",
		});
	};

	return {
		profile,
		isLoading,
		isError,
		changePasswordForm,
		handleChangePassword,
		IsChangingPassword,
		IsChangePasswordError,
		IsPasswordChanged,
		handleSubmitLogout,
	};
};
