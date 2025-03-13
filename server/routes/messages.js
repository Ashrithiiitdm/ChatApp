import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages, uploadFiles } from "../controllers/messageController.js";
import upload from "../middleware/multer.js";
const msgRouter = Router();

msgRouter.post("/getMessages", verifyToken, getMessages);
msgRouter.post("/uploadFiles", verifyToken, upload.single("file"), uploadFiles);
export default msgRouter;
