import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { searchContacts } from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post("/searchContacts", verifyToken, searchContacts);

export default contactRoutes;