const mongoose = require("mongoose");
const User = require("./User");

const ConversationSchema = new mongoose.Schema({
	members: [
		{
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "User",
		},
	],
});

module.exports = mongoose.model("Conversation", ConversationSchema);
