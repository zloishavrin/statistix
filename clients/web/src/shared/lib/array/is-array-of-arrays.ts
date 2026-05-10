export const isArrayOfArrays = <T>(
	value: unknown,
	itemGuard?: (item: unknown) => item is T,
): value is T[][] => {
	return (
		Array.isArray(value) &&
		value.every(
			(row) => Array.isArray(row) && (!itemGuard || row.every(itemGuard)),
		)
	);
};
