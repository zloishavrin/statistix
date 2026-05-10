export interface ILoginForm {
	login: string;
	password: string;
}

export interface ILoginResponse {
	refreshToken: string;
	accessToken: string;
}
