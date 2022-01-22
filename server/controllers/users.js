const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const fs = require("fs");

// @desc    Get single user by username
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

// // @desc    Get single user by id
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)
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

// @desc    Upload avatar picture
// @route   PUT /api/users/:id/upload
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
	console.log("Hello");
	const avatar = req.file.filename;
	const loggedInUser = req.user;

	if (!avatar) {
		throw new Error("Server error");
		res.status(500).json({ success: false });
	}

	// Delete previous avatar
	const oldAvatar = loggedInUser.avatar;
	const DEFAULT_AVATAR = "default-avatar-123456789.png";
	if (oldAvatar !== DEFAULT_AVATAR) {
		try {
			fs.unlinkSync(`./uploads/avatars/${oldAvatar}`);
		} catch (error) {
			console.log(error.message);
		}
	}

	await User.findByIdAndUpdate(loggedInUser._id, { avatar });
	res.status(200).json({ success: true });
});
