import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import connectDB from "./db.js";
import { setUpSocket } from "./socket.js";
import msgRouter from "./routes/messages.js";

dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(
	cookieParser({
		secure: true,
		sameSite: "None",
	})
);

app.use("/auth", authRouter);
app.use("/contacts", contactRoutes);
app.use("/messages", msgRouter);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

setUpSocket(server);
