const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get single user
// @route   GET /api/users/:username
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ username: req.params.username })
		.select("-password")
		.populate("posts")
		.populate("followers", "username avatar firstName lastName", "User")
		.populate("following", "username avatar firstName lastName", "User");

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	res.status(200).json({ success: true, data: user });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find({});

	res.status(200).json({ success: true, data: users });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	res.status(200).json({ success: true, data: user });
});
