const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "Please add first name"],
	},
	lastName: {
		type: String,
		required: [true, "Please add last name"],
	},
	username: {
		type: String,
		required: [true, "Please add username"],
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Please add an email"],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please enter valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please add password"],
	},
	isAdmin: {
		type: Boolean,
		default: false,
		enum: [false],
	},
	avatar: {
		type: String,
		default: "default-avatar-123456789.png",
	},
	posts: [
		{
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "Post",
		},
	],
	followers: [
		{
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "User",
		},
	],
	following: [
		{
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: "User",
		},
	],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
