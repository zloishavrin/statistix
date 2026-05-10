import { create } from "zustand";
import type { AuthStore } from "../types";

export const useAuthStore = create<AuthStore>((set) => ({
	refreshToken: localStorage.getItem("token") || null,
	accessToken: null,

	setTokens: (accessToken: string, refreshToken: string) => {
		localStorage.setItem("token", refreshToken);
		set({
			refreshToken,
			accessToken,
		});
	},
	refreshAccessToken: (accessToken: string) => {
		set({
			accessToken,
		});
	},
	removeTokens: () => {
		localStorage.removeItem("token");
		set({
			accessToken: null,
			refreshToken: null,
		});
	},
}));
