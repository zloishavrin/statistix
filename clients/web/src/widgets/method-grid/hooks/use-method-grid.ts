import { useEffect, useState } from "react";

export const useMethodGrid = () => {
	const mobilePoint = 1024;

	const getIsMobile = () =>
		typeof window !== "undefined" && window.innerWidth <= mobilePoint;

	const [isMobile, setIsMobile] = useState<boolean>(getIsMobile);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= mobilePoint);
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return {
		isMobile,
	};
};
