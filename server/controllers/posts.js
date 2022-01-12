const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

// @desc    Create post
// @route   POST /api/auth/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
	const image = req.file.filename;
	const post = {
		...JSON.parse(req.body.postData),
		image,
	};

	const createdPost = await Post.create(post);

	res.status(201).json({ success: true, data: createdPost });
});

// @desc    Get posts (all posts or only the posts of a specific user with user=userId as query param)
// @route   GET /api/posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
	let posts;
	if (req.query.user) {
		const userId = req.query.user;
		posts = await Post.find({ user: userId }).populate(
			"user",
			"username avatar firstName lastName"
		);
	} else {
		posts = await Post.find({})
			.populate("user", "username avatar firstName lastName")
			.sort({ createdAt: -1 });
	}

	res.status(200).json({ success: true, data: posts });
});
