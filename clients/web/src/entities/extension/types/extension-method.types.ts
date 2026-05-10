export interface IExtensionMethod {
	id: string;
	title: string;
	description: string;
}

export interface IExtensionMethodDetails {
	id: string;
	title: string;
	description: string;
	params?: IExtensionMethodInputParam[];
	columns?: IExtensionMethodInputColumn[];
	multipleColumns?: IExtensionMethodInputMultipleColumn[];
}

export interface IExtensionMethodInputParam {
	id: string;
	isRequired: boolean;
	title: string;
	description: string;
	min?: number;
	max?: number;
}

export interface IExtensionMethodInputColumn {
	id: string;
	isRequired: boolean;
	title: string;
	description: string;
}

export interface IExtensionMethodInputMultipleColumn {
	id: string;
	isRequired: boolean;
	title: string;
	description: string;
}
