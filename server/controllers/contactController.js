import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Messages } from "../models/Messages.js";

export const searchContacts = async (req, res) => {
	try {
		const { contact } = req.body;

		if (!contact) {
			return res.status(400).json({ message: "Contact is required" });
		}

		const cleanedContact = contact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		const regex = new RegExp(cleanedContact, "i");

		const contacts = await User.find({
			$and: [
				{ _id: { $ne: req.user_id } },
				{
					$or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
				},
			],
		});

		return res.status(200).json({ contacts });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getContactsDM = async (req, res) => {
	try {
		let { user_id } = req;
		user_id = new mongoose.Types.ObjectId(user_id);

		const contacts = await Messages.aggregate([
			{
				$match: {
					$or: [{ sender: user_id }, { receiver: user_id }],
				},
			},
			{
				$sort: { timestamp: -1 },
			},
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ["$sender", user_id] },
							then: "$receiver",
							else: "$sender",
						},
					},
					lastMessageTime: { $first: "$timestamp" },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "contactInfo",
				},
			},
			{
				$unwind: "$contactInfo",
			},
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: "$contactInfo.email",
					first_name: "$contactInfo.first_name",
					last_name: "$contactInfo.last_name",
					image: "$contactInfo.image",
					color: "$contactInfo.color",
				},
			},
			{
				$sort: { lastMessageTime: -1 },
			},
		]);

		return res.status(200).json({ contacts });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getAllContacts = async (req, res) => {
	try {
		const users = await User.find(
			{ _id: { $ne: req.user_id } },
			"first_name last_name _id email"
		);

		const contacts = users.map((user) => ({
			label: user.first_name
				? `${user.first_name} ${user.last_name}`
				: user.email,
			value: user._id,
		}));

		return res.status(200).json({
			contacts,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
