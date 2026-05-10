import type { FormatDateOptions } from "./types";

export const formatDate = ({ dateString, i18n }: FormatDateOptions) => {
	const date = new Date(dateString);
	const now = new Date();

	const time = date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	);
	const startOfDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	const diffDays = Math.floor(
		(startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (diffDays === 0) {
		const todayString = i18n.t("common:today");
		return `${todayString} ${time}`;
	} else if (diffDays === 1) {
		const yesterdayString = i18n.t("common:yesterday");
		return `${yesterdayString} ${time}`;
	} else {
		const month = date.toLocaleString(i18n.language, { month: "long" });
		return `${date.getDate()} ${month} ${time}`;
	}
};
