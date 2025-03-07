import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	//console.log("verifyToken");
	//console.log(req.cookies);
	const token = req.cookies.jwt;
	//console.log("Token", token);
	if (!token) {
		return res.status(401).json({
			message: "You are not authenticated",
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(403).json({
				message: "Token is invalid",
			});
		}
		console.log("Decoded", decoded);
		req.user_id = decoded.user_id;
		next();
	});
};
