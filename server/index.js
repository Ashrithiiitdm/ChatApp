import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import connectDB from "./db.js";

dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(
	cors({
		origin: [process.env.ORIGIN],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use(cookieParser());

app.use("/auth", authRouter);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
