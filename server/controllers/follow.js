const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Follow user
// @route   Post /api/followhandler/follow/:id
// @access  Private
exports.follow = asyncHandler(async (req, res, next) => {
	const loggedInUser = req.user;
	const userToFollowId = req.params.id;

	// Check if user exists
	const userToFollow = await User.findById(userToFollowId);
	if (!userToFollow) {
		res.status(404);
		throw new Error(`User with id ${userToFollowId} not found`);
	}

	// Check if the people do not follow each other already
	if (loggedInUser.following.includes(userToFollow._id)) {
		res.status(400);
		throw new Error("You are following this user already");
	}

	// Update logged in user
	await User.findByIdAndUpdate(loggedInUser._id, {
		$push: { following: userToFollow._id },
	});

	// Update user that is beeing followed
	userToFollow.followers.push(loggedInUser._id);
	userToFollow.save();

	res.status(200).json({ success: true });
});

// @desc    Unfollow user
// @route   Post /api/followhandler/unfollow/:id
// @access  Private
exports.unfollow = asyncHandler(async (req, res, next) => {
	const loggedInUser = req.user;
	const userToUnfollowId = req.params.id;

	// Check if user exists
	const userToUnfollow = await User.findById(userToUnfollowId);
	if (!userToUnfollow) {
		res.status(404);
		throw new Error(`User with id ${userToUnfollowId} not found`);
	}

	// Update logged in user
	await User.findByIdAndUpdate(loggedInUser._id, {
		$pull: { following: userToUnfollow._id },
	});

	// Update user that is beeing unfollowed
	await User.findByIdAndUpdate(userToUnfollow._id, {
		$pull: { followers: loggedInUser._id },
	});

	res.status(200).json({ success: true });
});

// @desc    Get follow suggestions
// @route   Get /api/followhandler/suggestions
// @access  Private
exports.getFollowSuggestions = asyncHandler(async (req, res, next) => {
	let query;
	const loggedInUser = req.user;

	query = User.find({
		followers: { $nin: [loggedInUser._id] },
		_id: { $ne: loggedInUser._id },
	});

	const suggestions = await query;
	const count = suggestions.length;

	res.status(200).json({ success: true, count, data: suggestions });
});
