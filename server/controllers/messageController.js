import { Messages } from "../models/Messages.js";
import { mkdir, mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res) => {
	try {
		const user1 = req.user_id;
		const user2 = req.body.user_id;

		if (!user2) {
			return res.status(400).json({
				message: "User id is required",
			});
		}

		const messages = await Messages.find({
			$or: [
				{ sender: user1, receiver: user2 },
				{ sender: user2, receiver: user1 },
			],
		}).sort({ timestamp: 1 });

		return res.status(200).json({
			messages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const uploadFiles = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "File is required",
			});
		}

		const date = Date.now();

		let fileDir = `uploads/files/${date}`;
		const file = req.file;

		let fileName = `${fileDir}/${req.file.originalname}`;
		mkdirSync(fileDir, { recursive: true });

		renameSync(req.file.path, fileName);

		return res.status(200).json({
			file_url: fileName,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
