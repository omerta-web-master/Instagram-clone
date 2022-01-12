const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

// @desc    Add Message
// @route   Post /api/messages
// @access  Private
exports.addMessage = asyncHandler(async (req, res) => {
	const senderId = req.user._id;

	const message = await Message.create({ ...req.body, sender: senderId });

	res.status(200).json({ success: true, data: message });
});

// @desc    Get conversation messages
// @route   Get /api/messages/:conversation
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
	const messages = await Message.find({
		conversation: req.params.conversation,
	});

	res.status(200).json({ success: true, data: messages });
});
