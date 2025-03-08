import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	getContactsDM,
	searchContacts,
} from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post("/searchContacts", verifyToken, searchContacts);
contactRoutes.get("/getContacts", verifyToken, getContactsDM);
export default contactRoutes;
