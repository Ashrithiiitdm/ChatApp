import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages } from "../controllers/messageController.js";

const msgRouter = Router();

msgRouter.post("/getMessages", verifyToken, getMessages);

export default msgRouter;
