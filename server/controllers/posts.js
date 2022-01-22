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
		let query = Post.find({ user: userId });
		query = populateQuery(query);
		posts = await query;
	} else {
		let query = Post.find({});
		query = populateQuery(query);
		query = query.sort({ createdAt: -1 });
		posts = await query;
	}

	res.status(200).json({ success: true, data: posts });
});

// @desc    Give Like
// @route   PUT /api/posts/:id/like
// @access  Private
exports.giveLike = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	const loggedInUser = req.user;
	if (!post) {
		res.status(404);
		throw new Error("No post found");
	}

	// Check to see if user gived a like already
	if (post.likes.includes(loggedInUser._id)) {
		res.status(400);
		throw new Error("You liked it already");
	}

	let query = Post.findByIdAndUpdate(
		post._id,
		{ $push: { likes: loggedInUser._id } },
		{
			new: true,
			runValidators: true,
		}
	);
	query = populateQuery(query);
	const updatedPost = await query;

	res.status(200).json({ success: true, data: updatedPost });
});

// @desc    Remove Like
// @route   DELETE /api/posts/:id/like
// @access  Private
exports.removeLike = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	const loggedInUser = req.user;
	if (!post) {
		res.status(404);
		throw new Error("No post found");
	}

	// Check to see if user gived a like
	if (!post.likes.includes(loggedInUser._id)) {
		res.status(400);
		throw new Error("You need to like it first");
	}

	let query = Post.findByIdAndUpdate(
		post._id,
		{ $pull: { likes: loggedInUser._id } },
		{
			new: true,
			runValidators: true,
		}
	);
	query = populateQuery(query);
	const updatedPost = await query;

	res.status(200).json({ success: true, data: updatedPost });
});

// @desc    Add comment
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
	const loggedInUser = req.user;
	const body = req.body.comment;
	const comment = { user: loggedInUser._id, body };

	let query = Post.findByIdAndUpdate(
		req.params.id,
		{
			$push: { comments: comment },
		},
		{
			new: true,
			runValidators: true,
		}
	);

	query = populateQuery(query);
	const post = await query;

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	res.status(200).json({ success: true, data: post });
});

// @desc    Remove comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.removeComment = asyncHandler(async (req, res) => {
	const loggedInUser = req.user;
	const postId = req.params.id;
	const commentId = req.params.commentId;
	let query = Post.findByIdAndUpdate(
		postId,
		{
			$pull: { comments: { _id: commentId } },
		},
		{
			new: true,
			runValidators: true,
		}
	);
	query = populateQuery(query);

	const post = await query;

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	res.status(200).json({ success: true, data: post });
});

function populateQuery(query) {
	return query.populate("user", "username avatar firstName lastName").populate({
		path: "comments",
		populate: {
			path: "user",
			model: "User",
			select: "avatar username",
		},
	});
}
