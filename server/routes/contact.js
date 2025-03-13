import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	getAllContacts,
	getContactsDM,
	searchContacts,
} from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post("/searchContacts", verifyToken, searchContacts);
contactRoutes.get("/getContacts", verifyToken, getContactsDM);
contactRoutes.get("/getAllContacts", verifyToken, getAllContacts);
export default contactRoutes;
