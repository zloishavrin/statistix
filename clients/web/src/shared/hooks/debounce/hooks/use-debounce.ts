import { useEffect, useState } from "react";
import type { UseDebounceProps } from "../types";

export const useDebounce = <T>({ value, delay = 300 }: UseDebounceProps<T>) => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
};
