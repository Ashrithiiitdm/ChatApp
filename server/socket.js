import { Server } from "socket.io";
import { Messages } from "./models/Messages.js";

export const setUpSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	const userSocketMap = new Map();

	const disconnectUser = (socket) => {
		console.log("Client disconnected: ", socket.id);
		for (const [user_id, socket_id] of userSocketMap.entries()) {
			if (socket_id === socket.id) {
				userSocketMap.delete(user_id);
				break;
			}
		}
	};

	const sendMessage = async (message) => {
		const senderSocketId = userSocketMap.get(message.sender);
		const receiverSocketId = userSocketMap.get(message.receiver);
		console.log("In sendMessage socket.js:", senderSocketId);
		console.log("In sendMessage socket.js:", receiverSocketId);
		console.log("In sendMessage socket.js:", message);
		const createdMessage = await Messages.create(message);

		const msgData = await Messages.findById(createdMessage._id)
			.populate("sender", "id email first_name last_name image color")
			.populate("receiver", "id email first_name last_name image color");

		console.log("In sendMessage socket.js:", msgData);
		if (receiverSocketId) {
			console.log("first if in sendMessage socket.js:", receiverSocketId);
			io.to(receiverSocketId).emit("receiveMessage", msgData);
		}

		if (senderSocketId) {
			console.log("second if in sendMessage socket.js:", senderSocketId);
			io.to(senderSocketId).emit("receiveMessage", msgData);
		}
	};

	io.on("connection", (socket) => {
		const user_id = socket.handshake.query.user_id;

		if (user_id) {
			userSocketMap.set(user_id, socket.id);
			console.log("User connected: ", user_id, "socket id: ", socket.id);
		} else {
			console.log("User id not provided");
		}

		socket.on("sendMessage", sendMessage);

		socket.on("disconnect", () => {
			disconnectUser(socket);
		});
	});
};
