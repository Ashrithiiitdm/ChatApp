import { useAppStore } from "@/store/app";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const SocketContext = createContext(null);

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const socket = useRef(null);
	const { userInfo } = useAppStore();

	useEffect(() => {
		if (userInfo) {
			socket.current = io(backend_url, {
				withCredentials: true,
				query: { user_id: userInfo.user_id },
			});

			socket.current.on("connect", () => {
				console.log("Connected to socket-server");
			});

			const handleReceiveMessage = (message) => {
				console.log("Handle receive message: ", message);
				const { selectedChatData, selectedChatType, addMessage } =
					useAppStore.getState();

				if (
					selectedChatType !== undefined &&
					(selectedChatData._id === message.sender._id ||
						selectedChatData._id === message.receiver._id)
				) {
					console.log("Message received: ", message);
					addMessage(message);
				}
			};

			socket.current.on("receiveMessage", handleReceiveMessage);
			return () => {
				socket.current.disconnect();
			};
		}
	}, [userInfo]);

	return (
		<SocketContext.Provider value={socket.current}>
			{children}
		</SocketContext.Provider>
	);
};
