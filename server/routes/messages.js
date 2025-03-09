import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages, uploadFiles } from "../controllers/messageController.js";
import multer from "multer";
const msgRouter = Router();

const upload = multer({ dest: "uploads/files" });
msgRouter.post("/getMessages", verifyToken, getMessages);
msgRouter.post("/uploadFiles", verifyToken, upload.single("file"), uploadFiles);
export default msgRouter;
