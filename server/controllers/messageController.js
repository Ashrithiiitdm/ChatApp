import { Messages } from "../models/Messages.js";
import { mkdir, mkdirSync, renameSync } from "fs";
import { v2 as cloudinary } from "cloudinary";

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
			return res.status(400).json({ message: "No file uploaded" });
		}

		const { user_id } = req;
		// console.log(req.file);
		// console.log("File Name:", req.file.originalname);
		// console.log("MIME Type:", req.file.mimetype);
		// console.log("Buffer Size:", req.file.buffer?.length || 0);

		// const fileBuffer = req.file.buffer;
		// console.log({ fileBuffer });

		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: `${user_id}/messages`,
					public_id: req.file.originalname.split(".")[0],
					resource_type: "auto",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		return res.status(200).json({
			file_url: result.secure_url,
		});
	} catch (error) {
		console.log("Error", error);
		res.status(500).json({ message: "File upload failed" });
	}
};
