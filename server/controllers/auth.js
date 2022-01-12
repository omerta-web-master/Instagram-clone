const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Register user
// @route   POST /api/auth/register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
	// Hash the password
	req.body.password = await bcrypt.hash(req.body.password, 10);

	const user = await User.create(req.body);

	// Generate jwt
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	res.status(201).json({ success: true, data: user, token: token });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
	if (!req.body.email) {
		res.status(400);
		throw new Error("Please enter email");
	}

	if (!req.body.password) {
		res.status(400);
		throw new Error("Please enter password");
	}

	const email = req.body.email;
	const password = req.body.password;
	const user = await User.findOne({ email })
		.populate("posts")
		.populate("followers", "username avatar firstName lastName", "User")
		.populate("following", "username avatar firstName lastName", "User");

	if (!user) {
		res.status(400);
		throw new Error("Invalid credentials");
	}

	// Check the password
	isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) {
		res.status(404);
		throw new Error("Invalid credentials");
	}

	// Generate jwt
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	res.status(201).json({ success: true, data: user, token: token });
});

// @desc    Load user
// @route   POST /api/auth/loaduser
// @access  public
exports.loadUser = asyncHandler(async (req, res, next) => {
	const token = req.body.token;
	if (!token) {
		res.status(400);
		throw new Error("No token");
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const user = await User.findById(decoded.id)
		.select("-password")
		.populate("posts")
		.populate("followers", "username avatar firstName lastName", "User")
		.populate("following", "username avatar firstName lastName", "User");

	if (!user) {
		res.status(404);
		throw new Error("Invalid credentials");
	}

	res.status(201).json({ success: true, data: user });
});
