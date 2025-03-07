import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const signToken = (email, user_id) => {
	console.log("In signToken", email, user_id);
	return jwt.sign({ email, user_id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	});
};

export const regUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		console.log("In regUser:", email, password);

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
			secure: true, // false in development (HTTP)
			sameSite: "None",
			httpOnly: true,
		};

		res.cookie("jwt", signToken(email, user.id), cookieOptions);
		return res.status(201).json({
			message: "User created successfully",
			user: {
				email: user.email,
				user_id: user.id,
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
		console.log("Match", match);
		if (!match) {
			return res.status(401).json({
				message: "Invalid credentials",
			});
		}

		console.log("id", user.id);

		// In your login/registration endpoint:
		const cookieOptions = {
			maxAge,
			secure: true, // false in development (HTTP)
			sameSite: "None",
			httpOnly: true,
		};

		const p = res.cookie("jwt", signToken(email, user.id), cookieOptions);
		//console.log("P", p);
		return res.status(200).json({
			message: "User logged in successfully",
			user: {
				email: user.email,
				user_id: user.id,
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
		console.log("Inside getUserInfo");
		//console.log(req.cookies);
		//console.log(req.cookies.jwt);
		console.log("Request body", req.user_id);
		const user = await User.findById(req.user_id);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		return res.status(200).json({
			email: user.email,
			user_id: user.id,
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
