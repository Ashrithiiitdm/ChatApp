import { Server } from "socket.io";
import { Messages } from "./models/Messages.js";
import { Channels } from "./models/Channel.js";

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

	const sendChannelMessage = async (message) => {
		const { channel_id, sender, content, message_type, file_url } = message;

		const createdMessage = await Messages.create({
			sender,
			receiver: null,
			content,
			message_type,
			timestamp: new Date(),
			file_url,
		});

		const msgData = await Messages.findById(createdMessage._id)
			.populate("sender", "id email first_name last_name image color")
			.exec();
		await Channels.findByIdAndUpdate(channel_id, {
			$push: { messages: msgData._id },
		});

		const channel = await Channels.findById(channel_id)
			.populate("members")
			.exec();

		const finalData = { ...msgData._doc, channel_id: channel._id };

		if (channel && channel.members) {
			channel.members.forEach((member) => {
				const memberSocketId = userSocketMap.get(member._id.toString());
				if (memberSocketId) {
					io.to(memberSocketId).emit("receiveChannelMessage", finalData);
				}
			});
			const adminSocketId = userSocketMap.get(channel.admin._id.toString());
			if (adminSocketId) {
				io.to(adminSocketId).emit("receiveChannelMessage", finalData);
			}
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
		socket.on("sendChannelMessage", sendChannelMessage);
		socket.on("disconnect", () => {
			disconnectUser(socket);
		});
	});
};
