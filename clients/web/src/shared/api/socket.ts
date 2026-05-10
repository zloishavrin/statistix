import io, { type Socket } from "socket.io-client";
import { API_URL } from "./api";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
	if (socket?.connected) {
		return socket;
	}

	socket = io(API_URL, {
		path: "/notification",
		transports: ["websocket"],
		auth: {
			token,
		},
	});

	return socket;
};

export const disconnectSocket = () => {
	socket?.disconnect();
	socket = null;
};

export const getSocket = () => socket;
