const mongoose = require("mongoose");
const User = require("./User");

const CommentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "User",
	},
	body: {
		type: String,
		required: true,
	},
});

const PostSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "User",
		},
		description: {
			type: String,
		},
		image: {
			type: Object,
			required: true,
		},
		likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		comments: {
			type: [CommentSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

PostSchema.pre("save", async function (next) {
	const user = await User.findById(this.user);
	user.posts.push(this._id);
	user.save();
	next();
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
