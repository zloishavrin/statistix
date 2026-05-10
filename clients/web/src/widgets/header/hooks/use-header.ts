import { useLocation, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useHeader = () => {
	const mobilePoint = 1024;

	const [isMobile, setIsMobile] = useState<boolean>(
		() => window.innerWidth <= mobilePoint,
	);
	const [isOpenMobileMenu, setIsOpenMobileMenu] = useState<boolean>(false);

	const router = useRouter();
	const { pathname } = useLocation();
	const canReturn =
		pathname !== "/" && pathname !== "/history" && pathname !== "/profile";

	const handleToggleOpenMobileMenu = () => {
		setIsOpenMobileMenu((prev) => {
			return !prev;
		});
	};

	const handleReturn = () => {
		router.history.go(-1);
	};

	useEffect(() => {
		const media = window.matchMedia(`(max-width: ${mobilePoint}px)`);

		const update = () => setIsMobile(media.matches);

		update();
		media.addEventListener("change", update);

		return () => media.removeEventListener("change", update);
	}, []);

	return {
		isMobile,
		handleToggleOpenMobileMenu,
		isOpenMobileMenu,
		handleReturn,
		canReturn,
	};
};
