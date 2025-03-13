import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	createChannel,
	getUserChannels,
} from "../controllers/channelController.js";
const channelRouter = Router();

channelRouter.post("/createChannel", verifyToken, createChannel);
channelRouter.get("/getUserChannels", verifyToken, getUserChannels);
export default channelRouter;
