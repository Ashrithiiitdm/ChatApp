import { Router } from "express";
import {
	getUserInfo,
	loginUser,
	regUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/signup", regUser);
authRouter.post("/login", loginUser);
authRouter.get("/userInfo", verifyToken, getUserInfo);

export default authRouter;
