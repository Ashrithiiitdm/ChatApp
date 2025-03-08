import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false,
	},

	message_type: {
		type: String,
		enum: ["text", "file"],
		required: true,
	},

	content: {
		type: String,
		required: function () {
			return this.message_type === "text";
		},
	},

	file_url: {
		type: String,
		required: function () {
			return this.message_type === "file";
		},
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

export const Messages =
	mongoose.model("Messages", messageSchema) || mongoose.models.Messages;
