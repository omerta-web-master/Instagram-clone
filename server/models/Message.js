const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		conversation: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "Conversation",
		},
		sender: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "User",
		},
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
