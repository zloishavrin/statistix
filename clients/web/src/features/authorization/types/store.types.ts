export interface AuthStore {
	refreshToken: string | null;
	accessToken: string | null;
	setTokens: (accessToken: string, refreshToken: string) => void;
	refreshAccessToken: (accessToken: string) => void;
	removeTokens: () => void;
}
