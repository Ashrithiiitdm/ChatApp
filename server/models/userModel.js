import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		unique: true,
	},

	first_name: {
		type: String,
		required: false,
	},

	last_name: {
		type: String,
		required: false,
	},

	image: {
		type: String,
	},

	color: {
		type: Number,
		required: false,
	},

	profileSetup: {
		type: Boolean,
		default: false,
	},
});

export const User = mongoose.model("User", userSchema) || mongoose.models.User;
