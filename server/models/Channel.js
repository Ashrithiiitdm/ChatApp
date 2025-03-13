import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	members: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
	],

	admin: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},

	messages: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Messages",
			required: false,
		},
	],

	created_at: {
		type: Date,
		default: Date.now(),
	},

	updated_at: {
		type: Date,
		default: Date.now(),
	},
});

channelSchema.pre("save", function (next) {
	this.updated_at = Date.now();
	next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
	this.updated_at = Date.now();
	next();
});


export const Channels =
	mongoose.model("Channels", channelSchema) || mongoose.models.Channels;
