import type { IExtensionMethod } from "@entities/extension/types/extension-method.types";

export interface MethodGridProps {
	extensionId: string;
	methods: IExtensionMethod[];
}
