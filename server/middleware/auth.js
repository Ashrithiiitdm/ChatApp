import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	console.log("verifyToken");
	console.log(req.cookies);
	const token = req.cookies.jwt;
	console.log("Token", token);
	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Verify", decoded);
		req.user_id = decoded.user_id;
		next();
	} catch (err) {
		console.log(err);
		return res.status(403).json({
			message: "Unauthorized",
		});
	}
};
