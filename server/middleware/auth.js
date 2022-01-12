const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(401);
		throw new Error("Unauthorized to access this route");
	}
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userId = decoded.id;

	const user = await User.findById(userId);
	if (!user) {
		res.status(401);
		throw new Error("Unauthorized to access this route");
	}

	req.user = user;
	next();
});
