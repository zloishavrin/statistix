import type { InternalAxiosRequestConfig } from "axios";

export type RetryRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};
