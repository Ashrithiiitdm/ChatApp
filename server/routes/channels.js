import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	createChannel,
	getChannelMessages,
	getUserChannels,
} from "../controllers/channelController.js";
const channelRouter = Router();

channelRouter.post("/createChannel", verifyToken, createChannel);
channelRouter.get("/getUserChannels", verifyToken, getUserChannels);
channelRouter.get(
	"/getChannelMessages/:channel_id",
	verifyToken,
	getChannelMessages
);
export default channelRouter;
