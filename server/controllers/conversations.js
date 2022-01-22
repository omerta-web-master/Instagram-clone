const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// @desc    Get conversations of specific user
// @route   Get /api/conversations/me
// @access  Private
exports.getConversationsOfLoggedInUser = asyncHandler(async (req, res, nex) => {
	const loggedInUser = req.user;

	const conversations = await Conversation.find({
		members: { $in: [loggedInUser] },
	}).populate("members", "avatar username firstName lastName", "User");

	res.status(200).json({ success: true, data: conversations });
});

// @desc    Create conversation
// @route   POST /api/conversations
// @access  Private
exports.createConversation = asyncHandler(async (req, res, next) => {
	const senderId = req.user._id.toString();
	const receiverId = req.body.receiver;

	// Check to see if a conversation already exists
	const existentConversation = await Conversation.findOne({
		members: { $all: [senderId, receiverId] },
	});
	if (existentConversation) {
		return res.status(200).json({ success: true, data: existentConversation });
	}

	const conversation = await Conversation.create({
		members: [senderId, receiverId],
	});
	res.status(201).json({ success: true, data: conversation });
});
