import { useRouter } from "@tanstack/react-router";

export const useReturnButton = () => {
	const router = useRouter();

	const handleReturn = () => {
		router.history.go(-1);
	};

	return {
		handleReturn,
	};
};
