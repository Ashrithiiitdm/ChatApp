import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const signToken = (email, user_id) => {
	return jwt.sign({ email, user_id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	});
};

export const regUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		console.log(email, password);

		if (!email) {
			return res.status(400).json({
				message: "Email is required",
			});
		}

		if (!password) {
			return res.status(400).json({
				message: "Password is required",
			});
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.json({
				success: false,
				message: "User already exists",
			});
		}

		if (!validator.isEmail(email)) {
			return res.json({
				success: false,
				message: "Please enter a valid email",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			password: hashedPassword,
		});

		const user = await newUser.save();

		const cookieOptions = {
			maxAge,
			secure: process.env.NODE_ENV === "production", // false in development (HTTP)
			sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
		};

		res.cookie("jwt", signToken(email, user._id), cookieOptions);
		return res.status(201).json({
			message: "User created successfully",
			user: {
				email: user.email,
				user_id: user._id,
				profileSetup: user.profileSetup,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			return res.status(400).json({
				message: "Email is required",
			});
		}

		if (!password) {
			return res.status(400).json({
				message: "Password is required",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return res.status(401).json({
				message: "Invalid credentials",
			});
		}

		console.log("id", user._id);

		// In your login/registration endpoint:
		const cookieOptions = {
			maxAge,
			secure: process.env.NODE_ENV === "production", // false in development (HTTP)
			sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
		};

		res.cookie("jwt", signToken(email, user._id), cookieOptions);

		return res.status(200).json({
			message: "User logged in successfully",
			user: {
				email: user.email,
				user_id: user._id,
				profileSetup: user.profileSetup,
				first_name: user.first_name,
				last_name: user.last_name,
				image: user.image,
				color: user.color,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const getUserInfo = async (req, res, next) => {
	try {
		console.log(req._id);
		const user = await User.findById(req.user_id);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		return res.status(200).json({
			email: user.email,
			user_id: user._id,
			profileSetup: user.profileSetup,
			first_name: user.first_name,
			last_name: user.last_name,
			image: user.image,
			color: user.color,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
