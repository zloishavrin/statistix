import { useExtensionQuery } from "@entities/extension";
import { useParams } from "@tanstack/react-router";

export const useExtension = () => {
	const { id } = useParams({ strict: false });

	const {
		data: extension,
		isLoading: isExtensionLoading,
		isError: isExtensionError,
	} = useExtensionQuery(id);

	return {
		extension,
		isExtensionLoading,
		isExtensionError,
	};
};
