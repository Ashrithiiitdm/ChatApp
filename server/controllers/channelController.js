import mongoose from "mongoose";
import { Channels } from "../models/Channel.js";
import { User } from "../models/userModel.js";

export const createChannel = async (req, res) => {
	try {
		const { name, members } = req.body;
		const user_id = req.user_id;

		const admin = await User.findById(user_id);

		if (!admin) {
			return res.status(404).json({
				message: "Admin not found",
			});
		}

		const validMembers = await User.find({ _id: { $in: members } });

		if (validMembers.length !== members.length) {
			return res.status(404).json({
				message: "Some members not found",
			});
		}

		const newChannel = new Channels({
			name,
			members,
			admin: user_id,
		});

		await newChannel.save();

		return res.status(200).json({
			channel: newChannel,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal Server error",
		});
	}
};

export const getUserChannels = async (req, res) => {
	try {
		const user_id = new mongoose.Types.ObjectId(req.user_id);

		const channels = await Channels.find({
			$or: [{ admin: user_id }, { members: user_id }],
		}).sort({ updatedAt: -1 });

		return res.status(200).json({
			channels,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal Server error",
		});
	}
};

export const getChannelMessages = async (req, res) => {
	try {
		const { channel_id } = req.params;
		const channel = await Channels.findById(channel_id).populate({
			path: "messages",
			populate: {
				path: "sender",
				select: "first_name last_name email _id image color",
			},
		});

		if (!channel) {
			return res.status(404).json({
				message: "Channel not found",
			});
		}

		const messages = channel.messages;

		return res.status(200).json({
		messages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal Server error",
		});
	}
};
