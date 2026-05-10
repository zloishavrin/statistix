import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, getSocket } from "@shared/api/socket";
import type { NotificationPayload, NotificationRequestParams } from "../types";

export const useNotification = ({
	token,
	handleNotification,
}: NotificationRequestParams) => {
	const socket = getSocket();
	const isConnected = socket?.connected ?? false;
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!token) {
			disconnectSocket();
			return;
		}

		const socket = connectSocket(token);

		const onConnect = () => {
			// eslint-disable-next-line no-console
			console.info("WS Connected");
		};

		const onDisconnect = () => {
			// eslint-disable-next-line no-console
			console.info("WS Disconnected");
		};

		const onNotification = (data: NotificationPayload) => {
			queryClient.invalidateQueries({
				queryKey: ["get-task", data.id],
			});

			queryClient.invalidateQueries({
				queryKey: ["get-task-list-infinity"],
			});

			handleNotification?.(data);
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("notification", onNotification);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("notification", onNotification);
		};
	}, [token, handleNotification, queryClient]);

	return {
		isConnected,
	};
};
