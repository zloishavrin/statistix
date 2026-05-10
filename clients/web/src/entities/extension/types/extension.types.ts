import type { IExtensionMethod } from "./extension-method.types";

export interface IExtension {
	id: string;
	title: string;
}

export interface IExtensionDetails extends IExtension {
	description: string;
	methods: IExtensionMethod[];
}
