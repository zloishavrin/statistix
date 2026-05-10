import {
	useAllExtensionsQuery,
	useSearchExtensionsQuery,
} from "@entities/extension";
import { useDebounce } from "@shared/hooks/debounce";
import { useState } from "react";

export const useMain = () => {
	const {
		data: extensions,
		isLoading: isLoadingExtensions,
		isError: isErrorExtensions,
	} = useAllExtensionsQuery();

	const [searchText, setSearchText] = useState<string>("");
	const debouncedSearchText = useDebounce({
		value: searchText,
		delay: 300,
	});
	const {
		data: searchExtensions,
		isLoading: isLoadingSearchExtensions,
		isError: isErrorSearchExtensions,
	} = useSearchExtensionsQuery(debouncedSearchText);

	return {
		extensions,
		isLoadingExtensions,
		isErrorExtensions,
		searchText,
		setSearchText,
		searchExtensions,
		isLoadingSearchExtensions,
		isErrorSearchExtensions,
	};
};
