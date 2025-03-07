import { Router } from "express";
import {
	getUserInfo,
	loginUser,
	regUser,
	updateProfile,
	updateProfileImage,
	removeProfileImage,
} from "../controllers/authController.js";
import upload from "../middleware/multer.js";
import { verifyToken } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/signup", regUser);
authRouter.post("/login", loginUser);
authRouter.get("/userInfo", verifyToken, getUserInfo);
authRouter.post("/updateProfile", verifyToken, updateProfile);
authRouter.post(
	"/uploadImage",
	verifyToken,
	upload.single("profile-image"),
	updateProfileImage
);

authRouter.delete("/removeImage", verifyToken, removeProfileImage);

export default authRouter;
